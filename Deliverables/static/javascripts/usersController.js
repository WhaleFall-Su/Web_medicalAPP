const toDateString = (date) => {
    let Month = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ]
    let dateArr = date.split(/[-/,]/)
    return dateArr[2] + '.' + Month[dateArr[1] - 1] + '.' + dateArr[0]
}

// unified date format eg:2022-04-07
const defaultDateType = (date) => {
    let dateArr = date.split(/[-/,]/)
    return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0]
}



function getDays(strDateStart,strDateEnd) {
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1= strDateStart.split(strSeparator);
    oDate2= strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
    //把相差的毫秒数转换为天数
    iDays = parseInt(Math.abs(strDateS - strDateE ) / (1000 * 60 * 60 * 24)+1);
    return iDays ;
}

/**
 * get new date
 * @param type 1 represents next day, -1 represents the previous day
 * @param date yyyy-mm-dd 2022-04-07
 * @return
 */
const otherDay = (date, type) => {
    //type 1下一天 -1上一天

    let num = type - 0
    var curDate = date ? new Date(date) : new Date()
    var preDate = new Date(curDate.getTime() + num * 24 * 60 * 60 * 1000)
    let year = preDate.getFullYear()
    let month = preDate.getMonth() + 1
    month = month > 9 ? month : '0' + month
    let day = preDate.getDate()
    day = day > 9 ? day : '0' + day
    return year + '-' + month + '-' + day
}

function renderCharts() {
    var chartDom = document.getElementById('main')
    let xData = chartDom.getAttribute('xData').split(',')
    let yData = chartDom.getAttribute('yData').split(',')
    var myChart = echarts.init(chartDom)
    var option
    option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLabel: {
                fontSize: 12,
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                },
            },
            axisLabel: {
                fontSize: 12,
            },
        },
        series: [
            {
                data: yData,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(103, 172, 232, 1)', // 0% 处的颜色
                            },
                            {
                                offset: 0.3,
                                color: 'rgba(103, 172, 232,0.6)', //
                            },
                            {
                                offset: 0.7,
                                color: 'rgba(103, 172, 232,0.2)', //
                            },
                            {
                                offset: 1,
                                color: 'rgba(103, 172, 232,0)', //
                            },
                        ],
                        global: false, // 缺省为 false
                    },
                },
            },
        ],
    }
    option && myChart.setOption(option)
}
module.exports = {
    toDateString,
    otherDay,
    defaultDateType,
    getDays
}
