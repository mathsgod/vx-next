import PageLogin from "./pages/page-login.vue";
import PageResetPassword from "./pages/page-reset-password.vue";
import VxApp from "./components/vx-app.vue";
import VxForgotPassword from './pages/page-forgot-password.vue';
import VxTest from "./components/vx-test.vue";

export default [
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
    }, {
        path: '/User',
        component: VxApp,
        children: [
            {
                path: "setting",
                component: import("./pages/page-user-setting.vue"),
                children: [{
                    path: "general",
                    component: import("./pages/User/setting/general.vue")
                }, {
                    path: "password",
                    component: import("./pages/User/setting/password.vue")
                },
                {
                    path: "information",
                    component: import("./pages/User/setting/information.vue")
                },
                {
                    path: "style",
                    component: import("./pages/User/setting/style.vue")
                }, {
                    path: "2fa",
                    component: import("./pages/User/setting/2fa.vue")
                },
                {
                    path: "bio-auth",
                    component: import("./pages/User/setting/bio-auth.vue")
                }]
            }
        ]
    },
    {
        path: '/:catchAll(.*)',
        component: VxApp
    },
];