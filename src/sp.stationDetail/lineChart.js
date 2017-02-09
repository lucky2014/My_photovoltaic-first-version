define(function(require, exports, module) {
    var $ = require("jquery");
    var echarts = require("echarts");
    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var myLineW = parseInt($(window).width()*0.37);  //0.37*0.5
    $("#myline").css("width",myLineW);

    var lineApp = {
        init: function(type, title, timeList, valueList, subtext){
            var unit = (type == "line") ? "W" : "kW";
            //千分位
            function format (num) {
                return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            }
            return {
                title: {
                    text: title,
                    left: "center",
                    textBaseline: "top",
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#27bb77',
                    },
                    subtext: subtext,
                    padding: [18,0,0,0]
                },
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'normal',
                    fontSize: 12,
                    color: '#09787d'
                },
                tooltip : {
                    trigger: 'axis',
                    formatter : function (params) {
                        //console.log(JSON.stringify(params,null,2));
                        return (params[0].value) ? params[0].seriesName + ' : ' + format(params[0].value*1000) +"W" : params[0].seriesName +" : 0W";
                     }
                },
                legend: {
                    data:['邮件营销'],
                    show: false
                },
                color: ["#5bb39e"],
                toolbox: {
                    show: false
                },
                grid: {
                    left: '1%',
                    right: '3%',
                    bottom: '5%',
                    top: '22%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        name:'',
                        nameGap:1,
                        boundaryGap : true,
                        axisLine: {
                            lineStyle: {
                                color: ['#09787d']
                            }
                        },
                        data : timeList
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name: unit,
                        nameGap:5,
                        splitLine:{
                            show: true,
                            interval: "auto",
                            lineStyle: {
                                color: ['#313b42']
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: ['#09787d']
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'发电量',
                        type: type || 'line',
                        areaStyle: {normal: {}},
                        data: valueList
                    },
                ]
            }
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
                var myline = echarts.init(document.getElementById('myline'));
                myline.clear();
                myline.setOption(lineOption);

                var footerTpl = require("src/common.partial/footer.tpl");
                //脚部
                box.render($(".footer"),"", footerTpl);
            });
        },
        getChartDataBychartType2: function(params,date){ //chartType=2的情况
            var me = this;
            setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                var time = [];
                var data = [];
                var all = 0;
                $.each(msg, function(i,v){
                    time.push(v.reportDate.split(" ")[1].slice(0,5));
                    data.push(v.energy/1000);
                    all += (v.energy)/1000;
                });
                var lineOption = lineApp.init('bar',"   "+date+'发电量', time, data, "   "+all.toFixed(2)+"kWh");
                var myline = echarts.init(document.getElementById('myline'));
                myline.clear();
                myline.setOption(lineOption);

                var footerTpl = require("src/common.partial/footer.tpl");
                //脚部
                box.render($(".footer"),"", footerTpl);
            });
        },
        getChartDataBychartType3: function(params,date){ //chartType=3的情况
            var me = this;
            setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                //console.log(JSON.stringify(msg,null,2));
                var time = [];
                var data = [];
                var all = 0;
                $.each(msg, function(i,v){
                    time.push(v.reportDate.split("-")[1]+"-"+v.reportDate.split("-")[2]);
                    data.push(v.energy/1000);
                    all += (v.energy)/1000;
                });
                date = date.slice(0,7);
                var lineOption = lineApp.init('bar',date+'发电量', time, data, all.toFixed(2)+"kWh");
                var myline = echarts.init(document.getElementById('myline'));
                myline.clear();
                myline.setOption(lineOption);

                var footerTpl = require("src/common.partial/footer.tpl");
                //脚部
                box.render($(".footer"),"", footerTpl);
            });
        },
        getChartDataBychartType4: function(params,date){ //chartType=4的情况
            var me = this;
            //console.log(JSON.stringify(params,null,2));
            setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                //console.log(JSON.stringify(msg,null,2));
                var time = [];
                var data = [];
                var all = 0;
                $.each(msg, function(i,v){
                    time.push(v.reportDate.split(" ")[0].split("-")[0]+"-"+v.reportDate.split(" ")[0].split("-")[1]);
                    data.push(v.energy/1000);
                    all += (v.energy)/1000;
                });
                date = date.slice(0,4);
                var lineOption = lineApp.init('bar',date+'发电量', time, data, all.toFixed(2)+"kWh");
                var myline = echarts.init(document.getElementById('myline'));
                myline.clear();
                myline.setOption(lineOption);

                var footerTpl = require("src/common.partial/footer.tpl");
                //脚部
                box.render($(".footer"),"", footerTpl);

            });
        },
        getChartDataBychartType5: function(params){ //chartType=5的情况
            var me = this;
            setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                var time = [];
                var data = [];
                var all = 0;
                $.each(msg, function(i,v){
                    time.push(v.reportDate.split(" ")[0].split("-")[0]);
                    data.push(v.energy/1000);
                    all += (v.energy)/1000;
                });
                var lineOption = lineApp.init('bar','总计发电量', time, data, all.toFixed(2)+"kWh");
                var myline = echarts.init(document.getElementById('myline'));
                myline.clear();
                myline.setOption(lineOption);

                var footerTpl = require("src/common.partial/footer.tpl");
                //脚部
                box.render($(".footer"),"", footerTpl);
            });
        },
    };

    module.exports = lineApp;
});