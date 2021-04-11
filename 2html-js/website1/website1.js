console.log("hello from js file")
let num = 0;

function f(){
    let placeholder = document.getElementById("placeholder");
    let paragraph = document.createElement("p");
    paragraph.innerHTML="This is a paragraph " + num + " " + document.getElementById("field").value;
    ++num;
    placeholder.appendChild(paragraph)
}

function g(){
    let placeholder = document.getElementById("placeholder");
    console.log(placeholder.children)
    placeholder.removeChild(placeholder.children[0]);
}

function h(){
    console.log("mouseover")
}