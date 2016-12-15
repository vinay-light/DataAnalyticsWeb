/*global $:false, jQuery:false */

/**
 * This file contains Table and grid related function including load grid, table, validateResponse etc.
 * */

//Begin: Grid / Table Functions
//Required target and table variables. Table data in objGrid.data and onpage formatter functions
// addRow(item) and formatGrid(item)
// If we have these requirements call the activateGrid() function on doc.ready

objGrid.selected = [];
objGrid.chkAllMirror = "grid_chk_all_trigger";
function activateGrid(){
	$(".listTable").click(function(){
		objUrlParam.clickMode = "table";
		if(!$(this).hasClass('active')){
			loadTableView();		
		}	
	});
	$(".listGrid").click(function(){
		objUrlParam.clickMode="grid";
		if(!$(this).hasClass('active')){
			loadGridView();		
		}
	});
}

function tblPostProcessing(){

}
function gridPostProcessing(){
    $(".box-quick-link").click(boxSelected);
}

function loadGridView(){
	objGrid.mode = "grid";
	$("#grid_chk_all").remove();
	$("#grid_chk_all_trigger").parent().remove();
	$('#'+objGrid.grid).empty();
	noneChecked(objGrid.grid);
	var iCnt = 1;
	if(objGrid.data != null) {
		$('#'+objGrid.grid).append("<div class='container'>");
		var objContainer = $('#'+objGrid.grid+" .container");
		var objRow;
		//Iterate through the grid data and create rows with 4 items each.
		$.each(objGrid.data, function(i,item){
			if((iCnt%4) == 1 ){
				objContainer.append("<div class='row'></row>");
				objRow = $('#'+objGrid.grid+" .container .row:last");
			}			
			objRow.append(formatGrid(item));
			if(item.readOnly){
				objRow.find(">div:last").addClass("gridReadOnly");	
				objRow.find(">div:last").attr("title","Readonly");
				objRow.find(">div:last :checkbox").addClass("readOnly");
			}
			
			if(typeof objLoader !='undefined'){
				objLoader.update("process");
			}
			if(typeof item[objGrid.pKey] !='undefined'){
				if($.inArray(item[objGrid.pKey].toString(),objGrid.selected) > -1){
					objRow.find(":checkbox.pull-right:last").prop("checked",true);					
				}					
			}
			iCnt++;
		});	
		$('#'+objGrid.grid).append("</div>");
	}
	$('#'+objGrid.table).addClass("hidden");
	$('#'+objGrid.grid).removeClass("hidden");
	$('#'+objGrid.grid).show();
	objUrlParam.clickMode = "grid";
	objGrid.mode = "grid";
	$(".listTable").removeClass("active");	
	$(".listGrid").addClass("active");
	//Begin: Adding trigger to grid
	if(objAuth.Edit){
		$("#paginatorTop").prepend('<div class="col-xs-3" ><input type="checkbox" id="grid_chk_all_trigger" >'+translate("common.checkAll")+'</div>');
		$("#"+objGrid.grid).prepend('<input type="checkbox" id="grid_chk_all" class="checkAll hidden" onclick="activateCheckAll(\''+objGrid.grid+'\');">');
		$("#grid_chk_all_trigger").unbind("click");
		$("#grid_chk_all_trigger").click(function(){
			$("#grid_chk_all").trigger("click");
		});
		
	}
	activateCheckAll(objGrid.grid);
	updateCheckAll(objGrid.grid);
	//End: Adding trigger to grid
	gridPostProcessing();
	setPageStatusData();
	$(".box-quick-link").unbind("click",boxSelected);
	$(".box-quick-link").click(boxSelected);
}

function mirrorCheckAll(objChkAll){
	if(typeof $("#"+objGrid.chkAllMirror) == 'object'){
		$("#"+objGrid.chkAllMirror).prop("checked",objChkAll.prop('checked'));
	}
}

function loadTableView(){
	if(!objGrid.data){
		objGrid.data = [];
	}
	$("#grid_chk_all").remove();
	$("#grid_chk_all_trigger").parent().remove();
	objGrid.mode = "table";
	$('#'+objGrid.table+" table tbody tr:not(.trSearchable)").remove();
	noneChecked(objGrid.table);
		if(objGrid.data != undefined){
			if(objGrid.data.length == 0){
				$('#'+objGrid.table+" table tbody").append("<tr><td colspan="+$('#'+objGrid.table+" table thead tr:first th").length+">"+translate('common.notification.error.no_records')+"</td></tr>");
			}else{
				$.each(objGrid.data, function(i,item){
					addRow(item);
					if(item.readOnly){
						$('#'+objGrid.table+" table tbody tr:last td:first :checkbox").addClass("readOnly");
						$('#'+objGrid.table+" table tbody tr:last td:nth-child(2)").addClass("gridReadonly");
						$('#'+objGrid.table+" table tbody tr:last td:nth-child(2)").attr("title","Readonly");
					}
					
					if(typeof objLoader !='undefined'){
						objLoader.update("process");
					}
					if(typeof item[objGrid.pKey] !='undefined'){
						if($.inArray(item[objGrid.pKey].toString(),objGrid.selected) > -1){
							$('#'+objGrid.table+" table tbody tr:last td:first :checkbox").prop("checked",true);					
						}					
					}
				});	
				activateFloatingScrollBar();
			}
		}
	//}
	
	$('#'+objGrid.grid).addClass("hidden");
	$('#'+objGrid.table).removeClass("hidden");
	$('#'+objGrid.table).show();
	$(".listGrid").removeClass("active");		
	$(".listTable").addClass("active");	
	objUrlParam.clickMode = "table";
	activateCheckAll(objGrid.table);
	updateCheckAll(objGrid.table);
	objGrid.mode = "table";
	updateChkActionMode();
	tblPostProcessing();
	if(!(!objGrid.data) && objGrid.data.length < 2)
	{
		if(objGrid.data.length < 2 && objGrid.page == 1){
		   $('.glyphicon-chevron-down, .glyphicon-chevron-up').hide();
		}
		$('tr.trSearchable .input-group span.glyphicon-chevron-down').show();
	}
	else if(objGrid.data.length >= 2 || objGrid.page > 1){
		   $('.glyphicon-chevron-down, .glyphicon-chevron-up').show();
		}
	setPageStatusData();
	updateCheckAll(getChkAllContainerId());
	//singleChkboxChecked(getChkAllContainerId(), checkBoxStatus);
}

function getSelectedRowIds() {
	 var idList = [];
	 jQuery(".clsGrid:visible" + " :checkbox:checked:visible").each(function() {
		 if(arguments[1].attributes.id && arguments[1].attributes.id.value.indexOf('All') < 0) {
			var varId = arguments[1].attributes.id.value;
			idList.push(varId.split('checkbox')[1]);
		 }
		});
	return idList;
}

function getSelectedIds(status) {
	if(typeof status =="undefined" ){
		status = "ACTIVE";		
	}
	if(status == "ACTIVE"){
		filter = "[status='ACTIVE']";
	}else{
		filter = "[status!='ACTIVE']";
	}
	var idList = [];
	jQuery(".clsGrid:visible" + " :checkbox:checked").filter(filter).each(function() {
		varObj = $(this);
		if(typeof varObj.attr("data_id") !='undefined'){
			idList.push(varObj.attr("data_id"));
		}
	});
	return idList;
}

function boxSelected(event){
	if(!$(event.target).is(":checkbox") ){
		var	$this = $(this),
			url = $this.attr("data_link");
		
		if(url && url.length && objAuth.Edit && !$this.hasClass("boxDisabled")){
			if(!$this.find("input:checkbox[stat_readonly='true']").length || true ){//|| true
				window.location = url.trim();				
			}else{
				objNotification.warning = translate("common.msgError.modify_readonly");
				showNotification();
			}
		}
	}
}
 

//End: Grid / Table Functions

function updateStatus(url, entity, requestData) {
	$.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(requestData),
        dataType: 'json'
    }).complete(function(data) {
    	if(validateResponse(data)) {
    		var statusCode = data.responseJSON.httpStatusCode;
    		if(requestData.isActivate == 'false') {
	 	       if (statusCode == 200) {
					objNotification.success = entity + " " + translate("common.notification.deactivate.success");
					window[objActionMapper.loadPage](pageNumber);
	 	       } else {
					objNotification.error = entity + " " + translate("common.notification.deactivate.fail");
	 	       }
			} else {
				if (statusCode == 200) {
			       	objNotification.success = entity + " "+translate("common.notification.activate.success");
			       	window[objActionMapper.loadPage](pageNumber);
			    } else {
			       	objNotification.error = list.length + " " + entity + " "+translate("common.notification.activate.fail");
			    }
			}
			showNotification();
    	}
   });
}
