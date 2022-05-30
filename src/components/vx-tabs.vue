<script>
import { h, withDirectives } from "vue";
import { QTabs, QTab } from "quasar";

export default {
  data() {
    return {
      modelValue: null,
      loading: false,
    };
  },
  render() {
    let l = this.$slots.default().map((item) => {
      return h(QTab, item.props);
    });

    return [
      h(
        QTabs,
        {
          modelValue: this.modelValue,
          narrowIndicator: true,
          indicatorColor: "primary",
          align: "left",
          "onUpdate:modelValue": (value) => {
            this.modelValue = value;
            let tab = l.find((item) => {
              return item.props.name === value;
            });

            this.loadContent(tab.props.link);
          },
        },
        l
      ),

      h("div", {
        ref: "content",
      }),
    ];
  },

  async mounted() {
    //find first
    let first = this.$slots.default()[0];

    if (first) {
      this.loadContent(first.props.link);
      this.modelValue = first.props.name;
    }
  },
  methods: {
    async loadContent(url) {
      window.$(this.$refs.content).empty();
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

        window.$(this.$refs.content).html(data);
      } catch (e) {
        this.loading = false;
        this.$alert(e, { type: "error" });
        return;
      }
    },
  },
};
</script>