import * as pou from "./math.js"

const expressionInput = document.querySelector("#expression-input");

expressionInput.addEventListener("focus", (e) => {
  if(e.target.value == "Enter expression")
    e.target.value = "";
});

expressionInput.addEventListener("blur", (e) => {
  if(e.target.value == "")
    e.target.value = "Enter expression";
})

const addVariableButton = document.querySelector(".add-variable");
const removeVariableButton = document.querySelector(".remove-variable");

const varBoxesContainer = document.querySelector(".var-boxes-container");
const varBoxCopy = document.querySelector(".var-box").cloneNode(true);
varBoxCopy.lastElementChild.removeChild(varBoxCopy.lastElementChild.lastElementChild);

const createVarBox = () => {
  let newVarBox = varBoxCopy.cloneNode(true);
  varBoxesContainer.appendChild(newVarBox);
  newVarBox.firstElementChild.addEventListener("click", removeVarBox);
  newVarBox.lastElementChild.appendChild(addVariableButton);
}

const removeVarBox = (e) => {
  if(varBoxesContainer.childElementCount == 1) {
    return;
  }
  varBoxesContainer.removeChild(e.target.parentElement);
  varBoxesContainer.lastElementChild.lastElementChild.appendChild(addVariableButton);
}

addVariableButton.addEventListener("click", createVarBox);
removeVariableButton.addEventListener("click", removeVarBox);

const calculateButton = document.querySelector(".calculate-button");

calculateButton.addEventListener("click", () => {
  let pouNode = new pou.Node();
  pou.parseInputString(expressionInput.value);
  pou.readExpression(pouNode);
  alert(pou.computeExpression(pouNode));
})




