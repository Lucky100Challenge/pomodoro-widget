// script.js
let mainTimer;
let taskTimers = {}; // Object to store timers for each task
let timeLeft = 25 * 60; // Initial time of 25 minutes in seconds
let isRunning = false;
let isPaused = false;
let incrementInterval;

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

function startMainTimer() {
    mainTimer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimeDisplay();
            updateTaskTimers(); // Update task timers every second
        } else {
            clearInterval(mainTimer);
            isRunning = false;
            startBtn.textContent = 'Start';
            pauseBtn.textContent = 'Pause';
            clearIntervalAllTaskTimers(); // Clear all task timers when main timer ends
        }
    }, 1000);

    // Start task timers when main timer starts
    Object.keys(taskTimers).forEach(taskId => {
        const task = taskTimers[taskId];
        task.timer = setInterval(() => {
            if (!isPaused && isRunning) {
                task.time++;
                const minutes = Math.floor(task.time / 60);
                const seconds = task.time % 60;
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                task.display.textContent = timeString;
            }
        }, 1000);
    });
}

function stopTimer() {
    clearInterval(mainTimer);
    isRunning = false;
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

function updateTaskTimers() {
    Object.keys(taskTimers).forEach(taskId => {
        if (taskTimers[taskId].running) {
            taskTimers[taskId].time++;
            const minutes = Math.floor(taskTimers[taskId].time / 60);
            const seconds = taskTimers[taskId].time % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            taskTimers[taskId].display.textContent = timeString;
        }
    });
}

function clearIntervalAllTaskTimers() {
    Object.keys(taskTimers).forEach(taskId => {
        clearInterval(taskTimers[taskId].timer);
        taskTimers[taskId].running = false;
    });
}

startBtn.addEventListener('click', () => {
    if (!isRunning && !isPaused) {
        startMainTimer();
        isRunning = true;
        startBtn.textContent = 'Start';
    }
});

pauseBtn.addEventListener('click', () => {
    if (isRunning) {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(mainTimer);
            pauseBtn.textContent = 'Resume';
            clearIntervalAllTaskTimers();
        } else {
            startMainTimer();
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
    isPaused = false;
    clearIntervalAllTaskTimers();
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
        const taskId = Date.now().toString(); // Unique ID for each task timer
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-2 bg-gray-200 rounded-lg';

        const span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        const taskTimeDisplay = document.createElement('span');
        taskTimeDisplay.textContent = '00:00';
        taskTimeDisplay.className = 'task-time';
        li.appendChild(taskTimeDisplay);

        const checkBtn = document.createElement('button');
        checkBtn.className = 'task-btn px-2 py-1 text-white bg-green-500 rounded-lg shadow hover:bg-green-600';
        checkBtn.textContent = 'Check';
        checkBtn.addEventListener('click', () => {
            span.classList.toggle('checked');
        });
        li.appendChild(checkBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn px-2 py-1 text-white bg-red-500 rounded-lg shadow hover:bg-red-600';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            clearInterval(taskTimers[taskId].timer);
            delete taskTimers[taskId];
            tasks.removeChild(li);
        });
        li.appendChild(deleteBtn);

        tasks.appendChild(li);

        // Initialize task timer, but don't start it yet
        taskTimers[taskId] = {
            timer: null,
            time: 0,
            display: taskTimeDisplay,
            running: false
        };

        taskInput.value = '';
    }
});

// Initialize display
updateTimeDisplay();
