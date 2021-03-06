const LinkHandler = (function() {

	const HTML_A_TAG = "A";

	function hasHref(node){
		return !!node.getAttribute("href");
	}

	function isNodeType(node,nodeName){
		return node.nodeName == nodeName;
	}

	function isStageElement(target){
		let elem = target;
		while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
			if(elem.parentNode.id.toLowerCase() === 'stage') {
				return true;
			}
			elem = elem.parentNode;
		}
		return false;
	}

	var linkHandler = {
		handlers: {},

		
		handleEvent: function(e) {

			var url, point;
		
		

			if(!isNodeType(e.target,HTML_A_TAG) || !hasHref(e.target) || !isStageElement(e.target)) {
				return false;
			}
			
			try {

				e.preventDefault();
				e.stopPropagation();
				
				
				// Where the user hovered or clicked.  Should be relative to the screen.
				point = {x: e.clientX, y: e.clientY};

				url = new UrlParser(e.target.href);
		
				for(var name in this.handlers){
					if(this.handlers[name].shouldIHandle(url)){
						this.handlers[name].handleUrl(url,point,e);
						return false;
					}
				}
			
			} catch(e) {
				return false;
			}
		},

		registerHandler:function(name, handler){
			//call to register the orsHandler if the link has the pattern use the registered handler
			this.handlers[name] = handler;
		}
	};

	function LinkHandler(){
		this.handlers = {};
	}
	
	
	LinkHandler.prototype = linkHandler;


	return LinkHandler;
})();