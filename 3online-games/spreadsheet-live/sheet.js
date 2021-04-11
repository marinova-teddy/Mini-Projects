let socket=io();
let myName="", ind, usr =[];

socket.on("init", (user, index) => {
  usr=user;
  ind=index;
});

socket.on("update", (user) => {
  usr=user;
  for (let i=0;i<usr.length;i++) {
    document.getElementById(usr[i].selected).style.backgroundColor=usr[i].color;
  }
});

// socket.on("newValue", (value, id) => {

// });

function saveName(e) {
  e.preventDefault();
  myName = document.getElementById("name").value;
  let nameInputDiv = document.getElementById("nameInputDiv");
  nameInputDiv.style.display = "none";
  let placeholder = document.getElementById("placeholder");
  let heading = document.getElementById("heading");
  placeholder.style.display = "block";
  heading.style.display = "block";
  heading.innerHTML = "Hello, " + myName;
}

function calculateExpression(string) {
  let value;
  let start=1;
  let len=1;
  let sign;
  for (let i=1;i<string.length;i++) {
    if (string.charAt(i)>='0' && string.charAt(i)<='9') {len++;}
    else {
      if (start==1) {
        value=Number(string.substring(start,start+len));
        console.log("first time value");
        console.log(value);
        start=i+1;
        len=1;
        sign = string.charAt(i+1);
        i++;
      }
      else {
        console.log(start, len);
        sign = string.charAt(i);
        start=i+1;
        len=1;
        switch (sign) {
          case '+': value+=Number(string.substring(start,start+len)); break;
          case '-': value-=Number(string.substring(start,start+len)); break;
          case '*': value*=Number(string.substring(start,start+len)); break;
          case '/': value/=Number(string.substring(start,start+len)); break;
        }
      }
    }
  }
  return value;
}

let div = document.getElementById("placeholder");
let table = document.createElement("table");
table.appendChild(document.createElement("tbody"));

for (let i=0;i<100;i++) {
  table.children[0].appendChild(document.createElement("tr"));
  for (let j=0;j<26;j++) {
    let td = document.createElement("td");
    td.id=String.fromCharCode(65+j)+i;
    let initialValue = td.innerHTML;
    td.innerHTML = "";
    let form = document.createElement("form");
    form.appendChild(document.createElement("input"));
    form.children[0].type="text";
    form.children[0].value=initialValue;
    td.appendChild(form);
    td.addEventListener("click", function(){
      socket.emit("usrclick", ind, td.id);
    })
    form.addEventListener("submit", function(e){
      e.preventDefault();
      let value = form.children[0].value;
      socket.emit("newValue", value, form.children[0].id);
      if (value.startsWith("=")) {
        value=calculateExpression(value);
      }
      form.parentElement.innerHTML = value;
    })
    table.children[0].children[i].appendChild(td);
    table.children[0].children[i].children[j].innerHTML=0;
  }
}
div.appendChild(table);
