let socket = io();

let username;

socket.on("login_fail", ()=>{
    alert("Username or password is wrong!");
});

function addProduct(p){
    let pr_list = document.getElementById("product_list");
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td1.innerHTML = p.name;
    td2.innerHTML = p.price;
    tr.appendChild(td1);
    tr.appendChild(td2);
    pr_list.appendChild(tr);
}

socket.on("login_success_seller", (user, products, money)=>{
    console.log(user, products, money);
    username = user;
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("products").style.display = "block";
    document.getElementById("money").innerHTML = "You have $" + money;
    for (let p of products){
        addProduct(p);
    }
});

socket.on("new_product", (name, price, seller_name) => {
    if (seller_name == username){
        addProduct({name, price});
    }
});

function loginSeller(e){
    e.preventDefault();
    console.log("hello");
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    socket.emit("login_seller", username, password);
}

function createProduct(e){
    e.preventDefault()
    let name = document.getElementById("product_name").value;
    let price = document.getElementById("product_price").value;
    socket.emit("create_product", name, price);
}