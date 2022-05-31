import PageLogin from "./pages/page-login.vue";
import PageResetPassword from "./pages/page-reset-password.vue";
import VxApp from "./components/vx-app.vue";
import VxForgotPassword from './pages/page-forgot-password.vue';

export default [
    {
        path: "/",
        component: PageLogin
    }, {
        path: "/two-step-verification",
        component: import("./pages/two-step-verification.vue")
    },
    {
        path: "/forgot_password",
        component: VxForgotPassword
    },
    {
        path: "/test",
        component: import("./components/vx-test.vue")
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
        path: '/System/Module',
        component: VxApp,
        children: [
            {
                path: "builder",
                component: import("./pages/System/Module/builder.vue"),
            }
        ]
    },
    {
        path: '/User',
        component: VxApp,
        children: [
            {
                path: "setting",
                component: import("./pages/User/setting.vue"),
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

            },
            {
                path: "profile",
                component: import("./pages/User/profile.vue")
            }
        ]
    },
    {
        path: '/:catchAll(.*)',
        component: VxApp
    },
];