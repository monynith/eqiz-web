<template>
    <Skeleton v-if="loading == true"/>
    <div v-if="loading == false">
        <ion-datetime-button datetime="datetime" style="display: none;"></ion-datetime-button>

        <ion-modal ref="monthModal" :keep-contents-mounted="true">
            <ion-datetime id="datetime" presentation="month-year" :show-default-buttons="true" mode="ios" @ion-change="changeMonth"></ion-datetime>
        </ion-modal>

        <div class="header-wrapper">
            <div id="total-wrapper">
                <p id="total-label">$<span id="amount">{{ totalAmount ? Number(totalAmount).toFixed(2) : 0 }}</span> processed &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; </p> 
                <div id="filter" @click="openMonth">
                    <span>{{monthYear}}</span> <ion-icon :icon="chevronDownOutline"></ion-icon> 
                </div>
            </div>            
            <p id="create-btn" @click="addOrder">Add Order</p>
        </div>        
        <div class="table-container">
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>App</th>
                        <th>Name</th>                
                        <th>Store</th>
                        <th>Country</th>
                        <th class="text-right">Amount</th>                    
                        <th></th>
                    </tr>
                </thead>
                <tbody class="t-body">
                    <tr v-for="order in orders" @click="editOrder(order)">
                        <td class="date-cell">
                            <span class="main-text">{{ order['date'] }}</span>
                        </td>
                        <td class="app-logo">
                            <img  v-if="order['app_id'] !='ID'" :src="getLogo(order['app_id'])" />
                        </td>
                        <td class="product-cell">{{  getName(order['app_id'])  }}</td>                
                        <td class="total-cell">{{ order['store'] }}</td>  
                        <td class="total-cell">{{ getCountry(order['country']) }}</td>  
                        <td class="total-cell text-right">${{ order['pricing'] }}</td>                
                        <td class="navi-cell text-right">
                            <ion-icon :icon="arrowForwardOutline"></ion-icon> 
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>  
        <div id="pagination" v-if="Math.ceil(PAGE_SIZE / LIMIT) > 0">
            <ion-icon :icon="chevronBackOutline" @click="movePage('prev')" :style="{ opacity: ((OFFSET / LIMIT) + 1) <= 1 ? 0.3 : 0.8, cursor: ((OFFSET / LIMIT) + 1) > 1 ? 'pointer' : '' }"></ion-icon> 
            <span>Page <b>{{ (OFFSET / LIMIT) + 1 }}</b> of {{ Math.ceil(PAGE_SIZE / LIMIT) }}</span>
            <ion-icon :icon="chevronForwardOutline" @click="movePage('next')" :style="{ opacity: ((OFFSET / LIMIT) + 1) == Math.ceil(PAGE_SIZE / LIMIT) ? 0.3 : 0.8, cursor: ((OFFSET / LIMIT) + 1) == Math.ceil(PAGE_SIZE / LIMIT) ? '' : 'pointer' }"></ion-icon> 
        </div>
    </div>  
</template>

<script setup lang="ts">
import { IonIcon, IonDatetimeButton, IonDatetime, IonModal, modalController } from '@ionic/vue';
import { createClient } from '@libsql/client';
import { arrowForwardOutline, chevronBackOutline, chevronDownOutline, chevronForwardOutline } from 'ionicons/icons';
import Skeleton from './Skeleton.vue';
import { ref } from 'vue';
import getCountryISO2 from 'country-iso-3-to-2';
import Modal from '../components/CreateOrder.vue';

const loading = ref(true);
const orders = ref([]);
const apps = ref([]);
const monthModal = ref();
const totalAmount = ref("");
const monthYear = ref("");
let LIMIT = 20;
let OFFSET = 0;
let PAGE_SIZE = 0;

const changeMonth = (event: any)=> {    
    loading.value = true;
    // new Date(event.detail.value) and new Date()
    // console.log(checkSameMonthAndYear(event.detail.value));
    OFFSET = 0;
    if(!event.detail.value) {
        getOrders(new Date())
    } else {
        getOrders(new Date(event.detail.value))
    }    
}

const addOrder = async ()=> {
    const modal = await modalController.create({
        component: Modal,
        initialBreakpoint: 1,
        breakpoints: [0, 1],
        mode: "md",
        componentProps: {
            apps: apps.value
        }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data && data.dismissed == true){
        loading.value = true;
        getOrders(new Date());
    }
}

const editOrder = async (order: any)=> {
    const modal = await modalController.create({
        component: Modal,
        initialBreakpoint: 1,
        breakpoints: [0, 1],
        mode: "md",
        componentProps: {
            order,
            isEdit: true,
            apps: apps.value
        }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data.dismissed == true){
        loading.value = true;
        getOrders(new Date());
    }
}

const getLogo = (appId: string)=> {    
    const app = apps.value.find(v=> v['app_id'] == appId);
    return app ? app['logo'] : 'N/A';
}

const getName = (appId: string)=> {
    const app = apps.value.find(v=> v['app_id'] == appId);
    return app ? app['name'] : 'N/A';
}

const getCountry = (countryCode: string)=> {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const countryName = regionNames.of(getCountryISO2(countryCode)); 
    return countryName || '';
}

const openMonth = ()=> {
    monthModal.value.$el.present();
}

const movePage = async (type: string) => {    
    if(type == 'next' && ((OFFSET / LIMIT) + 1) == Math.ceil(PAGE_SIZE / LIMIT)){
        return;
    }
    if(type == 'prev' && ((OFFSET / LIMIT) + 1) <= 1) {
        return;
    }
    if(type == 'next') {
        OFFSET = OFFSET + LIMIT;
    } else {
        OFFSET = OFFSET - LIMIT;
    }
    loading.value = true;
    const month = monthYear.value.split(' ')[0];
    const year = monthYear.value.split(' ')[1];

    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });
    const result = await client.execute({
        sql: `
            SELECT * FROM orders 
            WHERE date LIKE '%${month}%${year}' 
            AND status = 'active' 
            ORDER BY id DESC LIMIT ${LIMIT} OFFSET ${OFFSET}
        `
    });    
    (orders.value as any) = result.rows;
    loading.value = false;
}

const getOrders = async (date: any) => {

    // get current month
    // const now = new Date();
    // console.log(date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);    
    const year = date.getFullYear();

    monthYear.value = `${month} ${year}`

    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });
    const result = await client.batch([{
        sql: "SELECT * FROM apps where status = 'active' ORDER BY name LIMIT 150"
    }, {
        sql: `
            SELECT * FROM orders 
            WHERE date LIKE '%${month}%${year}' 
            AND status = 'active' 
            ORDER BY id DESC LIMIT ${LIMIT} OFFSET ${OFFSET}
        `
    }, {
        sql: `
            SELECT SUM(pricing) as total FROM orders 
            WHERE date LIKE '%${month}%${year}' 
            AND status = 'active'             
        `
    }, {
        sql: `
            SELECT count(id) as page_size FROM orders 
            WHERE date LIKE '%${month}%${year}' 
            AND status = 'active'  
        `
    }]);
    (totalAmount.value as any) = result[2].rows['0']['total'];
    (apps.value as any) = result[0].rows;
    (orders.value as any) = result[1].rows;
    (PAGE_SIZE as any) = result[3].rows[0]['page_size'];
    loading.value = false;
}

getOrders(new Date());

</script>

<style scoped>
@import url(../../theme/order.css);
</style>