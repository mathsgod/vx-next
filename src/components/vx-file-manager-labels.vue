<template>
  <q-list>
    <q-item-label header>Labels</q-item-label>
    <q-item clickable @click="toggleLabel('document')">
      <q-item-section avatar>
        <q-icon name="schedule" />
      </q-item-section>
      <q-item-section> Documents </q-item-section>
    </q-item>
    <q-item clickable @click="toggleLabel('image')">
      <q-item-section avatar>
        <q-icon name="schedule" />
      </q-item-section>
      <q-item-section> Image </q-item-section>
    </q-item>
    <q-item clickable @click="toggleLabel('video')">
      <q-item-section avatar>
        <q-icon name="schedule" />
      </q-item-section>
      <q-item-section> Video </q-item-section>
    </q-item>
    <q-item clickable @click="toggleLabel('audio')">
      <q-item-section avatar>
        <q-icon name="schedule" />
      </q-item-section>
      <q-item-section> Audio </q-item-section>
    </q-item>
    <q-item clickable @click="toggleLabel('archive')">
      <q-item-section avatar>
        <q-icon name="schedule" />
      </q-item-section>
      <q-item-section> Archives </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
export default {
  props: {
    fileType: String,
    value: String,
  },
  methods: {
    toggleLabel(type) {
      if (this.value == type) {
        this.$emit("input", null);
      } else {
        this.$emit("input", type);
      }
    },
  },
};
</script>
