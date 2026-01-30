document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. Navigation & UI Logic (Existing)
  // ==========================================
  const dashboardHub = document.querySelector(".view-hub");
  const detailPanes = document.querySelectorAll(".detail-pane");
  const navLinks = document.querySelectorAll(".side-nav__link");
  const bentoCards = document.querySelectorAll(".bento-card");
  const backButtons = document.querySelectorAll(".js-back");

  function showView(viewId) {
    const target = document.getElementById(`pane-${viewId}`);
    if (!target) return;
    dashboardHub.classList.remove("js-view-active");
    detailPanes.forEach((p) => p.classList.remove("is-active"));
    target.classList.add("is-active");
    updateNavActiveState(viewId);
    window.scrollTo(0, 0);
  }

  function resetToHome() {
    detailPanes.forEach((p) => p.classList.remove("is-active"));
    dashboardHub.classList.add("js-view-active");
    updateNavActiveState("home");
  }

  function updateNavActiveState(id) {
    navLinks.forEach((link) => {
      const isActive =
        link.dataset.view === id || (id === "home" && link.id === "nav-home");
      link.classList.toggle("side-nav__link--active", isActive);
    });
  }

  bentoCards.forEach((card) =>
    card.addEventListener("click", () => showView(card.dataset.view)),
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      link.id === "nav-home" ? resetToHome() : showView(link.dataset.view);
    });
  });
  backButtons.forEach((btn) => btn.addEventListener("click", resetToHome));
  document
    .querySelector(".top-bar__brand")
    .addEventListener("click", resetToHome);

  // Live Clock
  function updateTime() {
    const now = new Date();
    document.querySelector(".js-time").textContent = now.toLocaleTimeString(
      "en-US",
      { hour: "2-digit", minute: "2-digit", hour12: true },
    );
    document.querySelector(".js-date").textContent = now.toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "short", year: "numeric" },
    );
  }
  setInterval(updateTime, 1000);
  updateTime();

  // ==========================================
  // 2. Task Manager
  // ==========================================
  const taskInput = document.getElementById("task-input");
  const btnAddTask = document.getElementById("btn-add-task");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
          <div class="task-check" onclick="toggleTask(${index})">
            ${task.completed ? '<i class="ri-check-line"></i>' : ""}
          </div>
          <span class="task-text">${task.text}</span>
          <button class="btn-delete" onclick="deleteTask(${index})">
            <i class="ri-delete-bin-line"></i>
          </button>
        `;
      taskList.appendChild(li);
    });
  }

  window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
  };

  btnAddTask.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      taskInput.value = "";
      saveTasks();
    }
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btnAddTask.click();
  });

  renderTasks();

  // ==========================================
  // 3. Daily Planner
  // ==========================================
  const plannerContainer = document.getElementById("planner-list");
  const plans = JSON.parse(localStorage.getItem("plans")) || {};
  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  function initPlanner() {
    plannerContainer.innerHTML = "";
    timeSlots.forEach((time) => {
      const div = document.createElement("div");
      div.className = "time-slot";
      div.innerHTML = `
          <span class="slot-time">${time}</span>
          <input type="text" class="slot-input" placeholder="Plan for ${time}..." 
            data-time="${time}" value="${plans[time] || ""}" />
        `;
      plannerContainer.appendChild(div);
    });

    document.querySelectorAll(".slot-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        plans[e.target.dataset.time] = e.target.value;
        localStorage.setItem("plans", JSON.stringify(plans));
      });
    });
  }

  initPlanner();

  // ==========================================
  // 4. Pomodoro Timer
  // ==========================================
  let timerInterval;
  let timeLeft = 25 * 60;
  let isRunning = false;
  const timerDisplay = document.getElementById("timer-time");
  const statusDisplay = document.getElementById("timer-status");
  const startBtn = document.getElementById("btn-start-timer");
  const pauseBtn = document.getElementById("btn-pause-timer");
  const resetBtn = document.getElementById("btn-reset-timer");
  const modeBtns = document.querySelectorAll(".mode-btn");

  const MODES = {
    pomodoro: { time: 25 * 60, label: "Focus Time" },
    short: { time: 5 * 60, label: "Short Break" },
    long: { time: 15 * 60, label: "Long Break" },
  };

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.innerHTML = '<i class="ri-pause-fill"></i>'; // Optional visual feedback
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
          .play()
          .catch((e) => console.log("Audio play failed"));
        alert("Time's up!");
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.innerHTML = '<i class="ri-play-fill"></i>';
  }

  function resetTimer() {
    pauseTimer();
    const activeMode = document.querySelector(".mode-btn.active").dataset.mode;
    timeLeft = MODES[activeMode].time;
    updateDisplay();
  }

  startBtn.addEventListener("click", () => {
    if (isRunning) pauseTimer();
    else startTimer();
  });

  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.mode;
      timeLeft = MODES[mode].time;
      statusDisplay.textContent = MODES[mode].label;
      pauseTimer();
      updateDisplay();
    });
  });

  // ==========================================
  // 5. Goals Tracker
  // ==========================================
  const goalInput = document.getElementById("goal-input");
  const btnAddGoal = document.getElementById("btn-add-goal");
  const goalsList = document.getElementById("goals-list");

  let goals = JSON.parse(localStorage.getItem("goals")) || [];

  function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
  }

  function renderGoals() {
    goalsList.innerHTML = "";
    goals.forEach((goal, index) => {
      const div = document.createElement("div");
      div.className = "goal-card";
      div.innerHTML = `
          <div class="goal-content">
            <h3 class="goal-title">${goal.text}</h3>
            <div class="goal-status">
              <i class="ri-checkbox-circle-fill" style="color: ${goal.completed ? "#22c55e" : "#cbd5e1"}"></i>
              ${goal.completed ? "Completed" : "In Progress"}
            </div>
          </div>
          <button class="btn-delete" onclick="deleteGoal(${index})">
            <i class="ri-delete-bin-line"></i>
          </button>
          <div class="task-check" style="position:absolute; bottom: 1rem; right: 4rem; border-color: var(--text-muted);" onclick="toggleGoal(${index})">
             ${goal.completed ? '<i class="ri-check-line"></i>' : ""}
          </div>
        `;
      goalsList.appendChild(div);
    });
  }

  window.toggleGoal = (index) => {
    goals[index].completed = !goals[index].completed;
    saveGoals();
  };

  window.deleteGoal = (index) => {
    goals.splice(index, 1);
    saveGoals();
  };

  btnAddGoal.addEventListener("click", () => {
    const text = goalInput.value.trim();
    if (text) {
      goals.push({ text, completed: false });
      goalInput.value = "";
      saveGoals();
    }
  });

  goalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btnAddGoal.click();
  });

  renderGoals();

  // ==========================================
  // 6. Weather Integration
  // ==========================================
  const API_KEY = "88dd2b0d583c0da8ce0bd98097900473"; // User provided key

  function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        document.querySelector(".temp-val").textContent =
          `${Math.round(data.main.temp)}°C`;
        document.querySelector(".temp-desc").textContent = data.weather[0].main;
        document.querySelector(".pill-badge").innerHTML =
          `<i class="ri-map-pin-2-fill"></i> ${data.name}`;

        // Dynamic Background
        const cityImage = `https://image.pollinations.ai/prompt/cinematic%20shot%20of%20${data.name}%20city%20landmark?width=1200&height=600&nologo=true`;
        document.querySelector(".bento-card--weather").style.backgroundImage =
          `url('${cityImage}')`;
      })
      .catch((err) => {
        console.error("Weather fetch failed:", err);
        document.querySelector(".temp-desc").textContent = "Unavailable";
      });
  }

  function initWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn(
            "Geolocation denied/error, defaulting to New Delhi",
            error,
          );
          // Default to New Delhi coordinates
          fetchWeather(28.6139, 77.209);
        },
        { enableHighAccuracy: true },
      );
    } else {
      // Fallback if Geolocation is not supported
      fetchWeather(28.6139, 77.209);
    }
  }

  initWeather();

  // ==========================================
  // 7. Motivational Quotes
  // ==========================================
  // ==========================================
  // 7. Motivational Quotes
  // ==========================================

  function fetchQuote() {
    const url = "https://api.quotable.io/random?tags=inspirational|success";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          document.querySelector(".quote-text").textContent =
            `"${data.content}"`;
          document.querySelector(".quote-author").textContent =
            `- ${data.author}`;
        }
      })
      .catch((err) => {
        console.error("Quote fetch failed:", err);
        document.querySelector(".quote-text").textContent =
          `"The only way to do great work is to love what you do."`;
        document.querySelector(".quote-author").textContent = `- Steve Jobs`;
      });
  }

  fetchQuote();
});
