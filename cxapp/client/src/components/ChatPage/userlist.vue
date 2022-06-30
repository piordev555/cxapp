<template>
  <div class="container">
    <h2>User List</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>User Id</th>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Email</th>
          <th>Is online?</th>
          <th>Chat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.id" style="cursor: pointer">
          <td>{{ item.id }}</td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.email }}</td>
          <td
            v-bind:class="[
              onlineIds.includes(item.id) ? 'logged-in' : 'logged-out',
            ]"
          >
            ●
          </td>
          <td>
            <router-link v-bind:to="'/chat/' + item.id">Chat</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <router-view></router-view>
  </div>
</template>
<style scoped>
.logged-in {
  color: green;
}

.logged-out {
  color: red;
}
</style>
<script>
import { getAllUsers } from "../../services/UserService";

export default {
  name: "UserList",
  data: function () {
    return { users: [], onlineIds: [] };
  },
  methods: {
    getAllUsers() {
      getAllUsers().then((response) => {
        console.log(response);
        this.users = response.data;
        this.numberOfUsers = this.users.length;
      });
    },

    openchatbox: function (id) {
      alert("Hello!");
      console.log(id);
    },
  },
  mounted() {
    this.selfId = localStorage.getItem("id");
    this.getAllUsers();
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
      console.log(this.onlineIds);
    },
  },
};
</script>