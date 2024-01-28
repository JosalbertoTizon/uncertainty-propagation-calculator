let inputString;
let pos;

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

const Node = function() {
  this.isNumber;
  this.value;
  this.variableName;
  this.operator_;
  this.function_;
  this.numberType;
  this.lchild = Null;
  this.rchild = Null;
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
  while(typeof(inputString[pos]) === "number")
    ++ pos;
  node.value = Number(inputString.slice(initialPos, pos));
}

const getVariable = (node) => {
  node.variableName = inputString[pos];
  ++ pos;
}

const readFunction = (node) => {
  switch(inputString[pos]) {
    case "(":
      pos += 1;
      node.function_ = Function.PARENTHESIS;
      break;
    case "e":
      pos += 4;
      node.function_ = Function.EXP;
      break;
    case "l":
      pos += 1;
      if(inputString[pos] == "n") {
        pos += 2;
        node.function_ = Function.LN;
      }
      else {
        pos += 3;
        node.function_ = Function.LOG;
      }
      break;
    case "s":
      pos += 4;
      node.function_ = Function.SIN;
      break;
    case "c":
      pos += 4;
      node.function_ = Function.COS;
      break;
    case "t":
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
  if(typeof(inputString[pos]) === "number") {
    getNumber(node);
    node.value *= signal;
    node.numberType = NumberType.Numeric;
  }

  else {
    getVariable(node);
    node.numberType = NumberType.Variable
  }
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

