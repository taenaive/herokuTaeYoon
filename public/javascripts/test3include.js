
    //For Test4 demo

    //this is for browser that doesn't support console in production env.
    if (typeof console == "undefined") {
    this.console = { log: function (msg) { /*alert(msg);*/ } };
	}

               		
        
	// check browser type and warn if it is not supported.
	navigator.sayswho= (function(){
		    var N= navigator.appName, ua= navigator.userAgent, tem;
		    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		    M= M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];

		    return M;
		})();
		
	window.onload = function(e){			
			if (navigator.sayswho[1] !== undefined){
				if ( navigator.userAgent.match(/(chrome|safari|firefox)\/?\s*(\.?\d+(\.\d+)*)/i) == null ){
					// window.confirm("Your Browser is not supported. Use Chrome, safari or firefox instead!");
				}
				document.getElementById("warn").innerHTML="<p>Your Browser: "+navigator.sayswho[0]+
												" (version: "+navigator.sayswho[1]+")</p>";
				
			}
		
	};
		
	//Ajax document init
	$("document").ready(function(){

			//$('#cypherButton').bind('click', getInfoFromServer);
			var e0, e1, e11, e2;			
			$( "#tabs" ).tabs();			
			//arranging  2  dynamic layers.
			jsPlumb.Defaults.Container = $("#map-canvas-content");
			jsPlumb.Defaults.PaintStyle = {
											    lineWidth:3,
											    strokeStyle: 'rgba(200,0,0,0.5)'
											}
			jsPlumb.Defaults.ConnectionOverlays = [ 	["Arrow", {location:0.97,foldback:0.9}],
			 								[ "Label", { label:"Data", location:0.5, id:"myLabel" } ] ];

			jsPlumb.Defaults.DragOptions = { cursor: "move" };
			jsPlumb.Defaults.EndpointHoverStyle ={ lineWidth:4,
    											   strokeStyle: 'rgba(200,0,0,0.5)'};

			e0 = jsPlumb.addEndpoint("container0" ,{ endpoint:["Dot", {radius:10}],
    													//anchor:[ "Perimeter", { shape:"Square" } ],
    													anchor:"Right",
    													isSource:true,maxConnections:5});
			document.getElementById("container0").createdEP = e0;
      		e1 = jsPlumb.addEndpoint("container1",{ endpoint:["Rectangle", {width:15,height:40}],
    													anchor:"Left",isTarget:true,maxConnections:5 });
      		e11 = jsPlumb.addEndpoint("container1" ,{ endpoint:["Dot", {radius:10}],
    													anchor:"Right",
    												    isSource:true,maxConnections:5});
      		document.getElementById("container1").createdEP = e1;
      		document.getElementById("container1").createdEPS = e11;

      		e2= jsPlumb.addEndpoint("container2",{ endpoint:["Rectangle", {width:15,height:40}],
    													anchor:"Left" ,isTarget:true, maxConnections:5 });
      		document.getElementById("container2").createdEP = e2;
      			// e3= jsPlumb.addEndpoint("container3",{ endpoint:["Rectangle", {width:10,height:40}],
    					// 								anchor:"Left", isTarget:true,maxConnections:5 });

    			jsPlumb.connect( { source:e0, target:e1			} );
    			jsPlumb.connect( { source:e11, target:e2  		} );
    			jsPlumb.draggable("container0");
    			jsPlumb.draggable("container1");
    			jsPlumb.draggable("container2");
    			//jsPlumb.draggable("container3");

    			 $( ".jdrag_div" ).draggable(
    			 	{ containment: "body",
    			 	  revert: "invalid",
    			 	  helper: 'clone',
    			 	  opacity: 0.7,
    			 	  //cursorAt: { left: 0, top:0 }
    			 	  start: function( event, ui ) {
    			 	  	var selectedVal;
    			 	  	console.log("drag start's source id : " +this.getAttribute('id'));
	    			 	 if($(this).attr('id')=="containerData"){
	    			 	  	selectedVal = $(this)
	    			 	  					.find(".removable-p:first > select option:selected")
	    			 	  						.text();
	    			 	 	ui.helper.find(".removable-p").empty();
	    			 	 	ui.helper.find(".removable-p").append("<p>"+selectedVal+"</p>");
							//var strUser = f.options[f.selectedIndex].text;
							//console.log("strUser : " +selectedVal);
							}    			 	  
						}    			 	   
					});
    			 $( "#map-canvas-content" ).droppable({
    			 	  accept: ".jdrag_div",
				      activeClass: "map-canvas-content-hoverr",
				      hoverClass: "map-canvas-content-hover",
				      drop: jDragDrop
    				});
    			//setInterval(getCurrencyDataFromServer,10000);
								    		
	});
    
    $(window).resize(function() {
			  //resize just happened, pixels changed
	});
     

	function getCurrencyDataFromServer(){
			
			 $.ajax({
			 	type: 'GET',			 	
			 	url: '/restapi/currency?q=btc_to_usd',
			 	dataType: "json",			 			 	
			 	success: postToPage});
			 //"create (n {name:'mission', id:'2'}) return n;"
			 //"start a=node(5616), b=node(5617) create a-[r:child]->b return r;"
			 //"start a=node(5616) match (n)-[:CHILD]->(x) return x;"
	}

	function postToPage(data,status){
		   console.log(data.btc_to_usd);
			// var jsonObj = JSON.parse(data);
			 $("#btc_to_usd").text(data.btc_to_usd);
						
	}

		
		//related to new creation of dropped object
		var countCollection = { count:0, displayCount:0,functionCount:0,
								dataCount:0, filterCount:0 ,x:0,y:0};
		
		function deleteObj( idNameString){
			
			var cloned =document.getElementById(idNameString);
			//console.log(cloned.createdEP);
			jsPlumb.detachAllConnections(cloned);
			jsPlumb.deleteEndpoint(cloned.createdEP);
			jsPlumb.deleteEndpoint(cloned.createdEPS);
			$("#"+idNameString).remove();

		}
		function jDragDrop(ev, uiObj){
						
			var	original_srcid = uiObj.draggable.attr('id');	
			//console.log("uiObj : " + uiObj.draggable.attr('id'));
			var cloned ;
			var offset = $("#map-canvas-content").offset();

			if(!uiObj) return false;
			if( original_srcid !== null && original_srcid !==""){
				cloned =document.getElementById(original_srcid).cloneNode(true);

				//cloned = uiObj.helper.clone();
				//cloned.style.left=ev.clientX+"px";
			   	//cloned.style.top=ev.clientY+"px";
			   	var pos =uiObj.offset;
			   	// console.log("cloned location: " + pos.left +", "+ pos.top);
			   	// console.log("mouse location: " + ev.pageX +", "+ ev.pageY);
			   	// console.log("final location: " +(ev.pageX -offset.left) +", "+ (ev.pageY-offset.top ));
			   	$(cloned).css({top:(pos.top -offset.top )+"px" , left:(pos.left-offset.left )+"px",
			   					 position:'absolute'});			   	
			   	$(cloned).css('z-index', 'auto');
			   	$(cloned).removeClass('jdrag_div ui-draggable');
			   	$("#map-canvas-content").append(cloned);
			   	
			   	//$(cloned).draggable("destroy");
			   	//$(cloned).css({position:'absolute'});

			   	cloned.id=original_srcid+ countCollection.count++ ;
			   	
			   //var tagItem = document.getElementById(cloned.id).getElementsByTagName("p")[0];
			   //tagItem= "<p>"+cloned.id+"</p>";
			   	
			   	//console.log(document.querySelector("#"+cloned.id+" > p").innerHTML);
			   	
			   	jsPlumb.draggable(cloned.id);
			   	//console.log("cloned id:" + cloned.id);
			   	if (original_srcid === "containerData"){
					cloned.createdEPS = jsPlumb.addEndpoint(cloned.id ,{ 
				   											endpoint:["Dot", {radius:10}],
	    													anchor:"Right",
	    												    isSource:true,maxConnections:5});
					//put selected items in the container
					selectedVal = uiObj.draggable
	    			 	  					.find(".removable-p:first > select option:selected")
	    			 	  						.text();
			 	 	$(cloned).find(".removable-p").empty();
			 	 	$(cloned).find(".removable-p").append("<p>"+selectedVal+"</p>");

					document.querySelector("#"+cloned.id+" > p")
							.innerHTML = "Data Source "+countCollection.dataCount++ ;


				}
				else{
			   	cloned.createdEP = jsPlumb.addEndpoint(cloned.id,
			   										{ endpoint:["Rectangle",{width:15,height:40}],
    													anchor:"Left", 
    													isTarget:true,
    													maxConnections:5 });
				}

			   	if (original_srcid === "containerFunc"){
				   	cloned.createdEPS = jsPlumb.addEndpoint(cloned.id ,{ 
				   											endpoint:["Dot", {radius:10}],
	    													anchor:"Right",
	    												    isSource:true,maxConnections:5});
				   	document.querySelector("#"+cloned.id+" > p")
				   			.innerHTML = "Function "+countCollection.functionCount++ ;
				}
				else if (original_srcid === "containerDisplay"){
					document.querySelector("#"+cloned.id+" > p")
							.innerHTML = "End Display "+countCollection.displayCount++ ;
				}   
				
				else if (original_srcid === "containerFilter"){
					document.querySelector("#"+cloned.id+" > p")
							.innerHTML = "Filter "+countCollection.filterCount++ ;
				}
			   	//console.log("ep"+cloned.createdEP);

			   	$("<div><button type='button' title='delete' onclick=\"deleteObj('"+cloned.id+"')\">x</button></div>").
			   	appendTo(cloned);

			   	ev.stopPropagation();
			}
			return false;
		}
		// function dragSource(ev){
		// 	//console.log(ev.target.getAttribute('id'));
		// 	//try it's parent
		// 	if(ev.target.id ===""){
		// 		var tempid =$(ev.target).parent().attr('id');
		// 		ev.dataTransfer.setData("Text",tempid);
		// 	}
		// 	else{
		// 		ev.dataTransfer.setData("Text", ev.target.id);
		// 	}
		// }

		// function dragDrop(ev){
		// 	if(!ev.dataTransfer) return false;
		// 	var src = ev.dataTransfer.getData("Text");
		// 	var cloned;			
			
		// 	if( ev.target.getAttribute('id') !== null && src !==""){
		// 		cloned =document.getElementById(src).cloneNode(true);
				
		// 		//cloned.style.left=ev.clientX+"px";
		// 	   	//cloned.style.top=ev.clientY+"px";
		// 	   	var offset = $("#map-canvas-content").offset();
		// 	   	$(cloned).css({top:(ev.pageY -offset.top )+"px" , left:(ev.pageX-offset.left )+"px",
		// 	   					 position:'absolute'});
		// 	   	ev.target.appendChild(cloned);
		// 	   	cloned.ondragstart=null;
		// 	   	//$(cloned).css({position:'absolute'});

		// 	   	cloned.id=src+ count++ ;
		// 	   //var tagItem = document.getElementById(cloned.id).getElementsByTagName("p")[0];
		// 	   //tagItem= "<p>"+cloned.id+"</p>";
			   	
		// 	   	//console.log(document.querySelector("#"+cloned.id+" > p").innerHTML);
			   	
		// 	   	jsPlumb.draggable(cloned.id);
		// 	   	cloned.createdEP = jsPlumb.addEndpoint(cloned.id,
		// 	   										{ endpoint:["Rectangle",{width:15,height:40}],
  //   													anchor:"Left", 
  //   													isTarget:true,
  //   													maxConnections:5 });
		// 	   	if (src === "containerFunc"){
		// 		   	cloned.createdEPS = jsPlumb.addEndpoint(cloned.id ,{ 
		// 		   											endpoint:["Dot", {radius:10}],
	 //    													anchor:"Right",
	 //    												    isSource:true,maxConnections:5});
		// 		   	document.querySelector("#"+cloned.id+" > p").innerHTML = "Function "+functionCount++ ;
		// 		}
		// 		else{
		// 			document.querySelector("#"+cloned.id+" > p").innerHTML = "End Display "+displayCount++ ;
		// 		}
		// 	   	//console.log("ep"+cloned.createdEP);
		// 	   	$("<div><button type='button' onclick=\"deleteObj('"+cloned.id+"')\">x</button></div>").
		// 	   	appendTo(cloned);

		// 	   	ev.stopPropagation();
		// 	}
		// 	return false;
		// }

		// function dragEnter(ev) {
			
		//    ev.preventDefault();
		//    return true;
		// }

		// function dragOver(ev) {
		// 	//console.log("Drag over");
		// 	ev.preventDefault();
  //   		return true;
		// }

		
       
        