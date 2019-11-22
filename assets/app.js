

var promise;

        function handleFilter(e){
            var filterName = e.target.value;
            showSomeChapters(filterName); 
        }

        
               
        function testTheStage(){

        }

    var app = {
        routes: {},

        registerRoute: function(route){

        },

        addRoute: function(route){
            this.routes[route.name] = route;

        },

        getRoute: function(routeName){
            return this.routes[routeName];
        },

        executeRoute: function(theRoute){
            var resp = fetch(theRoute.dataUrl).then(function(resp){
                console.log(resp);
                return resp.json();
            }).then(function(json){
                console.log(json);
                return theRoute.vNodes(json);
            })
              .then(function(vNodes){
                console.log(vNodes);
                document.getElementById("stage").appendChild(createElement(vNodes));
            })
        },

        handleEvent: function(e){
            var target = e.target;
            var name = target.dataset.route;
            var theRoute = this.getRoute(name);
            this.executeRoute(theRoute);
        }
    };

    var materialsRoute = {
        dataUrl: 'http://appserver/get-json-materials?sample-event',
        name: 'materials',
        vNodes: show 
    };
     /*;
     Step 1: listening for some kind of ui event
     Step 2:  prepare to execute a route "get-json-materials"
        Step 3: callout to route using fetch
        Step 4: retrieve data text() or json()
        Step 5: render the data vnode() createElement()
        */

        jQuery(function(){
            var testStageButton = document.getElementById("testStage");
            //var materialsButton = document.getElementById("materials");
            document.addEventListener("change", handleFilter);
            app.addRoute(materialsRoute);
            document.addEventListener('click',app,true);
            //materialsButton.addEventListener("click", renderMaterials);
            //testStageButton.addEventListener("click", testTheStage);
            });