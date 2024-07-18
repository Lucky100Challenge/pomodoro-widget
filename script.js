// script.js
let timer;
let timeLeft = 25 * 60; // Initial time of 25 minutes in seconds
let isRunning = false;
let isPaused = false;
let incrementInterval;
let currentTasks = []; // Array to store tasks completed during Pomodoro session

const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const cancelBtn = document.getElementById('cancel-btn');
const minusBtn = document.getElementById('minus-btn');
const plusBtn = document.getElementById('plus-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasks = document.getElementById('tasks');

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimeDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = 'Start';
            pauseBtn.textContent = 'Pause';
            logCompletedTasks();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
}

function handleIncrementButton(button, increment) {
    button.addEventListener('mousedown', () => {
        timeLeft = Math.max(0, timeLeft + increment);
        updateTimeDisplay();
        incrementInterval = setInterval(() => {
            timeLeft = Math.max(0, timeLeft + increment);
            updateTimeDisplay();
        }, 200);
    });

    button.addEventListener('mouseup', () => {
        clearInterval(incrementInterval);
    });

    button.addEventListener('mouseleave', () => {
        clearInterval(incrementInterval);
    });
}

function logCompletedTasks() {
    const completedTasks = document.querySelectorAll('.task-item.checked');
    completedTasks.forEach(task => {
        const taskName = task.querySelector('span').textContent;
        const taskObject = {
            name: taskName,
            startTime: null,
            endTime: null,
            elapsedTime: null
        };
        currentTasks.push(taskObject);
    });
}

function startTaskTimer(task) {
    task.startTime = new Date();
}

function completeTask(task) {
    task.endTime = new Date();
    task.elapsedTime = (task.endTime - task.startTime) / 1000; // Convert to seconds
}

startBtn.addEventListener('click', () => {
    if (!isRunning && !isPaused) {
        startTimer();
        isRunning = true;
        startBtn.textContent = 'Start';
    }
});

pauseBtn.addEventListener('click', () => {
    if (isRunning) {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(timer);
            pauseBtn.textContent = 'Resume';
        } else {
            startTimer();
            pauseBtn.textContent = 'Pause';
        }
    }
});

cancelBtn.addEventListener('click', () => {
    stopTimer();
    timeLeft = 25 * 60; // Reset to 25 minutes
    updateTimeDisplay();
    startBtn.textContent = 'Start';
    pauseBtn.textContent = 'Pause';
    currentTasks = [];
    tasks.innerHTML = ''; // Clear tasks list
});

handleIncrementButton(minusBtn, -60);
handleIncrementButton(plusBtn, 60);

shortBreakBtn.addEventListener('click', () => {
    timeLeft = 5 * 60; // Set to 5 minutes for short break
    updateTimeDisplay();
});

longBreakBtn.addEventListener('click', () => {
    timeLeft = 15 * 60; // Set to 15 minutes for long break
    updateTimeDisplay();
});

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-2 bg-gray-200 rounded-lg task-item';

        const span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        const checkBtn = document.createElement('button');
        checkBtn.className = 'task-btn px-2 py-1 text-white bg-green-500 rounded-lg shadow hover:bg-green-600';
        checkBtn.textContent = 'Check';
        checkBtn.addEventListener('click', () => {
            span.classList.toggle('checked');
            if (span.classList.contains('checked')) {
                startTaskTimer(currentTasks.find(task => task.name === taskText));
            } else {
                completeTask(currentTasks.find(task => task.name === taskText));
            }
        });
        li.appendChild(checkBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn px-2 py-1 text-white bg-red-500 rounded-lg shadow hover:bg-red-600';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            tasks.removeChild(li);
        });
        li.appendChild(deleteBtn);

        tasks.appendChild(li);
        taskInput.value = '';
    }
});

// Initialize display
updateTimeDisplay();
