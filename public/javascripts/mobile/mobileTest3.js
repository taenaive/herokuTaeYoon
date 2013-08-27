//For mobileTest3 iframe

    //this is for browser that doesn't support console in production env.
    if (typeof console == "undefined") {
    this.console = { log: function (msg) { /*alert(msg);*/ } };
	}         		
    
	//Ajax document init
	$("document").ready(function(){
			
    			setInterval(getCurrencyDataFromServer,10000);
								    		
	});
    
    $(window).resize(function() {
			  //resize just happened, pixels changed
	});
     

	function getCurrencyDataFromServer(){
			
			 $.ajax({
			 	type: 'GET',			 	
			 	url: '/restapi/currency?q=btc_to_usd',
			 	dataType: "json",			 			 	
			 	success: postToPage,
			 	error:postError});
			 //"create (n {name:'mission', id:'2'}) return n;"
			 //"start a=node(5616), b=node(5617) create a-[r:child]->b return r;"
			 //"start a=node(5616) match (n)-[:CHILD]->(x) return x;"
	}
    function postError(jqXHR,status,err){
    	console.log("err out:" +err + " "+status);
    
		   	 	$("#ajxerror").text(status);
		   	 
    }
	function postToPage(data,status){
		     var myDate;
		     var displayDate; 
			 
			 if( data.err){
			 	  console.log('error' +data.err);
			 	$("#ajxerror").text(data.err);
			 }else{
			 	myDate = new Date();
		     	displayDate = (myDate.getMonth()+1) + '/' + (myDate.getDate()) +
		      	'/' + myDate.getFullYear() +" "+
		     	 myDate.getHours()+':'+myDate.getMinutes()+':'+myDate.getSeconds();
			 	$("#ajxerror").text("updated : "+ displayDate);
			 	$("#btc_to_usd").text(data.btc_to_usd);
			 }
			 
						
	}	
	