var http = require('http');
var mail = require('nodemailer');
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");

var app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DATABASE CONFIGURATION
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Mail configuration

var transporter = mail.createTransport({
	service:"gmail",
	auth:{
		user:"readyforgate@gmail.com",
		pass:"gatecracked"
	}
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/signup', (req, res)=>{
	res.sendFile(__dirname + '/form.html');
})

app.get('/login', (req, res)=>{
	res.sendFile(__dirname + '/login.html');
})

/////////////////////////////////////////////////////////////////////////////////////////////
//Route handler for first time register
app.post('/register', (req, res)=>{
	var auth = Math.floor((Math.random()*1000000)+1);
	var stm = "insert into login SET ?";
	var val = {
		emailauth:auth,
		name:req.body.name,
		email:req.body.email,
		mobile:req.body.mobile,
		password:req.body.password

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
	text:`http://localhost:8080/ver?email=${req.body.email}&auth=${auth}`

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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Root handler for after login verification

app.post('/loginreg', (req, res)=>{
	email=req.body.email;
	password = req.body.password;
	console.log(email);
	stm=`select * from login where email = '${email}' and password = '${password}'`;
	con.query(stm, (err, data)=>{
		if (err) console.log(err)
			else{
				console.log(data)
				if(!data[0]){
					res.write("Email is not registered or password is incorrect");
					res.end();
				}
				else{
					if(data[0].emailVer == 0){
						console.log("not verified");
						res.write("Email not Verified");
						res.end();
					}
					else{
						res.send("profile.html");
						res.end();
					}
				}
			}
	})
	
})
var emailver = require('./modules/registration.js')
app.get('/ver', (req, res)=>{
	emailver.emailVerification(req, res);
})
///////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/profilecomp', (req, res)=>{
	res.sendFile(__dirname + '/profile.html');
})

app.post('/profilecomp', (req, res)=>{
	if(req.body.other == ''){
		var data={
			sscid:req.body.sscid
		}
		var stm = "update login SET ? where"
		con.query(stm, req.body, (err, data)=>{
			if (err) console.log(err)
				else{
					res.write("Profile Completed");
				}
		})
	}
	else{
// 		SELECT *
// FROM Person
// ORDER BY PersonID DESC
// LIMIT 1

var stm = "select iid from institute order by iid DESC limit 1";
con.query(stm, (err, data)=>{
	if (err) console.log(err)
		else{
			var key = JSON.stringify(data[0].iid);
			console.log(key);
			var newkey = key.slice(2,key.length);
			console.log(newkey);
			var intkey = parseInt(newkey);
			intkey++;
			console.log(intkey);
			var a = 's'+intkey;
			console.log(a);
			var dataobj = {
				iid:a,
				name:req.body.other
				}
			var stm = "insert into institute SET ?";
			con.query(stm, dataobj, (err, result)=>{
				if (err) console.log(err);
				else{
					req.body.sscid = a;
					var stm = "insert into login SET ?";
					con.query(stm, req.body, (err, data)=>{
						if (err) console.log(err)
							else{
								res.write("Profile Completed");
							}
					})
				}
			})
		}
})
	}
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//CREATING SERVER 
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