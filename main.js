/*
PLAN
Outcome: Trivia Game that generates one true or false question at 
at a time, player receives score when they answer question correct

- asking player for their name
- Take the userame and place into begin game/welcome message
- instructions on playing game

- Create generate question button
- onClick will generate fetch request that takes question from trivia 
and hides the generate question button
- display question
- create two buttons; "true", and "false"
- onClick of "true' or "false" starts a check whether annswer is correct or not,
and unhides generate question button

- If answer is correct add one to the score, and message will appear saying 
player is correct and give instructions to press generate question

- If answer is incorrect add nothing to the score, and message will appear sayong
player is incorrect annd give instructions to press generate question

- Keep track of score

- Create reset button, for player who wants to start from the beginning

- Keep track of previous questions

- Format HTML & CSS to make game look polished

- Optiona; bonus
  - eliminate duplicate questions from previous question list
  - difficulty levels
   
*/

// Get username
let answer;
let username;
let questionList = [];
const trueButton = document.querySelector("#AnswerTrue");
const falseButton = document.querySelector("#AnswerFalse");
const errorMessage = document.querySelector("#ErrorMessage");
const easyLevel = "https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean";
const mediumLevel = "https://opentdb.com/api.php?amount=1&difficulty=medium&type=boolean";
const hardLevel = "https://opentdb.com/api.php?amount=1&difficulty=hard&type=boolean";
const questionHistory = document.getElementById("PreviousQuestions");
let score = {
  wins: 0,
  losses: 0,
};

let winPercentage;
let gameOver = document.querySelector("#gameover")
gameOver.style.visibility = "hidden";
document.getElementById("ResetGame").style.visibility = "hidden"

const newQuestionButton = document.getElementById("GenerateQuestion");
newQuestionButton.addEventListener("click", getQuestion);

document.getElementById("correctResult").innerText = score.wins;
document.getElementById("incorrectResult").innerText = score.losses;

const nameInput = document.getElementById("name-input");

nameInput.addEventListener("change", getUserName);


function getUserName() {
  username = nameInput.value;
  document.getElementById("Welcome").innerText = `Welcome, ${username}!`;
  document.getElementById("PlayerName").remove();
  document.getElementById("Instructions").innerHTML =
    "To play the game, selected a difficulty level then click on Get New Question and answer True or False using the buttons below. You can also view your score. <br>If at any time you would like to start again, press reset at the bottom of the page.";
};



// New Trivia Question
async function getQuestion() {
  if (typeof username !== 'undefined'){ 
    //show the True and False buttons when a new  question is generated, hude the Get New Question button to prevent skipping
    trueButton.removeAttribute('disabled');
    falseButton.removeAttribute('disabled');
    trueButton.style.backgroundColor = "white";
    falseButton.style.backgroundColor = "white";
    document.querySelector("#options").style.visibility = "hidden";
    let selectedDifficulty = document.getElementById("difficulty").value
    if (selectedDifficulty === "easy"){difficulty = easyLevel; console.log(difficulty);} else if (selectedDifficulty === "medium"){difficulty = mediumLevel; console.log(difficulty);} else if (selectedDifficulty === "hard"){difficulty = hardLevel; console.log(difficulty);}
    const response = await fetch(difficulty);
    const data = await response.json();
    let currentQuestion = data.results[0].question;
    answer = data.results[0].correct_answer;
    // using innerHTML here eliminated the encoding issue for special characters
    document.getElementById("Question").innerHTML = currentQuestion;
    document.querySelector("#GameResult").innerText = null;
    makeQuestionList(document.getElementById("Question").innerText);} else {errorMessage.innerText = "Please enter a username to play."
  };
};

// checks if question already exists in the question list array before deciding whether or not to add it to the array

function makeQuestionList(question){
  if (typeof questionList.find((e) => (e) === question) === 'undefined'){
  questionList.push(question);
  let str = "";
  questionList.forEach(function(eachQuestion){ str += "<li>" + eachQuestion + "</li>";}); 
  questionHistory.innerHTML = str;
  };
};

trueButton.addEventListener("click", pressTrueButton);
falseButton.addEventListener("click", pressFalseButton);


// added commentary depending on how many wins/losses
function commentary(){
  winPercentage = score.wins/(score.wins + score.losses);
  if (winPercentage < 0.5) {
  document.querySelector("#Commentary").innerText = `${username}, your general knowledge isn't really your strong suit it seems!`;
  } else if (winPercentage > 0.75){
  document.querySelector("#Commentary").innerText = `You're doing great, ${username} keep it up!`;
  } else if (winPercentage => 0.5 && winPercentage < 0.75) {
  document.querySelector("#Commentary").innerText = `Not bad, ${username}... but not great either!`;
  } else if (winPercentag === 1 && score.wins > 10) {`You're on fire, ${username}!`}
};

function pressTrueButton() {
  if (typeof username !== 'undefined'){
  //disable True and False buttons when an answer is selected, show the Get New Question button. Change colour of selected button
  trueButton.disabled = "true";
  falseButton.disabled = "true";
  trueButton.style.backgroundColor = "hotpink";
  document.querySelector("#options").style.visibility = "visible";
  let playerAnswer = "True";
  if (playerAnswer === answer) {
      document.querySelector("#GameResult").innerText =
      "You are correct! Have one point.";
      score.wins++;
      document.getElementById("correctResult").innerText = score.wins;
       commentary();
  } else {
        document.querySelector("#GameResult").innerText =
      "Wrong! Computer says no point for you.";
      score.losses++;
      document.getElementById("incorrectResult").innerText = score.losses;
      commentary();
  }
} else {errorMessage.innerText = "Please enter a username to play."};
};

function pressFalseButton() {
  if (typeof username !== 'undefined'){
  //disable True and False buttons when an answer is selected, show the Get New Question button. Change colour of selected button
  trueButton.disabled = "true";
  falseButton.disabled = "true";
  falseButton.style.backgroundColor = "hotpink";
  document.querySelector("#options").style.visibility = "visible";
  let playerAnswer = "False";
  if (playerAnswer === answer) {
        document.querySelector("#GameResult").innerText =
      "You are correct! Have one point";
      score.wins++;
      document.getElementById("correctResult").innerText = score.wins;
      commentary();
  } else {
        document.querySelector("#GameResult").innerText =
      "Computer says no point for you";
      score.losses++;
      document.getElementById("incorrectResult").innerText = score.losses;
      commentary();
  }
} else {errorMessage.innerText = "Please enter a username to play."};
};


// reset functionality
document.getElementById("ResetGame").addEventListener("click", resetGame);

function resetGame() {
  window.location.reload();
}

// end game functionality
document.getElementById("EndGame").addEventListener("click", endGame);

function endGame() {
  document.getElementById("ResetGame").style.visibility = "visible";
  document.querySelector("#mainGame").remove();
  document.querySelector("#EndGame").remove();
  document.querySelector("#Welcome").remove();
  let finalScore = 100 * (score.wins/(score.wins + score.losses));
  gameOver.innerHTML = `<br>You scored ${Math.round(finalScore)}%!`;
  gameOver.style.visibility = "visible";
  questionHistory.remove();
}


// Changes made 27/11 - Hannah

// Added functionality to check if each question exists on the list already before deciding to add to the list at the bottom (used array to store the list)

// Added a winPercentage variable to keep track of % of wins, and make commentary below the score

// Required username to be chosen before any button works

// Changed from .innerText to .innerHTML to solve the issue with special characters not encoding correctly when pulled from API

// Added difficulty levels by setting variables for each API link, then inserting them according to drop down menu choice by user

// Changed true/false buttons to disable and change colour when clicked rather than disappear entirely.

// Added end game functionality with display of final scrollBehavior: 

// Added some CSS 