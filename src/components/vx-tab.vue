<template>
  <el-tab-pane :label="label" :name="name"></el-tab-pane>
</template>
<script>
export default {
  props: {
    label: String,
    link: String,
    active: Boolean,
    name: String,
  },
  methods: {
    onClick() {
      this.$parent.loadContent(this.link);
    },
  },
};
</script>