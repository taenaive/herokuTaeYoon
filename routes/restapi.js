/*
 * GET home page.
 */
var request = require('superagent');
var last_visit_date = Date.now();
exports.index = function(req, res){
   var exchangeSymbol = req.query.q;
   var currency;
   var date = Date.now();
   if( date - last_visit_date < 10000) {
         res.send('{"err":"server busy: ping slower!"}');
      return;
   }
   last_visit_date = date;
   console.log('currency request systemTime :' +date);
   currency =function(){
   		request.get('https://coinbase.com/api/v1/currencies/exchange_rates')
		.end(function(resQuery){
				var jsonObj;
             
             if (resQuery){
                   try{
                       jsonObj=JSON.parse(resQuery.text);
                   }catch(e){                       
                       console.log(e);
                       res.send('{"err":"coninbase sever responded with wrong data"}');
                       return;
                   }
               }
              else{
                   res.send('{"err":"coninbase server failed to reply"}');
                   return;
              }
										
				if ( typeof jsonObj[exchangeSymbol] === "undefined" ||jsonObj.length <= 0){
					res.send('{"err":"server failed to get the data check exchange symbol"}');		
				}
				else{			 
					console.log(exchangeSymbol +" query reuslt:" + jsonObj[exchangeSymbol]);
					res.send('{ "'+exchangeSymbol+'":"'+jsonObj[exchangeSymbol]+'"}');		
				}
  			});
   }
   switch (req.params.name) {
   		case "currency":
   				currency();
   			break;
   		default:
   			res.send('parameter passed to my server: ' + req.params.name +" query: "+ exchangeSymbol);
   			break;
   }

   
   
};