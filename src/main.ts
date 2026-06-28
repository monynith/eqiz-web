import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

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

router.isReady().then(() => {
  checkIpAccess(app);  
});

const checkIpAccess = async (app: any)=> {
  try {
    const WHITELIST = import.meta.env.VITE_WHITELIST_IP;
    // 1. Make the fetch request
    const response = await fetch('https://api.ipify.org?format=json');
    
    // 2. Check if the network response was successful (status 200-299)
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    // 3. Parse the JSON data
    const data = await response.json();
    const userIp = data.ip;
    app.mount('#app');
    // 4. Validate against the whitelist
    if (!WHITELIST.includes(userIp)) {
      // Redirect to an unauthorized view
      router.push('/access-denied');
      return;
    }    
  } catch (error) {
    console.error("Failed to verify IP address", error);
  }
}
