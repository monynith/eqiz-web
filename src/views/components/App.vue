<template>
    <Skeleton v-if="loading == true"/>
    <div v-if="loading == false">
        <div id="create-btn-wrapper">
            <p id="create-btn" @click="createApp">Create New App</p>
        </div>        
        <div class="table-container">
            <table class="order-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>App</th>
                        <th>Name</th>
                        <th class="text-right">Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="t-body">
                    <tr v-for="app in apps" @click="editApp(app)">
                        <td class="date-cell">
                            <span class="main-text">{{ app['app_id'] }}</span>
                        </td>
                        <td class="app-logo">
                            <img :src="app['logo']" />
                        </td>
                        <td class="product-cell">{{ app['name'] }}</td>
                        <td class="total-cell text-right">${{ app['price'] }}</td>
                        <td class="navi-cell text-right">
                            <ion-icon :icon="arrowForwardOutline"></ion-icon>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p id="total">Total: {{ apps.length }} apps</p>
    </div>
</template>

<script setup lang="ts">
import { IonIcon, modalController, IonSpinner } from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons';
import Modal from '../components/CreateApp.vue';
import { createClient } from '@libsql/client';
import { ref } from 'vue';
import Skeleton from './Skeleton.vue';

const loading = ref(true);
const apps = ref([]);

const createApp = async () => {
    const modal = await modalController.create({
        component: Modal,
        initialBreakpoint: 1,
        breakpoints: [0, 1],
        mode: "md"
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data.dismissed == true){
        loading.value = true;
        init();
    }
}

const editApp = async (app: any) => {
    const modal = await modalController.create({
        component: Modal,
        initialBreakpoint: 1,
        breakpoints: [0, 1],
        mode: "md",
        componentProps: {
            app,
            isEdit: true
        }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data.dismissed == true){
        loading.value = true;
        init();
    }
}

const init = async () => {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });
    const result = await client.execute({
        sql: "SELECT * FROM apps where status = 'active' ORDER BY name LIMIT 100"
    });

    loading.value = false;
    (apps.value as any) = result.rows;
}

init();

</script>

<style scoped>
@import url(../../theme/app.css);
</style>