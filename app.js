global.window = {
  addEventListener: function(){return undefined;},
  removeEventListener: function(){return undefined;}
};

var http = require('http');
var mail = require('nodemailer');
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var firebase = require("firebase");
var firebaseui = require("firebaseui");

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////


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

// OTP VERIFICATION USING FIREBASE



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB6xmft0t6PNQfWxuC5iL3h9xS7gvBmF10",
    authDomain: "fbms-5ead2.firebaseapp.com",
    databaseURL: "https://fbms-5ead2.firebaseio.com",
    projectId: "fbms-5ead2",
    storageBucket: "",
    messagingSenderId: "200219049520"
  };
  firebase.initializeApp(config);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
	var stm = "select uid from login order by uid DESC limit 1";
con.query(stm, (err, data)=>{
	if (err) console.log(err)
		else{
			var key = JSON.stringify(data[0].uid);
			console.log(key);
			var newkey = key.slice(2,key.length);
			console.log(newkey);
			var intkey = parseInt(newkey);
			intkey++;
			console.log(intkey);
			var a = 'u'+intkey;
			console.log(a);

			var stm = "insert into login SET ?";
	var val = {
		uid:a,
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
						console.log("login successful");
						res.sendFile(__dirname + '/profile.html');
						
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
					res.end();
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
					console.log("profile completed");
					req.body.sscid = a;
					res.write("Profile Completed");
					res.end();
					// var stm = "insert into login SET ?";
					// con.query(stm, req.body, (err, data)=>{
					// 	if (err) console.log(err)
					// 		else{
					// 			res.write("Profile Completed");
					// 		}
					// })
				}
			})
		}
})
	}
})


////////////////////////////////////////////////////////////////////////////////////////////////////////
 
//Registeration authemtification using firebase

app.post('/register1', (req, res) => {
	const email = req.body.email;
	const pass  = req.body.password;
	const auth = firebase.auth();
	const promise = auth.createUserWithEmailAndPassword(email, pass);
	promise
	.then(e=>{
		console.log('inside then');
		if (e) console.log(e);
	})
	.catch( e => console.log(e.message));

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//Testing for phone authentication

app.get('test1', (req, res) => {
res.sendFile(__dirname + '/test1.html');
})

//Login for user

app.post('/loginreg1', (req, res) => {
	const email = req.body.email;
	const pass  = req.body.password;
	const auth = firebase.auth();
	const promise = auth.signInWithEmailAndPassword(email, pass);
	promise
	.then(e=>{
		console.log('inside then');
		if (e) console.log(e);
	})
	.catch( e => console.log(e.message));

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