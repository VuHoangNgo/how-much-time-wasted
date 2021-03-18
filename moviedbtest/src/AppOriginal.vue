<template>
  <div id="app">
    <SearchAnime />
    <!-- <AllMovieStorage /> -->
  </div>
</template>

<script>

import SearchAnime from './components/SearchAnime'
//import AllMovieStorage from './components/AllMovieStorage'

export default {
  name: 'AppOriginal',
  components: {
    SearchAnime,
    //AllMovieStorage
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
  margin-top: 60px;
}
</style>
