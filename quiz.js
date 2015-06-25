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
    var mainTemplate = Handlebars.compile(mainTempElt);

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

        //This could be more efficient, only called on new quiz
        sideDisp.empty();
        //This needs to change almost every call to display though
        mainDisp.empty();

        //prepare the context for the index
        var context = {nums: [], current: currentQuestion};
        for (var i = 0, l = questions.length; i < l; i++) {
            context.nums.push({num: i + 1});
        }
        //add index to the sidebar
        sideDisp.append(sideTemplate( context ));

        //add handlers to the index
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

        //prepare the context for question display
        var questionContext = { questionText: questions[currentQuestion].questionText,
                                choices: questions[currentQuestion].choices,
                                userAnswer: questions[currentQuestion].userAnswer
        };
        console.log(questionContext);
        //add question to the question display
        mainDisp.append(mainTemplate(questionContext));
    }

    this.beginQuiz = function() {
        display();
    };

    this.getScore = function() {
        return score;
    };

    this.getFinalized = function() {
        return finalized;
    };

}

function Question(questionText, choices, correctAnswer) {
    /*
    The Question constructor mostly basic question data but it also holds
    the user's answer to the question and has a method to check if the
    user answered correctly.
     */
    'use strict';
    this.userAnswer = -1;

    this.isCorrect = function() {
        return (this.userAnswer === correctAnswer);
    };

    this.isAnswered = function() {
        return this.userAnswer !== -1;
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
        var check = ( current === num.num-1 )? 'active':'';//This will make the button 'active' if it's the current question
        out = out + "<button type='radio' class='btn quiz-index-link "+check+"' data-num='"+ (num.num-1)+"'>" + num.num + "</button>";
    });

    return out + "</div>";
});

Handlebars.registerHelper('display-choices', function(choices, savedSelection, options) {
    'use strict';
    var out = "<div id='choices' class='btn-group btn-group-vertical text-center'>";
    for (var i = 0, l = choices.length; i < l; i++) {
        var isActive = (i === savedSelection)?' active':'';//This will make the button 'active' if it's the saved choice
        out = out + "<button type='radio' class='btn'"+isActive+" data-choice-num='"+ i +"'>" + choices[i] + "</button>";
    }
    return out;
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