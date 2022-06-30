<template>
  <div class="main-content">
    <div class="row">
      <div class="col-lg-12">
          <div class="card hovercard">
              <!-- <div class="d-flex">
      <div>
        <i class="fas fa-comment notification-icon"></i>
        <h4 :v-if="chatRequestCount > 0" style="color: white">
          {{ chatRequestCount }}
        </h4>
      </div>
      <router-link to="/editprofile">
        <i class="fas fa-pencil-alt edit-icon"></i>
      </router-link>
    </div> -->
              <div class="cardheader">
                  <img alt="cover image"
                       :src="
                currentuser.img
                  ? currentuser.img
                  : 'https://i.ytimg.com/vi/dzdZ3CTRcV4/maxresdefault.jpg'
              " />
                  <!-- <img
          alt="coverimage"
          v-else
          src="https://i.ytimg.com/vi/dzdZ3CTRcV4/maxresdefault.jpg"
        /> -->
                  <hr class="hr-line" />
                  <div class="name">
                      <span :v-if="currentuser.username">@{{ currentuser.username }}</span>
                  </div>
                  <div class="avatar">
                      <img alt="Profile pic"
                           :src="
                  currentuser.profile
                    ? currentuser.profile
                    : require('../../../assets/users.svg')
                " />
                  </div>

                  <!-- <div class="text-right subscribe-area">
          <span class="envelope circle-btn"></span>
          <span class="add-friend circle-btn"></span>
          <span class="subscribe">Subscribe</span>
        </div> -->
              </div>
              <div class="text-right mb-2 mr-3 edit-profile-links">
                  <router-link to="/editprofile" class="edit-btn">
                      Edit Profile
                  </router-link>
              </div>
              <div class="info">

                  <div class="title">
                      <strong>{{ currentuser.firstname }} {{ currentuser.lastname }}</strong>
                  </div>
                  <div v-if="role && role.length > 0" class="desc-role">
                      <span v-for="r in role" :key="r" class="item">
                          <span class="mr-3">{{ r }}</span>
                      </span>
                  </div>
                  <div class="desc-about"
                       :v-if="
                currentuser &&
                currentuser.about !== undefined &&
                currentuser.about
              ">
                      {{ currentuser.about }}
                  </div>
                  <div class="location">
                      <span></span>
                      <span class="icon-Menu-Map mr-2"></span>
                      <span :v-if="currentuser.country" class="mr-3">
                          {{
                currentuser.country
                          }}
                      </span>
                      <span :v-if="currentuser.region" class="mr-3">
                          {{
                currentuser.region
                          }}
                      </span>

                      <span v-for="icon in iconList" :key="icon" class="ml-2">
                          <img :src="require(`../../../assets/${icon.img}`)"
                               height="20px"
                               width="20px" />
                      </span>
                  </div>
                  <div class="desc-friends">
                      <span><strong>{{ currentuser.friendsCount }}</strong> Friends</span>
                      <span>
                          <strong>{{ currentuser.subscribeCount }}</strong>
                          Subscribers
                      </span>
                  </div>
              </div>
              <!-- <div class="bottom">
              <a class="btn btn-primary btn-twitter btn-sm" href="https://twitter.com/webmaniac">
                  <i class="fa fa-twitter"></i>
              </a>
              <a class="btn btn-danger btn-sm" rel="publisher"
                 href="https://plus.google.com/+ahmshahnuralam">
                  <i class="fa fa-google-plus"></i>
              </a>
              <a class="btn btn-primary btn-sm" rel="publisher"
                 href="https://plus.google.com/shahnuralam">
                  <i class="fa fa-facebook"></i>
              </a>
              <a class="btn btn-warning btn-sm" rel="publisher" href="https://plus.google.com/shahnuralam">
                  <i class="fa fa-behance"></i>
              </a>
          </div> -->
              <div class="container center">
                  <div class="row d-flex justify-content-center">
                      <div class="col-4 d-flex justify-content-center"
                           v-for="(cardinfo, index) in [1, 2, 3, 4, 5, 6]"
                           :key="index">
                          <div class="card text-center tile"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
  <!-- <div class="container">
      <div class="header after-login">
        <div class="back-link">
          <router-link to="/map"
            ><i class="fas fa-chevron-left"></i
          ></router-link>
        </div>
        <div class="logo">
          <img src="../../../assets/logo.svg" />
        </div>
        <div class="edit-profile">
          <router-link to="/editprofile"
            ><i class="fas fa-pencil-alt"></i
          ></router-link>
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
            <div class="connects">
                <b-dropdown size="md"  variant="link" toggle-class="text-decoration-none" no-caret>
                  <template #button-content>
                    <span class="friend-connect whitetext">
                      <span class="connect-count">{{ friendRequestNotificationCount }}</span>
                      Friends
                    </span>
                  </template>
                  <b-dropdown-item v-for="request in friendRequestNotifications" :key="request.id">
                    <span v-if="request.notification_type == 'Friend'" @click="gotoAcceptOrReject(request)">
                      {{request.user_id.firstname}} {{request.user_id.lastname}} sent friend request
                    </span>
                    <span v-if="request.notification_type == 'Accepted'">
                      {{request.user_id.firstname}} {{request.user_id.lastname}} accepted friend request
                    </span>
                    <span v-if="request.notification_type == 'Rejected'">
                      {{request.user_id.firstname}} {{request.user_id.lastname}} rejected friend request
                    </span>
                  </b-dropdown-item>
                </b-dropdown>
                <b-dropdown size="md"  variant="link" toggle-class="text-decoration-none" no-caret>
                  <template #button-content>
                      <span class="subscribe-connect whitetext"
                        ><span class="connect-count">{{
                          subscribeNotificationCount
                        }}</span>
                        Subscribed</span
                      >
                  </template>
                  <b-dropdown-item v-for="request in subscribeNotifications" :key="request.id">
                    <span v-if="request.notification_type == 'Subscribe'">
                      {{request.user_id.firstname}} {{request.user_id.lastname}} subscribe you
                    </span>
                    <span v-if="request.notification_type == 'UnSubscribe'">
                      {{request.user_id.firstname}} {{request.user_id.lastname}} unsubscribe you
                    </span>
                  </b-dropdown-item>
                </b-dropdown>
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
    </div> -->
</template>

<script>
import Menu from "./../../../components/Menu/menu.vue";
import { userDetail } from "./../../../services/UserService";
import { getNotifications } from "./../../../services/NotificationService";
import { getRequests } from "./../../../services/ChatService";

import io from "socket.io-client";
export default {
  name: "Profile",
  components: {
    Menu,
  },
  data() {
    return {
      iconList: [],
      currentuser: null,
      role: null,
      roles: [],
      msg: "SocialGPS",
      socket: io("https://chorusx.herokuapp.com/"),
      friendRequestNotifications: [],
      friendRequestNotificationCount: 0,
      subscribeNotifications: [],
      subscribeNotificationCount: 0,
      chatRequest: [],
      chatRequestCount: 0,
    };
  },
  methods: {
    getdata() {
      const id = localStorage.getItem("id");
      getNotifications(id)
        .then((response) => {
          console.log(response.data);
          if (response.data.friendRequestNotifications.length) {
            this.friendRequestNotifications =
              response.data.friendRequestNotifications;
            this.friendRequestNotificationCount =
              response.data.friendRequestNotifications.length;
          }
          if (response.data.subscribeNotifications.length) {
            this.subscribeNotifications = response.data.subscribeNotifications;
            this.subscribeNotificationCount =
              response.data.subscribeNotifications.length;
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
      getRequests({ chatrequest_id: id })
        .then((response) => {
          console.log("Chat Request DAta==", response.data);
          if (response.data.length) {
            this.chatRequest = response.data;
            this.chatRequestCount = response.data.length;
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
      userDetail(id)
        .then((response) => {
          this.currentuser = response.data;
          this.hobbies = this.currentuser.hobbies;
          // console.log("....==============", this.currentuser.role);

          this.role = this.currentuser.role;
          this.rolesIcon = [
            { img: "Entertainers/users.svg", name: "Viewer/Listener/User" },
            { img: "Entertainers/Filmmaker.svg", name: "Actor/Filmmaker" },
            { img: "Entertainers/Affiliate.svg", name: "Affiliate" },
            { img: "Entertainers/Athlete.svg", name: "Athlete" },
            { img: "Entertainers/Blogger.svg", name: "Blogger / Vlogger" },
            { img: "Entertainers/Actor.svg", name: "Comedian" },
            { img: "Entertainers/Dancer.svg", name: "Dancer" },
            { img: "Entertainers/Singer.svg", name: "Emcee" },
            { img: "Entertainers/Gamer.svg", name: "Gamer" },
            { img: "Entertainers/Musician.svg", name: "Musician" },
            { img: "Entertainers/Arts&Crafts.svg", name: "Painter / Crafting" },
            { img: "Events/Theatre.svg", name: "Theater performer" },
            { img: "Entertainers/Writer.svg", name: "Writer / Poet" },
            { img: "Entertainers/Beatmaker.svg", name: "Beatmaker" },
            { img: "Entertainers/Cameraoperator.svg", name: "Cameraoperator" },
            { img: "Entertainers/Designer.svg", name: "Designer" },
            { img: "Entertainers/Dj.svg", name: "DJ" },
            { img: "Entertainers/Mixengineer.svg", name: "Mixengineer" },
            { img: "Entertainers/Musiccomposer.svg", name: "Musiccomposer" },
            { img: "Entertainers/Performanceart.svg", name: "Performanceart" },
            { img: "Entertainers/Petshow.svg", name: "Petshow" },
            { img: "Entertainers/Photographer.svg", name: "Photographer" },
            { img: "Entertainers/Podcaster.svg", name: "Podcaster" },
            { img: "Entertainers/Singer.svg", name: "Singer" },
            { img: "Entertainers/Dance.svg", name: "Dance Event" },
            { img: "Entertainers/DJ.svg", name: "DJ Event" },
            { img: "Entertainers/Game.svg", name: "Game Event" },
            { img: "Entertainers/Music.svg", name: "Music Event" },
            { img: "Entertainers/Petshow.svg", name: "Petshow Event" },
            { img: "Entertainers/Photography.svg", name: "Photography Event" },
            { img: "Entertainers/Sports.svg", name: "Sports Event" },
            { img: "Entertainers/Podcast.svg", name: "Podcast Event" },
            { img: "Entertainers/Theatre.svg", name: "Theatre Event" },
            { img: "Entertainers/Theatre.svg", name: "THouse Location" },
            { img: "Entertainers/Theatre.svg", name: "Theatre Location" },
            { img: "Entertainers/Theatre.svg", name: "Miscellaneous Location" },
            { img: "Entertainers/Theatre.svg", name: "Rehearsal Location" },
            { img: "Entertainers/Theatre.svg", name: "Music Store" },
            { img: "Entertainers/Theatre.svg", name: "Record Store" },
            {
              img: "Entertainers/Theatre.svg",
              name: "Recording Studio Location Event",
            },
          ];
          this.role.map((r) => {
            this.iconList.push(this.rolesIcon.find((i) => i.name === r));
          });
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },

    sendMessage(e) {
      e.preventDefault();
      this.socket.emit("SEND_MESSAGE", {
        user: "this.user",
        message: "this.message",
      });
    },
    gotoAcceptOrReject(request) {
      this.$router.push(
        `/accept/reject/${request.user_id.id}/${request.request_id}`
      );
    },
  },
  mounted() {
    this.getdata();
    this.socket.on("receiveNotification", (data) => {
      if (data.request_id == this.currentuser.id) {
        if (
          data.notification_type != "Subscribe" &&
          data.notification_type != "UnSubscribe"
        ) {
          this.friendRequestNotifications = [
            ...this.friendRequestNotifications,
            data,
          ];
          this.friendRequestNotificationCount++;
        } else if (
          data.notification_type == "Subscribe" ||
          data.notification_type == "UnSubscribe"
        ) {
          this.subscribeNotifications = [...this.subscribeNotifications, data];
          this.subscribeNotificationCount++;
        }
      }
    });
  },
  sockets: {
    connect: function () {
      this.$socket.emit("online", this.selfId);
    },
    disconnect: function () {
      this.$socket.emit("offline", this.selfId);
    },
    updateIds: function (ids) {
      this.onlineIds = ids;
    },
    updateTypings: function (ids) {
      this.typingIds = ids;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  width: 80%;
  font-family: 'Roboto', sans-serif !important;
}
.tile {
  width: 350px;
  min-height: 350px;
}


    .item span {
        border: 1px solid #fff;
        padding: 5px 15px 5px 15px;
        border-radius: 5px;
        font-size: 20px;
        color: #9fa3a7;
    }

@media (max-width: 767px) {
  .tile {
    min-height: 100px;
    width: 100px;
  }
  .card.hovercard .cardheader .name {
    display: none;
  }
  .card.hovercard .cardheader .subscribe-area .circle-btn {
    display: none;
  }
}

    .card {
        padding-top: 20px;
        background-color: rgba(214, 224, 226, 0.2);
        border-top-width: 0;
        border-bottom-width: 2px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

.card.hovercard {
  position: relative;
  padding-top: 0;
  overflow: hidden;
  text-align: center;
  background-color: #252525;
}

.card.hovercard .cardheader {
  background: url("http://lorempixel.com/850/280/nature/4/");
  background-size: cover;
  height: 250px;
  font-family: 'Roboto', sans-serif !important;
}
.card.hovercard .cardheader .hr-line {
  border: none;
  height: 1px;
  /* Set the hr color */
  color: #ffffff; /* old IE */
  background-color: #ffffff;
  margin-top: 0px;
}
.card.hovercard .cardheader .name {
  margin-left: -300px;
  color: #ffffff;
  font-size: 15px;
  margin-top: -10px;
}

.card.hovercard .cardheader .subscribe-area {
  color: #ffffff;
  padding: 20px;
}
.card.hovercard .cardheader .subscribe-area .subscribe {
  border: 1px solid #ffffff;
  border-radius: 10px;
  margin-left: 10px;
  padding: 10px;
}

.card.hovercard .cardheader .subscribe-area .circle-btn {
  border: 1px solid #ffffff;
  border-radius: 50%;
  padding: 10px 2px 10px 10px;
  text-align: center;
  margin-left: 10px;
}

.card .cardheader img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.card.hovercard .cardheader .avatar {
  position: relative;
  margin-top: -115px;
  margin-bottom: -50px;
  object-fit: cover;
}

.card.hovercard .cardheader .avatar img {
  width: 150px;
  height: 150px;
  max-width: 150px;
  max-height: 150px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  border: 5px solid #f9f9f9;
}

.card.hovercard .info {
  padding: 4px 8px 10px;
  margin-top: 0px;
}
.info {
  margin-top: 20px;
}

.card.hovercard .info .title {
  margin-bottom: 4px;
  font-size: 50px;
  line-height: 1;
  color: #ffffff;
  vertical-align: middle;
}

.card.hovercard .info .desc-about {
  overflow: hidden;
  margin-top: 30px;
  font-size: 20px;
  line-height: 20px;
  color: #ffffff;
  text-overflow: ellipsis;
  width: 30%;
  position: relative;
  left: 35%;
}

.card.hovercard .info .location {
  margin-top: 20px;
  color: #f9f9f9;
}

.card.hovercard .info .desc-friends {
  margin-top: 20px;
  font-size: 25px;
  line-height: 20px;
  color: #737373;
  text-overflow: ellipsis;
}

.card.hovercard .info .desc-role {
  font-size: 20px;
  line-height: 30px;
  margin-top: 40px;
  margin-bottom: 20px;
  color: #f9f9f9;
  text-overflow: ellipsis;
}
.card.hovercard .info .desc-friends span {
  margin-right: 20px;
}

.edit-icon {
  border: 1px solid #ff9601;
  width: 50px;
  height: 50px;
  background: #ff9601;
  border-radius: 21px;
  color: #fff;
  font-size: 3px;
  padding: 10px;
  float: right;
  margin: 5px;
}
.notification-icon {
  background: white;
}
.edit-btn {
  border: 1px solid;
  font-weight: bolder;
  border-radius: 20px;
  font-size: 20px;
  padding: 10px;
  color: #fff;
}
.usr-profile-image img {
  border-radius: 50%;
  width: auto;
  min-height: 135px;
  max-height: 135px;
  max-width: 100%;
}

.usr-profile-image {
  display: inline-block;
  width: 135px;
  position: relative;
  margin-bottom: 30px;
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

    div.text-right.mb-2.mr-3.edit-profile-links {
        position: relative;
        padding-right: 0px;
        margin-top: 20px;
    }
</style>
