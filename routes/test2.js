
/*
 * GET users listing.
 */

exports.index = function(req, res){
	if ( req.session.user_id === undefined) {
    res.render('loginFrontPage1', { title: 'MACC Log in Page' });
  } else {
    res.render('test3', { title: 'MACC Test 3' });
  }
  
};