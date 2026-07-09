<template>
    <div id="btn-wrapper">
        <p class="create-btn">CREATE AGAIN</p>
        <p class="create-btn" style="color: cadetblue;" @click="saveContent">SAVE CONTENT</p>
    </div> 
    <div id="app-wrapper">        
        <p id="app-id">App ID: <span id="value">{{ contentData['appId'] || 'unset' }}</span> <ion-icon :icon="createOutline" @click="setAppId"></ion-icon></p>
        <p id="app-name">App Name: <span id="value">{{ contentData['appName'] || 'unset' }}</span> <ion-icon :icon="createOutline" @click="setAppId"></ion-icon></p>        
        <div id="download-btn-wrapper">
            <span class="create-btn-standalone" @click="downloadContent()">DOWNLOAD CONTENT <ion-icon :icon="download"></ion-icon></span>
            <span class="create-btn-standalone" style="color: cadetblue;" @click="downloadQuestions()">DOWNLOAD QUESTIONS <ion-icon :icon="download"></ion-icon></span>
        </div>        
    </div>      
    <div id="template-wrapper">
        <div id="left">
            <p class="label" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5 }">Certification(s) <ion-icon :icon="copyOutline" @click="copyPrompt('cert')" :style="{ opacity: contentData['appId'] != '' ? 1 : 0.5, cursor: contentData['appId'] != '' ? 'pointer' : 'default' }"></ion-icon></p>
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
            <p class="label" :style="{ opacity: selectedCertification['id'] != '' ? 1 : 0.5 }">Domain(s) <ion-icon :icon="copyOutline" @click="copyPrompt('domain')" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon></p>
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
                    <p class="add-button" @click="addContent('glossary')"><ion-icon :icon="isContentSet('glossary') ? checkmarkDoneSharp : add"></ion-icon>{{ isContentSet('glossary') ? `Glossary Added (#1)`  : 'Add Glossary (#1)'}}</p><ion-icon :icon="copyOutline" @click="copyPrompt('glossary')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                </div>    
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('cheatsheet')"><ion-icon :icon="isContentSet('cheatsheet') ? checkmarkDoneSharp : add"></ion-icon>{{ isContentSet('cheatsheet') ? 'Cheat Sheet Added (#2)'  : 'Add Cheat Sheet (#2)'}}</p><ion-icon :icon="copyOutline" @click="copyPrompt('cheatsheet')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
                </div>   
                <div class="add-wrapper">
                    <p class="add-button" @click="addContent('examtip')"><ion-icon :icon="isContentSet('examtip') ? checkmarkDoneSharp : add"></ion-icon>{{ isContentSet('examtip') ? 'Exam Tip Added (#3)'  : 'Add Exam Tip (#3)'}}</p><ion-icon :icon="copyOutline" @click="copyPrompt('examtip')" id="copy" :style="{ cursor: selectedCertification['id'] != '' ? 'pointer' : 'default' }"></ion-icon>
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
                    <p class="add-button" @click="addContent('note', domain)"><ion-icon :icon="isContentSet('note', domain['id']) ? checkmarkDoneSharp : add"></ion-icon>{{ isContentSet('note', domain['id']) ?  `Part ${domain['id']}: Added`  : `Part ${domain['id']}: ${domain['part'] || domain['name']}`}}</p><ion-icon :icon="copyOutline" @click="copyPrompt('note', domain)" id="copy"></ion-icon>
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
                    <p>{{ `Part ${domain['id']}: ${domain['part'] || domain['name']}` }}<ion-icon :icon="copyOutline" @click="copyPrompt('question', domain)" id="copy"></ion-icon></p>

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
import { add, checkmarkCircleSharp, checkmarkDoneCircleSharp, checkmarkDoneSharp, chevronDownOutline, closeCircleOutline, copyOutline, createOutline, download } from 'ionicons/icons';
import { ref } from 'vue';
import JSZip from 'jszip';

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
        
    }
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
                console.log((contentData.value.content as any));             
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
            console.log(contentData.value.question as any);
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

const saveContent = ()=> {
    console.log(contentData.value);
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
            const qs = (contentData.value.question as any)[selectedCertification.value['id']] && (contentData.value.question as any)[selectedCertification.value['id']][domain['id']];
            if(qs && qs.length > 0) question = question.concat(qs['data'] || qs);
        });
        folder?.file(`${v.id}.json`, JSON.stringify(question, null, 6));
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
        domains: contentData.value.domains
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

</script>

<style scoped>
@import url(../../theme/contentManagement.css);
</style>