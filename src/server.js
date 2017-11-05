let express = require("express");

let app = express();

app.get("/", function(req, res) {
  res.sendFile("/public/index.html", { root: __dirname });
});

app.use(express.static(__dirname + "/public"));

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`app listening on port ${port}!`);
});
