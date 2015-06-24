/**
 * Created by Justin on 6/23/2015.
 */

/*global $:false */

function Quiz(questions, quizName, sideTempElt, mainTempElt, sideDisp, mainDisp) {
    /*
    Quiz objects do most of the work in this Dynamic quiz app. They are given display
    areas which they use to display their quiz and accept user input. The user
    uses the quiz with these inputs provided by the quiz. The quiz hides sensitive
    data from the user so they can't cheat.
     */
    'use strict';
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
        var context = {nums: [], current: currentQuestion};
        for (var i = 0, l = questions.length; i < l; i++) {
            context.nums.push({num: i + 1});
        }
        sideDisp.append(sideTemplate( context ));
        var buttons = $('.quiz-index-link');
        for (i = 0, l = questions.length; i < l; i++) {
            buttons.get(i).addEventListener('click', function() {
                var clickedNum = this.getAttribute('data-num');
                if ( currentQuestion!==clickedNum ) {
                    currentQuestion = +this.getAttribute('data-num');
                    display();
                }
            }, true); //capture mode by setting true so div with handler is captured rather than any sub elements
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

function Question(questionText, choices, correctAnswer) {
    /*
    The Question constructor mostly basic question data but it also holds
    the user's answer to the question and has a method to check if the
    user answered correctly.
     */
    'use strict';
    this.userAnswer = undefined;

    this.isCorrect = function() {
        return (this.userAnswer === correctAnswer);
    };
}

function User() {
    'use strict';
    /*
    Not happy about having to do client side user data storage, but since it was asked...

    User represents an identity that has low security by using a PIN to authenticate
    before many methods are usable. Also stores a list of quiz objects that hide data
    from the user so they have to take them legitimately.
     */
    var username;
    var PIN;
    var authenticated = true;
    this.quizzes = [];

    function setName(name) {
        username = name;
    }

    function setPin(n) {
        PIN = n;
    }

    function getName() {
        return username;
    }

    function authenticate(n) {
        if (n === PIN) {
            authenticated = true;
        }
    }
}

Handlebars.registerHelper('display-index', function(nums, current, options) {
    'use strict';
    var out = "<h4>Questions</h4><div id='quiz-index-links' class='btn-group btn-group-vertical text-center'>";
    nums.forEach(function(num) {
        var check = ( current === num.num-1 )? 'active':'';
        out = out + "<button type='radio' class='btn quiz-index-link "+check+"' data-num='"+ (num.num-1)+"'>" + num.num + "</button>";
    });

    return out + "</div>";
});

$(document).ready( function() {
    'use strict';
    var quiz1 = new Quiz(   [{questionText: "age",choices: ["22","23"],correctAnswer: 0},
                            {questionText: "color",choices: ["red","blue"],correctAnswer: 0},
                            {questionText: "animal",choices: ["dog","cat"],correctAnswer: 0}],
                            'ageQuiz',
                            $('#sidebar-template').html(),
                            $('question-template').html(),
                            $('#question-sidebar'),
                            $('#question-display')
    );

    quiz1.beginQuiz();

});