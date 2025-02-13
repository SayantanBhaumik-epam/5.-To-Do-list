const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const notes = document.getElementById("notes");
const toggleSwitch = document.getElementById("toggleSwitch");
const noteHeader = document.getElementById("noteHeader"); // Get the note header

let selectedTask = null; // Track selected task

// Load Tasks and Theme
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }
    resetNoteHeader(); // Ensure header resets on page load
});

// Add Task
function addTask() {
    let taskText = taskInput.value.trim();
    if (!taskText) return;

    // 🔥 Capitalize first letter
    taskText = taskText.charAt(0).toUpperCase() + taskText.slice(1);

    taskList.appendChild(createElement(taskText));
    saveTask();
    taskInput.value = "";
}

// Create List Item
function createElement(taskText, completed = false) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");
    li.innerHTML = `<span>${taskText}</span> <button class="delete-btn">✖</button>`;

    // Handle Task Click (Load Notes)
    li.addEventListener("click", () => {
        selectedTask = taskText;
        notes.value = localStorage.getItem(taskText) || "";
        noteHeader.textContent = `📝 ${taskText}`;
    });

    // Handle Delete Button
    li.querySelector(".delete-btn").addEventListener("click", (event) => {
        event.stopPropagation();
        li.remove();
        localStorage.removeItem(taskText); // 🔥 Remove saved notes too
        saveTask();
        resetNoteHeaderIfEmpty();
    });

    return li;
}

// Save Tasks
function saveTask() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((li) => {
        tasks.push({ text: li.querySelector("span").textContent, completed: li.classList.contains("completed") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save Notes in LocalStorage
notes.addEventListener("input", () => {
    if (selectedTask) {
        localStorage.setItem(selectedTask, notes.value);
    }
});

// Reset Note Header if No Task is Selected
function resetNoteHeaderIfEmpty() {
    if (taskList.children.length === 0) {
        resetNoteHeader();
    }
}

// Reset Note Header to Default
function resetNoteHeader() {
    noteHeader.textContent = "📝 No Task Selected";
    notes.value = "";
    selectedTask = null;
}

// Toggle Theme
toggleSwitch.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
});

// 🆕 **Enter Key Event to Add Task**
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});
