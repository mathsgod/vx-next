<script setup>
import VxFileManager from "./vx-file-manager.vue";
</script>
<template>
  <el-input @click="focusInput" v-model="localData" clearable></el-input>

  <q-dialog v-model="dialogVisible" full-width>
    <VxFileManager
      @input="fileSelected($event)"
      default-action="select"
      :base="base"
      :multiple="multiple"
      show-close-button
      @close="close()"
    />
  </q-dialog>
</template>
<script>
export default {
  props: {
    value: String,
    base: String,
    multiple: Boolean,
  },
  data() {
    return {
      localData: this.value,
      dialogVisible: false,
    };
  },
  watch: {
    localData() {
      this.$emit("input", this.localData);
    },
  },
  methods: {
    close() {
      this.dialogVisible = false;
    },
    focusInput() {
      this.dialogVisible = true;
    },
    fileSelected(path) {
      this.$emit("input", path);
      this.dialogVisible = false;
      this.localData = path;
    },
  },
};
</script>
