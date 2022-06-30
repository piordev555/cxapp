import Vue from "vue";
import VueRouter from "vue-router";
import home from "@/components/home.vue";
import Friends from "@/components/Content/friends.vue";
import Login from "@/components/Login/login.vue";
import Register from "@/components/Register/register.vue";
import User from "@/components/User/user.vue";
import Map from "@/components/Map/map.vue";
import Maptest from "@/components/Maptest/maptest.vue";
import ForgotPassword from "@/components/Account/ForgotPassword/forgotpassword.vue";
import Profile from "@/components/Account/Profile/profile.vue";
import EditProfile from "@/components/Account/Profile/editprofile.vue";
import ResetPassword from "@/components/Account/ResetPassword/resetpassword.vue";
import AcceptReject from "@/components/Account/Profile/acceptreject.vue";
import Stats from "@/components/Home/stats.vue";
import Payment from "@/components/Content/payment.vue";
import Player from "@/components/Content/player.vue";
import Projects from "@/components/Content/projects.vue";
import Wallet from "@/components/Content/wallet.vue";
import Statistics from "@/components/Dashboard/statistics.vue";
Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: home,
      meta: {
        hideForAuth: true,
        sidebar: false,
      },
    },
    {
      path: "/login/:id",
      name: "Login",
      component: Login,
      meta: {
        hideForAuth: true,
        sidebar: false,
      },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        hideForAuth: true,
        sidebar: false,
      },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: {
        hideForAuth: true,
        sidebar: false,
      },
    },
    {
      path: "/forgotpassword",
      name: "ForgotPassword",
      component: ForgotPassword,
      meta: {
        sidebar: false,
      },
    },
    {
      path: "/resetpassword/:email",
      name: "ResetPassword",
      component: ResetPassword,
      meta: {
        sidebar: false,
      },
    },
    {
      path: "/map",
      name: "Map",
      component: Map,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/statistics",
      name: "Statistics",
      component: Statistics,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/user/:id",
      name: "User",
      component: User,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/accept/reject/:user_id/:request_id",
      name: "AcceptReject",
      component: AcceptReject,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/editprofile",
      name: "EditProfile",
      component: EditProfile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/maptest",
      name: "Maptest",
      component: Maptest,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/stats",
      name: "Stats",
      component: Stats,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/friends",
      name: "Friends",
      component: Friends,
      meta: {
        rerequiresAuth: true,
      },
    },
    {
      path: "/projects",
      name: "Projects",
      component: Projects,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/player",
      name: "Player",
      component: Player,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/payment",
      name: "Payment",
      component: Payment,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/wallet",
      name: "Wallet",
      component: Wallet,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});
