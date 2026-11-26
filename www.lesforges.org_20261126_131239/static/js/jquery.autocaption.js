(function($){
	
	$.fn.autocaption = function() {

		return this.each(function() {
		
			/*Gather info*/
			var image = $(this).find('img');
			var alt = image.attr('alt');
						
			/*Create elements*/
			var caption = $(document.createElement('div'));
			caption.addClass('caption');
			var text = $(document.createElement('span'));
			text.addClass('content');
			text.html(alt);
			caption.append(text);
			
			/*Style*/			
			var left = 
				(isNaN(parseInt(image.css('padding-left'), 10)) 		? 0 : parseInt(image.css('padding-left'), 10))
			+ 	(isNaN(parseInt(image.css('border-left-width'), 10))	? 0 : parseInt(image.css('border-left-width'), 10))
			+ 	(isNaN(parseInt(image.css('margin-left'), 10)) 		? 0 : parseInt(image.css('margin-left'), 10))
			;
			var bottom = 
				(isNaN(parseInt(image.css('padding-bottom'), 10)) 		? 0 : parseInt(image.css('padding-bottom'), 10))
			+ 	(isNaN(parseInt(image.css('border-bottom-width'), 10))	? 0 : parseInt(image.css('border-bottom-width'), 10))
			+ 	(isNaN(parseInt(image.css('margin-bottom'), 10)) 		? 0 : parseInt(image.css('margin-bottom'), 10))
			;
			caption.css('left', left + 'px');
			caption.css('bottom', bottom + 'px');
			caption.css('width', image.width() + 'px');
			caption.stop().fadeTo(0, 0.8);
			
			$(this).append(caption);
		});
		
	};
 
})(jQuery);
