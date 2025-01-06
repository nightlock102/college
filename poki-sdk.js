(() => {
    var e = function (e) {
        var t = RegExp("[?&]" + e + "=([^&]*)").exec(window.location.search);
        return t && decodeURIComponent(t[1].replace(/\+/g, " "));
    },
        t = "kids" === e("tag"),
        n = !!window.adBridge,
        o = "yes" === e("hoist") || "yes" === e("gdhoist"),
        i = new (function () {
            function e() {
                var e = this;
                this.queue = [],
                    this.init = function (t, n) {
                        return void 0 === t && (t = {}), void 0 === n && (n = {}),
                            new Promise((function (o, i) {
                                e.enqueue("init", [t, n], o, i);
                            }));
                    },
                    this.displayA = function (e, t, n, o) {
                        // Neutralizing advertisement display function
                        if (o) o(!1);
                        if (n) n();
                    },
                    this.withArguments = function (t) {
                        return function () {
                            for (var n = [], o = 0; o < arguments.length; o++) n[o] = arguments[o];
                            e.enqueue(t, n);
                        };
                    },
                    this.throwNotLoaded = function () {
                        console.debug("PokiSDK is not loaded yet. Not all methods are available.");
                    },
                    this.doNothing = function () { };
            }
            return e.prototype.enqueue = function (e, n, o, i) {
                var r = { fn: e, args: n || [], resolveFn: o, rejectFn: i };
                t ? o && o(!1) : this.queue.push(r);
            }, e.prototype.dequeue = function () {
                for (var e = this, t = function () {
                    var t, o, i = n.queue.shift(), r = i, a = r.fn, u = r.args;
                    if ("function" == typeof window.PokiSDK[a]) {
                        if ((null == i ? void 0 : i.resolveFn) || (null == i ? void 0 : i.rejectFn)) {
                            var c = "init" === a;
                            if ((t = window.PokiSDK)[a].apply(t, u).catch((function () {
                                for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                                "function" == typeof i.rejectFn && i.rejectFn.apply(i, t), c && setTimeout((function () { e.dequeue(); }), 0);
                            })).then((function () {
                                for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                                "function" == typeof i.resolveFn && i.resolveFn.apply(i, t), c && setTimeout((function () { e.dequeue(); }), 0);
                            })), c) return "break";
                        } else (o = window.PokiSDK)[a].apply(o, u);
                    } else console.error("Cannot execute " + a);
                }, n = this; this.queue.length > 0;) {
                    if ("break" === t()) break;
                }
            }, e;
        }());
    
    window.PokiSDK = {
        init: i.init,
        destroyAd: i.doNothing, // Neutralize any ad destruction method
        getLeaderboard: i.handleAutoResolvePromise,
        shareableURL: function () {
            return new Promise((function (e, t) { return t(); }));
        },
        getURLParam: function (t) {
            return e("gd" + t) || e(t) || "";
        },
        getLanguage: function () {
            return navigator.language.toLowerCase().split("-")[0];
        },
        isAdBlocked: function () { } // Neutralize the ad detection check
    }, ["captureError", "customEvent", "gameInteractive", "gameLoadingFinished", "gameLoadingProgress", "gameLoadingStart", "gameplayStart", "gameplayStop", "happyTime", "logError", "muteAd", "roundEnd", "roundStart", "sendHighscore", "setDebug", "setDebugTouchOverlayController", "setLogging", "setPlayerAge", "setPlaytestCanvas", "playtestSetCanvas", "playtestCaptureHtmlOnce"].forEach((function (e) {
        window.PokiSDK[e] = i.withArguments(e);
    }));
    
    var r = function () {
        var i = window.pokiSDKVersion || e("ab") || "5443f10e0bfac1bb0eb31054b8513ef81e6cc7c1",
            r = "poki-sdk-core-" + i + ".js";
        t && (r = "poki-sdk-kids-" + i + ".js"),
            n && (r = "poki-sdk-playground-" + i + ".js"),
            o && (r = "poki-sdk-hoist-" + i + ".js");
        new URL(document.currentScript.src);
        return "scripts/" + i + "/" + r;
    }(),
        a = document.createElement("script");
    a.setAttribute("src", r),
        a.setAttribute("type", "text/javascript"),
        a.setAttribute("crossOrigin", "anonymous"),
        a.onload = function () { return i.dequeue(); },
        document.head.appendChild(a);
})();

