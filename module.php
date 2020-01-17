<?php

use \Html\HtmlLink;


class WebConsoleModule extends Module {


	public function __construct(){
		parent::__construct();
		$this->routes = modWebconsoleRoutes();
		$this->name = "webconsole";
	}

}


function modWebconsoleRoutes() {
	return array(
		"webconsole" => array(
			"callback" => "doAdminPage"
		),
		"doc" => array(
			"callback" => "loadDocument"
		),
		"html-content" => array(
			"callback" => "loadExternalDocumentHTML"
		),
		"text-content" => array(
			"callback" => "loadExternalDocumentText"
		),
		"cache-ors" => array(
			"callback" => "megaOrsCache"
		)
	);
}



function loadDocument($docId) {
	if($docId == null) {
		throw new Exception("Path expects a document id parameter.");
	}
	$path = BASE_PATH . "/content/static/bon/sex-cases/chapter-".$docId.".html";
	return file_get_contents($path);
}



/**
 * $req = new HttpRequest("https://www.oregonlaws.org/ors/137.700");

		$req->xml();


		new ClassFinder("nav nav-tabs hidden-print");

		$title = new Label(".section_title"); // Get the section title label for display in the sidebar

		new MainContent("#text");
		new MainContent("#annotations");
		new MainContent("#related-statutes");
*/
function loadExternalDocumentHTML($url, $statute = null) {
	$fullUrl = "https://www.oregonlaws.org/ors/".$url;

	$statute = "";

	$req = new HttpRequest($fullUrl);
	
	$resp = $req->send();

	$doc = new ExternalHTMLDocument($resp->getBody());
	$doc->setTargetElementId("text");
	$doc->setTagsToFilter(array("img"));
	return $doc->extract();
}

function loadExternalDocumentText($url){
	//$fullUrl = "https://www.oregonlaws.org/ors/".$url;
	$fullUrl = $url;

	$statute = "";

	$req = new HttpRequest($fullUrl);
	
	$resp = $req->send();

	$doc = new ExternalHTMLDocument($resp->getBody());
	$doc->setTargetElementId("text");
	return $doc->extractText();
}

function megaOrsCache(){
	$chapter = 1;
	$section = 1; //Will be 838.075;
	$statuteNumber;
	$orsUrl = "https://www.oregonlaws.org/ors/";
	$completeUrl;
	$fileName;

	for($chapter = 1; $chapter <= 1; $chapter++){	//838 chapters
		for($section = 1; $section <= 1; $section++){
			if($section < 10 ){
				$completeUrl = $orsUrl.$chapter."."."00".$section;
			}
			if($section > 10 && $section < 100){
				$completeUrl = $orsUrl.$chapter."."."0".$section;
			}
			else if($section >= 100){
				$completeUrl = $orsUrl.$chapter.".".$section;
			}
			$req = new HttpRequest($completeUrl);
	
			$resp = $req->send();

			if($resp->getStatusCode() != 200){
				continue;
			}
		
			$doc = new ExternalHTMLDocument($resp->getBody());
			$doc->setTargetElementId("text");
			$doc->setTagsToFilter(array("img"));
			$docHtml= $doc->extract();
			$docText = $doc->extractText();
			
			$fileName = getPathToContent()."/orsStatutes/{$chapter}/{$section}.xml";
			
			file_put_contents($fileName,$docHtml.$docText);
		}
	}
}


function doAdminPage() {
	$template = new Template("webconsole");

	$jquery = array(
		array(
			"src" => "/modules/webconsole/assets/jquery/jquery-1.11.0-min.js"
		)
	);

	/*
	$react = array(
		array(
			"src" => "https://unpkg.com/react@16/umd/react.development.js",
			"crossorigin" => null
		),
		array(
			"src" => "https://unpkg.com/react-dom@16/umd/react-dom.development.js",
			"crossorigin" => null
		),
		array(
			"src" => "https://unpkg.com/babel-standalone@6/babel.min.js"
		)
	);
	*/
	
	$react = array(
		array(
			"src" => "/modules/webconsole/assets/react/react-16.12.0-development.js"
		),
		array(
			"src" => "/modules/webconsole/assets/react/react-16.12.0-dom-development.js"
		),
		array(
			"src" => "/modules/webconsole/assets/react/babel-6.26.0-standalone.js"
		)
	);

	
	$template->addScripts($react);
	$template->addScripts(moduleGetScripts());
	$template->addStyles(moduleGetStyles());

	
	$content = file_get_contents(BASE_PATH ."/content/static/sample.html");
	return $template->render(array(
		"defaultStageClass" 	=> "not-home", //home
		"content" 						=> $content
	));

}









function moduleGetStyles() {
	$styles = array(
		array(
			"active" => false,
			"rel" => "stylesheet",
			"href" => "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css",
			"integrity" => "sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh",
			"crossorigin" => "anonymous"
		),
		array(
			"active" => true,
			"href" => "/modules/webconsole/assets/ux/ux.css"
		),
		array(
			"active" => false,
			"href=" => "/modules/webconsole/modules/material/style.css"
		),
		array(
			"active" => false,
			"href" => "/modules/webconsole/assets/css/KeyboardManager.css"
		),
		array(
			"active" => true,
			"href" => "/modules/webconsole/modules/note/style.css"
		),
		array(
			"active" => true,
			"href" => "/modules/webconsole/assets/css/siteStatus.css"
		),
		array(
			"active" => true,
			"href" => "/modules/webconsole/modules/modal/style.css"
		),
		array(
			"active" => true,
			"href" => "/modules/webconsole/modules/ors/style.css"
		)
	);
	
	return $styles;
}


function moduleGetScripts() {
	$module_path = "/modules/webconsole";

	$scripts = array(
		"$module_path/assets/lib/event.js",
		"$module_path/assets/lib/datetime.js",
		"$module_path/assets/lib/modal.js",
		"$module_path/assets/lib/view.js",
		"$module_path/assets/lib/Dom.js",
		"$module_path/assets/lib/http/http.js",
		"$module_path/assets/lib/http/HttpCache.js",
		"$module_path/assets/lib/KeyboardManager.js",
		"$module_path/assets/lib/database/Database.js",
		"$module_path/assets/lib/database/DatabaseArray.js",
		"$module_path/assets/lib/database/DatabaseIndexedDb.js",
		"$module_path/assets/lib/Client.js",
		"$module_path/assets/lib/UrlParser.js",

		"$module_path/assets/event/DomDataEvent.js",
		"$module_path/assets/event/DomLayoutEvent.js",
		"$module_path/assets/event/DomHighlightEvent.js",
		"$module_path/assets/event/DomMobileContextMenuEvent.js",


		
		/*
		"modules/document/src/TableOfContents.js",
		"modules/document/src/Doc.js",
		"modules/document/route.js",
		*/
		
		"$module_path/modules/editable/DomEditableEvent.js",
		"$module_path/modules/editable/DomContextMenuEvent.js",

		
		"$module_path/modules/linkHandler/src/LinkHandler.js",

		"$module_path/modules/modal/component/ModalComponent.js",
		"$module_path/modules/modal/src/Modal.js",
		"$module_path/modules/modal/src/PositionedModal.js",

		"$module_path/modules/note/component.js",
		"$module_path/modules/note/route.js",
		"$module_path/modules/note/src/Note.js",
		
		"$module_path/modules/material/component.js",

		"$module_path/modules/audio/src/DomAudio.js",

		"$module_path/routes.js",
		"$module_path/assets/ux/ui.js",
		"$module_path/assets/ux/menu.js",
		
		"$module_path/settings.js",
		"$module_path/public/app.js"
	);
	
	return $scripts;
}