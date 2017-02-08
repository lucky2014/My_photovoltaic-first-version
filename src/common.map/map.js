define(function(require, exports, module) {
    var mapApp = {
        init: function(data,layoutSize,layoutCenter){
            var me = this;
            return {
                backgroundColor: '#202b33',
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        //console.log(JSON.stringify(params,null,2));
                        return params.name + '： <br /> ' + params.value[2] + "kW/"+params.data.power+"kWp";
                    },
                    backgroundColor:"#357a69",
                    borderColor: "#1fd1cb",
                    borderWidth: 1
                },
                grid: {
                    left:0,
                    top:0,
                    bottom:0,
                    right:0
                },
                layoutCenter: layoutCenter || ["50%", "50%"],
                // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
                layoutSize: layoutSize || 530,
                legend: {
                    orient: 'vertical',
                    y: 'top',
                    x:'right',
                    data:['pm2.5'],
                    textStyle: {
                        color: '#fff'
                    },
                    show: false
                },
                visualMap: {
                    min: 0,
                    max: 400000,
                    calculable: true,
                    left: '10',
                    top: 20,
                    inRange: {
                        color: ['#2f8cea', '#28ddad', '#35d32d']
                    },
                    textStyle: {
                        color: '#fff'
                    }
                },
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    //roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#2d4455',
                            borderColor: '#202b33'
                        },
                        emphasis: {
                            areaColor: '#2d4455'
                        }
                    }
                },
                series: [
                    {
                        name: 'pm2.5',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        //data: me.convertData(data),
                        data: data,
                        symbolSize: 6,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        }
                    }
                ]
            }
        },
    };

    module.exports = mapApp;
    
});