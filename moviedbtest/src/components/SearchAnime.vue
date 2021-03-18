<template>
  <div>
    <p>
      <input v-model="question" :placeholder="fromTimeWindow" />
      <input v-if="isHidden" v-model="seasons" placeholder="#" />
      <button v-if="tmpStorage != undefined " v-on:click="knopf()">-></button>
    </p>
    <p>{{ answer }}</p>

    <div>
      <!-- v-if="isHidden"        Ergebnis wird angezeigt -->
      <div v-for="(value, i) in apiEingabe" v-bind:key="value.id">
        <!-- Diese Variante, um mit dem Index zu arbeiten -->
        <div class="test" v-if="i < 2" v-on:click="addtolist(value)">
          {{ i + 1 }}: Ergebnis: {{ value.name }}
        </div>
      </div>
    </div>

    <!-- Poster wird hinzugefügt-->
    <div v-if="isHidden">
      <span v-for="value in storage" v-bind:key="value.id">
        <!-- Diese Variante, um mit dem Index zu arbeiten -->
        <img v-bind:src="thumbnail + value.poster_path" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.test {
  cursor: pointer;
}
</style>
<script>
//import { defineComponent } from '@vue/composition-api'
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import _ from "lodash";

Vue.use(VueAxios, axios, _); //binden

export default {
  name: "SearchAnime",
  data() {
    return {
      question: "",
      seasons: "", //Eingabefeld
      apiEingabe: undefined, //undefinierte Eingabe, die für Daten gebraucht wird
      answer: "Bitte mindestens 2 Buchstaben eingeben",
      storage: [], // vorübergehendes Storage
      thumbnail: "https://image.tmdb.org/t/p/w200/",
      tmpStorage: undefined,
      isHidden: false,
      fromTimeWindow: "Suche nach einer Anime-Serie",
    };
  },
  watch: {
    // whenever question changes, this function will run
    question: function() {
      if (this.question.length > 1) {
        //länge des eingegebenen Strings
        this.answer = "";
        this.debouncedGetAnswer();
      } else {
        this.answer = "Bitte noch " + (2 - this.question.length) + " Zeichen";
      }

      /* console.log(this.question);
      this.answer = "Waiting for you to stop typing...";
      //this.debouncedGetAnswer()                         
      this.getAnswer();
      this.getAnswer = _.debounce(this.getAnswer, 500)  */
    },
  },
  created: function() {
    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // yesno.wtf/api, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500); // für Searchbar
  },
  methods: {
    getAnswer: function() {
      this.answer = "wird gesucht...";
      var vm = this;

      axios
        .get(
          "https://api.themoviedb.org/3/search/tv?api_key=c13a406bc701f0f32b79f3ec5f3b2675&language=en-US&page=1&query=" +
            this.question +
            "&include_adult=false"
        )
        .then(function(response) {
          vm.apiEingabe = response.data.results; //einspeichern von dem Eingegebenen (question)
          console.log(response.data.results);
          //console.log("Soviele Seasons: " + response.data.seasons.length); //--> GET/tv/{tv_id}
          vm.answer = "";
          // vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function(error) {
          vm.apiEingabe = "Error! Could not reach the API. " + error;
        });
    },

    //<img :src="path + '/images/services/'+ picture" class="img-circle" alt="Services" /> </div>
    addtolist: function(value) {
      this.question = value.name; //im Eingabefeld kommt das Ergebnis
      this.tmpStorage = value;
      //console.log(this.storage[0]+ " "+ this.storage[1]);
      this.isHidden = true;

      var vn = this;
    
       axios
        .get(
          "https://api.themoviedb.org/3/tv/" +
            this.tmpStorage.id +
            "?api_key=c13a406bc701f0f32b79f3ec5f3b2675&language=en-US"
        )
        .then(function(response) {
          vn.seasons = response.data.seasons.length; //einspeichern von dem Eingegebenen (question)
          console.log("Soviele Seasons: " + response.data.seasons.length); //--> GET/tv/{tv_id}
          //vm.answer = "";
          // vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function(error) {
          vn.seasons = "Error! Could not reach the API. " + error;
        })
    },
    knopf: function() {
      this.isHidden = true;
      this.storage.push(this.tmpStorage);

      // ZURÜCKSETZEN
      this.tmpStorage = undefined;
      this.question = ""; //im Eingabefeld kommt das Ergebnis
      this.apiEingabe = undefined;
    },
  },
};
</script>
