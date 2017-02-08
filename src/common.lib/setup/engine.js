define(function(require, exports, module) {
	var Handlebars = require('handlebars');
	var box  = {
		init:function(){
			return box;
		},
		clicked:function(){},
		render:function($dom, data, tpl){
	    	var tplc = Handlebars.compile(tpl);
	    	$dom.html(tplc(data));
	    	box.$dom = $dom;
	    	$dom.click(function() {
	    	  box.clicked && box.clicked();
	    	});
		}
	};


	Handlebars.registerHelper("getWeatherDate",function(v){
		if(v == 0 ){
			return "今天";
		}else if(v == 1){
			return "明天";
		}else{
			return "后天";
		}
	})

	module.exports = box;
});