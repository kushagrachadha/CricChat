'use strict';
var path = "/usr/local/heroku/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:vendor/phantomjs/bin"
//const phantom = require('phantom');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const deasync = require('deasync');
const cheerio = require('cheerio');

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res)
    {
        if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me')
        {
            res.send(req.query['hub.challenge']);
        }
        res.send('Error, wrong token');
    });

//url for all matches
var url = "http://cricapi.com/api/cricket";
let allmatches;

// Spin up the server
app.listen(app.get('port'), function()
    {	
	    console.log('running on port', app.get('port'));
    });

//message identification
app.post('/webhook/', function (req, res)
    {
        let messaging_events = req.body.entry[0].messaging;
        for (let i = 0; i < messaging_events.length; i++)
        {
            let event = req.body.entry[0].messaging[i];
            let sender = event.sender.id;
                
            if (event.message && event.message.text)
            {
                let text = event.message.text;
                console.log("\n \n \n \n Message recieved "+text);
                tellScore(sender, "null");
            }
            else if(event.postback)
            {
                let text = event.postback.payload;
                console.log("\n \n \n \n Postback recieved "+text);
				
					if(text.indexOf("more")>-1)
					{
						text = text.replace("more scores ","").toLowerCase();
						text = text.replace("scores","").toLowerCase();
						var id = text.toLowerCase().replace("more ","");
						tellScoredetails(sender,id);
					}
					else if(text.indexOf("commentary")>-1)
					{
						text = text.replace("commentary ","").toLowerCase();
						text = text.replace("commentary ","").toLowerCase();
						var id = text.toLowerCase().replace("commentary ","");
						sendCommentry(sender,id);
					}
				            
	     	}
        }
        res.sendStatus(200);
	});

// all matches init
function init()
{
	allmatches = undefined;
	request(
	{
		url: "http://m.cricbuzz.com/cricket-match/live-scores",
	   	
	}, function (error, response, html)
	{
		if (!error)
		{
			allmatches=cheerio.load(html);
			console.log("\n \n got html \n\n"+allmatches);
		}
	});
	deasync.loopWhile(function(){return (allmatches === undefined);});
}     

//page token
const token = "EAADOlaF2YaoBAJZA4aJqIpQfnZBm2F7Vd6gg9ws0Kcr2LgZCZCsdlZCbFzV9O5zSxdcR0Qpm14IBU1sK3vwKT9CRLS2dJYmtJLLnjCFzEad33LDQAO1eoLlLinNgwcplb1mmw8nXGspJLfcZCZBUwOquJOyTPIi4w9ZBbZCPLDYXQGQZDZD";

//getting all matches
var t =[];
function getAll()
{

	console.log('getting all matches.............................................');
	allmatches = undefined;
	request(
	{
		url: "http://m.cricbuzz.com/cricket-match/live-scores"
	}, function (error, response, body)
	{
		if (!error && response.statusCode === 200)
		{
			allmatches=body;
			//console.log("\n \n getting match details json"+JSON.stringify(allmatches));
		}
	});
	deasync.loopWhile(function(){return (allmatches === undefined);});
	//var commenthtml=comment['commentary'];
	
	var headers=[];
	var index =0; 
	var i;
	var temp = {};
	var maintemp = null
	var messageData =
	{
		"attachment" :
	    {
	        "type" : "template",
	        "payload" : 
	        {
	        	"template_type" : "generic",
	        	"elements" :[]
		}
	     }
	};
	
        if(allmatches !==undefined)
        {
			var c =0;
			var headers=[];
			var links=[];
			var result=[];
			var short_summary=[];
			var short = [];
			var id=[];
			var scount=0
			
			allmatches=cheerio.load(allmatches);
			
			allmatches('h4').each(function()
			{
				headers.push(allmatches(this).text());
			});
			//console.log('\n\n'+headers.length+'\n\n');
			
			allmatches('.cbz-ui-status').each(function()
			{
				result.push(allmatches(this).text());
			});
			allmatches('.cbz-ui-status').each(function()
			{
				short_summary.push(allmatches(this).text());
				scount=scount+1
			})
			allmatches('.btn-group.cbz-btn-group').each(function()
			{
				var a=allmatches(this).children().first().attr('href');
				links.push(a);
				console.log(a);
			});
			//for(i=0;i<scount;i+2){
				//short.push(short_summary[i]+' '+short_summary[i+1]);
					//		}
			console.log("\n c length "+ c+"\nlinks length "+links.length+" "+short.length+" "+result.length+" "+headers.length);
			
			for (a=0;a<links.length;a++)
			{
				if (a==0)
				{
					continue;
				}
				else
				{
					var idtext=links[a].replace('/cricket-commentary/','');
					var idresult=idtext.split('/',1);
					id.push(idresult[0]);}	}		
	    		    for(i=0;i<headers.length;i++)
			        {	
						console.log("iniside header");
			        	var title = headers[i].toLowerCase();
	    		    	console.log("\n Teams playing are "+title);
	        	
	        			temp = 
	        			{
	        				"title" : headers[i],
							"image_url" : "http://imgur.com/download/vOVMIRu/",
							"subtitle" :result[i],
							"text":short[i],
	    	    			"buttons" :
			        		[
								{
        							"type" : "postback",
        							"payload" : "scores ",
		        					"title" : "Refresh ..."
								},
							    {
	        						"type" : "postback",
			        				"payload" : "more scores "+id[i],
	    		    				"title" : "Show Details ..."
			    		    	}
						    ]
						};
						c=c+1;
						if (temp.title.indexOf('India')>-1)
							maintemp = temp;
						else if((temp.title.indexOf('Australia')>-1)||(temp.title.indexOf('England')>-1)||(temp.title.indexOf('Pakistan')>-1)||(temp.title.indexOf('Sri Lanka')>-1)||(temp.title.indexOf('South Africa')>-1)||(temp.title.indexOf('West Indies')>-1)||(temp.title.indexOf('Bangladesh')>-1)||(temp.title.indexOf('New Zealand')>-1)||(temp.title.indexOf('Zimbabwe')>-1)||(temp.title.indexOf('Afghanistan')>-1)||(temp.title.indexOf('Nepal')>-1)||(temp.title.indexOf('Ireland')>-1)||(temp.title.indexOf('Netherland')>-1))
						{
				   			t.unshift(temp);
						}
						else
							t[i] = temp;
						}
						if (maintemp != null)
						{
							t.unshift(maintemp);
						}
						console.log("\n\nmatch index is "+index);
						if(index < c)
						{
							for(var a=0; a<10; a++)
							{
								console.log("\n \n data added in message is "+t[a+index]+"\n");
					
								if((t[index+a] === undefined)||(a+index == c))
									break;
								else
									messageData.attachment.payload.elements[a] = t[index+a];
							}
						}
						else
						{
							messageData =
							{
								text : "No more matches are played lately"
							};
						}
						console.log("\n \n \n \n the data to be sent for all "+JSON.stringify(messageData));
			
						return messageData;
       	}
        else
        {
        	temp = 
        		{
        			"attachment" :
        			{
        				"type" : "template",
        				"payload" : 
        				{
        					"template_type" : "generic",
        					"elements" :
        					[
        						{
        							"title" : "Couldn't get any Matches, Retry!",
									"image_url" : "http://imgur.com/download/vOVMIRu/",
				        			"subtitle" : "Scores",
    	    						"buttons" :
        							[
				        				{
        									"type" : "postback",
        									"payload" : "scores",
        									"title" : "Retry ..."
		        						}
			        				]
			        			},
			        		]
			        	}
			        }
       			};
        	return temp;
        }
        
}


//getting commentry

//var comment;
let allcommentry=[]
function getCommentry(id)
{
	var phantom = require('node-phantom');
	phantom.create(function(ph)
	{
  		return ph.createPage(function(page)
  		{
    		return page.open("http://www.espncricinfo.com/ci/engine/match/"+id+".html", function(status)
    		{
      			console.log("opened site? ", status);         
            		page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', 
            			function(){
                			//jQuery Loaded.
                			//Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
                			setTimeout(function()
                			{
                    			return page.evaluate(function()
                    			{
                        			$('div .commentary-event').each(function()
                        			{
										//console.log($(this).html());
                            			allcommentry.push($(this).html());
                        			});
 
                        			return
                        			{
                            			comment:allcommentry
                        			};
                    			}, 
                    			function(result)
                    			{
                        			console.log(result);
                        			allcommentry = result.comment;
                        			ph.exit();
                    			});
                			}, 3000);
            			});
    		});
    	});
	});
	var tobereturned='';
	tobereturned=tobereturned+allcommentry[0]+"\n"+allcommentry[1]+"\n"+allcommentry[2]+"\n"+allcommentry[3]+"\n"+allcommentry[4];
	console.log('got commentry.................'+tobereturned);	
	return tobereturned;
}	

//getting single details
let match;

function getDetails(id)
{
	console.log('getting details.............................................');
	match = undefined;
	request(
	{
		url: "http://cricapi.com/api/cricketScore?unique_id="+id,
	   	json: true
	}, function (error, response, body)
	{
		if (!error && response.statusCode === 200)
		{
			match=body;
			console.log("\n \n getting match details json"+JSON.stringify(allmatches));
		}
	});

	deasync.loopWhile(function(){return (match === undefined);});
	
	var i =0;
	var temp = {};
    var found = false;
    if(match !==undefined)
    {
		for(i in allmatches.data)
	        {
	        	var uid = allmatches.data[i].unique_id.toLowerCase();
	        	console.log("\n Current match ids are "+uid);
	        	if(uid.indexOf(id)>-1)
	        	{
	        		found = true;
					var team1 = match["team-1"];
					var team2 = match["team-2"];
					var summary = match.score;
					var des = match["innings-requirement"];
					while((summary.indexOf(",")>-1)||(summary.indexOf("(")>-1)||(summary.indexOf(")")>-1))
					{
						summary = summary.replace(",","\n");
						summary = summary.replace("(","\n");
						summary = summary.replace(")","\n");
					}
					
	        		temp = 
	        		{
	        			"attachment" :
	        			{
	        				"type" : "template",
	        				"payload" : 
	        				{
	        					"template_type" : "generic",
	        					"elements" :
	        					[
	        						{
	        							"title" : team1 + " vs "+ team2,
										"image_url" : "http://imgur.com/download/vOVMIRu/",
					        			"subtitle" : summary,
										"buttons" :
	        							[
					        				{
												"type" : "postback",
	        									"payload" : "more scores "+id,
	        									"title" : "Refresh ..."
											}
				        				]
				        			},
									{
										"title" : "Commentary",
										"image_url" : "http://imgur.com/download/vOVMIRu/",
										"subtitle" : "Press the button to get last 5 balls ",
										"buttons" :
	        							[
					        				{
												"type" : "postback",
	        									"payload" : "more scores "+id,
	        									"title" : "Refresh ..."
											},{
	        									"type" : "postback",
	        									"payload" : "commentary "+id,
	        									"title" : "Last Five Balls"
			        						}
				        				]
									},
									{
										"title" : team1,
										"subtitle" : "Opens Google Search Page",
										"image_url" : "http://imgur.com/download/b82yD0i/",
										"buttons" :
	        							[
					        				{
												"type" : "web_url",
	        									"url" : "www.google.co.in/search?q="+team1+" cricket+team&oq="+team1+" cricket+team",
	        									"title" : "Get Info on "+team1
											}
				        				]
									},
									{
										"title" : team2,
										"subtitle" : "Opens Google Search Page",
										"image_url" : "http://imgur.com/download/b82yD0i/",
										"buttons" :
	        							[
					        				{
												"type" : "web_url",
	        									"url" : "www.google.co.in/search?q="+team2+" cricket+team&oq="+team2+" cricket+team",
	        									"title" : "Get Info on "+team2
											}
				        				]
									}
				        		]
				        	}
				        }
	       			};
				}
			}
			if(!found)
			{
				temp =
				{
					text : id + " is not a relevant match ID now"
				};
			}
			
			return temp;
        }
        else
        {
        	temp = 
        		{
        			"attachment" :
        			{
        				"type" : "template",
        				"payload" : 
        				{
        					"template_type" : "generic",
        					"elements" :
        					[
        						{
        							"title" : "Couldn't get the match Details, Retry!",
									"image_url" : "http://imgur.com/download/vOVMIRu/",
				        			"subtitle" : "Scores",
    	    						"buttons" :
        							[
				        				{
	        									"type" : "postback",
	        									"payload" : "more scores "+id,
	        									"title" : "Retry ..."
			        					},
			        				]
			        			}
			        		]
			        	}
			        }
       			};
        	return temp;
        }
}



function tellScore(sender)
{	
  
    let messageData = getAll();
    
    request(
    {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json:
        {
	    recipient : {id : sender},
            message: messageData,
        }
    }, function(error, response, body)
        {
            if (error)
            {
                console.log('Error sending messages: ', error);
            }
            else if (response.body.error)
            {
                console.log('Error: ', response.body.error);
            }
        });
}


function tellScoredetails(sender,id)
{	
  
    let messageData = getDetails(id);
    console.log('got details');
    request(
    {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json:
        {
	    recipient : {id : sender},
            message: messageData,
        }
    }, function(error, response, body)
        {
            if (error)
            {
                console.log('Error sending messages: ', error);
            }
            else if (response.body.error)
            {
                console.log('Error: ', response.body.error);
            }
        });
}


function sendCommentry(sender, id)
{
    let messageData = getCommentry(id)
	messageData = messageData.replace(/\s+/g, ' ');
	messageData = {text : messageData};
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
