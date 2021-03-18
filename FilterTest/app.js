var watchExampleVM = new Vue({
    el: '#watch-example',
    data: {
      question: '',
      apiErgebnis: undefined,
      answer: 'I cannot give you an answer until you ask a question!'
    },
    watch: {
      // whenever question changes, this function will run
      question: function (newQuestion, oldQuestion) {   //beiden parameter sind überflüssig
        this.answer = 'Waiting for you to stop typing...'
        this.debouncedGetAnswer()
      }
    },
    created: function () {
      // _.debounce is a function provided by lodash to limit how
      // often a particularly expensive operation can be run.
      // In this case, we want to limit how often we access
      // yesno.wtf/api, waiting until the user has completely
      // finished typing before making the ajax request. To learn
      // more about the _.debounce function (and its cousin
      // _.throttle), visit: https://lodash.com/docs#debounce
      this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)         // für Searchbar
    },
    methods: {
      getAnswer: function () {
       
        this.answer = 'Thinking...'
        var vm = this
        axios.get('https://api.themoviedb.org/3/search/tv?api_key=c13a406bc701f0f32b79f3ec5f3b2675&language=en-US&page=1&query=' + 
        this.question + 
        '&include_adult=false')
          .then(function (response) {
            vm.apiErgebnis = response.data.results; //einspeichern von dem Eingegebenen (question)
            console.log(response.data.results);
           // vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.apiErgebnis = 'Error! Could not reach the API. ' + error
          })
      }
    }
  })