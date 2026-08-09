import { ref } from 'vue';

const STORAGE_KEY = 'eqiz-theme-dark';

export const isDark = ref(false);

// Force the browser (especially iOS WKWebView) to repaint the page background
// immediately after a theme swap. Without this, the native gray WebView
// backdrop stays visible until the user scrolls or the element loses focus.
const forceRepaint = () => {
  const repaint = () => {
    // Reading offsetHeight forces a synchronous layout/reflow.
    void document.documentElement.offsetHeight;
    document.querySelectorAll('ion-content').forEach((el: any) => {
      const inner = el.shadowRoot?.querySelector('.inner-scroll');
      if (inner) void inner.offsetHeight;
    });
  };
  repaint();
  // A second pass on the next frames helps some devices fully catch up.
  requestAnimationFrame(() => requestAnimationFrame(repaint));
};

const apply = () => {
  const root = document.documentElement;
  if (isDark.value) {
    root.classList.add('ion-palette-dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('ion-palette-dark');
    root.style.colorScheme = 'light';
  }
  forceRepaint();
};

export const initTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null) {
    isDark.value = saved === 'true';
  }
  apply();
};

export const toggleDark = () => {
  isDark.value = !isDark.value;
  localStorage.setItem(STORAGE_KEY, String(isDark.value));
  apply();
  return isDark.value;
};
