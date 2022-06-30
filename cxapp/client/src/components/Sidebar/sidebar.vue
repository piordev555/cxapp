<template>
  <SidebarMenu
    :collapsed="collapsed"
    :menu="menu"
    disableHover="{true}"
    width="200px"
    @item-click="onItemClick"
    @toggle-collapse="onToggleCollapse"
    style="z-index: 9999"
  />
</template>

<script>
import Vue from "vue";
import { SidebarMenu } from "vue-sidebar-menu";
import {
  getNotifications,
  updateNotifictions,
} from "../../services/NotificationService";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

export default Vue.extend({
  name: "App",
  components: {
    SidebarMenu,
  },
  data() {
    return {
      notificationsCount: 0,
      menu: [
        {
          href: "/profile",
          title: `User`,
          icon: "icon icon-Menu-Userprofile",
        },
        {
          href: "/stats",
          title: "Home",
          icon: "icon icon-Menu-Home",
        },
        {
          href: "/map",
          title: "Map",
          icon: "icon icon-Menu-Map",
        },
        {
          href: "/friends",
          title: `Friends`,
          icon: {
            text: '',
            class: 'icon icon-Menu-Friends',
            // element: span
          }

        },
        {
          href: "/projects",
          title: "Create",
          icon: "icon icon-Menu-Create",
        },
        {
          href: "/player",
          title: "Media Player",
          icon: "icon icon-Menu-Play",
        },
        {
          href: "/payment",
          title: "Market",
          icon: "icon icon-Menu-Market",
        },
        {
          href: "/wallet",
          title: "Wallet",
          icon: "icon icon-Menu-Wallet",
        },
        {
          title: "Settings",
          icon: "icon icon-Menu-Settings",
          child: [
            {
              title: "Statistics",
              href: "/statistics",
            },
            {
              title: "Logout",
            },
          ],
        },
      ],
      collapsed: true,
    };
  },
  methods: {
    onSidebarChanged() {},
    onItemClick(e, item, node) {
      if (item.title === "Logout") {
        this.$socket.emit("logout", localStorage.getItem('id'));
        localStorage.clear();
        this.$router.push("/login");
      }
      if (item.title.includes("Friends")) {
        this.updateNotifictionsRecord();
        this.getNotifications();
      }
    },
    updateNotifictionsRecord() {
      const id = localStorage.getItem("id");
      updateNotifictions({ id: id })
        .then((response) => {
          console.log("notification res", response.data);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
    onToggleCollapse() {
      this.collapsed = !this.collapsed;
    },
    getNotifications() {
      const id = localStorage.getItem("id");
      let data = { id: id };
      getNotifications(id)
        .then((response) => {
          let count;
          console.log("Notification_Response", response.data);
          if (response.data.friendRequestNotifications.length > 0)
            count = response.data.friendRequestNotifications.length;
          if (response.data.subscribeNotifications.length > 0)
            count = response.data.subscribeNotifications.length; 
            
          if(count > 0 ) this.notificationsCount = count 
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message, {
            timeout: 2000,
          });
        });
    },
  },
  watch: {
    notificationsCount() {
      if (this.notificationsCount > 0)
        this.menu[3].title = `Friends ${this.notificationsCount}`;
        this.menu[3].icon.text = this.notificationsCount;

    },
  },
  mounted() {
    this.getNotifications();
    // const node = document.getElementsByClassName('friend-count-badge')[0]
    // if(node) {
    //   node.innerHTML = 'avvv'
    // }
  },
});
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";
.v-sidebar-menu .vsm--toggle-btn {
  order: -1;
  text-align: left;
  padding: 15px;
  background: #252525;
  color: #f9f9f9;
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background: transparent;
}
.v-sidebar-menu .vsm--toggle-btn::after {
  content: "\f039";
}
.v-sidebar-menu .vsm--list {
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 100%;
}
.v-sidebar-menu .vsm--item:last-child {
  margin-top: auto;
}
.v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active,
.v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  -webkit-box-shadow: 3px 0px 0px 0px #ff9200 !important;
  box-shadow: 3px 0px 0px 0px inset #ff9200 !important;
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    from(rgb(255, 150, 0)),
    to(rgb(255, 82, 0))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: #ff7433;
}

.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  background-color: transparent;
}
.v-sidebar-menu .vsm--mobile-bg {
  display: none;
}
.cust-badge::after{
  background-color: #fff;
}

// .friend-count-badge::after {
//   background-color: red;
// }
// .friend-count-badge:first-child + :text {
//   margin-bottom: 10px;
//    background-color: red;
// }
.friend-count-badge:first-child::target-text {
  background-color: blue !important;
}


</style>
