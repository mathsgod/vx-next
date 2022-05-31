<script setup>
import AuthResetPasswordBasic from "./auth-reset-password-basic.vue";
import AuthResetPasswordCover from "./auth-reset-password-cover.vue";
</script>

<template>
  <div>
    <AuthResetPasswordBasic v-if="version == 'v1'" />
    <AuthResetPasswordCover v-if="version == 'v2'" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      version: "v1",
    };
  },
  created() {
    //this.version = this.$vx.config.login.version;
    this.version = "v2";
  },
};
</script>
