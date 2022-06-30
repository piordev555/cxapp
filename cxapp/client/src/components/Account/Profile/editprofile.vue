<template>
  <div class="main-content">
    <div class="container">
      <!-- <div class="header after-login">
        <div class="back-link">
          <router-link to="/profile"
            ><i class="fas fa-chevron-left"></i
          ></router-link>
        </div>
        <div class="logo">
          <img src="../../../assets/logo.svg" />
        </div>
      </div>  -->
      <div class="edit-user-form">
        <form @submit.prevent="onSubmit" enctype="multipart/form-data">
          <div class="cover-image-section">
            <img
              class="cover-image-edit"
              v-if="!coverImage"
              src="https://i.ytimg.com/vi/dzdZ3CTRcV4/maxresdefault.jpg"
            />
            <img v-else v-bind:src="coverImage" />
            <div class="edit-icon-wrap text-right">
              <span class="cover-edit-icon" @click="coverInputClick"
                ><i class="fas fa-pencil-alt"></i
              ></span>
            </div>
            <input
              id="coverImg"
              ref="coverFileInput"
              type="file"
              @input="pickCoverImage"
              hidden
            />
          </div>

          <div class="usr-profile-image">
            <img v-if="!profileImage" src="../../../assets/users.svg" />
            <img v-else v-bind:src="profileImage" />
            <input
              id="photo"
              ref="fileInput"
              type="file"
              @input="pickFile"
              hidden
            />
            <span class="image-edit-icon" @click="profileInputClick"
              ><i class="fas fa-pencil-alt"></i
            ></span>
          </div>
          <div class="register-form">
            <div class="mb-3">
              <input
                placeholder="Username"
                v-model="currentuser.username"
                name="username"
                id="username"
                class="form-control box-line"
                type="text"
                @change="onChange"
              />
              <span style="color: red" :v-if="errors && errors.username">{{
                errors.username
              }}</span>
            </div>
            <div class="mb-3">
              <input
                placeholder="First Name"
                v-model="currentuser.firstname"
                name="firstname"
                id="firstname"
                class="form-control box-line"
                type="text"
                @change="onChange"
              />
              <span style="color: red" :v-if="errors && errors.firstname">{{
                errors.firstname
              }}</span>
            </div>
            <div class="mb-3">
              <input
                placeholder="Last Name"
                v-model="currentuser.lastname"
                name="lastname"
                id="lastname"
                value="Leuis"
                class="form-control box-line"
                type="text"
                @change="onChange"
              />
              <span style="color: red" :v-if="errors && errors.lastname">{{
                errors.lastname
              }}</span>
            </div>
            <div class="mb-3">
              <multiselect
                name="role"
                id="role"
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
                class="whitetext multiselect"
                name="country"
                id="country"
                v-model="country"
                :country="country"
                tag-placeholder="Add this as new tag"
                @change="onChange"
                label="name"
                track-by="code"
                topCountry="US"
              />
              <span style="color: red" :v-if="errors && errors.country">{{
                errors.country
              }}</span>

              <region-select
                class="whitetext multiselect"
                name="region"
                id="region"
                v-model="region"
                :country="country"
                tag-placeholder="Add this as new tag"
                placeholder="Region"
                @change="onChange"
                label="name"
                track-by="code"
                regionName="true"
                :region="region"
              />
              <span style="color: red" :v-if="errors && errors.region">{{
                errors.region
              }}</span>
            </div>
            <div class="mb-3">
              <textarea
                v-model="currentuser.about"
                name="about"
                id="about"
                placeholder="About me"
                class="form-control box-line"
              ></textarea>
            </div>
            <div class="mb-3">
              <input
                type="submit"
                value="Update Profile"
                class="btn btn-primary"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Multiselect from "vue-multiselect";
import { editprofile, checkUsername } from "./../../../services/UserService";
import { userDetail } from "./../../../services/UserService";
import vueCountryRegionSelect from "vue-country-region-select";
Vue.component("multiselect", Multiselect);
Vue.use(vueCountryRegionSelect);
export default {
  name: "EditProfile",
  components: {
    Multiselect,
    vueCountryRegionSelect,
  },
  data() {
    return {
      errors: [],
      currentuser: "",
      coverImage: "",
      profileImage: "",
      photo: "",
      username: "",
      firstname: "",
      lastName: "",
      country: "",
      region: "",
      about: "",
      role: [],
      hobbies: [],
      changeImage: false,
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
      selectedRoles: [],
    };
  },
  methods: {
    coverInputClick() {
      document.getElementById("coverImg").click();
    },
    profileInputClick() {
      document.getElementById("photo").click();
    },
    onChange(e) {
      this.errors = { ...this.errors, [e.target.name]: "" };
      if(e.target.name === 'username') {
          checkUsername({username: e.target.value, id: localStorage.getItem('id')})
          .then((response) => {
            if(response.data) {
              this.errors.username = ''
            }
          })
          .catch((err) => {
            this.error = err.response.data.message;
            this.errors.username = err.response.data;
            this.errorCount = !this.errorCount;
          });
      }
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    selectImage() {
      this.$refs.fileInput.click();
    },
    pickFile() {
      let input = this.$refs.fileInput;
      let file = input.files;
      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
          this.changeImage = true;
        };
        reader.readAsDataURL(file[0]);
        this.photo = file[0];
        // console.log("Photo", this.photo, file[0]);
        this.$emit("input", file[0]);
      }
    },
    selectCoverImage() {
      this.$refs.coverFileInput.click();
    },
    pickCoverImage() {
      let input = this.$refs.coverFileInput;
      let file = input.files;
      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.coverImage = e.target.result;
          this.changeCoverImage = true;
        };
        reader.readAsDataURL(file[0]);
        this.photo = file[0];
        console.log("Photo", this.photo, file[0]);
        this.$emit("input", file[0]);
      }
    },
    onSubmit() {
      if (!this.currentuser.username) {
        this.errors = { ...this.errors, username: "Username is Required" };
      }
      if (!this.currentuser.firstname) {
        this.errors = { ...this.errors, firstname: "FirstName is Required" };
      }
      if (!this.currentuser.lastname) {
        this.errors = { ...this.errors, lastname: "LastName is Required" };
      }
      if (this.currentuser.role == "") {
        this.errors = { ...this.errors, role: "Who I am is Required" };
      }
      // if (this.currentuser.hobbies == "") {
      //   this.errors.push("Looking for field required.");
      // }
      if (this.country == "") {
        this.errors = { ...this.errors, country: "Country is Required" };
      }
      if (this.region == "") {
        this.errors = { ...this.errors, region: "Region is Required" };
      }
      if (
        !this.errors.firstname &&
        !this.errors.lastname &&
        !this.errors.role &&
        !this.errors.country &&
        !this.errors.username &&
        !this.errors.region
      ) {
        const id = localStorage.getItem("id");
        // const hobbies = this.hobbies
        //   .map((item) => {
        //     return item.name;
        //   })
        //   .sort((a, b) => b.count - a.count);
        // const role = this.role
        //   .map((item) => {
        //     return item.name;
        //   })
        //   .sort((a, b) => b.count - a.count);
        const role_ =
          this.selectedRoles.map((r) => {
            return r.name;
          });
        const formData = new FormData();
        formData.append("profile", this.profileImage);
        formData.append("img", this.coverImage);
        formData.append("firstname", this.currentuser.firstname);
        formData.append("username", this.currentuser.username);
        formData.append("lastname", this.currentuser.lastname);
        formData.append("about", this.currentuser.about);
        formData.append("country", this.country);
        formData.append("region", this.region);
        formData.append("role", JSON.stringify(role_));
        editprofile(id, formData)
          .then((response) => {
            this.$router.push("/profile");
          })
          .catch((err) => {
            console.log("err", err);
            this.error = err.response.data.message;
            this.errorCount = !this.errorCount;
          });
      }
    },
    getdata() {
      const id = localStorage.getItem("id");
      userDetail(id)
        .then((response) => {
          this.currentuser = response.data;
          // this.firstname = this.currentuser.firstname;
          // this.lastName = this.currentuser.lastName;
          this.region = this.currentuser.region;
          this.country = this.currentuser.country;
          // this.hobbies = this.currentuser.hobbies
          this.selectedRoles =
            this.currentuser &&
            this.currentuser.role &&
            this.currentuser.role.length
              ? this.currentuser.role.map((r) =>
                  this.iam.find((i) => i.name === r)
                )
              : [];
          this.profileImage =
            this.currentuser && this.currentuser.profile
              ? this.currentuser.profile
              : "";
          this.coverImage =
            this.currentuser && this.currentuser.img
              ? this.currentuser.img
              : "";
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
  },
  mounted() {
    this.getdata();
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.image-edit-icon {
  bottom: 0;
  right: 11px;
  width: 30px;
  height: 30px;
  background: #ff9601;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  padding-top: 4px;
}
.cover-edit-icon {
  margin-top: -30px;
  z-index: 999;
  bottom: 0;
  background: #ff9601;
  border-radius: 50%;
  color: #fff;
  padding: 7px;
  /* position: absolute; */
}
.cover-image-edit {
  height: 250px;
  /* width: 50%; */
  width: 100%;
  object-fit: cover;
}
.cover-image-section input {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  opacity: 0;
  z-index: 9;
}
.cover-image-section img {
      object-fit: cover;
    height: 250px;
    width: 100%;
}
.usr-profile-image img {
  border-radius: 50%;
  width: 15%;
  align-items: center;

  /* width: auto;
  min-height: 135px;
  max-height: 135px;
  max-width: 100%; */
}

.usr-profile-image {
  /* display: inline-block; */
  /* margin: 10px; */
  width: 100%;
  position: relative;
  margin-bottom: 30px;
  /* margin-top: -30px; */
}

.usr-profile-image input {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  opacity: 0;
  z-index: 9;
}
.edit-icon-wrap {
  margin-top: -30px;
  z-index: 9999;
}
.edit-user-form {
  /* display: inline-block; */
  /* width: 500px; */
  width: 100%;
  /* margin-top: 50px; */
  /* max-width: 90%; */
}
.register-form {
  display: inline-block;
}
</style>
