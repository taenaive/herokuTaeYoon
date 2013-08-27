
/*
 * GET users listing.
 */
var request = require('superagent');

exports.index = function(req, res){
    
    var queryFromClient =req.body.cypherText+
    					" ( n:Person { name:'" + req.body.first +
    								 "' , lastName:'"+ req.body.last + "'})";
    var queryDuplicate = "start n=node(*) WHERE has(n.name) AND n.name=~'(?i)" + 
    								req.body.first + 
    									"' AND has(n.lastName) AND n.lastName=~'(?i)"+
    									req.body.last +
    									"' return n.name, n.lastName";
	console.log("Query from client: ", queryFromClient);
	console.log("Query duplicate check: ", queryDuplicate);
    
    request.post('http://localhost:7474/db/data/cypher').send({
		query : queryDuplicate
	}).end(function(resQuery){
		var jsonObj = JSON.parse(resQuery.text);
		console.log("query reuslt:" + resQuery.text);
		
		
		if ( typeof jsonObj.data === "undefined" ||jsonObj.data.length <= 0){
			//console.log("Json's data = " + jsonObj.data.length);
		    request.post('http://localhost:7474/db/data/cypher').send({
				query : queryFromClient
			}).end(function(resQuery){
					console.log("query reuslt:" + resQuery.text);
					request.post('http://localhost:7474/db/data/cypher').send({
					query : 'start n=node(*) MATCH n:Person return n.name, n.lastName'
					}).end(function(resQuery){
						res.send("responded with a resource :" + resQuery.text);
					});
			});
		}
		else{
			request.post('http://localhost:7474/db/data/cypher').send({
					query : 'start n=node(*) MATCH n:Person return n.name, n.lastName'
					}).end(function(resQuery){
						res.send("Same name exist! Must choose different name." + resQuery.text);
					});
			
		}
  	});
};