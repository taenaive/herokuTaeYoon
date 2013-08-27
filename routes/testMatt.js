
/*
 * GET users listing.
 */

exports.index = function(req, res){
  res.render('testMatt', { title: 'MACC2 PFV Prototype' });
  //res.send("TODO: respond with a user resources");
};