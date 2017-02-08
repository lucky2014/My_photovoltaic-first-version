(function(){
	var config = {
		base: "./",
		alias: {
			"jquery": "src/common.lib/jquery/jquery-1.8.3.min",
			"handlebars":"src/common.lib/handlebars/handlebars.seajs.min",
			"engine": "src/common.lib/setup/engine", //模板引擎
			"echarts": "src/common.lib/echarts", //图表
			"setup": "src/common.lib/setup/setup", //ajax配置
			"MD5": "src/common.lib/MD5/jquery.md5", //md5加密
			"CryptoJS": "src/common.lib/DES/CryptoJS", //des加密
			"my97DatePicker": "src/common.lib/My97DatePicker/WdatePicker",
			"swiper": "src/common.swiper/swiper.min",
		}
	};

	seajs.config(config);
})();