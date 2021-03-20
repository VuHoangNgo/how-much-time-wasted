<template>
  <v-container>
    <v-card  class="mx-auto my-12" max-width="1750">
      <div class="searchAnime">
        <div v-if="storage.length > 0">
          <span class="watchTime">
            {{ "[" + watchtime + "]" }}
          </span>
        </div>

        <v-row class="d-flex justify-space-around mb-6">
          <!--v-spacer></v-spacer>-->
          <!-- Eingabefeld Suche -->
          <v-col sm="7" offset-sm="5" md="3" offset-md="0">
            <v-text-field
              v-model="searchb"
              :placeholder="fromTimeWindow"
            ></v-text-field>
          </v-col>
          <!-- Eingabefeld Season -->
          <v-col sm="5" offset-sm="5" md="1" offset-md="0">
            <v-text-field
              v-if="isHidden"
              v-model="seasons"
              placeholder="#"
            ></v-text-field>
          </v-col>
          <!-- Eingabefeld Button -->
          <v-col sm="5" offset-sm="3" md="1" offset-md="0">
            <v-btn
              outlined
              block
              class="primary"
              v-if="tmpStorage != undefined"
              v-on:click="hinzufuegen()"
              >-></v-btn
            >
          </v-col>
        </v-row>

        <!--cols="12" sm="4" md="1">-->

        <p>{{ answer }}</p>

        <div>
          <!-- v-if="isHidden"        Ergebnis wird angezeigt -->
          <div v-for="(value, i) in apiEingabe" v-bind:key="value.id">
            <!-- Diese Variante, um mit dem Index zu arbeiten -->
            <div class="test" v-if="i < 2" v-on:click="addtoTMP(value)">
              {{ i + 1 }}: Ergebnis: {{ value.name }}
            </div>
          </div>
        </div>

        <!-- Poster wird hinzugefügt-->
        <div v-if="isHidden">
          <v-container>
            <v-row>
              <span v-for="(value, i) in storage" v-bind:key="value.id">
                <!-- Diese Variante, um mit dem Index zu arbeiten -->
                <v-col sm="5" offset-sm="5" md="3" offset-md="0">
                  <img v-bind:src="thumbnail + value.poster_path" />
                  <br />
                  <!-- LÖSCHEN BUTTON, um Storage zu clearen -->

                  <v-btn outlined block class="primary" v-on:click="loeschen(i)"
                    >Löschen</v-btn
                  >
                </v-col>
              </span>
            </v-row>
          </v-container>
        </div>
      </div>
    </v-card>
  </v-container>
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
      searchb: "",
      seasons: "", //Eingabefeld
      apiEingabe: undefined, //undefinierte Eingabe, die für Daten gebraucht wird
      fromTimeWindow: "Suche nach einer Anime-Serie",
      answer: "Bitte mindestens 2 Buchstaben eingeben",

      tmpMovieData: [],
      storage: [], // storage mit Daten von einzelnen Serien
      thumbnail: "https://image.tmdb.org/t/p/w200/",

      tmpStorage: undefined,
      isHidden: false,

      //Watchtime
      watchtime: 0,
      tmpTime: null,
      watchtimeStorage: [],
    };
  },
  //       LOCAL STORAGE-AUFRUF     //
  mounted() {
    if (localStorage.storage) {
      this.isHidden = true;
      this.storage = JSON.parse(localStorage.storage);
    }
     if (localStorage.watchtimeStorage) {
      this.watchtimeStorage = JSON.parse(localStorage.watchtimeStorage);
    }
  },
  watch: {
    watchtimeStorage(update){ 
      localStorage.watchtimeStorage = JSON.stringify(update);
      this.watchtime = 0;
      console.log("updated WATCHTIME STORAGE");
      for(var i = 0;i<this.watchtimeStorage.length; i++){
        this.watchtime = this.watchtime + this.watchtimeStorage[i];
      }
      console.log("summierte Watchtime: " + this.watchtime);
      this.watchtime = this.timeConvert(this.watchtime);
      //localStorage.watchtime = JSON.stringify(this.watchtime);
    },
    //        LOCAL STORAGE        //
    storage(update) {
      // console.log(this.tmpTime);
      
      console.log("updated");
      localStorage.storage = JSON.stringify(update);
      
    },
    // Jedes mal, wenn eine neue Eingabe getätigt wird, wird Suche aktualisiert
    searchb: function() {
      //Länge des eingegebenen Strings wird überprüft
      if (this.searchb.length > 1) {
        this.answer = "";
        this.debouncedGetAnswer();
      } else {
        this.answer = "Bitte noch " + (2 - this.searchb.length) + " Zeichen";
      }
    },
  },
  created: function() {
    // Delay für Searchbar
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
  },
  methods: {
    getAnswer: function() {
      this.answer = "wird gesucht...";
      var vm = this;

      axios
        .get(
          "https://api.themoviedb.org/3/search/tv?api_key=c13a406bc701f0f32b79f3ec5f3b2675&language=en-US&page=1&query=" +
            this.searchb +
            "&include_adult=false"
        )
        .then(function(response) {
          //Einspeichern von dem Eingegebenen (question)
          vm.apiEingabe = response.data.results;
          console.log(response.data.results);
          vm.answer = "";
        })
        .catch(function(error) {
          vm.apiEingabe = "Error! Could not reach the API. " + error;
        });
    },
    addtoTMP: function(value) {
      this.searchb = value.name; //im Eingabefeld kommt das Ergebnis
      this.tmpStorage = value;
      //console.log(this.storage[0]+ " "+ this.storage[1]);
      this.isHidden = true;
      var vm = this;
      //console.log(this.tmpStorage.id);
      axios
        .get(
          "https://api.themoviedb.org/3/tv/" +
            this.tmpStorage.id +
            "?api_key=c13a406bc701f0f32b79f3ec5f3b2675&language=en-US"
        )
        .then(function(response) {
          //  Speicher komplette Daten um später zuzugreifen
          vm.tmpMovieData = response.data;
          //  einspeichern von dem Eingegebenen (question)
          vm.seasons = response.data.number_of_seasons;
        })
        .catch(function(error) {
          vm.seasons = "Error! Could not reach the API. " + error;
        });
    },
    averageNumberOfEpisodes: function() {
      this.tmpMovieData =
        this.tmpMovieData.number_of_episodes /
        this.tmpMovieData.number_of_seasons; //fehler
      return this.tmpMovieData;
    },
    timeConvert: function(n) {
      var num = n;
      var d = Math.floor(num / 1440); // 60*24
      var h = Math.floor((num - d * 1440) / 60);
      var m = Math.round(num % 60);

      if (d > 0) {
        return d + " day(s), " + h + " hours, " + m + " minutes";
      } else {
        return h + " hours, " + m + " minutes";
      }
    },
    hinzufuegen: function() {
      this.isHidden = true;
      this.storage.push(this.tmpStorage);
      this.tmpTime =
        this.tmpMovieData.episode_run_time[0] *
        this.averageNumberOfEpisodes() *
        this.seasons;
    
      this.watchtimeStorage.push(this.tmpTime);

      console.log("timeStorage: " + this.watchtimeStorage);
      console.log("aktuelle Minuten: " + this.tmpTime);
      // ZURÜCKSETZEN
      //this.tmpTime = null;
      this.tmpStorage = undefined;
      this.searchb = ""; //im Eingabefeld kommt das Ergebnis
      this.apiEingabe = undefined;
    },
    //  LÖSCHE POSTER (löscht item aus dem Storage)
    loeschen: function(index) {
      //this.watchtime = this.tmpTime - this.watchtimeDelete;
      this.$delete(this.watchtimeStorage, index);
      console.log(this.watchtimeStorage);
      //this.watchtime = this.timeConvert(this.watchtime);
      this.$delete(this.storage, index);
    },
  },
};
</script>
