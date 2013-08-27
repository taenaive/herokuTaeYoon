/*
 * Handle logins.
 */
var pg = require('pg');
var crypto = require('crypto');

exports.index = function(req, res){

  var post = req.body;

  var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
  var key = 'VSkgZmUaqxnMaSvjNExDZvKX';
  var text =  post.password; //'macc2';
  var cipher = crypto.createCipher(algorithm, key);  
  var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');  

  var consString = process.env.DATABASE_URL || "postgres://postgres:tae123456@localhost/postgres";

  var errorMsg;

  if( post.user.toLowerCase() !== '' && post.password !== '')
  {
    pg.connect( consString , function(err, client) {
          if(err) {
                 console.error('could not connect to postgres', err);                 
                 return res.render('signup', { title: '<=Server Error Try Later=>' });                 
                }

          client.query('INSERT INTO app_users(username,password) values($1,$2) RETURNING id',
                        [post.user.toLowerCase(), encrypted],
                        function(err, result) {
                          var resMsg;
                          if (err) {
                              console.log(err);
                              errorMsg = err;
                          } else {
                              console.log('row inserted with id: ' + result.rows[0].id);
                          }
                          resMsg = (( errorMsg === undefined) ? 
                                        'Sign up success! proceed to log in' :
                                        'Duplicate user name found try different ID!');
   
                          res.render('signup', { title: resMsg });
                          }

          );

          var query = client.query("SELECT username,password FROM app_users");
         
          query.on('row', function(row) {
            console.log(row);
          });
          query.on('end', function() {
              client.end();
          });
          
        });
   
    
   
    
  } else {
    res.render('signup', { title: 'MACC sign up page ( failed attempt... retry!)' });
  }
  
  
};