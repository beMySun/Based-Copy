/**
 * CSS文件加载器，主要功能：动态加载CSS文件，支持加载完成时候的回调（成功 and 失败 情况下）
 * @example
 *   loadCSS.load('style.css');
 *   loadCSS.load('style.css', function(){ alert('style.css loaded'); });
 *   loadCSS.load('style.css', function(obj){ alert('age is '+obj.age); }, {age: 24});
 *   loadCSS.load(['a.css', 'b.css'], function(){ alert('a.css and b.css are all loaded'); });
 */

var CSS = (function() {

    //配置项
    var CFG = {
        POLL_INTERVAL: 50,
        MAX_TIME: 10
    };

    var head = document.head || document.getElementsByTagName('head')[0];
    var styleSheets = document.styleSheets
    var env = getEnv(); //获取用户代理信息，为浏览器差异化加载提供判断依据
    var queue = []; //CSS加载队列

    function indexOf(arr, ele) {
        var ret = -1;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == ele) ret = i;
        }
        return ret;
    }

    /**
     * @description 返回用户浏览器代理信息，为判断不同浏览器提供依据
     * @return {Object} 格式见内部代码
     */
    function getEnv() {
        var ua = navigator.userAgent;
        var env = {};
        (env.webkit = /AppleWebKit\//.test(ua)) || (env.ie = /MSIE/.test(ua)) || (env.opera = /Opera/.test(ua)) || (env.gecko = /Gecko\//.test(ua)) || (env.unknown = true);
        return env;
    }

    /**
     * @description gecko内核的浏览器轮询检测方法
     * @param {Object} queueObj 见@格式1
     */
    function pollGecko(node, queueObj) {
        try {

            node.sheet.cssRules;

        } catch (ex) {

            node.pollCount++;

            if (node.pollCount < 200) {

                setTimeout(function() {
                    pollGecko(node, queueObj);
                }, 50);

            } else {

                finishLoading(node.href, queueObj); //用不用略做些延迟，防止神一样的渲染问题？？

            }

            return;
        }

        finishLoading(node.href, queueObj);
    }


    /**
     * @private
     * @description webkit内核的浏览器轮询检测方法
     * @param {HTMLElement} node link节点，node.nodeName == 'LINK'
     * @param {Object} queueObj 见@格式1
     */
    function pollWebKit(node, queueObj) {

        for (var i = styleSheets.length; i > 0; i--) {

            if (styleSheets[i - 1].href === node.href) {
                finishLoading(node.href, queueObj);
                return;
            }
        }

        node.pollCount++; //轮询次数加1

        if (node.pollCount < 200) {
            setTimeout(function() {
                pollWebKit(node, queueObj);
            }, 50);
        } else {
            finishLoading(node.href, queueObj);
        }
    }

    function checkSucc(className, attr, value) {
        var div = document.createElement('div');
        div.style.cssText += 'height:0; line-height:0; visibility:hidden;';
        div.className = className;
        document.body.appendChild(div);

        return getComputedStyle(div, attr) == value;
    }

    function getComputedStyle(node, attr) {
        var getComputedStyle = window.getComputedStyle;
        if (getComputedStyle) {
            return getComputedStyle(node, null)[attr];
        } else if (node.currentStyle) {
            return node.currentStyle[attr];
        } else {
            return node.style[attr];
        }
    }

    /**
     * @private
     * @description url对应的CSS文件加载完成时的回调（404也包括在内）
     * @param {String} url CSS文件的url
     * @param {Object} queueObj 见@格式1
     */
    function finishLoading(url, queueObj) {
        var index = indexOf(queueObj.urls, url);
        queueObj.urls.splice(index, 1);

        if (!queueObj.urls.length) {
            queueObj.callback(queueObj.obj);

            index = indexOf(queue, queueObj);
            queue.splice(index, 1);
        }
    }

    function loadCSS(urls, callback, obj) {
        var queueObj = {
            urls: urls,
            callback: callback,
            obj: obj
        }
        queue.push(queueObj);

        var pendingUrls = queueObj.urls;
        for (var i = 0, len = pendingUrls.length; i < len; ++i) {

            var url = pendingUrls[i];
            var node;
            if (env.gecko) {
                node = document.createElement('style');
            } else {
                node = document.createElement('link');
                node.rel = 'stylesheet';
                node.href = url;
            }

            node.setAttribute('charset', 'utf-8');  //设不设置有木有影响，持保留态度

            if (env.gecko || env.webkit) { //老版本webkit、gecko不支持onload

                node.pollCount = 0;
                queueObj.urls[i] = node.href; //轮询判断的时候用到，因为不同浏览器里面取到的node.href值会不一样，有的只有文件名，有的是完整文件名？（相对路径、绝对路径）          

                if (env.webkit) { //之所以要用轮询，后面讨论，@TODO: 新版本的webkit已经支持onload、onerror，优化下？

                    pollWebKit(node, queueObj);

                } else {

                    node.innerHTML = '@import "' + url + '";'; //为什么这样做，猛点击这里：http://www.phpied.com/when-is-a-stylesheet-really-loaded/
                    pollGecko(node, queueObj);
                }

            } else {

                node.onload = node.onerror = function() {
                    finishLoading(this.href, queueObj);
                };
            }

            head.appendChild(node);
        }
    }

    return {

        /**
         * @description 加载CSS文件
         * @param {Array|String} urls 要加载的CSS文件的文件名（相对路径，或绝对路径），比如：'style.css', ['style.css', 'test.css']
         * @param {Function} [callback] 可选：文件加载完成后的回调（成功；或失败，如404、500等）
         * @param {Object} [obj] 可选：回调执行时传入的参数
         */
        load: function(urls, callback, obj) {
            loadCSS([].concat(urls), callback || function() {}, obj || {});
        }

    };
})();
