# Rule Engine

## Overview

The Rule Engine is a powerful tool designed to create, combine, and evaluate rules based on user-defined criteria. It utilizes an Abstract Syntax Tree (AST) for efficient rule processing and supports various input formats. This project consists of a Python backend for AST creation and a Node.js Express server for managing rules.

## Features

- Create rules using simple syntax (e.g., `age > 30 AND department = 'Sales'`).
- Combine multiple rules using logical operators (AND, OR).
- Evaluate rules against user data to return true or false.
- Store rules in a SQLite database for persistence.
- RESTful API endpoints for rule management.

## Technologies Used

- **Backend**: Python (Flask)
- **Frontend**: Node.js (Express)
- **Database**: SQLite
- **Frontend**: HTML/CSS/JavaScript (React or plain HTML)
- **API Communication**: Axios

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/downloads/) (v3.7 or higher)
- [pip](https://pip.pypa.io/en/stable/installation/) (Python package manager)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/rule-engine.git
cd rule-engine
```

### Step 2:Set Up the Python Backend

## 1. Navigate to the backend directory

```bash
cd backend
```
## 2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

## 3. Install the requried Python packages:
```bash
pip install -r requirements.txt
```
### Step 3. Set Up the Node.js Server
## 1. Navigate back the node directory:
```bash
cd ..
```
## 2. Navigate to the Node.js server dirrectory:
```bash
cd server
```
## 3. Install the requried Node,js packages:
``` bash
npm install
```

### Step 4: Run the Applications
## 1. Start the python backend (ensure your're in the BACKEND directory):
```bash 
python app.py  # or `flask run` if you set up Flask
```
## 2. Start the Node.js server(ensure you're in the server directory):
``` bash
npm start
```
### Step 5: Access the Application
The Python backend will be accessible at http://localhost:5000.
The Node.js server will be accessible at http://localhost:3001.

### API Endpoints
## Create a Rule
> POST /create_rule
Body: { "rule": "age > 30 AND department = 'Sales'" }
Response: JSON representation of the created AST.

## Combine Rules
> POST /combine_rules
Body: { "rules": ["age > 30", "department = 'Sales'"], "operator": "AND" }
Response: JSON representation of the combined AST.

## Evaluate a Rule
> POST /evaluate_rule
Body: { "ast": { /* AST JSON */ }, "data": { "age": 31, "department": "Sales" } }
Response: { "result": true/false }

## Modify a Rule
> POST /modify_rule
Body: { "ruleId": 1, "newRule": "age < 40" }
Response: Success message.

## Get All Rules
> GET /rules
Response: Array of all rules stored in the database.

### Database
> The project uses SQLite for rule storage. The database file (rules.db) is located in the backend directory.

### Contributing
> Contributions are welcome! Please open an issue or submit a pull request.

Contact
> For any questions or feedback, feel free to reach out.





















