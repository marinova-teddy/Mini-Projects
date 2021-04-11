let socket = io();

let username;

socket.on("login_fail", ()=>{
	alert("Username or password is wrong!");
});

socket.on("order_list_fail", ()=>{
	alert("Error!");
});

socket.on("add_money_error", ()=>{
	alert("Error!");
});

function addOrder(o){
	let or_list = document.getElementById("order_list");
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td1.innerHTML = o.name;
    td2.innerHTML = o.price;
	td2.className = "orderedPrice";
    tr.appendChild(td1);
    tr.appendChild(td2);
    or_list.appendChild(tr);
}

socket.on("login_success_user", (user, orders, money)=>{
	username = user;
	document.getElementById("loginDiv").style.display = "none";
	document.getElementById("orders").style.display = "block";
	document.getElementById("money").innerHTML = "You have $" + money;
	for (let o of orders){
		addOrder(o);
	}
	socket.emit("order_list");
});

socket.on("new_order", (name, price, user_name) => {
    if (user_name == username){
        addOrder({name, price});
    }
});

function loginUser(e){
	e.preventDefault();
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	socket.emit("login_user", username, password);
}

socket.on("order_list", (allOrders) => {
	for (let o of allOrders) {
		let ordersDiv = document.getElementById("ordersDiv");
		let order = document.createElement("div");
		order.className = "order";
		order.id = "order" + o._id;

		let orderName = document.createElement("h3");
		orderName.innerHTML = o.name;
		order.appendChild(orderName);

		let orderPrice = document.createElement("p");
		orderPrice.innerHTML = "$" + o.price;
		order.appendChild(orderPrice);

		let orderForm = document.createElement("form");
		
		let orderInput = document.createElement("input");
		orderInput.type = "submit";
		orderInput.value = "Add order";
		orderForm.appendChild(orderInput);
		orderForm.onsubmit = function createOrder(event) {
			event.preventDefault();
			socket.emit("create_order", o.name, o.price);
		};
		order.appendChild(orderForm);

		ordersDiv.appendChild(order);
	}
});

function calculateMoney() {
	let tbody = document.getElementById("order_list");
	let sum = 0;
	for (let price of document.getElementsByClassName("orderedPrice")) {
		sum += parseFloat(price.innerHTML);
	}
	let money = document.getElementById("money").innerHTML;
	money = money.replace('You have $', '');
	money = parseFloat(money);
	if (money>=sum) {
		alert("Yes! You will have $" + (money-sum) + " left.");
	} else alert("No! You need $" + (sum-money) + " more.")
}

function addMoney() {
	let money = prompt("I want to add $", "");
	if (money == null || money == "") {
		alert("Error!");
	} else {
		socket.emit("add_money_user", username, money);
	}
}

socket.on("updated_money_user", (money) => {
	document.getElementById("money").innerHTML = "You have $" + money;
});