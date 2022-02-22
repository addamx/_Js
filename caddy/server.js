const express = require("express");
const app = express();

app.get("/api", function (req, res) {
  res
    .status(200)
    // .set({ "Access-Control-Allow-Origin": "*" })
    .json({
      test: "teststset",
    });
});
app.get("/customer", function (req, res) {
  res.send("customer page");
});
app.get("/admin", function (req, res) {
  res.send("admin page");
});
app.get("/pending", function (req, res) {
  console.log("waiting....");
  new Promise((resolve) => {
    setTimeout(() => {
      res.send("done!!!");
    }, 5000);
  });
});
app.get("*", function (request, response) {
  response.end("404!");
});

var server = app.listen(9311, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("app listening at http://%s:%s", host, port);
});
