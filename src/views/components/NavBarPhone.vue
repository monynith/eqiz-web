<template>
    <div class="nav-phone">
        <div id="logo">
            <img src="../../assets/logo.png" />
            <span>Eqiz Studio</span>
        </div>
        <div class="nav-phone-actions">
            <ion-icon :icon="isDark ? sunnyOutline : moonOutline" @click="toggleDark" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"></ion-icon>
            <ion-icon :icon="menuOutline" @click="menu"></ion-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { menuOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { actionSheetController, IonIcon, useIonRouter } from '@ionic/vue';
import { isDark, toggleDark } from '../../theme/theme';

const ionRouter = useIonRouter();

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
    ionRouter.navigate('/' + page, 'none');
}

</script>

<style scoped>
.nav-phone-actions {
    display: flex;
    align-items: center;
    gap: 18px;
}

.nav-phone-actions ion-icon {
    font-size: 1.35rem;
}
</style>
