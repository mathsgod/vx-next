<template>
  <div>
    <q-list bordered separator>
      <q-item
        clickable
        v-for="(m, index) in modules"
        :key="index"
        @click="selectedModule = m"
      >
        <q-item-section>{{ m.name }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modules: [
        {
          name: "Test1",
        },
        {
          name: "Test1",
        },
        {
          name: "Test1",
        },
        {
          name: "Test1",
        },
      ],
      selectedModule: null,
    };
  },
  watch: {
    selectedModule() {
      console.log(this.selectedModule);
    },
  },
  async created() {
    let { data } = await vx.get("/System/Module/builder");
    this.modules = data.modules;
  },
};
</script>
