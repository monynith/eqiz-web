<template>
    <div class="block">
        <div id="container">
            <div id="toolbar">
                <span id="title">Generate All</span>
                <div id="actions">
                    <span id="btn-close" @click="close">Close</span>
                </div>
            </div>
            <div class="body">
                <div class="toggle-row">
                    <span>Questions: Include Calculation?</span>
                    <div class="toggle-controls">
                        <ion-icon :icon="sparklesOutline" class="ai-icon" :class="{ checking: checkingCalc }" @click="checkCalc" title="Check calculation questions with AI"></ion-icon>
                        <ion-toggle mode="md" :checked="calculation" @click="toggleCalc"></ion-toggle>
                    </div>
                </div>
                <div class="toggle-row">
                    <span>Mock Ups: Include Calculation?</span>
                    <div class="toggle-controls">
                        <ion-icon :icon="sparklesOutline" class="ai-icon" :class="{ checking: checkingMockup }" @click="checkMockupCalc" title="Check calculation mock ups with AI"></ion-icon>
                        <ion-toggle mode="md" :checked="mockupCalculation" @click="toggleMockupCalc"></ion-toggle>
                    </div>
                </div>
                <div class="gen-all-actions">
                    <span class="action-btn" @click="generate('questions')">GENERATE ALL QUESTIONS</span>
                    <span class="action-btn" @click="generate('mockups')">GENERATE ALL MOCK UPS</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonIcon, IonToggle, modalController } from '@ionic/vue';
import { ref } from 'vue';
import { sparklesOutline } from 'ionicons/icons';

const props = defineProps<{
    calculation: boolean;
    mockupCalculation: boolean;
    onCheckCalculation?: () => Promise<boolean>;
    onCheckMockupCalculation?: () => Promise<boolean>;
}>();

const calculation = ref(props.calculation);
const mockupCalculation = ref(props.mockupCalculation);
const checkingCalc = ref(false);
const checkingMockup = ref(false);

const toggleCalc = () => { calculation.value = !calculation.value; };
const toggleMockupCalc = () => { mockupCalculation.value = !mockupCalculation.value; };

const checkCalc = async () => {
    if(!props.onCheckCalculation || checkingCalc.value) return;
    checkingCalc.value = true;
    try {
        calculation.value = await props.onCheckCalculation();
    } finally {
        checkingCalc.value = false;
    }
};

const checkMockupCalc = async () => {
    if(!props.onCheckMockupCalculation || checkingMockup.value) return;
    checkingMockup.value = true;
    try {
        mockupCalculation.value = await props.onCheckMockupCalculation();
    } finally {
        checkingMockup.value = false;
    }
};

const close = async () => {
    await modalController.dismiss({
        calculation: calculation.value,
        mockupCalculation: mockupCalculation.value,
        type: null
    });
};

const generate = async (type: string) => {
    await modalController.dismiss({
        calculation: calculation.value,
        mockupCalculation: mockupCalculation.value,
        type
    });
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
    background: #fff;
}
#toolbar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #ddd;
}
#title {
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
    color: #000;
}
#btn-close {
    cursor: pointer;
    color: palevioletred;
    font-weight: bold;
}
.body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 16px;
}
.toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
}
.toggle-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}
.ai-icon {
    font-size: 1.15rem;
    color: palevioletred;
    cursor: pointer;
}
.ai-icon.checking {
    opacity: 0.4;
    cursor: default;
}
.gen-all-actions {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 24px;
}
.action-btn {
    color: palevioletred;
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    text-align: center;
    padding: 14px;
    border: 1px solid palevioletred;
    border-radius: 8px;
}
</style>
