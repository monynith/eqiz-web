<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container">
        <NavBar action="home" /> 
        <MainContent title="Dashboard">
          <div id="indicator-wrapper">
            <div class="indicator">
              <p class="key">Today App Sale (#)</p>
              <p class="value"><span>168</span></p>
            </div>
            <div class="indicator">
              <p class="key">Today Revenue ($)</p>
              <p class="value">USD <span>168</span></p>
            </div>
            <div class="indicator">
              <p class="key">App Store vs Play Store</p>
              <p class="value">USD <span>168</span> / USD <span>100</span></p>
            </div>
          </div>          
        </MainContent>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import NavBar from './components/NavBar.vue';
import MainContent from './components/Content.vue';
</script>

<style scoped>
@import url(../theme/home.css);
</style>
