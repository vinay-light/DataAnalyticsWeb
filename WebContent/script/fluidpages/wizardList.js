$(document).ready(function() {
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	$('div#actionNavbar').hide();
	loadNav();
	managedivHeight();
});
function managedivHeight(){
	$("a.thumbImg").each(function(){
		$(this).height($(this).width()*.803);
	});
	var maxHeight = 0; 
	$('.box-quick-link').each(function(){
		maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
	});
	$('.box-quick-link').height(maxHeight);
}