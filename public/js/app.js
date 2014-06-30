var app = app || {};

app.global={
	

	init:function(){
		if(typeof errors ==='object'){
			this.errors = errors.errors;
			this.showErrors();	
		}
		
	},
	showErrors:function(){
		$.each(app.global.errors, function(i,e){
			var msg =$("<span />").text(e.message);
			console.log('key', i, 'value', e);

			$("#"+i).after(msg);
		});
	},

	parseRSS:function(url, callback) {
	  $.ajax({
	    url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
	    dataType: 'json',
	    success: function(data) {
	      callback(data.responseData.feed);
	    }
	  });
	}

};

$(function(){
	app.global.init();
});