(function() {
    ///document.write('');
    /**
     * 获取当前文件的路径
     *
     * Returns: {String} 当前脚本文件路径
     */
    //动态加载css
    function dynamicLoadCss(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
    var cssFiles = [
        "../lib/layer/skin/layer.css",
        "../lib/boostrap-v4/css/bootstrap.css",
        "../css/style.css"
    ];
    var cssTags = new Array(cssFiles.length);
    for (var k = 0, len = cssTags.length; k < len; k++) {
        dynamicLoadCss(cssFiles[k]);
    }
    // 加载所有js文件
    var jsFiles = [
        "../lib/jquery-1.8.3.min.js",
        "../lib/boostrap-v4/js/bootstrap.js", //加载bootstrap
        "../config/markerLoadLayer.js", //加载定制loading遮罩层控件
        "../lib/highcharts.js", //加载highcharts
        "../lib/moment.min.js",
        "../lib/exporting.js",
        "../lib/highcharts-3d.js",
        "../lib/highcharts-more.js",
        "../lib/drilldown.js",
        "../lib/layer/layer.js", //加载layer
        "../config/configGobal.js", //加载全局配置文件
        "../config/getAjax.js", //加载ajax请求
        "../config/drawCharts.js", //加载图表渲染
        "../config/loadingData.js" //加载数据请求渲染图表类统一调用
    ];
    var scriptTags = new Array(jsFiles.length);
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();