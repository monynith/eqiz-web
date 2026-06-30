<template>
    <div class="block">
        <div id="container" @touchmove.stop>
            <p id="title">Earning ($)</p>
            <Skeleton v-if="loading == true" />
            <div v-if="loading == false">
                <div id="filter" @click="onFilter">
                    <span>{{ getFilterLabel() }}</span> <ion-icon :icon="chevronDownOutline"></ion-icon> 
                </div>
                <div id="indicator-wrapper">
                    <div class="indicator">
                        <p class="key">Total Earning ($)</p>
                        <p class="value">$<span>{{ totalEarning }}</span></p>
                        <br/>
                        <p class="key">Total App Sale (#)</p>
                        <p class="value"><span>{{ totalApp }}</span></p>
                    </div>
                    <div id="store-wrapper">
                        <div class="store">
                            <span id="key">
                                <img src="../../assets/appstore.png" width="20px" />
                                App Store 
                            </span>
                            <span id="value">${{ appStoreCount ? appStoreCount.toFixed(2) : 0 }}</span>
                        </div>
                        <div class="store">
                            <span id="key">
                                <img src="../../assets/playstore.png" width="20px" />
                                Play Store 
                            </span>
                            <span id="value">${{ playStoreCount ? playStoreCount.toFixed(2) : 0 }}</span>
                        </div>
                    </div>
                </div>  

                <p class="label">Most App Sale (Top 5)</p>                  
                <table class="table m-t-20 m-b-20">
                    <thead>
                        <tr>
                            <th>App</th>
                            <th>Play Store</th>
                            <th>App Store</th>                
                            <th>Total App Sale ($)</th>                                      
                        </tr>
                    </thead>
                    <tbody class="t-body">
                        <tr v-for="app in apps">
                            <td>{{ app['app'] }}</td>
                            <td>{{ app['play_store_count'] ? '$' + Number(app['play_store_count']).toFixed(2) : '-' }}</td>
                            <td>{{ app['app_store_count'] ? '$' + Number(app['app_store_count']).toFixed(2) : '-' }}</td>
                            <td><b>{{ app['total_count'] ? '$' + Number(app['total_count']).toFixed(2) : '-' }}</b></td>                        
                        </tr>
                    </tbody>
                </table>
                <br/>
                <Doughnut :options="chartOptions" :data="appData" /> 
                <br/>
                <br/>

                <p class="label">Countries (Top 5)</p>                
                <table class="table m-t-20 m-b-20">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Play Store</th>
                            <th>App Store</th>                
                            <th>Total App Sale (#)</th>                                      
                        </tr>
                    </thead>
                    <tbody class="t-body">
                        <tr v-for="country in countries">
                            <td>{{ getCountry(country['country']) }}</td>
                            <td>{{ country['play_store_count'] ? '$' + Number(country['play_store_count']).toFixed(2) : '-' }}</td>
                            <td>{{ country['app_store_count'] ? '$' + Number(country['app_store_count']).toFixed(2) : '-' }}</td>
                            <td><b>{{ country['total_count'] ? '$' + Number(country['total_count']).toFixed(2) : '-' }}</b></td>                        
                        </tr>
                    </tbody>
                </table>
                <Doughnut :options="chartOptions" :data="countryData" />
                <br/>
                <br/>
                
                <p class="label">Summary by Date</p>    
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Play Store</th>
                            <th>App Store</th>                
                            <th>Total App Sale (#)</th>                                      
                        </tr>
                    </thead>
                    <tbody class="t-body">
                        <tr v-for="summary in summaries">
                            <td>{{ summary['date'] }}</td>
                            <td>{{ summary['play_store'] ? '$' + Number(summary['play_store']).toFixed(2) : '-' }}</td>
                            <td>{{ summary['app_store'] ? '$' + Number(summary['app_store']).toFixed(2) : '-' }}</td>
                            <td><b><td>{{ summary['total_app_sale'] ? '$' + Number(summary['total_app_sale']).toFixed(2) : '-' }}</td></b></td>                        
                        </tr>
                    </tbody>
                </table>
                <br/>
                <br/>
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { actionSheetController, IonIcon } from '@ionic/vue';
import { createClient } from '@libsql/client';
import { chevronDownOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { Doughnut } from 'vue-chartjs';
import getCountryISO2 from 'country-iso-3-to-2';
import Skeleton from './Skeleton.vue';

const loading = ref(true);
const todayDate = ref("");
const appData = ref({
    labels: [
        
    ],
    datasets: [{
        label: 'Top 5 App Sales',
        data: [],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        // hoverOffset: 4
    }]
});

const countryData = ref({
    labels: [
        
    ],
    datasets: [{
        label: 'Top 5 App Sales',
        data: [],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        // hoverOffset: 4
    }]
});

const totalEarning = ref(0);
const totalApp = ref(0);
const playStoreCount = ref(0);
const appStoreCount = ref(0);
const apps = ref([]);
const countries = ref([]);
const summaries = ref([]);
const filterStatus = ref("today");
const filterOption = [{
    text: 'Today',
    id: 'today'
}, {
    text: 'Yesterday',
    id: 'yesterday'
}, {
    text: 'This Month',
    id: 'thismonth'
}, {
    text: 'Last Month',
    id: 'lastmonth'
}, {
    text: 'Last 3 Months',
    id: 'last3m'
}];

const props = defineProps({
  filterType: String,
});

if(props.filterType) {
    (filterStatus.value as any) = props.filterType;
}

const chartOptions = ref({
    responsive: true
});

const getYesterday = ()=> {
    const options: any = {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayDate = new Intl.DateTimeFormat('en-US', options).format(yesterday);
    return yesterdayDate;
}

const getThisMonth = ()=> {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        month: 'long' // 'long' returns the full name, 'short' returns 'Jun'
    });
    const currentMonth = formatter.format(new Date());
    const year = new Date().getFullYear();
    return `LIKE '%${currentMonth}%${year}'`;
}

const getLastMonth = ()=> {
    const now = new Date();
    const lastMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        month: 'long'
    });

    const lastMonth = formatter.format(lastMonthDate);
    const year = lastMonthDate.getFullYear();
    return `LIKE '%${lastMonth}%${year}'`;
}

const getLast3Month = ()=> {
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
    return `IN ('${allDatesIn3Months.join("', '")}')`;
}

const getWhereFilter = ()=> {
    let whereString = `WHERE date = '${todayDate.value}' `;    
    if(filterStatus.value == 'yesterday') {
        whereString = `WHERE date = '${getYesterday()}' `;
    }
    if(filterStatus.value == 'thismonth') {        
        whereString = `WHERE date ${getThisMonth()} `;
    }
    if(filterStatus.value == 'lastmonth') {
        whereString = `WHERE date ${getLastMonth()} `;
    }
    if(filterStatus.value == 'last3m') {
        whereString = `WHERE date ${getLast3Month()} `;
    }
    return whereString;
}

const init = async ()=> {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    const options: any = {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };

    todayDate.value = new Intl.DateTimeFormat('en-US', options).format(new Date());
    let whereString = getWhereFilter();

    const result = await client.execute({
        sql: `
            SELECT COUNT(id) as count, SUM(pricing) as amount,
            SUM(CASE WHEN store = 'App Store' THEN pricing END) as app_store,
            SUM(CASE WHEN store = 'Play Store' THEN pricing END) as play_store
            FROM orders 
            ${whereString}
            AND status = 'active'
        `
    });

    if(result.rows && result.rows.length > 0) {
        const data = result.rows[0];
        (totalApp.value as any) = data['count'];
        (totalEarning.value as any) = data['amount'] ? Number(data['amount']).toFixed(2) : 0;
        (playStoreCount.value as any) = data['play_store'];
        (appStoreCount.value as any) = data['app_store'];
    }
}

const getPerApps = async ()=> {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    let whereString = getWhereFilter();
    
    const result = await client.execute({
        sql: `
            WITH RankedApps AS (
                SELECT 
                    app_id,
                    SUM(pricing) as total_sales, -- Total sales used for ranking
                    SUM(CASE WHEN store = 'App Store' THEN pricing END) as app_store_sales,
                    SUM(CASE WHEN store = 'Play Store' THEN pricing END) as play_store_sales,
                    ROW_NUMBER() OVER (ORDER BY SUM(pricing) DESC) as sales_rank
                FROM orders
                ${whereString}
                AND status = 'active'
                GROUP BY app_id
            )
            SELECT 
                CASE 
                    WHEN sales_rank <= 5 THEN CAST(app_id AS VARCHAR) 
                    ELSE 'Others'                                    
                END as app,
                SUM(total_sales) as total_count,
                SUM(app_store_sales) as app_store_count,
                SUM(play_store_sales) as play_store_count
            FROM RankedApps
            GROUP BY 
                CASE 
                    WHEN sales_rank <= 5 THEN CAST(app_id AS VARCHAR) 
                    ELSE 'Others' 
                END
            ORDER BY 
                MAX(sales_rank) ASC;
        `
    });

    (apps.value as any) = result.rows;
    (appData.value as any) = {
        labels: apps.value.map(v => v['app']),
        datasets: [{
            label: 'Top 5 App Sales',
            data: apps.value.map(v => v['total_count']),
            backgroundColor: [
                'rgba(142, 216, 183)',
                'rgba(105, 184, 244)',
                'rgba(190, 207, 246)',
                'rgba(200, 153, 244)',
                'rgba(200, 153, 244)',
                'rgba(182, 190, 199)'
            ],
            // hoverOffset: 4
        }]
    }
}

const getPerCountries = async ()=> {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    let whereString = getWhereFilter();
    
    const result = await client.execute({
        sql: `
            WITH RankedCountries AS (
                SELECT 
                    country,
                    SUM(pricing) as total_sales, -- Total sales used for ranking countries
                    SUM(CASE WHEN store = 'App Store' THEN pricing END) as app_store_sales,
                    SUM(CASE WHEN store = 'Play Store' THEN pricing END) as play_store_sales,
                    ROW_NUMBER() OVER (ORDER BY SUM(pricing) DESC) as sales_rank
                FROM orders
                ${whereString}
                AND status = 'active'
                GROUP BY country
            )
            SELECT 
                CASE 
                    WHEN sales_rank <= 5 THEN CAST(country AS VARCHAR) 
                    ELSE 'Others'                                    
                END as country,
                SUM(total_sales) as total_count,
                SUM(app_store_sales) as app_store_count,
                SUM(play_store_sales) as play_store_count
            FROM RankedCountries
            GROUP BY 
                CASE 
                    WHEN sales_rank <= 5 THEN CAST(country AS VARCHAR) 
                    ELSE 'Others' 
                END
            ORDER BY 
                MAX(sales_rank) ASC;
        `
    });

    if(result.rows.length > 0){
        (countries.value as any) = result.rows;
        (countryData.value as any) = {
            labels: countries.value.map(v => getCountry(v['country'])),
            datasets: [{
                label: 'Top 5 Country Sales',
                data: countries.value.map(v => v['total_count']),
                backgroundColor: [
                    'rgba(142, 216, 183)',
                    'rgba(105, 184, 244)',
                    'rgba(190, 207, 246)',
                    'rgba(200, 153, 244)',
                    'rgba(200, 153, 244)',
                    'rgba(182, 190, 199)'
                ],
                // hoverOffset: 4
            }]
        }
    }
    loading.value = false;
}

const getSummary = async ()=> {
    const dbUrl = import.meta.env.VITE_DB_URL;
    const dbToken = import.meta.env.VITE_DB_TOKEN;

    const client = createClient({
        url: dbUrl,
        authToken: dbToken,
    });

    let whereString = getWhereFilter();

    const result = await client.execute({
        sql: `
            SELECT 
                date,
                SUM(CASE WHEN store = 'Play Store' THEN pricing END) as play_store,
                SUM(CASE WHEN store = 'App Store' THEN pricing END) as app_store,
                SUM(pricing) as total_app_sale
            FROM orders 
            ${ whereString }
            AND status = 'active'
            GROUP BY date
            ORDER BY 
                -- 1. Extract the Year (last 4 characters)
                SUBSTR(date, -4) ASC, 
                
                -- 2. Extract and convert the Month name to a sortable number
                CASE SUBSTR(date, 1, 3)
                    WHEN 'Jan' THEN 1 WHEN 'Feb' THEN 2 WHEN 'Mar' THEN 3 
                    WHEN 'Apr' THEN 4 WHEN 'May' THEN 5 WHEN 'Jun' THEN 6 
                    WHEN 'Jul' THEN 7 WHEN 'Aug' THEN 8 WHEN 'Sep' THEN 9 
                    WHEN 'Oct' THEN 10 WHEN 'Nov' THEN 11 WHEN 'Dec' THEN 12
                END ASC,
                
                -- 3. Extract the Day number (characters between the space and the comma)
                CAST(TRIM(SUBSTR(date, INSTR(date, ' ') + 1, INSTR(date, ',') - INSTR(date, ' ') - 1)) AS INTEGER) ASC;
        `
    });
    (summaries.value as any) = result.rows;
}

const getCountry = (countryCode: string)=> {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    try {
        const countryName = regionNames.of(getCountryISO2(countryCode)); 
        return countryName || '';
    } catch(_) {
        return countryCode;
    } 
}

const onFilter = async ()=> {    
    const actionSheet = await actionSheetController.create({
        header: 'Select filter',
        buttons: filterOption.map(v => {
            return {
                text: v['text'],
                handler: () => {
                    loading.value = true;
                    filterStatus.value = v['id'];
                    init();
                    getPerApps();
                    getPerCountries();
                    getSummary();
                }
            }
        }),
        mode: 'md'
    });

    await actionSheet.present();
}

const getFilterLabel = ()=> {
    const label = filterOption.find(v => v['id'] == filterStatus.value);
    return label ? label['text'] : ''
}

init();
getPerApps();
getPerCountries();
getSummary();

</script>

<style scoped>
@import url(../../theme/appSale.css);
</style>