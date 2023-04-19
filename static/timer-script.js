const TIMER_KEY = 'timer';
const timerContainer = document.querySelector('.timer-container');
const buttons = document.querySelector('.buttons');
const timer = document.querySelector('.timer');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const audio = new Audio('/static/materials/alarm.mp3') // Replace 'path/to/music.mp3' with the path to your music file

let intervalId;
let remainingTime;

// Load user preferences from local storage
const loadUserPreferences = () => {
  const userPreferences = JSON.parse(localStorage.getItem(TIMER_KEY));
  if (userPreferences) {
    remainingTime = userPreferences.remainingTime;
    const currentTime = new Date().getTime();
    updateCurrentTime(userPreferences); // Update currentTime
    const elapsedTime = Math.floor((currentTime - userPreferences.currentTime) / 1000); // Calculate elapsed time in seconds
    remainingTime = Math.max(remainingTime - elapsedTime, 0); // Subtract elapsed time from remaining time
    updateTimer();
  }
};

// Save user preferences to local storage
const saveUserPreferences = () => {
  const userPreferences = {
    remainingTime,
    currentTime: new Date().getTime() // Store the current time in milliseconds
  };5
  localStorage.setItem(TIMER_KEY, JSON.stringify(userPreferences));
};

// Update the current time in user preferences
const updateCurrentTime = (userPreferences) => {
  userPreferences.currentTime = new Date().getTime();
};

// Update the timer display
const updateTimer = () => {
  const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const seconds = (remainingTime % 60).toString().padStart(2, '0');
  timer.textContent = `${minutes}:${seconds}`;
};

// Start the timer
const startTimer = () => {
  startButton.disabled = true;
  intervalId = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      remainingTime = 0;
      updateTimer();
      startButton.disabled = true;
      audio.play(); // Play music when timer is done
    }
    updateTimer();
    saveUserPreferences();
  }, 1000);
};

// Stop the timer
const stopTimer = () => {
  clearInterval(intervalId);
  startButton.disabled = false;
  saveUserPreferences();
};

buttons.addEventListener('click', (event) => {
  const buttonId = event.target.id;
  let newTime;
  switch (buttonId) {
    case 'five-minutes':
      newTime =  5 * 60;
      break;
    case 'fifteen-minutes':
      newTime = 15 * 60;
      break;
    case 'twenty-five-minutes':
      newTime = 25 * 60;
      break;
    default:
      newTime = 0;
  }
  if (intervalId) {
    clearInterval(intervalId);
    remainingTime = newTime;
    updateTimer();
    startButton.disabled = false;
    saveUserPreferences();
  } else {
    remainingTime = newTime;
    updateTimer();
    startButton.disabled = false;
    saveUserPreferences();
  }
});

startButton.addEventListener('click', () => {
  if (remainingTime <= 0) {
    remainingTime = 25 * 60; // Restart timer if it has reached 0
    updateTimer();
  }
  startTimer();
});

stopButton.addEventListener('click', () => {
  stopTimer();
});

loadUserPreferences();
