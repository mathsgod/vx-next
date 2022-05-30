<script setup>
import { Check } from "@element-plus/icons-vue";
</script>
<template>
  <el-card v-loading="loading">
    <el-form
      label-width="auto"
      @submit.prevent
      :model="form"
      ref="form1"
      class="vx-form row"
      :size="size"
    >
      <slot v-bind:form="form"></slot>
    </el-form>
    <el-button @click="onSubmit()" :icon="Check" type="primary"
      >Submit</el-button
    >
    <el-button @click="onBack">Back</el-button>
  </el-card>
</template>
<script>
export default {
  props: {
    action: String,
    size: String,
    successUrl: String,
    restJWT: String,

    method: {
      type: String,
      default: "post",
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: this.data,
      loading: false,
    };
  },

  methods: {
    onSubmit() {
      this.$refs.form1.validate(async (valid) => {
        if (valid) {
          let action = this.$route.path;
          if (this.action) {
            action = this.action;
          }

          let resp;
          this.loading = true;

          if (this.$el.querySelectorAll("input.el-upload__input").length > 0) {
            let formData = new FormData();

            this.$el
              .querySelectorAll("input.el-upload__input")
              .forEach((input) => {
                if (input.multiple) {
                  input.files.forEach((file) => {
                    formData.append(input.name + "[]", file);
                  });
                } else {
                  input.files.forEach((file) => {
                    formData.append(input.name, file);
                  });
                }
              });

            formData.append(
              "vx",
              new Blob([JSON.stringify(this.form)], {
                type: "application/json",
              })
            );

            resp = await this.$vx.post(action, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                "rest-jwt": this.restJWT,
              },
            });
          } else {
            if (this.method == "post") {
              resp = await this.$vx.post(action, this.form);
            } else if (this.method == "patch") {
              resp = await this.$vx.patch(action, this.form);
            }
          }

          this.loading = false;
          let data = resp.data;

          if (resp.status >= 200 && resp.status < 300) {
            if (resp.status == 204) {
              this.$message.success("Updated");
            }

            if (resp.status == 201) {
              this.$message.success("Created");
            }

            if (this.successUrl) {
              let url = this.successUrl;
              url = url.replace(
                ":content-location",
                resp.headers["content-location"]
              );
              this.$router.push(url);
              return;
            }

            if (resp.status != 200) {
              if (this.$router.referer.fullPath) {
                this.$router.push(this.$router.referer.fullPath);
              }
            }

            return;
          }

          if (resp.status.toString()[0] == "4") {
            if (resp.status == 401) {
              this.$router.push("/");
              return;
            }

            if (data.error) {
              this.$message.error(data.error.message);
            }
            return;
          }

          if (data.error) {
            this.$message.error(data.error.message);
          }
        }
      });
    },
    onBack() {
      window.history.go(-1);
    },
  },
};
</script>
