define(function(require, exports, module) {		
	var $ = require("jquery");
	var Engine = require("engine");
	var weatherTpl = require("src/common.weather/weather.tpl");
	var setup = require("setup");

	//实例化组件
	var box = Engine.init();

	var weatherApp = {
		adTimer: null,
		getWeather: function(stationId){
			var me = this;
			//天气接口
			setup.commonAjax("getWeather", setup.getParams({
		        stationId: stationId
		    }), function(msg){
		        //console.log(JSON.stringify(msg,null,2));
		        box.render($(".weather"), msg, weatherTpl);
		        clearInterval(me.adTimer);
		        me.setScrollFn();
		    });
		},
		setScrollFn: function(){
			var me = this;
			var len  = $(".weather li").length;
            if(len>1){
                var index = 0;

                me.adTimer = setInterval(function(){
                	showImg(index);
                    index++;
                    
                    if(index==len){
                        index = 0;
                    }
                },6000);
            }else{
            	clearInterval(me.adTimer);
            }
            
            // 通过控制top ，来显示不同的幻灯片
            function showImg(index){
                var adHeight = $(".weather li").height();
                $('.weather ul').stop(true,false).animate({top : -adHeight*index},1000);
            }
		}
	};

	
	module.exports =  weatherApp;
});
