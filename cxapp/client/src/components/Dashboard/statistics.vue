<template>
  <div class="container">
   <h1 class="mb-2 mt-2">Statistics</h1>
   <br/>
   <div v-if="loader" class="text-center align-item-center">
      <img src="../../assets/Preloader.gif" height="150px" width="200px" />
   </div>
   <div v-else class="row">
     <div class="col-4">
      <b-card bg-variant="primary" text-variant="white" header="Registered Accounts" class="text-center mb-5">
        <b-card-text> {{data.registeredAccountsCount}}</b-card-text>
      </b-card>
      <b-card bg-variant="secondary" text-variant="white" header="Friends Connection" class="text-center mb-5">
        <b-card-text>{{data.totalFriendsConnection}}</b-card-text>
      </b-card>

      <b-card bg-variant="success" text-variant="white" header="Subscriber Connection" class="text-center mb-5">
        <b-card-text>{{data.totalSubscribers}}</b-card-text>
      </b-card>
      <b-card bg-variant="info" text-variant="white" header="Total Connection" class="text-center mb-5">
        <b-card-text> {{data.totalFriendsConnection + data.totalSubscribers}}</b-card-text>
      </b-card>
     </div>
      <div class="col-4">
         <b-card bg-variant="warning" text-variant="white" header="Full entertainers list" class="mb-5">
         <b-card-text v-for="x in data.rolesCount" v-bind:key="x._id">
           <li>{{x._id}}: {{x.count}}</li>
         </b-card-text>
      </b-card>
     </div>
    </div>
  </div>
</template>

<script>
import { getStatisticsData } from "../../services/StatisticsService";
export default {
  name: 'Header',
  data () {
    return {
     data: [],
     loader: false,
    }
  },
  methods: {
    getData() {
      this.loader = true;
      getStatisticsData()
        .then((response) => {
          if (response.data) {
            this.loader = false
            this.data = response.data;
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
    this.getData()
  }
}
</script>

<style scoped>
   
</style>
