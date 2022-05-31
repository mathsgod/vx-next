<template>
  <div class="auth-wrapper auth-basic px-2">
    <div class="auth-inner py-2">
      <!-- Reset Password v1 -->
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

          <h6 class="mb-1">Reset Password 🔒</h6>
          <p class="mb-2">
            Your new password must be different from previously used passwords
          </p>

          <el-form ref="form1" :model="form" class="mt-2" label-position="top">
            <el-form-item label="New Password" prop="password" required>
              <el-input
                type="password"
                v-model="form.password"
                required
                show-password
              ></el-input>
            </el-form-item>

            <el-form-item
              label="Confirm Password"
              prop="confirm_password"
              required
            >
              <el-input
                type="password"
                v-model="form.confirm_password"
                required
                show-password
              ></el-input>
            </el-form-item>

            <el-button type="primary" class="w-100" @click="submit"
              >Set New Password</el-button
            >
          </el-form>

          <p class="text-center mt-2">
            <el-link @click="$router.push('/')">
              <q-icon name="arrow_back" /> Back to Login
            </el-link>
          </p>
        </q-card-section>
      </q-card>
      <!-- /Reset Password v1 -->
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
    submit() {
      this.$refs.form1.validate(async (valid) => {
        if (valid) {
          if (this.form.password != this.form.confirm_password) {
            this.$alert("Confirm password incorrect", { type: "error" });
            return;
          }

          let { data } = await this.$vx.resetPassword(
            this.form.password,
            this.$route.query.token
          );
          if (data.error) {
            this.$alert(data.error.message, { type: "error" });
            return;
          }
          await this.$alert("Password updated", { type: "success" });
          this.$router.push("/");
        }
      });
    },
  },
};
</script>
