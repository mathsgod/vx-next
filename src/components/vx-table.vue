<script setup>
import { RefreshRight, Search } from "@element-plus/icons-vue";
</script>
<template>
  <q-card :body-style="{ padding: '1rem' }" :header="header" flat bordered>
    <q-card-section>
      <el-collapse v-if="searchable">
        <el-collapse-item name="search">
          <template v-slot:title>
            <el-icon> <search /> </el-icon>
            &nbsp;&nbsp;{{ $t("Search") }}
          </template>

          <slot
            name="search"
            v-bind:search="search"
            v-bind:on-search="onSearch"
            :size="size"
          ></slot>

          <div class="ml-2 mr-2">
            <el-button
              @click="onSearch"
              :size="size"
              type="primary"
              v-t="'Search'"
            ></el-button>
            <el-button
              @click="resetSearch"
              :size="size"
              v-t="$t('Reset')"
            ></el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-if="pagination" class="row q-py-md">
        <div>
          Show
          <el-tooltip :content="$t('vx-per-page')" placement="top">
            <el-select v-model="localPerPage" style="width: 70px" :size="size">
              <el-option
                v-for="(p, index) in pageLengthOption"
                :value="p"
                v-text="p"
                :key="index"
              ></el-option>
            </el-select>
          </el-tooltip>
          entries
        </div>
        <q-space />

        <div>
          <el-tooltip :content="$t('Reload')" placement="top">
            <el-button
              @click="reload"
              :icon="RefreshRight"
              :size="size"
            ></el-button>
          </el-tooltip>
        </div>
      </div>
    </q-card-section>


    <el-table
      :size="size"
      :data="data"
      :default-sort="defaultSort"
      @sort-change="sortChanged"
      v-loading="loading"
      @filter-change="filterChanged"
      :border="border"
    >
      <slot
        v-bind:delete="onDelete"
        v-bind:reload="reload"
        :search="search"
      ></slot>
    </el-table>

    <q-card-section>
      <template v-if="pagination">
        <div class="row q-py-md">
          <div>
            {{ $t("vx-table-message", [info.from, info.to, info.total]) }}
          </div>
          <q-space />
          <div>
            <el-pagination
              hide-on-single-page
              background
              layout="prev, pager, next"
              :page-count="total"
              @current-change="onCurrentChange"
            />
          </div>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  props: {
    header: String,
    remote: String,
    metadata: String,
    per_page: {
      type: Number,
      default: 10,
    },
    pageLengthOption: {
      type: Array,
      default() {
        return [10, 25, 50, 100];
      },
    },
    searchable: Boolean,
    pagination: {
      type: Boolean,
      default: true,
    },
    size: String,
    defaultSort: Object,
    border: Boolean,
  },
  data() {
    return {
      localPerPage: this.per_page,
      page: 1,
      data: [],
      total: 0,
      sort: null,
      search: {},
      loading: false,
      filters: {},
      total_entries: 0,
    };
  },
  computed: {
    info() {
      return {
        from: (this.page - 1) * this.localPerPage + 1,
        to: Math.min(this.page * this.localPerPage, this.total_entries),
        total: this.total_entries,
      };
    },
  },
  created() {
    if (this.defaultSort) {
      this.sort = this.defaultSort.prop + "|" + this.defaultSort.order;
    }

    //by using this remote link to get local data
    let d = this.getLocalData();
    if (d.per_page) {
      this.localPerPage = d.per_page;
    }

    this.reload();
  },
  watch: {
    localPerPage() {
      let d = this.getLocalData();
      d.per_page = this.localPerPage;
      this.setLocalData(d);

      this.reload();
    },
    page() {
      console.log(this.page);
      this.reload();
    },
  },
  methods: {
    onCurrentChange(page) {
      this.page = page;
    },
    setLocalData(data) {
      localStorage.setItem(this.remote, JSON.stringify(data));
    },
    getLocalData() {
      if (!localStorage.getItem(this.remote)) return {};
      let a = localStorage.getItem(this.remote);
      return JSON.parse(a);
    },
    resetSearch() {
      this.search = {};
      this.onSearch();
    },
    filterChanged(filters) {
      let f = {};
      for (let c in filters) {
        if (filters[c].length > 0) {
          f[c] = filters[c];
        }
      }
      this.filters = f;
      this.reload();
    },
    onDelete(uri) {
      this.$confirm("Are you sure?", { type: "warning" }).then(async () => {
        let resp = await this.$vx.delete(uri);
        if (resp.status == 204) {
          this.$message.success("Deleted");
          this.reload();
        } else {
          this.$alert(resp.statusText);
        }
      });
    },
    onSearch() {
      this.page = 1;
      this.reload();
    },
    sortChanged({ column, prop, order }) {
      console.log(column);
      if (!order) {
        this.sort = null;
      } else {
        this.sort = prop + "|" + order;
      }
      this.reload();
    },
    async reload() {
      this.loading = true;

      let { data, status } = await this.$vx.get(this.remote, {
        params: {
          metadata: this.metadata,
          page: this.page,
          per_page: this.pagination ? this.localPerPage : null,
          sort: this.sort,
          search: this.search,
          filter: this.filters,
        },
      });

      this.loading = false;

      if (status == 401) {
        this.$router.push("/");
        return;
      }

      if (status != 200) {
        this.$alert(data.error.message, { type: "error" });
        return;
      }

      this.total = Math.ceil(data.total / this.localPerPage);
      this.total_entries = data.total;
      this.data = data.data;
    },
  },
};
</script>
