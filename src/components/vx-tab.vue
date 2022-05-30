<template>
  <q-tab :label="label" :name="name"></q-tab>
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