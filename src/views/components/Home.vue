<template>
    <div id="indicator-wrapper">
        <div class="indicator">
            <p class="key">Today App Sale (#)</p>
            <p class="value"><span>168</span></p>
        </div>
        <div class="indicator">
            <p class="key">Today Revenue ($)</p>
            <p class="value">$<span>168</span></p>
        </div>
        <div class="indicator">
            <p class="key">App Store vs Play Store</p>
            <p class="value">$<span>168</span> / $<span>100</span></p>
        </div>
    </div>
    <div id="data-wrapper">
        <div>
            <p id="label">Performance <span>(Last 7 Days: Jun 16 - 24, 2026)</span></p>
            <p id="amount">$<span>68.2</span> processed</p>
        </div>        
        <div id="filter">
            <span>Last 7 days</span> <ion-icon :icon="chevronDownOutline"></ion-icon> 
        </div>
    </div>
    <Line id="line-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import 'chart.js/auto'
import { chevronDownOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';

const chartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7"],
    datasets: [{
        label: 'App Sale ($)',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: 'rgba(223, 114, 153, 0.4)',                    // Strong Raspberry Pink Line
        backgroundColor: 'rgba(223, 114, 153, 0.1)', // Subtle, transparent Pink Fill
        tension: 0.5
    }]
}

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false // This hides the dataset label at the top
        }
    },
    scales: {
        x: {
            grid: {
        display: false // Removes vertical grid lines
      },
            ticks: {
                font: {
                    family: '"PT Sans"'
                },
                color: '#000000',
            }
        },
        y: {
            ticks: {
                font: {
                    family: '"PT Sans"' // Target the y-axis labels
                },
                color: '#000000',
            }
        }
    }
}
</script>

<style scoped>
@import url(../../theme/home.css);
</style>