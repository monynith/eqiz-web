import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue, toastController } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
// import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/style.css';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

// router.beforeEach(async (to, from, next) => {
//   if (to.path === '/access-denied') {
//     return next();
//   }

//   // 1. Declare variables out here so BOTH try and catch blocks can see them
//   let toast: any = null;
//   let isRequestFinished = false;
//   let toastTimeout: any = null; 

//   try {
//     const WHITELIST = import.meta.env.VITE_WHITELIST_IP;

//     // 2. Assign the timeout here (remove 'const')
//     toastTimeout = setTimeout(async () => {
//       if (!isRequestFinished) {
//         toast = await toastController.create({
//           message: 'Validating...',
//           position: 'middle',
//           color: "secondary"
//         });
//         if (!isRequestFinished) {
//           await toast.present();
//         } else if (toast) {
//           await toast.dismiss();
//         }
//       }
//     }, 1000);

//     const response = await fetch('https://api.ipify.org?format=json');
    
//     isRequestFinished = true;
//     clearTimeout(toastTimeout);

//     if (!response.ok) throw new Error('Network response failed');
    
//     const data = await response.json();
//     const userIp = data.ip;

//     const ipArray = WHITELIST;

//     if (toast) {
//       await toast.dismiss();
//     }

//     if (!ipArray.includes(userIp)) {
//       return next('/access-denied');
//     }

//     next();

//   } catch (error) {
//     console.error("Failed to verify IP address", error);
    
//     isRequestFinished = true;
    
//     // 3. This will now work perfectly because toastTimeout is in scope!
//     if (toastTimeout) {
//       clearTimeout(toastTimeout);
//     }
    
//     if (toast) {
//       await toast.dismiss();
//     }
    
//     next('/access-denied');
//   }
// });

router.isReady().then(() => {
  app.mount('#app');
});

