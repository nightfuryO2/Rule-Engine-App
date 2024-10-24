from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore

app = Flask(__name__)
CORS(app)

# Node class represents the AST structure
class Node:
    def __init__(self, node_type, value=None, left=None, right=None):
        self.type = node_type  # "operator" or "operand"
        self.value = value  # AND, OR for operators; condition data for operands
        self.left = left  # Left child node
        self.right = right  # Right child node

    def to_dict(self):
        if self.type == 'operator':
            return {
                'type': self.type,
                'value': self.value,
                'left': self.left.to_dict() if self.left else None,
                'right': self.right.to_dict() if self.right else None,
            }
        elif self.type == "operand":
            return {
                'type': self.type,
                'value': self.value
            }

# Function to parse a rule and create an AST
def create_ast(rule):
    rule = rule.replace("'", "").strip()  # Remove single quotes for simplicity
    conditions = rule.split(',')  # Split by comma to get individual conditions
    ast_nodes = []

    for condition in conditions:
        condition = condition.strip()
        
        # Handle comparisons with ':', '>', '<', '>=', '<=', '==', '!='
        if ':' in condition:
            attribute, value = map(str.strip, condition.split(':', 1))
            ast_nodes.append(Node("operand", {
                "attribute": attribute,
                "operator": "==",  # Default operator for simple assignments
                "value": int(value) if value.isdigit() else value
            }))
        elif any(op in condition for op in ['>', '<', '>=', '<=', '==', '!=']):
            for op in ['>=', '<=', '>', '<', '==', '!=']:
                if op in condition:
                    parts = condition.split(op)
                    if len(parts) == 2:
                        attribute = parts[0].strip()
                        value = parts[1].strip()
                        ast_nodes.append(Node("operand", {
                            "attribute": attribute,
                            "operator": op,
                            "value": int(value) if value.isdigit() else value.strip("'")
                        }))
                    break

    # Combine all nodes using AND (for now)
    if ast_nodes:
        root = ast_nodes[0]
        for node in ast_nodes[1:]:
            root = Node("operator", "AND", root, node)
        return root
    return None  # Return None if the rule is not valid

# Function to combine multiple ASTs using AND or OR
def combine_rules(rules, operator="AND"):
    if not rules:
        return None
    if len(rules) == 1:
        return create_ast(rules[0])

    # Combine rules using the provided operator
    root = create_ast(rules[0])
    for rule in rules[1:]:
        right_node = create_ast(rule)
        root = Node("operator", operator, root, right_node)
    return root

# Function to evaluate the rule AST against provided user data
def evaluate_rule(ast, data):
    if ast.type == "operand":
        # Evaluate simple comparison: e.g., age > 30
        attr_value = data.get(ast.value['attribute'])
        operator = ast.value['operator']
        condition_value = ast.value['value']

        # Perform the comparison based on the operator
        if operator == '>':
            return attr_value > condition_value
        elif operator == '<':
            return attr_value < condition_value
        elif operator == '==':
            return attr_value == condition_value
        elif operator == '!=':
            return attr_value != condition_value
        elif operator == '>=':
            return attr_value >= condition_value
        elif operator == '<=':
            return attr_value <= condition_value
    elif ast.type == "operator":
        # Evaluate AND/OR logical operations
        if ast.value == "AND":
            return evaluate_rule(ast.left, data) and evaluate_rule(ast.right, data)
        elif ast.value == "OR":
            return evaluate_rule(ast.left, data) or evaluate_rule(ast.right, data)
    return False

@app.route('/')
def home():
    return 'Welcome to the Rule Engine API'

# API route to create an AST from a rule string
@app.route('/create_rule', methods=['POST'])
def create_rule():
    rule = request.json['rule']
    ast = create_ast(rule)
    if ast is None:
        return jsonify({'error': 'Invalid rule format'}), 400
    return jsonify(ast.to_dict())

# API route to evaluate the rule against user data
@app.route('/evaluate_rule', methods=['POST'])
def evaluate_rule_route():
    ast_json = request.json['ast']
    data = request.json['data']
    
    # Convert JSON back to Node object (deserialize)
    def node_from_dict(node_dict):
        if node_dict['type'] == "operand":
            return Node("operand", node_dict['value'])
        elif node_dict['type'] == "operator":
            left = node_from_dict(node_dict['left']) if node_dict['left'] else None
            right = node_from_dict(node_dict['right']) if node_dict['right'] else None
            return Node("operator", node_dict['value'], left, right)
    
    ast = node_from_dict(ast_json)
    result = evaluate_rule(ast, data)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(port=5000)
