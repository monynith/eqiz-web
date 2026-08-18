<template>
    <Skeleton v-if="loading == true"/>
    <div v-if="loading == false">
        <div id="notes-btn-wrapper">
            <p id="notes-create-btn" @click="createNote"><ion-icon :icon="add"></ion-icon> New Note</p>
        </div>
        <ion-searchbar
            class="blend-searchbar"
            mode="md"
            v-model="searchQuery"
            placeholder="Search notes"
            :debounce="500"
            @ionInput="onSearch"
        ></ion-searchbar>

        <div id="notes-list" v-if="!selectedNote">
            <div class="note-item" v-for="note in filteredNotes" :key="note['id']" @click="openNote(note)">
                <div class="note-info">
                    <p class="note-name">{{ note['name'] || 'Untitled' }}</p>
                    <p class="note-preview">{{ getPreview(note['content']) }}</p>
                    <p class="note-date">{{ formatDate(note['updated_at']) }}</p>
                </div>
                <div class="note-actions" @click.stop>
                    <ion-icon :icon="trashOutline" @click="deleteNote(note)"></ion-icon>
                </div>
            </div>
            <p id="notes-empty" v-if="filteredNotes.length == 0">No notes found.</p>
        </div>

        <div id="note-editor" v-else>
            <div id="note-editor-header">
                <p id="note-back" @click="selectedNote = null"><ion-icon :icon="arrowBackOutline"></ion-icon> Notes</p>
                <div id="note-editor-actions">
                    <p class="note-btn" id="note-delete-btn" @click="deleteNote(selectedNote)"><ion-icon :icon="trashOutline"></ion-icon> Delete</p>
                    <p class="note-btn" id="note-save-btn" @click="saveNote"><ion-icon :icon="saveOutline"></ion-icon> Save</p>
                </div>
            </div>
            <input
                id="note-name-input"
                type="text"
                v-model="selectedNote['name']"
                placeholder="Note title"
            />
            <textarea
                id="note-content-input"
                v-model="selectedNote['content']"
                placeholder="Write your note here... (text only)"
                spellcheck="false"
            ></textarea>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonIcon, IonSearchbar, alertController, toastController } from '@ionic/vue';
import { add, arrowBackOutline, saveOutline, trashOutline } from 'ionicons/icons';
import { createClient } from '@libsql/client';
import { computed, ref, onMounted } from 'vue';
import Skeleton from './Skeleton.vue';

const loading = ref(true);
const notes = ref<any[]>([]);
const searchQuery = ref("");
const selectedNote = ref<any>(null);

const filteredNotes = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return notes.value;
    return notes.value.filter((n: any) =>
        (n['name'] || '').toLowerCase().includes(q) ||
        (n['content'] || '').toLowerCase().includes(q)
    );
});

const getClient = () => {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;
    return createClient({
        url: dbUrl,
        authToken: dbToken,
    });
};

const getPreview = (content: string) => {
    const text = (content || '').replace(/\s+/g, ' ').trim();
    return text.length > 160 ? text.substring(0, 160) + '...' : text;
};

const formatDate = (date: string) => {
    if (!date) return '';
    try {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return date;
    }
};

const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'note_' + result + '_' + Date.now();
};

const init = async () => {
    loading.value = true;
    try {
        const client = getClient();
        const result = await client.execute({
            sql: `SELECT * FROM notes ORDER BY updated_at DESC`
        });
        notes.value = result.rows as any[];
    } catch (e) {
        console.error('Failed to load notes', e);
        const toast = await toastController.create({
            message: 'Something went wrong while loading notes.',
            duration: 3000,
            position: 'bottom',
            color: "danger"
        });
        await toast.present();
    } finally {
        loading.value = false;
    }
};

const onSearch = () => {};

const createNote = async () => {
    const alert = await alertController.create({
        header: 'New Note',
        inputs: [{
            placeholder: 'Note title (optional)',
            name: 'title'
        }],
        buttons: [{
            text: 'Cancel',
            role: 'cancel'
        }, {
            text: 'Create',
            handler: (data) => {
                const now = new Date().toISOString();
                selectedNote.value = {
                    id: generateId(),
                    name: (data.title || '').trim(),
                    content: '',
                    created_at: now,
                    updated_at: now
                };
            }
        }],
        mode: 'md'
    });
    await alert.present();
};

const openNote = (note: any) => {
    selectedNote.value = { ...note };
};

const saveNote = async () => {
    if (!selectedNote.value) return;
    const note = selectedNote.value;
    note['name'] = (note['name'] || '').trim() || 'Untitled';
    note['updated_at'] = new Date().toISOString();

    try {
        const client = getClient();
        await client.execute({
            sql: `
                INSERT INTO notes (id, name, content, created_at, updated_at)
                VALUES (:id, :name, :content, :created_at, :updated_at)
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    content = excluded.content,
                    updated_at = excluded.updated_at
            `,
            args: {
                id: note['id'],
                name: note['name'],
                content: note['content'] || '',
                created_at: note['created_at'],
                updated_at: note['updated_at']
            }
        });
        const index = notes.value.findIndex((n: any) => n['id'] === note['id']);
        if (index > -1) {
            notes.value[index] = { ...note };
        } else {
            notes.value.unshift({ ...note });
        }
        notes.value = [...notes.value].sort((a: any, b: any) => (b['updated_at'] || '').localeCompare(a['updated_at'] || ''));
        const toast = await toastController.create({
            message: 'Note saved.',
            duration: 2000,
            position: 'bottom',
            color: "secondary"
        });
        await toast.present();
    } catch (e) {
        console.error('Failed to save note', e);
        const toast = await toastController.create({
            message: 'Something went wrong while saving the note.',
            duration: 3000,
            position: 'bottom',
            color: "danger"
        });
        await toast.present();
    }
};

const deleteNote = async (note: any) => {
    const alert = await alertController.create({
        header: 'Delete Note',
        message: `Are you sure you want to delete "${note['name'] || 'Untitled'}"?`,
        buttons: [{
            text: 'Cancel',
            role: 'cancel'
        }, {
            text: 'Delete',
            role: 'destructive',
            handler: async () => {
                try {
                    const client = getClient();
                    await client.execute({
                        sql: `DELETE FROM notes WHERE id = :id`,
                        args: { id: note['id'] }
                    });
                    notes.value = notes.value.filter((n: any) => n['id'] !== note['id']);
                    if (selectedNote.value && selectedNote.value['id'] === note['id']) {
                        selectedNote.value = null;
                    }
                    const toast = await toastController.create({
                        message: 'Note deleted.',
                        duration: 2000,
                        position: 'bottom',
                        color: "secondary"
                    });
                    await toast.present();
                } catch (e) {
                    console.error('Failed to delete note', e);
                    const toast = await toastController.create({
                        message: 'Something went wrong while deleting the note.',
                        duration: 3000,
                        position: 'bottom',
                        color: "danger"
                    });
                    await toast.present();
                }
            }
        }],
        mode: 'md'
    });
    await alert.present();
};

const loadStyle = (href: string): void => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
};

onMounted(() => {
    loadStyle('https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;500;700&display=swap');
    init();
});
</script>

<style scoped>
#notes-btn-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 15px;
}

#notes-create-btn {
    width: fit-content;
    color: palevioletred;
    font-weight: bold;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
}

#notes-create-btn ion-icon {
    font-size: 1rem;
}

.blend-searchbar {
    margin: 16px 0;
    padding: 0;
    --background: var(--eq-surface-2, #ededed);
    --box-shadow: none;
    --border-radius: 10px;
    --color: var(--eq-text, black);
    --placeholder-color: var(--eq-text-dim, #9c9c9c);
    --icon-color: var(--eq-text-dim, #9c9c9c);
    --clear-button-color: var(--eq-text-dim, #9c9c9c);
    --height: 35px;
    --placeholder-font-size: 0.9rem;
    border-radius: 10px;
    overflow: hidden;
}

.blend-searchbar :deep(.searchbar-input) {
    padding-left: 50px !important;
    padding-top: 8px !important;
    padding-bottom: 10px !important;
    font-size: 0.9rem !important;
}

.blend-searchbar :deep(.searchbar-search-icon) {
    margin-left: 0px;
    color: var(--eq-text-dim, #888);
    width: 18px;
    height: 18px;
    margin-top: 3px;
}

#notes-list {
    margin-top: 10px;
}

.note-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px;
    margin-bottom: 10px;
    background: #ffffff;
    border: 1px solid #f3f3f3;
    border-radius: 10px;
    cursor: pointer;
}

.note-item:hover {
    border-color: #e5b3c7;
}

.note-info {
    min-width: 0;
}

.note-name {
    font-weight: bold;
    color: black;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.note-preview {
    font-size: 0.85rem;
    color: #585858;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.note-date {
    font-size: 0.75rem;
    color: #9c9c9c;
}

.note-actions ion-icon {
    font-size: 1.2rem;
    color: #b05f7a;
    cursor: pointer;
    padding: 6px;
}

#notes-empty {
    text-align: center;
    color: #9c9c9c;
    font-size: 0.9rem;
    padding: 30px 0;
}

#note-editor {
    margin-top: 10px;
}

#note-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

#note-back {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #585858;
    font-size: 0.9rem;
    cursor: pointer;
}

#note-editor-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.note-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85rem;
    font-weight: bold;
    cursor: pointer;
    padding: 8px 14px;
    border-radius: 8px;
}

.note-btn ion-icon {
    font-size: 0.95rem;
}

#note-delete-btn {
    color: #b05f7a;
    border: 1px solid #f0d0da;
}

#note-save-btn {
    color: white;
    background: palevioletred;
}

#note-name-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    font-size: 1rem;
    font-weight: bold;
    color: black;
    background: #ffffff;
    border: 1px solid #f3f3f3;
    border-radius: 10px;
    outline: none;
    margin-bottom: 12px;
}

#note-name-input:focus {
    border-color: #e5b3c7;
}

#note-content-input {
    width: 100%;
    box-sizing: border-box;
    min-height: 50vh;
    padding: 14px;
    font-size: 0.9rem;
    line-height: 1.6;
    color: black;
    background: #ffffff;
    border: 1px solid #f3f3f3;
    border-radius: 10px;
    outline: none;
    resize: vertical;
    font-family: 'Google Sans Code', 'Menlo', 'Monaco', 'Consolas', 'Ubuntu Mono', monospace;
}

#note-content-input:focus {
    border-color: #e5b3c7;
}
</style>