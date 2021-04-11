function add() {
  let placeholder=document.getElementById("placeholder");
  let first=document.getElementById("first").value;
  let second=document.getElementById("second").value;
  let result=document.createElement("p");
  let ans=Number(first)+Number(second);
  result.innerHTML=first+" + "+second+" = "+ans;
  if (placeholder.children.length==1) {placeholder.removeChild(placeholder.children[0]);}
  placeholder.appendChild(result);
}

function subtract() {
  let placeholder=document.getElementById("placeholder");
  let first=document.getElementById("first").value;
  let second=document.getElementById("second").value;
  let result=document.createElement("p");
  let ans=Number(first)-Number(second);
  result.innerHTML=first+" - "+second+" = "+ans;
  if (placeholder.children.length==1) {placeholder.removeChild(placeholder.children[0]);}
  placeholder.appendChild(result);
}

function multiply() {
  let placeholder=document.getElementById("placeholder");
  let first=document.getElementById("first").value;
  let second=document.getElementById("second").value;
  let result=document.createElement("p");
  let ans=Number(first)*Number(second);
  result.innerHTML=first+" . "+second+" = "+ans;
  if (placeholder.children.length==1) {placeholder.removeChild(placeholder.children[0]);}
  placeholder.appendChild(result);
}

function divide() {
  let placeholder=document.getElementById("placeholder");
  let first=document.getElementById("first").value;
  let second=document.getElementById("second").value;
  let result=document.createElement("p");
  let ans=Number(first)/Number(second);
  result.innerHTML=first+" : "+second+" = "+ans;
  if (placeholder.children.length==1) {placeholder.removeChild(placeholder.children[0]);}
  placeholder.appendChild(result);
}

function clearField() {
  console.log("clear")
  let placeholder=document.getElementById("placeholder");
  if (placeholder.children.length==1) {placeholder.removeChild(placeholder.children[0]);}
}

function move() {
  let newX = Math.random()*600;
  let newY = 100 + Math.random()*600;
  newX+="px";
  newY+="px";
  console.log(newX);
  console.log(newY);
  let button = document.getElementById("moving");
  button.style.left=newX;
  button.style.top=newY;
}