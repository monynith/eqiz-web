<template>
    <Skeleton v-if="loading == true" />
    <div v-if="loading == false">
        <div id="indicator-filter">
            <span v-if="indicatorFilter == 'today'">Today<b style="color: black">: {{ todayDate }}</b>&nbsp;</span>
        </div>
        <div id="indicator-wrapper">
            <div class="indicator">
                <p class="key">Today App Sale (#)</p>
                <p class="value"><span>{{ indicatorData.todaySale }}</span></p>
            </div>
            <div class="indicator">
                <p class="key">Today Earning ($)</p>
                <p class="value">$<span>{{ indicatorData.todayAmount }}</span></p>
            </div>
            <div class="indicator">
                <p class="key">Yesterday Earning ($)</p>
                <p class="value">$<span>{{ indicatorData.yesterdayAmount }}</span></p>
                <!-- <p class="value">$<span>168</span> / $<span>100</span></p> -->
            </div>
        </div>
    </div>
    <div id="data-wrapper">
        <div>
            <p id="label">Performance</p>
            <p id="amount" v-if="loadingPerfomance == false">$<span>{{ processedAmount }}</span> of {{ appSale }} apps
                processed</p>
        </div>
        <div id="filter" v-if="loadingPerfomance == false" @click="filterPerformance">
            <span>{{ getFilterPerformanceLabel() }}</span> <ion-icon :icon="chevronDownOutline"></ion-icon>
        </div>
    </div>
    <Skeleton v-if="loadingPerfomance == true" />
    <Line v-if="loadingPerfomance == false" id="line-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import 'chart.js/auto'
import { chevronDownOutline } from 'ionicons/icons';
import { actionSheetController, IonIcon } from '@ionic/vue';
import { ref } from 'vue';
import { createClient } from '@libsql/client';
import Skeleton from './Skeleton.vue';

const indicatorFilter = ref("today");
const todayDate = ref("");
const loading = ref(true);
const loadingPerfomance = ref(true);
const performanceType = ref("last7d")
const processedAmount = ref(0);
const appSale = ref(0);

const indicatorData = ref({
    todaySale: 0,
    todayAmount: 0,
    yesterdayAmount: 0
})

const chartData = ref({
    labels: [],
    datasets: [{
        label: 'App Sale ($)',
        data: [],
        fill: true,
        borderColor: 'rgba(223, 114, 153, 0.4)',
        backgroundColor: 'rgba(223, 114, 153, 0.1)',
        tension: 0.5
    }]
});

const chartOptions = ref({
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
});

const getToday = async () => {
    // load today and yesterday data
    const options: any = {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    todayDate.value = new Intl.DateTimeFormat('en-US', options).format(new Date());

    //yesterday
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayDate = new Intl.DateTimeFormat('en-US', options).format(yesterday);

    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });
    const results = await client.batch([{
        sql: `
            SELECT COUNT(id) as count, SUM(pricing) as amount FROM orders 
            WHERE date = '${todayDate}' 
            AND status = 'active'
        `
    }, {
        sql: `
            SELECT SUM(pricing) as amount FROM orders 
            WHERE date = '${yesterdayDate}' 
            AND status = 'active'
        `
    }]);
    if (results[0] && results[0].rows.length > 0) {
        (indicatorData.value.todaySale as any) = results[0].rows[0]['count'];
        (indicatorData.value.todayAmount as any) = results[0].rows[0]['amount'] || 0;
    }
    if (results[1] && results[1].rows.length > 0) {
        (indicatorData.value.yesterdayAmount as any) = results[1].rows[0]['amount'] || 0;
    }
    loading.value = false;
}

const getLast7d = async () => {
    const last7Days = [];
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });

    for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - i); // Subtract i days
        last7Days.push('' + formatter.format(d));
    }

    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    const result = await client.execute({
        sql: `
            SELECT 
                date, 
                SUM(pricing) AS total,
                SUM(SUM(pricing)) OVER() AS grand_total,
                SUM(COUNT(id)) OVER() AS total_app_sale
            FROM orders 
            WHERE status = 'active'
            AND date IN ('${last7Days.sort().join("', '")}')
            GROUP BY date
            ORDER BY date ASC;
        `
    });
    if (result.rows && result.rows.length > 0) {
        processedAmount.value = Number(result.rows[0]['grand_total'] || 0);
        appSale.value = Number(result.rows[0]['total_app_sale'] || 0);
        (chartData.value as any) = {
            labels: last7Days.sort().map(date => date.replace(/, \d{4}/, '')),
            datasets: [{
                label: 'App Sale ($)',
                data: result.rows.map(v => v['total']),
                fill: true,
                borderColor: 'rgba(223, 114, 153, 0.4)',                    // Strong Raspberry Pink Line
                backgroundColor: 'rgba(223, 114, 153, 0.1)', // Subtle, transparent Pink Fill
                tension: 0.5
            }]
        };
    }
    loadingPerfomance.value = false;
}

const getCurrentMonth = async () => {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        month: 'long' // 'long' returns the full name, 'short' returns 'Jun'
    });

    const currentMonth = formatter.format(new Date());
    const year = new Date().getFullYear();
    const result = await client.execute({
        sql: `
            SELECT 
                date, 
                SUM(pricing) AS total,
                SUM(SUM(pricing)) OVER() AS grand_total,
                SUM(COUNT(id)) OVER() AS total_app_sale
            FROM orders 
            WHERE status = 'active'
            AND date LIKE '%${currentMonth}%${year}'
            GROUP BY date
            ORDER BY date ASC;
        `
    });
    if (result.rows && result.rows.length > 0) {
        // console.log(result.rows);    
        processedAmount.value = Number(result.rows[0]['grand_total'] || 0);
        appSale.value = Number(result.rows[0]['total_app_sale'] || 0);
        const now = new Date();
        const currentYear = now.getUTCFullYear();
        const currentMonthIndex = now.getUTCMonth(); // 0 = Jan, 5 = June, etc.        
        const totalDaysInMonth = new Date(Date.UTC(currentYear, currentMonthIndex + 1, 0)).getUTCDate();

        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        // Generate array of all formatted dates for this month
        const allDatesInCurrentMonth = Array.from({ length: totalDaysInMonth }, (_, i) => {
            const d = new Date(Date.UTC(currentYear, currentMonthIndex, i + 1));
            return formatter.format(d);
        });
        // console.log(allDatesInCurrentMonth);

        const data: any = [];
        allDatesInCurrentMonth.forEach(date => {
            const amount = result.rows.find(v => v['date'] == date);
            if (amount && amount['total']) {
                data.push({
                    date,
                    total: amount['total']
                })
            } else {
                data.push({
                    date,
                    total: 0
                })
            }
        });
        (chartData.value as any) = {
            labels: data.map((v: any) => v['date'].replace(/, \d{4}/, '')),
            datasets: [{
                label: 'App Sale ($)',
                data: data.map((v: any) => v['total']),
                fill: true,
                borderColor: 'rgba(223, 114, 153, 0.4)',                    // Strong Raspberry Pink Line
                backgroundColor: 'rgba(223, 114, 153, 0.1)', // Subtle, transparent Pink Fill
                tension: 0.5
            }]
        };
    }
    loadingPerfomance.value = false;
}

const getLastMonth = async () => {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    const now = new Date();

    // Create a UTC date set to the 1st day of LAST month
    // (now.getUTCMonth() - 1 automatically handles rolling back to December of the previous year if it's currently January)
    const lastMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        month: 'long'
    });

    const lastMonth = formatter.format(lastMonthDate);
    const year = new Date().getFullYear();
    const result = await client.execute({
        sql: `
            SELECT 
                date, 
                SUM(pricing) AS total,
                SUM(SUM(pricing)) OVER() AS grand_total,
                SUM(COUNT(id)) OVER() AS total_app_sale
            FROM orders 
            WHERE status = 'active'
            AND date LIKE '%${lastMonth}%${year}'
            GROUP BY date
            ORDER BY date ASC;
        `
    });
    if (result.rows && result.rows.length > 0) {
        // console.log(result.rows);    
        processedAmount.value = Number(result.rows[0]['grand_total'] || 0);
        appSale.value = Number(result.rows[0]['total_app_sale'] || 0);

        const now = new Date();
        const currentYear = now.getUTCFullYear();

        // 1. Shift the month index back by 1 to target last month
        const lastMonthIndex = now.getUTCMonth() - 1;

        // 2. Get total days in LAST month by setting the day parameter to '0' 
        // (e.g., setting day to 0 of lastMonthIndex + 1 yields the last day of last month)
        const totalDaysInLastMonth = new Date(Date.UTC(currentYear, lastMonthIndex + 1, 0)).getUTCDate();

        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        // 3. Generate array of all formatted dates for last month
        const allDatesInLastMonth = Array.from({ length: totalDaysInLastMonth }, (_, i) => {
            const d = new Date(Date.UTC(currentYear, lastMonthIndex, i + 1));
            return formatter.format(d);
        });

        const data: any = [];
        allDatesInLastMonth.forEach(date => {
            const amount = result.rows.find(v => v['date'] == date);
            if (amount && amount['total']) {
                data.push({
                    date,
                    total: amount['total']
                })
            } else {
                data.push({
                    date,
                    total: 0
                })
            }
        });
        (chartData.value as any) = {
            labels: data.map((v: any) => v['date'].replace(/, \d{4}/, '')),
            datasets: [{
                label: 'App Sale ($)',
                data: data.map((v: any) => v['total']),
                fill: true,
                borderColor: 'rgba(223, 114, 153, 0.4)',                    // Strong Raspberry Pink Line
                backgroundColor: 'rgba(223, 114, 153, 0.1)', // Subtle, transparent Pink Fill
                tension: 0.5
            }]
        };
    }
    loadingPerfomance.value = false;
}

const get3Month = async () => {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    const startDate = new Date(Date.UTC(currentYear, currentMonth - 2, 1)); // April 1
    const endDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0));   // June 30

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const allDatesIn3Months = [];
    let loopDate = new Date(startDate);

    while (loopDate <= endDate) {
        allDatesIn3Months.push(formatter.format(loopDate));
        loopDate.setUTCDate(loopDate.getUTCDate() + 1);
    }

    const result = await client.execute({
        sql: `
        WITH converted_orders AS (
            SELECT 
                pricing,
                id,
                strftime('%Y-%m-%d', 
                    substr(date, -4) || '-' || 
                    CASE 
                        WHEN date LIKE 'January%' THEN '01'
                        WHEN date LIKE 'February%' THEN '02'
                        WHEN date LIKE 'March%' THEN '03'
                        WHEN date LIKE 'April%' THEN '04'
                        WHEN date LIKE 'May%' THEN '05'
                        WHEN date LIKE 'June%' THEN '06'
                        WHEN date LIKE 'July%' THEN '07'
                        WHEN date LIKE 'August%' THEN '08'
                        WHEN date LIKE 'September%' THEN '09'
                        WHEN date LIKE 'October%' THEN '10'
                        WHEN date LIKE 'November%' THEN '11'
                        WHEN date LIKE 'December%' THEN '12'
                    END || '-' || 
                    printf('%02d', substr(date, instr(date, ' ') + 1, instr(date, ',') - instr(date, ' ') - 1))
                ) AS iso_date
            FROM orders
            WHERE status = 'active'
              AND date IN ('${allDatesIn3Months.join("', '")}')
        ),
        weekly_bounds AS (
            SELECT 
                pricing,
                id,
                strftime('%W', iso_date) AS week_number,
                -- Monday of that week
                date(iso_date, 'weekday 0', '-6 days') AS w_start, 
                -- Sunday of that week
                date(iso_date, 'weekday 0') AS w_end              
            FROM converted_orders
        )
        SELECT             
            -- Construct the custom string range: "Month Day - Month Day, Year"
            CASE strftime('%m', w_start)
                WHEN '01' THEN 'January' WHEN '02' THEN 'February' WHEN '03' THEN 'March'
                WHEN '04' THEN 'April'   WHEN '05' THEN 'May'      WHEN '06' THEN 'June'
                WHEN '07' THEN 'July'    WHEN '08' THEN 'August'   WHEN '09' THEN 'September'
                WHEN '10' THEN 'October' WHEN '11' THEN 'November' WHEN '12' THEN 'December'
            END || ' ' || cast(strftime('%d', w_start) as integer) || ' - ' ||
            CASE strftime('%m', w_end)
                WHEN '01' THEN 'January' WHEN '02' THEN 'February' WHEN '03' THEN 'March'
                WHEN '04' THEN 'April'   WHEN '05' THEN 'May'      WHEN '06' THEN 'June'
                WHEN '07' THEN 'July'    WHEN '08' THEN 'August'   WHEN '09' THEN 'September'
                WHEN '10' THEN 'October' WHEN '11' THEN 'November' WHEN '12' THEN 'December'
            END || ' ' || cast(strftime('%d', w_end) as integer) || ', ' || strftime('%Y', w_end) AS week_range,
            
            SUM(pricing) AS total,
            SUM(SUM(pricing)) OVER() AS grand_total,
            SUM(COUNT(id)) OVER() AS total_app_sale
        FROM weekly_bounds
        GROUP BY week_number
        ORDER BY week_number ASC;
    `
    });

    if (result.rows && result.rows.length > 0) {
        // console.log(result.rows);    
        processedAmount.value = Number(result.rows[0]['grand_total'] || 0);
        appSale.value = Number(result.rows[0]['total_app_sale'] || 0);

        (chartData.value as any) = {
            labels: result.rows.map((v: any) => v['week_range'].replace(/, \d{4}/, '')),
            datasets: [{
                label: 'App Sale ($)',
                data: result.rows.map((v: any) => v['total']),
                fill: true,
                borderColor: 'rgba(223, 114, 153, 0.4)',                    // Strong Raspberry Pink Line
                backgroundColor: 'rgba(223, 114, 153, 0.1)', // Subtle, transparent Pink Fill
                tension: 0.5
            }]
        };
    }
    loadingPerfomance.value = false;
}


const getPerformance = async () => {
    if (performanceType.value == 'last7d') getLast7d();
    if (performanceType.value == 'thismonth') getCurrentMonth();
    if (performanceType.value == 'lastmonth') getLastMonth();
    if (performanceType.value == 'last3m') get3Month();
}

const getFilterPerformanceLabel = () => {
    if (performanceType.value == 'last7d') {
        const last7Days = [];
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });

        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() - i); // Subtract i days
            last7Days.push(formatter.format(d));
        }
        return `Last 7 Days: ${last7Days[last7Days.length - 1].split(',')[0]} - ${last7Days[0]}`;
    } else if (performanceType.value == 'thismonth') {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            month: 'long' // 'long' returns the full name, 'short' returns 'Jun'
        });

        const currentMonth = formatter.format(new Date());
        const year = new Date().getFullYear();
        return `This Month: ${currentMonth} ${year}`;
    } else if (performanceType.value == 'lastmonth') {
        const now = new Date();
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth();

        // Create a UTC date set to the 1st day of LAST month
        // (Passing currentMonth - 1 handles transitioning to December of the previous year automatically)
        const lastMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));

        const monthFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long' });
        const yearFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric' });

        const lastMonth = monthFormatter.format(lastMonthDate);
        const year = yearFormatter.format(lastMonthDate);

        return `Last Month: ${lastMonth} ${year}`;
    } else if (performanceType.value == 'last3m') {
        const now = new Date();
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth();

        // Start date: 2 months ago (e.g., April if current is June)
        const rangeStartDate = new Date(Date.UTC(currentYear, currentMonth - 2, 1));
        // End date: This month (e.g., June)
        const rangeEndDate = new Date(Date.UTC(currentYear, currentMonth, 1));

        const monthFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long' });
        const yearFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric' });

        const startMonth = monthFormatter.format(rangeStartDate);
        const endMonth = monthFormatter.format(rangeEndDate);
        const year = yearFormatter.format(rangeEndDate);

        return `Last 3 Months: ${startMonth} - ${endMonth} ${year}`;
    }
}

const filterPerformance = async () => {
    const options = [{
        text: 'Last 7 Days',
        id: 'last7d'
    }, {
        text: 'This Month',
        id: 'thismonth'
    }, {
        text: 'Last Month',
        id: 'lastmonth'
    }, {
        text: 'Last 3 Months',
        id: 'last3m'
    }]
    const actionSheet = await actionSheetController.create({
        header: 'Select filter',
        buttons: options.map(v => {
            return {
                text: v['text'],
                handler: () => {
                    performanceType.value = v['id'];
                    loadingPerfomance.value = true;
                    getPerformance();
                }
            }
        }),
        mode: 'md'
    });

    await actionSheet.present();
};

getToday();
getPerformance();

</script>

<style scoped>
@import url(../../theme/home.css);
</style>