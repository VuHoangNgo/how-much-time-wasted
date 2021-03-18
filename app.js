
// Define a new component called todo-item
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{todo.text}}</li>'

})

var app = new Vue({
  el: '#app',
  data: {
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ]
  }
})

//______________________________

// Define a new component called button-counter
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

new Vue({ 
  el: '#components-test' 
})