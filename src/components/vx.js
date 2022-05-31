import VxForm from './vx-form.vue';
import VxTable from './vx-table.vue';
import VxTabs from './vx-tabs.vue';
import VxTab from './vx-tab.vue';
import VxIcon from './vx-icon.vue';
import VxAvatar from './vx-avatar.vue';
import VxFileManager from './vx-file-manager.vue';
import VxFileInput from './vx-file-input.vue';


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
    }
}