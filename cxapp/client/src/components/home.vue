<template>
    <div class="main-content">
        <div class="landing-screen">
            <div class="landing-box">
                <img src="../assets/logo.svg">
                <div class="home-btns">
                    <div class="mb-4">
                        <router-link to="/login"><input type="submit" value="Sign In" class="btn btn-primary" /></router-link>
                    </div>
                    <div class="login-signup whitetext">Don't have an account? <router-link to="/register"><br />Register Now</router-link></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return { }
  }
}
</script>

<style scoped>

</style>
