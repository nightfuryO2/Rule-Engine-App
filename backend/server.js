import db from './db.js'; // Add this line at the top with other imports
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createRule, evaluateRule, modifyRule } from './rules.js'


const app = express();
const PORT =  process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(bodyParser.json());

// Endpoint to create a rule
app.post('/create_rule', async (req, res) => {
  const { rule } = req.body;
  try {
    const ast = await createRule(rule); // calling function
    res.json(ast);
  } catch (error) {
    //console.error('Error creating rule:', error.message);
    res.status(500).send(`Error creating rule: ${error.message}`);
  }
});

// Endpoint to evaluate a rule
app.post('/evaluate_rule', async (req, res) => {
  const { ruleId, data } = req.body;
  if(!ruleId || !data){
    return res.status(400).send('Missing rulesId or data')
  }
  try {
    const result = await evaluateRule(ruleId, data);
    res.json(result);
  } catch (error) {
    res.status(500).send(`Error evaluating rule: ${error.message}`);
  }
});

// New endpoint to get all rules
app.get('/rules', (req, res) => {
  db.all('SELECT * FROM rules', [], (err, rows) => {
    if (err) {
      res.status(500).send(`Error fetching rules: ${err.message}`);
    } else {
      res.json(rows);
    }
  });
});

// New endpoint to modify a rule
app.post('/modify_rule', async (req, res) => {
  const { ruleId, newRule } = req.body;
  try {
    await modifyRule(ruleId, newRule);
    res.send('Rule modified successfully');
  } catch (error) {
    res.status(500).send(`Error modifying rule: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
