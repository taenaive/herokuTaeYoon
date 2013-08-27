
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('index2', { title: 'MACC 2' });
  //res.send("TODO: respond with a user resources");
};