from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Todo model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'completed': self.completed
        }

# Initialize database within application context
def initialize_database():
    with app.app_context():
        db.create_all()
        
# Routes
@app.route('/')
def index():
    return render_template('index.html')

# API Endpoints
@app.route('/api/todos', methods=['GET', 'POST'])
def handle_todos():
    if request.method == 'GET':
        todos = Todo.query.all()
        return jsonify([todo.to_dict() for todo in todos])
    
    if request.method == 'POST':
        data = request.get_json()
        new_todo = Todo(content=data['content'])
        db.session.add(new_todo)
        db.session.commit()
        return jsonify(new_todo.to_dict()), 201

@app.route('/api/todos/<int:id>', methods=['PUT', 'DELETE'])
def handle_todo(id):
    todo = Todo.query.get_or_404(id)
    
    if request.method == 'PUT':
        data = request.get_json()
        if 'content' in data:
            todo.content = data['content']
        if 'completed' in data:
            todo.completed = data['completed']
        db.session.commit()
        return jsonify(todo.to_dict())
    
    if request.method == 'DELETE':
        db.session.delete(todo)
        db.session.commit()
        return jsonify({'message': 'Todo deleted successfully'}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    initialize_database()
    app.run(host='0.0.0.0', port=port, debug=True)