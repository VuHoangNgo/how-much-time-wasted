<template>
  <v-container :style="bimage" class="my-container">
    <div class="searchAnime">
      <v-row class="watchtimeText justify-center ">
        <v-col class="col-8 col-sm-8 ">
          <div v-if="storage.length > 0">
            <span class="watchTime">
              {{ watchtimeSummierung }}
            </span>
          </div>
        </v-col>
      </v-row>

      <v-row id="searchRow" class="justify-end">
        <v-col id="searchCol" class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <!-- Eingabefeld Search -->
          <v-text-field
            flat
            solo
            class="search-input"
            v-model="searchb"
            :placeholder="fromTimeWindow"
          ></v-text-field>
        </v-col>

        <v-col class="col-2 col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
          <!-- Eingabefeld Season -->
          <v-text-field
            flat
            solo
            class="search-input"
            v-if="isHidden"
            v-model="seasons"
            placeholder="#"
          ></v-text-field>
        </v-col>

        <v-col
          class="text-left col-3 col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-1"
        >
          <!-- Button zum Hinzufügen von Serie -->
          <v-btn
            small
            fab
            depressed
            class="white black--text"
            v-if="tmpStorage != undefined"
            v-on:click="hinzufuegen()"
          >
            <v-icon id="icon-conf" size="34">play_circle_outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="text--secondary text-left answer-field">
        <v-col>
          <p>{{ answer }}</p>
        </v-col>
      </v-row>

      <v-row class="justify-center my-row">
        <v-col class="my-col">
          
            <!--  Ergebnis der Suche wird angezeigt -->
            <div v-for="(value, i) in apiEingabe" v-bind:key="value.id">
              <!-- Diese Variante, um mit dem Index zu arbeiten -->
              <div class="test" v-if="i < 2" v-on:click="addtoTMP(value)">
                {{ i + 1 }}: Ergebnis: {{ value.name }}
              </div>
            </div>
         
        </v-col>
      </v-row>

      <v-row v-if="isHidden" class="justify-center">
        <!-- Serie (Poster) wird hinzugefügt-->
        <!-- Diese Variante, um mit dem Index zu arbeiten -->
        <v-col
          class="col-auto"
          v-for="(value, i) in storage"
          v-bind:key="value.id"
        >
          <v-card max-width="165px" flat justify-center>
            <v-img height="250px" v-bind:src="thumbnail + value.poster_path" />

            <!-- LÖSCHEN-BUTTON, um Storage zu clearen -->

            <v-card-actions>
              <v-btn
                md4
                outlined
                block
                class="primary"
                v-on:click="loeschen(i)"
              >
                Löschen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
body {
  margin-top:20px;
}
.watchtimeText {
  font-size: 3em;
}
.answer-field {
  padding-left: 88px;
  font-size: 1.0em;
}
.search-input {
  height: 40px;
  font-size: 1.8em;
  
}

.test {
  cursor: pointer;
}

.my-container {

}

.my-row {
  border: 3px solid red;
}

#searchCol {
  border-right: 1px solid rgba(0, 0, 0, 0.5);
}
#icon-conf {
  padding-left: 19px;
  padding-top: 5.5px;
}
#searchRow {
  padding-top: 40px;
  height: 100px;
}

.my-col {
  border: 1px solid blue;
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
      //  Background Image
      bimage: { backgroundImage: ""},
      bimageTmp: "https://image.tmdb.org/t/p/w342",
      
      searchb: "",
      seasons: "", //Eingabefeld für die Searchbar
      apiEingabe: undefined,
      fromTimeWindow: "Suche nach einer Serie",
      answer: "Bitte mindestens 2 Buchstaben eingeben",
      isHidden: false,

      //  Storage von Serien
      tmpMovieData: [],
      storage: [], // storage mit Daten von einzelnen Serien
      tmpStorage: undefined,
      thumbnail: "https://image.tmdb.org/t/p/w342",

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
        this.answer =
          "Bitte noch " + (2 - this.searchb.length) + " Zeichen eingeben";
      }
    },
   /* bimage: function(){
      //this.bimage = this.thumbnail+ this.tmpStorage.poster_path; 
      console.log("Background wurde geupdated");
    }*/
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
        return d + " day(s), " + h + " hours, " + m + " min";
      } else {
        return h + " hours, " + m + " min";
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
      this.bimage = this.bimageTmp + this.tmpStorage.poster_path; //Hintergrundbild funktioniert noch nicht
     
      console.log("Pfad meines Backgrounds: " + this.bimage);
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
