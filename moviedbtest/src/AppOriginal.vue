<template>
  <div id="app">
    <v-app>
      <SearchAnime />
    </v-app>
  </div>
</template>

<script>
import SearchAnime from "./components/SearchAnime";

export default {
  name: "AppOriginal",
  components: {
    SearchAnime,
    //AllMovieStorage
  },
};
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
