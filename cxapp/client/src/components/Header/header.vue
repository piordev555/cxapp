<template>
  <div class="">
    <div class="header map justify-content-center d-flex">
      <div class="logo-sec">
        <img src="../../assets/Beeldmerk2.svg" />
      </div>
      <!-- <div class="header-right-sec">
        <i class="fas fa-comment notification-icon"></i>
        <sup :v-if="chatRequestCount > 0" class="badge badge-light">
          {{ chatRequestCount }}
        </sup>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      msg: 'SocialGPS'
    }
  }
}
</script>

<style scoped>
    .header.map {
        position: relative;
        padding: 8px;
        background-color: #252525;
        box-shadow: 10px 5px 45px 5px #000;
    }
.notification-icon {
  color: #fff;
  font-size: 20px;
}
.notification-count {
  font-size: 18px;
  width: 31px;
  height: 30px;
  color: #000;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid;
  align-content: center;
  font-weight: bold;
}
.logo-sec {
  width: 50%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.logo-sec img {
  width: 35px;
}
.header-right-sec {
  width: 50%;
  justify-content: right;
  align-items: flex-end;
  text-align: end;
}
</style>
