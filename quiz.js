/**
 * Created by Justin on 6/23/2015.
 */

function Quiz(questions, quizName, sideDisp, mainDisp) {
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

    function display() {

        var sideTemplate = Handlebars.compile(sideDisp);
        var context = {nums: []};
        for (var i = 0, l = questions.length; i < l; i++) {
            context.nums.push({num: i + 1});
        }
        $('#sidebar').append(sideTemplate( context ));
    }

    this.beginQuiz = function() {
        display();
    };

    this.getScore = function() {

    };

    this.getFinalized = function() {

    };

}

Handlebars.registerHelper('display-index', function(items, options) {
    var out = "<h4>Questions</h4><ul style='list-style-type:none'>";

    items.forEach(function(item) {
        out = out + "<li>" + item.num + "</li>";
    });

    return out + "</ul>";
});

$(document).ready( function() {

    var quiz1 = new Quiz(   [{questionText: "age",choices: "22,23",correctAnswer: 0}, ],
                            'ageQuiz',
                            $('#sidebar-template').html(),
                            $('question-template').html()
    );

    quiz1.beginQuiz();

});