import { details } from "../data/details.js";

const equationContainer = document.querySelector('.js-equation-container')

function symbolCoefficient() {
  const coefficientSymbol = Math.random()
  let answerCoefficient;
  if (coefficientSymbol <= 0.5) {
    answerCoefficient = '+';
  } else if (coefficientSymbol > 0.5) {
    answerCoefficient = '-';
  }

  if (answerCoefficient === '+') {
    answerCoefficient = ''
  }
  return answerCoefficient;

}

function generateQuestion() {
  let coefficient = Math.floor(Math.random() * 10)
  const constant = Math.floor(Math.random() * 10)
  const equatorNumber = Math.floor(Math.random() * 10)
  const symbolDecider = Math.random()
  let equationSymbol = '';

  if (symbolDecider <= 0.5) {
    equationSymbol = '+'
  } else if (symbolDecider > 0.5) {
    equationSymbol = '-'
  }

  if (coefficient === 0) {
    coefficient = Math.floor(Math.random() * 10)
  }
  const equation = `${coefficient}x ${equationSymbol} ${constant} = ${equatorNumber}`
  equationContainer.innerHTML = equation
  solveQuestion(coefficient, constant, equatorNumber, equationSymbol)
}

function solveQuestion(coefficient, constant, equatorNumber, equationSymbol) {
  let answer = 0 
  if (equationSymbol === '+') {
    answer = (equatorNumber - constant) / coefficient
  } else if (equationSymbol === '-') {
    answer = (equatorNumber + constant) / coefficient
  }
  let apprAnswer = 0;

  if ((answer % 2) === 0 || (answer % 3) === 0 || (answer % 5) === 0 || (answer % 7) === 0) {
    apprAnswer = answer
  } else if (answer === 0 || answer === 1) {
    apprAnswer = answer
  } else {
    apprAnswer = answer.toFixed(2)
  }
  generateAnswerOptions(apprAnswer.toString())
}

let correctCount = 0;
let wrongCount = 0

function generateAnswerOptions(apprAnswer) {

  const buttonNumber = Math.random()
  let buttonClass;
  if (buttonNumber <= 0.25) {
    buttonClass = 1;
  } else if (buttonNumber > 0.25 && buttonNumber <= 0.5) {
    buttonClass = 2;
  } else if (buttonNumber > 0.5 && buttonNumber <= 0.75) {
    buttonClass = 3;
  } else if (buttonNumber > 0.75) {
    buttonClass = 4;
  }

  const options = `
  <button class="button-1 option option-button"></button>
  <button class="button-2 option option-button"></button>
  <button class="button-3 option option-button"></button>
  <button class="button-4 option option-button"></button>
  `

  document.querySelector('.js-options-container')
  .innerHTML = options

  const optionsButton = document.querySelectorAll('.option')

  optionsButton.forEach((option) => {
    let falseAnswers = Math.floor(Math.random() * 10) || (Math.random() * 10) || Math.random()

    if (falseAnswers.toString() === apprAnswer) {
      falseAnswers = Math.floor(Math.random() * 10) || (Math.random() * 10) || Math.random()
    }
    let wrongOptions;

    if (falseAnswers % 2 === 0 || falseAnswers % 3 === 0 || falseAnswers % 5 === 0 || falseAnswers % 7 === 0) {
      wrongOptions = falseAnswers
    } else if (falseAnswers === 0 || falseAnswers === 1) {
      wrongOptions = falseAnswers
    } else {
      wrongOptions = falseAnswers.toFixed(2)
    }

    option.innerHTML = `${symbolCoefficient()}${wrongOptions}`
  })
  const answerButton = document.querySelector(`.button-${buttonClass}`)
  answerButton.innerHTML = apprAnswer

  optionsButton.forEach((eachOption) => {
    eachOption.addEventListener('click', () => {
      const resultContainer = document.querySelector('.js-result-checker')
      if (eachOption.innerHTML === apprAnswer) {
        resultContainer.classList.add('correct-answer')
        resultContainer.innerHTML = "Correct!";
        correctCount++
        document.querySelector('.js-score-count').innerHTML = `Correct: ${correctCount}<br>Wrong: ${wrongCount}`;
      } else if (eachOption.innerHTML !== apprAnswer) {
        resultContainer.classList.add('wrong-answer')
        resultContainer.innerHTML = "WRONG!";
        wrongCount++
        document.querySelector('.js-score-count').innerHTML = `Correct: ${correctCount}<br>Wrong: ${wrongCount}`;
      }

      setTimeout(() => {
        if (resultContainer.classList.contains('wrong-answer')) {
          resultContainer.classList.remove('wrong-answer')
        } else if (resultContainer.classList.contains('correct-answer')) {
          resultContainer.classList.remove('correct-answer')
        }
        resultContainer.innerHTML = "";
      }, 1500);

      let totalScore = correctCount + wrongCount
      localStorage.setItem('amount', JSON.stringify(totalScore))
      console.log(totalScore)

      let percentage = ((correctCount / totalScore) * 100).toFixed(1)

      finalScore(percentage)
      generateQuestion()
      
    })
  })
}

function finalScore(percentage) {
  const finalResultContainer = document.querySelector('.js-result-decider')
  finalResultContainer.innerHTML = `You scored <span class="js-percentage-score">${percentage}%</span>`
  let percentageScore = document.querySelector('.js-percentage-score')
  if (percentage > 60) {
    percentageScore.classList.add('pass-score')
  } else {
    percentageScore.classList.add('fail-score')
  }

  localStorage.setItem('score', JSON.stringify(percentage))
  return;
}

function Timer() {
  let count = 45
  const time = document.querySelector('.js-timer')
  const finalResultContainer = document.querySelector('.js-result-decider')
  
  document.querySelector('.js-timer').innerHTML = `Time: ${count}s`
  const timer = setInterval(() => {
    count--
    time.innerHTML = `Time: ${count}s`
    if (count === 0) {

      clearInterval(timer)

      document.querySelector('.js-timer').innerHTML = 'Time is up!'
      document.querySelector('.js-equation-container').innerHTML = "";
      document.querySelector('.js-options-container').innerHTML = "";
      finalResultContainer.classList.add('render-result')
      document.querySelector('.js-leaderboard').innerHTML = 'View leaderboard'

      const name = JSON.parse(localStorage.getItem('name'))
      const percentage = Number(JSON.parse(localStorage.getItem('score')))
      const totalScore = Number(JSON.parse(localStorage.getItem('amount')))
      const determinant = percentage + totalScore

      details.push({
        name: `${name}`,
        score: percentage,
        amount: totalScore,
        decider: determinant
      })

      localStorage.setItem('details', JSON.stringify(details))
      
      setTimeout(() => {
        document.querySelector('.js-leaderboard').innerHTML = 'View leaderboard'
        document.querySelector('.js-timer').innerHTML = ''
        finalResultContainer.innerHTML = ''

        correctCount = 0
        wrongCount = 0
        startingPage()
      }, 5000)
    }
    if (count === 15) {
      document.querySelector('.js-timer').classList.add('low-timer')
      let milliseconds = 60
      const milliTimer = setInterval(() => {
        milliseconds--
        document.querySelector('.js-timer').innerHTML = `Time: ${count}: ${milliseconds}`
        if (milliseconds === 0) {
          milliseconds = 60
        }

        if (count === 0) {
          document.querySelector('.js-timer').innerHTML = 'Time is up!'
          clearInterval(milliTimer)
        }
      }, Math.fround(1000 / 60))
    }
  }, 1000)
}

function startingPage() {
  document.querySelector('.js-score-count').innerHTML = 'Hi, you have 45 seconds to answer an infinite amount of questions.<br>How many can you answer within this time period?<br>By the way, there is a leaderboard you can check by the end of the game.'
  document.querySelector('.js-button-container').innerHTML = '<button class="js-generate-button start-button">Start</button>'

  const generateButton = document.querySelector('.js-generate-button')
  generateButton.addEventListener('click', () => {
    getInfo()
  
    generateQuestion()
    document.querySelector('.js-score-count').innerHTML = `Correct: ${correctCount}<br>Wrong: ${wrongCount}`
  
    generateButton.remove()
    Timer()
  })  
}

const nameInput = document.querySelector('.js-name-input')
function getInfo() {
  if (nameInput === '') {
    document.querySelector('.js-name-warning').innerHTML = 'Please input a name or nickname'
    startingPage()
  }
  document.querySelector('.js-name-warning').innerHTML = ''
  const name = nameInput.value
  nameInput.remove()
  localStorage.setItem('name', JSON.stringify(name))
}

startingPage()

// Yo :)