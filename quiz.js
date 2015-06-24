/**
 * Created by Justin on 6/23/2015.
 */

function Quiz(questions, quizName, content) {
    this.name = quizName;
    var score = 0;
    var finalized = false;
    var currentQuestion = 0;

    function nextQuestion() {

    }

    function prevQuestion() {

    }

    function submit() {

    }

    function isFilledOut() {

    }

    function start() {

    }

    function getScore() {

    }

    function getFinalized() {

    }

}

Handlebars.registerHelper('display-index', function(items, options) {
    var out = "<h4>Questions</h4><ul style='list-style-type:none'>";

    items.forEach(function(item) {
        out = out + "<li>" + options.fn(item) + "</li>";

    });

    return out + "</ul>";
});

$(document).ready( function() {
    var side = $('#sidebar-template').html();
    var sideTemp = Handlebars.compile(side);
    $('#sidebar').html(sideTemp( {sidebar:"Sidebar!!!", questions: [{num: "1"},{num: 2}] } ));


    //var quiz1 = new Quiz(["age", "22,23", 0], ageQuiz, $('#content'));

});