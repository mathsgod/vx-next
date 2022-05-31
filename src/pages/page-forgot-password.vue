<script setup>
import AuthForgotPasswordBasic from "./auth-forgot-password-basic.vue";
import AuthForgotPasswordCover from "./auth-forgot-password-cover.vue";
</script>
<template>
  <div>
    <AuthForgotPasswordBasic v-if="version == 'v1'"></AuthForgotPasswordBasic>
    <AuthForgotPasswordCover v-if="version == 'v2'"></AuthForgotPasswordCover>
  </div>
</template>

<script>
import "../assets/css/pages/authentication.css";

export default {
  data() {
    return {
      version: "v2",
    };
  },
  created() {
    //this.version = this.$vx.config.login.version;

    this.logined = this.$vx.logined;
  },
};
</script>
