'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const deasync = require('deasync');
const cheerio = require('cheerio');
const sleep = require('sleep');
app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})//ruk bhai

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
					{	var ind = text.indexOf("^")
						var tex = text.substr(ind + 1)
						text = text.replace("more scores ","").toLowerCase();
						text = text.replace("scores","").toLowerCase();
						var idandsummary = text.toLowerCase().replace("more ","");
						var index = idandsummary.indexOf("^");  // Gets the first index where a space occours
						var id = idandsummary.substr(0, index); // Gets the first part
						//var tex = idandsummary.substr(index + 1)
						tellScoredetails(sender,id,tex);
					}
					else if(text.indexOf("commentary")>-1)
					{
						text = text.replace("commentary ","").toLowerCase();
						text = text.replace("commentary ","").toLowerCase();
						var idtext = text.toLowerCase().replace("commentary ","");
						var ind = idtext.indexOf("^")
						var id = idtext.substr(0, ind);
						getCommentry(sender,id);
					}
					else if(text.indexOf("refresh")>-1)
					{	
				
						tellScore(sender,"null");
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
const token = "EAADewcQZCqSsBAB2YvZA6lgkcLv1PPukOZCe8g9H5fva0T1h4eSsCJycM8Orw7bUohy5VbbOduYBCQpZAviMt2dwDHkehNuKZAP8yUT6KVQSw7N9wXQuZCEGLpIXDMJO7fsBW3FkIMiZAHUrZCMl8hTAnhxclqflGQcDB8bPJPzz7AZDZD"
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
			
			for (a=0;(a<links.length);a++)
			{
	
					var idtext=links[a].replace('/cricket-commentary/','');
					var idresult=idtext.split('/',1);
					id.push(idresult[0]);}			
	    		    	for(i=0;i<headers.length;i++)
			        {	
					console.log("inside header");
			        	var title = headers[i].toLowerCase();
	    		    		console.log("\n Teams playing are "+title);
	        			var imagetext=headers[i].replace(' ','+')
					var indext=imagetext.indexOf(',')
					var imagetxt=imagetext.substr(0,indext)
	        			temp = 
	        			{
	        				"title" : headers[i],
							"image_url" : "http://res.cloudinary.com/de65sbgw9/image/upload/v1467683172/qcjyj1ridnwhb8g451lw.jpg",
							"subtitle" :result[i],
							"text":short[i],
	    	    			"buttons" :
			        		[
								{
        							"type" : "postback",
        							"payload" : "refresh",
		        					"title" : "Refresh ..."
								},
							    {
	        						"type" : "postback",
			        				"payload" : "more scores "+id[i]+'^'+result[i],
	    		    				"title" : "Show Details ..."
			    		    	}
						    ]
						};
						c=c+1;
						if (temp.title.indexOf('Ind')>-1)
							maintemp = temp;
						else if((temp.title.indexOf('Aus')>-1)||(temp.title.indexOf('Eng')>-1)||(temp.title.indexOf('Pak')>-1)||(temp.title.indexOf('SL')>-1)||(temp.title.indexOf('RSA')>-1)||(temp.title.indexOf('WI')>-1)||(temp.title.indexOf('Ban')>-1)||(temp.title.indexOf('NZ')>-1)||(temp.title.indexOf('Zim')>-1)||(temp.title.indexOf('Afg')>-1))
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
									"image_url" : "http://placehold.it/350x200/0084ff/f7f7f7?text=No+Matches",
				        			"subtitle" : "Scores",
    	    						"buttons" :
        							[
				        				{
        									"type" : "postback",
        									"payload" : "refresh",
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
function getCommentry(sender,id)
{	
	var commentary= [];
	var cLength =0;
	var comment = undefined;
	request(
	{
			url: "http://m.cricbuzz.com/cricket-commentary/"+id
	}, function (error, response, body)
	{
		if (!error && response.statusCode === 200)
		{
				comment=body;
				//console.log("\n \n getting match details json"+JSON.stringify(allmatches));
		}
	});
	deasync.loopWhile(function(){return (comment === undefined);});
	var e=cheerio.load(comment);
	e('.commtext').each(function()
				{
					commentary[cLength]=e(this).text();
					cLength = cLength +1;
				});
	
	var result;
	e('.cbz-ui-status').each(function()
	{
		result = e(this).text();
	});
	
	if((result.toLowerCase().indexOf('won')>-1)|(result.toLowerCase().indexOf('lose')>-1))
	{
		sendTextMessage(sender, "The match has finished, \n Top is last ball");
	}
	else
		sendTextMessage(sender, "Top is last ball");
	var messagecount =0;
	for (var i=0;i<cLength;i++)
	{
		var temp = commentary[i];
		if((temp.toLowerCase().indexOf('1')===0)|(temp.toLowerCase().indexOf('2')===0)|(temp.toLowerCase().indexOf('3')===0)|(temp.toLowerCase().indexOf('4')===0)|(temp.toLowerCase().indexOf('5')===0)|(temp.toLowerCase().indexOf('6')===0)|(temp.toLowerCase().indexOf('7')===0)|(temp.toLowerCase().indexOf('8')===0)|(temp.toLowerCase().indexOf('9')===0))
		{
			if(temp.length>320)
			{
				temp = temp.slice(0, 320);
				var t = temp.lastIndexOf(' ');
				temp = temp.slice(0, t)+"...";
			}
			sendTextMessage(sender,temp);
			messagecount = messagecount +1;
			if(messagecount===6) break;
		}
		
		deasync.sleep(50);//ye karun kya? messages line se jaate hain isse meesage bhi kam karde 4-5
	}
}	

//getting single details
let match;

function getDetails(id,text)
{
	console.log('\n\n'+text+'\n\n')
	if(text.indexOf("Starts")>-1){
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
        							"title" : "The Match hasn't started yet",
								"image_url" : "http://placehold.it/350x200/0084ff/f7f7f7?text=Not+Started",
				        			"subtitle" : text,
    	    							"buttons" :
        							[
				        				{
	        									"type" : "web_url",
	        									"url": "http://www.cricbuzz.com/live-cricket-scores/"+id,
	        									"title" : "Details"
			        					},
			        				]
			        			}
			        		]
			        	}
			        }
       			}
	        	return temp;
	}
	else{
		var titlearr=[]
		var title=''
		var textarr=[]
		var texts=''
		console.log('getting details.............................................');
		match = undefined;
		request(
		{
			url: "http://m.cricbuzz.com/cricket-match-summary/"+id
		}, function (error, response, body)
		{
			if (!error && response.statusCode === 200)
			{
				match=body;
				//console.log("\n \n getting match details json"+JSON.stringify(allmatches));
			}
		});
		deasync.loopWhile(function(){return (match === undefined);});
		var d=cheerio.load(match);
		d('.team-totals').each(function()
				{
						titlearr.push(d(this).text());
				});
		titlearr = titlearr.filter(function(n){ return n != undefined });
		console.log('\n\n'+titlearr.length+'\n\n')
		if (titlearr.length==1){
			title=titlearr[0];}
		else if(titlearr.length==2){
		title=titlearr[0]+' vs '+titlearr[1]		
		}
		d('.table.table-condensed').each(function()
			{
					texts=texts+d(this).text()+' '+'\n'
			});

		var i =0;
		var temp = {};
    		var found = false;
    		if(match !==undefined)
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
	        							"title" : title,
									"image_url" : "http://placehold.it/350x200/0084ff/f7f7f7?text=Summary",
					        			"subtitle" : texts,
										"buttons" :
	        							[
					        				{
												"type" : "postback",
	        									"payload" : "more scores ",
	        									"title" : "Refresh ..."
											}
				        				]
				        			},
									{
										"title" : "Commentary",
										"image_url" : "http://placehold.it/350x200/0084ff/f7f7f7?text=Commentary",
										"subtitle" : "Press the button to get last 5 balls ",
										"buttons" :
	        							[
					        				{
											"type" : "postback",
	        									"payload" : "more scores "+id+'^'+text,
	        									"title" : "Refresh ..."
											},{
	        									"type" : "postback",
	        									"payload" : "commentary "+id+'^'+text,
	        									"title" : "Last Five Balls"
			        						},
				        				]
									}
								
				        		]
				        	
				 }       
	       			}
				
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
									"image_url" : "hhttp://placehold.it/350x200/0084ff/f7f7f7?text=No+Details",
				        			"subtitle" : "Scores",
    	    						"buttons" :
        							[
				        				{
	        									"type" : "postback",
	        									"payload" : "more scores "+id+'^'+text,
	        									"title" : "Retry ..."
			        					},
			        				]
			        			}
			        		]
			        	}
			        }
       			}
	        	return temp;
        	}
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
                console.log('Error sending messages: ', error);}
            else if (response.body.error)
            {
                console.log('Error: ', response.body.error);
            }
        });
}


function tellScoredetails(sender,id,text)
{	
  
    let messageData = getDetails(id,text);
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


function sendTextMessage(sender, text) {
    let messageData = { text:text }
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
