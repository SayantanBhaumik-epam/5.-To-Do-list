const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const notes = document.getElementById("notes");
const noteHeader = document.getElementById("noteHeader");

let selectedTask = null;

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  let taskText = taskInput.value.trim();
  if (!taskText) return;
  taskText = taskText.charAt(0).toUpperCase() + taskText.slice(1);
  taskList.appendChild(createElement(taskText));
  saveTasks();
  taskInput.value = "";
}

function createElement(taskText, completed = false, noteText = "") {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");
  li.dataset.note = noteText;
  li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div class="buttons">
            <button class="complete-btn">✔</button>
            <button class="delete-btn">✖</button>
        </div>
    `;

  li.addEventListener("click", () => {
    selectedTask = li;
    noteHeader.textContent = taskText;
    notes.value = li.dataset.note || "";
  });

  li.querySelector(".complete-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    li.classList.toggle("completed");
    saveTasks();
  });
  
  li.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (selectedTask === li) {
      selectedTask = null;
      noteHeader.textContent = "No Task Selected";
      notes.value = "";
    }
    li.remove();
    saveTasks();
  });
  return li;
}

notes.addEventListener("input", () => {
  if (selectedTask) {
    selectedTask.dataset.note = notes.value;
    saveTasks();
  }
});

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) =>
    taskList.appendChild(createElement(task.text, task.completed, task.note))
  );
}

function saveTasks() {
  const tasks = Array.from(taskList.querySelectorAll("li")).map((li) => ({
    text: li.querySelector(".task-text").textContent,
    completed: li.classList.contains("completed"),
    note: li.dataset.note || "",
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
