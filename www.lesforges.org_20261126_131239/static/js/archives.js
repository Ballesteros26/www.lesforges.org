$().ready(function () {
	
	$('#archives > ul > li > a').click (
		function (e) {
			e.preventDefault();
			var content = $(e.target).parent().find('ul');
			if (content.length > 0) {
				var duration = content.find('li').length;
				if (content.css('display') == 'none')	content.slideDown(duration * 40);
				else content.slideUp(duration * 40);
			}
		}
	);
	
});