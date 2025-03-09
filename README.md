# Todo Application

A feature-rich, responsive Todo web application built with Python (Flask), SQLAlchemy, and Bootstrap. Manage your tasks efficiently with CRUD operations and real-time statistics.

[Live Demo Here 🎯](https://todoapp-84o3.onrender.com/)

## Features

### Frontend
- 📱 Responsive design (works on mobile & desktop)
- ➕ Add new tasks with enter key or button
- ✏️ Inline task editing
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete tasks
- 🔍 Filter tasks (All/Active/Completed)
- 📊 Real-time statistics dashboard
- 🎨 Modern UI with hover effects and transitions

### Backend
- 🔒 RESTful API endpoints
- 🗄️ SQLAlchemy ORM with SQLite database
- 🔄 Full CRUD operations
- 📦 JSON-based data exchange
- ⚙️ Configurable database settings

## Technologies Used
- **Backend**: Python, Flask, SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Database**: SQLite (with Flask-SQLAlchemy)
- **Icons**: Font Awesome 6
- **Package Management**: Pipenv

## Installation

### Prerequisites
- Python 3.9+
- Pipenv (`pip install pipenv`)

### Steps
1. Clone the repository:
```bash
git clone https://github.com/cyberfortify/todoApp.git
cd todo-app
```

2. Install dependencies:
```bash
pipenv install
```

3. Initialize the database:
```bash
pipenv run flask shell
>>> from app import db
>>> db.create_all()
>>> exit()
```

4. Start the application:
```bash
pipenv run flask run
```

5. Open your browser at:
```
http://localhost:5000
```

## Usage
- **Add Task**: Enter text in the input field and click "Add Task" or press Enter
- **Edit Task**: Click the edit (✎) button, modify text, then click save (💾)
- **Complete Task**: Check the checkbox
- **Delete Task**: Click the trash (🗑️) button
- **Filter Tasks**: Use the filter buttons (All/Active/Completed)

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/todos` | GET | Get all todos |
| `/api/todos` | POST | Create new todo |
| `/api/todos/<id>` | PUT | Update todo |
| `/api/todos/<id>` | DELETE | Delete todo |

**Example Request:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"content":"New Task"}' http://localhost:5000/api/todos
```

## File Structure
```
todo-app/
├── app.py            # Main application file
├── Pipfile           # Dependency management
├── Pipfile.lock
├── static/
│   └── script.js     # Frontend JavaScript
├── templates/
│   └── index.html    # Main template
└── todos.db          # Database (created after first run)
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Bootstrap Team for the amazing CSS framework
- Font Awesome for the beautiful icons
- Flask community for excellent documentation
