<template>
  <div class="main-content login-screen">
    <div class="container">
      <div class="register-form">
        <h3 class="whitetext">Reset Your Password</h3>
        <form>
          <div class="mb-3">
            <input
              placeholder="Password"
              class="form-control box-line"
              type="password"
              v-model="password"
            />
          </div>
          <div class="mb-3">
            <input
              placeholder="Confirm Password"
              class="form-control box-line"
              type="password"
              v-model="confirmPassword"
            />
          </div>
          <div class="mb-3">
            <input
              value="Submit"
              @click="sendPasswordMail(password, confirmPassword)"
              class="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../../Header/header.vue";
import { getConfirmPassword } from "../../../services/UserService";
export default {
  name: "ResetPassword",
  components: {
    Header,
  },
  data() {
    return {
      msg: "SocialGPS",
      password: "",
      confirmPassword: "",
      email: "",
    };
  },
  methods: {
    sendPasswordMail(password, confirmPassword) {
      let data = {
        password: password,
        passwordConf: confirmPassword,
        email: this.email,
      };
      getConfirmPassword(data)
        .then((response) => {
          console.log("confirmPassword", response);
          this.$toast.success(response.data.message, {
            timeout: 2000,
          });
          setTimeout(() => this.$router.push("/login"), 3000);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
  },
  mounted() {
    this.email = this.$router.history.current.params.email;
    console.log("confirmationCode", this.email);
  },
};
</script>

<style scoped></style>
