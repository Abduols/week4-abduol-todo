/** @format */

let tasks = [];

// Load tasks when page starts
loadTasks();

// Setup event listeners
document.getElementById("todo-form").addEventListener("submit", function (e) {
	e.preventDefault();
	addTask();
});

// Adding new task
function addTask() {
	const input = document.getElementById("task-input");
	const text = input.value.trim();

	if (text) {
		const task = {
			id: Date.now(),
			text: text,
			completed: false,
		};

		tasks.push(task);
		saveTasks();
		render();
		input.value = "";
		showMessage("Task added successfully!", "success");
	}
}

// Delete task
function deleteTask(id) {
	tasks = tasks.filter((task) => task.id !== id);
	saveTasks();
	render();
	showMessage("Task deleted!", "warning");
}

// Toggle task completion
function toggleTask(id) {
	tasks = tasks.map((task) =>
		task.id === id ? { ...task, completed: !task.completed } : task
	);
	saveTasks();
	render();
}

// Edit task
function startEdit(id) {
	const taskElement = document.querySelector(`[data-id="${id}"]`);
	const textElement = taskElement.querySelector(".task-text");
	const editInput = taskElement.querySelector(".task-edit-input");

	textElement.style.display = "none";
	editInput.style.display = "block";
	editInput.focus();

	function finishEdit() {
		const newText = editInput.value.trim();
		if (newText) {
			tasks = tasks.map((task) =>
				task.id === id ? { ...task, text: newText } : task
			);
			saveTasks();
			render();
			showMessage("Task updated!", "info");
		} else {
			render(); // Cancel edit if empty
		}
	}

	editInput.onkeydown = function (e) {
		if (e.key === "Enter") finishEdit();
		if (e.key === "Escape") render(); // Cancel on Escape
	};

	editInput.onblur = finishEdit;
}

// Show message
function showMessage(text, type = "info") {
	const messageDiv = document.getElementById("message");
	messageDiv.textContent = text;
	messageDiv.className = `message message-${type} show`;

	setTimeout(() => {
		messageDiv.classList.remove("show");
	}, 2000);
}

// Render everything
function render() {
	renderTaskList();
	renderStats();
}

// Render task list
function renderTaskList() {
	const taskList = document.getElementById("task-list");

	if (tasks.length === 0) {
		taskList.innerHTML = `
            <div class="empty-state">
                <p>No tasks yet. Add one above!</p>
            </div>
        `;
		return;
	}

	taskList.innerHTML = tasks
		.map(
			(task) => `
        <li class="task-item ${task.completed ? "completed" : ""}" data-id="${
				task.id
			}">
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text">${task.text}</span>
                <input 
                    type="text" 
                    class="task-edit-input" 
                    value="${task.text}" 
                    style="display: none;"
                >
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="startEdit(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `
		)
		.join("");
}

// Render statistics
function renderStats() {
	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((task) => task.completed).length;
	const activeTasks = totalTasks - completedTasks;

	document.getElementById(
		"tasks-count"
	).textContent = `${activeTasks} of ${totalTasks} tasks remaining`;
}

// LocalStorage functions
function loadTasks() {
	const saved = localStorage.getItem("tasks");
	tasks = saved ? JSON.parse(saved) : [];
	render();
}

function saveTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}
