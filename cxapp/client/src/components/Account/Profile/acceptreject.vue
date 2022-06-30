<template>
  <div class="main-content">
    <div class="container">
      <div class="header after-login">
        <div class="back-link">
          <router-link to="/map"
            ><i class="fas fa-chevron-left"></i
          ></router-link>
        </div>
        <div class="logo">
          <img src="../../../assets/logo.svg" />
        </div>
      </div>
      <div class="user-box" v-if="currentuser">
        <div class="user-head">
          <img
            v-if="!currentuser.profile || currentuser.profile == ''"
            src="../../../assets/users.svg"
          />
          <img
            v-if="currentuser.profile && currentuser.profile != ''"
            v-bind:src="currentuser.profile"
          />
          <div class="user-detail">
            <h3 class="whitetext">
              {{ currentuser.firstname }} {{ currentuser.lastname }}
            </h3>
            <p class="whitetext">{{ role }}</p>
            <div class="user-action-links">
              <span
                v-if="(currentuser.friend_req_status != 'Accepted'&& currentuser.friend_req_status != 'Rejected')"
                v-on:click="frndRequest('Accepted', currentuser)"
                >Accept</span
              >
              <span v-if="currentuser.friend_req_status == 'Accepted'"
                >Accepted</span
              >
              <span
                v-if="(currentuser.friend_req_status != 'Accepted'&& currentuser.friend_req_status != 'Rejected')"
                v-on:click="frndRequest('Rejected', currentuser)"
                >Reject</span
              >
              <span v-if="currentuser.friend_req_status == 'Rejected'"
                >Rejected</span
              >
            </div>
          </div>
        </div>
        <div class="user-description">
          <h5 class="whitetext">Interests</h5>
          <div class="interest-box colored-text">
            <ul>
              <li v-for="hobbie in hobbies" :key="hobbie">
                {{ hobbie }}
              </li>
            </ul>
          </div>
          <h5 class="whitetext">About</h5>
          <p class="whitetext" v-if="currentuser.about">
            {{ currentuser.about }}
          </p>
          <p class="whitetext" v-else></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "./../../../components/Menu/menu.vue";
import {
  userDetail,
  getAcceptRejectStatus,
  acceptReject,
} from "./../../../services/UserService";
export default {
  name: "AcceptReject",
  components: {
    Menu,
  },
  data() {
    return {
      currentuser: null,
      hobbies: null,
      role: null,
      msg: "SocialGPS",
      user_id: "",
      request_id: "",
      frnd_user: null,
    };
  },
  methods: {
    frndRequest(value, user) {
      let msg = "";
      let friend_data = {
        user_id: this.user_id,
        friendrequest_id: this.request_id,
        friend_req_status: value,
      };
      acceptReject(friend_data)
        .then((response) => {
          this.getdata(this.user_id, this.request_id);
          if (response.data.friend_req_status == "Accepted") {
            msg = "Friend request Accepted!";
          } else if (response.data.friend_req_status == "Rejected") {
            msg = "Friend request Rejected!";
          }
          this.$toast.success(msg, {
            timeout: 2000,
          });
        })
        .catch((err) => {
          this.$toast.error('Something went wrong, try again.', {
            timeout: 2000,
          });
        });
    },
    getdata(id, req_id) {
      userDetail(id)
        .then((response) => {
          this.getAcceptReject(response.data, id, req_id);
        })
        .catch((err) => {
          this.$toast.error('Something went wrong, try again.', {
            timeout: 2000,
          });
        });
    },
    getAcceptReject(data, id, req_id) {
      let friend_data = {
        user_id: id,
        friendrequest_id: req_id,
        friend_req_status: "",
      };
      // console.log(friend_data);return;
      getAcceptRejectStatus(friend_data)
        .then((response) => {
          this.frnd_user = response.data[0];
          this.currentuser = data;
          this.currentuser.friend_req_status = this.frnd_user.friend_req_status;
          this.hobbies = this.currentuser.hobbies;
          this.role = this.currentuser.role.toString();
        })

        .catch((err) => {
          console.log("err", err);
        });
    },
  },
  mounted() {
    this.user_id = this.$router.history.current.params.user_id;
    this.request_id = this.$router.history.current.params.request_id;
    this.getdata(this.user_id, this.request_id);
  },
};
</script>

<style scoped>
</style>
