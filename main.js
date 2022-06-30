/* globals DOMPurify */
// ========================
// Variables
// ========================
const speakerlist = document.querySelector('.todolist')
const taskList = speakerlist.querySelector('.todolist__tasks')
const btnNext = document.querySelector(".next");
const btnCopy = document.querySelector("#copy");
const announcementEN = document.querySelector("#announcement-en");
const announcementFR = document.querySelector("#announcement-fr");
let announcementTopic = document.querySelector("#announcement-topic");
const newSpeakerField = speakerlist.querySelector('.newSpeaker');
const newTopicField = speakerlist.querySelector('.newTopic')
let textNotes = document.querySelector('#notes');


// ========================
// Functions
// ========================
/**
 * Generates a unique string
 * @param {Number} length - Length of string
 * @returns {String}
 */
function generateUniqueString (length) {
  return Math.random().toString(36).substring(2, 2 + length)
}

window.onload = function(){
    // Bring focus back to input field
    newSpeakerField.focus()
    textNotes.innerHTML = new Date().toLocaleString('en-CA', { timeZone: 'UTC' });
  }


/**
 * Creates a task element
 * @param {String} taskname - Speaker Name
 * @param {String} topic - Speaker Topic
 * @returns {HTMLElement}
 */
function makeTaskElement (taskname, topic) {
  let topicStyled;
  if(topic){
    topicStyled = "(" + topic + ")";
  } else {
    topicStyled = "";
  }
  const uniqueID = generateUniqueString(10)
  const taskElement = document.createElement('li')
  taskElement.classList.add('task')
  taskElement.id = uniqueID;
  taskElement.setAttribute("data-speaker-name", taskname);
  taskElement.setAttribute("data-speaker-topic", topic);
  taskElement.innerHTML = DOMPurify.sanitize(`
        <span class="task__name w-auto">${taskname}&nbsp;</span>
        <span class="task__name w-3/5 truncate text-sm">${topicStyled}</span>
        <button type="button" class="speaker__next-button h-5 w-6 p-1 outline-none hover:outline-none focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="text-white stroke-white h-full w-full" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
        </button>
        <button type="button" class="speaker__delete-button h-5 w-6 ml-1 p-1 outline-none hover:outline-none focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-white stroke-white fill-white w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>`
  )
  return taskElement
}

// ========================
// Execution
// ========================
// Adding a task to the DOM
speakerlist.addEventListener('submit', event => {
  event.preventDefault()

  // Get value of task
  const speakerName = newSpeakerField.value.trim()
  const speakerTopic = newTopicField.value.trim()

  // Clear the new task field
  newSpeakerField.value = ''
  newTopicField.value = ''

  // Bring focus back to input field
  newSpeakerField.focus()

  // Prevent adding of empty task
  if (!speakerName) return

  // Create task
  const taskElement = makeTaskElement(speakerName, speakerTopic)

  // Append to the DOM
  taskList.appendChild(taskElement)
})

// Deleting a task from the DOM
taskList.addEventListener('click', event => {
  if (!event.target.matches('.speaker__delete-button')) return

  // Removes the task
  const taskDiv = event.target.parentElement
  taskList.removeChild(taskDiv)

  // Triggers empty state
  if (taskList.children.length === 0) taskList.innerHTML = ''
})


// Getting this speaker
taskList.addEventListener('click', event => {
    if (!event.target.matches('.speaker__next-button')) return
  
    const speakerDiv = event.target.parentElement
    const nextSpeakerName = speakerDiv.getAttribute('data-speaker-name');
    const nextSpeakerTopic = speakerDiv.getAttribute('data-speaker-topic');
    announcementFR.innerHTML = nextSpeakerName + " parle."
    announcementEN.innerHTML = nextSpeakerName + " is speaking.";
    announcementTopic.innerHTML = nextSpeakerTopic;
    if(nextSpeakerTopic){
      textNotes.innerHTML += "\n" + nextSpeakerName + " - " + nextSpeakerTopic;
    }else{
      textNotes.innerHTML += "\n" + nextSpeakerName;
    }
    taskList.removeChild(speakerDiv)
    resetTimer();
    startTimer();
  })


// Getting the next random speaker
btnNext.addEventListener('click', event => {
    nextRandomSpeaker();
})

function nextRandomSpeaker(){
  if(taskList.children.length === 0)
  {
      announcementFR.innerHTML = "personne ne parle."
      announcementEN.innerHTML = "noone is speaking.";
      announcementTopic.innerHTML = "";
      resetTimer();
  }else{
      const nextSpeakerNum = Math.floor(Math.random() * taskList.children.length)
      const nextSpeakerName = taskList.children[nextSpeakerNum].getAttribute('data-speaker-name');
      const nextSpeakerTopic = taskList.children[nextSpeakerNum].getAttribute('data-speaker-topic');
      announcementFR.innerHTML = nextSpeakerName + " parle."
      announcementEN.innerHTML = nextSpeakerName + " is speaking.";
      announcementTopic.innerHTML = nextSpeakerTopic;
      if(nextSpeakerTopic){
        textNotes.innerHTML += "\n" + nextSpeakerName + " - " + nextSpeakerTopic;
      }else{
        textNotes.innerHTML += "\n" + nextSpeakerName;
      }
      taskList.removeChild(taskList.children[nextSpeakerNum])
      resetTimer();
      startTimer();
  }
}

// Copy the meetings notes
btnCopy.addEventListener('click', event => {
  textNotes.select();
  document.execCommand('copy');
})


////
// TIMER
////
let interval;
let hundreds = 0;
let seconds = 0;
let minutes = 0;

const timer = document.querySelector(".timer");
const secondsElm = document.querySelector("#seconds");
const minutesElm = document.querySelector("#minutes");
//const hundredsElm = document.querySelector("#hundreds");

function startTimer(){
  clearInterval(interval);
  interval = setInterval(() => {
    hundreds++;

    if (hundreds <= 9) {
        //hundredsElm.innerText = "0" + hundreds;
    } else {
        //hundredsElm.innerText = hundreds;
    }

    if (hundreds > 99) {
      //hundredsElm.innerText = "00";
      hundreds = 0;
      seconds++;
    }

    if (seconds <= 9) {
      secondsElm.innerText = "0" + seconds;
    } else {
      secondsElm.innerText = seconds;
    }

    if (seconds > 59) {
      secondsElm.innerText = "00";
      seconds = 0;
      minutes++;
    }

    if (minutes <= 9) {
      minutesElm.innerText = "0" + minutes;
    } else {
      minutesElm.innerText = minutes;
    }
  }, 10);
}

function stopTimer(){
    clearInterval(interval);
}

function resetTimer(){
  clearInterval(interval);
  minutes = 0;
  seconds = 0;
  // hundreds = 0;
  minutesElm.innerText = "00";
  secondsElm.innerText = "00";
  // hundredsElm.innerText = "00";

}

//////
// KEYBOARD CONTROLS
//////

let lastKeyPressed;

document.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && lastKeyPressed == 'Enter'){
        nextRandomSpeaker();
    } else {
        lastKeyPressed = event.key;
    }    
 });