var express = require("express");
var app = express();

/* serves main page */
app.get("/", function(req, res) {
	console.log("requesting index");
	res.sendFile(__dirname + '/public/index.html');
});

// app.post("/user/add", function(req, res) { 
// 	/* some server side logic  */
// 	res.send("OK");
// });

/* serves all the static files */
// app.get(/^(.+)$/, function(req, res){ 
// 	console.log('static file request : ' + req.params);
// 	res.sendFile( __dirname + req.params[0]); 
// });

app.use(express.static(__dirname + '/public/'));

app.get("*", function(req, res){
	console.log("requesting someting else");
	console.log(req.params);
});

var port = process.env.PORT || 5000;
	app.listen(port, function() {
	console.log("Listening on " + port);
});