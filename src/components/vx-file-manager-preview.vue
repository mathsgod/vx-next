<template>
  <template v-if="canPreviewImage">
    <q-img src="https://via.placeholder.com/300"></q-img>
  </template>

  <q-list>
    <q-item>
      <q-item-section>
        <q-item-label>Name</q-item-label>
      </q-item-section>
      <q-item-section side="right">{{ value.name }} </q-item-section>
    </q-item>
    <q-item>
      <q-item-section> <q-item-label>Size</q-item-label> </q-item-section>
      <q-item-section side="right">{{ value.size }} </q-item-section>
    </q-item>
    <q-item>
      <q-item-section> <q-item-label>Location</q-item-label> </q-item-section>
      <q-item-section side="right">{{ value.path }} </q-item-section>
    </q-item>
  </q-list>
</template>

<script >
export default {
  props: {
    value: Object,
  },
  computed: {
    canPreviewImage() {
      if (this.value.type == "folder") return false;

      if (this.value.mime_type == "image/jpeg") return true;
      if (this.value.mime_type == "image/png") return true;
      if (this.value.mime_type == "image/gif") return true;

      return false;
    },
  },
};
</script>