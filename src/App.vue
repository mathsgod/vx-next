<template>
  <router-view v-if="ready"></router-view>
  <div v-else>loading...</div>
</template>

<script>
import { init } from "./vx.js";

export default {
  data() {
    return {
      ready: false,
    };
  },
  async mounted() {
    await init();
    this.ready = true;
  },
};
</script>