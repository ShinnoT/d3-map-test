var express = require("express");
var app = express();
var path = require("path");

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
  //__dirname : It will resolve to your project folder.
});

app.listen(3000);
console.log("app running port 3000");
