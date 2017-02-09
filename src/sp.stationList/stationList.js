define(function(require, exports, module) {		
	var $ = require("jquery");
	var Engine = require("engine");
	var stationList = require("src/sp.stationList/stationList.tpl");
	var setup = require("setup");

	//实例化组件
	var box = Engine.init();

    var stationListApp = {
    	init: function(callback){
    		var me = this;
    		//接口调试
			setup.commonAjax("stationList", setup.getParams(), function(msg){
		        box.render($(".pwsStat"), msg, stationList);
		        $("#defaultStation").text(msg[0].name).attr("stationId",msg[0].id);
		        sessionStorage.setItem("stationId", msg[0].id);
		        callback && callback(msg[0].id);
		    });
    	},
    	liChangeFn: function(callback){
    		//操作
			$(".pwsStat").click(function(e){
				e.stopPropagation();
				if ($(".level1").hasClass("hide")) {
					$(".level1").slideDown();
				}else{
					$(".level1").slideUp();
				}
			});
			$(".pwsStat").delegate(".level1>li", "mouseover", function(e){
				e.stopPropagation();
				$(this).children(".level2").fadeIn();
				$(this).siblings("li").children(".level2").fadeOut();
			});
			$(".pwsStat").delegate(".level1 li", "click", function(e){
				var me = $(this);
				e.stopPropagation();
				stationId = me.attr("stationId");
				sessionStorage.setItem("stationId", stationId);
				callback && callback(stationId);
				if (me.find("ul").hasClass("hide")) {
					$("#defaultStation").html(me.children("span").html()).attr("stationId",me.attr("stationId")); //$("#defaultStation")选中状态的节点
				}else{
					$("#defaultStation").html(me.html()).attr("stationId",me.attr("stationId"));
				}
				$(".level1").slideUp();
				$(".level2").hide();
			});
			$("body").click(function(e){
				e.stopPropagation();
				$(".level1").slideUp();
				$(".level2").hide();
			});
			$(".pwsStat").hover(function(e){
				e.stopPropagation();
			},function(e){
				e.stopPropagation();
				$(".level1").slideUp();
				$(".level2").hide();
			});
    	}
    }

    module.exports = stationListApp;
});
