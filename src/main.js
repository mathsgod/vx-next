import './style/index.css';

// Bootstrap
import './scss/bootstrap.scss';

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'



import { createApp } from 'vue';
import * as Vue from 'vue';
window.Vue = Vue;


// app
import App from './App.vue'
const app = createApp(App)
import routes from "./routes.js";
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes,
});
app.use(router)


// element plus
import ElementPlus from 'element-plus'
//import 'element-plus/dist/index.css'
import './scss/main.scss';

app.use(ElementPlus)

// element plus icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {

    //key to underscore
    const keyUnderscore = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    //removing the first _
    const keyUnderscore2 = keyUnderscore.replace(/^_/, '');
    //replace _ to -
    const keyUnderscore3 = keyUnderscore2.replace(/_/g, '-');
    app.component("el-icon-" + keyUnderscore3, component)
}


import { Quasar, Dark, LoadingBar, useQuasar, Dialog, Notify } from 'quasar'
window.Dark = Dark;
app.use(Quasar, {
    plugins: {
        LoadingBar,
        Dialog,
        Notify
    }, // import Quasar plugins and add here,
    // src/css/quasar.variables.sass

    config: {
        brand: {
            primary: '#7367f0',
            secondary: '#82868b',
            accent: '#7367f0',

            dark: '#1d1d1d',

            positive: '#28c76f',
            negative: '#ea5455',
            info: '#00cfe8',
            warning: '#ff9f43'
        }
    }
})

// VX
import vx from './vx';
app.use(vx);

import VxComponent from './components/vx.js';
app.use(VxComponent);


//i18n
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
    globalInjection: true,
    locale: 'en',
    messages: {
        en: {
            hello: 'hello!'
        },
        ja: {
            hello: 'こんにちは！'
        }
    }
});

window.i18n = i18n.global;
window.I18n = i18n;
app.use(i18n)

app.mount('#app')


window.apps = [];
let init_vue = function (element) {

    if (!element.parentNode) return;
    var nodes = element.parentNode.querySelectorAll("r-table, vue, vx-tabs, q-card, el-card, vx-form, vx-form-table, vx-view, el-table, el-link, router-link, vx-table, el-menu, vx-dialog-button");
    nodes.forEach(node => {

        let app = createApp({
            setup() {
            }

        })

        app.use(i18n)
        app.use(router)
        app.use(ElementPlus)
        app.use(vx)
        app.use(VxComponent);
        app.use(Quasar, {
            plugins: {
                LoadingBar,
                Dialog,
                Notify
            }
        });


        app.mount(node.parentNode);

        window.apps.push(app);
    });

}

document.addEventListener("DOMContentLoaded", () => {
    //console.log("content loaded");
    let observer = new MutationObserver(mutationList => {
        //  console.log("mutations");

        mutationList.forEach(record => {
            init_vue(record.target);
        });
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
    init_vue(document);
});

window.createApp = createApp;