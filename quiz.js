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
        //checks if operation is valid and displays next question if so
        //return if next question was displayed, else false
        if (currentQuestion < questions.length - 1) {
            display(++currentQuestion);
            return true;
        }
        return false;

    }

    function prevQuestion() {
        //checks if operation is valid and displays previous question if so
        //return if previous question was displayed, else false
        if (currentQuestion > 0) {
            display(--currentQuestion);
            return true;
        }
        return false;

    }

    function submit() {
        //checks if quiz is filled out, finalizes, grades quiz, forgets DOM elements it uses

        //Ensure the quiz is completely filled out
        //use .some() here instead of .every() so we stop checking after the first
        //unanswered question is found.
        //NOOB QUESTION: Can this be shortened somehow because the function is so simple?
        if ( !questionStates().some(function(answered) {return !answered;}) ) {

            //finalize quiz
            finalized = true;

            //grade quiz
            questions.forEach( function(question) {
                if (question.isCorrect()) {
                    score++;
                }
            });

            //clear display objects and forget
            sideDisp.empty();
            mainDisp.empty();
            sideDisp = undefined;
            mainDisp = undefined;

        }
    }

    function questionStates() {
        //returns an array of booleans that are true if question at that index is answered
        var out = [];
        questions.forEach(function(question) {
            out.push(question.isAnswered());
        });
        return out;
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
        //todo
    };

    this.getFinalized = function() {
        //todo
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

    this.isAnswered = function() {
        if (this.userAnswer) {
            return true;
        }
        return false
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
    $('#templates').load('templates.html', function() {

    var quiz1 = new Quiz(   [{questionText: "age",choices: ["22","23"],correctAnswer: 0},
                            {questionText: "color",choices: ["red","blue"],correctAnswer: 0},
                            {questionText: "animal",choices: ["dog","cat"],correctAnswer: 0}],
                            'ageQuiz',
                            $('#sidebar-template').html(),
                            $('#question-template').html(),
                            $('#question-sidebar'),
                            $('#question-display')
    );
        quiz1.beginQuiz();

    });

});