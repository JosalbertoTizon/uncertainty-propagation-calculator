import * as pou from "./math.js"

const textWhenFocus = (text) => {
  return (e) => {
  if(e.target.value == text)
  e.target.value = "";
  }
}

const textWhenBlur = (text) => {
  return (e) => {
    if(e.target.value == "")
    e.target.value = text;
  }
}

const expressionInput = document.querySelector("#expression-input");
const variableName = document.querySelector(".variable-name");
const variableValue = document.querySelector(".variable-value");
const variableError = document.querySelector(".variable-error");

expressionInput.addEventListener("focus", textWhenFocus("Enter expression"));
expressionInput.addEventListener("blur", textWhenBlur("Enter expression"));

variableName.addEventListener("focus", textWhenFocus("Name"));
variableName.addEventListener("blur", textWhenBlur("Name"));

variableValue.addEventListener("focus", textWhenFocus("Value"));
variableValue.addEventListener("blur", textWhenBlur("Value"));

variableError.addEventListener("focus", textWhenFocus("Error"));
variableError.addEventListener("blur", textWhenBlur("Error"));

const addVariableButton = document.querySelector(".add-variable");
const removeVariableButton = document.querySelector(".remove-variable");

const varBoxesContainer = document.querySelector(".var-boxes-container");
const varBoxCopy = document.querySelector(".var-box").cloneNode(true);
varBoxCopy.lastElementChild.removeChild(varBoxCopy.lastElementChild.lastElementChild);

const createVarBox = () => {
  let newVarBox = varBoxCopy.cloneNode(true);
  varBoxesContainer.appendChild(newVarBox);
  newVarBox.firstElementChild.addEventListener("click", removeVarBox);
  let variableInputArray = Array.from(newVarBox.lastElementChild.firstElementChild.children);
  variableInputArray[0].addEventListener("focus", textWhenFocus("Name"));
  variableInputArray[0].addEventListener("blur", textWhenBlur("Name"));
  variableInputArray[1].addEventListener("focus", textWhenFocus("Value"));
  variableInputArray[1].addEventListener("blur", textWhenBlur("Value"));
  variableInputArray[2].addEventListener("focus", textWhenFocus("Error"));
  variableInputArray[2].addEventListener("blur", textWhenBlur("Error"));
  newVarBox.lastElementChild.appendChild(addVariableButton);
}

const removeVarBox = (e) => {
  if(varBoxesContainer.childElementCount == 1) 
    return;
  varBoxesContainer.removeChild(e.target.parentElement);
  varBoxesContainer.lastElementChild.lastElementChild.appendChild(addVariableButton);
}

addVariableButton.addEventListener("click", createVarBox);
removeVariableButton.addEventListener("click", removeVarBox);

const calculateButton = document.querySelector(".calculate-button");

calculateButton.addEventListener("click", () => {
  let variableAttributeArray = [[], [], []];
  let varBoxesArray = varBoxesContainer.children;
  Array.from(varBoxesArray).forEach(element => {
    let variableInputArray = Array.from(element.lastElementChild.firstElementChild.children);
    variableAttributeArray[0].push(variableInputArray[0].value)
    variableAttributeArray[1].push(Number(variableInputArray[1].value))
    variableAttributeArray[2].push(Number(variableInputArray[2].value))
  });  
  let pouNode = new pou.Node();
  pou.parseInputString(expressionInput.value);
  pou.readExpression(pouNode);
  pou.substituteVariable(pouNode, variableAttributeArray[0], variableAttributeArray[1]);
  alert(pou.propagateUncertainty(pouNode, variableAttributeArray[0], variableAttributeArray[1], variableAttributeArray[2]));
})




