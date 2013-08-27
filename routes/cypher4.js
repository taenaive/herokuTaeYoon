
/*
 * GET users listing.
 */
var request = require('superagent');

exports.index = function(req, res){
    var i, tempString;
    var queryFromClient ="match (n:Mission)-[:child]->(x) where n.name='"+req.body.name+
    "' AND n.id='"+req.body.id +"' return x.name, x.id";
       
	console.log("Query from client: ", queryFromClient);
	    
    request.post('http://localhost:7474/db/data/cypher').send({
		query : queryFromClient
	}).end(function(resQuery){
		var jsonObj = JSON.parse(resQuery.text);
		console.log("query reuslt:" + resQuery.text);
				
		if ( typeof jsonObj.data === "undefined" ||jsonObj.data.length <= 0){
			res.send("sever failed to get the data");		
		}
		else{
			 
			for( i=0; i< jsonObj.data.length; ++i){
				if(tempString === undefined){
					tempString="";
				}
				else{
					tempString +=' , ';
				}
				tempString += '{"name":'+JSON.stringify(jsonObj.data[i][0])+', "id":'+
				JSON.stringify(jsonObj.data[i][1])+'}';
			}		

			res.send('{ "name":"'+req.body.name+'", "id":"'+req.body.id+'", "children": [ ' 
			+ tempString +'] }');

				
		}
  	});
};