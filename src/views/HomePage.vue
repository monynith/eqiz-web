<template>
  <ion-page>
    <ion-content>      
      <div class="container">        
        <NavBar :action="action" /> 
        <NavBarPhone />
        <MainContent :title="title[action]">
            <Home v-if="action == 'home'" />     
            <App v-if="action == 'apps'" /> 
            <Order v-if="action == 'orders'" /> 
            <ContentManagement v-if="action == 'contents'" /> 
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
import NavBarPhone from './components/NavBarPhone.vue';
import ContentManagement from './components/ContentManagement.vue';

let action = 'home';
const title: Record<string, string> = { 
  'home': "Dashboard",
  'orders': "Orders",
  'apps': "App Lists",
  'contents': "Content Management",
  'reports': "Reports"
}

// check path
const path = window.location.pathname.slice(1);;
action = path;

</script>

<style scoped>
</style>
