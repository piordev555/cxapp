<template>
  <div class="main-content login-screen">
    <div class="container">
      <div class="register-form">
        <h3 class="whitetext">Login</h3>
        <form>
          <div class="mb-3">
            <input
              placeholder="email"
              v-model="input.email"
              class="form-control box-line"
              type="email"
              required
            />
          </div>
          <div class="mb-3">
            <input
              placeholder="Password"
              v-model="input.password"
              class="form-control box-line"
              type="password"
              required
            />
            <div class="forgot-password">
              <router-link to="/forgotpassword">Forgot password?</router-link>
            </div>
          </div>
          <div class="mb-3">
            <input
              type="submit"
              value="Login"
              class="btn btn-primary"
              v-on:click.prevent="loginuser()"
            />
          </div>
        </form>
        <div class="login-signup whitetext">
          Don't have account?
          <router-link to="/register">Register Now</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./../../components/Header/header.vue";
import { login } from "./../../services/UserService";
export default {
  name: "Login",
  components: {
    Header,
  },
  data() {
    return {
      input: {
        email: "",
        password: "",
        confirmationCode: "",
      },
    };
  },
  methods: {
    loginuser() {
      const data = {
        email: this.input.email,
        password: this.input.password,
        confirmationCode: this.confirmationCode,
      };
      login(data)
        .then((response) => {
          console.log("response", response);
          const firstname =
            response.data.firstname.charAt(0).toUpperCase() +
            response.data.firstname.slice(1);
          const lastname =
            response.data.lastname.charAt(0).toUpperCase() +
            response.data.lastname.slice(1);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("id", response.data.id);
          localStorage.setItem("hobbies", response.data.hobbies);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("userName", firstname + " " + lastname);
          this.$toast.success("Login successfull!", {
            timeout: 2000,
          });
          setTimeout(() => this.$router.push("/map"), 3000);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
  },
  mounted() {
    this.confirmationCode = this.$router.history.current.params.id;
    console.log("confirmationCode", this.confirmationCode);
  },
};
</script>

<style scoped>
</style>
