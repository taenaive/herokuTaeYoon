
/*
 * GET users listing.
 */

exports.index = function(req, res){
  res.render('test1', { title: 'MACC Test 1' });
  //res.send("TODO: respond with a user resources");
};