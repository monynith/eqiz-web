<template>
    <div class="nav-phone">
        <div id="logo">
            <img src="../../assets/logo.png" />
            <span>Eqiz Studio</span>
        </div>   
        <ion-icon :icon="menuOutline" @click="menu"></ion-icon> 
    </div>
</template>

<script setup lang="ts">
import { menuOutline } from 'ionicons/icons';
import { actionSheetController, IonIcon } from '@ionic/vue';

const menu = async ()=> {
    const actionSheet = await actionSheetController.create({
        header: 'Menu',
        buttons: [{
            text: 'Dashboard',
            handler: ()=> {
                movePage("home")
            }
        }, {
            text: 'Orders',
            handler: ()=> {
                movePage("orders")
            }
        }, {
            text: 'Apps',
            handler: ()=> {
                movePage("apps")
            }
        }, {
            text: 'Content',
            handler: ()=> {
                movePage("contents")
            }
        }, {
            text: 'Reports',
            handler: ()=> {
                // movePage("orders")
            }
        }],
        mode: 'md'
    });
    await actionSheet.present();
}

const movePage = (page: string)=> {
    setTimeout(()=> {
        window.location.href = `/${page}`
    }, 150)    
}

</script>