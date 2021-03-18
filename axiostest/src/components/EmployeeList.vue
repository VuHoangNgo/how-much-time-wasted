<template>
    <div>
        <h1>Employee List</h1>
        <table>
            <tr>
                <td>Name</td>
                <td>Salary</td>
                <td>Age</td>
            </tr>
             <tr v-for="item in list" v-bind:key="item.id">
                <td>{{item.employee_name}}</td>
                <td>{{item.employee_salary}}</td>
                <td>{{item.employee_age}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
//import { defineComponent } from '@vue/composition-api'
import Vue from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios)

export default {
    name:"EmployeeList",
    data(){
        return {list:undefined} //undefinierte Liste, die für Daten gebraucht wird
    },
    mounted()
    {
        axios.get('http://dummy.restapiexample.com/api/v1/employees')
        .then((response)=>{
            this.list=response.data.data; //bestimmte Liste wird mit der Api angesprochen und zugewiesen
            console.warn(response.data.data)
        })
    }
}
</script>

