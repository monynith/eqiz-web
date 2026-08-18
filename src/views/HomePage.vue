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
            <Notes v-if="action == 'notes'" /> 
        </MainContent>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import MainContent from './components/Content.vue';
import Home from './components/Home.vue';
import App from './components/App.vue';
import Order from './components/Order.vue';
import NavBarPhone from './components/NavBarPhone.vue';
import ContentManagement from './components/ContentManagement.vue';
import Notes from './components/Notes.vue';

const route = useRoute();
const action = ref((route.path.slice(1) || 'home'));

watch(() => route.path, (p) => {
  action.value = p.slice(1) || 'home';
});

const title: Record<string, string> = { 
  'home': "Dashboard",
  'orders': "Orders",
  'apps': "App Lists",
  'contents': "Content Management",
  'notes': "Notes",
  'reports': "Reports"
}
</script>

<style scoped>
</style>
