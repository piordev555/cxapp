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
          disableDefaultUi: false
        }"
        :center="center"
        :zoom="8"
        style="width: 100%; height: 100vh">
        <gmap-marker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            :label="m.label"
            @click="openWindow(m)"

        />
      <gmap-info-window
        :options="{
          maxWidth: 300,
          pixelOffset: { width: 0, height: -35 }
        }"
        :position="infoWindow.position"
        :opened="infoWindow.open"
        @closeclick="infoWindow.open=false">
        <div class="user-tooltip"><div class="user-head">
                 <router-link to = "/user">
                 <img src="../../assets/users.svg">
                 </router-link>
              <div class="user-detail" v-html="infoWindow.template"></div>
            </div></div>
    </gmap-info-window>
    </gmap-map>
    <button @click='getAllUsers()' type="button" class="btn btn-warning">Get all Users</button>
    </div>
    </div>
</template>

<script>
import Menu from './../../components/Menu/menu.vue'
import { getAllUsers } from '../../services/UserService'
export default {
  name: 'Maptest',
  components: {
    Menu
  },
  data () {
    return {
      center: { lat: 45.508, lng: -73.587 },
      items: [
        {
        id: 1,
        title: 'john Smith',
        content: 'Dancer',
        isActive: true,
        away: '2 mi'
        },
        {
          id: 2,
          title: 'SPeter',
          content: 'Dancer',
          isActive: false,
          away: '5 mi'
        },
        {
          id: 3,
          title: 'Garry Louis',
          content: 'Dancer',
          isActive: false,
          away: '3 mi'
        }
      ],
      markers: [
          {
              label: "A",
              position: {lat: 30.913891, lng: 75.855986},
              title: 'SPeter',
              content: 'Dancer',
              isActive: false,
              away: '5 mi'
          },
          {
              label: "B",
              position: {lat: 30.539835, lng: 75.955184},
              title: 'john Smith',
              content: 'Dancer',
              isActive: true,
              away: '2 mi'
          }
      ],
        infoWindow: {
          position: {lat: 0, lng: 0},
          open: false,
          template: '',
          image:''
        }
    }
  },
  methods: {
    toggleExpand (item) {
      item.isActive = !item.isActive
    },
    getAllUsers () {
      getAllUsers().then(response => {
        console.log(response.data)
        this.items= response;
        console.log(this.items);
        this.numberOfUsers = this.users.length
      })
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
          console.log(this.center.lat);
          console.log(this.center.lng);
      });
    },
    openWindow(m) {
        // const { lat, lng, name, street, zip, city } = this.loadedDealers[index]
        // console.log(m.lat);
        this.infoWindow.position = m.position
        this.infoWindow.template = `
                <a href= "#/user"><h3>${m.title}</h3></a>
                <p>${m.content} (${m.away})</p>
               <div class="user-action-links">
                  <a href="#"><i class="fas fa-user-plus"></i> Add Friend</a>
                </div>`
        this.infoWindow.open = true
    }
  },
  mounted () {
    this.geolocate();
  }
}
</script>

<style scoped>

</style>
