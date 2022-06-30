<template>
  <div class="main-content register-screen">
    <div class="container">
      <div class="register-form">
        <h3 class="whitetext">Register</h3>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <input
              placeholder="First Name"
              v-model="firstName"
              name="firstname"
              id="firstname"
              class="form-control box-line"
              type="text"
              require
            />
          </div>
          <div class="mb-3">
            <input
              placeholder="Last Name"
              v-model="lastName"
              name="lastname"
              id="lastname"
              class="form-control box-line"
              type="text"
              required
            />
          </div>
          <div class="mb-3">
            <input
              placeholder="Email"
              name="email"
              v-model="email"
              id="email"
              class="form-control box-line"
              type="email"
              required
            />
          </div>
          <div class="mb-3">
            <input
              placeholder="Username"
              name="username"
              v-model="username"
              id="username"
              class="form-control box-line"
              type="text"
              required
            />
          </div>
          <div class="mb-3">
            <input
              placeholder="Password"
              v-model="password"
              name="password"
              id="password"
              class="form-control box-line"
              type="password"
              required
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            />
          </div>
          <div class="mb-3">
            <input
              placeholder="Confirm Password"
              v-model="passwordConf"
              name="passwordConf"
              id="passwordConf"
              class="form-control box-line"
              type="password"
              required
            />
          </div>
          <div class="mb-3">
            <multiselect
              name="valueim"
              id="valueim"
              v-model="selectedRoles"
              tag-placeholder="Add this as new tag"
              placeholder="I am"
              label="name"
              track-by="code"
              :options="iam"
              :multiple="true"
              :taggable="true"
              @tag="addTag"
            ></multiselect>
          </div>
          <div class="mb-3">
            <country-select
              class="multiselect"
              name="country"
              id="country"
              v-model="country"
              :country="country"
              tag-placeholder="Add this as new tag"
              label="name"
              track-by="code"
              @tag="addTag"
              topCountry="US"
            />
            <region-select
              class="multiselect"
              name="region"
              id="region"
              v-model="region"
              :country="country"
              tag-placeholder="Add this as new tag"
              placeholder="Region"
              label="name"
              track-by="code"
              regionName="true"
              @tag="addTag"
              :region="region"
            />
          </div>
          <div class="mb-3">
            <!-- <router-link to = "/login"><input type="submit" @click='createUser()' value="Register" class="btn btn-primary"/></router-link> -->
            <input type="submit" value="Register" class="btn btn-primary" />
          </div>
        </form>
        <div class="login-signup whitetext">
          Already have account? <router-link to="/login">Login</router-link>
        </div>
      </div>

      <div class="check-mail-wrapper whitetext">
        Check your email for activation link!
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./../../components/Header/header.vue";
import Vue from "vue";
import Multiselect from "vue-multiselect";
import { createUser } from "./../../services/UserService";
import vueCountryRegionSelect from "vue-country-region-select";
Vue.component("multiselect", Multiselect);
Vue.use(vueCountryRegionSelect);
export default {
  name: "Register",
  components: {
    vueCountryRegionSelect,
    Header,
    Multiselect,
  },
  data() {
    return {
      selectedRoles: [],
      country: "",
      region: "",
      center: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConf: "",
      valueim: [],
      hobbies: [],
      iam: [
        { name: "Viewer/Listener/User", code: "1" },
        { name: "Actor/Filmmaker", code: "3" },
        { name: "Affiliate", code: "4" },
        { name: "Athlete", code: "5" },
        { name: "Blogger / Vlogger", code: "6" },
        { name: "Comedian", code: "7" },
        { name: "Dancer", code: "8" },
        { name: "Emcee", code: "9" },
        { name: "Gamer", code: "10" },
        { name: "Musician", code: "11" },
        { name: "Painter / Crafting", code: "12" },
        { name: "Theater performer", code: "13" },
        { name: "Writer / Poet", code: "14" },
        { name: "Beatmaker", code: "15" },
        { name: "Cameraoperator", code: "16" },
        { name: "Designer", code: "17" },
        { name: "DJ", code: "18" },
        { name: "Mixengineer", code: "19" },
        { name: "Musiccomposer", code: "20" },
        { name: "Musicproducer", code: "21" },
        { name: "Performanceart", code: "22" },
        { name: "Petshow", code: "23" },
        { name: "Photographer", code: "24" },
        { name: "Podcaster", code: "25" },
        { name: "Singer", code: "26" },
      ],
      lookingfor: [
        { name: "Viewer/Listener/User", code: "1" },
        { name: "Actor/Filmmaker", code: "3" },
        { name: "Affiliate", code: "4" },
        { name: "Athlete", code: "5" },
        { name: "Blogger / Vlogger", code: "6" },
        { name: "Comedian", code: "7" },
        { name: "Dancer", code: "8" },
        { name: "Emcee", code: "9" },
        { name: "Gamer", code: "10" },
        { name: "Musician", code: "11" },
        { name: "Painter / Crafting", code: "12" },
        { name: "Theater performer", code: "13" },
        { name: "Writer / Poet", code: "14" },
        { name: "Beatmaker", code: "15" },
        { name: "Cameraoperator", code: "16" },
        { name: "Designer", code: "17" },
        { name: "DJ", code: "18" },
        { name: "Mixengineer", code: "19" },
        { name: "Musiccomposer", code: "20" },
        { name: "Musicproducer", code: "21" },
        { name: "Performanceart", code: "22" },
        { name: "Petshow", code: "23" },
        { name: "Photographer", code: "24" },
        { name: "Podcaster", code: "25" },
        { name: "Singer", code: "26" },
      ],
    };
  },
  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    submit() {
      const result = this.hobbies
        .map((item) => {
          return item.name;
        })
        .sort((a, b) => b.count - a.count);
      // const role = this.valueim
      //   .map((item) => {
      //     return item.name;
      //   })
      //   .sort((a, b) => b.count - a.count);
      const role_ = this.selectedRoles.map((r) => {
        return r.name;
      });
      const payload = {
        firstname: this.firstName,
        lastname: this.lastName,
        email: this.email,
        username: this.username,
        password: this.password,
        passwordConf: this.passwordConf,
        hobbies: result,
        country: this.country,
        region: this.region,
        // role: JSON.stringify(this.valueim),
        role: JSON.stringify(role_),
        lat: this.center.lat,
        lng: this.center.lng,
      };
      createUser(payload)
        .then((response) => {
          this.$router.push("/login");
          this.$toast.success(response.data.message, {
            timeout: 3000,
          });
          setTimeout(() => this.$router.push("/map"), 3000);
        })
        .catch((err) => {
          alert("Error");
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
  },
  mounted() {
    this.geolocate();
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped></style>
