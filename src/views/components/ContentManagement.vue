<template>
    <div id="btn-wrapper">
        <p class="create-btn" @click="mainMenu"><ion-icon :icon="menuOutline"></ion-icon> MENU</p>
    </div>     
    <div id="app-wrapper">  
        <p id="add-remark-btn" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5, cursor: contentData['appId'] != '' ? 'pointer' : 'default' }">
            <ion-icon :icon="contentData['remark'] != '' ? checkmarkDoneSharp : add" @click="onRemark"></ion-icon>
            <span @click="onRemark">{{ contentData['remark'] != '' ? 'REMARK' : 'ADD REMARK' }}</span>
            <ion-icon :icon="scanOutline" class="open-icon" style="font-size: 0.7rem;" v-if="contentData['remark'] != ''" @click="openText(contentData.remark)"></ion-icon>
            <ion-icon :icon="documentTextOutline" class="open-icon" style="font-size: 0.7rem; margin-left: 2px;" v-if="contentData['remark'] != ''" @click="viewMD"></ion-icon>            
        </p>     
        <p id="app-id">App ID: <span id="value">{{ contentData['appId'] || 'unset' }}</span> <ion-icon :icon="createOutline" @click="setAppId"></ion-icon></p>
        <p id="app-name">App Name: <span id="value">{{ contentData['appName'] || 'unset' }}</span> <ion-icon :icon="createOutline" @click="setAppId"></ion-icon></p>        
        <div id="download-btn-wrapper" v-if="contentData['appId'] != ''">
            <!-- <span class="create-btn-standalone" @click="downloadContent()">DOWNLOAD CONTENT <ion-icon :icon="download"></ion-icon></span>
            <span class="create-btn-standalone" @click="loadQuestion()" v-if="contentData['certifications']">LOAD QUESTIONS <ion-icon :icon="cloudUpload"  style="position: relative; top: 2px;"></ion-icon></span>
            <span class="create-btn-standalone" @click="downloadQuestions()">DOWNLOAD QUESTIONS <ion-icon :icon="download"></ion-icon></span> -->
            <span class="create-btn-standalone" @click="generateAllMenu" v-if="contentData['certifications'].length > 0">GENERATE ALL <ion-icon :icon="sparkles" style="position: relative; top: 2px;"></ion-icon></span>
            <span class="create-btn-standalone" @click="moreOption">OPTIONS <ion-icon :icon="attachOutline" style="position: relative; top: 2px;"></ion-icon></span>
        </div>       

        <div id="download-btn-wrapper" v-if="contentData['appId'] == ''">
            <input type="file" id="fileInput" style="display: none;" />
            <span class="create-btn-standalone" @click="loadMeta()">LOAD META (FILE)<ion-icon :icon="attachOutline" style="position: relative; top: 2px;"></ion-icon></span>            
        </div>  
        <!-- <div style="height: 17px;"></div>    -->
    </div>          
    <div id="template-wrapper">
        <div id="left">
            <p class="label" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5 }">Certification(s) 
                <ion-icon :icon="copyOutline" @click="copyPrompt('cert')" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5, cursor: contentData['appId'] != '' ? 'pointer' : 'default' }"></ion-icon>
                <ion-icon :icon="scanOutline" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5, cursor: contentData['appId'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(contentData['appId'] != '' ? contentData.certifications : '')"></ion-icon>
            </p>
            <div id="cert-wrapper">
                <div v-for="(cert, index) in contentData['certifications']" class="cert-items">
                    <span id="ind">{{ index + 1 }}</span>
                    <div id="cert">
                        <p id="value">{{ cert['name'] }}</p>
                        <p id="key">{{ cert['id'] }}</p>                    
                    </div>                
                    <div id="remove" @click="removeCert(index, 'cert')"><ion-icon :icon="closeCircleOutline"></ion-icon><span>REMOVE</span></div>
                </div>
            </div>            
            <div class="add-item" @click="addCert" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5, cursor: contentData['appId'] != '' ? 'pointer' : 'default' }">
                <ion-icon :icon="add"></ion-icon><span>Add Certification</span>
            </div>

            <div id="filter" :style="{ opacity: contentData['certifications'].length > 0 ? 1 : 0.5 , cursor: contentData['certifications'].length > 0 ? 'pointer' : 'default' }" @click="pickCertification">
                <span>{{ selectedCertification['id'] != '' ? selectedCertification['id'] : 'SELECT CERTIFICATION' }}</span> <ion-icon :icon="chevronDownOutline"></ion-icon> 
            </div>

            <br/>
            <p class="label" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }">Domain(s) 
                <ion-icon :icon="copyOutline" @click="copyPrompt('domain')" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? contentData.domains : '', '', true, { type: 'domains' })"></ion-icon>
                <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="showAI('domain')"></ion-icon>
            </p>
            <div id="domain-wrapper">
                <div v-for="(domain, index) in (contentData.domains as any)[selectedCertification['id']]" class="domain-items">
                    <p>{{ domain['id'] }}: {{ domain['name'] || domain['part'] }}</p>
                    <div id="remove" @click="removeCert(Number(index), 'domain')"><ion-icon :icon="closeCircleOutline"></ion-icon><span>REMOVE</span></div>
                </div>
            </div>
            <div class="add-item" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="addDomain">
                <ion-icon :icon="add"></ion-icon><span>Add Domain</span>
            </div>

            <div id="content-wrapper" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }">
                <p class="inner-title">GLOBAL CONTENT 
                    <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="generateAll('global')"></ion-icon>
                </p>                
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('glossary')">
                        <ion-icon :icon="isContentSet('glossary') ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('glossary') ? `Glossary Added (#1)`  : 'Add Glossary (#1)'}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('glossary')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('glossary') : '', 'javascript', false)"></ion-icon>
                    <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="showAI('glossary')"></ion-icon>
                </div>    
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('cheatsheet')">
                        <ion-icon :icon="isContentSet('cheatsheet') ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('cheatsheet') ? 'Cheat Sheet Added (#2)'  : 'Add Cheat Sheet (#2)'}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('cheatsheet')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('cheatsheet') : '', 'javascript', false)"></ion-icon>
                    <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="showAI('cheatsheet')"></ion-icon>
                </div>   
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('examtip')">
                        <ion-icon :icon="isContentSet('examtip') ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('examtip') ? 'Exam Tip Added (#3)'  : 'Add Exam Tip (#3)'}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('examtip')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('examtip') : '', 'javascript', false)"></ion-icon>
                    <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="showAI('examtip')"></ion-icon>
                </div>    
                <div id="completed" v-if="isContentCompleted()">
                    <ion-icon :icon="checkmarkCircleSharp"></ion-icon>
                    <span>Completed</span>
                </div>                           
            </div> 
           
        </div>
        <div id="right">            
                        
            <div id="filter" @click="pickCertification" :style="{ opacity: contentData['certifications'].length > 0 ? 1 : 0.5, cursor: contentData['certifications'].length > 0 ? 'pointer' : 'default' }">
                <span>{{ selectedCertification['id'] != '' ? selectedCertification['id'] : 'SELECT CERTIFICATION' }}</span> <ion-icon :icon="chevronDownOutline"></ion-icon> 
            </div>
            <br />
            <!-- <p class="label" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }">Content per Domain</p>             -->
            <div id="content-wrapper" :style="{ opacity: selectedCertification['id'] != '' && (contentData['domains'] as any)[selectedCertification['id']] && (contentData['domains'] as any)[selectedCertification['id']].length > 0 ? 1 : 0.5 }">
                <!-- <p class="inner-title">SELECT DOMAIN<ion-icon :icon="chevronDownOutline"></ion-icon> </p>                 -->
                <p class="inner-title">LECTURE NOTES
                    <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="generateAll('notes')"></ion-icon>
                </p>                
                <div class="add-wrapper" v-for="domain in (contentData.domains as any)[selectedCertification.id]">
                    <p class="add-button" @click="addContent('note', domain)">
                        <ion-icon :icon="isContentSet('note', domain['id']) ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('note', domain['id']) ?  `Part ${domain['id']}: Added`  : `Part ${domain['id']}: ${domain['part'] || domain['name']}`}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('note', domain)" id="copy"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('note', domain['id']) : '', 'html', false, { type: 'note', domainId: domain['id'] })"></ion-icon>
                    <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="showAI('note', domain)"></ion-icon>
                </div>    
                <div id="completed" v-if="isContentCompleted('note')">
                    <ion-icon :icon="checkmarkCircleSharp"></ion-icon>
                    <span>Completed</span>
                </div>                                   
            </div> 
            <br/>
            <br/>
            <p class="label" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }" v-if="(contentData.domains as any)[selectedCertification.id] && (contentData.domains as any)[selectedCertification.id].length > 0">Questions</p>             
            <ion-toggle mode="md" id="question-toggle" @click="toggleNotifications" :checked="calculation" v-if="(contentData.domains as any)[selectedCertification.id] && (contentData.domains as any)[selectedCertification.id].length > 0">CALCULATION?</ion-toggle>
            <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="checkCalculation" v-if="(contentData.domains as any)[selectedCertification.id] && (contentData.domains as any)[selectedCertification.id].length > 0" title="Check calculation questions with AI"></ion-icon><br />
            <div id="question-wrapper">
                <div v-for="domain in (contentData.domains as any)[selectedCertification.id]" class="question-title">
                    <p>{{ `Part ${domain['id']}: ${domain['part'] || domain['name']}` }}
                        <ion-icon :icon="copyOutline" @click="copyPrompt('question', domain)" id="copy"></ion-icon>
                        <ion-icon :icon="scanOutline" class="open-icon" @click="openText((contentData.question as any)[selectedCertification.id] && (contentData.question as any)[selectedCertification.id][domain['id']] ? (contentData.question as any)[selectedCertification.id][domain['id']] : '', 'json', true, { type: 'questions', domainId: domain['id'] })"></ion-icon>
                    </p>

                    <div id="content-wrapper" class="p-b-0">
                        <p class="inner-title m-b-0">QUESTION BATCHES</p>                
                        <div class="add-wrapper m-b-10">
                            <p id="question-count">Current Question: <b>{{ (contentData.question as any)[selectedCertification.id] && (contentData.question as any)[selectedCertification.id][domain['id']] ? (contentData.question as any)[selectedCertification.id][domain['id']].length : 0 }}</b> / 390</p>
                        </div>
                        <div id="completed" v-if="isQuestionCompleted(domain)">
                            <ion-icon :icon="checkmarkCircleSharp"></ion-icon>
                            <span>Completed</span>
                        </div>                   
                        <div class="ai-actions">
                            <ion-icon :icon="checkmarkDoneSharp" id="validate-icon" @click="validateQuestionsQuality(domain)" title="Validate question quality (kilo/free)"></ion-icon>
                            <ion-icon :icon="sparkles" id="ai-icon" @click="generateQuestionsUntil(domain)" title="Generate with AI until 390"></ion-icon>
                        </div>

                    </div> 

                    <div class="add-item" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }" @click="addQuestion(domain)">
                        <ion-icon :icon="add"></ion-icon><span>Add Question Batch</span>
                    </div>
                </div>                    
            </div>             
            <br/>
            <br/>
            <p class="label" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }" v-if="selectedCertification['id'] != ''">Mock Up or Previous Exam Question</p>
            <ion-toggle mode="md" id="mockup-toggle" @click="toggleMockupCalculation" :checked="mockupCalculation" v-if="selectedCertification['id'] != ''">CALCULATION?</ion-toggle>
            <ion-icon :icon="sparklesOutline" class="ai-icon" :style="{ opacity: selectedCertification['id'] != '' ? 0.85 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" @click="checkMockupCalculation" v-if="selectedCertification['id'] != ''" title="Check calculation questions with AI"></ion-icon><br />
            <div id="mockup-wrapper" v-if="selectedCertification['id'] != ''">
                <div class="question-title">
                    <p>{{ `Mock Up / Previous Exam (${selectedCertification['name']})` }}
                        <ion-icon :icon="copyOutline" @click="copyPrompt('mockup')" id="copy"></ion-icon>
                        <ion-icon :icon="scanOutline" class="open-icon" @click="openText((contentData.mockupQuestion as any)[selectedCertification.id] ? (contentData.mockupQuestion as any)[selectedCertification.id] : '', 'json', true, { type: 'mockup' })"></ion-icon>
                    </p>

                    <div id="content-wrapper" class="p-b-0">
                        <p class="inner-title m-b-0">QUESTION BATCHES</p>                
                        <div class="add-wrapper m-b-10">
                            <p id="question-count">Current Question: <b>{{ (contentData.mockupQuestion as any)[selectedCertification.id] ? (contentData.mockupQuestion as any)[selectedCertification.id].length : 0 }}</b> / 200</p>
                        </div>
                        <div id="completed" v-if="isMockupCompleted()">
                            <ion-icon :icon="checkmarkCircleSharp"></ion-icon>
                            <span>Completed</span>
                        </div>                   
                        <div class="ai-actions">
                            <ion-icon :icon="checkmarkDoneSharp" id="validate-icon" @click="validateMockupQuality()" title="Validate question quality (kilo/free)"></ion-icon>
                            <ion-icon :icon="sparkles" id="ai-icon" @click="generateMockupUntil()" title="Generate with AI until 200"></ion-icon>
                        </div>

                    </div> 

                    <div class="add-item" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }" @click="addMockupQuestion()">
                        <ion-icon :icon="add"></ion-icon><span>Add Question Batch</span>
                    </div>
                </div>                    
            </div>             
        </div>
    </div>
    <div id="summary-bar" v-if="summary && summary.certCount > 0">
        <p class="sum-title">
            <ion-icon :icon="summaryExpanded ? chevronUpOutline : chevronDownOutline" class="sum-toggle" @click="summaryExpanded = !summaryExpanded" :title="summaryExpanded ? 'Collapse' : 'Expand'"></ion-icon>
            Content Process Summary ({{ summary.certCount }} Certification{{ summary.certCount > 1 ? 's' : '' }})
        </p>
        <div class="sum-table-wrap" v-if="summaryExpanded">
            <table class="sum-table">
                <thead>
                    <tr>
                        <th>Certification</th>
                        <th>Dom</th>
                        <th>G</th>
                        <th>C</th>
                        <th>E</th>
                        <th>N</th>
                        <th>Questions (per domain)</th>
                        <th>Mock Up</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in summary.list" :key="c.id" :class="{ active: c.id === summary.activeId }" @click="selectCertSummary(c.id)">
                        <td class="sum-name">{{ c.name }}</td>
                        <td>{{ c.domainCount }}/4</td>
                        <td :class="c.glossary ? 'ok' : 'no'">{{ c.glossary ? '✓' : '–' }}</td>
                        <td :class="c.cheatsheet ? 'ok' : 'no'">{{ c.cheatsheet ? '✓' : '–' }}</td>
                        <td :class="c.examtip ? 'ok' : 'no'">{{ c.examtip ? '✓' : '–' }}</td>
                        <td :class="c.notes === 4 ? 'ok' : 'no'">{{ c.notes }}/4</td>
                        <td>
                            <span v-for="d in c.domainStats" :key="d.id" class="sum-chip" :class="{ done: d.done }" :title="d.part">{{ d.id }}:{{ d.count }}</span>
                            <b :class="c.questionTotal >= c.questionTarget ? 'ok' : 'no'">{{ c.questionTotal }}/{{ c.questionTarget }}</b>
                        </td>
                        <td :class="c.mockupTotal >= c.mockupTarget ? 'ok' : 'no'">{{ c.mockupTotal }}/{{ c.mockupTarget }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="6">Total ({{ summary.certCount }})</td>
                        <td><b>{{ summary.totalQuestion }}/{{ summary.totalQuestionTarget }}</b></td>
                        <td><b>{{ summary.totalMockup }}</b></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
    <br />
</template>

<script setup lang="ts">
import certification from '@/assets/prompts/certification';
import calculationCheck from '@/assets/prompts/calculation';
import cheatsheet from '@/assets/prompts/cheatsheet';
import domainContent from '@/assets/prompts/domain';
import examtip from '@/assets/prompts/examtip';
import glossary from '@/assets/prompts/glossary';
import note from '@/assets/prompts/note';
import question from '@/assets/prompts/question';
import mockup from '@/assets/prompts/mockup';
import { actionSheetController, alertController, IonIcon, toastController, IonToggle, loadingController, modalController } from '@ionic/vue';
import TextModal from './TextModal.vue';
import GenerateAllModal from './GenerateAllModal.vue';
import { add, attachOutline, attachSharp, browsersOutline, checkmarkCircleSharp, checkmarkDoneSharp, chevronDownOutline, chevronUpOutline, closeCircleOutline, cloudUpload, codeOutline, copyOutline, createOutline, documentTextOutline, download, ellipseSharp, ellipsisHorizontalSharp, ellipsisVerticalSharp, flashOutline, menuOutline, openOutline, scanOutline, sparkles, sparklesOutline, unlinkOutline, unlinkSharp } from 'ionicons/icons';
import { ref, watch, onMounted, computed } from 'vue';
import JSZip from 'jszip';
import { createClient } from '@libsql/client';
import { jsonrepair } from 'jsonrepair';
import { CapacitorHttp } from '@capacitor/core';

const isSaving = ref(false);
const isLoading = ref(false);

const contentData = ref({
    appId: '',
    appName: '',
    certifications: [
        
    ], 
    domains: {
            
    },
    content: {
        
    },
    question: {
        
    },
    mockupQuestion: {

    },
    remark: ''
})

const isDownloadable = ref(false);
const selectedCertification = ref({
    id: '',
    name: '',
    calculation: false,
    mockupCalculation: false
});
const calculation = computed({
    get: () => !!(selectedCertification.value && selectedCertification.value.calculation),
    set: (v: boolean) => { if(selectedCertification.value) selectedCertification.value.calculation = v; }
});
const mockupCalculation = computed({
    get: () => !!(selectedCertification.value && selectedCertification.value.mockupCalculation),
    set: (v: boolean) => { if(selectedCertification.value) selectedCertification.value.mockupCalculation = v; }
});
const summaryExpanded = ref(true);

// Local draft persistence.
// Autosaves the whole working state so it survives app reload/closure.
// The draft is cleared ONLY on "Create Again" or a successful "Save" (not "Save & Keep").
// We use localforage (instead of raw IndexedDB) because iOS WKWebView's IndexedDB
// is unreliable: it silently fails in private mode and across reloads. localforage
// automatically falls back through IndexedDB -> WebSQL -> localStorage, and WebSQL
// is the most dependable backend on iOS.
import localforage from 'localforage';

const DRAFT_KEY = 'current';

const draftStore = localforage.createInstance({
    name: 'eqiz-content-draft',
    storeName: 'drafts',
    description: 'Local autosave draft for content management'
});

const putDraft = (value: any): Promise<void> => {
    return draftStore.setItem(DRAFT_KEY, value).then(() => undefined);
};

const getDraft = (): Promise<any | null> => {
    return draftStore.getItem(DRAFT_KEY).then((v: any) => v ?? null);
};

const deleteDraft = (): Promise<void> => {
    return draftStore.removeItem(DRAFT_KEY).then(() => undefined);
};

const persistDraft = async () => {
    try {
        const c = contentData.value;
        const hasData = c.appId !== '' || (c.certifications && c.certifications.length > 0)
            || (c.question && Object.keys(c.question).length > 0)
            || (c.mockupQuestion && Object.keys(c.mockupQuestion).length > 0)
            || (c.content && Object.keys(c.content).length > 0);
        if (hasData) {
            await putDraft(JSON.parse(JSON.stringify(c)));
        } else {
            await deleteDraft();
        }
    } catch (e) {
        console.error('Failed to persist local draft', e);
    }
};

let draftTimer: any = null;
const schedulePersist = () => {
    if (draftTimer) clearTimeout(draftTimer);
    draftTimer = setTimeout(() => { persistDraft(); }, 800);
};

watch(contentData, schedulePersist, { deep: true });

onMounted(async () => {
    try {
        const draft = await getDraft();
        if (draft && (draft.appId || (draft.certifications && draft.certifications.length > 0))) {
            contentData.value = {
                appId: '',
                appName: '',
                certifications: [],
                domains: {},
                content: {},
                question: {},
                mockupQuestion: {},
                remark: '',
                ...draft
            };
            if (contentData.value.certifications.length > 0) {
                selectedCertification.value = contentData.value.certifications[0];
            }
        }
    } catch (e) {
        console.error('Failed to restore local draft', e);
    }
});

const setAppId = async ()=> {
    const alertInputs: any = [
        {
            placeholder: 'App ID',
            name: 'appId'
        },
        {
            placeholder: 'Name',
            name: 'name'
        }
    ];
    const alert = await alertController.create({
      header: 'Set App ID and Name',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Set',
        handler: (data)=> {            
            contentData.value.appId = data.appId;
            contentData.value.appName = data.name;
        }
      }],
      inputs: alertInputs,
      mode: 'md'
    });

    await alert.present();
}

const addContent = async (type: string, domain?: any)=> {
    if (selectedCertification.value.id == '') return;
    const alertInputs: any = [
        {
            placeholder: 'Paste Content Data',
            name: 'text',
            type: 'textarea',
            attributes: {
                id: 'alert-paste-field'
            }
        }
    ];
    const alert = await alertController.create({
        header: `Set ${type.toUpperCase()} for ` + selectedCertification.value.id.toUpperCase(),
        buttons: [{
            text: 'Cancel'
        }],
        inputs: alertInputs,
        subHeader: domain ? `Part ${domain['id']}: ${domain['name'] || domain['part']}` : '',
        mode: 'md'
    });

    const inputEl = document.getElementById('alert-paste-field') as HTMLInputElement;
    if (inputEl) {
        let processed = false;
        const handleContent = (data: string) => {
            if (processed || !data) return;
            processed = true;
            const result = data;
            if(!(contentData.value.content as any)[selectedCertification.value.id]) {
                (contentData.value.content as any)[selectedCertification.value.id] = {};
            }
            if(type == 'note') {
                if(!(contentData.value.content as any)[selectedCertification.value.id][type]) (contentData.value.content as any)[selectedCertification.value.id][type] = {};
                (contentData.value.content as any)[selectedCertification.value.id][type][domain['id']] = "";
                (contentData.value.content as any)[selectedCertification.value.id][type][domain['id']] = result;
            } else {
                (contentData.value.content as any)[selectedCertification.value.id][type] = result;
            }
            alert.dismiss();
        };
        inputEl.addEventListener('paste', (event: ClipboardEvent) => {
            handleContent(event.clipboardData?.getData('text') || '');
        });
        inputEl.addEventListener('input', (event: Event) => {
            handleContent((event.target as HTMLInputElement).value);
        });
    }

    await alert.present();
}

const addQuestion = async (domain: any)=> {
   if (selectedCertification.value.id == '') return;   
   const alertInputs: any = [
        {
            placeholder: 'Paste JSON Data',
            name: 'json',
            type: 'textarea',
            attributes: {
                id: 'alert-paste-field'
            }
        }
    ];
    const alert = await alertController.create({
        header: 'Add Question Batch',
        subHeader: 'Part ' + domain['id'] + ': ' + (domain['part'] || domain['name']),
        buttons: [{
            text: 'Cancel'
        }],
        inputs: alertInputs,
        mode: 'md'
    });

    const inputEl = document.getElementById('alert-paste-field') as HTMLInputElement;
    if (inputEl) {
        let processed = false;
        const handleQuestion = (data: string) => {
            if (processed || !data) return;
            try {
                const result = JSON.parse(data);
                let questions = result['data'] || result;
                if (questions.length > 0) {
                    if(!(contentData.value.question as any)[selectedCertification.value.id]) (contentData.value.question as any)[selectedCertification.value.id] = {};
                    if(!(contentData.value.question as any)[selectedCertification.value.id][domain['id']]) (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = [];
                    const filterQuestions = validateQuestions(questions, domain);
                    (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = filterQuestions;
                    processed = true;
                    alert.dismiss();
                }
            } catch (e) {
                console.error(e);
            }
        };
        inputEl.addEventListener('paste', (event: ClipboardEvent) => {
            handleQuestion(event.clipboardData?.getData('text') || '');
        });
        inputEl.addEventListener('input', (event: Event) => {
            handleQuestion((event.target as HTMLInputElement).value);
        });
    }

    await alert.present();
}

const addMockupQuestion = async ()=> {
   if (selectedCertification.value.id == '') return;
   const alertInputs: any = [
        {
            placeholder: 'Paste JSON Data',
            name: 'json',
            type: 'textarea',
            attributes: {
                id: 'alert-paste-field'
            }
        }
    ];
    const alert = await alertController.create({
        header: 'Add Mock Up / Previous Exam Question Batch',
        subHeader: selectedCertification.value.name,
        buttons: [{
            text: 'Cancel'
        }],
        inputs: alertInputs,
        mode: 'md'
    });

    const inputEl = document.getElementById('alert-paste-field') as HTMLInputElement;
    if (inputEl) {
        let processed = false;
        const handleQuestion = (data: string) => {
            if (processed || !data) return;
            try {
                const result = JSON.parse(data);
                let questions = result['data'] || result;
                if (questions.length > 0) {
                    if(!(contentData.value.mockupQuestion as any)[selectedCertification.value.id]) (contentData.value.mockupQuestion as any)[selectedCertification.value.id] = [];
                    const filterQuestions = validateMockupQuestions(questions);
                    (contentData.value.mockupQuestion as any)[selectedCertification.value.id] = filterQuestions;
                    processed = true;
                    alert.dismiss();
                }
            } catch (e) {
                console.error(e);
            }
        };
        inputEl.addEventListener('paste', (event: ClipboardEvent) => {
            handleQuestion(event.clipboardData?.getData('text') || '');
        });
        inputEl.addEventListener('input', (event: Event) => {
            handleQuestion((event.target as HTMLInputElement).value);
        });
    }

    await alert.present();
}

const addDomain = async ()=> {
    if (selectedCertification.value.id == '') return;
    const alertInputs: any = [
        {
            placeholder: 'Paste JSON Data',
            name: 'json',
            type: 'textarea',
            attributes: {
                id: 'alert-paste-field'
            }
        }
    ];
    const alert = await alertController.create({
        header: 'Set Domain for ' + selectedCertification.value.id.toUpperCase(),
        buttons: [{
            text: 'Cancel'
        }],
        inputs: alertInputs,
        mode: 'md'
    });

    const inputEl = document.getElementById('alert-paste-field') as HTMLInputElement;
    if (inputEl) {
        let processed = false;
        const handleDomain = (data: string) => {
            if (processed || !data) return;
            try {
                const result = JSON.parse(data);
                if (result.length > 0) {
                    (contentData.value.domains as any)[selectedCertification.value.id] = normalizeDomains(result);
                    processed = true;
                    alert.dismiss();
                }
            } catch (e) {
                console.error(e);
            }
        };
        inputEl.addEventListener('paste', (event: ClipboardEvent) => {
            handleDomain(event.clipboardData?.getData('text') || '');
        });
        inputEl.addEventListener('input', (event: Event) => {
            handleDomain((event.target as HTMLInputElement).value);
        });
    }

    await alert.present();
}

const addCert = async ()=> {
    if(contentData.value.appId == '') return;
    const alertInputs: any = [
        {
            placeholder: 'Cert ID',
            name: 'certId'
        },
        {
            placeholder: 'Cert Name',
            name: 'name'
        },
        {
            placeholder: 'Or paste JSON',
            name: 'json',
            type: 'textarea',
            attributes: {
               id: 'alert-paste-field'
            }
        }
    ];
    const alert = await alertController.create({
      header: 'Set Certification ID and Name',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Set',
        handler: async (data)=> {      
            if(data.certId != '' && data.name != '') {
                const certifications = contentData.value.certifications;
                const nextId = data.certId;
                const idExists = certifications.some((cert: any) => cert.id === nextId);

                if(idExists) {
                    const toast = await toastController.create({
                        message: 'ID is duplicated.',
                        duration: 3500,
                        position: 'bottom',
                        color: "danger"
                    });

                    await toast.present();
                    return;
                }

                (contentData.value.certifications as any).push({
                    id: data.certId,
                    name: data.name,
                    calculation: false,
                    mockupCalculation: false
                })
            }            
        }
      }],
      inputs: alertInputs,
      mode: 'md'
    });

    const inputEl = document.getElementById('alert-paste-field') as HTMLInputElement;
    if (inputEl) {
        let processed = false;
        const handleCert = (data: string) => {
            if (processed || !data) return;
            try {
                const result = JSON.parse(data);
                if(result.length > 0){
                    const seenIds = new Set();
                    let duplicateId = false;
                    for (const item of result) {
                        if (seenIds.has(item.id)) {
                            duplicateId = true;
                        }
                        seenIds.add(item.id);
                    }
                    if(duplicateId == true) {
                        toastController.create({
                            message: 'Some ids are duplicate.',
                            duration: 3500,
                            position: 'bottom',
                            color: "danger"
                        }).then(t => t.present());
                        return;
                    }
                    (contentData.value.certifications as any) = result;
                    processed = true;
                    alert.dismiss();
                }
            } catch (e) {
                console.error(e);
            }
        };
        inputEl.addEventListener('paste', (event: ClipboardEvent) => {
            handleCert(event.clipboardData?.getData('text') || '');
        });
        inputEl.addEventListener('input', (event: Event) => {
            handleCert((event.target as HTMLInputElement).value);
        });
    }

    await alert.present();
}

const removeCert = (idx: number, type: string)=> {
    if(type == 'cert') contentData.value.certifications.splice(idx, 1);
    if(type == 'domain') (contentData.value.domains as any)[selectedCertification.value.id].splice(idx, 1);
}

const buildPrompt = (type: string, domain?: any) => {
    let str = "";
    if(type == 'cert') str = certification.replaceAll('$RP{app-name}', contentData.value.appName);
    if(type == 'domain') {
        str = domainContent.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value.name);
    }
    if(type == 'glossary') {
        str = glossary.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value['name']);
    }
    if(type == 'cheatsheet') {
        str = cheatsheet.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value['name']);
    }
    if(type == 'examtip') {
        str = examtip.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value['name']);
    }
    if(type == 'calc') {
        str = calculationCheck.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value['name']);
    }
    if(type == 'note') {
        str = note.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value['name']).replaceAll('$RP{domain-name}', domain['part'] || domain['name']);
    }
    if(type == 'question') {
        str = question.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value['name']).replaceAll('$RP{domain-name}', domain['part'] || domain['name']);        
        if(calculation.value == false) {
            str = str.replaceAll('$RP{comment-start}', '<!--').replaceAll('$RP{comment-end}', '-->');
        } else {
            str = str.replaceAll('$RP{comment-start}', '').replaceAll('$RP{comment-end}', '');
        }
    }
    if(type == 'mockup') {
        str = mockup.replaceAll('$RP{app-name}', contentData.value.appName).replaceAll('$RP{cert-name}', selectedCertification.value['name']).replaceAll('$RP{domain-name}', selectedCertification.value['name']);
        if(mockupCalculation.value == false) {
            str = str.replaceAll('$RP{comment-start}', '<!--').replaceAll('$RP{comment-end}', '-->');
        } else {
            str = str.replaceAll('$RP{comment-start}', '').replaceAll('$RP{comment-end}', '');
        }
    }
    return str;
}

const copyPrompt = (type: string, domain?: any) => {
    if(contentData.value.certifications.length <=0 && type != 'cert') return;
    const str = buildPrompt(type, domain);
    navigator.clipboard.writeText(str)
    .then(async () => {      
        const toast = await toastController.create({
            message: 'Copied Successfully.',
            position: 'bottom',
            duration: 2500,
            color: "secondary"
        });
        await toast.present();
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
    });
}

const pickCertification = async ()=> {
    if(contentData.value['certifications'].length <= 0) return;
    const actionSheet = await actionSheetController.create({
        header: 'Select certifcation',
        buttons: contentData.value.certifications.map((v: any) => {
            return {
                text: v['name'],
                handler: () => {                    
                    selectedCertification.value = v;
                }
            }
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const isContentSet = (type: string, domainId?: any)=> {
    if(type == 'note') return (contentData.value.content as any)[selectedCertification.value['id']] && (contentData.value.content as any)[selectedCertification.value['id']][type] && (contentData.value.content as any)[selectedCertification.value['id']][type][domainId]
    return (contentData.value.content as any)[selectedCertification.value['id']] && (contentData.value.content as any)[selectedCertification.value['id']][type]    
}

const getContent = (type: string, domainId?: any)=> {
    if(type == 'note') return (contentData.value.content as any)[selectedCertification.value['id']] && (contentData.value.content as any)[selectedCertification.value['id']][type] && (contentData.value.content as any)[selectedCertification.value['id']][type][domainId] ? (contentData.value.content as any)[selectedCertification.value['id']][type][domainId] : ''
    return (contentData.value.content as any)[selectedCertification.value['id']] && (contentData.value.content as any)[selectedCertification.value['id']][type] ? (contentData.value.content as any)[selectedCertification.value['id']][type] : ''  
}

const isContentCompleted = (type?: string)=> {    
    if(!(contentData.value.content as any)[selectedCertification.value['id']]) return false;    
    if(type == 'note') {
        if((contentData.value.content as any)[selectedCertification.value['id']][type] && (contentData.value.content as any)[selectedCertification.value['id']][type]['A'] && (contentData.value.content as any)[selectedCertification.value['id']][type]['B'] && (contentData.value.content as any)[selectedCertification.value['id']][type]['C'] && (contentData.value.content as any)[selectedCertification.value['id']][type]['D']) return true;
        return;
    }
    if((contentData.value.content as any)[selectedCertification.value['id']]['glossary'] && (contentData.value.content as any)[selectedCertification.value['id']]['cheatsheet'] && (contentData.value.content as any)[selectedCertification.value['id']]['examtip']) return true;
    return false;
}

const toggleNotifications = () => {
  // Flip the state manually on click
  calculation.value = !calculation.value;
}

const toggleMockupCalculation = () => {
  mockupCalculation.value = !mockupCalculation.value;
}

const isQuestionCompleted = (domain: any)=> {
    const questions = (contentData.value.question as any)[selectedCertification.value['id']] && (contentData.value.question as any)[selectedCertification.value['id']][domain['id']] ? (contentData.value.question as any)[selectedCertification.value['id']][domain['id']] : [];
    if(questions.length >= 390) {
        return true;
    }
    return false;
}

const groupBy = (xs: any, key: any)=> {
    return xs.reduce((rv: any, x: any)=> {
        (rv[x[key]] ??= []).push(x);
        return rv;
    }, {});
}

const shuffleArray = (array: any)=> {
    let i = array.length;
    while (i > 1) {
        // Pick a remaining element
        const j = Math.floor(Math.random() * i--);

        // Swap using a temporary variable (Faster than destructuring)
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const validateQuestions = (questions: any, domain: any)=> {   
    const allQuestions = (contentData.value.question as any)[selectedCertification.value.id][domain['id']].concat(questions); 
    shuffleArray(allQuestions);
    const uniqueQuestions = groupBy(allQuestions, 'question');        
    const results: any = [];
    let i = 1;
    Object.keys(uniqueQuestions).forEach((key: any) => {
        const v = uniqueQuestions[key][0];                        
        if(
            v['question'] && 
            v['question'].length >= 40 &&
            v['question'].indexOf('YANG') <= -1 &&
            v['explanation'] && v['explanation'].length >= 50 &&
            v['question'].indexOf('completion of question') <= -1 &&
            v['question'].indexOf('Which of the following summarize the') <= -1 &&
            v['standard'] &&
            v['standard'] == (domain['part'] || domain['name'])
        ) {
            results.push({ ...v, id: `${selectedCertification.value.id}_${domain['id'].toLowerCase()}_` + i, quizId: `${selectedCertification.value.id}_${domain['id'].toLowerCase()}`, type: 'text' });
            i = i + 1;
        }     
    });    
    return results.slice(0, 390);
}

const isMockupCompleted = ()=> {
    const questions = (contentData.value.mockupQuestion as any)[selectedCertification.value['id']] ? (contentData.value.mockupQuestion as any)[selectedCertification.value['id']] : [];
    if(questions.length >= 200) {
        return true;
    }
    return false;
}

const validateMockupQuestions = (questions: any)=> {
    const existing = (contentData.value.mockupQuestion as any)[selectedCertification.value.id] ? (contentData.value.mockupQuestion as any)[selectedCertification.value.id] : [];
    const allQuestions = existing.concat(questions);
    shuffleArray(allQuestions);
    const uniqueQuestions = groupBy(allQuestions, 'question');
    const results: any = [];
    let i = 1;
    Object.keys(uniqueQuestions).forEach((key: any) => {
        const v = uniqueQuestions[key][0];
        if(
            v['question'] &&
            v['question'].length >= 40 &&
            v['question'].indexOf('YANG') <= -1 &&
            v['explanation'] && v['explanation'].length >= 50 &&
            v['question'].indexOf('completion of question') <= -1 &&
            v['question'].indexOf('Which of the following summarize the') <= -1 &&
            v['standard']
        ) {
            results.push({ ...v, id: `${selectedCertification.value.id}_mockup_` + i, quizId: `${selectedCertification.value.id}_mockup`, type: 'mockup' });
            i = i + 1;
        }
    });
    return results.slice(0, 200);
}

const normalizeDomains = (domains: any) => {
    const PARTS = ['A', 'B', 'C', 'D'];
    const seen: Record<string, any> = {};
    (Array.isArray(domains) ? domains : []).forEach((d: any) => {
        const id = (d['id'] || '').toString().toUpperCase();
        if (PARTS.includes(id) && !seen[id]) {
            seen[id] = { id, part: d['part'] || d['name'] || '' };
        }
    });
    return PARTS.map(p => seen[p] || { id: p, part: '' });
}

const generateCharId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }
  
  return result;
}

const shortenString = (str: any)=> {
    return btoa(encodeURIComponent(JSON.stringify(str)));
}

const deShortenString = (str: string): any => {
    if(!str || str == '') return '';
    // Split the (potentially huge) string before decoding/parsing.
    // iOS Safari's atob/decodeURIComponent choke on very long strings, so we
    // process it in chunks, then JSON.parse the fully decoded JSON string.
    const decodedString = atobChunked(str);    
    const jsonString = decodeURIComponentChunked(decodedString);
    return parseJSONChunked(jsonString);
}

const atobChunked = (s: string): string => {
    const CHUNK = 32768; // multiple of 4 keeps base64 decoding char-aligned
    let out = '';
    for (let i = 0; i < s.length; i += CHUNK) {
        out += atob(s.slice(i, i + CHUNK));
    }
    return out;
}

const decodeURIComponentChunked = (s: string): string => {
    const CHUNK = 32768;
    let out = '';
    let i = 0;
    while (i < s.length) {
        let end = i + CHUNK;
        if (end > s.length) end = s.length;
        // Don't cut through a %XX escape sequence produced by encodeURIComponent
        while (end < s.length && (s[end] === '%' || s[end - 1] === '%' || s[end - 2] === '%')) {
            end -= 1;
        }
        out += decodeURIComponent(s.slice(i, end));
        i = end;
    }
    return out;
}

const parseJSONChunked = (s: string): any => {
    const str = (s || '').trim();
    if (str === '') return '';
    const first = str[0];
    // Primitives (string/number/bool/null) are parsed directly.
    if (first !== '[' && first !== '{') {
        return JSON.parse(str);
    }

    const isArray = first === '[';

    // Locate the matching close bracket of the top-level container.
    let depth = 0;
    let inStr = false;
    let esc = false;
    let endInner = -1;
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (inStr) {
            if (esc) esc = false;
            else if (c === '\\') esc = true;
            else if (c === '"') inStr = false;
            continue;
        }
        if (c === '"') { inStr = true; continue; }
        if (c === '{' || c === '[') depth++;
        else if (c === '}' || c === ']') {
            depth--;
            if (depth === 0) { endInner = i; break; }
        }
    }

    if (endInner === -1) {
        return JSON.parse(str); // fallback
    }

    const inner = str.slice(1, endInner);
    if (inner.trim() === '') {
        return isArray ? [] : {};
    }

    // Split the inner content into top-level elements (commas at depth 0).
    const elements: string[] = [];
    let d2 = 0, inS2 = false, e2 = false, start = 0;
    for (let i = 0; i < inner.length; i++) {
        const c = inner[i];
        if (inS2) {
            if (e2) e2 = false;
            else if (c === '\\') e2 = true;
            else if (c === '"') inS2 = false;
            continue;
        }
        if (c === '"') { inS2 = true; continue; }
        if (c === '{' || c === '[') d2++;
        else if (c === '}' || c === ']') d2--;
        else if (c === ',' && d2 === 0) {
            elements.push(inner.slice(start, i));
            start = i + 1;
        }
    }
    elements.push(inner.slice(start));

    if (isArray) {
        return elements
            .map(e => {
                const t = e.trim();
                return t === '' ? undefined : parseJSONChunked(t);
            })
            .filter(v => v !== undefined);
    }

    // Object: split each "key":value pair, then parse the value (recursively).
    const obj: any = {};
    for (const el of elements) {
        const t = el.trim();
        if (t === '') continue;
        let d3 = 0, inS3 = false, e3 = false, colon = -1;
        for (let i = 0; i < t.length; i++) {
            const c = t[i];
            if (inS3) {
                if (e3) e3 = false;
                else if (c === '\\') e3 = true;
                else if (c === '"') inS3 = false;
                continue;
            }
            if (c === '"') { inS3 = true; continue; }
            if (c === '{' || c === '[') d3++;
            else if (c === '}' || c === ']') d3--;
            else if (c === ':' && d3 === 0) { colon = i; break; }
        }
        if (colon === -1) continue;
        const key = JSON.parse(t.slice(0, colon).trim());
        const val = t.slice(colon + 1).trim();
        obj[key] = parseJSONChunked(val);
    }
    return obj;
}

const saveContent = async (clear: boolean = true)=> {
    // console.log(contentData.value);
    if(isSaving.value == true) return;
    const loading = await loadingController.create({
        message: 'Saving...'
    });
    await loading.present();
    isSaving.value = true;
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const turso = createClient({
        url: dbUrl,
        authToken: dbToken,
    });     

    const metaId = generateCharId();
    let questions = {};
    contentData.value.certifications.forEach((v: any) => {
        let question: any = [];
        if(!(contentData.value.domains as any)[v.id]) (contentData.value.domains as any)[v.id] = [];
        (contentData.value.domains as any)[v.id].forEach((domain: any) => {   
            const qs = (contentData.value.question as any)[v.id] && (contentData.value.question as any)[v.id][domain['id']];
            if(qs && qs.length > 0) question = question.concat(qs['data'] || qs);
        });
        const mockupQs = (contentData.value.mockupQuestion as any)[v.id];
        if(mockupQs && mockupQs.length > 0) question = question.concat(mockupQs['data'] || mockupQs);
        (questions as any)[v.id] = question;
    });    

    // check if existed -> update, not create
    const meta = await turso.execute({
        sql: `SELECT id FROM meta WHERE app_id='${contentData.value.appId}'`
    })    
    if(meta.rows.length > 0) {
        await turso.batch([{
            sql: `UPDATE meta SET 
                    app_id='${contentData.value.appId}',
                    app_name='${contentData.value.appName}',
                    app_ids='${shortenString(contentData.value.certifications.map((v: any) => v.id))}',
                    certifications='${shortenString(contentData.value.certifications)}',
                    domains='${shortenString(contentData.value.domains)}',
                    content='${shortenString(contentData.value.content)}',
                    remark='${shortenString(contentData.value.remark)}'
                    WHERE id = '${meta.rows[0].id}'     
                `
        }, {
            sql: `UPDATE questions SET 
                    json='${shortenString(questions)}'
                    WHERE meta_id = '${meta.rows[0].id}' 
                `
        }])
        isSaving.value = false;
        await loading.dismiss();
        if(clear) createAgain();
        const toast = await toastController.create({
            message: 'Successfully updated.',
            duration: 2000,
            position: 'bottom',
            color: "secondary"
        });

        await toast.present();
        return;
    }    

    try {
        await turso.batch([{
            sql: `
                INSERT INTO meta 
                VALUES('${metaId}', '${contentData.value.appId}', '${contentData.value.appName}', '${shortenString(contentData.value.certifications.map((v: any) => v.id))}', '${shortenString(contentData.value.certifications)}', '${shortenString(contentData.value.domains)}', '${shortenString(contentData.value.content)}', 'active', '${shortenString(contentData.value.remark)}')
            `
        }, {
            sql: `
                INSERT INTO questions 
                VALUES(null, '${metaId}', '${shortenString(questions)}')
            `
        }]);
        isSaving.value = false;
        await loading.dismiss();
        if(clear) createAgain();
        const toast = await toastController.create({
            message: 'Successfully created.',
            duration: 2000,
            position: 'bottom',
            color: "secondary"
        });

        await toast.present();
    } catch(e){
        console.log(e);
        isSaving.value = false;
        await loading.dismiss();
        const toast = await toastController.create({
            message: 'Something went wrong.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
    } 
}

const saveContentKeep = async ()=> {
    await saveContent(false);
}

const getNotes = (certId: string)=> {
    let notes = `const notes = ${JSON.stringify((contentData.value.domains as any)[certId], null, 6)}`;    
    // console.log(contentData.value.content)
    if(!(contentData.value.domains as any)[certId]) (contentData.value.domains as any)[certId] = [];
    (contentData.value.domains as any)[certId].forEach((v: any) => {        
        notes = notes + '\n\n';
        // console.log((contentData.value.content as any)[certId]['note'][v['id']])
        if((contentData.value.content as any)[certId] && (contentData.value.content as any)[certId]['note']) {
            notes = notes + `const ${v['id']}=\`\n\n${(contentData.value.content as any)[certId]['note'][v['id']]}\n\n\``
        }
    });
    notes = notes + '\n\n';            
    notes = notes + `export default {
        list: notes,
        ${(contentData.value.domains as any)[certId].map((v: any)=> v['id']).join(', ')}
    };`    
    // (contentData.value.content as any)[certId]['note']
    return notes;
}

const downloadQuestions = async ()=> {
    const zip = new JSZip();
    contentData.value.certifications.forEach((v: any) => {
        const folder = zip.folder(v.id); 
        let question: any = [];
        if(!(contentData.value.domains as any)[v.id]) (contentData.value.domains as any)[v.id] = [];
        (contentData.value.domains as any)[v.id].forEach((domain: any) => {   
            const qs = (contentData.value.question as any)[v.id] && (contentData.value.question as any)[v.id][domain['id']];
            if(qs && qs.length > 0) question = question.concat(qs['data'] || qs);
        });
        const mockupQs = (contentData.value.mockupQuestion as any)[v.id];
        if(mockupQs && mockupQs.length > 0) question = question.concat(mockupQs['data'] || mockupQs);
        folder?.file(`${v.id}.json`, JSON.stringify({
            data: question.map((v: any)=> {
                return {
                    ...v,
                    question: v['question'].substring(0, v['question'].lastIndexOf('?') + 1).trim()
                }
            }),
            version: 1
        }, null, 6));
    })
    try {
        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" });

        // Create a temporary download link
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `questions-${contentData.value.appId}-${new Date().getTime()}.zip`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error generating zip:", error);
    }
}

const downloadMockupQuestions = async ()=> {
    const zip = new JSZip();
    contentData.value.certifications.forEach((v: any) => {
        const folder = zip.folder(v.id); 
        let question: any = [];
        const mockupQs = (contentData.value.mockupQuestion as any)[v.id];
        if(mockupQs && mockupQs.length > 0) question = question.concat(mockupQs['data'] || mockupQs);
        folder?.file(`${v.id}-mockup.json`, JSON.stringify({
            data: question.map((v: any)=> {
                return {
                    ...v,
                    question: v['question'].substring(0, v['question'].lastIndexOf('?') + 1).trim()
                }
            }),
            version: 1
        }, null, 6));
    })
    try {
        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" });

        // Create a temporary download link
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `mockup-questions-${contentData.value.appId}-${new Date().getTime()}.zip`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error generating zip:", error);
    }
}

const downloadContent = async ()=> {
    const zip = new JSZip();

    // Add a text file
    zip.file("meta.json", JSON.stringify({
        appId: contentData.value.appId,
        appName: contentData.value.appName,
        appIds: contentData.value.certifications.map((v: any) => v.id),
        certifications: contentData.value.certifications,
        domains: contentData.value.domains,
        content: contentData.value.content
    }, null, 6));

    // Create a folder and add an image/file
    contentData.value.certifications.forEach((v: any)=> {
        const folder = zip.folder(v.id); 
        if((contentData.value.content as any)[v.id] && (contentData.value.content as any)[v.id]['note']) folder?.file("notes.ts", getNotes(v.id))
        if((contentData.value.content as any)[v.id] && (contentData.value.content as any)[v.id]['glossary']) folder?.file("glossary.ts", (contentData.value.content as any)[v.id]['glossary'])
        if((contentData.value.content as any)[v.id] && (contentData.value.content as any)[v.id]['examtip']) folder?.file("exam-tip.ts", (contentData.value.content as any)[v.id]['examtip'])
        if((contentData.value.content as any)[v.id] && (contentData.value.content as any)[v.id]['cheatsheet']) folder?.file("cheat-sheet.ts", (contentData.value.content as any)[v.id]['cheatsheet'])
    })
    // const imgFolder = zip.folder("images");
    // Assuming 'sampleData' is your base64 string or ArrayBuffer
    // (imgFolder as any).file("sample.png", "base64-data-here...", { base: true });

    try {
        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" });

        // Create a temporary download link
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${contentData.value.appId}-${new Date().getTime()}.zip`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error generating zip:", error);
    }
}

const createAgain = ()=> {
    contentData.value = {
        appId: '',
        appName: '',
        certifications: [
            
        ], 
        domains: {
                
        },
        content: {

        },
        question: {

        },
        mockupQuestion: {

        },
        remark: ''
    };
    selectedCertification.value = {
        id: '',
        name: '',
        calculation: false,
        mockupCalculation: false
    }
    deleteDraft();
}

const loadMeta = async ()=> {
    try {
        if((window as any)['showOpenFilePicker']){
            const [fileHandle] = await (window as any).showOpenFilePicker({ types: [
                {
                    description: 'Content JSON file',
                    accept: {
                        'image/*': ['.json']
                    }
                }
            ]});
            
            const file = await fileHandle.getFile();
            const contents = await file.text();
            const meta = JSON.parse(contents);
            contentData.value = {
                appId: meta['appId'],
                appName: meta['appName'],
                certifications: meta['certifications'], 
                domains: meta['domains'],
                content: meta['content'] || {},
                question: {
                    
                },
                mockupQuestion: {

                },
                remark: meta['remark'] || ''
            }
            selectedCertification.value = {
                id: meta['certifications'][0].id,
                name: meta['certifications'][0].name,
                calculation: !!meta['certifications'][0].calculation,
                mockupCalculation: !!meta['certifications'][0].mockupCalculation
            }
        }
    } catch(e) {
        console.log(e)
        const toast = await toastController.create({
            message: 'Something went wrong.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
    }    
}

const assignLoadedQuestions = (certId: string, questions: any)=> {
    if(!questions || !Array.isArray(questions)) return;
    if(!(contentData.value as any).domains[certId]) return;
    if(!(contentData.value as any).question[certId]) (contentData.value as any).question[certId] = {};
    if(!(contentData.value as any).mockupQuestion[certId]) (contentData.value as any).mockupQuestion[certId] = [];

    const regular: any[] = [];
    const mockup: any[] = [];
    questions.forEach((q: any) => {
        if(q && (q['type'] === 'mockup' || (q['quizId'] && q['quizId'].indexOf('_mockup') > -1))) {
            mockup.push(q);
        } else {
            regular.push(q);
        }
    });

    const groupedQuestions = groupBy(regular, 'standard');
    for(const standard in groupedQuestions) {
        const dm = (contentData.value as any).domains[certId].find((v: any) => {
            return v['part'] == standard
        });
        if(dm) {
            (contentData.value as any).question[certId][dm.id] = groupedQuestions[standard];
        }
    }
    (contentData.value as any).mockupQuestion[certId] = mockup;
}

const loadQuestion = async ()=> {
    try {
        if((window as any)['showOpenFilePicker']){
            const [fileHandle] = await (window as any).showOpenFilePicker({ types: [
                {
                    description: 'Question JSON file',
                    accept: {
                        'image/*': ['.json']
                    }
                }
            ]});
            const file = await fileHandle.getFile();
            const contents = await file.text();
            const questions = JSON.parse(contents);
            assignLoadedQuestions(selectedCertification.value.id, questions['data'] || questions);

        }
    } catch(e) {
        console.log(e)
        const toast = await toastController.create({
            message: 'Something went wrong.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
    }    
}

const loadFromDB = async (data: any)=> {
    const loading = await loadingController.create({
        message: 'Loading...'
    });
    await loading.present();
    try {
        const dbUrl = import.meta.env.VITE_DB_URL;
        const dbToken = import.meta.env.VITE_DB_TOKEN;

        const turso = createClient({
            url: dbUrl,
            authToken: dbToken,
        });             
        const result = await turso.execute({
            sql: `SELECT * FROM meta as m INNER JOIN questions as q ON m.id = q.meta_id WHERE m.app_id='${data.appID}' `
        });            
        if(result.rows && result.rows.length > 0){
            const meta: any = result.rows[0];
            contentData.value = {
                appId: meta['app_id'],
                appName: meta['app_name'],
                certifications: deShortenString(meta['certifications']), 
                domains: deShortenString(meta['domains']),
                content: deShortenString(meta['content']) || {},
                question: {

                },
                mockupQuestion: {

                },
                remark: deShortenString(meta['remark'])
            }            
            if(deShortenString(meta['certifications'])[0]) {
                selectedCertification.value = {
                    id: deShortenString(meta['certifications'])[0].id,
                    name: deShortenString(meta['certifications'])[0].name,
                    calculation: !!deShortenString(meta['certifications'])[0].calculation,
                    mockupCalculation: !!deShortenString(meta['certifications'])[0].mockupCalculation
                }
            }            

            // console.log(decodeURIComponent(atob(meta['json'])))                     
            const questions = deShortenString(meta['json']);
            // console.log(questions);
            contentData.value.certifications.forEach((v: any)=> {
                if(!(contentData.value as any).question[v.id]) (contentData.value as any).question[v.id] = {};
                if(!(contentData.value as any).mockupQuestion[v.id]) (contentData.value as any).mockupQuestion[v.id] = [];
                assignLoadedQuestions(v.id, questions[v.id]);
            });

        }
        isLoading.value = false;
        await loading.dismiss();
    } catch(e){
        console.log(e);
        isLoading.value = false;
        await loading.dismiss();
    }    
}

const loadContent = async ()=> {
    const alertInputs: any = [
        {
            placeholder: 'App ID',
            name: 'appID'
        }
    ];
    const alert = await alertController.create({
      header: 'Enter App ID to Load',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Load',
        handler: async (data)=> {   
            setTimeout(()=> {
                loadFromDB(data);       
            }, 200);                         
        }
      }],
      inputs: alertInputs,
      mode: 'md'
    });
    await alert.present();
}

const mainMenu = async ()=> {
    const buttons: any[] = [{
        text: 'CREATE AGAIN',
        handler: createAgain
    }];
    if(contentData.value['appId'] == '') {
        buttons.push({
            text: isLoading.value ? 'LOADING...' : 'LOAD CONTENT',
            handler: loadContent
        });
    } else {
        buttons.push({
            text: isSaving.value ? 'SAVING...' : 'SAVE CONTENT',
            handler: () => saveContent(true)
        });
        buttons.push({
            text: 'SAVE & KEEP',
            handler: saveContentKeep
        });
    }
    const actionSheet = await actionSheetController.create({
        header: 'Menu',
        buttons,
        mode: 'md'
    });

    await actionSheet.present();
}

const moreOption = async ()=> {
    const actionSheet = await actionSheetController.create({
        header: 'More Options',
        buttons: [{
            text: "DOWNLOAD CONTENT",
            handler: downloadContent
        }, {
            text: "LOAD QUESTION",
            handler: loadQuestion
        }, {
            text: "DOWNLOAD QUESTIONS",
            handler: downloadQuestions
        }, {
            text: "DOWNLOAD MOCKUP QUESTIONS",
            handler: downloadMockupQuestions
        }],
        mode: 'md'
    });

    await actionSheet.present();
}

const viewMD = ()=> {
    if(contentData.value.remark != '') {
        openText(contentData.value.remark, 'markdown', false);
    }
}

const onRemark = async ()=> {
    if(contentData.value.appId == '') return;    
    const alertInputs: any = [
        {
            placeholder: 'Paste Remark Text or Type In',
            name: 'json',
            type: 'textarea',
            attributes: {
               id: 'alert-paste-field'
            }
        }
    ];
    const alert = await alertController.create({
      header: 'Remark',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Set',
        handler: async (data)=> {      
            if(data.json) {                
                contentData.value.remark = data.json;
            }            
        }
      }],
      inputs: alertInputs,
      mode: 'md'
    });

    const inputEl = document.getElementById('alert-paste-field') as HTMLInputElement;
    if (inputEl) {
        let processed = false;
        const handleRemark = (data: string) => {
            if (processed || !data) return;
            processed = true;
            contentData.value.remark = data;
            alert.dismiss();
        };
        inputEl.addEventListener('paste', (event: ClipboardEvent) => {
            handleRemark(event.clipboardData?.getData('text') || '');
        });
        inputEl.addEventListener('input', (event: Event) => {
            handleRemark((event.target as HTMLInputElement).value);
        });
    }

    await alert.present();
}

const openText = async (text: any, type?: string, stringify?: boolean, save?: any)=> {
    if(text == '') return;

    const mode = type || "json"; // Change to "markdown" if editing markdown!
    const title = mode === 'markdown' ? 'Markdown Viewer' : 'Live Editor';

    try {
        const modal = await modalController.create({
            component: TextModal,
            componentProps: {
                content: text,
                mode,
                stringify: stringify !== false,
                title
            },
            breakpoints: [0, 1],
            initialBreakpoint: 1,
            mode: 'md'
        });

        await modal.present();
        const { data } = await modal.onDidDismiss();
        if (data && data.content != null && save) {
            applyTextSave(data.content, save);
        }
    } catch (e) {
        console.error('Failed to open text modal:', e);
    }
}

const applyTextSave = (content: any, save: any)=> {
    const certId = selectedCertification.value.id;
    const parsed = (() => {
        if (typeof content !== 'string') return content;
        try { return JSON.parse(content); } catch (e) { return null; }
    })();

    if (save.type === 'domains') {
        if (parsed) (contentData.value.domains as any) = parsed;
    } else if (save.type === 'questions') {
        if (parsed) {
            if(!(contentData.value.question as any)[certId]) (contentData.value.question as any)[certId] = {};
            (contentData.value.question as any)[certId][save.domainId] = parsed;
        }
    } else if (save.type === 'mockup') {
        if (parsed) {
            (contentData.value.mockupQuestion as any)[certId] = parsed;
        }
    } else if (save.type === 'note') {
        if(!(contentData.value.content as any)[certId]) (contentData.value.content as any)[certId] = {};
        if(!(contentData.value.content as any)[certId]['note']) (contentData.value.content as any)[certId]['note'] = {};
        (contentData.value.content as any)[certId]['note'][save.domainId] = content;
    }
}

const AI_MODELS = [
    "gemini/official",
    "google/gemini-3.5-flash-lite",
    "google/gemini-3.1-flash-lite",
    "google/gemini-3.5-flash",
    "google/gemini-3.6-flash",
    "inclusionai/ling-3.0-flash:free",
    "kilo-auto/free",
    "stepfun/step-3.7-flash:free",
    "google/gemini-2.5-flash"    
];

const AI_ENDPOINTS = [
    "https://kilo-ai.n-o.deno.net/"
];

// How many AI batch requests to fire concurrently per domain/cert while generating.
// Network calls are parallelized; results are merged sequentially to avoid races.
const GEN_CONCURRENCY = 4;

const postAI = async (url: string, data: any) => {
    const response = await CapacitorHttp.post({
        url,
        headers: {
            "Content-Type": "application/json",
        },
        data
    });

    if (response.status < 200 || response.status >= 300) {
        const error = response.data;
        throw new Error(`${error && error['error'] && error['error']['message'] || response.status }`);
    }

    return response;
};

const processAIResult = (type: string, domain: any, content: string, write: boolean = true) => {
    const json = content || '';
    if (json && json != '') {
        if(type == 'calc') return json;
        if(type == 'question') {
            const jsonString = jsonrepair(json); 
            const parsed = JSON.parse(jsonString);
            const questions = parsed['data'] || parsed;
            if (write && questions.length > 0) {    
                if(!(contentData.value.question as any)[selectedCertification.value.id]) (contentData.value.question as any)[selectedCertification.value.id] = {};                
                if(!(contentData.value.question as any)[selectedCertification.value.id][domain['id']]) (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = [];
                (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = validateQuestions(questions, domain);
            }
            return questions;
        } else if(type == 'mockup') {
            const jsonString = jsonrepair(json);
            const parsed = JSON.parse(jsonString);
            const questions = parsed['data'] || parsed;
            if (write && questions.length > 0) {
                if(!(contentData.value.mockupQuestion as any)[selectedCertification.value.id]) (contentData.value.mockupQuestion as any)[selectedCertification.value.id] = [];
                (contentData.value.mockupQuestion as any)[selectedCertification.value.id] = validateMockupQuestions(questions);
            }
            return questions;
        } else if(type == 'domain') {
            const jsonString = jsonrepair(json); 
            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed) && parsed.length > 0) {
                (contentData.value.domains as any)[selectedCertification.value.id] = normalizeDomains(parsed);
            }
        } else if(type == 'note') {
            if(!(contentData.value.content as any)[selectedCertification.value.id]) (contentData.value.content as any)[selectedCertification.value.id] = {};
            if(!(contentData.value.content as any)[selectedCertification.value.id][type]) (contentData.value.content as any)[selectedCertification.value.id][type] = {};
            (contentData.value.content as any)[selectedCertification.value.id][type][domain['id']] = json;
        } else {
            if(!(contentData.value.content as any)[selectedCertification.value.id]) (contentData.value.content as any)[selectedCertification.value.id] = {};
            (contentData.value.content as any)[selectedCertification.value.id][type] = json;
        }
    }
}

const callAI = async (type: string, model: string, domain?: any, write: boolean = true)=> {
    if (model === 'gemini/official') {
        return await callGemini(type, domain, write);
    }

    const str = buildPrompt(type, domain);             
    const key = localStorage.getItem("KILO_KEY") || '';

    const data = {
        prompt: JSON.stringify(str),
        model,
        key
    };

    let lastError: any;
    let response: any;
    for (const url of AI_ENDPOINTS) {
        try {
            response = await postAI(url, data);
            break;
        } catch (e) {
            console.error(`AI endpoint failed: ${url}`, e);
            lastError = e;
        }
    }

    if (!response) {
        throw lastError || new Error("All AI endpoints failed");
    }

    const result = response.data;
    return processAIResult(type, domain, result['content'] || '', write);
}

const callGemini = async (type: string, domain?: any, write: boolean = true)=> {
    const str = buildPrompt(type, domain);             
    const model = localStorage.getItem("GEMINI_MODEL");
    const key = localStorage.getItem("GEMINI_KEY") || '';

    const response = await CapacitorHttp.post({
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key
        },
        data: {
            "contents": [
                {
                    "parts": [
                        {
                            "text": JSON.stringify(str)
                        }
                    ]
                }
            ],
            "generationConfig": {
                "thinkingConfig": {
                    "thinkingLevel": "LOW"
                }
            }
        }
    });

    if (response.status < 200 || response.status >= 300) {
        const error = response.data;
        throw new Error(`${error && error['error'] && error['error']['message'] || response.status }`);
    }

    const result = response.data;
    const json = result && result['candidates'] && result['candidates'][0] && result['candidates'][0]['content'] && result['candidates'][0]['content']['parts'] && result['candidates'][0]['content']['parts'][0] && result['candidates'][0]['content']['parts'][0]['text']
        ? result['candidates'][0]['content']['parts'][0]['text'].replace(/^```(?:json)?\s*|\s*```$/g, "").trim()
        : '';

    return processAIResult(type, domain, json, write);
}

const showAI = async (type: string, domain?: any)=> {
    if(type != 'cert' && selectedCertification.value.id == '') return;
    if((type == 'note' || type == 'question') && !domain) return;

    const actionSheet = await actionSheetController.create({
        header: 'Pick Model',
        buttons: AI_MODELS.map((v) => {
            return {
                text: v,
                handler: ()=> {
                    setTimeout(async ()=> {
                        const loading = await loadingController.create({
                            message: 'Generating...',          
                        });
                        loading.present();   

                        try {
                            await callAI(type, v, domain);
                            await loading.dismiss();
                        } catch (error: any) {
                            console.log(error);
                            await loading.dismiss();
                            const alert = await alertController.create({
                                header: 'Error: AI',                        
                                message: error,
                                buttons: ['Ok'],
                            });

                            await alert.present();
                        }
                    }, 0); 
                }
            }            
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const generateAll = async (kind: 'global' | 'notes')=> {
    if(selectedCertification.value.id == '') return;
    if(kind == 'notes') {
        const domains = (contentData.value.domains as any)[selectedCertification.value.id];
        if(!domains || domains.length <= 0) return;
    }

    const actionSheet = await actionSheetController.create({
        header: 'Pick Model',
        buttons: AI_MODELS.map((v) => {
            return {
                text: v,
                handler: ()=> {
                    setTimeout(async ()=> {
                        const loading = await loadingController.create({
                            message: 'Generating...',
                        });
                        loading.present();

                        try {
                            if(kind == 'global') {
                                for (const t of ['glossary', 'cheatsheet', 'examtip']) {
                                    loading.message = `Generating ${t}...`;
                                    await callAI(t, v);
                                }
                            } else {
                                const domains = (contentData.value.domains as any)[selectedCertification.value.id] || [];
                                for (const d of domains) {
                                    loading.message = `Generating note ${d['id']}...`;
                                    await callAI('note', v, d);
                                }
                            }
                            await loading.dismiss();
                            const toast = await toastController.create({
                                message: 'Generated successfully.',
                                duration: 2000,
                                position: 'bottom',
                                color: "secondary"
                            });
                            await toast.present();
                        } catch (error: any) {
                            console.log(error);
                            await loading.dismiss();
                            const alert = await alertController.create({
                                header: 'Error: AI',                        
                                message: error,
                                buttons: ['Ok'],
                            });
                            await alert.present();
                        }
                    }, 0); 
                }
            }            
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const getQuestionCount = (domain: any)=> {
    const q = (contentData.value.question as any)[selectedCertification.value.id];
    return (q && q[domain['id']]) ? q[domain['id']].length : 0;
}

const generateQuestionsUntil = async (domain: any)=> {
    if(selectedCertification.value.id == '' || !domain) return;

    const actionSheet = await actionSheetController.create({
        header: 'Pick Model',
        buttons: AI_MODELS.map((v) => {
            return {
                text: v,
                handler: ()=> {
                    setTimeout(async ()=> {
                        let cancelled = false;
                        let dismissed = false;
                        const dismiss = async ()=> {
                            if(dismissed) return;
                            dismissed = true;
                            try { await loading.dismiss(); } catch (e) { /* ignore */ }
                        };

                        const loading = await loadingController.create({
                            message: 'Generating...',
                            buttons: [{
                                text: 'Cancel',
                                handler: ()=> {
                                    cancelled = true;
                                    return false;
                                }
                            }]
                        } as any);
                        await loading.present();

                        try {
                            let prev = getQuestionCount(domain);
                            let iterations = 0;
                            while(!cancelled && prev < 390 && iterations < 60) {
                                iterations++;
                                await callAI('question', v, domain);
                                const current = getQuestionCount(domain);
                                loading.message = `Generating... (${current}/390)`;
                                if(current <= prev) break;
                                prev = current;
                            }
                            await dismiss();
                            const toast = await toastController.create({
                                message: cancelled ? 'Generation cancelled.' : (prev >= 390 ? 'Reached 390 questions.' : 'No more new questions from AI.'),
                                duration: 2500,
                                position: 'bottom',
                                color: cancelled ? 'warning' : 'secondary'
                            });
                            await toast.present();
                        } catch (error: any) {
                            console.log(error);
                            await dismiss();
                            const alert = await alertController.create({
                                header: 'Error: AI',                        
                                message: error,
                                buttons: ['Ok'],
                            });
                            await alert.present();
                        }
                    }, 0); 
                }
            }            
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const getMockupCount = ()=> {
    const q = (contentData.value.mockupQuestion as any)[selectedCertification.value.id];
    return (q && q.length) ? q.length : 0;
}

const summary = computed(() => {
    const certs = (contentData.value.certifications || []).slice();
    if(certs.length === 0) return null;
    const list = certs.map((cert: any) => {
        const certId = cert.id;
        const domains = ((contentData.value.domains as any)[certId] || []).slice();
        const question = (contentData.value.question as any)[certId] || {};
        const mockup = (contentData.value.mockupQuestion as any)[certId] || [];
        const content = (contentData.value.content as any)[certId] || {};
        const questionTarget = domains.length * 390;
        const questionTotal = domains.reduce((sum: number, d: any) => sum + (question[d.id] ? question[d.id].length : 0), 0);
        const notes = content['note'] ? ['A','B','C','D'].filter((p: string) => content['note'][p]).length : 0;
        const domainStats = domains.map((d: any) => {
            const count = question[d.id] ? question[d.id].length : 0;
            return { id: d.id, part: d.part || d.name || '', count, done: count >= 390 };
        });
        return {
            id: certId,
            name: cert.name,
            domainCount: domains.length,
            glossary: !!content['glossary'],
            cheatsheet: !!content['cheatsheet'],
            examtip: !!content['examtip'],
            notes,
            questionTotal,
            questionTarget,
            mockupTotal: mockup.length,
            mockupTarget: 200,
            domainStats
        };
    });
    const totalQuestion = list.reduce((s: number, c: any) => s + c.questionTotal, 0);
    const totalQuestionTarget = list.reduce((s: number, c: any) => s + c.questionTarget, 0);
    const totalMockup = list.reduce((s: number, c: any) => s + c.mockupTotal, 0);
    return {
        list,
        certCount: list.length,
        totalQuestion,
        totalQuestionTarget,
        totalMockup,
        activeId: selectedCertification.value.id
    };
});

const selectCertSummary = (id: string) => {
    const c = (contentData.value.certifications as any).find((x: any) => x.id === id);
    if(c) selectedCertification.value = c;
};

const generateMockupUntil = async ()=> {
    if(selectedCertification.value.id == '') return;

    const actionSheet = await actionSheetController.create({
        header: 'Pick Model',
        buttons: AI_MODELS.map((v) => {
            return {
                text: v,
                handler: ()=> {
                    setTimeout(async ()=> {
                        let cancelled = false;
                        let dismissed = false;
                        const dismiss = async ()=> {
                            if(dismissed) return;
                            dismissed = true;
                            try { await loading.dismiss(); } catch (e) {}
                        };

                        const loading = await loadingController.create({
                            message: 'Preparing generation...',
                            buttons: [{
                                text: 'Cancel',
                                handler: ()=> {
                                    cancelled = true;
                                    return false;
                                }
                            }]
                        } as any);
                        await loading.present();

                        try {
                            let prev = getMockupCount();
                            let iterations = 0;
                            while(!cancelled && prev < 200 && iterations < 60) {
                                iterations++;
                                await callAI('mockup', v);
                                const current = getMockupCount();
                                loading.message = `Generating... (${current}/200)`;
                                if(current <= prev) break;
                                prev = current;
                            }
                            await dismiss();
                            const toast = await toastController.create({
                                message: cancelled ? 'Generation cancelled.' : (prev >= 200 ? 'Reached 200 questions.' : 'No more new questions from AI.'),
                                duration: 2500,
                                position: 'bottom',
                                color: cancelled ? 'warning' : 'secondary'
                            });
                            await toast.present();
                        } catch (error: any) {
                            console.log(error);
                            await dismiss();
                            const alert = await alertController.create({
                                header: 'Error: AI',
                                message: error,
                                buttons: ['Ok']
                            });

                            await alert.present();
                        }
                    }, 0);
                }
            }
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const generateAllMenu = async ()=> {
    if(contentData.value.certifications.length <= 0) return;
    const modal = await modalController.create({
        component: GenerateAllModal,
        componentProps: {
            certifications: contentData.value.certifications.map((c: any) => ({
                id: c.id,
                name: c.name,
                calculation: !!c.calculation,
                mockupCalculation: !!c.mockupCalculation
            })),
            onCheckCert: async (certId: string, kind: 'question' | 'mockup'): Promise<boolean> => {
                const cert = (contentData.value.certifications as any[]).find((c) => c.id === certId);
                if(cert) selectedCertification.value = cert;
                return kind === 'question' ? await checkCalculation() : await checkMockupCalculation();
            },
            onCheckAll: async (kind: 'question' | 'mockup'): Promise<Record<string, boolean>> => {
                return checkAllCalculation(kind);
            }
        },
        breakpoints: [0, 1],
        initialBreakpoint: 1,
        mode: 'md'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if(!data) return;
    if(data.certifications) {
        for (const c of data.certifications as any[]) {
            const cert = (contentData.value.certifications as any[]).find((x) => x.id === c.id);
            if(cert) {
                cert.calculation = !!c.calculation;
                cert.mockupCalculation = !!c.mockupCalculation;
            }
        }
    }
    if(data.type === 'questions') generateAllQuestions();
    else if(data.type === 'mockups') generateAllMockups();
    else if(data.type === 'content') generateAllContent((data.certifications as any[]).map((c: any) => c.id));
}

const generateAllMockups = async ()=> {
    if(contentData.value.certifications.length <= 0) {
        const toast = await toastController.create({
            message: 'Add a certification first.',
            duration: 2500,
            position: 'bottom',
            color: "warning"
        });
        await toast.present();
        return;
    }

    const actionSheet = await actionSheetController.create({
        header: 'Pick Model',
        buttons: AI_MODELS.map((v) => {
            return {
                text: v,
                handler: ()=> {
                    setTimeout(async ()=> {
                        let cancelled = false;
                        let dismissed = false;
                        const dismiss = async ()=> {
                            if(dismissed) return;
                            dismissed = true;
                            try { await loading.dismiss(); } catch (e) { /* ignore */ }
                        };

                        const loading = await loadingController.create({
                            message: 'Preparing generation...',
                            buttons: [{
                                text: 'Cancel',
                                handler: ()=> {
                                    cancelled = true;
                                    return false;
                                }
                            }]
                        } as any);
                        await loading.present();

                        const previousCert = selectedCertification.value.id;
                        const certCount = contentData.value.certifications.length;
                        let certIndex = 0;

                        loading.message = `Generating mock up questions for ${certCount} certification${certCount > 1 ? 's' : ''}...`;

                        try {
                            for (const cert of contentData.value.certifications as any[]) {
                                certIndex++;
                                selectedCertification.value = cert;
                                if(cancelled) break;
                                let prev = getMockupCount();
                                let iterations = 0;
                                while(!cancelled && prev < 200 && iterations < 60) {
                                    iterations++;
                                    const tasks: Promise<any>[] = [];
                                    for (let k = 0; k < GEN_CONCURRENCY; k++) {
                                        tasks.push(callAI('mockup', v, undefined, false));
                                    }
                                    const settled = await Promise.allSettled(tasks);
                                    for (const s of settled) {
                                        if (s.status === 'fulfilled' && s.value && s.value.length > 0) {
                                            if(!(contentData.value.mockupQuestion as any)[selectedCertification.value.id]) (contentData.value.mockupQuestion as any)[selectedCertification.value.id] = [];
                                            (contentData.value.mockupQuestion as any)[selectedCertification.value.id] = validateMockupQuestions(s.value);
                                        }
                                    }
                                    const cur = getMockupCount();
                                    loading.message = `${cert.name} (${certIndex}/${certCount}) — mock up ${cur}/200`;
                                    if(cur <= prev) break;
                                    prev = cur;
                                }
                            }
                            await dismiss();
                            const toast = await toastController.create({
                                message: cancelled ? 'Generation cancelled.' : 'Finished generating all mock up questions.',
                                duration: 2500,
                                position: 'bottom',
                                color: cancelled ? 'warning' : 'secondary'
                            });
                            await toast.present();
                        } catch (error: any) {
                            console.log(error);
                            await dismiss();
                            let savedCount = 0;
                            for (const c of contentData.value.certifications as any[]) {
                                const qs = (contentData.value.mockupQuestion as any)[c.id];
                                if (qs) savedCount += (qs.length || 0);
                            }
                            const alert = await alertController.create({
                                header: 'Error: AI',
                                message: `${(error && error.message) ? error.message : error}\n\n${savedCount} mock up question(s) generated so far have been saved locally and will be restored automatically when you reopen this app.`,
                                buttons: ['Ok']
                            });
                            await alert.present();
                        } finally {
                            try { await persistDraft(); } catch (e) { console.error('Failed to persist partial progress', e); }
                        }

                        if(previousCert != '') {
                            const prev = contentData.value.certifications.find((c: any) => c.id === previousCert);
                            if(prev) selectedCertification.value = prev;
                        }
                    }, 0);
                }
            }
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const generateAllQuestions = async ()=> {
    const hasCerts = contentData.value.certifications.length > 0;
    const hasDomains = hasCerts && contentData.value.certifications.some((c: any) => {
        const domains = (contentData.value.domains as any)[c.id];
        return domains && domains.length > 0;
    });
    if(!hasCerts) {
        const toast = await toastController.create({
            message: 'Add a certification first.',
            duration: 2500,
            position: 'bottom',
            color: "warning"
        });
        await toast.present();
        return;
    }
    if(!hasDomains) {
        const toast = await toastController.create({
            message: 'Add domains to a certification first.',
            duration: 2500,
            position: 'bottom',
            color: "warning"
        });
        await toast.present();
        return;
    }

    const actionSheet = await actionSheetController.create({
        header: 'Pick Model',
        buttons: AI_MODELS.map((v) => {
            return {
                text: v,
                handler: ()=> {
                    setTimeout(async ()=> {
                        let cancelled = false;
                        let dismissed = false;
                        const dismiss = async ()=> {
                            if(dismissed) return;
                            dismissed = true;
                            try { await loading.dismiss(); } catch (e) { /* ignore */ }
                        };

                        const loading = await loadingController.create({
                            message: 'Preparing generation...',
                            buttons: [{
                                text: 'Cancel',
                                handler: ()=> {
                                    cancelled = true;
                                    return false;
                                }
                            }]
                        } as any);
                        await loading.present();

                        const previousCert = selectedCertification.value.id;
                        const certCount = contentData.value.certifications.length;
                        const allDomainsTotal = contentData.value.certifications.reduce((sum: number, c: any) => {
                            return sum + (((contentData.value.domains as any)[c.id] || []).length);
                        }, 0);
                        let certIndex = 0;
                        let domainGlobalIndex = 0;

                        loading.message = `Generating questions for ${certCount} certification${certCount > 1 ? 's' : ''} (${allDomainsTotal} domains)...`;

                        try {
                            for (const cert of contentData.value.certifications as any[]) {
                                certIndex++;
                                selectedCertification.value = cert;
                                const domains = ((contentData.value.domains as any)[cert.id] || []) as any[];
                                const domainCount = domains.length;

                                for (let dIdx = 0; dIdx < domainCount; dIdx++) {
                                    const domain = domains[dIdx];
                                    domainGlobalIndex++;
                                    if(cancelled) break;
                                    let prev = getQuestionCount(domain);
                                    let iterations = 0;
                                    while(!cancelled && prev < 390 && iterations < 60) {
                                        iterations++;
                                        const tasks: Promise<any>[] = [];
                                        for (let k = 0; k < GEN_CONCURRENCY; k++) {
                                            tasks.push(callAI('question', v, domain, false));
                                        }
                                        const settled = await Promise.allSettled(tasks);
                                        for (const s of settled) {
                                            if (s.status === 'fulfilled' && s.value && s.value.length > 0) {
                                                if(!(contentData.value.question as any)[selectedCertification.value.id]) (contentData.value.question as any)[selectedCertification.value.id] = {};
                                                if(!(contentData.value.question as any)[selectedCertification.value.id][domain['id']]) (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = [];
                                                (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = validateQuestions(s.value, domain);
                                            }
                                        }
                                        const current = getQuestionCount(domain);
                                        loading.message = `${cert.name} (${certIndex}/${certCount}) · Part ${domain['id']}: ${domain['part'] || domain['name'] || ''} — ${current}/390  [Domain ${domainGlobalIndex}/${allDomainsTotal}]`;
                                        if(current <= prev) break;
                                        prev = current;
                                    }
                                }

                                if(cancelled) break;
                            }
                            await dismiss();
                            const toast = await toastController.create({
                                message: cancelled ? 'Generation cancelled.' : 'Finished generating all question batches.',
                                duration: 2500,
                                position: 'bottom',
                                color: cancelled ? 'warning' : 'secondary'
                            });
                            await toast.present();
                        } catch (error: any) {
                            console.log(error);
                            await dismiss();
                            let savedCount = 0;
                            for (const c of contentData.value.certifications as any[]) {
                                const qs = (contentData.value.question as any)[c.id];
                                if (qs) {
                                    for (const k in qs) savedCount += ((qs[k] && qs[k].length) || 0);
                                }
                            }
                            const alert = await alertController.create({
                                header: 'Error: AI',
                                message: `${(error && error.message) ? error.message : error}\n\n${savedCount} question(s) generated so far have been saved locally and will be restored automatically when you reopen this app.`,
                                buttons: ['Ok']
                            });
                            await alert.present();
                        } finally {
                            try { await persistDraft(); } catch (e) { console.error('Failed to persist partial progress', e); }
                        }

                        if(previousCert != '') {
                            const prev = contentData.value.certifications.find((c: any) => c.id === previousCert);
                            if(prev) selectedCertification.value = prev;
                        }
                    }, 0);
                }
            }
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const generateAllContent = async (certIds?: string[])=> {
    const certFilter = certIds ? new Set(certIds) : null;
    const certs = certFilter
        ? contentData.value.certifications.filter((c: any) => certFilter.has(c.id))
        : contentData.value.certifications;
    if(certs.length <= 0) {
        const toast = await toastController.create({
            message: certFilter ? 'Select at least one certification.' : 'Add a certification first.',
            duration: 2500,
            position: 'bottom',
            color: "warning"
        });
        await toast.present();
        return;
    }

    const actionSheet = await actionSheetController.create({
        header: 'Pick Model',
        buttons: AI_MODELS.map((v) => {
            return {
                text: v,
                handler: ()=> {
                    setTimeout(async ()=> {
                        let cancelled = false;
                        let dismissed = false;
                        const dismiss = async ()=> {
                            if(dismissed) return;
                            dismissed = true;
                            try { await loading.dismiss(); } catch (e) { /* ignore */ }
                        };

                        const loading = await loadingController.create({
                            message: 'Preparing generation...',
                            buttons: [{
                                text: 'Cancel',
                                handler: ()=> {
                                    cancelled = true;
                                    return false;
                                }
                            }]
                        } as any);
                        await loading.present();

                        const previousCert = selectedCertification.value.id;
                        const certCount = certs.length;
                        let certIndex = 0;

                        loading.message = `Generating content for ${certCount} certification${certCount > 1 ? 's' : ''}...`;

                        try {
                            for (const cert of certs as any[]) {
                                certIndex++;
                                selectedCertification.value = cert;
                                if(cancelled) break;

                                for (const t of ['glossary', 'cheatsheet', 'examtip']) {
                                    if(cancelled) break;
                                    loading.message = `${cert.name} (${certIndex}/${certCount}) — ${t}...`;
                                    await callAI(t, v);
                                }

                                const domains = ((contentData.value.domains as any)[cert.id] || []) as any[];
                                for (let dIdx = 0; dIdx < domains.length; dIdx++) {
                                    if(cancelled) break;
                                    const domain = domains[dIdx];
                                    loading.message = `${cert.name} (${certIndex}/${certCount}) — note ${domain['id']} (${dIdx + 1}/${domains.length})...`;
                                    await callAI('note', v, domain);
                                }
                            }
                            await dismiss();
                            const toast = await toastController.create({
                                message: cancelled ? 'Generation cancelled.' : 'Finished generating all content and notes.',
                                duration: 2500,
                                position: 'bottom',
                                color: cancelled ? 'warning' : 'secondary'
                            });
                            await toast.present();
                        } catch (error: any) {
                            console.log(error);
                            await dismiss();
                            const alert = await alertController.create({
                                header: 'Error: AI',
                                message: `${(error && error.message) ? error.message : error}\n\nProgress so far has been saved locally and will be restored automatically when you reopen this app.`,
                                buttons: ['Ok']
                            });
                            await alert.present();
                        } finally {
                            try { await persistDraft(); } catch (e) { console.error('Failed to persist partial progress', e); }
                        }

                        if(previousCert != '') {
                            const prev = contentData.value.certifications.find((c: any) => c.id === previousCert);
                            if(prev) selectedCertification.value = prev;
                        }
                    }, 0);
                }
            }
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const runCalcCheck = (kind: 'question' | 'mockup'): Promise<boolean> => {
    return new Promise((resolve) => {
        if(selectedCertification.value.id == '') { resolve(false); return; }

        const actionSheet = actionSheetController.create({
            header: 'Pick Model',
            buttons: AI_MODELS.map((v) => {
                return {
                    text: v,
                    handler: async () => {
                        const loading = await loadingController.create({
                            message: 'Checking...'
                        });
                        await loading.present();

                        try {
                            const answer = await callAI('calc', v);
                            const match = (answer || '').match(/HAS_CALCULATION:\s*(yes|no)/i);
                            let result = false;
                            if(match) {
                                result = /^yes/i.test(match[1]);
                                if(kind === 'question') calculation.value = result;
                                else mockupCalculation.value = result;
                            }
                            await loading.dismiss();
                            const alert = await alertController.create({
                                header: kind === 'mockup' ? 'Mock Up Calculation Check' : 'Calculation Check',
                                message: answer || 'No response.',
                                buttons: ['Ok']
                            });
                            await alert.present();
                            resolve(result);
                        } catch (error: any) {
                            console.log(error);
                            await loading.dismiss();
                            const alert = await alertController.create({
                                header: 'Error: AI',
                                message: error,
                                buttons: ['Ok'],
                            });
                            await alert.present();
                            resolve(false);
                        }
                    }
                };
            }),
            mode: 'md'
        });

        actionSheet.then((sheet) => sheet.present());
    });
};

const checkCalculation = async (): Promise<boolean> => {
    return runCalcCheck('question');
};

const checkMockupCalculation = async (): Promise<boolean> => {
    return runCalcCheck('mockup');
};

const checkAllCalculation = (kind: 'question' | 'mockup'): Promise<Record<string, boolean>> => {
    return new Promise((resolve) => {
        if(contentData.value.certifications.length <= 0) { resolve({}); return; }

        const actionSheet = actionSheetController.create({
            header: 'Pick Model',
            buttons: AI_MODELS.map((v) => {
                return {
                    text: v,
                    handler: async () => {
                        const results: Record<string, boolean> = {};
                        const loading = await loadingController.create({
                            message: 'Checking calculations...'
                        });
                        await loading.present();

                        const previousCert = selectedCertification.value.id;
                        try {
                            for (const cert of contentData.value.certifications as any[]) {
                                selectedCertification.value = cert;
                                try {
                                    const answer = await callAI('calc', v);
                                    const match = (answer || '').match(/HAS_CALCULATION:\s*(yes|no)/i);
                                    const result = match ? /^yes/i.test(match[1]) : false;
                                    results[cert.id] = result;
                                    if(kind === 'question') cert.calculation = result;
                                    else cert.mockupCalculation = result;
                                } catch (e) {
                                    console.error('Calc check failed for', cert.id, e);
                                    results[cert.id] = false;
                                }
                                loading.message = `Checking calculations... (${Object.keys(results).length}/${contentData.value.certifications.length})`;
                            }
                            await loading.dismiss();
                            const yesCount = Object.values(results).filter(Boolean).length;
                            const alert = await alertController.create({
                                header: kind === 'mockup' ? 'Mock Up Calculation Check' : 'Calculation Check',
                                message: `Checked ${contentData.value.certifications.length} certification(s). ${yesCount} include calculation questions.`,
                                buttons: ['Ok']
                            });
                            await alert.present();
                            resolve(results);
                        } catch (error: any) {
                            console.log(error);
                            await loading.dismiss();
                            const alert = await alertController.create({
                                header: 'Error: AI',
                                message: error,
                                buttons: ['Ok'],
                            });
                            await alert.present();
                            resolve(results);
                        } finally {
                            if(previousCert != '') {
                                const prev = contentData.value.certifications.find((c: any) => c.id === previousCert);
                                if(prev) selectedCertification.value = prev;
                            }
                        }
                    }
                };
            }),
            mode: 'md'
        });

        actionSheet.then((sheet) => sheet.present());
    });
};

const validateQuestionsQuality = async (domain: any) => {
    if(selectedCertification.value.id == '' || !domain) return;
    const qs = (contentData.value.question as any)[selectedCertification.value.id] && (contentData.value.question as any)[selectedCertification.value.id][domain['id']];
    if(!qs || qs.length === 0) {
        const toast = await toastController.create({
            message: 'No questions to validate for this part.',
            duration: 2500,
            position: 'bottom',
            color: 'danger'
        });
        await toast.present();
        return;
    }

    const loading = await loadingController.create({ message: 'Validating quality...' });
    await loading.present();

    try {
        const domainName = domain['part'] || domain['name'] || domain['id'];
        const prompt = `You are a strict exam question quality reviewer. Below is a JSON array of questions for the certification domain "${domainName}". Review them for: factual correctness, clarity, relevance to the domain, plausible distractors, and duplicate/near-duplicate questions. Return a concise report (plain text, under 400 words) with: (1) overall quality verdict (Good / Needs Improvement), (2) critical issues, and (3) the indices of any low-quality questions. Questions:\n\n${JSON.stringify(qs)}`;

        const key = localStorage.getItem("KILO_KEY") || '';
        const response = await CapacitorHttp.post({
            url: AI_ENDPOINTS[0],
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                prompt: JSON.stringify(prompt),
                model: "google/gemini-3.1-flash-lite",
                key
            }
        });

        if (response.status < 200 || response.status >= 300) {
            const error = response.data;
            throw new Error(`${error && error['error'] && error['error']['message'] || response.status }`);
        }

        const report = response.data && response.data['content'] ? response.data['content'] : '';
        await loading.dismiss();
        const alert = await alertController.create({
            header: `Quality Check: Part ${domain['id']}`,
            message: report || 'No response.',
            buttons: ['Ok']
        });
        await alert.present();
    } catch (error: any) {
        console.log(error);
        await loading.dismiss();
        const alert = await alertController.create({
            header: 'Error: AI',
            message: error,
            buttons: ['Ok']
        });
        await alert.present();
    }
}

const validateMockupQuality = async () => {
    if(selectedCertification.value.id == '') return;
    const qs = (contentData.value.mockupQuestion as any)[selectedCertification.value.id];
    if(!qs || qs.length === 0) {
        const toast = await toastController.create({
            message: 'No questions to validate.',
            duration: 2500,
            position: 'bottom',
            color: 'danger'
        });
        await toast.present();
        return;
    }

    const loading = await loadingController.create({ message: 'Validating quality...' });
    await loading.present();

    try {
        const certName = selectedCertification.value.name || selectedCertification.value.id;
        const prompt = `You are a strict exam question quality reviewer. Below is a JSON array of PREVIOUS / MOCK EXAM questions for the certification "${certName}". Review them for: factual correctness, clarity, relevance to the certification, plausible distractors, and duplicate/near-duplicate questions. Confirm each reads like a genuine past/practice exam item. Return a concise report (plain text, under 400 words) with: (1) overall quality verdict (Good / Needs Improvement), (2) critical issues, and (3) the indices of any low-quality or non-exam-realistic questions. Questions:\n\n${JSON.stringify(qs)}`;

        const key = localStorage.getItem("KILO_KEY") || '';
        const response = await CapacitorHttp.post({
            url: AI_ENDPOINTS[0],
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                prompt: JSON.stringify(prompt),
                model: "google/gemini-3.1-flash-lite",
                key
            }
        });

        if (response.status < 200 || response.status >= 300) {
            const error = response.data;
            throw new Error(`${error && error['error'] && error['error']['message'] || response.status }`);
        }

        const report = response.data && response.data['content'] ? response.data['content'] : '';
        await loading.dismiss();
        const alert = await alertController.create({
            header: `Quality Check: Mock Up / Previous Exam`,
            message: report || 'No response.',
            buttons: ['Ok']
        });
        await alert.present();
    } catch (error: any) {
        console.log(error);
        await loading.dismiss();
        const alert = await alertController.create({
            header: 'Error: AI',
            message: error,
            buttons: ['Ok']
        });
        await alert.present();
    }
}

</script>

<style scoped>
@import url(../../theme/contentManagement.css);
</style>