(() => {
    var e = function (e) {
        var t = RegExp("[?&]".concat(e, "=([^&]*)")).exec(window.location.search);
        return t && decodeURIComponent(t[1].replace(/\+/g, " "));
    };

    var t = "kids" === e("tag"),
        n = !!window.adBridge,
        o = "yes" === e("hoist") || "yes" === e("gdhoist");

    var i = new (function () {
        function e() {
            var e = this;
            this.queue = [];

            this.init = function (t, n) {
                if (void 0 === t) t = {};
                if (void 0 === n) n = {};
                return new Promise((function (o, i) {
                    e.enqueue("init", [t, n], o, i);
                }));
            };

            this.rewardedBreak = function () {
                return new Promise((function (e) {
                    e(!1);
                }));
            };

            this.commercialBreak = function (t) {
                return new Promise((function (n, o) {
                    e.enqueue("commercialBreak", [t], n, o);
                }));
            };

            this.displayAd = function (e, t, n, o) {
                o && o(!0);
                n && n();
            };

            this.withArguments = function (t) {
                return function () {
                    var n = [];
                    for (var o = 0; o < arguments.length; o++) n[o] = arguments[o];
                    e.enqueue(t, n);
                };
            };

            this.handleAutoResolvePromise = function () {
                return new Promise((function (e) {
                    e();
                }));
            };

            this.throwNotLoaded = function () {
                console.debug("PokiSDK is not loaded yet. Not all methods are available.");
            };

            this.doNothing = function () { };
        }

        e.prototype.enqueue = function (e, n, o, i) {
            var r = {
                fn: e,
                args: n || [],
                resolveFn: o,
                rejectFn: i
            };

            t ? o && o(!0) : this.queue.push(r);
        };

        e.prototype.dequeue = function () {
            var e = this;

            var t = function () {
                var t, o, i = n.queue.shift(),
                    r = i,
                    a = r.fn,
                    u = r.args;

                if ("function" == typeof window.PokiSDK[a]) {
                    if ((null == i ? void 0 : i.resolveFn) || (null == i ? void 0 : i.rejectFn)) {
                        var c = "init" === a;

                        t = window.PokiSDK;
                        t[a].apply(t, u).catch((function () {
                            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                            "function" == typeof i.rejectFn && i.rejectFn.apply(i, t);
                            c && setTimeout((function () { e.dequeue(); }), 0);
                        })).then((function () {
                            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                            "function" == typeof i.resolveFn && i.resolveFn.apply(i, t);
                            c && setTimeout((function () { e.dequeue(); }), 0);
                        }));

                        if (c) return "break";
                    } else {
                        o = window.PokiSDK;
                        o[a].apply(o, u);
                    }
                } else {
                    console.error("Cannot execute ".concat(a));
                }
            };

            while (this.queue.length > 0) {
                if ("break" === t()) break;
            }
        };

        return e;
    }());

    window.PokiSDK = {
        init: i.init,
        initWithVideoHB: i.init,
        commercialBreak: i.commercialBreak,
        rewardedBreak: i.rewardedBreak,
        displayA: i.displayA,
        destroyA: i.doNothing,
        getLeaderboard: i.handleAutoResolvePromise,
        shareableURL: function () {
            return new Promise((function (e, t) {
                return t();
            }));
        },
        getURLParam: function (t) {
            return e("gd".concat(t)) || e(t) || "";
        },
        getLanguage: function () {
            return navigator.language.toLowerCase().split("-")[0];
        },
        isAdBlocked: function () { }
    };

    ["captureError", "customEvent", "gameInteractive", "gameLoadingFinished", "gameLoadingProgress", "gameLoadingStart", "gameplayStart", "gameplayStop", "happyTime", "logError", "muteAd", "roundEnd", "roundStart", "sendHighscore", "setDebug", "setDebugTouchOverlayController", "setLogging", "setPlayerAge", "setPlaytestCanvas", "enableEventTracking", "playtestSetCanvas", "playtestCaptureHtmlOnce"].forEach((function (e) {
        window.PokiSDK[e] = i.withArguments(e);
    }));

    var r = function () {
        var i = window.pokiSDKVersion || e("ab") || "5443f10e0bfac1bb0eb31054b8513ef81e6cc7c1",
            r = "poki-sdk-core-".concat(i, ".js");
        
        if (t) r = "poki-sdk-kids-".concat(i, ".js");
        if (n) r = "poki-sdk-playground-".concat(i, ".js");
        if (o) r = "poki-sdk-hoist-".concat(i, ".js");

        new URL(document.currentScript.src);
        return "scripts/".concat(i, "/").concat(r);
    }();

    var a = document.createElement("script");
    a.setAttribute("src", r);
    a.setAttribute("type", "text/javascript");
    a.setAttribute("crossOrigin", "anonymous");
    a.onload = function () { return i.dequeue(); };
    document.head.appendChild(a);
})();
