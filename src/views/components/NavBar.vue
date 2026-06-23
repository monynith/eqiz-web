<template>
  <div class="nav">
    <div id="logo">
        <img src="../../assets/logo.png" />
        <span>Eqiz App</span>
    </div>    
    <div class="menu" :class="{'active' : action == 'home'}">
        <ion-icon :icon="albumsOutline"></ion-icon> 
        <span>Dashboard</span>
    </div>  
    <div class="menu">
        <ion-icon :icon="readerOutline"></ion-icon> 
        <span>Orders</span>
    </div>
    <div class="menu">
        <ion-icon :icon="layersOutline"></ion-icon> 
        <span>App Lists</span>
    </div> 
    <div class="menu">
        <ion-icon :icon="readerOutline"></ion-icon> 
        <span>Questions</span>
    </div> 
    <div class="menu">
        <ion-icon :icon="flagOutline"></ion-icon> 
        <span>Reports</span>
    </div>   
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { albumsOutline, flagOutline, layersOutline, readerOutline } from 'ionicons/icons';

const props = defineProps({
  action: String
})

</script>