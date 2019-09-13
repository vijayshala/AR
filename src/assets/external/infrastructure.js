var CSQT_LOCAL_CACHE = (function() {
	var _cache = {},storage = null;

	function setCookie(c_name, value, addhours) {
		var now = new Date();
		var time = now.getTime();
		var expireTime = time + addhours * 3600000;
		now.setTime(expireTime);
		var c_value = escape(value) + ((now == null) ? "" : "; expires=" + now.toUTCString());
	document.cookie = c_name + "=" + c_value + "; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	function deleteCookie(name) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;  path=/';
	}

 function isLocalStorageAvailable(){
	 var isAvailable = false;
	 try {
		 if ('localStorage' in window && typeof localStorage.setItem != 'undefined') {
			 var key = "storehouse::availability",
				 value = ("" + Math.random()).substring(2, 12);
			 localStorage.setItem(key, value);
			 isAvailable = localStorage.getItem(key) === value;
			 localStorage.removeItem(key);
		 }
	 } catch (e) {}
	 return isAvailable;
 }
 function getLocalStorage(storeId, fn) {
	   if (!isLocalStorageAvailable()) {
		   fn(null);
	   } else {
		   fn(localStorage.getItem(storeId));
	   }
   }

   function deleteLocalStorage(storeId, fn) {
	   if (!isLocalStorageAvailable()) {
		   fn(false);
	   } else {
		   localStorage.removeItem(storeId);
		   fn(true);
	   }
   }

   function persistLocalStorage(obj, storeId, fn) {
	   if (!isLocalStorageAvailable()) {
		   fn(false);
	   } else {
		   localStorage.setItem(storeId, JSON.stringify(obj));
		   fn(true);
	   }
   }

   _cache.writeToCache= function(key,  data){
	   var persisted = false;
	   persistLocalStorage(data, key, function(status){
		   if(status){
			   storage='localStorage';
			   persisted=true;
		   }
		   else{

		   }
	   });
	   if (persisted) {
		   setCookie('storage', storage, 1);
	   }
   }
   _cache.readFromCache = function(key, callback){
	   var _c = readCookie('storage');
	   if (_c) {
		   if (_c == 'localStorage') {
			   try {
				   getLocalStorage(key, function(data) {
					   if (data) {
						   callback({
							   response: data
						   });
					   } else {
						   callback({ response: {}, reload: true });
					   }
				   });
			   } catch (e) {
				   callback({ response: {}, reload: true });
			   }
		   } else {
			   callback({ response: {}, reload: true });
		   }
	   } else {
		   deleteLocalStorage(key,  function() {
			   //console.log('deleteLocalStorage');
		   });
		   callback({ response: {}, reload: true });
	   }
   };
   _cache.deleteFromCache = function(key,  callback){
	   deleteLocalStorage(key,  function() {
		   //console.log('deleteLocalStorage');
	   });
   };
	_cache.setCookie=setCookie;
	_cache.readCookie=readCookie;
	_cache.deleteCookie=deleteCookie;
return _cache;
}());



var CSQT_INFRASTRUCTURE = (function() {
   var _infrastructure = {},
	   isLoaded = false,
	   leftlinks = [],
	   storage = null;
   var activeLink = "contractsLink";

   function loadComplete() {
	   isLoaded = true;
   }

   function load(url, reload, callback) {
	   if (url == '/csqt/secured/user/me') {
		   if(reload){
			   CSQT_LOCAL_CACHE.deleteCookie('storage');
			   CSQT_LOCAL_CACHE.deleteFromCache('me', function(){/*console.log('cache busted')*/});
			   loadAJAX(url, callback);
		   }
		   else{
			   CSQT_LOCAL_CACHE.readFromCache('me', function(obj){
				   if(obj && !obj.reload){
					   callback({response: obj.response});
				   }
				   else{
					   loadAJAX(url, callback);
				   }
			   });
		   }
	   }
	   else if (url == '/csqt/secured/main/settings') {
		   if(reload){
			   CSQT_LOCAL_CACHE.deleteCookie('storage');
			   CSQT_LOCAL_CACHE.deleteFromCache('settings',  function(){/*console.log('cache busted')*/});
			   loadAJAX(url, callback);
		   }
		   else{
			   CSQT_LOCAL_CACHE.readFromCache('settings', function(obj){
				   if(obj && !obj.reload){
					   callback({response: obj.response});
				   }
				   else{
					   loadAJAX(url, callback);
				   }
			   });
		   }
	   }else {
		   loadAJAX(url, callback);
	   }

   }

   function loadAJAX(url, callback) {
	   var xhr;

	   if (typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
	   else {
		   var versions = ["MSXML2.XmlHttp.5.0",
			   "MSXML2.XmlHttp.4.0",
			   "MSXML2.XmlHttp.3.0",
			   "MSXML2.XmlHttp.2.0",
			   "Microsoft.XmlHttp"
		   ]

		   for (var i = 0, len = versions.length; i < len; i++) {
			   try {
				   xhr = new ActiveXObject(versions[i]);
				   break;
			   } catch (e) {}
		   }
	   }

	   xhr.onreadystatechange = ensureReadiness;

	   function ensureReadiness() {
		   if (xhr.readyState < 4) {
			   return;
		   }

		   if (xhr.status !== 200) {
			   return;
		   }

		   if (xhr.readyState === 4) {
			   if (url == '/csqt/secured/user/me') {
				   CSQT_LOCAL_CACHE.writeToCache('me',  JSON.parse(xhr.response));
			   }
			   else if (url == '/csqt/secured/main/settings') {
				   CSQT_LOCAL_CACHE.writeToCache('settings', JSON.parse(xhr.response));
			   }
			   callback(xhr);
		   }
	   }

	   xhr.open('GET', url, true);
	   try{
		   xhr.setRequestHeader("cache-control", "max-age=0, no-cache, no-store, must-revalidate");
	   }
	   catch(e){
		   //console.log('Cannot set cache controls')
	   }
	   xhr.send('');
   }

   function changeClass(_ele, _class) {

	   document.getElementById(_ele).className = _class;
   }

   function addClass(_ele, _class) {
	   // console.log(_ele);
	   if (document.getElementById(_ele) != undefined)
		   document.getElementById(_ele).className += " " + _class;
   }

   function removeClass(_ele, _class) {
	   var _r = new RegExp('(\\s|^)' + _class + '(\\s|$)');
	   document.getElementById(_ele).className =
		   document.getElementById(_ele).className.replace(_r, '');
   }

   function titleCase(str) {
	   return str.split(" ").map(function(i) {
		   return i[0].toUpperCase() + i.substring(1)
	   }).join(" ");
   }

   function getLink(linkName){
	   var ret= '<div class="field-tip" id="'+linkName+'Link">'
	   +'		<img src="/csqt/static/images/leftnav/'+linkName+'.svg" class="icon-dashboard nav-icon">			'
	   +'	    <div style="width:70px;">'
	   +'	        <div class="title" id="label'+titleCase(linkName)+'"></div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'      	<div class="tip-content"><b>'+titleCase(linkName == 'orders'  ? 'Order Status' : (linkName == 'apsqt'  ? "Professional Services" : linkName))+'</b></div>'
	   +'	    </div>'
	   +'	</div>';
	   return ret;
   }
   function getEBAdminLinks(){
	   var hashSign='?hash=';
	   if(window.location.href.indexOf('/csqt/admin/')>0){
		   hashSign='#';
	   }
	   return '				<div style="margin-top: 10px;" id="ebAdminDashboards">'
	   +'					<div  style="font-size:20px;">Dashboards</div>'
	   +'					<ul style="display: block;  ">'
	   +'						<li  ><a href="/csqt/admin/secured'+hashSign+'/ebquotes" class="push" data-swat-route="/ebquotes" >Early Bird Quotes</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/orders" class="push" data-swat-route="/orders" >Early Bird Orders</a></li>'
	   +'					</ul>'
	   +'				</div>'
	   +'				<div  style="margin-top: 10px;" id="ebAdminTools">'
	   +'					<div  style="font-size:20px;">Early Bird Admin</div>'
	   +'					<ul style="display: block;">'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/ebupload" class="push" data-swat-route="/ebupload" >Upload Early Bird Dataset</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/eblog" class="push" data-swat-route="/eblog" >Early Bird Upload History</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/filters" class="push" data-swat-route="/filters" >Early Bird Filters</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/ebdiscounts" class="push" data-swat-route="/ebdiscounts" >Early Bird Discount</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/costofliving" class="push" data-swat-route="/costofliving" >Early Bird Cost Of Living</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/termsandconditions" class="push" data-swat-route="/termsandconditions" >Early Bird Terms And Conditions</a></li>'
	   +'					</ul>'
	   +'				</div>';
   }
   
   function getAPSConfigLinks(){
	   var hashSign='?hash=';
	   if(window.location.href.indexOf('/csqt/apsconfigui/')>0){
		   hashSign='#';
	   }
	   return 	'		<div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'					<div  style="font-size:20px;">APS Custom Professional Service</div>'
	   +'					<ul style="display: block;">'
	   +'						<li ><a href="/csqt/apsconfigui" class="push" >APS Configurator</a></li>'
	   +'					</ul>'
	   +'				</div>';
   }
   
   function getCSQTAdminLinks(){
	   var hashSign='?hash=';
	   if(window.location.href.indexOf('/csqt/admin/')>0){
		   hashSign='#';
	   }
	   return 	'				<div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'					<div  style="font-size:20px;">A1S Renewals Admin</div>'
	   +'					<ul style="display: block;">'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/useradmin" class="push" data-swat-route="/useradmin" >User Admin</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/applicationsettings" class="push" data-swat-route="/applicationsettings" >Application Settings</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/broadcast" class="push" data-swat-route="/broadcast" >A1S Renewals Broadcasts</a></li>'
	   +'					</ul>'
	   +'				</div>';
   }

   function getDATAAdminLinks(){
	   var hashSign='?hash=';
	   if(window.location.href.indexOf('/csqt/admin/')>0){
		   hashSign='#';
	   }
	   return 	'				<div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'					<div  style="font-size:20px;">DATA Admin</div>'
	   +'					<ul style="display: block;">'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/productadmin" class="push" data-swat-route="/productadmin" >Product Admin</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/countryadmin" class="push" data-swat-route="/countryadmin" >Country Admin</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/offeradmin" class="push" data-swat-route="/offeradmin" >Offer Admin</a></li>'
	   +'						<li ><a href="/csqt/admin/secured'+hashSign+'/vendoradmin" class="push" data-swat-route="/vendoradmin" >Vendor Admin</a></li>'
	   +'					</ul>'
	   +'				</div>';
   }

   function getIPAdminLinks(){
	   var iposs=false;
	   var ipossLink = '/csqt/iposs/secured#';
	   if(window.location.href.indexOf('/csqt/iposs/secured#/')>0){
		   iposs=true;
		   ipossLink='#';
	   }
	   return 	'			<div  style="margin-top: 10px;" id="ipAdminTools">'
	   +'					<div  style="font-size:20px;">Auto-Gen Admin</div>'
	   +'					<ul style="display: block;">'
	   +'						<li ><a href="'+ipossLink+'/upload" class="push" >Upload Auto-Gen Dataset</a></li>'
	   +'						<li ><a href="'+ipossLink+'/iplogs" class="push" >Auto-Gen Upload History</a></li>'
	   +'						<li ><a href="'+ipossLink+'/ipquotes" class="push" >Auto-Gen Quotes</a></li>'
	   +'					</ul>'
	   +'				</div>';
   }


   function getAutoCotermAdminLinks(){
	   var iposs=false;
	   var ipossLink = '/csqt/iposs/secured#';
	   if(window.location.href.indexOf('/csqt/iposs/secured#/')>0){
		   iposs=true;
		   ipossLink='#';
	   }
	   return  '           <div  style="margin-top: 10px;" id="autocotermAdminTools">'
	   +'                  <div  style="font-size:20px;">Auto-Coterm Admin</div>'
	   +'                  <ul style="display: block;">'
	   +'                      <li ><a href="'+ipossLink+'/uploads" class="push" >Upload AutoCoterm Dataset</a></li>'
	   +'                      <li ><a href="'+ipossLink+'/history" class="push" >AutoCoterm Upload History</a></li>'
	   +'                      <li ><a href="'+ipossLink+'/locations" class="push" >AutoCoterm Locations</a></li>'
	   +'                  </ul>'
	   +'              </div>';
   }

   function getSMTAdminLinks(requestFromSMTModule){
	   //console.log('getSMTAdminLinks ');
	   return 	'				<div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'					<div  style="font-size:20px;">SMT Admin</div>'
	   +'					<ul style="display: block;">'
	   + (!requestFromSMTModule ? '<li ><a href="/csqt/smt/secured/#/smtuseradmin" class="push" >SMT User Admin</a></li>' :'<li ><a href="#/smtuseradmin" class="push" >SMT User Admin</a></li>')
	   +'					</ul>'
	   +'				</div>';
   }
   function getSASAdminLinks(){
	   var sasLink = '/csqt/sas/#';
	   if(window.location.href.indexOf('/csqt/sas/')>0){
		   sasLink='#';
	   }
		  return 	'				<div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'					<div  style="font-size:20px;">SAS Admin</div>'
	   +'					<ul style="display: block;">'
	   + 					'<li ><a href="'+sasLink+'/docs/admin" class="push" >SAS User Admin</a></li>'
	   +'					</ul>'
	   +'				</div>';
   }

   // SFDC
   function getSFDCAdminLink(){
	   var sfdcLink = '../../../csqt/sfdc/admin/secured#';
	   if(window.location.href.indexOf('/csqt/sfdc/admin/')>0){
		   sfdcLink='#';
	   }
		  return 	'				<div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'					<div  style="font-size:20px;">SFDC Admin</div>'
	   +'					<ul style="display: block;">'
	   + 					'<li ><a href="'+sfdcLink+'/opportunityAdmin" class="push" >Opportunity Admin</a></li>'
	   +'					</ul>'
	   +'				</div>';
   }
	function getPOChaseAdminLink(){

	   var pochaseLink = '../../../csqt/pochase/secured#';
	   if(window.location.href.indexOf('/csqt/pochase/secured/')>0){
		   sfdcLink='#';
	   }
	   return  '           <div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'                  <div  style="font-size:20px;">PO Admin</div>'
	   +'                  <ul style="display: block;">'
	   +'                      <li ><a href="'+pochaseLink+'/poUploads" class="push" >POChase Upload</a></li>'
	   +'                      <li ><a href="'+pochaseLink+'/poDashboard" class="push" >POChase Dashboard</a></li>'
	   +'                  </ul>'
	   +'              </div>';
  }
   function getOpportunityStatusAdminLink(){

		var opportunityStatusLink = '../../../csqt/sfdc/admin/secured#';
		if(window.location.href.indexOf('/csqt/sfdc/admin/')>0){
			sfdcLink='#';
		}
		  return 	'				<div  style="margin-top: 10px;" id="csqtAdminTools">'
	   +'					<div  style="font-size:20px;">User Reported OpptyStatus Admin</div>'
	   +'					<ul style="display: block;">'
	   + 					'<li id="newLink"><a href="'+opportunityStatusLink+'/userReportedOpptyStatusAdmin" class="push" >Assigned Quoter Bulk Update</a></li>'
   
	   +'					</ul>'
	   +'				</div>';
   }

   function getAPSConfigDrawer(showAPSConfigLinks){
			   return '	<div style="display:none;padding:15px;overflow-x:hidden; overflow-y:visible; height:730px;" class="leftDrawer" id="apsConfigDrawer">'
			   +'		<button id="apsConfigcloseDrawer" class="btn large red searchBarButton" style="float:right">Close</button>'
			   +'		<div style="clear:both;"></div>'
			   +'		<div style="width:100%;">'
			   + 			(showAPSConfigLinks ? getAPSConfigLinks():'')
			   +'		</div>'
			   +'	</div>';
		   }
   function getAdminDrawer(showEBAdminLinks, showCSQTAdminLink,showSMTAdminLinks,requestFromSMTModule,showIPOSSAdminLinks,
   showDATAAdminLink,showSFDCAdminLinks,showPOChaseAdminLinks,showOpportunityStatusAdminLinks){
	   return '	<div style="display:none;padding:15px;overflow-x:hidden; overflow-y:visible; height:730px;" class="leftDrawer" id="adminDrawer">'
	   +'		<button id="closeDrawer" class="btn large red searchBarButton" style="float:right">Close</button>'
	   +'		<div style="clear:both;"></div>'
	   +'		<div style="width:100%;">'
	   + 			(showEBAdminLinks?getEBAdminLinks():'')
	   + 			(showCSQTAdminLink?getCSQTAdminLinks():'')
	   + 			(showDATAAdminLink?getDATAAdminLinks():'')
	   +			(showIPOSSAdminLinks?getIPAdminLinks():'')
	   +           (showIPOSSAdminLinks?getAutoCotermAdminLinks():'')
	   +			(showSMTAdminLinks?getSMTAdminLinks():'')
	   +			(showCSQTAdminLink?getSASAdminLinks():'')
	   +			(showSFDCAdminLinks?getSFDCAdminLink():'')
	   +			(showPOChaseAdminLinks?getPOChaseAdminLink():'')
	   +			(showOpportunityStatusAdminLinks?getOpportunityStatusAdminLink():'')
	   +'		</div>'
	   +'	</div>';
   }
   function getResponsiveMenu(user, _context){
	   return  '	<div id="navDialog" style="background:#FFFFFF;position:fixed;bottom:0;top:0!important;left:0!important;display:none;z-index:999; padding:30px; color:#333333;">'
	   +'	 	<div style="background-color: #c90000;float: left;height: auto; margin: -30px 30px -30px -30px !important;padding: -30px !important;position: absolute; width: 100%; color:#FFFFFF;" >'
	   +'			<div style="float:left;line-height:32px;font-size: 18px; margin: 7px 10px 0 16px;">Welcome,'
	   +'				<div  style="float: right;  padding-left: 10px;"id="userName">'+user.firstName				+' '+ user.lastName				+' </div>'
	   +'		   	</div>'
	   +'		   	<div style="font-size: 16px; margin: 7px 10px 0 16px;">'
	   +'		 	   	<a href="'+_context+'logout" style="font-weight:bold; font-family: \'proxima-nova\'; font-size:16px; color: #ffffff;text-align: left;padding-left: 1px; background: none; text-decoration: none;"> Logout</a>'
	   +'		   	</div>'
	   +'	   	</div>'
	   +'	   	<div style="clear:both;"></div>'
	   +'	 <div id="navContent">'
	   +'	   	<div style="padding:80px 0 25px 0;cursor: pointer;">'
	   +'	    <div style="float:left;line-height:32px;font-size: 18px; ">'
	   +'	    <div id="nav_dashboardLink"   class="image_dashboard" style="float:left; width: 134px;" id="nav_labelDashboard" ><div style="float:right">Dashboard</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'		</div>'
	   +'	</div>';
   }
   function getHeader(user){
	   if(user){
		   return ' <div class="container" style="overflow:none!important;">'
		   +'		<div style="float:left;" class="visible-sm visible-xs" id="burger"><img src="/csqt/static/images/icons/menu.png" style="cursor: pointer;">'
		   +'      </div>'
		   +'      <div style="float:left;width:40px;" class="visible-sm visible-xs">&nbsp;</div>'
		   +'      <div style="float:left;">'
		   +'          <svg class="icon-avaya" viewBox="0 0 88.8 25">'
		   +'              <g>'
		   +'                  <polygon points="85.2,18 88.8,18 79.8,0 77.3,0 68.4,18 72,18 73.3,15 81.5,15 80.5,13 74.4,13 78.6,3.9"></polygon>'
		   +'                  <polygon points="9,0 0,18 3.6,18 4.9,15 13.1,15 12.1,13 6.1,13 10.2,3.9 16.8,18 20.4,18 11.5,0"></polygon>'
		   +'                  <polygon points="43,0 34.1,18 37.7,18 39,15 47.2,15 46.2,13 40.1,13 44.3,3.9 50.9,18 54.5,18 45.5,0"></polygon>'
		   +'                  <polygon points="33.8,0 27.2,14.4 20.6,0 17,0 26,18 26.1,18 28.3,18 28.5,18 37.4,0"></polygon>'
		   +'                  <polygon points="68.2,0 61.4,14.7 55,0 51.4,0 59.6,18.2 56,25 59.5,25 71.8,0"></polygon>'
		   +'              </g>'
		   +'          </svg>'
		   +'          <span style="color: #ffffff; font-weight:bold; font-size:18px; font-family: "proxima-nova";"> One Source</span>'
		   +'      </div>'
		   +'      <div style="float:right;" class="visible-md visible-lg">'
		   +'          <div style="text-align: left; float: left; padding-right: 7px; margin-top:0px;">'
		   +'              <span class="leftContent" style="font-weight:bold; font-family: "proxima-nova"; font-size:13px; color: #ffffff; letter-spacing: 0; opacity: 1; text-align: left;" id="companyLabel">Company: </span>'
		   +'              <span id="loggedinUserCompany" class="leftContent" style="padding-left: 2px; font-weight:bold; font-family: "proxima-nova"; font-size:13px; color: #ffffff; letter-spacing: 0; opacity: 1; text-align: left;" id="companyName">'+user.companyName				+'</span>'
		   +'          </div>'
		   +'          <div style="float: left; padding-right: 5px; padding-top: 4px;">'
		   +'              <svg class="icon-header-left" viewBox="0 0 48 48">'
		   +'                  <g>'
		   +'						<path d="M6,34.5V42h7.5l22.1-22.1l-7.5-7.5C28.1,12.4,6,34.5,6,34.5z M41.4,14.1c0.8-0.8,0.8-2.1,0-2.8l-4.7-4.7 c-0.8-0.8-2-0.8-2.8,0l-3.7,3.7l7.5,7.5C37.8,17.7,41.4,14.1,41.4,14.1z"></path>'
		   +'                  </g>'
		   +'              </svg>'
		   +'          </div>'
		   +'          <div style="float: left; margin-top: 10px; margin-left:30px;">'
		   +'              <span style="font-weight:bold; font-family: "proxima-nova"; font-size:13px; color: #ffffff;text-align: left;" id="userContext">'
		   +'										<span id="labelWelcome">Welcome</span>,'
		   +'	              <span id="loggedinUserName" id="userNameHead">'+user.firstName				+' '+ user.lastName				+'</span>'
		   +'              </span>'
		   +'              <a id="logout" style="font-family: \'proxima-nova\'; font-size:14px; color: #ffffff;text-align: left;padding-left: 10px; background: none; text-decoration: none;"> Logout</a>'
		   +'          </div>'
		   +'      </div>'
		   +'      <div style="clear:both;"></div></div>';
	   }
	   else{
		   return ' <div class="container" style="overflow:none!important;">'
		   +'		<div style="float:left;" class="visible-sm visible-xs" id="burger"><img src="/csqt/static/images/icons/menu.png" style="cursor: pointer;">'
		   +'      </div>'
		   +'      <div style="float:left;width:15px;" class="visible-sm visible-xs">&nbsp;</div>'
		   +'      <div style="float:left;">'
		   +'          <svg class="icon-avaya" viewBox="0 0 88.8 25">'
		   +'              <g>'
		   +'                  <polygon points="85.2,18 88.8,18 79.8,0 77.3,0 68.4,18 72,18 73.3,15 81.5,15 80.5,13 74.4,13 78.6,3.9"></polygon>'
		   +'                  <polygon points="9,0 0,18 3.6,18 4.9,15 13.1,15 12.1,13 6.1,13 10.2,3.9 16.8,18 20.4,18 11.5,0"></polygon>'
		   +'                  <polygon points="43,0 34.1,18 37.7,18 39,15 47.2,15 46.2,13 40.1,13 44.3,3.9 50.9,18 54.5,18 45.5,0"></polygon>'
		   +'                  <polygon points="33.8,0 27.2,14.4 20.6,0 17,0 26,18 26.1,18 28.3,18 28.5,18 37.4,0"></polygon>'
		   +'                  <polygon points="68.2,0 61.4,14.7 55,0 51.4,0 59.6,18.2 56,25 59.5,25 71.8,0"></polygon>'
		   +'              </g>'
		   +'          </svg>'
		   +'          <span style="color: #ffffff; font-weight:bold; font-size:18px; font-family: "proxima-nova";"> One Source</span>'
		   +'      </div>'
		   +'      <div style="clear:both;"></div></div>';
	   }
   }
   function getEarlyBirdHeader(user){
	   var Company='Company :';
	   if(user.userSettings[0].languageId=='fr'){
		   Company="Compagnie :";
	   }
	   var hashSign='?hash=';
	   if(window.location.href.indexOf('/csqt/earlyrenewals/')>0){
		   hashSign='#';
	   }
	   if(user){
		   return ' <div class="content contentx" style="overflow:none!important;">'
		   +'        <span class="leftContent" style="font-family: "proxima-nova"; font-size:13px; color: #ffffff; letter-spacing: 0; opacity: 1; text-align: left;" id="companyLabel">'+Company+' </span>'
		   +'        <span class="leftContent" style="padding-left: 2px; font-family: "proxima-nova"; font-size:13px; color: #ffffff; letter-spacing: 0; opacity: 1; text-align: left;" id="companyName">'+user.companyName+'</span>'
		   +'        <div class="dropdown-trigger"><a style="color: rgb(255, 255, 255) ! important; text-decoration: none; padding-left: 0px ! important;" class="headerLink" target="_blank" href="https://support.avaya.com/AvayaRenewalsHelp/">'
		   +'        <img style="margin-left: -18px; margin-top: 1px;" src="/csqt/static/images/help/help.png"><span data-dojo-attach-point="helpLabel" class="headerLink" style="padding-left: 0px ! important;">Help</span></a></div>'
		   +'        <div style="float:right;" class="visible-md visible-lg">'
		   +'          <div style="float: left; margin-top: 10px; padding-right: 25px; padding-left:10px;">'
		   +'              <span style="font-family: "proxima-nova"; font-size:13px; color: #ffffff;text-align: left;" id="userContext">'
		   +'				  <span id="labelWelcome">Welcome</span>,'
		   +'	              <span id="loggedinUserName" id="userNameHead">'+user.firstName+' '+ user.lastName+'</span>'
		   +'              </span>'
		   +'              <a href="/csqt/earlyrenewals/secured'+hashSign+'/profile" class="headerLink"> My Profile</a>'
		   +'              <a id="logout" class="headerLink"> Logout</a>'
		   +'          </div>'
		   +'      	</div>'
		   +'      	</div>'
		   +'      </div>';
	   }
	   else{
		   return ' <div class="container" style="overflow:none!important;">'
		   +'		<div style="float:left;" class="visible-sm visible-xs" id="burger"><img src="/csqt/static/images/icons/menu.png" style="cursor: pointer;">'
		   +'      </div>'
		   +'      <div style="float:left;width:15px;" class="visible-sm visible-xs">&nbsp;</div>'
		   +'      <div style="float:left;">'
		   +'          <svg class="icon-avaya" viewBox="0 0 88.8 25">'
		   +'              <g>'
		   +'                  <polygon points="85.2,18 88.8,18 79.8,0 77.3,0 68.4,18 72,18 73.3,15 81.5,15 80.5,13 74.4,13 78.6,3.9"></polygon>'
		   +'                  <polygon points="9,0 0,18 3.6,18 4.9,15 13.1,15 12.1,13 6.1,13 10.2,3.9 16.8,18 20.4,18 11.5,0"></polygon>'
		   +'                  <polygon points="43,0 34.1,18 37.7,18 39,15 47.2,15 46.2,13 40.1,13 44.3,3.9 50.9,18 54.5,18 45.5,0"></polygon>'
		   +'                  <polygon points="33.8,0 27.2,14.4 20.6,0 17,0 26,18 26.1,18 28.3,18 28.5,18 37.4,0"></polygon>'
		   +'                  <polygon points="68.2,0 61.4,14.7 55,0 51.4,0 59.6,18.2 56,25 59.5,25 71.8,0"></polygon>'
		   +'              </g>'
		   +'          </svg>'
		   +'          <span style="color: #ffffff; font-weight:bold; font-size:18px; font-family: "proxima-nova";"> One Source</span>'
		   +'      </div>'
		   +'      <div style="clear:both;"></div></div>';
	   }
   }
   function getEnrollmentHeader(){
		   return ' <div class="content" style="overflow:none!important;">'
		   +'        <div class="dropdown-trigger"><a style="color: rgb(255, 255, 255) ! important; text-decoration: none; padding-left: 0px ! important;" class="headerLink" target="_blank" href="https://support.avaya.com/AvayaRenewalsHelp/">'
		   +'        <img style="margin-left: -18px; margin-top: 1px;" src="/csqt/static/images/help/help.png"><span data-dojo-attach-point="helpLabel" class="headerLink" style="padding-left: 0px ! important;">Help</span></a></div>'
		   +'      	</div>'
		   +'      	</div>'
		   +'      </div>';
   }


   function getLeftNav(links, showAPSConfigLinks, showEBAdminLinks, showCSQTAdminLinks,enableSMTModule,smtAdmin, user, _context,requestFromSMTModule,showIPOSSAdminLinks,showDATAAdminLinks,showSFDCAdminLinks,showPOChaseAdminLinks,showOpportunityStatusAdminLinks){


	   return '<div class="visible-md visible-lg">'
	   +'	<div class="sidebar" >'
	   + 		links.map(function(i){return getLink(i)}).join(" ")
	   + ((showEBAdminLinks || showCSQTAdminLinks
			   || showDATAAdminLinks || showIPOSSAdminLinks
			   || showSFDCAdminLinks || showPOChaseAdminLinks
			   || showOpportunityStatusAdminLinks || (smtAdmin && user.lmwStatus == 1)) ? getAdminDrawer(
			   showEBAdminLinks, showCSQTAdminLinks, smtAdmin,
			   requestFromSMTModule, showIPOSSAdminLinks,
			   showDATAAdminLinks, showSFDCAdminLinks,
			   showPOChaseAdminLinks, showOpportunityStatusAdminLinks)
			   : '')
	   + getAPSConfigDrawer(showAPSConfigLinks)

	   +'	</div>'
	   +'</div>'
	   +'<div class="nav_sidebar" >'
	   + 	getResponsiveMenu(user, _context)
	   +'	<div style="clear:both;"></div>'
	   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
	   +'		<div  style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
	   +'	   <div id="nav_quotesLink" class="image_quotes" style="float:left; width: 102px;" id="nav_labelDashboard" ><div style="float:right">Quotes</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'	</div>'
	   +'	</div>'
	   +'	<div style="clear:both;"></div>'
	   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
	   +'		<div style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
	   +'	   <div id="nav_contractsLink" class="image_contracts" style="float:left; width: 120px;" id="nav_labelDashboard" ><div style="float:right">Contracts</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'	</div>'
	   +'	</div>'
	   +'	<div style="clear:both;"></div>		'
	   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
	   +'		<div style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
	   +'	   <div id="nav_locationsLink" class="image_locations" style="float:left; width: 120px;" id="nav_labelDashboard" ><div style="float:right">Locations</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'	</div>'
	   +'	</div>	'
	   +'	<div style="clear:both;"></div>		'
	   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
	   +'		<div style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
	   +'	   <div id="nav_ordersLink" class="image_orderStatus" style="float:left; width: 120px;" id="nav_labelDashboard" ><div style="float:right">OrderStatus</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'	</div>'
	   +'	</div>	'
	   +'	<div style="clear:both;"></div>'
	   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
	   +'		<div  style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
	   +'	   <div id="nav_apsqtLink" class="image_quotes" style="float:left; width: 102px;" id="nav_labelDashboard" ><div style="float:right">APSQT</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'	</div>'
	   +'	</div>'
	   + smtIcons(enableSMTModule,user)
/*		+'	<div style="clear:both;"></div>'
	   +'	<div id="nav_EBAdminLink" style="padding:0 0 25px 0;cursor: pointer;">'
	   +'		<img src="/csqt/static/images/leftnav/admin@3x.png" style="float:left;">'
	   +'	    <div style="float:left;margin-left:15px;line-height:32px;font-size: 18px;">'
	   +'	        <div class="title"  id="nav_labelSupport">Admin</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'	</div>	'*/
	   +'	<div style="clear:both;"></div>'
	   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
	   +'		<div style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
	   +'	   <div id="nav_supportLink" class="image_support" style="float:left; width: 105px;" id="nav_labelDashboard" ><div style="float:right">Support</div>'
	   +'	        <div class="notify" style="display:none;">0</div>'
	   +'	    </div>'
	   +'	    <div style="clear:both;"></div>'
	   +'	</div>'
	   +'	</div>'
	   +'	 <div style="clear:both;"></div>'
	   +'	 </div>'
	   +'	</div>'
	   +'</div>';
   }
   function getFooter(_buildNumber){
	   return '		<div class="content">'
	   +'  		<ul id="footer-nav" class="list-unstyled">'
	   +'    			<li><a href="http://www.avaya.com/usa/partner-locator/" target="_blank"><span id="labelFindAPartner">Find a partner</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com/usa/termsofuse" target="_blank"><span id="labelTermsOfUse"> Terms of use</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com" target="_blank"><span id="labelWWW"> www.avaya.com</span></a></li>'
	   +'  		</ul>'
	   +'  		<p class="copyright">&copy; 2013-2014 Avaya Inc.</p>'
	   +'		</div>';
   }
   function getEarlyBirdFooter(_buildNumber){
	   return '		<div class="content">'
	   +'  		<ul id="footer-nav" class="list-unstyled">'
	   +'    			<li><a href="/csqt/earlyrenewals/secured#/profile" class="push" data-swat-route="/edituser"><span data-dojo-attach-point="labelManageMyProfile">Manage My Profile</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com/usa/termsofuse" target="_blank"><span data-dojo-attach-point="labelTermsOfUse">Terms Of Use</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com/usa/privacystatement" target="_blank"><span data-dojo-attach-point="labelPrivacy">Privacy</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com/usa/contacts" target="_blank"><span data-dojo-attach-point="labelContactUs">Contact Us</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com" target="_blank">Avaya.com</a></li>'
	   +'  		</ul>'
	   +'  		<span style="color:#ffffff">'+_buildNumber+'</span>'
	   +'  		<p class="copyright">&copy; 2014-2015 Avaya Inc.</p>'
	   +'			<div class="social-icon">'
	   +'				<a href="http://www.twitter.com/avaya" target="_blank"><img src="/csqt/static/images/footer/twitter.png"></img></a>'
	   +'				<a href="http://www.facebook.com/avaya" target="_blank"><img src="/csqt/static/images/footer/facebook.png"></img></a>'
	   +'				<a href="http://www.youtube.com/Avayainteractive" target="_blank"><img src="/csqt/static/images/footer/youtube.png"></img></a>'
	   +'				<a href="http://www.linkedin.com/companies/1494/Avaya" target="_blank"><img src="/csqt/static/images/footer/linkedin.png"></img></a>'
	   +'				<a href="http://www.avaya.com/blogs/" target="_blank"><img src="/csqt/static/images/footer/avaya.png"></img></a>'
	   +'				<a href="https://plus.google.com/+avaya" target="_blank"><img src="/csqt/static/images/footer/google.png"></img></a>'
	   +'				<a href="http://www.pinterest.com/AvayaInc/" target="_blank"><img src="/csqt/static/images/footer/pinterest.png"></img></a>'
	   +'			</div>'
	   +'		</div>';
   }
   function getEnrollmentFooter(_buildNumber){
	   return '		<div class="content">'
	   +'  		<ul id="footer-nav" class="list-unstyled">'
	   +'    			<li><a href="http://www.avaya.com/usa/termsofuse" target="_blank"><span data-dojo-attach-point="labelTermsOfUse">Terms Of Use</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com/usa/privacystatement" target="_blank"><span data-dojo-attach-point="labelPrivacy">Privacy</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com/usa/contacts" target="_blank"><span data-dojo-attach-point="labelContactUs">Contact Us</span></a></li>'
	   +'    			<li><a href="http://www.avaya.com" target="_blank">Avaya.com</a></li>'
	   +'  		</ul>'
	   +'  		<span style="color:#ffffff">'+_buildNumber+'</span>'
	   +'  		<p class="copyright">&copy; 2014-2015 Avaya Inc.</p>'
	   +'			<div class="social-icon">'
	   +'				<a href="http://www.twitter.com/avaya" target="_blank"><img src="/csqt/static/images/footer/twitter.png"></img></a>'
	   +'				<a href="http://www.facebook.com/avaya" target="_blank"><img src="/csqt/static/images/footer/facebook.png"></img></a>'
	   +'				<a href="http://www.youtube.com/Avayainteractive" target="_blank"><img src="/csqt/static/images/footer/youtube.png"></img></a>'
	   +'				<a href="http://www.linkedin.com/companies/1494/Avaya" target="_blank"><img src="/csqt/static/images/footer/linkedin.png"></img></a>'
	   +'				<a href="http://www.avaya.com/blogs/" target="_blank"><img src="/csqt/static/images/footer/avaya.png"></img></a>'
	   +'				<a href="https://plus.google.com/+avaya" target="_blank"><img src="/csqt/static/images/footer/google.png"></img></a>'
	   +'				<a href="http://www.pinterest.com/AvayaInc/" target="_blank"><img src="/csqt/static/images/footer/pinterest.png"></img></a>'
	   +'			</div>'
	   +'		</div>';
   }

   function smtIcons(showSMTModule,user){
	   //if(showSMTModule && user.canAccessLMW == 1){
	   if(showSMTModule){
		   return '	<div style="clear:both;"></div>		'
		   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
		   +'		<div style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
		   +'	   <div id="nav_networkLink" class="image_network" style="float:left; width: 120px;" id="nav_labelDashboard" ><div style="float:right">Network</div>'
		   +'	        <div class="notify" style="display:none;">0</div>'
		   +'	    </div>'
		   +'	    <div style="clear:both;"></div>'
		   +'	</div>'
		   +'	</div>	'
		   +'	<div style="clear:both;"></div>		'
		   +'	<div   style="padding:0 0 25px 0;cursor: pointer;">'
		   +'		<div style="float:left;line-height:32px;font-size: 18px; margin-top: 30px;">'
		   +'	   <div id="nav_licenseLink" class="image_license" style="float:left; width: 120px;" id="nav_labelDashboard" ><div style="float:right">License</div>'
		   +'	        <div class="notify" style="display:none;">0</div>'
		   +'	    </div>'
		   +'	    <div style="clear:both;"></div>'
		   +'	</div>'
		   +'	</div>	';
	   }

   }
   function bindEBEvents(_context){
	   document.getElementById("logout").addEventListener("click", function(){
		   location.href=_context+"logout"
	   });
   }

	function bindEvents(links, showAPSConfigLinks, showEBAdminLinks, showCSQTAdminLinks, showSMTAdminLinks,showIPOSSAdminLinks, _context,user,requestFromSMTModule,showDATAAdminLinks,showSFDCAdminLinks,showPOChaseAdminLinks,showOpportunityStatusAdminLinks){

	   //console.log("(user.userType "+ user.userType + "user.userTypeId "+ user.userTypeId );
	   if((user.userType == "CUSTOMER" && requestFromSMTModule) || user.userType != "CUSTOMER"){  // added logic for avoiding this binding for endCustomer. Endcustomer header will come DOJO widgets not from this.
		   //console.log("going into this ...");
		   document.getElementById("logout").addEventListener("click", function(){
			   //console.log(_context+"logout");
			   location.href=_context+"logout"
		   });

		   if(document.getElementById("burger") != null){
			   document.getElementById("burger").addEventListener("click", function(){
				   document.getElementById("navDialog").style.display='block';
			   });
		   }
	   }


	   if(links.indexOf("dashboard")>-1){
		   document.getElementById("dashboardLink").addEventListener("click", function(evt){
			   resetActive();
			   addClass("dashboardLink", 'active');
			   self.activeLink="dashboardLink";

			   /*
				* added this logic to reuse the Dashboard icon for Endcustomer defualt pages
				* this logic is going to change once Dashboard is enable for endCustomer.
			   */
			   if(user.userType === "CUSOMTER" || user.userTypeId == 3){
				   var hashSign='?hash=';
				   if(window.location.href.indexOf('/csqt/earlyrenewals/')>0){
					   hashSign='#';
				   }
				   location.href= (requestFromSMTModule) ? '/csqt/earlyrenewals/secured'+hashSign+'/contracts' : '#/contracts'
			   }
			   if(user.userType === "ASSOCIATE" || user.userTypeId == 1 || user.userType === "PARTNER" || user.userTypeId == 2){
				   // added this logic to navigate 360 Dashboard page only for Associate.
				   location.href='/csqt/360';
			   }
			   //location.href = (user.userType === "CUSOMTER" || user.userTypeId == 3) ? '/contracts' : '/csqt/dashboard'
			   //location.href='/csqt/admin'
		   });
	   }
	   if(links.indexOf("quotes")>-1){
		   var hashSign='?hash=';
		   if(window.location.href.indexOf('/csqt/gridview/')>=0){
			   hashSign='#';
		   }
		   if(window.location.href.indexOf('/csqt/quoting/')>=0){
			   hashSign='#';
		   }

		   document.getElementById("quotesLink").addEventListener("click", function(evt){
			   resetActive();
			   addClass("quotesLink", 'active');
			   self.activeLink="quotesLink";
			   location.href='/csqt/gridview/secured'+hashSign+'/quotes';
		   });
		   document.getElementById("nav_quotesLink").addEventListener("click", function(){
			   resetActive();
			   addClass("nav_quotesLink", 'active');
			   self.activeLink="nav_quotesLink";
			   location.href='/csqt/gridview/secured'+hashSign+'/quotes';
		   });
	   }
	   if(links.indexOf("contracts")>-1){
		   var hashSign='?hash=';
		   if(window.location.href.indexOf('/csqt/gridview/')>=0){
			   hashSign='#';
		   }
		   if(window.location.href.indexOf('/csqt/quoting/')>=0){
			   hashSign='#';
		   }

		   document.getElementById("contractsLink").addEventListener("click", function(evt){
			   resetActive();
			   addClass("contractsLink", 'active');
			   self.activeLink="contractsLink";
			   location.href='/csqt/gridview/secured'+hashSign+'/contracts';

		   });
		   document.getElementById("nav_contractsLink").addEventListener("click", function(){
			   resetActive();
			   addClass("nav_contractsLink", 'active');
			   self.activeLink="nav_contractsLink";
			   location.href='/csqt/gridview/secured'+hashSign+'/contracts';

		   });
	   }
	   if(links.indexOf("locations")>-1){
		   var hashSign='?hash=';
		   if(window.location.href.indexOf('/csqt/gridview/')>=0){
			   hashSign='#';
		   }
		   if(window.location.href.indexOf('/csqt/quoting/')>=0){
			   hashSign='#';
		   }

		   document.getElementById("locationsLink").addEventListener("click", function(evt){
			   resetActive();
			   addClass("locationsLink", 'active');
			   self.activeLink="locationsLink";
			   location.href='/csqt/gridview/secured'+hashSign+'/locations';
		   });
	   }
	   // SMT icons
	   if(links.indexOf("network")>-1){
		   document.getElementById("networkLink").addEventListener("click", function(evt){
			   if(user.lmwStatus == 1){
				   resetActive();
				   addClass("networkLink", 'active');
				   location.href = !requestFromSMTModule ? '/csqt/smt/secured#/network' :'#/network'
			   }
		   });

		   document.getElementById("nav_networkLink").addEventListener("click", function(){
			   if(user.lmwStatus == 1){
				   resetActive();
				   addClass("nav_networkLink", 'active');
				   self.activeLink="nav_networkLink";
				   location.href = !requestFromSMTModule ? '/csqt/smt/secured#/network' :'#/network'
			   }

		   });


	   }
	   if(links.indexOf("license")>-1){
		   document.getElementById("licenseLink").addEventListener("click", function(evt){
			   if(user.lmwStatus == 1){
				   resetActive();
				   addClass("licenseLink", 'active');
				   location.href = !requestFromSMTModule ? '/csqt/smt/secured#/license' :'#/license'
			   }
		   });
		   document.getElementById("nav_licenseLink").addEventListener("click", function(evt){
			   if(user.lmwStatus == 1){
				   resetActive();
				   addClass("nav_licenseLink", 'active');
				   location.href = !requestFromSMTModule ? '/csqt/smt/secured#/license' :'#/license'
			   }
		   });

	   }

	   // orderStatus icons.
	   if(links.indexOf("orders")>-1){
		   document.getElementById("ordersLink").addEventListener("click", function(evt){
				   resetActive();
				   addClass("ordersLink", 'active');
				   location.href = '/csqt/orderStatus/#/order';
		   });
		   document.getElementById("nav_ordersLink").addEventListener("click", function(evt){
				   resetActive();
				   addClass("nav_ordersLink", 'active');
				   location.href ='/csqt/orderStatus/#/order';
		   });

	   }

	   if(links.indexOf("opportunity")>-1){
		   document.getElementById("opportunityLink").addEventListener("click", function(evt){

				   resetActive();
				   addClass("opportunityLink", 'active');
				   location.href = '/csqt/sfdc/dashboard/secured#/opportunityDashBoard'

		   });
		   /*document.getElementById("nav_opportunityLink").addEventListener("click", function(evt){

				   resetActive();
				   addClass("nav_opportunityLink", 'active');
				   location.href = '/csqt/sfdc/secured#/opportunityDashBoard'

		   });  */

	   }


	  if(showEBAdminLinks || showCSQTAdminLinks || showSMTAdminLinks || showIPOSSAdminLinks || showDATAAdminLinks || showSFDCAdminLinks || showPOChaseAdminLinks || showOpportunityStatusAdminLinks){
	   if(links.indexOf("admin")>-1){
			   document.getElementById("adminLink").addEventListener("click", function(evt){
				   resetActive();
				   document.getElementById("adminDrawer").style.display = "";
				   addClass("adminLink", 'active');
			   });
			   document.getElementById("closeDrawer").addEventListener("click", function(){
				   document.getElementById("adminDrawer").style.display = "none";
				   resetActive();
				   addClass(self.activeLink, 'active');
			   });
		   }
	   }
		  
		  if(showAPSConfigLinks){
		   if(links.indexOf("apsqt")>-1){
			   document.getElementById("apsqtLink").addEventListener("click", function(evt){
				   resetActive();
				   document.getElementById("apsConfigDrawer").style.display = "";
				   addClass("apsqtLink", 'active');
			   });
			   document.getElementById("apsConfigcloseDrawer").addEventListener("click", function(){
				   document.getElementById("apsConfigDrawer").style.display = "none";
				   resetActive();
				   addClass(self.activeLink, 'active');
			   });
		   }      			
				  
				  
				  
				  
				  /*if(links.indexOf("apsqt")>-1){
					  var hashSign='?hash=';
					  if(window.location.href.indexOf('/csqt/apsconfigui/')>=0){
						  hashSign='#';
					  }
					  document.getElementById("apsqtLink").addEventListener("click", function(evt){
						  resetActive(); 
						  addClass("apsqtLink", 'active');
						  self.activeLink="apsqtLink";
						  //location.href='/csqt/a1spsui/secured'+hashSign+'/apsqt';
						  location.href='/csqt/apsconfigui/';
					  });
					  document.getElementById("nav_apsqtLink").addEventListener("click", function(){
						  resetActive(); 
						  addClass("nav_apsqtLink", 'active');
						  self.activeLink="nav_apsqtLink";
						  //location.href='/csqt/a1spsui/secured'+hashSign+'/apsqt';
						  location.href='/csqt/apsconfigui/';
					  });
				  }   */   			
			  }
			  
	   if(links.indexOf("help")>-1){
		   document.getElementById("helpLink").addEventListener("click", function(evt){
			   resetActive();
			   addClass("helpLink", 'active');
			   self.activeLink="helpLink";
			   //location.href='/csqt/quoting'
		   });
	   }

   }
   function resetActive(){
	   for(var i=0; i<leftlinks.length; i++){
		   removeClass(leftlinks[i]+'Link', 'active');
		   if(leftlinks[i]=='contracts' || leftlinks[i]=='quotes' || leftlinks[i]=='apsqt' || leftlinks[i] == 'network' || leftlinks[i] == 'license' || leftlinks[i] == 'orders') removeClass('nav_'+leftlinks[i]+'Link', 'active');
	   }
   }
   _infrastructure.version = '1.0.0';
   _infrastructure.select = function(name){
	   //console.log(leftlinks);
	   resetActive();
	   addClass(name+"Link", 'active');
	   self.activeLink=name+"Link";
   }
   _infrastructure.renderWithoutUserContext =function(_headerDiv, _footerDiv, _build, _context, fn){
	   document.getElementById(_headerDiv).innerHTML=getHeader(null);
	   document.getElementById(_footerDiv).innerHTML=getFooter(_build);
	   fn();
   }
   _infrastructure.reloadCurrentUser =function(fn){
	   var self = this;
	   load('/csqt/secured/user/me', true, function(data){
		   self.user=JSON.parse(data.response);
		   load('/csqt/secured/main/settings', true, function(_data){
			   self.user.userSettings=JSON.parse(_data.response);
			   fn(self.user);
		   });
	   });
   }
   _infrastructure.render =function(_headerDiv, _leftDiv, _footerDiv, _build, _context, fn){
	   load('/csqt/secured/user/me', true, function(data){
		   //console.log(data);
		   var user=JSON.parse(data.response);
		   var links = (user.userType === "CUSOMTER" || user.userTypeId == 3) ? ['dashboard'] :['dashboard','quotes','contracts','locations','apsqt','orders','opportunity'];
		   //var links=['dashboard','quotes','contracts','locations'];
		   var ebAdmin=false;
		   var csqtAdmin=false;
		   var smtAdmin = false;
		   var ipossAdmin = false;
		   //PO Chase
		   var poChaseAdmin = false;
		   //SFDC
		   var sfdcAdmin = false;
//Opportunity Status 
		   var opportunityStatusAdmin = false;

		   var dataAdmin=false;

		   var requestFromSMTModule = false; // added to check request is comming from SMT module or not to give absolute or relative path

		   //console.log('context '+ _context);
		   if(_context.indexOf("smt") > -1){
			   requestFromSMTModule = true;
		   }
			//console.log("requestFromSMTModule "+ requestFromSMTModule);
		   // console.log('context '+ _context);

		   if(user && user.authorizations){
			   for(var i=0; i<user.authorizations.length; i++){
				   //added SMT authorization code here ...
				   if(user.authorizations[i].roleId==3 || user.authorizations[i].roleId==4 || user.authorizations[i].roleId==20
						   ||user.authorizations[i].roleId == 21 || user.authorizations[i].roleId == 22 ||

						   user.authorizations[i].roleId == 23 || user.authorizations[i].roleId == 25 || user.authorizations[i].roleId ==9 || user.authorizations[i].roleId ==15 || user.authorizations[i].roleId == 16){

					   if(user.authorizations[i].roleId==3){
						   ebAdmin=true;
					   }
					   if(user.authorizations[i].roleId==4){
						   csqtAdmin=true;
					   }
					   if(user.authorizations[i].roleId==9){
						   ipossAdmin=true;
						   poChaseAdmin=true;
					   }
					   if(user.authorizations[i].roleId==15){
						   dataAdmin=true;
					   }
					if(user.authorizations[i].roleId==20){
						   opportunityStatusAdmin=true;
					   }

					   if(user.authorizations[i].roleId==16){
						   sfdcAdmin=true;
					   }

					   // SMT authorizations ..
					   if(user.authorizations[i].roleId == 20 || user.authorizations[i].roleId == 21 || user.authorizations[i].roleId == 22 ||
							   user.authorizations[i].roleId == 23 || user.authorizations[i].roleId == 25 ){
						   //if( user.canAccessLMW != 0){
							   if(user.lmwStatus != 0){
								   smtAdmin = true;
							   }
						   //}
					   }

				   }
			   }
		   }

		   load('/csqt/secured/main/settings', true, function(data){
			   var showEBAdminLinks = false;
			   var showCSQTAdminLinks = false;
			   var enableSMTModule = false; // to populate SMT icons in leftNav ..
			   var enableIPOSSModule = false;

			   //SFDC
			   var enableSFDCModule = false;
			   //PO CHASE
			   var enablePOChaseModule = false;
			   var showDATAAdminLinks = true;
			   var showAPSConfigLinks = true;
			   var settings=JSON.parse(data.response);
			   if(settings){
				   for(var i=0; i<settings.length; i++){
					   if(settings[i].setting=='ENABLE_MODULE_EARLYBIRD' && settings[i].value=='1') showEBAdminLinks=true;
					   if(settings[i].setting=='ENABLE_MODULE_DASHBOARD' && settings[i].value=='1') showCSQTAdminLinks=true;
					   if(settings[i].setting=='ENABLE_MODULE_IPOSS' && settings[i].value=='1') enableIPOSSModule=true;
					   //SFDC
					   if(settings[i].setting=='ENABLE_MODULE_SFDC' && settings[i].value=='1') enableSFDCModule=true;
					   //POCHASE
					   if(settings[i].setting=='ENABLE_MODULE_POCHASE' && settings[i].value=='1') enablePOChaseModule=true;
					   
					   if(settings[i].setting=='ENABLE_MODULE_OPPORTUNITYSTATUS' && settings[i].value=='1') enableOpportunityStatusModule=true;
					   if(settings[i].setting=='ENABLE_MODULE_LMW' && settings[i].value=='1') {
					   //if(settings[i].setting=='ENABLE_MODULE_LMW' && settings[i].value=='1' && user.canAccessLMW != 0) {
						   enableSMTModule=true;
						   links.push('network'); links.push('license');
					   }
					   if(settings[i].setting=='PERFORMANCE_MEASUREMENT' && settings[i].label=='Performance Measurement' && settings[i].value=='1') {
						   user.isPref = true;
					   }else if(settings[i].setting=='PERFORMANCE_MEASUREMENT' && settings[i].label=='Performance Measurement' && settings[i].value=='0') {
						   user.isPref = false;
					   }
					   if(settings[i].label=='Performance Type' && settings[i].value=='1') {
						   user.isBefore = true;
					   }else if(settings[i].label=='Performance Type' && settings[i].value=='0'){
						   user.isAfter = true;
					   }
				   }
			   }
			   //console.log(showEBAdminLinks);
			   //console.log(ebAdmin);
			   //console.log(showCSQTAdminLinks);
			   //console.log(dataAdmin);
			   //console.log(smtAdmin);
			   //console.log(showDATAAdminLinks);
			   //added SMT left nav icons logic

			   if ((showEBAdminLinks && ebAdmin)
					   || (showCSQTAdminLinks && csqtAdmin)
					   || (enableSMTModule && smtAdmin)
					   || (enableIPOSSModule && ipossAdmin)
					   || (enableSFDCModule && sfdcAdmin)
					   || (enablePOChaseModule && poChaseAdmin)
					   || (enableOpportunityStatusModule && opportunityStatusAdmin))
				   links.push('admin');
			   
			   links.push('help');
			   leftlinks=links;
			   // added SMT left nav icons logic
			   document.getElementById(_leftDiv).innerHTML = getLeftNav(
					   links,
					   showAPSConfigLinks,
					   (showEBAdminLinks && ebAdmin),
					   (showCSQTAdminLinks && csqtAdmin),
					   enableSMTModule,
					   smtAdmin,
					   user,
					   _context,
					   requestFromSMTModule,
					   (enableIPOSSModule && ipossAdmin),
					   (showDATAAdminLinks && dataAdmin),
					   (enableSFDCModule && sfdcAdmin),
					   (enablePOChaseModule && poChaseAdmin),
					   (enableOpportunityStatusModule && opportunityStatusAdmin));

			   /*if((showEBAdminLinks && ebAdmin) || (showCSQTAdminLinks && csqtAdmin) || (enableSMTModule && smtAdmin) || (enableIPOSSModule && ipossAdmin ) || (showDATAAdminLinks && dataAdmin)|| (enableSFDCModule && poChaseAdmin )) links.push('admin');
			   links.push('help');
			   leftlinks=links;
			   // added SMT left nav icons logic
			   document.getElementById(_leftDiv).innerHTML=getLeftNav(links, (showEBAdminLinks && ebAdmin), (showCSQTAdminLinks && csqtAdmin),enableSMTModule,smtAdmin, user, _context ,requestFromSMTModule,(enableIPOSSModule && ipossAdmin),(showDATAAdminLinks && dataAdmin),(enableSFDCModule && poChaseAdmin,(enableOpportunityStatusModule && opportunityStatusAdmin  ));
					*/
			   if(_headerDiv != "")
				   document.getElementById(_headerDiv).innerHTML= (user.userType === "CUSOMTER" || user.userTypeId == 3)? getEarlyBirdHeader(user) : getHeader(user);
			   if(_footerDiv != "")
				   document.getElementById(_footerDiv).innerHTML=getFooter(_build);
			   //added SMT left nav icons logic
			   //bindEvents(links, (showEBAdminLinks && ebAdmin), (showCSQTAdminLinks && csqtAdmin),(smtAdmin && user.canAccessLMW != 0), _context,user,requestFromSMTModule);



			   bindEvents(
					   links,
					   (showAPSConfigLinks),
					   (showEBAdminLinks && ebAdmin),
					   (showCSQTAdminLinks && csqtAdmin),
					   smtAdmin,
					   (enableIPOSSModule && ipossAdmin),
					   _context,
					   user,
					   requestFromSMTModule,
					   (showDATAAdminLinks && dataAdmin),
					   (enableSFDCModule && sfdcAdmin),
					   (enablePOChaseModule && poChaseAdmin),
					   (enableOpportunityStatusModule && opportunityStatusAdmin));

			   fn(user);
		   });
	   });
   }
   _infrastructure.logout =function(){
	   load('/csqt/terminate', true, function(){
		   //console.log('session terminated');
	   });
   }

   //introducing leftNav for endCustomer as well.
   _infrastructure.renderEarlyrenewals =function(_headerDiv,_leftDiv, _footerDiv, _build, _context, fn){
		   load('/csqt/secured/user/me', true, function(data){

			   var user=JSON.parse(data.response);
			   var links=['dashboard'];
			   var ebAdmin=false;
			   var csqtAdmin=false;
			   var smtAdmin = false;
			   var dataAdmin = false;
			   if(user && user.authorizations){
				   for(var i=0; i<user.authorizations.length; i++){
					   if(user.authorizations[i].roleId==3 || user.authorizations[i].roleId==4){
						   if(user.authorizations[i].roleId==3){
							   ebAdmin=true;
						   }
						   if(user.authorizations[i].roleId==4){
							   csqtAdmin=true;
						   }
						   if(user.authorizations[i].roleId==15){
							   dataAdmin=true;
						   }
					   }

					   // SMT authorizations ..
					   if(user.authorizations[i].roleId == 20 || user.authorizations[i].roleId == 21 || user.authorizations[i].roleId == 22 ||
							   user.authorizations[i].roleId == 23 || user.authorizations[i].roleId == 25 ){
						   //console.log("LMW user Authorization found ");
						   //if( user.canAccessLMW != 0){
							   if(user.lmwStatus != 0){
								   smtAdmin = true;
							   }
						   //}
					   }
				   }
			   }

			   load('/csqt/secured/main/settings', true, function(data){

				   var settings=JSON.parse(data.response);
				   if(settings){
					   for(var i=0; i<settings.length; i++){
						   if(settings[i].setting=='ENABLE_MODULE_LMW' && settings[i].value=='1') {
							   enableSMTModule=true;
							   links.push('network'); links.push('license');
						   }
					   }
				   }
				   //console.log(smtAdmin);
				   if(smtAdmin)links.push('admin');
				   links.push('help');

				   document.getElementById(_leftDiv).innerHTML=getLeftNav(links, false, false, false,enableSMTModule,smtAdmin, user, _context ,false,false,false,false);
				   document.getElementById(_headerDiv).innerHTML=getEarlyBirdHeader(user);
				   document.getElementById(_footerDiv).innerHTML=getEarlyBirdFooter(_build);
				   bindEBEvents(_context);
				   bindEvents(links, false, false, false,smtAdmin, false ,_context,user,false,false,false,false);
				   fn(user);
			   });
		   });
   }
   _infrastructure.renderEnrollment =function(_headerDiv, _footerDiv, _build, _context){
		   document.getElementById(_headerDiv).innerHTML=getEnrollmentHeader();
		   document.getElementById(_footerDiv).innerHTML=getEnrollmentFooter(_build);
   }
   return {	
	JsonData: function() {
		 return {"xyz" : _infrastructure}
	//_infrastructure.
	}
}
}());