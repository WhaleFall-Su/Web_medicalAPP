;(function (win) {
    var tid
    function refreshRem() {
        let designSize = 1920 // 设计图尺寸
        let html = document.documentElement
        let wW = html.clientWidth // 窗口宽度
        let rem = (wW * 100) / designSize
        document.documentElement.style.fontSize = rem + 'px'
    }
    win.addEventListener(
        'resize',
        function () {
            clearTimeout(tid)
            tid = setTimeout(refreshRem, 1)
        },
        false
    )
    win.addEventListener(
        'pageshow',
        function (e) {
            if (e.persisted) {
                clearTimeout(tid)
                tid = setTimeout(refreshRem, 1)
            }
        },
        false
    )
    refreshRem()
})(window)

let add = document.getElementsByClassName('add')[0]
if (add) {
    add.onclick = function (e) {
        e.stopPropagation();
        let box = document.getElementsByClassName('noteCon')[0]
        let notes = document.querySelectorAll('.enter')
        let item = document.createElement('div')
        item.classList = 'noteItem'
        let html = `<div class="visNote">1</div><textarea class="enter" name="note${notes.length}"></textarea>`
        item.innerHTML = html
        box.appendChild(item)
        $(".noteItem .enter").click(function(e){
            return false
        })
    }
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
