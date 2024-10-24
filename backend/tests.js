import { createRule, evaluateRule, combineRules } from './rules.js';

const runTests = async () => {
  // Test 1: Create individual rules
  try {
    const rule1 = 'age > 30 AND department = \'Sales\'';
    const rule2 = 'age < 25 AND department = \'Marketing\'';

    const ast1 = await createRule(rule1);
    const ast2 = await createRule(rule2);

    //console.log('Rule 1 AST:', ast1);
    //console.log('Rule 2 AST:', ast2);

    // Test 2: Combine rules
    const combinedAST = combineRules([rule1, rule2]);
    console.log('Combined AST:', combinedAST);

    // Test 3: Evaluate rules
    const testData1 = { age: 35, department: 'Sales', salary: 60000, experience: 6 };
    const testData2 = { age: 20, department: 'Marketing', salary: 40000, experience: 2 };

    const evalResult1 = await evaluateRule(1, testData1); // Assuming ruleId 1 corresponds to rule1
    const evalResult2 = await evaluateRule(2, testData2); // Assuming ruleId 2 corresponds to rule2

    //console.log('Evaluation Result for Rule 1:', evalResult1.result);
    //console.log('Evaluation Result for Rule 2:', evalResult2.result);
  } catch (error) {
    console.error('Test failed:', error);
  }
};

runTests();
