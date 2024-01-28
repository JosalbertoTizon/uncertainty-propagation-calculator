const Operator = {
  Plus: Symbol("Plus"),
  Minus: Symbol("Minus"),
  Times: Symbol("Times"),
  Divided: Symbol("Divided")
};

const Number = {
  Numeric: Symbol("Numeric"),
  Variable: Symbol("Variable")
}

const Function = {
  NO_FUNCTION: Symbol("NO_FUNCTION"),
  PARENTHESIS: Symbol("PARENTHESIS"),
  EXP: Symbol("EXP"),
  LN: Symbol("LN"),
  LOG: Symbol("LOG"),
  SIN: Symbol("SIN"),
  COS: Symbol("COS"),
  TAN: Symbol("TAN")
}