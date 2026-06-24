<template>
    <p id="create-btn" @click="createApp">Create New App</p>
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
            <tr>
                <td class="date-cell">
                    <span class="main-text">6/24/2026</span>
                </td>
                <td>
                    <div class="app-icon">AIGP</div>
                </td>
                <td class="product-cell">AIGP Exam Prep 2026: with AI</td>                
                <td class="total-cell text-right">KRW 6,900</td>                
                <td class="navi-cell text-right">
                    <ion-icon :icon="arrowForwardOutline"></ion-icon> 
                </td>
            </tr>
            <tr>
                <td class="date-cell">
                    <span class="main-text">6/24/2026</span>
                </td>
                <td>
                    <div class="app-icon">AIGP</div>
                </td>
                <td class="product-cell">AIGP Exam Prep 2026: with AI</td>                
                <td class="total-cell text-right">KRW 6,900</td>                
                <td class="navi-cell text-right">
                    <ion-icon :icon="arrowForwardOutline"></ion-icon> 
                </td>
            </tr>
        </tbody>
    </table>
    </div>    
</template>

<script setup lang="ts">
import { IonIcon, modalController } from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons';
import Modal from '../components/CreateApp.vue';

const createApp = async ()=> {
    const modal = await modalController.create({
      component: Modal,
      initialBreakpoint: 1,
      breakpoints: [0, 1]
    });

    modal.present();

    // const { data, role } = await modal.onWillDismiss();
}

</script>

<style scoped>
@import url(../../theme/app.css);
</style>