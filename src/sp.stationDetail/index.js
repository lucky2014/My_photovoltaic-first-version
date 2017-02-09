define(function(require, exports, module) {
    var $ = require("jquery");
    var echarts = require("echarts");
    var Engine = require("engine");
    var box = Engine.init();
    var barStatTpl = require("src/sp.stationDetail/oneStationStat.tpl");
    var addressTpl = require("src/sp.stationDetail/address.tpl");
    var footerTpl = require("src/common.partial/footer.tpl");
    var swiperTpl = require("src/common.swiper/swiper.tpl");
    var setup = require("setup");
    var lineApp = require("src/sp.stationDetail/lineChart"); 
    var weatherApp = require("src/common.weather/weather");
        require("my97DatePicker");


    var myGaugeW = parseInt($(window).width()*0.18);  //0.37*0.5
    $("#myGauge").css("width",myGaugeW);


    var myGauge = echarts.init(document.getElementById('myGauge'));

    var timer ; //仪表计时器
    var timer2 ; //折线图计时器
    var flag = false;

    var indexApp = {
        myDate: new Date(),
        formatterDate: function(t){
            return (t<10) ? "0"+t : t;
        },
        getFullYear: function(){
            var me = this;
            return me.myDate.getFullYear();
        },
        getMonth: function(){
            var me = this;
            return me.getFullYear() + "-" + me.formatterDate((me.myDate.getMonth())+1);
        },
        getDate: function(){
            var me = this;
            return me.getMonth() + "-" + me.formatterDate(me.myDate.getDate());
        },
        rendStationDetail: function(stationId){
            var me = this;
            sessionStorage.setItem("stationId", stationId);
            //-----------------天气预报-----------------
            weatherApp.getWeather(stationId);

            //电站基本信息接口
            setup.commonAjax("getStationDateil", setup.getParams({
                stationId: stationId
            }), function(msg){
                //console.log(JSON.stringify(msg,null,2));
                //-----------------渲染banner-----------------  
                var banner = msg.pic.split("|");
                me.swiper(banner);

                $("#refreshTime").html(msg.refreshTime);
                //-----------------单个电站统计-----------------
                box.render($(".oneStationStat"), msg, barStatTpl);
                var Wwidth = $(window).width();
                var Wheight = $(window).height();
                
                $(".oneStationStat img").css("height", 0.019*Wwidth + "px"); //0.38*0.5*0.2*0.56

                //-----------------渲染仪表-----------------
                myGauge.clear();
                myGauge.setOption(guageApp.init([{value: msg.power, name: 'kW'}], msg.capacityVal, myGaugeRadius, axisTickLen),true);

                //-----------------渲染地址-----------------  
                box.render($(".addressParent"), msg, addressTpl);
            });

            
            //-----------------折线图-----------------
            me.getDataValueChange(1,stationId)

            //脚部
            box.render($(".footer"),"", footerTpl);
        },
        swiper: function(banner){
            //console.log(JSON.stringify(banner,null,2));
            box.render($("#swiper"), banner, swiperTpl);
            
            var len  = $(".num li").length;
            var ww = $(window).width()*0.37;
            $(".swiper-wrapper").css("width",ww*len+"px");
            $(".swiper-wrapper img").css("width",ww+"px");

            var Swiper = require("swiper");
            var swiper = new Swiper('#swiper', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 5000,
                autoplayDisableOnInteraction: false
            });
        },
        getChartDataBychartType1: function(params){ //chartType=1的情况
            var me = this;
            setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                //console.log(JSON.stringify(msg,null,2));
                var time = [];
                var data = [];
                $.each(msg, function(i,v){
                    time.push(v.reportDate.split(" ")[1].slice(0,5));
                    data.push(v.power/10);
                });
                var lineOption = lineApp.init('line','  实时发电功率', time, data);
                
                myline.clear();
                myline.setOption(lineOption);

                var footerTpl = require("src/common.partial/footer.tpl");
                //脚部
                box.render($(".footer"),"", footerTpl);
            });
        },
        getDataValueChange: function(dataValue, stationId, date, titleType){
            var me = this;
            var myline = echarts.init(document.getElementById('myline'));
            if(dataValue == "1"){//实时
                $(".datePickerParent").hide();
                var date = date || me.getDate();
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
                //请求渲染 

                setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                    //console.log(JSON.stringify(msg,null,2));
                    var time = [];
                    var data = [];
                    $.each(msg, function(i,v){
                        time.push(v.reportDate.split(" ")[1].slice(0,5));
                        data.push(v.power/10);
                    });
                    var lineOption = lineApp.init('line','  实时发电功率', time, data);
                    
                    myline.setOption(lineOption);

                    var footerTpl = require("src/common.partial/footer.tpl");
                    //脚部
                    box.render($(".footer"),"", footerTpl);
                });

                //me.getChartDataBychartType1(params,date);

                //60秒刷新
                clearInterval(timer2);
                timer2 = null;
                timer2 = setInterval(function(){
                    //console.log(stationId+"==点击");
                    setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                        var time = [];
                        var data = [];
                        $.each(msg, function(i,v){
                            time.push(v.reportDate.split(" ")[1].slice(0,5));
                            data.push(v.power/10);
                        });
                        var lineOption = lineApp.init('line','  实时发电功率', time, data);
                        
                        myline.setOption(lineOption);

                        var footerTpl = require("src/common.partial/footer.tpl");
                        //脚部
                        box.render($(".footer"),"", footerTpl);
                    });
                }, 60000);

            }else if(dataValue == "2"){//选择日
                clearInterval(timer2);
                $(".datePickerParent").show();
                $("#datePicker2").val(me.getDate()).show().siblings("input").hide();

                var date = date || me.getDate();
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
                //console.log(JSON.stringify(dateRet,null,2));
                var dateRet = date.split("-");
                titleType = (titleType && titleType == 1) ? "今日" : dateRet[0]+"年"+dateRet[1]+"月"+dateRet[2]+"日";
                lineApp.getChartDataBychartType2(params,titleType);
            }else if(dataValue == "3"){//选择月
                clearInterval(timer2);
                $(".datePickerParent").show();
                $("#datePicker3").val(me.getMonth()).show().siblings("input").hide();

                var date = date || me.getMonth()+"-01";
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
                var dateRet = date.split("-");
                titleType = (titleType && titleType == 1) ? "本月" : dateRet[0]+"年"+dateRet[1]+"月";
                lineApp.getChartDataBychartType3(params,titleType);
            }else if(dataValue == "4"){//选择年
                clearInterval(timer2);
                $(".datePickerParent").show();
                $("#datePicker4").val(me.getFullYear()).show().siblings("input").hide();

                var date = date || me.getFullYear()+"-01-01";
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
                var dateRet = date.split("-");
                titleType = (titleType && titleType == 1) ? "本年" : dateRet[0]+"年"+dateRet[1]+"月";
                lineApp.getChartDataBychartType4(params,titleType);
            }else{ //选择总
                clearInterval(timer2);
                $(".datePickerParent").hide();
                var date = me.getFullYear()+"-01-01";
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
                lineApp.getChartDataBychartType5(params);
            }
        },
        getLineParams: function(stationId, chartType, date){
            var me = this;
            /*console.log(JSON.stringify({
                stationId: stationId,
                chartType: chartType || 1,
                beginDate: date || me.getDate()
            }));*/
            return {
                stationId: stationId,
                chartType: chartType || 1,
                beginDate: date || me.getDate()
            }
        },
        readerGauge: function(stationId){
            setup.commonAjax("getStationDateil", setup.getParams({
                stationId: stationId
            }), function(msg){
                //console.log(stationId);
                myGauge.clear();
                myGauge.setOption(guageApp.init([{value: msg.power, name: 'kW'}], msg.capacityVal, myGaugeRadius, axisTickLen),true);
            });
        }
    };
    var stationListApp = require("src/sp.stationList/stationList");
    

    //-----------------电站总表下拉业务逻辑-----------------
    //获取电站stationId
    //lineApp.getChartDataBychartType1(indexApp.getLineParams());
    var guageApp = require("src/sp.stationDetail/gaugeChart");
    
    myGauge.setOption(guageApp.init(),true);

    box.render($(".oneStationStat"), "", barStatTpl);

    var myGaugeRadius = '84%';
    var wHeight = $(window).height();
    var axisTickLen = 22;
    if(wHeight>900){
        $("#myline,.chartsParent").css("height","360px");
        $("#myGauge,.pmParent").css("height","254px");
        $("#swiper,.bannerSide,.swiper-wrapper,.swiper-slide img").css("height","200px");
        myGaugeRadius = '98%';
        axisTickLen = 24;
    }else{
        $("#myline,.chartsParent").css("height","320px");
        $("#myGauge,.pmParent").css("height","218px");
        $("#swiper,.bannerSide,.swiper-wrapper,.swiper-slide img").css("height","180px");
        myGaugeRadius = '84%';
        axisTickLen = 22;
    }


    //初始化下拉列表
    stationListApp.init(function(stationId){
        clearInterval(timer2);
        timer2 = null;
        clearInterval(timer);
        timer = null;
        indexApp.rendStationDetail(stationId);  //根据新电站ID首次渲染电站详情
         //60秒刷新仪表
        
        timer = setInterval(function(){
            //console.log(stationId+"--gauge");
            indexApp.readerGauge(stationId);
        }, 60000);
    });

    //点击下拉列表,把取得的stationId放进缓存
    stationListApp.liChangeFn(function(){
        clearInterval(timer2);
        timer2 = null;
        clearInterval(timer);
        timer = null;
        indexApp.rendStationDetail(stationId);  //根据新电站ID首次渲染电站详情

        timer = setInterval(function(){
            //console.log(stationId+"--gauge");
            indexApp.readerGauge(stationId);
        }, 60000);
    });

    $(".dateTab dd").click(function(){
        var self = $(this);
        var dataValue = self.attr("data-value");
        self.addClass("on").siblings().removeClass("on");
        var stationId = sessionStorage.getItem("stationId");
        indexApp.getDataValueChange(dataValue, stationId, "", 1);
    });
    
});