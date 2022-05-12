<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-white vx-file-manager"
    container
    style="min-height: 700px"
  >
    <q-header bordered class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
        >
          <span class="q-ml-sm">File manager</span>
        </q-toolbar-title>

        <q-space />

        <q-input
          class="GNL__toolbar-input"
          outlined
          dense
          v-model="search"
          color="bg-grey-7 shadow-1"
          placeholder="Search for file name"
        >
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>

        <q-space />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="257"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-expansion-item
            label="Storage"
            default-opened
            icon="web"
            class="GNL__drawer-item"
            selectable
          >
            <q-tree
              class="q-pl-lg"
              :nodes="folders"
              node-key="path"
              label-key="name"
              @lazy-load="onLazyLoad"
              v-model:selected="selectedFolder"
            >
            </q-tree>
          </q-expansion-item>

          <q-separator inset class="q-my-sm" />

          <q-item class="GNL__drawer-item">
            <q-item-section>
              <q-item-label>Labels</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="GNL__drawer">
            <q-item-section avatar>
              <q-icon name="label" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Document </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer side="right" show-if-above bordered> </q-drawer>

    <q-page-container style="height: 700px">
      <q-toolbar>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Storage"></q-breadcrumbs-el>
          <q-breadcrumbs-el label="Test"></q-breadcrumbs-el>
        </q-breadcrumbs>
        <q-space></q-space>
        <q-btn flat round icon="web" @click="grid = !grid"></q-btn>
      </q-toolbar>

      <template v-if="grid">
        <q-table
          title="Folders"
          flat
          bordered
          grid
          :columns="columns"
          :row="fileFolders"
        >
        </q-table>
        <q-table
          title="Files"
          flat
          bordered
          grid
          :columns="columns"
          :rows="files"
          :pagination="pagination"
        >
          <template v-slot:item="props"
            ><div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card class="my-card">
                <template v-if="canPreviewImage(props.row)">
                  <el-image
                    :src="`${endpoint}photo/0/${props.row.path}?w=200`"
                    lazy
                  ></el-image>
                </template>

                <q-card-section>
                  <div class="text-subtitle2">{{ props.row.name }}</div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </template>
      <template v-else>
        <q-table flat bordered :columns="columns" :rows="folderAndFiles">
          <template #body-cell-icon="props">
            <q-td>
              <q-icon name="folder" v-if="props.value == 'folder'" />
              <q-icon name="description" v-else />
            </q-td>
          </template>
        </q-table>
      </template>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { fasEarthAmericas, fasFlask } from "@quasar/extras/fontawesome-v6";

export default {
  setup() {
    const pagination = {
      rowsPerPage: 0,
      "rows-per-page-options": [0],
    };

    const columns = ref([
      {
        name: "icon",
        label: "",
        field: "type",
      },
      {
        name: "name",
        label: "Name",
        field: "name",
        sortable: true,
        align: "left",
      },
      {
        name: "last_modified",
        label: "Last Modified",
        field: "last_modified_human",
        align: "left",
      },
      {
        name: "size_display",
        label: "Size",
        field: "size_display",
        align: "left",
      },
    ]);

    const leftDrawerOpen = ref(false);
    const search = ref("");
    const showAdvanced = ref(false);
    const showDateOptions = ref(false);
    const exactPhrase = ref("");
    const hasWords = ref("");
    const excludeWords = ref("");
    const byWebsite = ref("");
    const byDate = ref("Any time");

    function onClear() {
      exactPhrase.value = "";
      hasWords.value = "";
      excludeWords.value = "";
      byWebsite.value = "";
      byDate.value = "Any time";
    }

    function changeDate(option) {
      byDate.value = option;
      showDateOptions.value = false;
    }

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      pagination,
      columns,
      leftDrawerOpen,
      search,
      showAdvanced,
      showDateOptions,
      exactPhrase,
      hasWords,
      excludeWords,
      byWebsite,
      byDate,

      onClear,
      changeDate,
      toggleLeftDrawer,
    };
  },
  data() {
    return {
      endpoint: vx.endpoint,
      showSelectFolder: false,
      showSidebar: false,
      parentPath: "",
      selectedPath: this.base,
      selectedNode: null,
      files: [],
      folders: [],
      mode: "list",
      selectedFolder: null,
      selectedFile: [],
      file_uploader: false,
      action: "",
      uploadHeaders: null,
      type: null,
      search_text: "",
      nextSelectedFiles: [],
      file_upload_max_size: "",
      grid: false,
      fileFolders: [],
    };
  },
  created() {
    this.reloadContent();
  },
  computed: {
    folderAndFiles() {
      return this.fileFolders.concat(this.files);
    },
  },
  watch: {
    async selectedFolder(val) {
      let { data } = await vx.get("/FileManager/listContents", {
        params: {
          path: val,
        },
      });
      this.files = data.files.map((file) => {
        file.type = "file";
        return file;
      });

      this.fileFolders = data.folders.map((folder) => {
        folder.type = "folder";
        return folder;
      });
    },
  },
  methods: {
    canPreviewImage(file) {
      if (file.mime_type == "image/jpeg") return true;
      if (file.mime_type == "image/png") return true;
      if (file.mime_type == "image/gif") return true;
      return false;
    },

    onSelectFolder(target) {
      console.log(target);
    },
    async onLazyLoad({ node, key, done, fail }) {
      let { data } = await vx.get("/FileManager/listDirectory", {
        params: {
          path: node.path,
        },
      });

      data.map((item) => {
        item.lazy = true;
        return item;
      });
      done(data);
    },

    async reloadContent() {
      this.file_uploader = false;
      this.selectedFolder = [];
      this.selectedFile = [];

      if (this.type) {
        if (this.type == "recent") {
          let { data } = await vx.get("/FileManager/listRecentFiles", {
            params: {
              file_type: this.fileType,
            },
          });
          this.files = data;
          this.folders = [];

          return;
        }

        {
          let { data } = await vx.get("/FileManager/listFiles", {
            params: {
              path: this.base,
              type: this.type,
            },
          });
          if (data.error) {
            this.$message.error(data.error.message);
            return;
          }
          this.files = data;
          this.folders = [];
        }

        return;
      }
      this.files = [];
      this.folders = [];

      let { data } = await vx.get("/FileManager/listContents", {
        params: {
          path: this.selectedPath,
          file_type: this.fileType,
          search: this.search_text,
        },
      });

      this.parentPath = data.parent;
      this.files = data.files;

      console.log(this.files);

      for (let f of this.files) {
        console.log(f.path);
        f.selected = this.nextSelectedFiles.includes(f.path);

        if (f.selected) {
          this.selectedFile.push(f.path);
        }
      }

      //this.nextSelectedFiles = [];

      this.folders = data.folders.map((f) => {
        f.lazy = true;
        return f;
      });
    },
  },
};
</script>

<style >
.vx-file-manager .q-tree__node--selected {
  border-radius: 0 24px 24px 0;
  background-color: #e8f0fe;
}
</style>

<style lang="sass">
.GNL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>