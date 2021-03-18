<template>
    <div>
         <div v-for="(value, i) in apiEingabe" v-bind:key="value.id"> <!-- Diese Variante, um mit dem Index zu arbeiten-->
          <div class="test" v-if="i<2" v-on:click="addtolist(value)">{{ i+1 }}: Ergebnis: {{value.name}}</div> 
        </div> 
    </div>
</template>

<style scoped>
.test{
  cursor:pointer
  }

</style>

<script>

//import { defineComponent } from '@vue/composition-api'
import Vue from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
import _ from 'lodash'

Vue.use(VueAxios,axios,_)             //binden

export default {
    name:"AllMovieStorage",
    data(){
        return {
           storage: []
        } 
    },
    addtolist: function(value) {
        this.storage.push(value.name);
        console.log(this.storage[0]+ " "+ this.storage[1]);
      }

}