<script setup>
import navItemVue from "./nav-item.vue";
import VxIcon from "./vx-icon.vue";

import ElementPlus from "element-plus";
import VxCustomizer from "./vx-customizer.vue";
import VxComponent from "./vx.js";
</script>
<template>
  <!-- BEGIN: Header-->
  <nav
    ref="navbar"
    class="
      header-navbar
      navbar navbar-expand-lg
      align-items-center
      floating-nav
      navbar-light navbar-shadow
    "
    :class="navbarColor"
  >
    <div class="navbar-container d-flex content">
      <div class="bookmark-wrapper d-flex align-items-center">
        <ul class="nav navbar-nav d-xl-none">
          <li class="nav-item">
            <a class="nav-link menu-toggle" href="#"
              ><vx-icon name="menu"></vx-icon
            ></a>
          </li>
        </ul>
        <ul class="nav navbar-nav">
          <li class="nav-item d-none d-lg-block">
            <el-tooltip content="My favorite">
              <a class="nav-link" @click.prevent="onFavorite">
                <vx-icon
                  v-if="isFavorite"
                  name="heart"
                  fill="red"
                  style="color: red !important"
                ></vx-icon>
                <vx-icon name="heart" fill="none" v-else></vx-icon>
              </a>
            </el-tooltip>
          </li>
        </ul>
      </div>
      <ul class="nav navbar-nav align-items-center ms-auto">
        <li class="nav-item dropdown dropdown-user">
          <a
            class="nav-link dropdown-toggle dropdown-user-link"
            id="dropdown-user"
            href="#"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div class="user-nav d-sm-flex d-none">
              <span class="user-name fw-bolder"
                >{{ me.first_name }} {{ me.last_name }}</span
              ><span class="user-status">{{ me.usergroup }}</span>
            </div>
            <span class="avatar"
              ><img
                class="round"
                :src="me.image"
                alt="avatar"
                height="40"
                width="40" /><span class="avatar-status-online"></span
            ></span>
          </a>
          <div
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdown-user"
          >
            <router-link class="dropdown-item" to="/User/profile"
              ><i class="mr-50" data-feather="user"></i>
              {{ $t("Profile") }}</router-link
            >
            <div class="dropdown-divider"></div>

            <router-link
              class="dropdown-item"
              v-for="(dd, index) in navbar.dropdown"
              :key="index"
              :to="dd.link"
            >
              <i class="mr-50" :class="dd.icon"></i>
              {{ dd.label }}</router-link
            >

            <router-link class="dropdown-item" to="/User/setting"
              ><vx-icon name="settings" class="mr-50"></vx-icon>
              {{ $t("Settings") }}</router-link
            >

            <a class="dropdown-item" href="/logout" @click.prevent="logout"
              ><vx-icon name="power" class="mr-50"></vx-icon
              >{{ $t("Logout") }}</a
            >
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <!-- END: Header-->

  <!-- BEGIN: Main Menu-->
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow"
    data-scroll-to-active="true"
    ref="mainMenu"
  >
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item me-auto">
          <a class="navbar-brand" :href="$vx.config['company-url']"
            ><span class="brand-logo" v-if="$vx.config['company-logo']">
              <el-image
                :src="$vx.config['company-logo']"
                style="height: 30px"
                fit="contain"
              ></el-image>
            </span>
            <h2 class="brand-text" v-else>{{ $vx.config.company }}</h2>
          </a>
        </li>
        <li class="nav-item nav-toggle">
          <a class="nav-link modern-nav-toggle pe-0" data-bs-toggle="collapse"
            ><i
              class="d-block d-xl-none text-primary toggle-icon font-medium-4"
              data-feather="x"
            ></i
            ><i
              class="
                d-none d-xl-block
                collapse-toggle-icon
                font-medium-4
                text-primary
              "
              data-feather="disc"
              data-ticon="disc"
            ></i
          ></a>
        </li>
      </ul>
    </div>
    <div class="shadow-bottom"></div>
    <div class="main-menu-content">
      <ul
        class="navigation navigation-main"
        id="main-menu-navigation"
        data-menu="menu-navigation"
      >
        <li class="navigation-header">
          <span>Main navigation</span>
        </li>

        <navItemVue
          class="nav-item"
          v-for="(m, index) in $vx.menus"
          :value="m"
          :key="index"
        ></navItemVue>
      </ul>
    </div>
  </div>
  <!-- END: Main Menu-->

  <!-- BEGIN: Content-->
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow" ref="navBarShadow"></div>
    <div class="content-wrapper" :class="contentWrapperClass()">
      <div class="content-header row">
        <div class="content-header-left col-md-9 col-12 mb-2">
          <div class="row breadcrumbs-top">
            <div class="col-12">
              <h2 class="content-header-title float-start mb-0">{{ title }}</h2>

              <div class="breadcrumb-wrapper">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link to="/">Home</router-link>
                  </li>
                  <li
                    class="breadcrumb-item"
                    v-for="(b, i) in breadcrumb"
                    :key="i"
                  >
                    <router-link :to="b.to">{{ b.label }}</router-link>
                  </li>
                  <li class="breadcrumb-item active">{{ title }}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content-body"
        ref="content"
        v-loading="loading"
        id="_vx_content"
      ></div>
    </div>
  </div>
  <!-- END: Content-->

  <div class="sidenav-overlay"></div>
  <div class="drag-target"></div>

  <!-- BEGIN: Footer-->
  <footer class="footer footer-static footer-light">
    <p class="clearfix mb-0">
      <span class="float-md-start d-block d-md-inline-block mt-25"
        >COPYRIGHT &copy; {{ config["copyright-year"]
        }}<a class="ms-25" :href="config['copyright-url']" target="_blank">{{
          config["copyright-name"]
        }}</a
        ><span class="d-none d-sm-inline-block"
          >, All rights Reserved</span
        ></span
      ><span class="float-md-end d-none d-md-block"></span>
    </p>
  </footer>
  <button class="btn btn-primary btn-icon scroll-top" type="button">
    <i data-feather="arrow-up"></i>
  </button>
  <!-- END: Footer-->

  <VxCustomizer />
</template>


<script>
import { parse, compileTemplate, compileScript } from "@vue/compiler-sfc";
import { ref, createApp, compile } from "vue";
import { loadModule } from "vue3-sfc-loader";
import * as Vue from "vue";
export default {
  name: "VxApp",
  provide() {
    return {
      layout: this,
    };
  },
  data() {
    return {
      menus: [],
      language: [],
      title: "",
      module_name: "",
      breadcrumb: [],
      me: {},
      config: {},
      navbarColor: "",
      width: "full",
      navbarType: "floating",
      footerType: "static",
      layoutName: "light-layout",
      menuCollapsed: false,
      selectedLanguage: null,
      navbar: null,
      favs: [],
      loading: false,
    };
  },
  created() {
    if (!this.$vx.logined) {
      this.$router.push("/");
      return;
    }

    this.favs = this.$vx.favs;
    this.menus = this.$vx.menus;
    this.language = this.$vx.language;
    this.me = this.$vx.me;
    this.config = this.$vx.config;

    if (this.me.style) {
      this.layoutName = this.me.style.layout || "semi-dark-layout";
      this.navbarColor = this.me.style.navbar_color || "";
      this.navbarType = this.me.style.navbar_type || "static";
      this.footerType = this.me.style.footer_type || "static";
      this.menuCollapsed = this.me.style.collapsible || false;
      console.log(this.me);
    }

    if (this.menuCollapsed) {
      document.body.classList.add("menu-collapsed");
    } else {
      document.body.classList.add("menu-expanded");
    }

    this.selectedLanguage = this.$vx.getSelectedLanguage();

    if (this.$route.path == "/" && this.me.default_page) {
      this.$router.push(this.me.default_page);
    }

    this.navbar = this.$vx.navbar ?? {};

    console.log("route path", this.$route.path);
    this.$vx.setRoute(this.$route);
  },
  async mounted() {
    if (window.feather) {
      window.feather.replace({
        width: 14,
        height: 14,
      });
    }

    setTimeout(() => {
      window.dispatchEvent(new Event("load"));
      window.$.app.nav.init();
    });

    this.loadNavbarType();

    await this.renderContent(this.$route.fullPath);
  },
  watch: {
    async $route(to) {
      this.$vx.setRoute(to);

      this.renderContent(to.fullPath);
      if (document.body.classList.contains("menu-open")) {
        window.$.app.menu.hide();
      }
    },
    navbarColor() {
      this.$vx.setNavbarColor(this.navbarColor);
    },
    menuCollapsed() {
      window.$(".modern-nav-toggle").trigger("click");
      window.$(".main-menu").trigger("mouseleave");

      this.$vx.setCollapsible(this.menuCollapsed);
    },
    layoutName() {
      let mainMenu = window.$(this.$refs.mainMenu);
      let navbar = window.$(this.$refs.navbar);
      let body = window.$(document.body);

      body
        .removeClass("dark-layout bordered-layout semi-dark-layout")
        .addClass(this.layoutName);

      if (this.layoutName == "light-layout") {
        mainMenu.removeClass("menu-dark").addClass("menu-light");
        navbar.removeClass("navbar-dark").addClass("navbar-light");
      }

      if (this.layoutName == "semi-dark-layout") {
        mainMenu.removeClass("menu-light").addClass("menu-dark");
        navbar.removeClass("navbar-dark").addClass("navbar-light");
      }

      if (this.layoutName == "bordered-layout") {
        body.addClass("bordered-layout");
        mainMenu.removeClass("menu-dark").addClass("menu-light");
        navbar.removeClass("navbar-dark").addClass("navbar-light");
      }

      if (this.layoutName == "dark-layout") {
        body.addClass("dark-layout");
        mainMenu.removeClass("menu-dark").addClass("menu-light");
        navbar.removeClass("navbar-dark").addClass("navbar-light");
      }

      this.$vx.setLayout(this.layoutName);
    },
    footerType() {
      let footer = window.$(this.$refs.footer);
      let body = window.$(document.body);

      // Hides footer
      if (this.footerType == "hidden") {
        footer.addClass("d-none");
        body
          .removeClass("footer-static footer-fixed")
          .addClass("footer-hidden");
      }

      // changes to Static footer
      if (this.footerType == "static") {
        body.removeClass("footer-fixed");
        footer.removeClass("d-none").addClass("footer-static");
        body
          .removeClass("footer-hidden footer-fixed")
          .addClass("footer-static");
      }

      // changes to Sticky footer
      if (this.footerType == "sticky") {
        body
          .removeClass("footer-static footer-hidden")
          .addClass("footer-fixed");
        footer.removeClass("d-none footer-static");
      }
    },
  },
  computed: {
    isFavorite() {
      let paths = this.favs.map((fav) => fav.link);
      return paths.indexOf(this.$route.fullPath) >= 0;
    },
  },
  methods: {
    async onFavorite() {
      if (this.isFavorite) {
        await this.$vx.removeMyFavorite(this.$route.fullPath);
      } else {
        try {
          let { value } = await this.$prompt("Please input label");
          await this.$vx.addMyFavorite(value, this.$route.fullPath);
        } catch (e) {}
      }

      //reload manu
      await this.$vx.reload();
      this.favs = this.$vx.favs;
    },
    toggleDark() {
      if (this.layoutName == "dark-layout") {
        this.layoutName = "light-layout";
      } else {
        this.layoutName = "dark-layout";
      }
    },
    async logout() {
      await this.$vx.logout();
      this.$emit("logout");
      this.$router.push("/");
    },
    async renderContent(path) {
      let content_el = this.$refs.content;
      while (content_el.firstChild) {
        content_el.removeChild(content_el.firstChild);
      }

      this.breadcrumb = [];
      this.title = "";
      this.loading = true;
      let resp;
      try {
        resp = await this.$vx.get(path, {
          headers: {
            Accept: "text/vue,text/html",
          },
        });
        this.loading = false;
      } catch (e) {
        window.$(this.$refs.content).html(e);
        this.loading = false;
        return;
      }

      let content = "";

      let paths = this.$route.path.split("/");

      this.title = paths[paths.length - 1];
      //      this.title = this.$i18n.t(this.title);

      if (paths.length > 2) {
        if (paths[paths.length - 1] == "view") {
          this.breadcrumb.push({
            to: "/" + paths[1],
            //label: this.$i18n.t(paths[1]),
            label: paths[1],
          });
        } else {
          if (paths.length == 4) {
            this.breadcrumb.push({
              to: "/" + paths[1] + "/" + paths[2] + "/view",
              //label: this.$i18n.t(paths[1]),
              label: paths[1],
            });
          } else {
            this.breadcrumb.push({
              to: "/" + paths[1],
              //label: this.$i18n.t(paths[1]),
              label: paths[1],
            });
          }
        }
      }

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
        app.mount(this.$refs.content);

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
    async changeLanguage(language) {
      await this.$vx.setSelectedLanguage(language);
      this.selectedLanguage = this.$vx.getSelectedLanguage();
      this.$router.go();
    },
    contentWrapperClass() {
      let c = [];
      if (this.width == "boxed") {
        c.push("container");
        c.push("p-0");
      }
      return c;
    },
    async setFooterType(type) {
      this.footerType = type;
      await this.$vx.setFooterType(this.footerType);
    },
    setNavbarType(type) {
      return;
      this.$vx.setNavbarType(type);
      this.navbarType = type;
      this.loadNavbarType();
    },
    loadNavbarType() {
      let navBarShadow = window.$(this.$refs.navBarShadow);
      let navbar = window.$(this.$refs.navbar);
      let body = window.$(document.body);
      if (this.navbarType == "floating") {
        navBarShadow.removeClass("d-none");
        navbar
          .removeClass("d-none navbar-static-top fixed-top")
          .addClass("floating-nav");
        body
          .removeClass("navbar-static navbar-hidden navbar-sticky")
          .addClass("navbar-floating");
      }

      if (this.navbarType == "static") {
        navBarShadow.addClass("d-none");
        navbar
          .removeClass("d-none floating-nav fixed-top")
          .addClass("navbar-static-top");
        body
          .removeClass("navbar-hidden navbar-floating navbar-sticky")
          .addClass("navbar-static");
      }

      if (this.navbarType == "sticky") {
        navBarShadow.addClass("d-none");

        navbar
          .removeClass("d-none floating-nav navbar-static-top")
          .addClass("fixed-top");

        body
          .removeClass("navbar-static navbar-floating navbar-hidden")
          .addClass("navbar-sticky");
      }

      if (this.navbarType == "hidden") {
        navbar.addClass("d-none");
        navBarShadow.addClass("d-none");
        body
          .removeClass("navbar-static navbar-floating navbar-sticky")
          .addClass("navbar-hidden");
      }
    },
  },
};
</script>