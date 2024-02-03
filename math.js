let inputString;
let pos;

const isAlphaNumeric = (str) => {
  let alphaNumericPattern = /^[a-zA-Z0-9]+$/;
  return alphaNumericPattern.test(str);
}

export const parseInputString = (inputString_) => {
  inputString = inputString_;
  pos = 0;
}

const Operator = {
  Plus: Symbol("Plus"),
  Minus: Symbol("Minus"),
  Times: Symbol("Times"),
  Divided: Symbol("Divided")
};

const NumberType = {
  Numeric: Symbol("Numeric"),
  Variable: Symbol("Variable")
};

const Function = {
  NO_FUNCTION: Symbol("NO_FUNCTION"),
  PARENTHESIS: Symbol("PARENTHESIS"),
  EXP: Symbol("EXP"),
  LN: Symbol("LN"),
  LOG: Symbol("LOG"),
  SIN: Symbol("SIN"),
  COS: Symbol("COS"),
  TAN: Symbol("TAN")
};

export const Node = function() {
  this.isNumber;
  this.value;
  this.variableName;
  this.operator_;
  this.function_;
  this.numberType;
  this.lchild = null;
  this.rchild = null;
}

const toEnum = (operatorString) => {
  switch (operatorString) {
    case "+":
        return Operator.Plus;
    case "-":
        return Operator.Minus;
    case "*":
        return Operator.Times;
    case "/":
        return Operator.Divided;
  }
}

const skipWhitespace = () => {
  while(inputString[pos] == " ")
    ++ pos;
}

const getNumber = (node) => {
  let initialPos = pos;
  while(pos < inputString.length && (!isNaN(inputString[pos]) || inputString[pos] == "."))
    ++ pos;
  node.value = Number(inputString.slice(initialPos, pos));
}

const getVariable = (node) => {
  let initialPos = pos;
  while(pos < inputString.length && isAlphaNumeric(inputString[pos])) 
    ++ pos;
  node.variableName = inputString.slice(initialPos, pos);
}

const readFunction = (node) => {
  if(inputString[pos] == "(") {
    pos += 1;
    node.function_ = Function.PARENTHESIS;
    return;
  }

  switch(inputString.slice(pos, pos + 2)) {
    case "ex":
      pos += 4;
      node.function_ = Function.EXP;
      break;
    case "ln":
      pos += 3;
      node.function_ = Function.LN;
      break;
    case "lo":
      pos += 4;
      node.function_ = Function.LOG;
      break;
    case "si":
      pos += 4;
      node.function_ = Function.SIN;
      break;
    case "co":
      pos += 4;
      node.function_ = Function.COS;
      break;
    case "ta":
      pos += 4;
      node.function_ = Function.TAN;
      break;
    default:
      node.function_ = Function.NO_FUNCTION;
      break;
  }
}

const readOperator = (node) => {
  node.operator_ = toEnum(inputString[pos]);
  node.isNumber = false;
  ++ pos;
}

const readNumber = (node) => {
  let signal = 1;
  skipWhitespace();
  if(inputString[pos] == "-") {
    signal = -1;
    ++ pos;
  }
  if(!isNaN(inputString[pos])) {
    getNumber(node);
    node.value *= signal;
    node.numberType = NumberType.Numeric;
  }
  else {
    getVariable(node);
    node.numberType = NumberType.Variable
  }
  node.isNumber = true;
}

const evaluateFunction = (node, value) => {
  switch (node.function_) {
      case Function.EXP:
          return Math.exp(value);
      case Function.LN:
          return Math.log(value);
      case Function.LOG:
          return Math.log10(value);
      case Function.SIN:
          return Math.sin(value);
      case Function.COS:
          return Math.cos(value);
      case Function.TAN:
          return Math.tan(value);
      default:
          return value;
  }
}

export const readExpression = (node) => {
  node.lchild = new Node();
  node.rchild = new Node();

  skipWhitespace();
  readFunction(node.lchild);
  if(node.lchild.function_ != Function.NO_FUNCTION)
    readExpression(node.lchild);
  else readNumber(node.lchild);

  skipWhitespace();

  if(inputString[pos] == ")" || pos == inputString.length) {
    node.operator_ = Operator.Plus;
    node.isNumber = false;
    node.rchild.isNumber = true;
    node.rchild.value = 0;
    ++ pos;
    return node;
  }

  readOperator(node);

  skipWhitespace();
  readFunction(node.rchild);
  if(node.rchild.function_ != Function.NO_FUNCTION)
    readExpression(node.rchild);
  else readNumber(node.rchild);

  skipWhitespace();
  while(inputString[pos] != ")" && pos != inputString.length) {
    skipWhitespace();
    let newNode = new Node();
    readOperator(newNode);
    if(newNode.operator_ == Operator.Times || newNode.operator_ == Operator.Divided) {
      newNode.lchild = node.rchild;
      newNode.rchild = new Node();
      node.rchild = newNode;
      skipWhitespace();
      readFunction(newNode.rchild);
      if(newNode.rchild.function_ != Function.NO_FUNCTION)
        readExpression(newNode.rchild);
      else readNumber(newNode.rchild);
    }
    else {
      newNode.lchild = node;
      newNode.rchild = new Node();
      node = newNode;
      skipWhitespace();
      readFunction(node.rchild);
      if(node.rchild.function_ != Function.NO_FUNCTION)
        readExpression(node.rchild);
      else readNumber(node.rchild);
    }
  }
  ++ pos;
  return node;
}

export const computeExpression = (node) => {
  let left, right;
  if(!node.lchild.isNumber)
    left = evaluateFunction(node.lchild, computeExpression(node.lchild));
  else left = node.lchild.value;
  if(!node.rchild.isNumber)
    right = evaluateFunction(node.rchild, computeExpression(node.rchild));
  else right = node.rchild.value;
  switch(node.operator_) {
    case Operator.Plus:
      return left + right;
  case Operator.Minus:
      return left - right;
  case Operator.Times:
      return left * right;
  case Operator.Divided:
      return left / right;
  }
}

export const substituteVariable = (node, variable, value) => {
  if(Array.isArray(variable)) {
    for(let i = 0; i < variable.length; ++ i)
      substituteVariable(node, variable[i], value[i]);
    return;
  }
  if(node == null)
    return;
  if(node.isNumber && node.numberType == NumberType.Variable && node.variableName == variable)
    node.value = value;
  substituteVariable(node.lchild, variable, value);
  substituteVariable(node.rchild, variable, value);
}

export const evaluateDerivative = (node, variable, value) => {
  substituteVariable(node, variable, value + Math.sqrt(Number.EPSILON));
  let fPlus = computeExpression(node);
  substituteVariable(node, variable, value - Math.sqrt(Number.EPSILON));
  let fMinus = computeExpression(node);
  substituteVariable(node, variable, value);
  return (fPlus - fMinus) / (2*Math.sqrt(Number.EPSILON));
}

export const propagateUncertainty = (node, variable, value, delta) => {
  if(!Array.isArray(variable)) {
    return evaluateDerivative(node, variable, value) * delta;
  }
  let result = 0;
  substituteVariable(node, variable, value);
  for(let i = 0; i < variable.length; ++ i) {
    let derivative = evaluateDerivative(node, variable[i], value[i]);
    result += derivative * derivative * delta[i] * delta[i];
  }
  return Math.sqrt(result);
}

