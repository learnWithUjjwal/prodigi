var http = require('http');
var mail = require('nodemailer');
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");

var app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var db_config = {
  host: 'localhost',
  user:'root',
    password: '',
    database: 'test'
    
};

var con = mysql.createConnection(db_config);
con.connect((err)=>{
	if (err) console.log(err);
	else{
		console.log("conneected")
	}
})

var transporter = mail.createTransport({
	service:"gmail",
	auth:{
		user:"readyforgate@gmail.com",
		pass:"gatecracked"
	}
});


app.get('/login', (req, res)=>{
	res.sendFile(__dirname + '/form.html');
})

app.post('/register', (req, res)=>{
	var stm = "insert into login SET ?";
	var val = {
		name:req.body.name,
		email:req.body.email,
		mobile:req.body.mobile,

	};
	console.log(val)
	con.query(stm, val, (err, res)=>{
		if (err) console.log(err);
		else{
			console.log("success");
		}
	})



	var mailOptions = {
	from:"readyforgate@gmail.com",
	to:req.body.email,
	subject:"Hello From NodeJS",
	text:"http://localhost:8080/ver"

}

	transporter.sendMail(mailOptions, (err, info)=> {
	if (err)
		console.log(err)
	else
	{
		console.log("Email sent");
	}
	res.end("Email sent for verification");
})

})

app.get('/ver', (req, res)=>{
	var stm = "update login SET emailVer = 1";
	con.query(stm, (err, res)=>{
		if (err) console.log(err)
			else{
				console.log("Email Verfified");
			}
	})
	res.end("Email Verified");

})

app.get('/test', (req, res)=>{
	res.end("hello");
})

const port = process.env.PORT || '8080';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));