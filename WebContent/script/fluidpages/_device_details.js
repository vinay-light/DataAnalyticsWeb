var tmplDeviceDetails = {
		"registerTime":{"label":"Register Time","defVal":"--"},
		"lastSyncTime":{"label":"Last Sync Time","defVal":"--"},
		"batteryLevel":{"label":"Battery Level","defVal":"--"},
		"batteryStatus":{"label":"Battery Status","defVal":"--"},
		"bluetoothAddress":{"label":"Bluetooth Address","defVal":"--"},
		"buildVersion":{"label":"Build Version","defVal":"--"},
		"configuredAccounts":{"label":"Configured Accounts","defVal":"--"},
		"container":{"label":"Container","defVal":"--"},
		"deviceModel":{"label":"Device Model","defVal":"--"},
		"deviceOemType":{"label":"Device Oem Type","defVal":"--"},
		"deviceSerialNo":{"label":"Device Serial No","defVal":"--"},
		"deviceType":{"label":"Device Type","defVal":"--"},
		"encryptionStatus":{"label":"Encryption Status", "defVal":"--"},
		"externalStorage":{"label":"External Storage","defVal":"--"},
		"externalStorageFree":{"label":"External Storage Free","defVal":"--"},
		"internalStorage":{"label":"Internal Storage","defVal":"--"},
		"internalStorageFree":{"label":"Internal Storage Free","defVal":"--"},
		"ipAddress":{"label":"Ip Address","defVal":"--"},
		"isGeofenceViolated":{"label":"Is Geofence Violated","defVal":"--"},
		"isRoaming":{"label":"Is Roaming","defVal":"--"},
		"isRooted":{"label":"Is Rooted","defVal":"--"},
		"kernelVersion":{"label":"Kernel Version","defVal":"--"},
		"kiosk":{"label":"Kiosk","defVal":"--"},
		"language":{"label":"Language","defVal":"--"},
		"lockStatus":{"label":"Lock Status","defVal":"--"},
		"manufacturer":{"label":"Manufacturer","defVal":"--"},
		"msaPreloaded":{"label":"Msa Preloaded","defVal":"--"},
		"msaSideloaded":{"label":"Msa Sideloaded","defVal":"--"},
		"msaVersionCode":{"label":"Msa Version Code","defVal":"--"},
		"osVersion":{"label":"Os Version","defVal":"--"},
		"registrationID":{"label":"Registration I D","defVal":"--"},
		"upTime":{"label":"Up Time","defVal":"--"},
		"userName":{"label":"User Name","defVal":"--"},
		"wifiMacAddress":{"label":"Wifi Mac Address","defVal":"--"}
};
var textMapper = {"true":"Yes","false":"No"};
function drawDeviceInfo(responseData, callback, callParam){
	deviceInfo  = responseData.deviceInfo;
	deviceInfo.registerTime = new Date(responseData.createdTs);
	deviceInfo.lastSyncTime = new Date(responseData.updateTs);
	var objParent = $("#div_moreInfo>.div-spaced");
	$.each(tmplDeviceDetails,function(index,value) {
		if(typeof deviceInfo[index] != 'undefined'){
			strDiv = '';
			strDiv += '<div class="col-sm-6">';
			strDiv += '	<div class="col-sm-5">';
			strDiv += '		<b>'+value.label+'</b>';
			strDiv += '	</div>';
			strDiv += '	<div class="col-sm-7">';
			var val = deviceInfo[index];//?deviceInfo[index]:value.defVal;
			val = (textMapper[val])?textMapper[val]:val;
			strDiv += '		<span >'+val+'</span>';
			strDiv += '	</div>';
			strDiv += '</div>';
			objParent.append(strDiv);	
		}	
	});
}

var open_page_time = "";
var deviceId = "";
var locate_map = "";
var retry_count = 0;
var retry_interval = 5000;// 1000 == one sec.
var no_of_times = 6;
//var location_obj={
//		latitude : latitude_longitude[0],
//		longitude : latitude_longitude[1],
//		title : locate_details.currentLocation,
//		description : 'Latitude:'+latitude_longitude[0]+'<br>'+'Longitude:'+latitude_longitude[1]+'<br>'+'Time:'+($.customFormatedDate(locate_details.lastUpdatedOn))
//	};
var objPosDef={
		latitude: "18.5554244", 
		longitude: "73.797521", 
//		title: "265, Baner Rd, Varsha Park Society, Baner, Pune, Maharashtra 411045", 
		description: "Latitude:18.5554244<br>Longitude:73.797521<br>Time:Tue, 22 Jul 2014 15:35"
	};

function getLocatingMap(deviceInfo,callback, callParam)
{
	var locate = false;
	try{
		objPos={
				latitude: deviceInfo.latitude, 
				longitude:  deviceInfo.longitude, 
//				title:  deviceInfo.locationTitle, 
				description: "Latitude:"+ deviceInfo.latitude+"<br>Longitude:"+ deviceInfo.longitude+"<br>Time:"+ deviceInfo.locationTime
			};
		locate = true;
		
	}catch (e) {
		objPos = {};
		locate = false;
	}
//	objPos = objPosDef;
	if(locate_map=="" || true){
		Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme',{ 
			callback: function() { 
				locate_map = new Microsoft.Maps.Map(document.getElementById('detailMapContainer'), {
					credentials : "Ag-saxAGBY76bJdX8o5-TyxNtVjhV0hwsWMwIDUKIdniIWch78ce7hVRr3l3Xeg2",
					customizeOverlays: true,
					mapTypeId : Microsoft.Maps.MapTypeId.road,
					
					enableSearchLogo: false,
					showMapTypeSelector:false,
					theme: new Microsoft.Maps.Themes.BingTheme() 
				}); 
		    	
		    	locate_map.setView({ zoom: 0});
				locate_map.entities.clear();
				//Check if we have the position data and if so add the location pointer
				$.each(objPos,function(ind,val){
					if(typeof val ==='undefined'){
						locate_map = false;
					}
				});
				if(locate && !$.isEmptyObject(objPos))
					add_plot_point(objPos);
			} 
		});
	} 
	window[callback](callParam);
	return locate_map;
}

function add_plot_point(location_obj)
{
	var pin1 = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(location_obj.latitude, location_obj.longitude), null); 
	locate_map.entities.push(pin1); 
	locate_map.entities.push(new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(location_obj.latitude, location_obj.longitude), {title: location_obj.title, description: location_obj.description, pushpin: pin1}));
	locate_map.setView({ zoom: 0, center: new Microsoft.Maps.Location(location_obj.latitude, location_obj.longitude) });
	var i = 0;
	if(typeof routepoints != 'undefined'){
		for(i = 0; i < routepoints.length; i++) {
			if(routepoints[i].id == location_obj.id){	
				break;
			}
		}
		if(i >= routepoints.length || routepoints.length == 0) {
			routepoints.push(location_obj);
		}
	}
}