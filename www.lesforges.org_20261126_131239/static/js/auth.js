//Refresh display
function refresh (animate) {
	var effectDuration = animate ? 200 : 0;
	//Near comments
	$('#you').slideUp(
		effectDuration
	,	function (data) {							
			$('#you').load(you_url, function () {
				fillYou();
				$('#you').slideDown(effectDuration);
			});
	});
	//In banner
	$('#profile').fadeOut(
		effectDuration
	,	function (data) {				
			$('#profile').load(profile_url, function () {
				fillProfile();
				$('#profile').fadeIn(effectDuration);
				authenticated = true;
			});
	});
}

//Open profile popup
function openProfileForm () {
	popup = $('<div id="profile_popup"></div>');
	popup.dialog({
		autoOpen: false	
	,	closeOnEscape: false
	,	dialogClass: 'popup'
	,	draggable: false
	,	modal: true
	,	open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	,	resizable: false
	,	title: 'Modifier votre profil'
	,	width: 600
	,	buttons: {
			Annuler : function() { popup.remove(); }
		,	Ok : function() { $('#profile_form').submit(); }
		}
	});		
	$('#profile_popup').load(edit_profile_url, fillProfilePopup);
	popup.dialog('open');
}

function fillProfilePopup () {
	//Submit
	$('#profile_form').submit( function () {
		$.post(
			edit_profile_url
		,	$('#profile_form').serialize()
		,	function (data, textStatus, jqXHR) {
				$('#profile_popup').html(data);
				fillProfilePopup();
				if (jqXHR.getResponseHeader("did_edit") == "true") {
					popup.remove();
					window.localStorage.clear(); //Because you may have changed your skin color and need to re compute css from LESS
					window.location.reload();
				}
			}
		);
		return false;
	});	
}

//Open password popup
function openPasswordForm () {
	popup = $('<div id="password_popup"></div>');
	popup.dialog({
		autoOpen: false	
	,	closeOnEscape: false
	,	dialogClass: 'popup'
	,	draggable: false
	,	modal: true
	,	open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	,	resizable: false
	,	title: 'Modifier votre mot de passe'
	,	width: 600
	,	buttons: {
			Annuler : function() { popup.remove(); }
		,	Ok : function() { $('#password_form').submit(); }
		}
	});		
	$('#password_popup').load(edit_password_url, fillPasswordPopup);
	popup.dialog('open');
}

function fillPasswordPopup () {
	//Submit
	$('#password_form').submit( function () {
		$.post(
			edit_password_url
		,	$('#password_form').serialize()
		,	function (data, textStatus, jqXHR) {
				$('#password_popup').html(data);
				fillPasswordPopup();
				if (jqXHR.getResponseHeader("did_change") == "true") {
					popup.remove();
				}
			}
		);
		return false;
	});	
}

//Sign out
function logoff (e) {	
	if (!e.isDefaultPrevented()) e.preventDefault();
	$.get(
		logoff_url	
	,	function () {
			authenticated = false;
			refresh(true);
	});
}

//Open signup popup
function openSignupForm (e) {
	if (!e.isDefaultPrevented()) e.preventDefault();
	if (!e.isPropagationStopped()) e.stopPropagation();
	popup = $('<div id="signup_popup"></div>');
	popup.dialog({
		autoOpen: false	
	,	closeOnEscape: false
	,	dialogClass: 'popup'
	,	draggable: false
	,	modal: true
	,	open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	,	resizable: false
	,	title: 'Inscription'
	,	width: 600
	,	buttons: {
			Annuler : function() { popup.remove(); }
		,	Ok : function() { $('#signup_form').submit(); }
		}
	});		
	$('#signup_popup').load(signup_url, fillSignupPopup);
	popup.dialog('open');
}

function fillSignupPopup() {		
	//Submit
	$('#signup_form').submit( function () {
		$.post(
			signup_url
		,	$('#signup_form').serialize()
		,	function (data, textStatus, jqXHR) {
				$('#signup_popup').html(data);
				fillSignupPopup();
				if (jqXHR.getResponseHeader("did_signup") == "true") {
					popup.remove();
					refresh(true);
				}
			}
		);
		return false;
	});	
}

//Open login popup
function openLoginForm (e) {
	if (!e.isDefaultPrevented()) e.preventDefault();
	if (!e.isPropagationStopped()) e.stopPropagation();
	popup = $('<div id="login_popup"></div>');
	popup.dialog({
		autoOpen: false	
	,	closeOnEscape: false
	,	dialogClass: 'popup'
	,	draggable: false
	,	modal: true
	,	open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	,	resizable: false
	,	title: 'Connexion'
	,	width: 600
	,	buttons: {
			Annuler : function() { popup.remove(); }
		,	Ok : function() { $('#login_form').submit(); }
		}
	});		
	$('#login_popup').load(login_url, fillLoginPopup);
	popup.dialog('open');
}

function fillLoginPopup() {	
	//Pre-fill
	if ($('#login_form input[type="text"]')[0].value == "" && $('#login_form input[type="password"]')[0].value == "") {
		$('#login_form input[type="text"]')[0].value = $('#dummy_username').val();
		$('#login_form input[type="password"]')[0].value = $('#dummy_password').val();
	}
	//Submit
	$('#login_form').submit( function () {
		$.post(
			login_url
		,	$('#login_form').serialize()
		,	function (data, textStatus, jqXHR) {
				$('#login_popup').html(data);
				fillLoginPopup();
				if (jqXHR.getResponseHeader("did_login") == "true") {
					popup.remove();
					refresh(true);
				}
			}
		);
		return false;
	});	
}

//In banner
function fillProfile() {

	var effectDuration = 100;
	
	//Menu drop down/up
	if (authenticated) {
		$('#profile .dropdown').click(function (e) {
			e.preventDefault();
			$('#profile #menu').slideDown(effectDuration, function () {
				$('html').click (function (e) {
					$('#profile #menu').slideUp(effectDuration);
					$('html').unbind('click');
				});
			});
		});
	//Login
	} else {
		$('#profile .dropdown').click(openLoginForm);
		$('#profile .login').click(openLoginForm);
		$('#profile .signup').click(openSignupForm);
	}
	
	//Edit profile
	$('#profile .edit').click(function (e) {
		e.preventDefault();		
		$('html').unbind('click');
		$('#profile #menu').slideUp(effectDuration, function () {
			openProfileForm();
		});		
	});
	//Password
	$('#profile .pass').click(function (e) {
		e.preventDefault();		
		$('html').unbind('click');
		$('#profile #menu').slideUp(effectDuration, function () {
			openPasswordForm();
		});		
	});
	//Logoff
	$('#profile .logoff').click(function (e) {		
		e.preventDefault();
		$('#profile .edit').unbind('click');
		$('#profile .logoff').unbind('click');
		$('html').unbind('click');
		$('#profile #menu').slideUp(effectDuration, function () {
			logoff(e);
		});		
	});
}

//Near comments
function fillYou () {
	$('#you .logoff').click(logoff); 
	$('#you .login').click(openLoginForm); 
	$('#you .signup').click(openSignupForm); 
}

//Load data at page load
$().ready(function() {
	refresh(false);
});