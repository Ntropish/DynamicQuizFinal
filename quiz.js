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
        var context = {num: questions.length, current: currentQuestion, answered: questionStates()};
        /*
        for (var i = 0, l = questions.length; i < l; i++) {
            context.nums.push({num: i + 1});
        }*/
        //add index to the sidebar
        sideDisp.append(sideTemplate( context ));

        //add handlers to the index
        var buttons = $('.quiz-index-link');
        for (var i = 0, l = questions.length; i < l; i++) {
            buttons.get(i).addEventListener('click', function() {
                var clickedNum = this.getAttribute('data-num');
                if ( currentQuestion!==clickedNum ) {
                    currentQuestion = +this.getAttribute('data-num');
                    display();
                }
            }, true); //capture mode by setting true so button with handler is captured rather than any sub elements
        }

        //prepare the context for question display
        var questionContext = { questionText: questions[currentQuestion].questionText,
                                choices: questions[currentQuestion].choices,
                                userAnswer: questions[currentQuestion].userAnswer,
                                prevText: 'Previous',
                                nextText: currentQuestion+1 < questions.length ? 'Next':'Submit',
                                prevEnabled: currentQuestion > 0,
                                nextEnabled: true
        };
        //add question to the question display
        mainDisp.append(mainTemplate(questionContext));

        //add handlers to choices
        var choices = $('.choice');
        choices.each(function( index ) {
            this.addEventListener('click', function() {
                if (questions[currentQuestion].userAnswer !== index) {
                    questions[currentQuestion].userAnswer = index;
                    display();
                }
            }, true);

        });
        $('#next-button').on('click', function() {
            if (currentQuestion === questions.length - 1) {
                submit();
            }
            nextQuestion();
        });
        $('#prev-button').on('click', function() {
            prevQuestion();
        });
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
    this.questionText = questionText;
    this.choices = choices;
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
        if (authenticated) {
            username = name;
        }
    }

    function setPin(n) {
        if (authenticated) {
            PIN = n;
        }
    }

    function getName() {
        return username;
    }

    function authenticate(n) {
        if (n === PIN) {
            authenticated = true;
            return true;
        }
        return false;
    }
}

function findUserInUserList(name, userList) {
    'use strict';
    userList.forEach( function(user) {
        if (user.getName() === name) {
            return user;
        }
        return undefined;
    });
}

function getUser(username, pin) {
    'use strict';

    //try to get userList
    var userList = localStorage.getItem('userList');

    //There are no users if it doesn't exist, so we can return now
    if (!userList) {
        return false;
    }

    //otherwise look for it and return it if the pin is right
    var user = findUserInUserList(username, userList);
    if (user && user.authenticate(pin)) {
        return user;
    }
    return false;
}

function addUser(username, pin) {
    'use strict';

    //Get the userList from local storage and make it if it doesn't exist
    var userList = localStorage.getItem('userList');
    if (! userList) {
        userList = [];
    }
    //if the user can't be found it is okay to make it
    if (! findUserInUserList()) {
        var newUser = new User();
        newUser.setName(username);
        newUser.setPin(pin);
        userList.push(newUser);
    }
    localStorage.setItem('userList', userList);

}

Handlebars.registerHelper('display-index', function(num, current, answered, options) {
    'use strict';
    var out = "<h4>Questions</h4><div id='quiz-index-links' class='btn-group btn-group-vertical text-center'>";
    for (var i = 0; i < num; i++) {
        var isCurrentClass = ( current === i )? 'active':'';
        var isCompleteClass = ( answered[i]? ' btn-success':'' );
        out = out + "<button type='radio' class='btn quiz-index-link "+isCurrentClass+isCompleteClass+"' data-num='"+ i +"'>" + (+i+1) + "</button>";
    }
    /*
    nums.forEach(function(num) {
        var isCurrentClass = ( current === num.num-1 )? 'active':'';
        var isCompleteClass = (answered)
        out = out + "<button type='radio' class='btn quiz-index-link "+isCurrentClass+"' data-num='"+ (num.num-1)+"'>" + num.num + "</button>";

    });
*/
    return out + "</div>";
});

Handlebars.registerHelper('display-choices', function(choices, savedSelection, options) {
    'use strict';
    var out = "<div id='choices' class='btn-group btn-group-vertical text-center'>";
    for (var i = 0, l = choices.length; i < l; i++) {
        var isActive = (i === savedSelection)?' active':'';//This will make the button 'active' if it's the saved choice
        out = out + "<button type='radio' class='btn choice"+isActive+"' data-choice-num='"+ i +"'>" + choices[i] + "</button>";
    }
    return out + "</div>";
});

Handlebars.registerHelper('nav-buttons', function(prevText, nextText, prevIsEnabled, nextIsEnabled) {
    'use strict';
    //returns previous and next button markups, with disabled class if needed and given text
    return "<button type='button' id='prev-button' class='btn nav-button" + (prevIsEnabled?'':' disabled') + "'>"+
        prevText + "</button>" +
        "<button type='button' id='next-button' class='btn nav-button" + (nextIsEnabled?'':' disabled') + "'>"+
        nextText + "</button>";
});

$(document).ready( function() {
    'use strict';
    $('#templates').load('templates.html', function() {


    var questions = [   new Question("What is your age?", ["22","23"], 0),
                        new Question("What is your favorite color?", ["Red","Blue"], 0),
                        new Question("What is your favorite animal?", ["Dog","Cat"], 0)];
    var quiz1 = new Quiz(   questions,
                            'ageQuiz',
                            $('#sidebar-template').html(),
                            $('#question-template').html(),
                            $('#question-sidebar'),
                            $('#question-display')
    );
        quiz1.beginQuiz();

    });

});