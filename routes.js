
 
 
 var testHtml = {
    name: "foobar2",
    hasParams: true,
    headers: {
    	accept: "text/html"
    },

    //
    url: function(json){
        console.log(json.url);
        return "<h1>Hello World</h1>";
    }, // let's not have to call out to external server, will be nice for tesitng, too.
    render: function(json){
        return vNode("h1", {}, json);
    },
    form: function(){
        return vNode("div",{"id":"modalContainer"},[vNode("input",{"name":"url","id":"urlInput"}, [])]);
    },
    formCallback:function(){
        var data = document.getElementById("urlInput").value;
        return JSON.stringify({url:data});
    }
 };

 var materials = {
	 url: '/get-json-materials?sample-event',
	 name: 'materials',
	 render: show,
	 shortcut: 'm'// implied Ctrl-m
 };

 var search = {
     name:'test',
     url: 'http://appserver/test-function-one',
     render: function(){
         return vNode("h1",{}, "Hello World" )
     },
     shortcut: 'f',
     hasParams:true,
     form: function(){
         return vNode("input",{}, []);
     },
     formCallback: function(){
         return JSON.stringify({url:"http://appserver/foobar"});
     }
 };



 var allSiteStatuses = {
	name: "all-site-statuses",
	
	hasParams: false,
	
	headers: {
		accept: "text/html",
		contentType: "text/html"
	},

	// Let's not have to call out to external server, will be nice for tesitng, too.
	url: "/site-statuses",
	
	// Gets passed the body of the Response.
	render:  function(body){ 
		return body;
	},
	
	// form: function() {
	// 	return vNode("div",{"id":"modalContainer"},[vNode("input",{name:"url",id:"urlInput"}, [])]);
	// },
	
	// formCallback:function(){
    //     var data = document.getElementById("urlInput").value;

	// 	return JSON.stringify({url:data});
	// }
};

var siteStatusCheckSingleSite = {
	name: "site-status-check-site",

	//dataStore: "sitestatus",
	
	hasParams: true,

	renderMode: "append",
	
	headers: {
		accept: "application/json",
		contentType: "application/json"
	},

	// Let's not have to call out to external server, will be nice for tesitng, too.
	url: "/site-status-check-site",
	
	// Gets passed the body of the Response.
	render:  function(json){ 

		// create container
		var container = vNode("div", {class: "container border border-dark rounded p-2 m-2", style: "max-width: 600px"}, []);

		// create row
		var row = vNode("div", {class: "row"}, []);

		// create columns
		var leftColumn = vNode("div", {class: "col"}, []);
		var rightColumn = vNode("div", {class: "col"}, []);

		// create site name
		leftColumn.children.push(vNode("h4", {class: "text-left font-weight-bold"}, "Site Name: "));
		rightColumn.children.push(vNode("h4", {class: "text-right"}, json[0].name));

		// create url 
		leftColumn.children.push(vNode("h4", {class: "text-left font-weight-bold"}, "URL: "));
		rightColumn.children.push(vNode("h4", {class: "text-right"}, json[0].domain));

		// create response time
		var totalResponseTime = (json[0].totalResponseTime * 1000).toFixed(2); // convert seconds to ms

		leftColumn.children.push(vNode("h4", {class: "text-left font-weight-bold"}, "Response Time: "));
		rightColumn.children.push(vNode("h4", {class: "text-right"}, totalResponseTime + " ms"));

		// push columns to row
		row.children.push(leftColumn);
		row.children.push(rightColumn);

		// push row to container
		container.children.push(row);

		// create status
		var overAllSiteStatusText;
		var overAllSiteStatusClass;
		if(json[0].overallSiteStatus  == 1) {
			overAllSiteStatusText = "Site OK";
			overAllSiteStatusClass = "bg-success";
		} else {
			overAllSiteStatusText = "Site Down";
			overAllSiteStatusClass = "bg-danger";
		}

		var statusContainer = vNode("div", {class: "row justify-content-center mt-2"}, []);

		var statusCard = vNode("div", {class: "col-3 align-content-center pt-2 " + overAllSiteStatusClass, style: "max-width: 250px"}, []);

		statusCard.children.push(vNode("h5", {class: "text-center text-light"}, overAllSiteStatusText));
		
		statusContainer.children.push(statusCard);
		container.children.push(statusContainer);

		// create tool tip
		var toolTipContainer = vNode("span", { class: "tooltiptext" }, []);

		return container;
	},
	
	form: function() {
		return vNode("div",{"id":"modalContainer"},[vNode("input",{name:"name",id:"nameInput",placeholder:"Enter site name"}, []), vNode("input",{name:"url",id:"urlInput",placeholder:"Enter url"}, [])]);
	},
	
	formCallback:function(){
		var nameData = document.getElementById("nameInput").value;
		var urlData = document.getElementById("urlInput").value;

		return JSON.stringify({url:urlData, name: nameData});
	},

	persist: function() {
		
	}
};

var siteStatusLoadSites = {
	name: "site-status-load-sites",
	
	hasParams: false,

	renderMode: "replace",
	
	headers: {
		accept: "application/json",
		contentType: "application/json"
	},

	// Let's not have to call out to external server, will be nice for tesitng, too.
	url: function() {
		// TODO: get sites to load from database

		// FORNOW: create sites to probe here
		// data should be an array of objects that each have a url and a name
		var jsn;
		var object = {};
		var promise;
		var promises = [];
		for(var i = 1; i <= 100; i++) {
			object = {};
			//object.url = "https://search.yahoo.com/search?p=" + i;
			//object.name = "yahoo search " + i;
			
			if(i > 0) {
				object.url = "https://www.google.com/search?source=hp&ei=Uz3zXav_L4H_-gST36fgDQ&q=" + i;
				object.name = "google search " + i;
			}
			
			jsn = JSON.stringify(object);
			siteStatusCheckSingleSite.render = this.render;
			siteStatusCheckSingleSite.elementLocation = "site-statuses";
			// Original Way
			//app.executeRoute(siteStatusCheckSingleSite, jsn);

			promise = new Promise((resolve, reject) => {
				//app.executeRoute(siteStatusCheckSingleSite, jsn);

				req = new HttpRequest(siteStatusCheckSingleSite.url,siteStatusCheckSingleSite.headers);
				if(jsn) {
						req.setBody(jsn);
						req.setMethod("POST");
				}

				// Prepare our response to the route.
				resp = req.send();
				resp.then(function(resp){
					var ret;

					ret = resp.json();
					
					return ret;
				})
				.then((body) => {
					return siteStatusCheckSingleSite.render(body);
				}).then(app.render.bind(app, siteStatusCheckSingleSite))
				//resolve();
			});
			promises.push(promise);
		}
		Promise.all(promises);
		return {};
	},
	
	// Gets passed the body of the Response.
	render:  function(json){ 

		if(Object.keys(json).length === 0) {
			// create container
			var container = vNode("div", {id: "site-statuses", class: "table", style: "max-width: 600px"}, []);

			// create heading
			var row = vNode("div", {class: "table-row"}, []);

			var siteName = vNode("div", {class: "table-cell"}, "Site Name:");
			var siteUrl = vNode("div", {class: "table-cell"}, "Site URL:");
			var siteResponseTime = vNode("div", {class: "table-cell"}, "Response Time:");
			var siteHealth = vNode("div", {class: "table-cell"}, "Site Health:");

			// push heading
			row.children.push(siteName);
			row.children.push(siteUrl);
			row.children.push(siteResponseTime);
			row.children.push(siteHealth);
			container.children.push(row);

			return container;
		}

		var status = json[0];
		var totalResponseTime;
		
		// create row
		row = vNode("div", {class: "table-row"}, []);

		siteName = vNode("div", {class: "table-cell"}, status.name);
		siteUrl = vNode("div", {class: "table-cell"}, status.domain);

		// create response time
		totalResponseTime = (status.totalResponseTime * 1000).toFixed(2); // convert seconds to ms
		siteResponseTime = vNode("div", {class: "table-cell"}, totalResponseTime);

		// determine and create site health
		if(status.overallSiteStatus == 1) {
			siteHealth = vNode("div", {class: "table-cell"}, "Healthy");
		} else {
			siteHealth = vNode("div", {class: "table-cell"}, "Critical");
		}

		// push all elements
		row.children.push(siteName);
		row.children.push(siteUrl);
		row.children.push(siteResponseTime);
		row.children.push(siteHealth);

		// container.children.push(row);

        return row;
	},
	
	form: function() {
		return vNode("div",{"id":"modalContainer"},[vNode("h3",{}, "Load sites from database?")]);
	},
	
	formCallback: function(){


	},

	persist: function() {
		
	}
};