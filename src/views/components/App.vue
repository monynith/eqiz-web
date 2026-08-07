<template>
    <Skeleton v-if="loading == true"/>
    <div v-if="loading == false">
        <div id="create-btn-wrapper">
            <p id="create-btn" @click="createApp">Create New App</p>
        </div>
        <ion-searchbar
            class="blend-searchbar"
            mode="md"
            v-model="searchQuery"
            placeholder="Search by name or ID"
            :debounce="500"
            @ionInput="onSearch"
        ></ion-searchbar>
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
import { IonIcon, IonSearchbar, modalController } from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons';
import Modal from '../components/CreateApp.vue';
import { createClient } from '@libsql/client';
import { ref } from 'vue';
import Skeleton from './Skeleton.vue';

const loading = ref(true);
const apps = ref([]);
const searchQuery = ref("");

const createApp = async () => {
    const modal = await modalController.create({
        component: Modal,
        initialBreakpoint: 1,
        breakpoints: [0, 1],
        mode: "md"
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data && data.dismissed == true){
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

    const query = searchQuery.value.trim();
    const sql = query
        ? "SELECT * FROM apps WHERE status = 'active' AND (name LIKE :q OR app_id LIKE :q) ORDER BY name LIMIT 150"
        : "SELECT * FROM apps WHERE status = 'active' ORDER BY name LIMIT 150";
    const args: any = query ? { q: `%${query}%` } : {};

    const result = await client.execute({ sql, args });

    loading.value = false;
    (apps.value as any) = result.rows;
}

const onSearch = (ev: any) => {
    searchQuery.value = ev?.target?.value ?? "";
    loading.value = true;
    init();
}

init();

</script>

<style scoped>
@import url(../../theme/app.css);

.blend-searchbar {
    margin: 16px 0;
    padding: 0;
    --background: #ededed;
    --box-shadow: none;
    --border-radius: 10px;
    --color: black;
    --placeholder-color: #9c9c9c;
    --icon-color: #9c9c9c;
    --clear-button-color: #9c9c9c;
    --height: 35px;
    --placeholder-font-size: 0.9rem;
    /* border: 1px solid #d9d4d4; */
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
    margin-top: 20px;    
}

:global(.dark) .blend-searchbar {
    --background: #1e1e1e;
    --color: #ffffff;
    --placeholder-color: #aaaaaa;
    --icon-color: #aaaaaa;
    --clear-button-color: #aaaaaa;
    border-color: #3a3a3a;
}

.blend-searchbar :deep(.searchbar-input) {
    padding-left: 50px !important;
    padding-top: 8px !important;
    padding-bottom: 10px !important;
    font-size: 0.9rem !important;
}

.blend-searchbar :deep(.searchbar-search-icon) {
    margin-left: 0px;
    color: #888;
    width: 18px;
    height: 18px;
    margin-top: 3px;
}
</style>