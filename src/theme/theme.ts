import { ref } from 'vue';

const STORAGE_KEY = 'eqiz-theme-dark';

export const isDark = ref(false);

const apply = () => {
  const root = document.documentElement;
  if (isDark.value) {
    root.classList.add('ion-palette-dark');
  } else {
    root.classList.remove('ion-palette-dark');
  }
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
