<template>
  <div class="main-content container-fluid">
    <div class="row mt-0">
      <div class="col-lg-9 p-0">
        <ChatWindow
          v-if="partnerId"
          v-bind:partnerId="partnerId"
          @onCloseChat="closeChatAction"
          v-bind:selectedUser="selectedUser"
        />
      </div>
      <div class="col-lg-3">
        <div class="container-fluid">
          <div
            class="row friend-request-section"
            v-if="friendRequestData.length"
          >
              <div
                class="row"
                v-for="item in friendRequestData"
                :key="item._id"
              >
                  <div class="col-4 mt-3 username">
                    {{ item.firstname }} {{ item.lastname }}
                  </div>
                  <div class="col-8 p-2 d-flex friends-btn">
                    <button
                      class="mr-2 btn"
                      @click="updateStatus(item, 'Accepted')"
                    >
                      Accept
                    </button>
                    <button class="btn" @click="updateStatus(item, 'Rejected')">
                      Reject
                    </button>
                  </div>
                  <hr />
                </div>
          </div>
            
          </div>
          <div class="search-box p-2">
            <input
              placeholder="Search in friends..."
              v-model="searchInput"
              name="search"
              id="search"
              class="form-control mt-3 mb-2"
              type="text"
              v-on:input="onSearch"
            />
          </div>
          <div class="container-fluid mt-2 friends-data-section">
            <div v-if="!friendsLoading && friendsData.length">
              <div
                class="row d-flex mb-1 justify-content-between"
                v-for="item in searchFriendData"
                :key="item._id"
              >
              <div class="col-9 d-flex">
                 <router-link :to="'/user/' + item.username">
                  <img
                  alt="Profile pic"
                  class="friend-profile"
                  :src="
                    item.profile
                      ? item.profile
                      : require('../../assets/users.svg')
                  "
                />
              </router-link>
              <div>
                 <p class="mt-2 username mb-3 ml-2 text-left">
                  {{ item.firstname }} {{ item.lastname }}
                </p>
                 <p v-if="item.role && item.role.length > 0" class="desc-role float-left d-flex mt-2">
                  <span v-for="r in item.role" :key="r" class="">
                    {{ r }}
                  </span>
                </p>
              </div>
              </div>
              <div class="col-3">
                 <div class="d-flex float-right">
                  <button
                    class="mr-2 btn message-btn"
                    @click="setSelectedUser(item)"
                  >
                    Message
                  </button>
                </div>
              </div>
<!-- 
              <router-link :to="'/user/' + item.friendId">
                  <img
                  alt="Profile pic"
                  class="friend-profile"
                  :src="
                    item.profile
                      ? item.profile
                      : require('../../assets/users.svg')
                  "
                />
              </router-link>
              <router-link :to="'/user/' + item.friendId">
                  <div class="col-5 pl-2 mt-2 text-left">
                  <p class="mt-1 username mb-3">
                  {{ item.firstname }} {{ item.lastname }}
                </p>
                <p v-if="item.role && item.role.length > 0" class="desc-role">
                  <span v-for="r in item.role" :key="r" class="">
                    {{ r }}
                  </span>
                </p>
                  </div>
              </router-link>
              <div class="col-5">
                  <div class="d-flex">
                  <button
                    class="mr-2 btn message-btn"
                    @click="setSelectedUser(item)"
                  >
                    Message
                  </button>
                </div>
              </div> -->
                <hr />
              </div>
            </div>
            <div v-else-if="friendsLoading">
              <h3 style="color:#fff">Loading...</h3>
            </div>
            <div v-else>
              <h3 style="color:#fff">No friends found...</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import {
  getUserFriendReq,
  updateFriendReqStatus,
  getUserFriend,
} from "../../services/FriendService";
import ChatWindow from "../ChatPage/chatwindow.vue";
import { updateNotifictions } from "../../services/NotificationService";
export default {
  name: "Friends",
  components: { ChatWindow },
  data() {
    return {
      friendRequestData: [],
      friendsLoading: false,
      friendsData: [],
      searchFriendData: [],
      partnerId: "",
      selectedUser: {},
      searchInput: "",
    };
  },
  methods: {
    onSearch(e) {
      let temp = [];
      const { value } = e.target;
      if (value) {
        this.friendsData.forEach((fr) => {
          if (
            fr.firstname.toLowerCase().includes(value.toLowerCase()) ||
            fr.lastname.toLowerCase().includes(value.toLowerCase())
          ) {
            temp.push(fr);
          }
        });
        this.searchFriendData = temp;
      } else if (!value) {
        this.searchFriendData = this.friendsData;
      }
    },
    setSelectedUser(item) {
      this.selectedUser = item;
      this.partnerId = item.friendId;
    },
    getUserFriendReq() {
      const id = localStorage.getItem("id");
      getUserFriendReq({ id: id })
        .then((response) => {
          console.log("Friend Request DAta==", response.data);
          if (response.data.length) {
            this.friendRequestData = response.data;
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
    getCurrentUserFriends() {
      const id = localStorage.getItem("id");
      this.friendsLoading = true
      getUserFriend(id)
        .then((response) => {
          console.log(" My Friend DAta==", response.data);
          if (response.data.length) {
            this.friendsData = response.data;
            this.searchFriendData = response.data;
            this.partnerId = response.data[0].friendId;
            this.selectedUser = response.data[0];
            this.friendsLoading = false;
          } else {
              this.friendsLoading = false;
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
    updateStatus(item, status) {
      const id = localStorage.getItem("id");
      updateFriendReqStatus({ ...item, friend_req_status: status })
        .then((response) => {
          if (response.data && Object.keys(response.data).length) {
            this.friendRequestData = this.friendRequestData.filter(
              (f) => f._id !== response.data.id
            );
            // this.getUserFriendReq();
            this.getCurrentUserFriends();
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
  },
  mounted() {
    this.getUserFriendReq();
    this.getCurrentUserFriends();
  },
};
</script>
<style scoped>
.friend-request-section {
  color: #fff;
  overflow-y: scroll;
  overflow-x:hidden;
  height: calc(100vh - 70vh);
  background-color: #2d2d2d;
}
.friend-request-section button {
  border: 1px solid #fff;
  border-radius: 5px;
  color: #fff;
  padding: 0px 20px 0px 20px;
  font-weight: bold;
}
.friend-request-section .username {
  font-weight: bold;
}

.friends-data-section .username {
  font-weight: bolder;
  color: #fff;
  font-size: 15px;
}
.friends-data-section button {
  border: 1px solid #fff;
  border-radius: 20px;
  color: #fff;
  padding: 0px 20px 0px 20px;
  font-weight: bold;
}
.friends-data-section .row {
  background-color: #595959;
}
.friends-data-section p {
  line-height: 0;
  color: #fff;
}

.friends-data-section .friend-profile {
  height: 50px;
  width: 50px;
  border-radius: 50px;
}
.friends-data-section .desc-role span {
  color: #fff;
  margin-bottom: 10px;
  padding: 5px;
  font-size: 10px;
}
.friends-btn {
  height: 45px;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  text-align: center;
}
.search-box input {
  /* background-color: #292929; */
  background-color: transparent;

  border: 0.5px solid darkgray;
  font-size: 12px;
  border-radius: 30px;
}
.search-box::after {
    content: "\f002";
    font-family: FontAwesome;
    margin-left: -25px;
    margin-right: 25px;
}
</style>
