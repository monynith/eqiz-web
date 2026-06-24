<template>
    <ion-list mode="md" id="skeleton-list">
        <ion-list-header>
            <ion-skeleton-text :animated="true" style="width: 80px"></ion-skeleton-text>
        </ion-list-header>
        <ion-item>
            <ion-thumbnail slot="start">
                <ion-skeleton-text :animated="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
                <h3>
                <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                </h3>
                <p>
                <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
                </p>
                <p>
                <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
                </p>
            </ion-label>
        </ion-item>
        <ion-item>
            <ion-thumbnail slot="start">
                <ion-skeleton-text :animated="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
                <h3>
                <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                </h3>
                <p>
                <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
                </p>
                <p>
                <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
                </p>
            </ion-label>
        </ion-item>
    </ion-list>
</template>

<script setup lang="ts">
import {
    IonItem,
    IonList,
    IonSkeletonText,
    IonThumbnail,
    IonListHeader,
    IonLabel
} from '@ionic/vue';
</script>

<style scoped>
#skeleton-list {
    margin-top: 30px;
    --ion-item-background: transparent;
}
#skeleton-list ion-list-header {
    padding-left: 0px;
}
#skeleton-list ion-item {
    --padding-start: 0px;
}
</style>