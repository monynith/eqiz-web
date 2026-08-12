<template>
    <div class="block">
        <div id="container" @touchmove.stop>
            <div id="toolbar">
                <span id="title">Generate All</span>
                <div id="actions">
                    <span id="btn-close" @click="close">Close</span>
                </div>
            </div>
            <div class="body">
                <div class="section">
                    <div class="section-head">
                        <span class="section-title">Questions: Include Calculation?</span>
                        <span class="check-all" @click="checkAll('question')" :class="{ checking: anyChecking('question') }">Check All</span>
                    </div>
                    <div class="cert-list">
                        <div class="cert-row" v-for="c in items" :key="c.id">
                            <span class="cert-name">{{ c.name }}</span>
                            <div class="toggle-controls">
                                <ion-icon :icon="sparklesOutline" class="ai-icon" :class="{ checking: checkingMap[c.id + '-q'] }" @click="checkCert(c, 'question')" title="Check calculation questions with AI"></ion-icon>
                                <ion-toggle mode="md" :checked="c.calculation" @click="c.calculation = !c.calculation"></ion-toggle>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-head">
                        <span class="section-title">Mock Ups: Include Calculation?</span>
                        <span class="check-all" @click="checkAll('mockup')" :class="{ checking: anyChecking('mockup') }">Check All</span>
                    </div>
                    <div class="cert-list">
                        <div class="cert-row" v-for="c in items" :key="c.id">
                            <span class="cert-name">{{ c.name }}</span>
                            <div class="toggle-controls">
                                <ion-icon :icon="sparklesOutline" class="ai-icon" :class="{ checking: checkingMap[c.id + '-m'] }" @click="checkCert(c, 'mockup')" title="Check mock up calculation questions with AI"></ion-icon>
                                <ion-toggle mode="md" :checked="c.mockupCalculation" @click="c.mockupCalculation = !c.mockupCalculation"></ion-toggle>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="gen-all-actions">
                    <br/>
                    <span class="action-btn" @click="generate('questions')">GENERATE ALL QUESTIONS</span>
                    <span class="action-btn" @click="generate('mockups')">GENERATE ALL MOCK UPS</span>
                    <span class="action-btn" @click="generate('content')">GENERATE ALL CONTENT & NOTES</span>
                </div>
            </div>
        </div>        
    </div>
</template>

<script setup lang="ts">
import { IonIcon, IonToggle, modalController } from '@ionic/vue';
import { ref } from 'vue';
import { sparklesOutline } from 'ionicons/icons';

type CertCalc = {
    id: string;
    name: string;
    calculation: boolean;
    mockupCalculation: boolean;
};

const props = defineProps<{
    certifications: CertCalc[];
    onCheckCert?: (certId: string, kind: 'question' | 'mockup') => Promise<boolean>;
    onCheckAll?: (kind: 'question' | 'mockup') => Promise<Record<string, boolean>>;
}>();

const items = ref<CertCalc[]>(props.certifications.map((c) => ({ ...c })));
const checkingMap = ref<Record<string, boolean>>({});

const keyFor = (id: string, kind: 'question' | 'mockup') => id + (kind === 'question' ? '-q' : '-m');

const anyChecking = (kind: 'question' | 'mockup') => {
    return items.value.some((c) => checkingMap.value[keyFor(c.id, kind)]);
};

const checkCert = async (c: CertCalc, kind: 'question' | 'mockup') => {
    const k = keyFor(c.id, kind);
    if(!props.onCheckCert || checkingMap.value[k]) return;
    checkingMap.value[k] = true;
    try {
        const result = await props.onCheckCert(c.id, kind);
        if(kind === 'question') c.calculation = result;
        else c.mockupCalculation = result;
    } finally {
        checkingMap.value[k] = false;
    }
};

const checkAll = async (kind: 'question' | 'mockup') => {
    if(!props.onCheckAll || anyChecking(kind)) return;
    for (const c of items.value) checkingMap.value[keyFor(c.id, kind)] = true;
    try {
        const map = await props.onCheckAll(kind);
        for (const c of items.value) {
            const v = !!(map && map[c.id]);
            if(kind === 'question') c.calculation = v;
            else c.mockupCalculation = v;
        }
    } finally {
        for (const c of items.value) checkingMap.value[keyFor(c.id, kind)] = false;
    }
};

const close = async () => {
    await modalController.dismiss({
        certifications: items.value,
        type: null
    });
};

const generate = async (type: string) => {
    await modalController.dismiss({
        certifications: items.value,
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
    background: var(--eq-surface, #fff);
    color: var(--eq-text, #000);
    max-height: 95vh;
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
#btn-close {
    cursor: pointer;
    color: var(--eq-pink, palevioletred);
    font-weight: bold;
}
.body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 16px;
}
.section {
    margin-bottom: 22px;
}
.section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}
.section-title {
    font-weight: bold;
    font-size: 0.95rem;
    color: var(--eq-text, #000);
}
.check-all {
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--eq-pink, palevioletred);
    cursor: pointer;
    border: 1px solid var(--eq-pink, palevioletred);
    border-radius: 6px;
    padding: 4px 10px;
}
.check-all.checking {
    opacity: 0.4;
    cursor: default;
}
.cert-list {
    border: 1px solid var(--eq-border, #eee);
    border-radius: 8px;
    padding: 4px 10px;
    background: var(--eq-surface-2, #fafafa);
}
.cert-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--eq-border, #f2f2f2);
    font-size: 0.9rem;
    color: var(--eq-text, #000);
}
.cert-row:last-child {
    border-bottom: none;
}
.cert-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 12px;
}
.toggle-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}
.ai-icon {
    font-size: 1.15rem;
    color: var(--eq-pink, palevioletred);
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
    color: var(--eq-pink, palevioletred);
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    text-align: center;
    padding: 14px;
    border: 1px solid var(--eq-pink, palevioletred);
    border-radius: 8px;
}
</style>
