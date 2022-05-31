<script setup>
import { ref } from "vue";
</script>
<template>
  <div class="auth-wrapper auth-basic px-2">
    <div class="auth-inner my-2">
      <!-- two steps verification basic-->
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
          <h6 class="mb-1">Two Step Verification 💬</h6>
          <p class="mb-1">
            Please use authentication code to sign-in to your account
          </p>

          <el-form :data="form">
            <div class="mb-1">Type your 6 digit security code</div>
            <el-form-item
              class="
                auth-input-wrapper
                d-flex
                align-items-center
                justify-content-between
              "
              prop="code"
              required
            >
              <el-input
                type="text"
                class="
                  form-control
                  height-50
                  text-center
                  numeral-mask
                  mx-25
                  mb-1
                "
                maxlength="6"
                autofocus=""
                v-model="form.code"
              />
            </el-form-item>
            <el-button type="primary" class="w-100" @click="signIn"
              >Sign in</el-button
            >
          </el-form>
        </q-card-section>
      </q-card>

      <!-- /two steps verification basic -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        code: null,
      },
    };
  },
  methods: {
    signIn() {
      
        this.$vx.login()

    },
  },
};
</script>
