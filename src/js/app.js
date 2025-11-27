/** @format */

const taskForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Load tasks when page loads
loadTasks();

// Handle form submission
taskForm.addEventListener("submit", function (e) {
	e.preventDefault();
	const taskText = taskInput.value.trim();
	if (taskText) {
		addTask(taskText);
		taskInput.value = "";
	}
});

// Add task function
function addTask(text) {
	const tasks = getTasks();
	const task = { id: Date.now(), text: text, completed: false };
	tasks.push(task);
	saveTasks(tasks);
	renderTasks();
}

// Delete task function
function deleteTask(id) {
	const tasks = getTasks().filter((task) => task.id !== id);
	saveTasks(tasks);
	renderTasks();
}

// LocalStorage functions
function getTasks() {
	return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
	const tasks = getTasks();
	taskList.innerHTML = tasks
		.map(
			(task) => `
        <li class="task-item">
            <span>${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
        </li>
    `
		)
		.join("");
}

function loadTasks() {
	renderTasks();
}
