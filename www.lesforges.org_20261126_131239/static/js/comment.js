//Add comment
function fillForm () {
	$('#comment_form input:submit').button();
	//Submit button
	$('#comment_form').submit( function() {
		$('#your_comment .submit').html("<p>Envoi en cours, veuillez patienter.</p>");
		//Post comment
		$.post(
			your_comment_url
		,	$('#comment_form').serialize()
		,	function (data, textStatus, jqXHR) {
				if (jqXHR.getResponseHeader('did_send') == 'true') {
					$('#your_comment').slideUp(400, function () {
						//Confirm reception
						$('#your_comment').html("<p>Votre commentaire a bien été envoyé. Merci de votre participation.</p>");
						$('#your_comment').addClass('form_complete');						
						$('#your_comment').slideDown(400,
							function () {
								//Display new comment
								$('#new_comment').css('display', 'none');
								$('#new_comment').load(
									jqXHR.getResponseHeader('comment_url')
								,	function () { 
										$('#new_comment').slideDown(400);
										//Add interactivity to it
										$('#new_comment .comment_actions .edit').click(editComment);
										$('#new_comment .comment_actions .delete').click(deleteOrRestoreComment);
										$('#new_comment .comment_actions .restore').click(deleteOrRestoreComment);											
									}
								);
								
								//Display new recent comment
								$('#new_recent_comment').css('display', 'none');
								$('#new_recent_comment').load(
									jqXHR.getResponseHeader('recent_comment_url')
								,	function () { 
										$('#latest_comments .comment:last').slideUp(400);										
										$('#new_recent_comment').slideDown(400);																			
									}
								);
							}
						);
					});
				} else {
					$('#your_comment_form_wrapper').html(data)
					fillForm();
				}
			}
		);
		return false;
	});
}

//Delete or restore (and then fade accordingly)
function deleteOrRestoreComment (e) {
	e.preventDefault();
	var id = $(e.target).closest('.comment').attr("id").match(/\d+$/);
	$.post (
		delete_or_restore_comment_url
	,	{comment_id: id, csrfmiddlewaretoken: csrf}
	, 	function (data, textStatus, jqXHR) {
			if (jqXHR.getResponseHeader('did_change') == 'true') {
				var is_now_deleted = jqXHR.getResponseHeader('is_now_deleted') == 'true';
				$(e.target).closest('.comment').fadeTo(200, is_now_deleted ? .4 : 1);
				$(e.target).css("display", "none");
				$(e.target).closest('.comment').find(is_now_deleted ? ".restore" : ".delete").css("display", "inline");
				$(e.target).closest('.comment').find(".edit").css("display", is_now_deleted ? "none" : "inline");
			}
		}
	);
}

//Edit a comment
function editComment (e) {
	e.preventDefault();
	var id = $(e.target).closest('.comment').attr("id").match(/\d+$/);
	$(e.target).closest('.comment .comment_actions').slideUp(200);
	//Load edit form
	$(e.target).closest('.comment').find('.comment_content').load(
		edit_comment_url
	,	{comment_id: id, csrfmiddlewaretoken: csrf}
	,	function () {
			fillEditForm(id, $('#edit_comment_' + id));
			$('html, body').animate({
				scrollTop: $('#edit_comment_' + id).offset().top,
				easing: 'swing'
			}, 400)
		}
	);
}

//Confirm comment edit
function fillEditForm (id, form) {
	form.find('input:submit').button();
	form.find('textarea').resizable({ handles: 's' });
	//Send form data
	form.submit( function() {
		$('form .submit').html("<p>Envoi en cours, veuillez patienter.</p>");
		$.post (
			edit_comment_confirm_url
		,	"comment_id=" + id + "&" + form.serialize()
			//Update comment in page
		,	function (data, textStatus, jqXHR) {
				holder = form.closest('.comment_content');
				holder.html(data)
				if (jqXHR.getResponseHeader('did_edit') == 'true')	$('#comment_' + id + " .comment_actions").slideDown(200);
				else												fillEditForm (id, $('#edit_comment_' + id));
			}
		);
		return false;
	});
}

$().ready(function() {

	//Post
	$('#your_comment_form_wrapper').load(
		your_comment_url
	,	fillForm
	);
	
	//Edit / Delete / restore
	$('.comment_actions .edit').click(editComment);
	$('.comment_actions .delete').click(deleteOrRestoreComment);
	$('.comment_actions .restore').click(deleteOrRestoreComment);
	
});