
    //For Test4 demo

    //this is for browser that doesn't support console in production env.
    if (typeof console == "undefined") {
    this.console = { log: function (msg) { /*alert(msg);*/ } };
	}

    var camera, scene, renderer;
    var geometry, material, mesh;

    var canvas, stage, exportRoot;
    var container, form, fakeform;		
               		
    function initStage(){
    		canvas = document.getElementById("world3");
    		stage = new createjs.Stage(canvas);
    		canvas.width = 600;//window.innerWidth * 0.48;
    		canvas.height = 500;//window.innerHeight * 0.85;
			//console.log("canvas width = " + canvas.width);
			//console.log("canvas width = " + canvas.height);
			// this lets our drag continue to track the mouse even when it leaves the canvas:
			// play with commenting this out to see the difference.
			stage.mouseMoveOutside = true; 
			
			var circle = new createjs.Shape();
			circle.graphics.beginFill("rgba(0,0,255,1)").drawCircle(0, 0, 100);
			
			var label = new createjs.Text("Drag this HTML5 canvas circle", "bold 24px Arial", "#00FFFF");
			label.textAlign = "center";
			label.y = -7;
			
			var dragger = new createjs.Container();
			dragger.x =canvas.width/2;  
			dragger.y = canvas.height/2;
			dragger.addChild(circle, label);
			stage.addChild(dragger);
			
			dragger.addEventListener("mousedown", function(evt) {
				var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
                 
				// add a handler to the event object's onMouseMove callback
				// this will be active until the user releases the mouse button:
				evt.addEventListener("mousemove",function(ev) {
				    ev.target.x = ev.stageX+offset.x;
					ev.target.y = ev.stageY+offset.y;
					stage.update();   
				});
			});
			
			stage.update();
			
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
		// google map
		var map;
			function initialize() {
			  if (map === undefined){
			  	//console.log("initialize called for google map!");
				  var mapOptions = {
				    zoom: 8,
				    center: new google.maps.LatLng(40.7142,-74.0064),
				    mapTypeId: google.maps.MapTypeId.HYBRID //ROADMAP
				  };
				  map = new google.maps.Map(document.getElementById('map-canvas-content'),
				      mapOptions);
				}
			}
		// end google map
		//Ajax document init
		$("document").ready(function(){

			//$('#cypherButton').bind('click', getInfoFromServer);
			$('#loadMission').bind('click', getMissionFromServer);
			initStage();
			$( "#accordion" ).accordion({active: 1});
			$( "#tabs" ).tabs();			
			//arranging  2  dynamic layers.
			$('#map-canvas').hide();
			$('#mission1').bind('click', changeContext)	
			$('#mission2').bind('click', changeContext2)			
			    		
		});
        $(window).resize(function() {
			  //resize just happened, pixels changed
			});
        function changeContext(){
        	$('#d3-canvas').hide();
        	$('#map-canvas').show();
        	initialize();
        }
        function changeContext2(){
        	$('#map-canvas').hide();
        	$('#d3-canvas').show();
        }
		function getMissionFromServer(){
			
			 $.ajax({
			 	type: "POST",
			 	url: "http://72.219.212.94:5850/cypher4",
			 	data: {	'name':'mission',
			 			 'id':'2', 
			 			},			
			 	success: postToPage});
			 //"create (n {name:'mission', id:'2'}) return n;"
			 //"start a=node(5616), b=node(5617) create a-[r:child]->b return r;"
			 //"start a=node(5616) match (n)-[:CHILD]->(x) return x;"
		}

		function postToPage(data, status){
			var jsonObj = JSON.parse(data);

			$('#d3-canvas').text(data);
			 
			 if( jsonObj !== "undefined" && jsonObj.children !=="undefined" && 
			 	 jsonObj.children.length !=="undefined" && jsonObj.children.length > 0){
			 	//jsonObj.found
			 	var svg = d3.select("#d3-canvas").append("svg:svg")
			 				.attr("width", 600).attr("height", 400)
			 				.append("svg:g")
			 				.attr("transform", "translate(0, 40)");
			 	// Create a tree with size less than canvas size
      			var tree = d3.layout.tree().size([500,300]); 
      			var diagonal = d3.svg.diagonal()
      			.projection(function(d) { return [d.x, d.y]; });
      			// Preparing the data for the tree layout, convert data into an array of nodes
      			var nodes = tree.nodes(jsonObj);
      			// Create an array with all the links
      			var links = tree.links(nodes);

      			console.log(nodes);
      			console.log(links);
      			// append  linking path
      			var link = svg.selectAll("pathlink")
						      .data(links)
						      .enter().append("svg:path")
						      .attr("class", "link")
						      .attr("d", diagonal)
						      .style("stroke-width","2")
						 	  .style("stroke","blue")
					      	  .style("fill","none");
				// append group		      
				var groupNode = svg.selectAll("groupNode")
						      .data(nodes)
						      .enter().append("svg:g")
						      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

				// Add the dot at every node
		      	groupNode.append("svg:circle")
		      		.attr("r", 15)		      		
		      		.style("stroke-width","2")
			 		.style("stroke","black")
		      		.style("fill","red");
		      	// place the name atribute left or right depending if children
		      	groupNode.append("svg:text")
		      	.attr("dx", 15)
		      	.attr("dy", 0)
		      	.attr("text-anchor", "start")
		      	.text(function(d) { return d.name + " "+ d.id; });	
			 	// svg.selectAll(".mission").data([{"cx" :"300","cy":"100"}]).enter().append("circle")
			 	// .text("Mission2")
			 	// .attr("class", "mission").attr("r", 40).attr("cx",function(d){ return d.cx;})
			 	// .attr("cy",function(d){ return d.cy;})
			 	// .style("stroke-width","2")
			 	// .style("stroke","black")
			 	// .style("fill","red");
				
			 }
			
		}
       
        