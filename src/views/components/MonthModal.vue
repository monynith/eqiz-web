<template>
    <div class="block">
        <div id="container">
            <div id="toolbar">
                <span id="title">Select Month</span>
                <div id="actions">
                    <span id="btn-cancel" @click="cancel">Cancel</span>
                    <span id="btn-apply" @click="confirm">Apply</span>
                </div>
            </div>
            <div class="picker-wrapper">
                <ion-datetime presentation="month" v-model="value" :show-default-buttons="false"></ion-datetime>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonDatetime, modalController } from '@ionic/vue';
import { ref } from 'vue';

const value = ref(new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit' }).format(new Date()));

const cancel = async () => {
    await modalController.dismiss();
};

const confirm = async () => {
    await modalController.dismiss(value.value);
};
</script>

<style scoped>
.block {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: center;
}
#container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--eq-surface, #fff);
    color: var(--eq-text, #000);
}
#toolbar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--eq-border, #ddd);
}
#title {
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
    color: var(--eq-text, #000);
}
#actions {
    display: flex;
    gap: 16px;
}
#btn-cancel,
#btn-apply {
    cursor: pointer;
    color: var(--ion-color-primary, #3880ff);
    font-weight: 500;
}
.picker-wrapper {
    padding: 12px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
}

.picker-wrapper ion-datetime {
    --background: transparent;
    background: transparent;
    color: inherit;
    width: 100%;
    max-width: 360px;
}
</style>
