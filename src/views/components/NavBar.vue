<template>
  <div class="nav">
    <div id="logo">
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
    <div class="menu" :class="{'active' : action == 'reports'}" @click="navi('reports')">
        <ion-icon :icon="flagOutline"></ion-icon> 
        <span>Reports</span>
    </div>   
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { albumsOutline, analyticsOutline, flagOutline, layersOutline, readerOutline } from 'ionicons/icons';

const props = defineProps({
  action: String
})

const navi = (action: string)=> {
    window.location.href = '/' + action;
}

</script>