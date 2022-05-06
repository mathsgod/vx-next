<script>
import { getCurrentInstance, h, nextTick } from "vue";
import { ElTabs, ElTabPane } from "element-plus";
export default {
  render() {
    let l = this.$slots.default().map((item) => {
      return h(ElTabPane, { ...item.props, ...{ ref: "tabPane" } });
    });

    return h(
      ElTabs,
      {
        onTabClick: this.onTabClick,
      },
      l
    );
  },
  async mounted() {
    //find first
    let first = this.$slots.default()[0];

    if (first) {
      this.loadContent(
        first.props.link,
        this.$el.querySelector(".el-tabs__content div")
      );
    }
  },
  methods: {
    async onTabClick(pane, ev) {
      window.$(pane.instance.vnode.el).empty();
      await this.loadContent(pane.instance.attrs.link, pane.instance.vnode.el);
    },
    async loadContent(url, el) {
      let link;
      if (url[0] != "/") {
        link = this.$route.path + "/" + url;
      } else {
        link = url;
      }
      console.log("load link", link);
      this.loading = true;

      try {
        let { data } = await this.$vx.get(link);
        this.loading = false;

        if (data.error) {
          this.$message.error(data.error.message);

          return;
        }

        window.$(el).html(data);
      } catch (e) {
        this.loading = false;
        this.$alert(e, { type: "error" });
        return;
      }
    },
  },
};
</script>