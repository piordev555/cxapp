<template>
  <div class="bottom-menu">
    <div class="container">
        <div class="navbar">
            <ul>
                <li><router-link to="/profile"><i class="icon icon-Menu-Userprofile"></i></router-link></li>
                <li><router-link to="/stats"><i class="icon icon-Menu-Home"></i></router-link></li>
                <li><router-link to="/map"><i class="icon icon-Menu-Map"></i></router-link></li>
                <li><router-link to="/friends"><i class="icon icon-Menu-Friends"></i></router-link></li>
                <li><router-link to="/projects"><i class="icon icon-Menu-Create"></i></router-link></li>
                <li><router-link to="/player"><i class="icon icon-Menu-Play"></i></router-link></li>
                <li><router-link to="/payment"><i class="icon icon-Menu-Market"></i></router-link></li>
                <li><router-link to="/wallet"><i class="icon icon-Menu-Wallet"></i></router-link></li>
                <li><router-link to="/" @click.native="signout"><i class="icon fas fa-sign-out-alt"></i></router-link></li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { logout } from "./../../services/UserService";
import { getAllUsers, getRole } from "./../../services/UserService";
export default {
  name: "Menu",
  data() {
    return {
      msg: "SocialGPS",
    };
  },
  methods: {
    signout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>


</style>
