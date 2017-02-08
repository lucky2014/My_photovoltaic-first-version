define(function(require, exports, module) {
    var guageApp = {
        init: function(data, max, radius, axisTickLen){
            var center = (axisTickLen == 24) ? ['49%', '55%'] : ['50%', '50%'];
            return {
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%",
                    show: false
                },
                toolbox: {
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    },
                    show: false
                },
                series: [
                    {
                        name: '业务指标',
                        type: 'gauge',
                        radius: radius || '84%',
                        min:0,
                        max: max,
                        splitNumber: 10,
                        center: center,
                        //endAngle:450,
                        axisLabel: {
                            show: false
                        },
                        title : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'normal',
                                fontSize: 16,
                                color: '#8698ae',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 0
                            }
                        },
                        markPoint: {
                            symbol: "circle",
                            symbolSize: 50
                        },
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 0,
                                color: [[0.3, '#2f8cea'], [0.7, '#28ddad'], [1, '#35d32d']],
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: axisTickLen || 20,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线,长的那根
                            length: axisTickLen || 20,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer: {
                            width:1
                        },
                        detail: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'normal',
                                formatter:'{value}',
                                color: "#23f8fd",
                                fontSize: 26,
                            }
                        },
                        data: data
                    }
                ]
            }
        }

    };

    module.exports = guageApp;

});