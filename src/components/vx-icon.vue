<script>
import { h } from "vue";
import feather from "feather-icons";
export default {
  props: {
    name: String,
  },
  render() {
    let icon = feather.icons[this.name];

    let attrs = { ...icon.attrs, ...this.$attrs };

    attrs.innerHTML = icon.contents;
    return h("svg", attrs);
  },
};
</script>
