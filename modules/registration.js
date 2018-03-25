// Global Variables required 
var mysql = require("mysql");

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




function emailVerification(req, res){

	var stm = `update login SET emailVer = 1 where email = '${req.query.email}' and emailauth=${req.query.auth}`;
	con.query(stm, (err, res)=>{
		if (err) console.log(err)
			else{
				console.log("Email Verfified");
			}
	})
	res.end("Email Verified");
}









///////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORTS
module.exports.emailVerification = emailVerification;