import './assets/css/bootstrap.css';
import './assets/css/bootstrap-extended.css';
import './assets/css/colors.css';
import './assets/css/components.css';
import './assets/css/themes/dark-layout.css';
import './assets/css/themes/bordered-layout.css';
import './assets/css/themes/semi-dark-layout.css';
import './assets/css/core/menu/menu-types/vertical-menu.css'


// element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './scss/main.scss';
import { createApp } from 'vue';
import * as Vue from 'vue';
window.Vue = Vue;


import VxApp from "./components/vx-app.vue";
import VxForgotPassword from './pages/page-forgot-password.vue';
import VxTest from "./components/vx-test.vue";
import PageLogin from "./pages/page-login.vue";
import PageResetPassword from "./pages/page-reset-password.vue";

const routes = [
    {
        path: "/",
        component: PageLogin
    },
    {
        path: "/forgot_password",
        component: VxForgotPassword
    },
    {
        path: "/test",
        component: VxTest
    },
    {
        path: "/reset-password",
        component: PageResetPassword
    },
    {
        path: '/:module/:action',
        component: VxApp
    },
    {
        path: '/:module/:id/:action',
        component: VxApp
    },
    {
        path: '/:module',
        component: VxApp
    },
    {
        path: '/:catchAll(.*)',
        component: VxApp
    },
];

import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// app
import App from './App.vue'



const app = createApp(App)
app.use(router)


import vx from './vx';
app.use(vx);


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

app.use(i18n)



app.use(ElementPlus)
app.mount('#app')

import VxComponent from './components/vx.js';

window.apps = [];
let init_vue = function (element) {

    if (!element.parentNode) return;
    var nodes = element.parentNode.querySelectorAll("r-table, card, vue, vx-tabs, el-card, vx-form, vx-form-table, vx-view, el-table, el-link, router-link, vx-table, el-menu, vx-dialog-button");
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


        app.mount(node.parentNode);

        //window.apps.push(app);
    });

}

document.addEventListener("DOMContentLoaded", () => {
    console.log("content loaded");
    let observer = new MutationObserver(mutationList => {
        console.log("mutations");

        mutationList.forEach(record => {
            init_vue(record.target);
        });
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
    init_vue(document);
});

window.createApp = createApp;