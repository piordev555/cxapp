<template>
  <v-sheet
    height="400"
    class="overflow-hidden"
  >
    <div class="fill-height d-flex justify-content-end">
        <v-btn
          dark
          @click.stop="drawer = !drawer"
          class="toggle-btn mt-2 p-0 mr-2"
        >
        <span><img src="../../assets/toggles.svg"/></span>
        </v-btn>
    </div>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
      bottom
    >
      <div class="row">
      <div class="col-md-12">
        <div class="v_input-wrap">
          <div class="v_input-inner full-category">
            <v-app class="category-wrap">
            <div class="switch"
                v-for="(role, i) in role_arr"
                :key="i">
                <span :class="role.css_class">{{ role.name }}</span>
                <v-switch
                  v-for="(role, i) in role.data"
                  :key="i"
                  :input-value="selectedRoles.includes(role.name) ? role.name : ''"
                  @change="change($event, role.name)"
                >
                  <template v-slot:label>
                    <span :class="role.css_class">{{ role.name }}</span>
                  </template>
                </v-switch>
              </div>
            </v-app>
          </div>
        </div>
      </div>
    </div>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script>
import { getRole } from "./../../services/UserService";
export default {
  name: "Category",
  data() {
    return {
      selectedRoles: null,
      drawer: null,
      toggle: true,
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard' },
          { title: 'About', icon: 'mdi-forum' },
        ],
      center: { lat: 45.508, lng: -73.587 },
     role_arr: [
        { name: "Users", css_class: "user_input",
         data: [
           { name: "Viewer/Listener/User", css_class: "viewer_input" }
          ]},
        { name: "Entertainers", css_class: "entertainers_input",
        data: [ { name: "Actor/Filmmaker", css_class: "action_input" },
          { name: "Affiliate", css_class: "affiliate_input" },
          { name: "Athlete", css_class: "athlete_input" },
          { name: "Blogger / Vlogger", css_class: "blogger_input" },
          { name: "Comedian", css_class: "comedian_input" },
          { name: "Dancer", css_class: "dancer_input" },
          { name: "Emcee", css_class: "emcee_input" },
          { name: "Gamer", css_class: "gamer_input" },
          { name: "Musician", css_class: "musician_input" },
          { name: "Painter / Crafting", css_class: "painter_input" },
          { name: "Theater performer", css_class: "theater_input" },
          { name: "Writer / Poet", css_class: "writer_input" },
          { name: "Beatmaker", css_class: "writer_input" },
          { name: "Cameraoperator", css_class: "writer_input" },
          { name: "Designer", css_class: "writer_input" },
          { name: "DJ", css_class: "writer_input" },
          { name: "Mix engineer", css_class: "writer_input" },
          { name: "Music composer", css_class: "writer_input" },
          { name: "Music producer", css_class: "writer_input" },
          { name: "Performance art", css_class: "writer_input" },
          { name: "Petshow", css_class: "writer_input" },
          { name: "Photographer", css_class: "writer_input" },
          { name: "Podcaster", css_class: "writer_input" },
          { name: "Singer", css_class: "writer_input" },]},
         { name: "Events", css_class: "events_input",
             data:[{ name: "Dance Event", css_class: "writer_input" },
             { name: "DJ Event", css_class: "writer_input" },
             { name: "Game Event", css_class: "writer_input" },
             { name: "Music Event", css_class: "writer_input" },
             { name: "Petshow Event", css_class: "writer_input" },
             { name: "Photography Event", css_class: "writer_input" },
             { name: "Podcast Event", css_class: "writer_input" },
             { name: "Sports Event", css_class: "writer_input" },
             { name: "Theatre Event", css_class: "writer_input" },]},
       
        { name: "Locations", css_class: "location_input", 
          data:[{ name: "Music Venue Location", css_class: "writer_input"},
          { name: "Recording Studio Location", css_class: "writer_input"},
          { name: "House Location", css_class: "writer_input"},
          { name: "Theatre Location", css_class: "writer_input"},
          { name: "Miscellaneous Location", css_class: "writer_input"},
          { name: "Rehearsal Location", css_class: "writer_input"}]},
        
        { name: "Stores", css_class: "stores_input", 
          data: [{ name: "Music Store", css_class: "writer_input"},
          { name: "Record Store", css_class: "writer_input"}]},
      ]
    };
  },
  watch: {
      group () {
        this.drawer = false
      },
  },
  methods: {
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    change(event, name) {
      const temp = this.selectedRoles;
      if(event) {
        const index = temp.findIndex((item) => item === name )
        if(index > -1)
          temp.slice(index,1)
        else 
          temp.push(name)
      } else {
          const index = temp.findIndex((item) => item === name )
        if(index > -1) {
          temp.splice(index,1)
        }
      }
      sessionStorage.setItem('selectedRoles', JSON.stringify(temp))
      this.getAllUsers(name, event);
    },
    getAllUsers(role_name, event) {
      const id = localStorage.getItem("id");
      const hobbies = [];
      hobbies.push(role_name);
      const data = {
        lat: this.center.lat,
        lng: this.center.lng,
        hobbies: hobbies,
      };
      getRole(data)
        .then((response) => {
          if (Object.keys(response.data).length) {
            const users = response.data;
            const lists = users.filter((x) => {
              return x.id != id;
            });
            this.users = lists;
            console.log("hobbies", hobbies[0]);
            let hobby = hobbies[0];
            if (hobby) {
            }
            hobbies.forEach((y) => {
              if (y == "Viewer/Listener/User") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/users.svg";
                  x.name = "Viewer/Listener/User";
                });
              }
              if (y == "Actor/Filmmaker") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Filmmaker.svg";
                  x.name = "Actor/Filmmaker";
                });
              }
              if (y == "Affiliate") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Affiliate.svg";
                  x.name = "Affiliate";
                });
              }
              if (y == "Athlete") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Athlete.svg";
                  x.name = "Athlete";
                });
              }
              if (y == "Blogger / Vlogger") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Blogger.svg";
                  x.name = "Blogger / Vlogger";
                });
              }
              if (y == "Comedian") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Actor.svg";
                  x.name = "Comedian";
                });
              }
              if (y == "Dancer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Dancer.svg";
                  x.name = "Dancer";
                });
              }
              if (y == "Emcee") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Singer.svg";
                  x.name = "Emcee";
                });
              }
              if (y == "Gamer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Gamer.svg";
                  x.name = "Gamer";
                });
              }
              if (y == "Musician") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Musician.svg";
                  x.name = "Musician";
                });
              }
              if (y == "Painter / Crafting") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Arts&Crafts.svg";
                  x.name = "Painter / Crafting";
                });
              }
              if (y == "Theater performer") {
                this.users.forEach((x) => {
                  x.img = "Events/Theatre.svg";
                  x.name = "Theater performer";
                });
              }
              if (y == "Writer / Poet") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Writer.svg";
                  x.name = "Writer / Poet";
                });
              }
              if (y == "Beatmaker") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Beatmaker.svg";
                  x.name = "Beatmaker";
                });
              }
              if (y == "Cameraoperator") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Cameraoperator.svg";
                  x.name = "Cameraoperator";
                });
              }
              if (y == "Designer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Designer.svg";
                  x.name = "Designer";
                });
              }
              if (y == "DJ") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Dj.svg";
                  x.name = "DJ";
                });
              }
              if (y == "Mixengineer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Mixengineer.svg";
                  x.name = "Mixengineer";
                });
              }
              if (y == "Musiccomposer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Musiccomposer.svg";
                  x.name = "Musiccomposer";
                });
              }
              if (y == "Musicproducer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Musicproducer.svg";
                  x.name = "Musicproducer";
                });
              }
              if (y == "Performanceart") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Performanceart.svg";
                  x.name = "Performanceart";
                });
              }
              if (y == "Petshow") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Petshow.svg";
                  x.name = "Petshow";
                });
              }
              if (y == "Photographer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Photographer.svg";
                  x.name = "Photographer";
                });
              }
              if (y == "Podcaster") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Podcaster.svg";
                  x.name = "Podcaster";
                });
              }
              if (y == "Singer") {
                this.users.forEach((x) => {
                  x.img = "Entertainers/Singer.svg";
                  x.name = "Singer";
                });
              }
              if (y == "Dance Event") {
                this.users.forEach((x) => {
                  x.img = "Dance.svg";
                  x.name = "Dance Event";
                });
              }
               if (y == "DJ Event") {
                this.users.forEach((x) => {
                  x.img = "Dj.svg";
                  x.name = "Dj Event";
                });
              }
              if (y == "Game Event") {
                this.users.forEach((x) => {
                  x.img = "Game.svg";
                  x.name = "Game Event";
                });
              }
              if (y == "Music Event") {
                this.users.forEach((x) => {
                  x.img = "Music.svg";
                  x.name = "Music Event";
                });
              }
              if (y == "Petshow Event") {
                this.users.forEach((x) => {
                  x.img = "Petshow.svg";
                  x.name = "Petshow Event";
                });
              }
              if (y == "Photography Event") {
                this.users.forEach((x) => {
                  x.img = "Photography.svg";
                  x.name = "Photography Event";
                });
              }
              if (y == "Podcast Event") {
                this.users.forEach((x) => {
                  x.img = "Podcast.svg";
                  x.name = "Podcast Event";
                });
              }
              if (y == "Sports Event") {
                this.users.forEach((x) => {
                  x.img = "Sports.svg";
                  x.name = "Sports Event";
                });
              }
               if (y == "Theatre Event") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Theatre Event";
                });
              }
               if (y == "Music Venue Location") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Music Venue Location";
                });
              }
               if (y == "Recording Studio Location") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Recording Studio Location";
                });
              }
               if (y == "House Location") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "House Location";
                });
              }
               if (y == "Theatre Location") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Theatre Location";
                });
              }
               if (y == "Miscellaneous Location") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Miscellaneous Location";
                });
              }
              if (y == "Rehearsal Location") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Rehearsal Location";
                });
              }
              if (y == "Music Store") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Music Store";
                });
              }
              if (y == "Record Store") {
                this.users.forEach((x) => {
                  x.img = "Theatre.svg";
                  x.name = "Record Store";
                });
              }
              
            });

            console.log("Icon", this.users);
            let obj = {
              users_role: this.users,
              switch_value: event,
            };
            this.$emit("categoryValue", obj);
          } else {
            if (event === true) {
              this.$toast.error("No user found with your interests!", {
                timeout: 2000,
              });
            }
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
    console.log("cate");
    this.selectedRoles = JSON.parse(sessionStorage.getItem('selectedRoles')) || []
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 20% !important;
  top: 60px !important;
  height: 92vh !important;

}
/* .category-sheet {
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  background: transparent !important;
} */
.v-navigation-drawer--bottom.v-navigation-drawer--is-mobile {
  max-height: 80% !important;
  top: auto !important;
}
@media (min-width: 767px) {
  .map-view {
    position: fixed !important;
    width: 78% !important;
    height: 100% !important;
    overflow: hidden !important;
    right: 0 !important;
}
  .v_input-inner {
      height: auto;
  }
  .category-wrap .v-application--wrap {
    margin-right: 0 !important;
  }
  .v-input.theme--light.v-input--selection-controls.v-input--switch {
      width: 100%;
      height: 40px;
  }
}
.toggle-btn {

   border: 2px solid #a5a5a5;
  }
  .switch {
    width: 100%;
  }

</style>
