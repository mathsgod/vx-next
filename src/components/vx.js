import VxForm from './vx-form.vue';
import VxTable from './vx-table.vue';
import VxTabs from './vx-tabs.vue';
import VxTab from './vx-tab.vue';
import VxIcon from './vx-icon.vue';
import VxAvatar from './vx-avatar.vue';
import VxFileManager from './vx-file-manager.vue';
import VxFileInput from './vx-file-input.vue';
import VxTinymce from './vx-tinymce.vue';

// element plus
import ElementPlus from 'element-plus'

// element plus icons
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { Quasar, LoadingBar, useQuasar, Dialog, Notify } from 'quasar'



export default {
    install(app, options) {

        app.component("vx-form", VxForm);
        app.component("vx-table", VxTable);
        app.component("vx-tabs", VxTabs);
        app.component("vx-tab", VxTab);
        app.component("vx-icon", VxIcon);
        app.component("vx-avatar", VxAvatar);
        app.component("vx-file-manager", VxFileManager);
        app.component("vx-file-input", VxFileInput);
        app.component("vx-tinymce", VxTinymce);

        // element plus
        app.use(ElementPlus);

        // element plus icons
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {

            //key to underscore
            const keyUnderscore = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            //removing the first _
            const keyUnderscore2 = keyUnderscore.replace(/^_/, '');
            //replace _ to -
            const keyUnderscore3 = keyUnderscore2.replace(/_/g, '-');
            app.component("el-icon-" + keyUnderscore3, component)
        }

        // quasar

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


    }


}

