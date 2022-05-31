<script setup>
import AuthLoginBasic from "./auth-login-basic.vue";
import AuthLoginCover from "./auth-login-cover.vue";
</script>
<template>
  <div>
    <AuthLoginBasic v-if="version == 'v1'"></AuthLoginBasic>
    <AuthLoginCover v-if="version == 'v2'"></AuthLoginCover>
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
