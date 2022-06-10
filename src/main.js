import './style/index.css';

// Bootstrap
import './scss/bootstrap.scss';

// Import Quasar css
import "./scss/quasar.scss";

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

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


window.apps = [];
let init_vue = function (element) {

    if (!element.parentNode) return;
    var nodes = element.parentNode.querySelectorAll("r-table, vue, vx-tabs, q-card, el-card, vx-form, vx-form-table, vx-view, el-table, el-link, router-link, vx-table, el-menu, vx-dialog-button, q-avatar");
    nodes.forEach(node => {

        let app = createApp({
            setup() {
            }

        })

        app.use(i18n)
        app.use(router)

        app.use(vx)
        app.use(VxComponent);

        app.mount(node.parentNode);

        window.apps.push(app);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    //console.log("content loaded");
    let observer = new MutationObserver(mutationList => {
        mutationList.forEach(record => {
            init_vue(record.target);
        });
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
    init_vue(document);
});




app.use(router)


//import 'element-plus/dist/index.css'
import './scss/main.scss';


// VX
import vx from './vx';
app.use(vx);

import VxComponent from './components/vx.js';
app.use(VxComponent);

import zhTW from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en';

import { getInstance } from './vx.js'
let vx_instance = getInstance();

//i18n
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
    globalInjection: true,
    locale: vx_instance.locale,
    messages: {
        en: en,
        "zh-hk": zhTW,
        "zh-tw": zhTW,
    }
});

const locale = vx_instance.locale ?? 'en';

let messages = i18n.global.getLocaleMessage(vx_instance.locale ?? "en");
i18n.global.setLocaleMessage(locale, { ...messages, ...vx_instance.i18n });


window.i18n = i18n.global;
window.I18n = i18n;
app.use(i18n)

app.mount('#app')

window.createApp = createApp;