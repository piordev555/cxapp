<template>
  <div class="main-content">
    <div class="map-view">
      <gmap-map
        :options="{
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          disableDefaultUi: false,
          restriction: {
          latLngBounds: WORLD_BOUNDS,
          strictBounds: false,
          },
        }"
        :center="center"
        :zoom="8"
        style="width: 100%; height: 100vh"
      >
        <!--  -->
        <!-- data from database -->

        <gmap-marker
          v-for="user in users"
          :key="user.id"
          v-bind:position="getLatLong(user)"
          :clickable="true"
          :draggable="false"
          @click="openWindow(user)"
          :icon="{
            url: require(`../../assets/${user.img}`),
            scaledSize: { width: 30, height: 30 },
          }"
        >
          <gmap-info-window
            :options="{
              maxWidth: 300,
              pixelOffset: { width: 0, height: -35 },
            }"
            v-bind:position="getLatLong(user)"
            :opened="user.open"
            @closeclick="user.open = false"
          >
            <div class="row user-tooltip m-0 p-0">
              <div class="col-3 p-0 mt-3">
                <span class="avatar">
                  <router-link :to="'/user/' + user.username">
                    <img
                      v-if="user.profile && user.profile != ''"
                      v-bind:src="user.profile"
                      class="profile-pic"
                    />
                    <img
                      v-if="!user.profile || user.profile == ''"
                      src="../../assets/users.svg"
                    />
                  </router-link>
                </span>
              </div>
              <div class="col-9 p-0 m-0">
                <div class="text-right mt-2 mr-3">
                  <span
                    class="envelope circle-btn"
                    style="cursor: pointer"
                    v-on:click="openChat(user._id)"
                  ></span>
                  <span
                    v-if="user.isFriend"
                    style="color:green;font-size:18px;ml-1"
                  >
                    <i class="fa fa-check"></i>
                  </span>
                  <span
                    v-else-if="user.isFriendReqSent"
                    style="color:green;font-size:18px;ml-1"
                  >
                    Requested
                  </span>
                  <span
                    class="add-friend circle-btn"
                    v-else
                    v-on:click="
                      addFriend(
                        user._id,
                        user.firstname,
                        user.lastname,
                        user.email,
                        true
                      )
                    "
                  ></span>
                </div>

                <div class="user-head">
                  <div class="user-detail">
                    <div class="user-detail-txt">
                      <router-link :to="'/user/' + user.username">
                        <h3>{{ user.firstname }} {{ user.lastname }}</h3>
                      </router-link>
                      <span v-for="list in user.role" :key="list" class="item">
                        <span>{{ list }}</span>
                      </span>
                    </div>
                    <div class="user-about">
                      <span>
                        <span>{{
                          user.about ||
                          "This is a sample test for abut info for test"
                        }}</span>
                      </span>
                    </div>
                    <div class="friend-details mb-4">
                      <span
                        ><strong> {{ user.friendsCount }}</strong> Friends</span
                      >
                      <span></span>
                      <span
                        ><strong>{{ user.subscribeCount }}</strong>
                        Subscribers</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </gmap-info-window>
        </gmap-marker>
      </gmap-map>
      <button @click="getAllUsers()" type="button" class="btn btn-warning">
        Get all Users
      </button>
    </div>
    <transition name="fade">
      <ChatWindow
        v-if="partnerId"
        v-bind:partnerId="partnerId"
        @onCloseChat="closeChatAction"
      />
    </transition>
    <Category v-on:categoryValue="userRole($event)" />
  </div>
</template>

<script>
import { isMobile } from "mobile-device-detect";
import Menu from "./../../components/Menu/menu.vue";
import Header from "./../../components/Header/header.vue";
import {
  getAllUsers,
  getusers,
  getNotifications,
  addNotification,
  updateAddFriend,
  getRole,
} from "./../../services/UserService";
import {
  friendrequest,
  friends,
  isFriendReqSent,
} from "./../../services/FriendService";
import Category from "./category.vue";
import ChatWindow from "../Chat/chatwindow.vue";
import ChatNotification from "./../../components/ChatNotification/chatNotification.vue";
export default {
  name: "Maptest",
  components: {
    Menu,
    Category,
    ChatWindow,
    ChatNotification,
    Header,
  },
  data() {
    return {
      isMobile,
      Arefriend: "",
      center: { lat: 45.508, lng: -73.587 },
      friends: false,
      users: [],
      position: "",
      returnvalue: "",
      partnerId: "",
      WORLD_BOUNDS: {
        north: 83,
        south: -50,
        west: 180.28,
        east: -182,
}
    };
  },
  methods: {
    async userRole(data) {
      let arr;
      console.log("event_data", data);
      if (data && data.switch_value === true) {
        arr = data.users_role.filter(
          (rm) =>
            !this.users.find(
              (ar) => rm.id === ar.id && rm.role[0] === ar.role[0]
            )
        );
        arr.map((x) => {
          this.users.push(x);
        });
        //console.log("after_true", this.users, "arr_true", arr);
      } else if (data.switch_value === false) {
        // this.users = this.users.filter(
        //   (ar) =>
        //     !data.users_role.find(
        //       (rm) => rm.id === ar.id && rm.role[0] === ar.role[0]
        //     )
        // );
        data.users_role.map((d) => {
          let ind = this.users.findIndex((x) => x.id === d.id);
          this.users.splice(ind, 1);
        });
        console.log("after_false", this.users);
      }
      let list = this.users;
      const id = localStorage.getItem("id");
      sessionStorage.setItem('categoryData', JSON.stringify(this.users));
      this.users = await Promise.all(
        list.map(async (item) => {
          let boolVar = await this.arefriends(item._id);
          let isFrndReq = await this.isFriendReqSend(item._id);
          return { ...item, isFriend: boolVar, isFriendReqSent: isFrndReq };
        })
      );
      this.users = this.users.filter((x) => x._id !== id)
      console.log("toggle-Arrs", this.users);
      localStorage.setItem("toggle-arr", JSON.stringify(this.users));
    },
    toggleExpand(item) {
      item.isActive = !item.isActive;
    },
    openChat: function (request_id) {
      this.partnerId = "";
      setTimeout(() => {
        this.partnerId = request_id;
      }, 200);
    },
    closeChatAction() {
      this.partnerId = "";
    },

    addFriend: function (
      request_id,
      request_firstname,
      request_lastname,
      request_email,
      friend_value
    ) {
      //  this.friends = !this.friends;
      const user_id = localStorage.getItem("id");
      const user_email = localStorage.getItem("email");
      const user_name = localStorage.getItem("userName");
      const req_firstname =
        request_firstname.charAt(0).toUpperCase() + request_firstname.slice(1);
      const req_lastname =
        request_lastname.charAt(0).toUpperCase() + request_lastname.slice(1);
      const data = {
        user_id: user_id,
        friendrequest_id: request_id,
        friendrequest_name: req_firstname + " " + req_lastname,
        friendrequest_status: "Not Selected",
        user_name: user_name,
        user_email: user_email,
        req_email: request_email,
        friends: friend_value,
      };
      console.log("req_email", data.req_email);
      friendrequest(data)
        .then(async (response) => {
          this.friends = response.data.user.friends;
          if (this.friends == true) {
            console.log("Friend_True", this.friends);
            this.$toast.success("Friend request sent successfull!", {
              timeout: 2000,
            });
          } else {
            this.$toast.error("Unfriend successfully!", {
              timeout: 2000,
            });
          }
          let list = this.users;
          this.users = await Promise.all(
            list.map(async (item) => {
              let boolVar = await this.arefriends(item._id);
              let isFrndReq = await this.isFriendReqSend(item._id);
              return { ...item, isFriend: boolVar, isFriendReqSent: isFrndReq };
            })
          );
          console.log("toggle-Arrs", this.users);
          localStorage.setItem("toggle-arr", JSON.stringify(this.users));

          this.friendStatusUpdate(request_id, friend_value);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
    friendStatusUpdate(id, friends) {
      let data = {
        id: id,
        friends: friends,
      };
      updateAddFriend(data)
        .then((response) => {
          console.log("friendStatusUpdate", response.data);
          this.getAllUsers();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
    addNotification(request_id) {
      const id = localStorage.getItem("id");
      let data = {
        user_id: id,
        request_id: request_id,
        notification_type: "Friend",
      };
      addNotification(data)
        .then((response) => {
          console.log("Notification_Response", response);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
    getNotifications() {
      const id = localStorage.getItem("id");
      let data = { id: id };
      getNotifications(data)
        .then((response) => {
          console.log("Notification_Response", response.data);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
    getAllUsers() {
      const id = localStorage.getItem("id");
      const hobbies = localStorage.getItem("hobbies").split(",");
      //  console.log("hobbies", hobbies);
      const data = {
        lat: this.center.lat,
        lng: this.center.lng,
        hobbies: hobbies,
      };
      getusers(data)
        .then((response) => {
          if (Object.keys(response.data).length) {
            const users = response.data;
            //console.log("getusers_Response", users);
            const lists = users.filter((x) => {
              return x.id != id;
            });
            this.users = lists;
            hobbies.forEach((y) => {
              if (y == "Viewer/Listener/User") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/users.svg";
                  x.name = "Viewer/Listener/User";
                });
              }
              if (y == "Actor/Filmmaker") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Filmmaker.svg";
                  x.name = "Actor/Filmmaker";
                });
              }
              if (y == "Affiliate") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Affiliate.svg";
                  x.name = "Affiliate";
                });
              }
              if (y == "Athlete") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Athlete.svg";
                  x.name = "Athlete";
                });
              }
              if (y == "Blogger / Vlogger") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Blogger.svg";
                  x.name = "Blogger / Vlogger";
                });
              }
              if (y == "Comedian") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Actor.svg";
                  x.name = "Comedian";
                });
              }
              if (y == "Dancer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Dancer.svg";
                  x.name = "Dancer";
                });
              }
              if (y == "Emcee") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Singer.svg";
                  x.name = "Emcee";
                });
              }
              if (y == "Gamer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Gamer.svg";
                  x.name = "Gamer";
                });
              }
              if (y == "Musician") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Musician.svg";
                  x.name = "Musician";
                });
              }
              if (y == "Painter / Crafting") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Arts&Crafts.svg";
                  x.name = "Painter / Crafting";
                });
              }
              if (y == "Theater performer") {
                this.users.forEach((x) => {
                  x.img = "Events/Theatre.svg";
                  x.name = "Theater performer";
                });
              }
              if (y == "Writer / Poet") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Writer.svg";
                  x.name = "Writer / Poet";
                });
              }
              if (y == "Beatmaker") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Beatmaker.svg";
                  x.name = "Beatmaker";
                });
              }
              if (y == "Cameraoperator") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Cameraoperator.svg";
                  x.name = "Cameraoperator";
                });
              }
              if (y == "Designer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Designer.svg";
                  x.name = "Designer";
                });
              }
              if (y == "DJ") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Dj.svg";
                  x.name = "DJ";
                });
              }
              if (y == "Mixengineer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Mixengineer.svg";
                  x.name = "Mixengineer";
                });
              }
              if (y == "Musiccomposer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Musiccomposer.svg";
                  x.name = "Musiccomposer";
                });
              }
              if (y == "Musicproducer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Musicproducer.svg";
                  x.name = "Musicproducer";
                });
              }
              if (y == "Performanceart") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Performanceart.svg";
                  x.name = "Performanceart";
                });
              }
              if (y == "Petshow") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Petshow.svg";
                  x.name = "Petshow";
                });
              }
              if (y == "Photographer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Photographer.svg";
                  x.name = "Photographer";
                });
              }
              if (y == "Podcaster") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Podcaster.svg";
                  x.name = "Podcaster";
                });
              }
              if (y == "Singer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Singer.svg";
                  x.name = "Singer";
                });
              }
            });
            //console.log("lists", this.users);
            const kjsfd = lists.map((item) => {
              this.arefriends(item.id);
            });

            //let toggleArr = JSON.parse(
            //  JSON.stringify(localStorage.getItem("toggle-arr"))
            //);
            //if (toggleArr && toggleArr.length > 0) {
            //  this.users = JSON.parse(toggleArr);
            //}
          } else {
            this.$toast.error("No user found with your interests!", {
              timeout: 2000,
            });
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },

    filterArr(arr, criteria) {
      return arr.filter(function (obj) {
        return Object.keys(criteria).every(function (c) {
          return obj[c] == criteria[c];
        });
      });
    },

    getLatLong(user) {
      var location = { lat: parseFloat(user.lat), lng: parseFloat(user.lng) };
      return location;
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    openWindow(user) {
      user.open = !user.open;
    },
    async arefriends(friend_id) {
      const id = localStorage.getItem("id");
      const data = {
        user_id: id,
        friendrequest_id: friend_id,
      };
      let output = false;
      let response = await friends(data);
      if (Object.keys(response.data).length) {
        output = true;
      }
      return output;
    },
    async isFriendReqSend(friend_id) {
      const id = localStorage.getItem("id");
      const data = {
        user_id: id,
        friendrequest_id: friend_id,
      };
      let output = false;
      let response = await isFriendReqSent(data);
      if (Object.keys(response.data).length) {
        output = true;
      }
      return output;
    },
  },
  mounted() {
    this.geolocate();
    this.getAllUsers();
    let categoryData = JSON.parse(sessionStorage.getItem('categoryData')) || []
    if(categoryData.length)
      this.users = categoryData;  
      
  },
};
</script>
<style>
.gm-style-iw {
  background-color: #313131 !important;
  opacity: 0.8;
}
.gm-style .gm-style-iw-c {
  padding: 5px 10px 0 10px;
  border-radius: 15px;
}
.gm-style-iw img {
  border: 2px solid white;
  border-radius: 50%;
  object-fit: contain;
  /* width: 55px; */
}
.gm-style-iw .gm-style-iw-d {
  overflow: hidden !important;
}
.gm-style .gm-style-iw-t::after {
  background: none;
  box-shadow: none;
}
.gm-ui-hover-effect {
  display: none !important;
}

.profile-pic {
  width: 70px;
  height: 70px;
  max-width: 70px;
  max-height: 150px;
  border-radius: 50%;
  border: 4px solid hsla(0, 0%, 100%, 0.5);
}
</style>
