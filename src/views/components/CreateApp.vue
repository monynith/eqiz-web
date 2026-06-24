<template>
    <input type="file" id="imagePicker" accept="image/*" style="display: none;" ref="fileInputRef" @change="onFileSelected">
    <div class="block">        
        <div id="container" @touchmove.stop>
            <p id="title">Create New App</p>
            <div id="img-pick" @click="triggerImagePicker">
                <ion-icon :icon="addOutline"></ion-icon>
            </div>
            <p id="img-label" @click="triggerImagePicker">App Icon</p>
            <ion-list id="input-list">
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" :clear-on-edit="true" placeholder="Enter app ID">
                        <div slot="label" class="my-custom-label"># App ID</div>
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" :clear-on-edit="true" placeholder="Enter app name">
                        <div slot="label" class="my-custom-label">App Name</div>
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" :clear-on-edit="true" placeholder="Enter app price">
                        <div slot="label" class="my-custom-label">Price ($)</div>
                    </ion-input>
                </ion-item>
            </ion-list>
            <div class="text-right button-wrapper">
                <p id="button">Create Now</p>
                <ion-icon :icon="arrowForward"></ion-icon>
            </div>            
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    IonIcon
} from '@ionic/vue';
import { addOutline, arrowForward } from 'ionicons/icons';
import { ref } from 'vue';

const fileInputRef = ref(null);

const onFileSelected = (event: any) => {
  const file = event.target.files[0];
  if (!file) return;
}

const triggerImagePicker = () => {
  (fileInputRef as any).value.click();
}
</script>

<style scoped>
@import url(../../theme/createApp.css);
</style>