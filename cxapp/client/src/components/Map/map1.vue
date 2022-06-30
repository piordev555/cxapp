<template>
  <div class="main-content">
    <div class="map-view">
      <!--img src="../../assets/map.jpg"-->

      <gmap-map
        :options="{
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          disableDefaultUi: false,
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
          :draggable="true"
          @click="openWindow(m)"
        >
          <gmap-info-window
            :options="{
              maxWidth: 300,
              pixelOffset: { width: 0, height: -35 },
            }"
            v-bind:position="getLatLong(user)"
            :opened="true"
            @closeclick="false"
          >
            <div class="user-tooltip">
              <div class="user-head">
                <router-link :to="'/user/' + user.id">
                  <img v-if="user.profile == ''" src="../../assets/users.svg" />
                  <img v-if="user.profile != ''" v-bind:src="user.profile" />
                </router-link>
                <div class="user-detail">
                  <div class="user-detail-txt">
                    <router-link :to="'/user/' + user.id">
                      <h3>{{ user.firstname }} {{ user.lastname }}</h3>
                    </router-link>
                    <p>{{ user.hobbies }}</p>
                  </div>
                  <div class="user-action-links">
                    <span
                      v-if="!user.friends"
                      v-on:click="addFriend(user.id)"
                      class="add-friend"
                      >Add Friend</span
                    >
                    <span
                      v-else
                      v-on:click="addFriend(user.id)"
                      class="unfriend"
                      >Friends</span
                    >
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
  </div>
</template>

<script>
import Menu from "./../../components/Menu/menu.vue";
import { getAllUsers } from "./../../services/UserService";
export default {
  name: "Maptest",
  components: {
    Menu,
  },
  data() {
    return {
      center: { lat: 45.508, lng: -73.587 },
      users: "",
      position: "",
    };
  },
  methods: {
    toggleExpand(item) {
      item.isActive = !item.isActive;
    },
    addFriend(user) {
      id.friends = !id.friends;
    },
    getAllUsers() {
      getAllUsers()
        .then((response) => {
          this.users = response.data;
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
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
    openWindow(m) {
      m.infoWindow.open = !m.infoWindow.open;
    },
  },
  mounted() {
    this.geolocate();
    this.getAllUsers();
  },
};
</script>

<style scoped>
</style>
