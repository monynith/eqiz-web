<template>
  <div class="nav" :class="{ 'collapsed': collapsed }">
    <div id="logo" @click="navi('home')" style="cursor: pointer;">
        <img src="../../assets/logo.png" />
        <span>Eqiz Studio</span>
    </div>    
    <div class="menu" :class="{'active' : action == 'home'}" @click="navi('home')">
        <ion-icon :icon="albumsOutline"></ion-icon> 
        <span>Dashboard</span>
    </div>  
    <div class="menu" :class="{'active' : action == 'orders'}" @click="navi('orders')">
        <ion-icon :icon="analyticsOutline"></ion-icon> 
        <span>Orders</span>
    </div>
    <div class="menu" :class="{'active' : action == 'apps'}" @click="navi('apps')">
        <ion-icon :icon="layersOutline"></ion-icon> 
        <span>App Lists</span>
    </div> 
    <div class="menu" :class="{'active' : action == 'contents'}" @click="navi('contents')">
        <ion-icon :icon="readerOutline"></ion-icon> 
        <span>Contents</span>
    </div> 
    <div class="menu" :class="{'active' : action == 'notes'}" @click="navi('notes')">
        <ion-icon :icon="documentTextOutline"></ion-icon> 
        <span>Notes</span>
    </div> 
    <div class="menu" :class="{'active' : action == 'reports'}" @click="navi('reports')">
        <ion-icon :icon="flagOutline"></ion-icon> 
        <span>Reports</span>
    </div>
    <div class="menu theme-toggle" @click="toggleDark" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <ion-icon :icon="isDark ? sunnyOutline : moonOutline"></ion-icon>
        <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
    </div>
    <div class="collapse-toggle" @click="collapsed = !collapsed" :title="collapsed ? 'Expand' : 'Collapse'">
        <ion-icon :icon="collapsed ? chevronForwardOutline : chevronBackOutline"></ion-icon>
        <span>{{ collapsed ? 'Expand' : 'Collapse' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, useIonRouter } from '@ionic/vue';
import { albumsOutline, analyticsOutline, chevronBackOutline, chevronForwardOutline, documentTextOutline, flagOutline, layersOutline, readerOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { isDark, toggleDark } from '../../theme/theme';
import { ref } from 'vue';

const props = defineProps({
  action: String
})

const ionRouter = useIonRouter();
const collapsed = ref(false)

const navi = (action: string)=> {
    ionRouter.navigate('/' + action, 'none');
}

</script>