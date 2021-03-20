<template>
  <v-container>
    <v-card class="mx-auto my-12" max-width="1750">
      <div class="searchAnime">
        <div v-if="storage.length > 0">
          <span class="watchTime">
            {{ "[" + watchtimeSummierung + "]" }}
          </span>
        </div>

        <v-row class="d-flex justify-space-around mb-6">
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
          <!-- Button zum Hinzuügen von Serie -->
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

        <p>{{ answer }}</p>

        <div>
          <!--  Ergebnis der Suche wird angezeigt -->
          <div v-for="(value, i) in apiEingabe" v-bind:key="value.id">
            <!-- Diese Variante, um mit dem Index zu arbeiten -->
            <div class="test" v-if="i < 2" v-on:click="addtoTMP(value)">
              {{ i + 1 }}: Ergebnis: {{ value.name }}
            </div>
          </div>
        </div>

        <!-- Serie (Poster) wird hinzugefügt-->
        <div v-if="isHidden">
          <v-container>
            <v-row>
              <span v-for="(value, i) in storage" v-bind:key="value.id">
                <!-- Diese Variante, um mit dem Index zu arbeiten -->
                <v-col sm="5" offset-sm="5" md="3" offset-md="0">
                  <img v-bind:src="thumbnail + value.poster_path" />
                  <br />

                  <!-- LÖSCHEN-BUTTON, um Storage zu clearen -->
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
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import _ from "lodash";

//benutze vom Import
Vue.use(VueAxios, axios, _);

export default {
  name: "SearchAnime",
  data() {
    return {
      searchb: "",
      seasons: "", //Eingabefeld für die Searchbar
      apiEingabe: undefined,
      fromTimeWindow: "Suche nach einer Serie",
      answer: "Bitte mindestens 2 Buchstaben eingeben",
      isHidden: false,

      //  torage von Serien
      tmpMovieData: [],
      storage: [], // storage mit Daten von einzelnen Serien
      tmpStorage: undefined,
      thumbnail: "https://image.tmdb.org/t/p/w200/",

      //  Watchtime
      watchtimeSummierung: 0,
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
    watchtimeStorage(update) {
      localStorage.watchtimeStorage = JSON.stringify(update);
      this.watchtimeSummierung = 0;
      console.log("updated WATCHTIME STORAGE");
      for (var i = 0; i < this.watchtimeStorage.length; i++) {
        this.watchtimeSummierung =
          this.watchtimeSummierung + this.watchtimeStorage[i];
      }
      console.log("summierte Watchtime: " + this.watchtimeSummierung);
      this.watchtimeSummierung = this.timeConvert(this.watchtimeSummierung);
    },
    //        LOCAL STORAGE DER DATEN       //
    storage(update) {
      // console.log(this.tmpTime);

      console.log("updated");
      localStorage.storage = JSON.stringify(update);
    },
    //        SEARCH BAR        //
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
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500); // Delay für Searchbar
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
          //Einspeichern von Eingabe (searchbar)
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
          //  einspeichern von dem Eingegebenen (seasons)
          vm.seasons = response.data.number_of_seasons;
        })
        .catch(function(error) {
          vm.seasons = "Error! Could not reach the API. " + error;
        });
    },
    averageNumberOfEpisodes: function() {
      this.tmpMovieData =
        this.tmpMovieData.number_of_episodes /
        this.tmpMovieData.number_of_seasons;
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

      //  Pushe aktuelle Watchtime in WatchtimeStorage
      this.watchtimeStorage.push(this.tmpTime);

      console.log("timeStorage: " + this.watchtimeStorage);
      console.log("aktuelle Minuten: " + this.tmpTime);
      // ZURÜCKSETZEN der Variablen nach Hinzufügen
      this.tmpStorage = undefined;
      this.searchb = "";
      this.apiEingabe = undefined;
    },
    //  LÖSCHE POSTER (löscht item aus dem Storage) //
    loeschen: function(index) {
      this.$delete(this.watchtimeStorage, index);
      //console.log(this.watchtimeStorage);
      this.$delete(this.storage, index);
    },
  },
};
</script>
