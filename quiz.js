/**
 * Created by Justin on 6/23/2015.
 */

function Quiz(questions, quizName, sideTempElt, mainTempElt, sideDisp, mainDisp) {
    this.name = quizName;
    var score = 0;
    var finalized = false;
    var currentQuestion = 0;
    var sideTemplate = Handlebars.compile(sideTempElt);

    function nextQuestion() {

    }

    function prevQuestion() {

    }

    function submit() {

    }

    function isFilledOut() {

    }

    function display() {
        sideDisp.empty();
        var context = {nums: []};
        for (var i = 0, l = questions.length; i < l; i++) {
            context.nums.push({num: i + 1});
        }
        sideDisp.append(sideTemplate( context ));
        sideDisp.find('[data-num="'+currentQuestion+'"]').text("Hey");
        for (var i = 0, l = questions.length; i < l; i++) {
            $('.quiz-index-link').get(i).addEventListener('click', function() {
                var clickedNum = this.getAttribute('data-num');
                if ( currentQuestion!==clickedNum ) {
                    currentQuestion = this.getAttribute('data-num');
                    display();
                }
            }, true); //capture mode by setting true
        }

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
    var out = "<h4>Questions</h4><ul id='quiz-index-links' style='list-style-type:none'>";

    items.forEach(function(item) {
        out = out + "<li><div class='quiz-index-link' data-num='"+ (item.num-1)+"'>" + item.num + "</div></li>";
    });

    return out + "</ul>";
});

$(document).ready( function() {

    var quiz1 = new Quiz(   [{questionText: "age",choices: ["22","23"],correctAnswer: 0},
                            {questionText: "color",choices: ["red","blue"],correctAnswer: 0},],
                            'ageQuiz',
                            $('#sidebar-template').html(),
                            $('question-template').html(),
                            $('#question-sidebar'),
                            $('#question-display')
    );

    quiz1.beginQuiz();

});