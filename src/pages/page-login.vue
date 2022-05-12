<script setup>
import AuthLoginBasic from "./auth-login-basic.vue";
import PageLoginV2 from "./page-login-v2.vue";
//import "../scss/bootstrap.scss";
</script>
<template>
  <div>
    <AuthLoginBasic v-if="version == 'v1'"></AuthLoginBasic>
    <page-login-v2 v-if="version == 'v2'"></page-login-v2>
  </div>
</template>


<script>
export default {
  data() {
    return {
      version: "v1",
    };
  },
  beforeCreate() {
    if (this.$vx.logined) {
      this.$router.push("/Dashboard");
      return;
    }
  },
  created() {
    this.version = this.$vx.config.login.version;
    this.logined = this.$vx.logined;
  },
};
</script>
