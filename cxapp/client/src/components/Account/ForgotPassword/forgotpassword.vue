<template>
  <div class="main-content login-screen">
    <div class="container">
      <div class="register-form">
        <h3 class="whitetext">Reset Your Password</h3>
        <form>
          <div class="mb-3">
            <input
              placeholder="Enter your email"
              class="form-control box-line"
              type="email"
              v-model="email"
            />
          </div>
          <div class="mb-3">
            <!--<router-link to="/login"
              ><input
                type="submit"
                value="Submit"
                @click="sendPasswordMail(email)"
                class="btn btn-primary"
            /></router-link>-->
            <input
              value="Submit"
              @click="sendPasswordMail(email)"
              class="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./../../../components/Header/header.vue";
import { getResetPassword } from "./../../../services/UserService";
export default {
  name: "ForgotPassword",
  components: {
    Header,
  },
  data() {
    return {
      msg: "SocialGPS",
      email: "",
    };
  },
  methods: {
    sendPasswordMail(email) {
      let data = {
        email: email,
      };
      //  localStorage.setItem("email", email);
      getResetPassword(data)
        .then((response) => {
          console.log("resetPassword", response);
          this.$toast.success(response.data.message, {
            timeout: 2000,
          });
          setTimeout(() => 3000);
          //  this.$router.push("/login")
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
  },
};
</script>

<style scoped>
</style>
