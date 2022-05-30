<script setup>
import { Quasar, Dark } from "quasar";
import ElementPlus from "element-plus";
import VxCustomizer from "./vx-customizer.vue";
import VxMenu from "./vx-menu.vue";
import VxComponent from "./vx.js";
import { ref } from "vue";
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>
<template>
  <q-layout view="hHh LpR lFr">
    <q-header bordered class="text-white" :class="headerColor">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> {{ $vx.config.company }} </q-toolbar-title>

        <q-btn flat round dense icon="person">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item v-close-popup to="/User/profile">
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item v-close-popup to="/User/setting">
                <q-item-section>Setting</q-item-section>
              </q-item>

              <q-item
                clickable
                v-for="(dd, index) in $vx.navbar.dropdown"
                :key="index"
                :to="dd.link"
              >
                <q-item-section v-text="dd.label"> </q-item-section>
              </q-item>

              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="logout()">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :mini="isMini"
      :mini-to-overlay="style.miniState"
      @mouseout="isMouseOnDrawer = false"
      @mouseover="isMouseOnDrawer = true"
      :width="260"
    >
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list padding>
          <VxMenu
            v-for="(m, index) in $vx.menus"
            :value="m"
            :key="index"
          ></VxMenu>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay elevated>
      <!-- drawer content -->

      <q-scroll-area class="fit">
        <VxCustomizer
          v-model:miniState="style.miniState"
          v-model:headerColor="headerColor"
          v-model:theme="style.theme"
        ></VxCustomizer>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <q-toolbar>
          <q-toolbar-title shrink>{{ title }}</q-toolbar-title>
          <q-breadcrumbs>
            <q-breadcrumbs-el label="Home" to="/" />
            <q-breadcrumbs-el
              v-for="(breadcrumb, index) in breadcrumbs"
              :key="index"
              :label="breadcrumb.label"
              :to="breadcrumb.to"
            ></q-breadcrumbs-el>
          </q-breadcrumbs>
        </q-toolbar>
        <router-view></router-view>
        <div ref="content" v-loading="loading"></div>

        <!-- q-page-scroller
          position="bottom-right"
          :scroll-offset="150"
          :offset="[18, 18]"
        >
          <q-btn fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { loadModule } from "vue3-sfc-loader";
export default {
  data() {
    return {
      style: {
        miniState: false,
        theme: "light",
      },
      isMouseOnDrawer: false,
      headerColor: "bg-primary",
      title: "",
      loading: false,
    };
  },
  watch: {
    "style.theme"(val) {
      if (val == "dark") {
        this.$vx.useDark(true);
      } else {
        this.$vx.useDark(false);
      }
    },
    headerColor() {
      console.log(this.headerColor);
    },
    async $route(to) {
      this.$vx.setRoute(to);
      this.loadURL(to.fullPath);
    },
  },
  async mounted() {
    await this.loadURL(this.$route.fullPath);
  },
  computed: {
    breadcrumbs() {
      let breadcrumbs = [];
      let paths = this.$route.path.split("/");

      if (paths.length > 2) {
        if (paths[paths.length - 1] == "view") {
          breadcrumbs.push({
            to: "/" + paths[1],
            //label: this.$i18n.t(paths[1]),
            label: paths[1],
          });
        } else {
          if (paths.length == 4) {
            breadcrumbs.push({
              to: "/" + paths[1] + "/" + paths[2] + "/view",
              //label: this.$i18n.t(paths[1]),
              label: paths[1],
            });
          } else {
            breadcrumbs.push({
              to: "/" + paths[1],
              //label: this.$i18n.t(paths[1]),
              label: paths[1],
            });
          }
        }
      }
      return breadcrumbs;
    },
    isMini() {
      if (this.isMouseOnDrawer) {
        return false;
      }
      if (this.style.miniState) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async logout() {
      await this.$vx.logout();
      this.$emit("logout");
      this.$router.push("/");
    },

    async loadURL(path) {
      //unmount all
      for (let a of window.apps) {
        a.unmount();
      }
      window.apps = [];

      let content_el = this.$refs.content;
      while (content_el.firstChild) {
        content_el.removeChild(content_el.firstChild);
      }

      this.title = path.split("/").pop();

      //check the route is in routes record
      let paths = this.$router.getRoutes().map((r) => r.path);

      paths = paths.filter((p) => p != "/User");
      if (paths.includes(this.$route.path)) {
        return;
      }

      this.loading = true;
      let resp = await this.$vx.get(path, {
        headers: {
          Accept: "text/vue,text/html",
        },
      });
      this.loading = false;

      let content = "";
      //chech content type is vue
      if (resp.headers["content-type"].includes("text/vue")) {
        content = resp.data;

        const options = {
          moduleCache: {
            vue: Vue,
          },
          async getFile(url) {
            return content;
          },
          addStyle(textContent) {
            const style = Object.assign(document.createElement("style"), {
              textContent,
            });
            const ref = document.head.getElementsByTagName("style")[0] || null;
            document.head.insertBefore(style, ref);
          },
        };

        let m = await loadModule("/vue/test.vue", options);
        let app = createApp(m);
        app.use(ElementPlus);
        app.use(VxComponent);
        app.use(window.I18n);
        app.use(Quasar);
        app.mount(this.$refs.content);

        window.apps.push(app);

        return;
      }

      if (resp.headers["content-type"].includes("text/html")) {
        content = resp.data;
      } else {
        resp = resp.data;

        if (resp.status == 301 || resp.status == 302 || resp.status == 303) {
          //redirect
          this.$router.push(resp.location);
          return;
        }
      }

      window.$(this.$refs.content).html(content);
    },
  },
};
</script>
