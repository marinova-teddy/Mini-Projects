var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});
app.get('/sheet.js', function(req, res){
  res.sendFile(__dirname + "/sheet.js");
});

app.get('/images/*', function(req,res) {
  res.sendFile(__dirname+req.path);
});

let colors=["gray", "gold", "forestgreen", "firebrick", "dodgerblue", "violet"];
//salmon, darkviolet, gold, crimson, deepskyblue, seagreen, teal

let usr = []
io.on('connection', function(socket){
  index=usr.length;
  usr.push({
    ind: index,
    color: colors[index%6],
    selected: "A1"
  });
  socket.emit("init", usr, index);
  io.emit("update", usr);

  socket.on("usrclick", (ind, id) => {
    usr[ind].selected=id;
    io.emit("update", usr);
  });

  socket.on("newValue", (value, id) => {
    io.emit("newValue", value, id);
  });
});

http.listen(80, function(){
  console.log("server started");
});