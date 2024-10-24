import axios from 'axios';
import db from './db.js';

// Create a rule and store in the database
export const createRule = async (rule) => {
  // Basic validation of rule string
  if (!rule || typeof rule !== 'string') {
    throw new Error('Invalid rule string');
  }
  try {
    const response = await axios.post('http://localhost:5000/create_rule', { rule }); //sends a req to python backend service.
    const ast = response.data; // receives response from python file in JSON format.
    console.log(ast)

    db.run('INSERT INTO rules (rule, ast) VALUES (?, ?)', [rule, JSON.stringify(ast)], function(err) {
      if (err) {
        console.error(err.message);
      }
      //console.log(`Rule inserted with ID: ${this.lastID}`);
    });

    return ast;
  } catch (error) {
    console.error('Error creating rule:', error.message);
    throw new Error('Failed to create rule');
  }
};


// Combine multiple rules into a single AST
export const combineRules = async (rules) => {
  try {
    const combinedAST = await Promise.all(rules.map(createRule))
      .then((asts) => asts.reduce((acc, ast) => combineAST(acc, ast), null));
    return combinedAST;
  } catch (error) {
    console.error('Error combining rules:', error.message);
    throw new Error('Failed to combine rules');
  }
};

// Helper function to create AST from rule string
//const createASTFromRule = async (rule) => {
  // Assume we already have the createAST function from the Python service
  //const response = await axios.post('http://localhost:5000/create_rule', { rule });
  //return response.data;
//};

// Combine two ASTs
const combineAST = (ast1, ast2) => {
  if (!ast1) return ast2;
  if (!ast2) return ast1;

  return {
    type: 'operator',
    value: 'AND',
    left: ast1,
    right: ast2,
  };
};

// Evaluate rule against user data
export const evaluateRule = (ruleId, data) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT ast FROM rules WHERE id = ?', [ruleId], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return reject(err);
      }
      if (row) {
        const ast = JSON.parse(row.ast);
        const result = evaluate(ast, data);
        resolve({ result});
      } else {
        console.error('No rule found with ID', ruleID);
        resolve({ result: false });
      }
    });
  });
};

// Basic evaluation function (modify according to AST structure)
const evaluate = (ast, data) => {
  if (ast.type === 'operand') {
    const { attribute, operator, value } = ast.value;
    
    // Check if the attribute exists in the data object
    if (typeof data[attribute] === 'undefined') {
      console.error(`Attribute "${attribute}" not found in data.`);
      return false; // or handle it as needed
    }

    switch (operator) {
      case '>': return data[attribute] > value;
      case '<': return data[attribute] < value;
      case '==': return data[attribute] === value;
      default: return false;
    }
  }
  if (ast.type === 'operator'){
    const leftResult = evaluateRule(ast.left, data);
    const rightResult = evaluate(ast.right, data);
    if(ast.value === 'AND'){
      return leftResult && rightResult;
    }else if (ast.value === 'OR'){
      return leftResult||rightResult
    }else{
      console.error(`Unknown operator "${ast.value}"`)
      return false;
    }

  }
  return false;
};


// Modify an existing rule
export const modifyRule = async (ruleId, newRule) => {
  try {
    const ast = await createRule(newRule); // Create new AST
    db.run('UPDATE rules SET rule = ?, ast = ? WHERE id = ?', [newRule, JSON.stringify(ast), ruleId], (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Rule with ID ${ruleId} modified`);
      }
    });
  } catch (error) {
    console.error('Error modifying rule:', error.message);
  }
};


