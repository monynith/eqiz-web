<template>
  <ion-page>
    <ion-content>
      <div class="container">
        <NavBar :action="action" /> 
        <MainContent :title="title[action]">
            <Home v-if="action == 'home'" />     
            <App v-if="action == 'apps'" /> 
            <Order v-if="action == 'orders'" /> 
        </MainContent>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import NavBar from './components/NavBar.vue';
import MainContent from './components/Content.vue';
import Home from './components/Home.vue';
import App from './components/App.vue';
import Order from './components/Order.vue';

let action = 'home';
const title: Record<string, string> = { 
  'home': "Dashboard",
  'orders': "Orders",
  'apps': "App Lists",
  'content': "Content Management",
  'reports': "Reports"
}

// check path
const path = window.location.pathname.slice(1);;
action = path;

</script>

<style scoped>
</style>
