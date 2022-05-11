<template>
  <q-expansion-item
    v-if="value.submenu"
    :label="value.label"
    :icon="icon"
    :default-opened="isOpen()"
  >
    <q-list class="q-pl-lg">
      <VxMenu
        ref="menu"
        v-for="(m, index) in value.submenu"
        :value="m"
        :key="index"
      ></VxMenu>
    </q-list>
  </q-expansion-item>
  <q-list v-else class="menu-list">
    <q-item :to="value.link">
      <q-item-section avatar>
        <q-icon :name="icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label v-text="value.label"></q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped>
.menu-list .q-item {
  border-radius: 0 32px 32px 0;
}
.menu-list .q-router-link--exact-active {
  background-color: var(--q-primary);
  color: #fff;
}
</style>

<script>
export default {
  props: {
    value: Object,
  },
  computed: {
    icon() {
      return this.value.icon ?? "fa fa-link";
    },
  },
  methods: {
    isOpen() {
      if (!this.value.submenu) return false;

      //get module path
      let p = this.$route.path.split("/");
      if (p.length >= 2) {
        let module = p[1];
        if (this.value.name == module) {
          return true;
        }
      }

      if (
        this.$route.path.substr(0, this.value.link.length) == this.value.link
      ) {
        return true;
      }

      return false;
    },
  },
};
</script>