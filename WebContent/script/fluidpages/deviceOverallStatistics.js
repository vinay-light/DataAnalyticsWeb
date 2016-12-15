$(document).ready(function() {
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	$('div#actionNavbar').hide();
	loadNav();
});