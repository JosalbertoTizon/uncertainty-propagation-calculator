import * as math from "./math.js"

const expressionInput = document.querySelector("#expression-input");
let expression;

expressionInput.addEventListener("focus", (e) => {
  if(e.target.value == "Enter expression")
    e.target.value = "";
});

expressionInput.addEventListener("blur", (e) => {
  if(e.target.value == "")
    e.target.value = "Enter expression";
  expression = e.target.value;
})

const calculateButton = document.querySelector(".calculate-button");




