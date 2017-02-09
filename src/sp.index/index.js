define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
	var echarts = require("echarts");
	var mapData = [];

	$("#userInfo").html("欢迎您 "+sessionStorage.getItem("userName")+" !");

	//获取地图的高度
	var wHeight = $(window).height();
	$("#myMap").height(wHeight-210);
	var layoutSize = 0;
	if(wHeight>900){
		layoutSize = 840;
		$("#myGauge").css("height","250px");
	}else{
		layoutSize = 530;
		$("#myGauge").css("height","226px");
	}

	var myMap = echarts.init(document.getElementById('myMap'));
	//渲染地图
	var chinaOption = require("src/common.map/map");
	function renderChina(option){
		$.get('src/common.map/china.json', function (chinaJson) {
	        echarts.registerMap('china', chinaJson);
			
	        myMap.clear();
	        myMap.setOption(option);
	    });
	}

	//渲染整个页面
	function renderIndex(){
		setup.commonAjax("getPowerList", setup.getParams(), function(msg){
			//console.log(JSON.stringify(msg,null,2));
			$.each(msg.chartList, function(i,v){
				mapData.push({name:v.name, value:[v.lon, v.lat, v.energy], power: v.power})
			});
			renderChina(chinaOption.init(mapData,layoutSize));
		});

		//导航接口和地图旁边的统计
		setup.commonAjax("getAllTotal", setup.getParams(), function(msg){
	        $("#msuEnergy").html(msg.msuEnergy);
	        $("#msuIncome").html(msg.msuIncome);
	        $("#msuCapacity").html(msg.msuCapacity);
	        $("#msuStationNum").html(msg.msuStationNum);

	        $("#msuCo2").html(msg.msuCo2+"吨");
	        $("#msuAff").html(msg.msuAff+"棵");
	        $("#msuDistance").html(msg.msuDistance+"kW");
	        $("#msuSavingCoal").html(msg.msuSavingCoal+"吨");
	    });
	}

	//单个电站信息,右边的那一片
	require("src/sp.stationDetail/index");

	//渲染地图
	renderChina(chinaOption.init([],layoutSize));
	renderIndex();

	//点击右边滑动按钮
	$(".slideBt").click(function(){
		var me = $(this);
		var layoutCenter = [], layoutSize = 0;
		if(me.hasClass("big")){
			$(".wrap").toggleClass("big");
			$(this).toggleClass("big");
			//地图的高度变化
			var h = $(".wrapRight").height()-80;
			var w = parseInt($(window).width()*0.18);
			if(wHeight>900){
				layoutSize = 840;
				$("#myMap").height($(window).height()-210);
			}else{
				layoutSize = 530;
				document.getElementById('myMap').style.height = h +"px";
			}
			
			$(".wrapRight").show();
			$("#myMap").css("left","-30%");
		}else{
			$(".wrap").toggleClass("big");
			$(this).toggleClass("big");

			////地图的高度变化
			$("#myMap").height($(window).height()-230);
			if(wHeight>900){
				layoutSize = 840;
			}else{
				layoutSize = 530;
			}
			$(".wrapRight").hide();
			$("#myMap").css("left", 0);
		}

		renderChina(chinaOption.init(mapData,layoutSize));
	});

	//用户信息
	setup.commonAjax("getUserInfo", setup.getParams(), function(msg){
        $("#name").html(msg.name);
        $("#email").html(msg.email);
        $("#address").html(msg.city+msg.area+msg.address);
        $("#telphone").html(msg.telephone);
        $("#loginIp").html(msg.loginIp);
        $("#loginTime").html(msg.loginDate);
        $("#mark").html(msg.mark);

        //box.render($(".userInfo"), msg, userInfoTpl);
        $("#userInfo").click(function(e){
        	e.stopPropagation();
        	$(".userInfo").toggle();
		});
		$("body").click(function(){
			$(".userInfo").hide();
		});
    });
    //退出
    $("#exit").click(function(){
		sessionStorage.setItem("userId","");
		sessionStorage.setItem("userName","");
		location.href = "login.html";
	});

	var timer ;
    clearInterval(timer);
	//60秒刷新
	timer = setInterval(function(){
		renderIndex();
	}, 60000);
});