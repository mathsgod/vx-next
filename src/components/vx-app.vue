<script setup>
import { Quasar, Dark, LoadingBar, useQuasar, Dialog, Notify } from "quasar";
import VxCustomizer from "./vx-customizer.vue";
import VxMenu from "./vx-menu.vue";
import VxComponent from "./vx.js";
import { ref } from "vue";
import { setLanguage, getCurrentLanguage } from "./../vx.js";
import { vx } from "./../vx.js";

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

if (vx.logined && route.path == "/") {
  router.push(vx.me.default_page);
}

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

        <q-btn flat dense :label="currentLanguage">
          <q-menu>
            <q-list>
              <q-item
                clickable
                v-close-popup
                v-for="language in languages"
                :key="language.value"
                @click="onChangeLanguage(language.value)"
              >
                <q-item-section>
                  <q-item-label>{{ language.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

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
          <q-space></q-space>
          <q-btn icon="refresh" dense flat ripple @click="reloadContent" />
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
import { vx } from "./../vx.js";
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
      currentLanguage: "",
      languages: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!vx.logined) {
      next("/");
      return false;
    }
    next();
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
  created() {
    this.currentLanguage = getCurrentLanguage();
    this.languages = this.$vx.getLanguages();
    //    console.log(this.languages);
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
            label: this.$i18n.t(paths[1]),
            //label: paths[1],
          });
        } else {
          if (paths.length == 4) {
            breadcrumbs.push({
              to: "/" + paths[1] + "/" + paths[2] + "/view",
              label: this.$i18n.t(paths[1]),
              //label: paths[1],
            });
          } else {
            breadcrumbs.push({
              to: "/" + paths[1],
              label: this.$i18n.t(paths[1]),
              //label: paths[1],
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
    reloadContent() {
      this.loadURL(this.$route.fullPath);
    },
    async onChangeLanguage(value) {
      await setLanguage(value);
      window.self.location.reload();
    },
    async logout() {
      await this.$vx.logout();
      this.$emit("logout");
      this.$router.push("/");
    },

    async loadURL(path) {
      console.log("loadURL", path);
      vx.$route = this.$route;
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
      let { status, headers, data } = await this.$vx.get(path, {
        headers: {
          Accept: "text/vue,text/html",
        },
      });
      this.loading = false;

      if (status == 403) {
        this.$router.push("/");
        return;
      }

      if (status >= 500) {
        if (headers["content-type"].includes("text/html")) {
          content_el.innerHTML = data;
        } else if (headers["content-type"].includes("application/json")) {
          if (data.error) {



          }
        }

        return;
      }

      let content = "";
      //chech content type is vue
      if (headers["content-type"].includes("text/vue")) {
        content = data;

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

        let m = await loadModule("/vue.vue", options);
        let app = createApp(m);
        app.use(VxComponent);
        app.use(window.I18n);
        app.mount(this.$refs.content);
        window.apps.push(app);

        return;
      }

      if (headers["content-type"].includes("text/html")) {
        content = data;
      } else {
        if (status == 301 || status == 302 || status == 303) {
          //redirect
          //this.$router.push(resp.location);
          return;
        }
      }

      window.$(this.$refs.content).html(content);
    },
  },
};
</script>
