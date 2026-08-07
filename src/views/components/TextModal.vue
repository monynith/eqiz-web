<template>
    <div class="block">
        <div id="container" @touchmove.stop>
            <div id="toolbar">
                <span id="title">{{ title }}</span>
                <div id="actions">
                    <div class="menu">
                        <span v-if="mode !== 'markdown'" id="btn-edit" @click="toggleEdit">{{ editMode ? 'View' : 'Edit' }}</span>
                        <span id="btn-copy" @click="copyCode">Copy</span>
                    </div>
                    <div class="menu">
                        <button id="btn-done" @click="done">Done</button>
                        <span id="btn-close" @click="close">Close</span>
                    </div>
                </div>
            </div>
            <div id="modal-editor-wrapper" @click="focusEditor" @touchend="focusEditor">
                <div v-if="mode === 'markdown'" class="markdown-body" v-html="renderedMarkdown"></div>
                <div v-else-if="!aceFailed" id="editor" ref="editorEl"></div>
                <textarea v-else readonly class="fallback-text" :value="getText()"></textarea>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { modalController, toastController } from '@ionic/vue';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    content: any;
    mode?: string;
    title?: string;
    stringify?: boolean;
}>();

const editorEl = ref<HTMLElement | null>(null);
const renderedMarkdown = ref('');
const aceFailed = ref(false);
const editMode = ref(true);

const mode = props.mode || 'json';
const title = props.title || (mode === 'markdown' ? 'Markdown Viewer' : 'Live Editor');

const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load ' + src));
        document.head.appendChild(s);
    });
};

const loadStyle = (href: string): void => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
};

const close = (): void => {
    modalController.dismiss();
};

const done = (): void => {
    if (mode !== 'markdown') {
        try {
            JSON.parse(getText());
        } catch (e) {
            toastController.create({
                message: 'Invalid JSON. Fix it before saving.',
                duration: 2500,
                position: 'bottom',
                color: 'danger'
            }).then(t => t.present());
            return;
        }
    }
    if (editMode.value) {
        editMode.value = false;
        const aceEl = editorEl.value as any;
        if (aceEl && aceEl.__ace) {
            aceEl.__ace.setReadOnly(true);
        }
    }
    modalController.dismiss({ content: getText() });
};

    const focusEditor = (): void => {
        const aceEl = editorEl.value as any;
        if (aceEl && aceEl.__ace) {
            aceEl.__ace.focus();
        }
    };

    const toggleEdit = (): void => {
        editMode.value = !editMode.value;
        const aceEl = editorEl.value as any;
        if (aceEl && aceEl.__ace) {
            aceEl.__ace.setReadOnly(!editMode.value);
        }
    };

    const getText = (): string => {
    const aceEl = editorEl.value as any;
    if (mode !== 'markdown' && aceEl && aceEl.__ace) {
        return aceEl.__ace.getValue();
    }
    return props.stringify === false
        ? (props.content ?? '')
        : (typeof props.content === 'string' ? props.content : JSON.stringify(props.content, null, 6));
};

const fallbackCopy = (text: string): void => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
        document.execCommand('copy');
    } catch (e) {
        console.error(e);
    }
    document.body.removeChild(ta);
};

const copyCode = async (): Promise<void> => {
    const text = getText();
    let success = false;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            success = true;
        } else {
            fallbackCopy(text);
            success = true;
        }
    } catch (e) {
        fallbackCopy(text);
        success = true;
    }

    if (success) {
        const toast = await toastController.create({
            message: 'Copied to clipboard.',
            duration: 2000,
            position: 'bottom',
            color: 'secondary'
        });
        await toast.present();
    }
};

onMounted(async () => {
    if (mode === 'markdown') {
        loadStyle('https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-dark.min.css');
        try {
            await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
            const marked = (window as any).marked;
            if (marked) {
                renderedMarkdown.value = marked.parse(props.content || '');
            }
        } catch (e) {
            renderedMarkdown.value = `<pre>${props.content}</pre>`;
        }
        return;
    }

    loadStyle('https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;500;700&display=swap');
    try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.7/ace.js');
        const ace = (window as any).ace;
        if (ace && editorEl.value) {
            const editor = ace.edit(editorEl.value);
            editor.setTheme('ace/theme/dracula');
            editor.session.setMode('ace/mode/' + mode);
            editor.session.setUseWorker(false);
            editor.setValue(getText(), -1);
            editor.setReadOnly(!editMode.value);
            editor.setOptions({
                fontFamily: "'Google Sans Code', 'Menlo', 'Monaco', 'Consolas', 'Ubuntu Mono', monospace",
                fontSize: '14px',
                showPrintMargin: false,
                useSoftTabs: true,
                tabSize: 2
            });
            (editorEl.value as any).__ace = editor;
            editor.focus();
            setTimeout(() => editor.resize(), 350);
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => editor.resize(true));
            }
        }
    } catch (e) {
        console.error(e);
        aceFailed.value = true;
    }
});
</script>

<style scoped>
.block {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
#container {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 90vh;
    max-height: 95vh;
    background: #1e1e1e;
    color: #fff;
    font-family: system-ui, sans-serif;
    position: relative;
}
#toolbar {
    height: 45px;
    flex-shrink: 0;
    background: #181818;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 20px;
    border-bottom: 1px solid #2d2d2d;
    gap: 10px;
    padding-top: 50px;
}
#title {
    font-weight: bold;
    font-size: 18px;
    color: white;
    text-transform: uppercase;
}
#actions {
    display: flex;
    align-items: center;
    gap: 8px;
}
.menu {
    display: flex;
    align-items: center;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    overflow: hidden;
}
.menu > span,
.menu > button {
    padding: 7px 12px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    border: none;
    font-family: inherit;
    line-height: 1;
}
.menu > span + span,
.menu > button + span,
.menu > span + button {
    border-left: 1px solid #3a3a3a;
}
#btn-done {
    background: palevioletred;
    color: #fff;
}
#btn-done:active {
    background: #d64f8c;
}
#btn-copy,
#btn-close,
#btn-edit {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}
#modal-editor-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    background: #1e1e1e;
}
#editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}
#editor,
#editor * {
    font-family: 'Menlo', 'Monaco', 'Consolas', 'Ubuntu Mono', 'Courier New', monospace !important;
    font-size: 14px !important;
}
.fallback-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: none;
    outline: none;
    resize: none;
    padding: 12px;
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Google Sans Code', monospace;
    font-size: 14px;
    line-height: 1.5;
}
.markdown-body {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 15px;
    background: #0d1117;
    color: #e6edf3;
}
</style>
