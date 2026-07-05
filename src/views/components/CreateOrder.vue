<template>
    <div class="block">
        <div id="container" @touchmove.stop>
            <p id="title">{{ isEdit ? 'Edit Order' : 'Add Order' }}</p>            
            <ion-list id="input-list">
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" placeholder="Enter date (MMMM DD, YYYY)" v-model="date">
                        <div slot="label" class="my-custom-label">Date</div>
                    </ion-input>
                </ion-item>
                <div id="chip-wrapper">
                    <ion-chip @click="setDate('today')">Today</ion-chip>  
                    <ion-chip  @click="setDate('yesterday')">Yesterday</ion-chip>           
                </div>   
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" placeholder="Enter App ID" @ion-input="enterAppID" v-model="appID">
                        <div slot="label" class="my-custom-label"># App ID</div>
                    </ion-input>                    
                </ion-item>    
                <div id="chip-wrapper">
                    <ion-chip v-for="app in apps" @click="setAppID(app['app_id'])">{{ app['app_id'] }}</ion-chip>           
                </div>                 
                <ion-item>
                    <ion-input mode="ios" type="number" inputmode="decimal" step="0.01" min="0" label-placement="stacked" placeholder="Enter amount" v-model="amount">
                        <div slot="label" class="my-custom-label">Amount ($)</div>
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-input mode="ios" label-placement="stacked" placeholder="Enter 3-letter Code" v-model="country">
                        <div slot="label" class="my-custom-label">Country</div>
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-select label="Store" class="store-select" label-placement="stacked" mode="md" v-model="store">
                        <ion-select-option value="App Store">App Store</ion-select-option>
                        <ion-select-option value="Play Store">Play Store</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>
            <div class="text-right button-wrapper" v-if="isEdit == true">
                <p id="button" @click="create">{{ loading == true ? 'Editing...' : 'Edit' }}</p>
                <ion-icon :icon="arrowForward" @click="create" v-if="!loading"></ion-icon>
            </div>
            <div class="text-right button-wrapper" v-if="!isEdit">
                <p id="button" @click="create">{{ loading == true ? 'Adding...' : 'Add Now' }}</p>
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
    IonSelect,
    IonSelectOption,
    IonChip,
    toastController,
    modalController
} from '@ionic/vue';
import { addOutline, arrowForward } from 'ionicons/icons';
import { ref } from 'vue';
import { createClient } from "@libsql/client";
import getCountryISO2 from 'country-iso-3-to-2';

const loading = ref(false);
const apps = ref([]);
const store = ref("Play Store");
const appID = ref("");
const date = ref("");
const country = ref("");
const amount = ref("");

const props = defineProps({
  apps: Array,
  order: Object,
  isEdit: Boolean
})

const shuffleArray = (array: any) => {  
  const shuffled = [...array]; 
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));    
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

if(props.apps){    
    (apps.value as any) = shuffleArray(props.apps).slice(0, 5).sort((a, b) => a.app_id.localeCompare(b.app_id));
}

if(props.order) {

    amount.value = props.order['pricing'];
    date.value = props.order['date'];
    country.value = props.order['country'];
    store.value = props.order['store']

    appID.value = props.order['app_id'];
    const search = appID.value;
    const filter = props.apps?.filter((v: any) => v['app_id'].indexOf(search.toUpperCase()) > -1);
    (apps.value as any) = filter?.slice(0, 5).sort((a: any, b: any) => a.app_id.localeCompare(b.app_id));
}

const enterAppID = (event: any)=> {    
    if(event.detail.value){
        const search = event.detail.value;
        const filter = props.apps?.filter((v: any) => v['app_id'].indexOf(search.toUpperCase()) > -1);
        (apps.value as any) = filter?.slice(0, 5).sort((a: any, b: any) => a.app_id.localeCompare(b.app_id));
    }
}

const setAppID = (id: string) => {
    appID.value = id;
}

const validateDate = (userInput: string) => {
  // 1. Regex to check the structure: [Month Word] [1-2 Digits], [4 Digits]
  const regex = /^[A-Z][a-z]+\s\d{1,2},\s\d{4}$/;
  if (!regex.test(userInput)) return false;

  // 2. Parse it with native Date to check calendar validity
  const timestamp = Date.parse(userInput);
  if (isNaN(timestamp)) return false;

  // 3. Double-check that JavaScript didn't auto-correct a bad date 
  // (e.g., JS converts "June 31" automatically to "July 1")
  const dateObj = new Date(userInput);
  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
  
  const expectedMonth = months[dateObj.getMonth()];
  
  // If the parsed month name doesn't start with the user's entered month, it auto-corrected
  return userInput.startsWith(expectedMonth);
}

const getCountry = (countryCode: string)=> {
    return getCountryISO2(countryCode) || '';
}

const create = async ()=> {
    if(!date.value || store.value == '' || !amount.value || !appID.value || !country.value) {
        const toast = await toastController.create({
            message: 'Some fields are required.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
        return;
    }

    // validate date format
    if(validateDate(date.value) == false){
        const toast = await toastController.create({
            message: 'Date format is incorrect.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
        return;
    }
    
    // validate app ID
    const appFound = props.apps?.filter((v: any) => v['app_id'] == appID.value) || [];
    if(appFound.length <= 0){
        const toast = await toastController.create({
            message: 'App ID - not found.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
        return;
    }

    // validate country code
    if(country.value.length != 3){
        const toast = await toastController.create({
            message: 'Country must be a 3-letter ISO.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
        return;
    }

    // validate if country code is not correct
    if(getCountry(country.value) == ''){
        const toast = await toastController.create({
            message: 'Country must be a 3-letter ISO.',
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
        if(props.isEdit == true) {
            await turso.execute({
                sql: `
                    UPDATE orders 
                    SET app_id='${appID.value}', date='${date.value}', store='${store.value}', pricing='${amount.value}', country='${country.value}'
                    where id='${props.order ? props.order['id'] : ''}'
                `
            });
            await modalController.dismiss({
                dismissed: true,
            });
            const toast = await toastController.create({
                message: 'Successfully editted.',
                duration: 2000,
                position: 'bottom',
                color: "secondary"
            });

            await toast.present();
        } else {        
            await turso.execute({
                sql: `
                    INSERT INTO orders 
                    VALUES(null, '${date.value}', '${appID.value}', '${store.value}', '${amount.value}', '${country.value}', 'active')
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
        }        
    } catch(e){
        console.log(e);
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

const getYesterday = ()=> {
    const options: any = {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayDate = new Intl.DateTimeFormat('en-US', options).format(yesterday);
    return yesterdayDate;
}

const setDate = (type: string)=> {
    const options: any = {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    if(type == 'today'){        
        date.value = new Intl.DateTimeFormat('en-US', options).format(new Date());
    } else {
        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);  
        date.value = new Intl.DateTimeFormat('en-US', options).format(yesterday); 
    }
}

</script>

<style scoped>
@import url(../../theme/createOrder.css);
</style>