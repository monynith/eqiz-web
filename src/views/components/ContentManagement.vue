<template>
    <div id="btn-wrapper">
        <p class="create-btn" @click="createAgain">CREATE AGAIN</p>
        <p class="create-btn" style="color: cadetblue;" v-if="contentData['appId'] != ''" @click="saveContent">{{ isSaving ? 'SAVING...' : 'SAVE CONTENT' }}</p>
        <p class="create-btn" style="color: cadetblue;" v-if="contentData['appId'] == ''" @click="loadContent">{{ isLoading ? 'LOADING...' : 'LOAD CONTENT' }}</p>
    </div> 
    <div id="app-wrapper">   
        <p id="add-remark-btn" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5, cursor: contentData['appId'] != '' ? 'pointer' : 'default' }">
            <ion-icon :icon="contentData['remark'] != '' ? checkmarkDoneSharp : add" @click="onRemark"></ion-icon>
            <span @click="onRemark">{{ contentData['remark'] != '' ? 'REMARK' : 'ADD REMARK' }}</span>
            <ion-icon :icon="scanOutline" class="open-icon" style="font-size: 0.7rem;" v-if="contentData['remark'] != ''" @click="openText(contentData.remark, 'markdown', false)"></ion-icon>
            <ion-icon :icon="documentTextOutline" class="open-icon" style="font-size: 0.7rem; margin-left: 2px;" v-if="contentData['remark'] != ''" @click="viewMD"></ion-icon>            
        </p>     
        <p id="app-id">App ID: <span id="value">{{ contentData['appId'] || 'unset' }}</span> <ion-icon :icon="createOutline" @click="setAppId"></ion-icon></p>
        <p id="app-name">App Name: <span id="value">{{ contentData['appName'] || 'unset' }}</span> <ion-icon :icon="createOutline" @click="setAppId"></ion-icon></p>        
        <div id="download-btn-wrapper" v-if="contentData['appId'] != ''">
            <!-- <span class="create-btn-standalone" @click="downloadContent()">DOWNLOAD CONTENT <ion-icon :icon="download"></ion-icon></span>
            <span class="create-btn-standalone" @click="loadQuestion()" v-if="contentData['certifications']">LOAD QUESTIONS <ion-icon :icon="cloudUpload"  style="position: relative; top: 2px;"></ion-icon></span>
            <span class="create-btn-standalone" @click="downloadQuestions()">DOWNLOAD QUESTIONS <ion-icon :icon="download"></ion-icon></span> -->
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
                <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? contentData.domains : '')"></ion-icon>
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
                <p class="inner-title">GLOBAL CONTENT</p>                
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('glossary')">
                        <ion-icon :icon="isContentSet('glossary') ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('glossary') ? `Glossary Added (#1)`  : 'Add Glossary (#1)'}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('glossary')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('glossary') : '', 'javascript', false)"></ion-icon>
                </div>    
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('cheatsheet')">
                        <ion-icon :icon="isContentSet('cheatsheet') ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('cheatsheet') ? 'Cheat Sheet Added (#2)'  : 'Add Cheat Sheet (#2)'}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('cheatsheet')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('cheatsheet') : '', 'javascript', false)"></ion-icon>
                </div>   
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('examtip')">
                        <ion-icon :icon="isContentSet('examtip') ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('examtip') ? 'Exam Tip Added (#3)'  : 'Add Exam Tip (#3)'}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('examtip')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('examtip') : '', 'javascript', false)"></ion-icon>
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
                <p class="inner-title">LECTURE NOTES</p>                
                <div class="add-wrapper" v-for="domain in (contentData.domains as any)[selectedCertification.id]">
                    <p class="add-button" @click="addContent('note', domain)">
                        <ion-icon :icon="isContentSet('note', domain['id']) ? checkmarkDoneSharp : add"></ion-icon>
                        {{ isContentSet('note', domain['id']) ?  `Part ${domain['id']}: Added`  : `Part ${domain['id']}: ${domain['part'] || domain['name']}`}}
                    </p>
                    <ion-icon :icon="copyOutline" @click="copyPrompt('note', domain)" id="copy"></ion-icon>
                    <ion-icon :icon="scanOutline" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5, cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }" class="open-icon" @click="openText(selectedCertification['id'] != '' ? getContent('note', domain['id']) : '', 'html', false)"></ion-icon>
                </div>    
                <div id="completed" v-if="isContentCompleted('note')">
                    <ion-icon :icon="checkmarkCircleSharp"></ion-icon>
                    <span>Completed</span>
                </div>                                   
            </div> 
            <br/>
            <br/>
            <p class="label" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }" v-if="(contentData.domains as any)[selectedCertification.id] && (contentData.domains as any)[selectedCertification.id].length > 0">Questions</p>             
            <ion-toggle mode="md" id="question-toggle" @click="toggleNotifications" v-if="(contentData.domains as any)[selectedCertification.id] && (contentData.domains as any)[selectedCertification.id].length > 0">CALCULATION?</ion-toggle><br />
            <div id="question-wrapper">
                <div v-for="domain in (contentData.domains as any)[selectedCertification.id]" class="question-title">
                    <p>{{ `Part ${domain['id']}: ${domain['part'] || domain['name']}` }}
                        <ion-icon :icon="copyOutline" @click="copyPrompt('question', domain)" id="copy"></ion-icon>
                        <ion-icon :icon="scanOutline" class="open-icon" @click="openText((contentData.question as any)[selectedCertification.id] && (contentData.question as any)[selectedCertification.id][domain['id']] ? (contentData.question as any)[selectedCertification.id][domain['id']] : '', 'json')"></ion-icon>
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
                    </div> 

                    <div class="add-item" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }" @click="addQuestion(domain)">
                        <ion-icon :icon="add"></ion-icon><span>Add Question Batch</span>
                    </div>
                </div>                    
            </div>             
        </div>
    </div>
    <br />
</template>

<script setup lang="ts">
import certification from '@/assets/prompts/certification';
import cheatsheet from '@/assets/prompts/cheatsheet';
import domainContent from '@/assets/prompts/domain';
import examtip from '@/assets/prompts/examtip';
import glossary from '@/assets/prompts/glossary';
import note from '@/assets/prompts/note';
import question from '@/assets/prompts/question';
import { actionSheetController, alertController, IonIcon, toastController, IonToggle } from '@ionic/vue';
import { add, attachOutline, attachSharp, browsersOutline, checkmarkCircleSharp, checkmarkDoneSharp, chevronDownOutline, closeCircleOutline, cloudUpload, codeOutline, copyOutline, createOutline, documentTextOutline, download, ellipseSharp, ellipsisHorizontalSharp, ellipsisVerticalSharp, flashOutline, openOutline, scanOutline, unlinkOutline, unlinkSharp } from 'ionicons/icons';
import { ref } from 'vue';
import JSZip from 'jszip';
import { createClient } from '@libsql/client';

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
    remark: ''
})

const isDownloadable = ref(false);
const selectedCertification = ref({
    id: '',
    name: ''
});
const calculation = ref(false);

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
        inputEl.addEventListener('paste', async (event: ClipboardEvent) => {
            const pastedData = event.clipboardData?.getData('text');
            if (pastedData && pastedData != '') {
                const result = pastedData;
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
                // console.log((contentData.value.content as any));             
            }
            await alert.dismiss();
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
        inputEl.addEventListener('paste', async (event: ClipboardEvent) => {
            const pastedData = event.clipboardData?.getData('text');
            if (pastedData && pastedData != '') {
                const result = JSON.parse(pastedData);
                let questions = result['data'] || result;
                // console.log(questions);
                if (questions.length > 0) {    
                    if(!(contentData.value.question as any)[selectedCertification.value.id]) (contentData.value.question as any)[selectedCertification.value.id] = {};                
                    if(!(contentData.value.question as any)[selectedCertification.value.id][domain['id']]) (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = [];
                    const filterQuestions = validateQuestions(questions, domain);
                    // console.log(filterQuestions);
                    (contentData.value.question as any)[selectedCertification.value.id][domain['id']] = filterQuestions;                    
                }
            }
            // console.log(contentData.value.question as any);
            await alert.dismiss();
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
        inputEl.addEventListener('paste', async (event: ClipboardEvent) => {
            const pastedData = event.clipboardData?.getData('text');
            if (pastedData && pastedData != '') {
                const result = JSON.parse(pastedData);
                if (result.length > 0) {                    
                    (contentData.value.domains as any)[selectedCertification.value.id] = result;                    
                }
            }
            await alert.dismiss();
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
                    name: data.name
                })
            }            
        }
      }],
      inputs: alertInputs,
      mode: 'md'
    });

    const inputEl = document.getElementById('alert-paste-field') as HTMLInputElement;
    if (inputEl) {
        inputEl.addEventListener('paste', async (event: ClipboardEvent) => {
            const pastedData = event.clipboardData?.getData('text');
            if(pastedData && pastedData != ''){                
                const result = JSON.parse(pastedData);
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
                        const toast = await toastController.create({
                            message: 'Some ids are duplicate.',
                            duration: 3500,
                            position: 'bottom',
                            color: "danger"
                        });

                        await toast.present();
                        return;
                    }
                    (contentData.value.certifications as any) = result;
                }
            }
            await alert.dismiss();       
        });
    }

    await alert.present();
}

const removeCert = (idx: number, type: string)=> {
    if(type == 'cert') contentData.value.certifications.splice(idx, 1);
    if(type == 'domain') (contentData.value.domains as any)[selectedCertification.value.id].splice(idx, 1);
}

const copyPrompt = (type: string, domain?: any) => {
    if(contentData.value.certifications.length <=0) return;
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
            v['explanation'].length >= 50 &&
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

const deShortenString = (str: string)=> {
    if(!str || str == '') return '';
    const decodedString = atob(str);
    const jsonString = decodeURIComponent(decodedString);                    
    return JSON.parse(jsonString);
}

const saveContent = async ()=> {
    // console.log(contentData.value);
    if(isSaving.value == true) return;
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
                `
        }])
        isSaving.value = false;
        createAgain();
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
        createAgain();
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
        const toast = await toastController.create({
            message: 'Something went wrong.',
            duration: 3500,
            position: 'bottom',
            color: "danger"
        });

        await toast.present();
    } 
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
        folder?.file(`${v.id}.json`, JSON.stringify({
            data: question,
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
        remark: ''
    };
    selectedCertification.value = {
        id: '',
        name: ''
    }
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
                remark: meta['remark'] || ''
            }
            selectedCertification.value = {
                id: meta['certifications'][0].id,
                name: meta['certifications'][0].name
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
            const groupedQuestions = Object.groupBy(questions, (item: any) => item['standard']);            

            for(let standard in groupedQuestions) {                
                const dm = (contentData.value as any).domains[selectedCertification.value.id].find((v: any) => {                    
                    return v['part'] == standard
                });
                if(dm) {
                    if(!(contentData.value as any).question[selectedCertification.value.id]) (contentData.value as any).question[selectedCertification.value.id] = {};
                    (contentData.value as any).question[selectedCertification.value.id][dm.id] = groupedQuestions[standard];
                }                
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

const loadFromDB = async (data: any)=> {
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
                remark: deShortenString(meta['remark'])
            }            
            selectedCertification.value = {
                id: deShortenString(meta['certifications'])[0].id,
                name: deShortenString(meta['certifications'])[0].name
            }

            // console.log(decodeURIComponent(atob(meta['json'])))                     
            const questions = deShortenString(meta['json']);
            // console.log(questions);
            contentData.value.certifications.forEach((v: any)=> {
                // console.log(v);
                const groupedQuestions = Object.groupBy(questions[v.id], (item: any) => item['standard']);                        
                for(let standard in groupedQuestions) {                
                    const dm = (contentData.value as any).domains[v.id].find((v: any) => {                    
                        return v['part'] == standard
                    });
                    if(dm) {
                        if(!(contentData.value as any).question[v.id]) (contentData.value as any).question[v.id] = {};
                        (contentData.value as any).question[v.id][dm.id] = groupedQuestions[standard];
                    }                
                } 
            });

        }
        isLoading.value = false;
    } catch(e){
        console.log(e);
        isLoading.value = false;
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
            isLoading.value = true; 
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
        }],
        mode: 'md'
    });

    await actionSheet.present();
}

const viewMD = ()=> {
    if(contentData.value.remark != '') {
        const text = contentData.value.remark;
        const newWindow = window.open('', '_blank');

        if (newWindow) {            
            newWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>Markdown Viewer</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css">
                ` + '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></' + 'script>' + `
                <style>
                    body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
                    @media (max-width: 767px) { body { padding: 15px; } }
                </style>
                </head>
                <body class="markdown-body">
                <div id="content">Loading...</div>
                </body>
                </html>
            `);
            
            newWindow.document.close();

            // 3. Wait for the dependencies (marked.js) to load, then render the Markdown safely
            newWindow.onload = function() {
                if ((newWindow as any)['marked']) {
                    (newWindow.document.getElementById('content') as any).innerHTML = (newWindow as any)['marked'].parse(text);
                }
            };
        }
        return;
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
        inputEl.addEventListener('paste', async (event: ClipboardEvent) => {
            const pastedData = event.clipboardData?.getData('text');
            if(pastedData && pastedData != ''){                                
                contentData.value.remark = pastedData;
            }
            await alert.dismiss();       
        });
    }

    await alert.present();
}

const openText = (text: any, type?: string, stringify?: boolean)=> {
    if(text == '') return;
    // const jsonString = JSON.stringify(json, null, 6); 
    // const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

    // window.open(URL.createObjectURL(blob), '_blank');
    const initialContent = text

    const mode = type || "json"; // Change to "markdown" if editing markdown!

    // 1. Open the blank window
    const newWindow:any = window.open('', '_blank');

    if (newWindow) {
        // 2. Build the editor interface safely
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <title>Live Editor</title>
            <!-- Load Google Sans Code Font -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                body { 
                    margin: 0; padding: 0; height: 100vh; 
                    display: flex; flex-direction: column; 
                    overflow: hidden; font-family: system-ui, sans-serif; 
                    background: #1e1e1e; color: #fff;
                }
                #toolbar { 
                    height: 45px; background: #181818; 
                    display: flex; align-items: center; 
                    padding: 0 15px; border-bottom: 1px solid #2d2d2d; 
                    gap: 10px;
                }
                #editor { 
                    flex: 1; width: 100%; height: calc(100vh - 45px); 
                }
                button { 
                    background: #3c3c3c; color: white; border: none; 
                    padding: 6px 12px; border-radius: 4px; cursor: pointer; 
                    font-size: 13px; font-weight: 500; transition: background 0.2s;
                }
                button:hover { background: #505050; }
                #copy-success { font-size: 12px; color: #4caf50; display: none; }
            </style>
            <!-- Load Ace Editor via CDN safely -->
            ` + '<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.7/ace.js"></' + 'script>' + `
            </head>
            <body>
            <div id="toolbar">
                <span style="font-weight: bold; font-size: 13px; color: #858585; text-transform: uppercase; margin-right: 10px;">Editor</span>
                <button id="btn-copy">Copy Code</button>
                <span id="copy-success">Copied!</span>
            </div>
            <div id="editor"></div>
            </body>
            </html>
        `);

        newWindow.document.close();

        // 3. Initialize Ace Editor once loaded
        newWindow.onload = function() {
            if (newWindow.ace) {
            const editor = newWindow.ace.edit(newWindow.document.getElementById('editor'));

            // Set to VS Code / Monokai Style
            editor.setTheme("ace/theme/dracula");
            editor.session.setMode("ace/mode/" + mode);

            editor.session.setUseWorker(false);
            editor.setValue(stringify == false ? initialContent : JSON.stringify(initialContent, null, 6), -1); // -1 resets the cursor selection
            
            editor.setOptions({
                fontFamily: "'Google Sans Code', monospace", // <- Applies the font to the editor lines
                fontSize: "14px",
                showPrintMargin: false,
                enableBasicAutocompletion: true,
                useSoftTabs: true,
                tabSize: 2
            });

            // --- Button Logic ---
            
            // Copy to clipboard
            newWindow.document.getElementById('btn-copy').addEventListener('click', () => {
                const currentCode = editor.getValue();
                newWindow.navigator.clipboard.writeText(currentCode).then(() => {
                const successSpan = newWindow.document.getElementById('copy-success');
                successSpan.style.display = 'inline';
                setTimeout(() => { successSpan.style.display = 'none'; }, 2000);
                });
            });

            }
        };
    }
}

</script>

<style scoped>
@import url(../../theme/contentManagement.css);
</style>