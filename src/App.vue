<template>
  <div id="app">
    <FoodTruck msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import FoodTruck from './components/FoodTruck.vue'

export default {
  name: 'App',
  
  components: {
    FoodTruck
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
