/*
 * Handle logins.
 */
var pg = require('pg');
var crypto = require('crypto');

exports.index = function(req, res){

  var post = req.body;

  var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
  var key = 'VSkgZmUaqxnMaSvjNExDZvKX';
  var pass =  post.password;
  var cipher = crypto.createCipher(algorithm, key);  
  var encrypted = cipher.update(pass, 'utf8', 'hex') + cipher.final('hex');
  var query;
  // var decipher = crypto.createDecipher(algorithm, key);
  // var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  
  //heroku or localhosts for tae
  var consString = process.env.DATABASE_URL || "postgres://postgres:tae123456@localhost/postgres";
  
  pg.connect( consString , function(err, client) {
    			 if(err) {
              console.error('could not connect to postgres', err);
					   return  res.render('loginFrontPage1', 
                        { title: 'Server failed Try Later!' });
           
				  }
				  query = client.query("SELECT username,password FROM app_users WHERE username='"+
                                    post.user.toLowerCase()+"' AND password='"+ encrypted +"'");

				  query.on('row', function(row) {

            //not found
            if (!row) {
                      console.log("row not found!");
                      return res.render('loginFrontPage2', 
                                { title: 'usr/pass not recognized try again?' });
            }
            else{//found
                 console.log("psql addr: "+process.env.DATABASE_URL);
					       console.log(JSON.stringify(row));
                 req.session.user_id = post.user.toLowerCase();
                  
                 return res.redirect('/test3');
                }
          });
          query.on('error', function(error) {
            //handle the error
            console.log("error  on query: " +error);
            });
          query.on('end', function(result) {
            console.log("end query reached! " + result.rowCount);
              client.end();
            if(result.rowCount !== 1){  
              return res.render('loginFrontPage2', 
                                { title: 'User id and password is not recognized.',
                                   formTitle: 'Try Again?'} );
            }
          });
	});
    

};