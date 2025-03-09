document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    // Add Task Functionality
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') addTask();
    });

    // Task List Event Delegation
    document.getElementById('taskList').addEventListener('click', (e) => {
        if(e.target.classList.contains('form-check-input')) {
            toggleTaskStatus(e.target);
        }
        if(e.target.closest('.btn-danger')) {
            deleteTask(e.target.closest('.task-item'));
        }
    });

    // Filter Buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', filterTasks);
    });
    if(e.target.closest('.edit-btn')) {
        toggleEditMode(e.target.closest('.task-item'));
    }
});

function renderTodos(todos) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoHTML = `
            <div class="task-item p-3 mb-2 d-flex align-items-center" data-id="${todo.id}">
                <input type="checkbox" class="form-check-input me-3" ${todo.completed ? 'checked' : ''}>
                <div class="task-text flex-grow-1">${todo.content}</div>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        taskList.insertAdjacentHTML('beforeend', todoHTML);
        
        const newTask = taskList.lastElementChild;
        if(todo.completed) newTask.classList.add('completed');
    });
}

// Edit functionality
async function toggleEditMode(taskItem) {
    const taskText = taskItem.querySelector('.task-text');
    const currentText = taskText.textContent;
    
    if(taskItem.classList.contains('editing')) {
        // Save changes
        const input = taskItem.querySelector('.edit-input');
        const newText = input.value.trim();
        
        if(newText && newText !== currentText) {
            try {
                const response = await fetch(`/api/todos/${taskItem.dataset.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: newText })
                });
                
                const updatedTodo = await response.json();
                taskText.textContent = updatedTodo.content;
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        }
        
        taskItem.classList.remove('editing');
        taskText.style.display = 'block';
        input.remove();
        taskItem.querySelector('.edit-btn').innerHTML = '<i class="fas fa-edit"></i>';
    } else {
        // Enter edit mode
        taskItem.classList.add('editing');
        taskText.style.display = 'none';
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input form-control flex-grow-1';
        editInput.value = currentText;
        taskText.parentNode.insertBefore(editInput, taskText);
        
        editInput.focus();
        taskItem.querySelector('.edit-btn').innerHTML = '<i class="fas fa-save"></i>';
    }
}

async function loadTodos() {
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        renderTodos(todos);
        updateStatistics();
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    if(taskInput.value.trim() === '') return;

    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: taskInput.value })
        });
        
        const newTodo = await response.json();
        // Directly add the new task to the DOM
        const taskList = document.getElementById('taskList');
        const taskHTML = `
            <div class="task-item p-3 mb-2 d-flex align-items-center" data-id="${newTodo.id}">
                <input type="checkbox" class="form-check-input me-3">
                <div class="task-text flex-grow-1">${newTodo.content}</div>
                <button class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.insertAdjacentHTML('beforeend', taskHTML);
        
        taskInput.value = '';
        updateStatistics();
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTaskStatus(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const todoId = taskItem.dataset.id;
    const completed = checkbox.checked;

    try {
        await fetch(`/api/todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed })
        });
        
        taskItem.classList.toggle('completed', completed);
        updateStatistics();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTask(taskElement) {
    const todoId = taskElement.dataset.id;

    try {
        await fetch(`/api/todos/${todoId}`, {
            method: 'DELETE'
        });
        
        taskElement.remove();
        updateStatistics();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

function renderTodos(todos) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoHTML = `
            <div class="task-item p-3 mb-2 d-flex align-items-center" data-id="${todo.id}">
                <input type="checkbox" class="form-check-input me-3" ${todo.completed ? 'checked' : ''}>
                <div class="task-text flex-grow-1">${todo.content}</div>
                <button class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.insertAdjacentHTML('beforeend', todoHTML);
        
        const newTask = taskList.lastElementChild;
        if(todo.completed) newTask.classList.add('completed');
    });
}

function updateStatistics() {
    const tasks = document.querySelectorAll('.task-item');
    const completed = document.querySelectorAll('.completed').length;
    
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('remainingTasks').textContent = tasks.length - completed;
    document.getElementById('completedTasks').textContent = completed;
}

function filterTasks(e) {
    const filter = e.target.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    document.querySelectorAll('.task-item').forEach(task => {
        const isCompleted = task.classList.contains('completed');
        task.style.display = 
            filter === 'all' ? 'flex' :
            filter === 'active' && !isCompleted ? 'flex' :
            filter === 'completed' && isCompleted ? 'flex' : 'none';
    });
}