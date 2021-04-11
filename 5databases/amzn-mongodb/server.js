var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var MongoClient = require("mongodb").MongoClient;

let db;

MongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, con) => {
    if (err) throw err;
    db = con.db("amzn");

    http.listen(80, function(){
        console.log("server started");
    });
})


app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});
app.get('/index.js', function(req, res){
    res.sendFile(__dirname + "/index.js");
});
app.get('/register', function(req, res){
    res.sendFile(__dirname + "/register.html");
})
app.get('/register.js', function(req, res){
    res.sendFile(__dirname + "/register.js");
});
app.get('/seller', function(req, res){
    res.sendFile(__dirname + "/seller.html");
})
app.get('/seller.js', function(req, res){
    res.sendFile(__dirname + "/seller.js");
});

io.on('connection', function(socket){
    let id, user, money;
    socket.on("register", (username, password, type)=>{
        if (type=="Customer"){
            db.collection("users").insertOne({username, password, money: 0}, (err, res)=>{
                if (err) socket.emit("register_fail");
                else socket.emit("register_success");
            })
        }
        if (type=="Seller"){
            db.collection("sellers").insertOne({username, password, money: 0}, (err, res)=>{
                if (err) socket.emit("register_fail");
                else socket.emit("register_success");
            })
        }
    });
    socket.on("login_seller", (username, password) => {
        db.collection("sellers").findOne({username, password}, (err, res)=>{
            if (err || res==null) socket.emit("login_fail");
            else{
                id = res._id;
                user = username;
                money = res.money;
                db.collection("products").find({seller_id: id}).toArray((err, res)=>{
                    if (err) return socket.emit("login_fail");
                    socket.emit("login_success_seller", username, res, money);
                })
            }
        })
    });
    socket.on("create_product", (name, price) => {
        db.collection("products").insertOne({name, price, seller_id: id}, (err, res)=>{
            if (err) socket.emit("product_error");
            else{
                io.emit("new_product", name, price, user);
            }
        })
    });
    socket.on("login_user", (username, password) => {
        db.collection("users").findOne({username, password}, (err, res)=>{
            if (err || res==null) socket.emit("login_fail");
            else{
                id = res._id;
                user = username;
                money = res.money;
                db.collection("orders").find({user_id: id}).toArray((err, res)=>{
                    if (err) return socket.emit("login_fail");
                    socket.emit("login_success_user", username, res, money);
                });
            }
        })
    });
    socket.on("order_list", () => {
        db.collection("products").find({}).toArray((err, res)=>{
            if (err) return socket.emit("order_list_fail");
            socket.emit("order_list", res);
        })
    })
    socket.on("create_order", (name, price) => {
        db.collection("orders").insertOne({name, price, user_id: id}, (err, res)=>{
            if (err) socket.emit("order_error");
            else{
                io.emit("new_order", name, price, user);
            }
        });
    });
    socket.on("add_money_user", (username, money) => {
        db.collection("users").updateOne({username}, { $set: {money} }, (err, res) => {
            if (err) socket.emit("add_money_error");
            else socket.emit("updated_money_user", money);
        });
    });
});