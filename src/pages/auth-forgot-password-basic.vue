<template>
  <div class="auth-wrapper auth-basic px-2">
    <div class="auth-inner py-2">
      <!-- Forgot Password v1 -->
      <q-card>
        <q-card-section>
          <a
            :href="$vx.config['company-url']"
            class="brand-logo"
            target="_blank"
          >
            <el-image
              v-if="$vx.config['company-logo']"
              :src="$vx.config['company-logo']"
              style="height: 40px"
              fit="contain"
            ></el-image>
            <h2 v-else class="brand-text text-primary ml-1">{{ company }}</h2>
          </a>

          <h6 class="mb-1">Forgot Password? 🔒</h6>
          <p class="mb-2">
            Enter your username and email and we'll send you instructions to
            reset your password
          </p>

          <el-form ref="form1" :model="form" label-position="top">
            <el-form-item label="Username" required prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item
              label="Email"
              required
              prop="email"
              :rules="[{ type: 'email' }]"
            >
              <el-input
                v-model="form.email"
                type="email"
                placeholder="john@example.com"
              ></el-input>
            </el-form-item>

            <el-button type="primary" @click="submit"
              >Send reset link
            </el-button>
          </el-form>

          <p class="text-center mt-2">
            <el-link @click="$router.push('/')">
              <q-icon name="arrow_back"></q-icon> Back to login
            </el-link>
          </p>
        </q-card-section>
      </q-card>

      <!-- /Forgot Password v1 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      company: null,
      form: {},
    };
  },
  created() {
    this.company = this.$vx.config.company;
  },
  methods: {
    async submit() {
      this.$refs.form1.validate(async (valid) => {
        if (valid) {
          let resp = await this.$vx.forgotPassword(
            this.form.username,
            this.form.email
          );

          if (resp.status == 200) {
            await this.$alert(
              "A instrucation are sent your email if your username and email are correct.",
              { type: "success" }
            );

            this.$router.push("/");
          } else {
            this.$alert("server error", { type: "error" });
          }

          this.form = {};
        }
      });
    },
  },
};
</script>
