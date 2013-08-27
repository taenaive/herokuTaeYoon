/*
 * GET signup page.
 */

exports.index = function(req, res){
  res.render('signup', { title: 'MACC sign up page' });
  //res.send("TODO: respond with a user resources");
};