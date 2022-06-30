<template>
  <div id="app">
      <Header v-if="shouldShowSidebar && $route.path !== '/'" />
    <div class="d-flex">
      <div v-if="shouldShowSidebar && !isMobile">
        <Sidebar collapsed="collapsed" />
      </div>
      <div
        v-bind:class="
          shouldShowSidebar && !isMobile ? 'shift-div w-100' : 'w-100'
        "
      >
        <router-view></router-view>
      </div>
      <!-- <div v-if="shouldShowSidebar && !isMobile"><Sidebar collapsed="collapsed"/></div> -->
      <!-- <div v-bind:class="shouldShowSidebar && !isMobile ? 'shift-div' : '' " >
    <router-view></router-view>
    </div> -->
      <div v-if="isMobile && shouldShowSidebar"><Menu /></div>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/css/style.css";
import "@fortawesome/fontawesome-free/css/all.css";
// import "@fortawesome/fontawesome-free/js/all.js";
import { isMobile } from "mobile-device-detect";
import Sidebar from "../src/components/Sidebar/sidebar.vue";
import Menu from "../src/components/Menu/menu.vue";
import Header from "../src/components/Header/header.vue";

export default {
  name: "App",
  created() {
    document.title = "ChorusX Social";
  },

  components: {
    Sidebar,
    Menu,
    Header,
  },
  data() {
    return {
      settings: false,
      authenticated: false,
      mockAccount: {
        username: "socialgps",
        password: "socialgps123",
      },
      isMobile,
    };
  },
  computed: {
    shouldShowSidebar() {
      return this.$route.meta.sidebar !== false;
    },
  },
};
</script>
