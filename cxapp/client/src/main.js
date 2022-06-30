import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue } from "bootstrap-vue";
import VueRouter from "vue-router";
import * as VueGoogleMaps from "vue2-google-maps";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import router from "./router";
import httpCommon from "./http-common";
import vuetify from "./plugins/vuetify";
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';


Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(Toast, {
	transition: "Vue-Toastification__bounce",
	maxToasts: 20,
	newestOnTop: true,
	position: "top-right",
	hideProgressBar: true,
	closeButton: "button",
	icon: true,
	rtl: false,
});
Vue.use(VueGoogleMaps, {
	load: {
		key: "AIzaSyA1ycCaZ9Nv0Rf9mqH22zRw72RihY2moDg",
		libraries: "places",
	},
});
Vue.config.productionTip = false;

export const SocketInstance = socketio(process.env.VUE_APP_ROOT_API);

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketInstance,
}));

router.beforeEach((to, from, next) => {
	// redirect to login page if not logged in and trying to access a restricted page
	const publicPages = ["/", "/login", "/register", "/forgotpassword"];
	const authRequired = !publicPages.includes(to.path);
	const loggedIn = localStorage.getItem("token");
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (authRequired && !loggedIn) {
			next({ path: "/login" });
		} else {
			next();
		}
	} else {
		next();
	}

	if (to.matched.some((record) => record.meta.hideForAuth)) {
		if (loggedIn) {
			next({ path: "/map" });
		} else {
			next();
		}
	} else {
		next();
	}
});

new Vue({
	router,
	httpCommon,
	vuetify,
	render: (h) => h(App),
}).$mount("#app");
