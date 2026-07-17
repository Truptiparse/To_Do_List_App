let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterCategory = document.getElementById('filterCategory');
const darkModeBtn = document.getElementById('darkModeBtn');

// Load tasks on page load
document.addEventListener('DOMContentLoaded', renderTasks);

// Add Task with Validation
addBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if(taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value,
        completed: false
    };
    
    tasks.push(newTask);
    saveAndRender();
    taskInput.value = '';
});

// Render Tasks
function renderTasks() {
    let filteredTasks = tasks;
    
    // Search
    const searchTerm = searchInput.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task => task.text.toLowerCase().includes(searchTerm));
    
    // Filter by status
    if(filterStatus.value !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
            filterStatus.value === 'completed' ? task.completed : !task.completed
        );
    }
    
    // Filter by category
    if(filterCategory.value !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.category === filterCategory.value);
    }
    
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <p>${task.text}</p>
                <span class="category">${task.category}</span>
                <span class="priority-${task.priority.toLowerCase()}"> Priority: ${task.priority}</span>
                ${task.dueDate ? `<span> Due: ${task.dueDate}</span>` : ''}
            </div>
            <div class="task-buttons">
                <button class="complete-btn" onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    
    updateStats();
}

// Toggle Complete
function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
    saveAndRender();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('Edit your task:', task.text);
    if(newText) {
        task.text = newText.trim();
        saveAndRender();
    }
}

// Delete Task
function deleteTask(id) {
    if(confirm('Delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }
}

// Update Stats
function updateStats() {
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('completedCount').textContent = completed;
}

// Save to Local Storage
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Search and Filter Events
searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);
filterCategory.addEventListener('change', renderTasks);

// Dark Mode
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    darkModeBtn.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});
