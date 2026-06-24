<template>
    <input type="file" id="imagePicker" accept="image/*" style="display: none;" ref="fileInputRef"
        @change="onFileSelected">
    <div class="block">
        <div id="container" @touchmove.stop>
            <p id="title">Create New App</p>
            <div id="img-pick" @click="triggerImagePicker">
                <ion-icon :icon="addOutline"></ion-icon>
                <img :src="logo" v-if="logo != ''" />
            </div>
            <p id="img-label" @click="triggerImagePicker">{{ logo ? 'Change' : 'App Icon' }}</p>
            <ion-list id="input-list">
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" placeholder="Enter app ID" v-model="appID">
                        <div slot="label" class="my-custom-label"># App ID</div>
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" placeholder="Enter EqizID" v-model="eqizID">
                        <div slot="label" class="my-custom-label"># Eqiz ID</div>
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" placeholder="Enter app name" v-model="appName">
                        <div slot="label" class="my-custom-label">App Name</div>
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" placeholder="Enter app price" v-model="price">
                        <div slot="label" class="my-custom-label">Price ($)</div>
                    </ion-input>
                </ion-item>
            </ion-list>
            <div class="text-right button-wrapper">
                <p id="button" @click="create">{{ loading == true ? 'Creating...' : 'Create Now' }}</p>
                <ion-icon :icon="arrowForward" @click="create" v-if="!loading"></ion-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    modalController,
    toastController
} from '@ionic/vue';
import { addOutline, arrowForward } from 'ionicons/icons';
import { ref } from 'vue';
import { createClient } from "@libsql/client";

const fileInputRef = ref(null);
const logo = ref('');
const appID = ref();
const eqizID = ref();
const appName = ref();
const price = ref();
const loading = ref(false);


const onFileSelected = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file) {
        // Initialize the FileReader
        const reader = new FileReader();

        // Read the file as a Data URL (which is Base64 encoded)
        reader.readAsDataURL(file);

        // Fire this event once the file reading completes
        reader.onload = () => {
            // This contains the full Data URL: "data:image/png;base64,iVBOR..."
            logo.value = `${reader.result}`;
        };

        // Catch and display any reading errors
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };
    }
}

const triggerImagePicker = () => {
    (fileInputRef as any).value.click();
}

const create = async ()=> {
    
    if(!appID.value || logo.value == '' || !eqizID.value || !appName.value || !price.value) {
        const toast = await toastController.create({
            message: 'Some fields are required.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
        return;
    }

    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const turso = createClient({
        url: dbUrl,
        authToken: dbToken,
    });  
    loading.value = true;
    try {
        await turso.execute({
            sql: `
                INSERT INTO apps 
                VALUES('${appID.value}', '${eqizID.value}', '${appName.value}', '${price.value}', 'active', '${logo.value}')
            `
        });
        await modalController.dismiss({
            dismissed: true,
        });
        const toast = await toastController.create({
            message: 'Successfully created.',
            duration: 2000,
            position: 'bottom',
            color: "secondary"
        });

        await toast.present();
    } catch(e){
        loading.value = false;
        const toast = await toastController.create({
            message: 'Something went wrong.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
    }  

}

// const init = async () => {
//     const dbUrl = import.meta.env.VITE_DB_URL;
//     const dbToken = import.meta.env.VITE_DB_TOKEN;

//     const client = createClient({
//     url: dbUrl,
//     authToken: dbToken,
//     });    
//     const result = await client.execute({
//         sql: "SELECT * FROM apps WHERE id = ?",
//         args: [1],
//     });

//     console.log(result.rows);
// }

// init();

</script>

<style scoped>
@import url(../../theme/createApp.css);
</style>