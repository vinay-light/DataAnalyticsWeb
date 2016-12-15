/***
 * This file has functions associated with accordions and scroll assist 
 */

var arrNewAccordians;
var common_accordian_settings = {"pagination":false};

/**
 * Initiate variables required by accordion functions
 * */
/*global $:false, jQuery:false, objGrid:true, toggleRecord:true, searchRecords:true, filterPills:true
  scrollToAccordianPosition:true, document:true, getMoreData:true, filterRecords:true, getAvailableUsers:true
  updateIndex:true */
function activateAccordians() {
	$.each(arrNewAccordians, function (index, value) {
		objGrid["obj_" + value] = {};
		objGrid["arr_" + value] = [];		
		objGrid["arr_selected_" + value] = [];	
	});
    $(".recordAvailable, .recordSelected").on("click", '.anchorCls', toggleRecord); 
    $(".searchRecord").bind("keyup", searchRecords);
    $(".filterPills").bind("keyup", filterPills);
	$(document).on("click", '.navAccordianIndex', scrollToAccordianPosition);
	if(common_accordian_settings.pagination){
	    $.each(arrNewAccordians, function (index, val) {
			$("#id_" + val + "_available").scroll(getMoreData);
	    });
	}
}

function resetAccordian(type) {
	objGrid["obj_" + type] = {};
	objGrid["arr_" + type] = [];	
	objGrid["obj_index_" + type] = {};
	objGrid["obj_index_" + type + "_selected"] = {};
	$("#id_" + type + "_selected>ul>li").remove();
	$("#id_" + type + "_available>ul>li").remove();
}

/**
 * Filter locally available data 
 *(possible extension  - fetch more records )
 * */
function searchRecords(event) {
	var objT = $(event.target);
	var txtSearch = objT.val().toLowerCase();
//	if(objT.attr("data_type")=='user'){
	filterRecords(txtSearch, "id_" + objT.attr("data_type") + "_" + objT.attr("data_target"));
//		if(txtSearch.length){
//			getAvailableUsers(txtSearch,objT.attr("data_target"));	
//		}		
//	}
}

/**
 * Pagination
 * */
function getMoreData(event) {
	var obj = $(event.target);
	if (obj.scrollTop() + obj.innerHeight() + 10  >= obj[0].scrollHeight) {
		getAvailableUsers();
	}
}

/**
 * Filter the locally available records.
 * */
function filterRecords(txtSearch, divId) {
	var selector = '', direction = "available"; 
	if (divId.indexOf("available") > -1) {
		selector = "#" + divId + " >ul>li:not(.selected) >span>span";
	} else {
		direction = "selected";
		selector = "#" + divId + " >ul>li.selected >span>span";
	}
	var type = 0;
	$.each($(selector), function (ind, val) {
		var charFirst = $(val).html().trim()[0].toUpperCase();
		charFirstAlt = spCharMap[charFirst] ? spCharMap[charFirst] : charFirst;
		var pLi = $(val).closest("li");
		type = type ? type:pLi.attr("data_type");
		if ($(val).html().toLowerCase().indexOf(txtSearch) > -1) {
			if (pLi.hasClass("filtered")) {
				$(val).closest("li").removeClass("filtered");
				updateIndex(type, direction, charFirst, true);
			}
		} else {
			if (!pLi.hasClass("filtered")) {
				$(val).closest("li").addClass("filtered");
				updateIndex(type, direction, charFirst, false);
			}
		}
	});
	$("#" + divId + " >ul").show();
	$("#" + divId + " >div").hide();
}


function filterPills(event) {
	var objT = $(event.target);
	var txtSearch = objT.val().toLowerCase();
	var type = objT.attr("data_type");
	var target = objT.attr("data_target");
	
	var selector = '#id_' + type + '_' + target;

	$.each($(selector+">div button>span"),function(ind,val){
		var pDiv = $(val).closest("div");
		if($(val).html().toLowerCase().indexOf(txtSearch)>-1){
			if(pDiv.hasClass("filtered")){
				pDiv.removeClass("filtered");
			}
		}else{
			if(!pDiv.hasClass("filtered")){
				pDiv.addClass("filtered");
			}
		}
	});
	$("#id_setting_created").fadeOut(10);$("#id_setting_created").fadeIn(10);
}
/**
 * Update the character index - it's an object with character->recordCount data
 * */
function updateIndex(type, direction, txt, add){
	add = (typeof add =='undefined')?true:add;
	var divId = "id_"+type+"_"+direction;
	pUl = $("#"+divId+">ul");
	charFirst = txt.trim()[0].toUpperCase();
	charFirstAlt = spCharMap[charFirst] ? spCharMap[charFirst] : charFirst;
	direction = (direction=='selected')?'_selected':'';
	//id_user_available
	if(add){
		if(objGrid["obj_index_"+type+direction][charFirstAlt]){
			objGrid["obj_index_"+type+direction][charFirstAlt] += 1;
		}else{
			pUl.find("."+charFirstAlt).show();
			objGrid["obj_index_"+type+direction][charFirstAlt] = 1;
		}		
	}else{
		if(objGrid["obj_index_"+type+direction][charFirstAlt]){
			objGrid["obj_index_"+type+direction][charFirstAlt] -= 1;
		}else{
			objGrid["obj_index_"+type+direction][charFirstAlt] = 0;
		}
		if(!objGrid["obj_index_"+type+direction][charFirstAlt]){
			pUl.find("."+charFirstAlt).hide();
		}
		
	}
	updateAccordianIndexGrid(divId);
} 

/**
 * Update/redraw the visible index grids.
 * */
function updateAccordianIndexGrid(idDiv){
	if( $("#"+idDiv+">div").is(":visible")){
		showAccordianIndex($("#"+idDiv+">ul>li"));
	}
}

/**
 * Scroll to a charecter index.
 * */
function scrollToAccordianPosition(event){
	var obj = $(event.target);
	if(!obj.is('div')){
		obj = obj.closest("div");
	}
	var id = obj.attr("data_id");
	var targetDiv = obj.parent().parent();
	obj.parent().hide();
	targetDiv.find("ul").show();
	var targetLi = targetDiv.find("ul>li[data_id='"+id+"']");
	targetDiv.scrollTop($(targetLi).offset().top-targetDiv.offset().top);
//	$(targetLi).scrollTo();
	
}

/**
 * Switch a record from selected to available or vice-versa and update the scroll indices accordingly.
 * */
function toggleRecord(event){
	var objLi = $(event.target).closest("li");
	var type = objLi.attr("data_type");
	var txt = $("#id_"+objLi.attr("data_type")+"_available >ul>li[data_id='"+objLi.attr("data_id")+"']>span>span").html().trim();

	var objLi_av = $("#id_"+objLi.attr("data_type")+"_available >ul>li[data_id='"+objLi.attr("data_id")+"']:not(.cursorCls)");
	var objLi_sel = $("#id_"+objLi.attr("data_type")+"_selected >ul>li[data_id='"+objLi.attr("data_id")+"']:not(.cursorCls)");
	if(objLi_av.hasClass("selected")){
		objLi_av.removeClass("selected");
		objLi_sel.removeClass("selected");
		updateIndex(type,'available',txt,true);
		updateIndex(type,'selected',txt,false);
		objGrid["arr_selected_"+type].remove(objLi.attr("data_id"));
	}else{
		objLi_av.addClass("selected");
		objLi_sel.addClass("selected");
		updateIndex(type,'available',txt,false);
		updateIndex(type,'selected',txt,true);
		objGrid["arr_selected_"+type].push(objLi.attr("data_id"));
	}	
	if(objMode.nav.selected_tab == 'configrationSettings'){
		addEventToDropdownList(objLi, txt);
	}
}

/**
 * Add new records to accordian
 * */
function addRecords(type,arrObject,index,id, redirect,fnAppend, fnContent){
	if(typeof redirect == 'undefined'){
		redirect = true;
	}
	objGrid["arr_"+type] = (typeof objGrid["arr_"+type] !='object')?[]:objGrid["arr_"+type];	
	objGrid["obj_"+type] = (typeof objGrid["obj_"+type] !='object')?{}:objGrid["obj_"+type];	
	objGrid["obj_index_"+type] = (typeof objGrid["obj_index_"+type] !='object')?{}:objGrid["obj_index_"+type];
	objGrid["obj_index_"+type+"_selected"] = (typeof objGrid["obj_index_"+type+"_selected"] !='object')?{}:objGrid["obj_index_"+type+"_selected"];
	if(objGrid["arr_"+type].length <= 0){
		objSorter.index = index;
		objGrid["arr_"+type] = arrObject.sort(customObjectSorter);
		$.each(arrObject,function(ind,val){
			objGrid["obj_"+type][val[id]] = val;
			//If val's string is not indexed create index and increase count
			var charFirst = val[index].trim()[0].toUpperCase();
			charFirstAlt = spCharMap[charFirst] ? spCharMap[charFirst] : charFirst;
			if(objGrid["obj_index_"+type][charFirstAlt]){
				objGrid["obj_index_"+type][charFirstAlt] += 1;
			}else{
				objGrid["obj_index_"+type][charFirstAlt] = 1;
				$("#id_"+type+"_available ul").append(getDynamicDiv(charFirst, type, 'available', id, index, "index"));
				$("#id_"+type+"_selected ul").append(getDynamicDiv(charFirst, type, 'selected', id, index, "index"));
			}
			//Create pills for each
			$("#id_"+type+"_available ul").append(getDynamicDiv(val, type, 'available', id, index, redirect,fnAppend, fnContent));
			$("#id_"+type+"_selected ul").append(getDynamicDiv(val, type, 'selected', id, index, redirect,fnAppend, fnContent));			
		});
	}else{
		$.each(arrObject,function(ind,val){
			if(typeof objGrid["obj_"+type][val[id]] != 'object'){ //If object is not already part of array
				objGrid["obj_"+type][val[id]] = val;
				insertIndex = getBinaryInsertIndex(objGrid["arr_"+type],val,index);
				objGrid["arr_"+type].splice(insertIndex, 0, val); // Insert the object at sorted place
				
//				//If val's string is not indexed create index and increase count
//				var charFirst = val[index].trim()[0].toUpperCase();
//				if(objGrid["obj_index_"+type][charFirst]){
//					objGrid["obj_index_"+type][charFirst] += 1;
//				}else{
//					objGrid["obj_index_"+type][charFirst] = 1;
//					if(insertIndex != 0)
//						insertIndex = (insertIndex >= $("#id_"+type+"_available >ul>li").length)?insertIndex:insertIndex+1;
//					
//					$("#id_"+type+"_available ul>li:nth-child("+(insertIndex)+")").after(getDynamicDiv(charFirst, type, 'available', id, index, "index"));
//					$("#id_"+type+"_selected ul>li:nth-child("+(insertIndex)+")").after(getDynamicDiv(charFirst, type, 'selected', id, index, "index"));
//					insertIndex++;
//					
//				}
//				
//				if(insertIndex != 0){
//					insertIndex = (insertIndex >= $("#id_"+type+"_available >ul>li").length)?insertIndex:insertIndex+1;
//					$("#id_"+type+"_available >ul>li:nth-child("+(insertIndex+1)+")").after(getDynamicDiv(val, type, 'available', id, index, redirect,fnAppend, fnContent));
//					$("#id_"+type+"_selected >ul>li:nth-child("+(insertIndex+1)+")").after(getDynamicDiv(val, type, 'selected', id, index, redirect,fnAppend, fnContent));					
//				}else{
//					$("#id_"+type+"_available").prepend(getDynamicDiv(val, type, 'available', id, index, redirect, fnAppend, fnContent));
//					$("#id_"+type+"_selected").prepend(getDynamicDiv(val, type, 'selected', id, index, redirect, fnAppend, fnContent));						
//				}
			}			
		});
		//Empty the array and restock it.
		var tmp = objGrid["arr_"+type];
		objGrid["arr_"+type] = [];
		objGrid["obj_index_"+type] = {};
		objGrid["obj_index_"+type+"_selected"] = {};
		objGrid["obj_"+type] = {};
		var arrSelected = [];
		$("#id_"+type+"_selected >ul>li.selected").each(function(i,v){
			arrSelected.push($(v).attr("data_id"));
			});
		$("#id_"+type+"_available >ul>li").remove();
		$("#id_"+type+"_selected >ul>li").remove();
		addRecords(type,tmp,index,id, redirect,fnAppend, fnContent);
		$.each(arrSelected,function(i,v){
			selectRecords(type,v);
		});
	}
	
}

/**
 * Select records. Mark records as selected if they are already in accordian. If an object array is provided and 
 * the records are not there in the accordian add the record and mark them as selected.
 * */
function selectRecords(type,arrObject,index,id, redirect,fnAppend, fnContent){
	var txt;
	objGrid["obj_index_"+type] = (typeof objGrid["obj_index_"+type] !='object')?{}:objGrid["obj_index_"+type];	
	objGrid["obj_index_"+type+"_selected"] = (typeof objGrid["obj_index_"+type+"_selected"] !='object')?{}:objGrid["obj_index_"+type+"_selected"];
	if(typeof arrObject =='string' ||typeof arrObject =='number' ){ // i.e. id
		//add the selected class to the html object
		var strId = arrObject;
		txt = $("#id_"+type+"_selected span[data_id='"+strId+"']>span").html();
		if(!$("#id_"+type+"_selected > ul>li[data_id='"+strId+"']").hasClass("selected")){
			$("#id_"+type+"_selected > ul>li[data_id='"+strId+"']").addClass("selected");	
			$("#id_"+type+"_available > ul>li[data_id='"+strId+"']").addClass("selected");	
			updateIndex(type,'selected',txt,true);
			updateIndex(type,'available',txt,false);
		}
		
	}else if(arrObject.length){ //i.e. it's an array of objects
		var arrTobeAdded = [];
		$.each(arrObject,function(ind,val){
			txt = val[index];
			
			if(typeof objGrid["obj_"+type][val[id]] != 'object'){ 
				arrTobeAdded.push(val);
			}
		});	
		if(arrTobeAdded.length){
			addRecords(type, arrTobeAdded, index, id, redirect,fnAppend, fnContent);
		}
		
		$.each(arrObject,function(ind,val){
			txt = val[index];			
			//add the selected class to the html object
			if(!$("#id_"+type+"_selected > ul>li[data_id='"+val[id]+"']").hasClass("selected")){
				$("#id_"+type+"_selected > ul>li[data_id='"+val[id]+"']").addClass("selected");	
				$("#id_"+type+"_available > ul>li[data_id='"+val[id]+"']").addClass("selected");	
				updateIndex(type,'selected',txt,true);
				updateIndex(type,'available',txt,false);
			}
		});	
		
	}
}


/**
 * Get the html for one record
 * */
function getDynamicDiv(objVal,type,direction,indId,indName,redirect,fnAppend, fnContent) {
	var divClassName, labelColorClass, iconCls,clsRedirect;
	if(typeof redirect == 'undefined'){
		redirect = true;
	}else if(redirect =='index'){
		charFirstAlt = spCharMap[objVal] ? spCharMap[objVal] : objVal;
		var strDiv = '<li  data_type="'+type+'" data_id="'+objVal+'"  class = "' + charFirstAlt + ' cursorCls list-group-item col-xs-12" onclick="showAccordianIndex(this)" name = "' + objVal + '"> &nbsp;'
	    +objVal+ ' </li>';	
		return strDiv;
	}
	var strAppend = "";
	if(typeof fnAppend == 'string'){
		strAppend = window[fnAppend](objVal);
	}
	if(typeof fnContent == 'string'){
		strContent = window[fnContent](objVal);
	}else{
		strContent = objVal[indName];
	}

	if(direction == 'selected'){
		 divClassName= "";//removeCls
		 labelColorClass = 'label-success-custom';
		 iconCls = 'glyphicon-remove'; 
	}else{
		 divClassName= "";//plusCls
		 labelColorClass = 'label-danger-custom';
		 iconCls = 'glyphicon-plus'; 
	}
	if(redirect){
		clsRedirect = ' authRedirect';
	}else{
		clsRedirect = '';
	}
	
//    var tType = (contentName=='availBundle' ||contentName=='Bundles')?'bundle':'user';
    

	var strDiv = '<li  data_type="'+type+'" '+strAppend+' data_id="'+objVal[indId]+'"  class = "' + divClassName + ' list-group-item col-xs-12" name = "' + objVal[indName] + '" > &nbsp;'
    +'<span data_type="'+type+'" data_id="' + objVal[indId] + '" type="button" class="  '+clsRedirect+' ">'
    +'  <span class="' + labelColorClass + ' strTrim"> ' + strContent + ' </span></span> <a class = "anchorCls pull-right" ><span class="glyphicon ' + iconCls + '"> </span></a> &nbsp;</li>';
	return strDiv;


}

var arrAlphabet = ["A","B","C","D","E","F","G","H","I"
                   ,"J","K","L","M","N","O","P","Q","R"
                   ,"S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
var spCharMap = {"." : "dot", "_" : "underscore", "$" : "dollar", "%" : "perc", "&" : "and", "*" : "asteric"};

/**
 * Show index grid
 * */
function showAccordianIndex(obj){
	var objDiv = $(obj).closest("ul").parent().find(".divNavIndex");
	var type = $(obj).attr("data_type");
	var direction = ($(obj).closest("ul").parent().attr("id").indexOf("selected") > -1)?'_selected':'';
	$(objDiv).html("");
	$.each(arrAlphabet,function(ind,val){
		valAlt = spCharMap[val] ? spCharMap[val] : val;
		var cls = '',cnt='';
		if(objGrid["obj_index_"+type+direction][valAlt]){
			cls = 'navAccordianIndex';
			cnt = '<small>&nbsp;&nbsp;'+objGrid["obj_index_"+type+direction][valAlt]+'</small>';
		}else{
			cnt =''; 
			cls = 'navAccordianIndex disabled';
		}
		var strDiv = '<div data_id="'+val+'" class="col-sm-2 col-xs-3 '+cls+' "><span>'+val+cnt+'</span></div>';
		$(objDiv).append(strDiv);
	});
	$(obj).closest("ul").hide();
	$(objDiv).show();
}
