<script type="text/javascript">
	var objLocale = {};
	$.ajax({
		url: "<c:url value="./locale"/>"
		,async: false
	}).complete(function(data) {
		objLocale = data.responseJSON;
		if(typeof objLocale != 'object'){
			objLocale = {};
		}
	});

	function translate(tag){
		if(typeof objLocale[tag]=='undefined'){
			return "Undefined";		
		}	
		return objLocale[tag];
	}
</script>
