var requirejs, require, define;
"use strict";
(function (global) {
  function isFunction(e) {
    return ostring.call(e) === "[object Function]"
  }

  function isArray(e) {
    return ostring.call(e) === "[object Array]"
  }

  function each(e, t) {
    if (e) {
      var n;
      for (n = 0; n < e.length; n += 1) {
        if (e[n] && t(e[n], n, e)) {
          break
        }
      }
    }
  }

  function eachReverse(e, t) {
    if (e) {
      var n;
      for (n = e.length - 1; n > -1; n -= 1) {
        if (e[n] && t(e[n], n, e)) {
          break
        }
      }
    }
  }

  function hasProp(e, t) {
    return e.hasOwnProperty(t)
  }

  function eachProp(e, t) {
    var n;
    for (n in e) {
      if (e.hasOwnProperty(n) && t(e[n], n)) {
        break
      }
    }
  }

  function mixin(e, t, n, r) {
    return t && eachProp(t, function (t, i) {
      if (n || !hasProp(e, i)) {
        r && typeof t != "string" ? (e[i] || (e[i] = {}), mixin(e[i], t, n, r)) : e[i] = t
      }
    }), e
  }

  function bind(e, t) {
    return function () {
      return t.apply(e, arguments)
    }
  }

  function scripts() {
    return document.getElementsByTagName("script")
  }

  function getGlobal(e) {
    if (!e) {
      return e
    }
    var t = global;
    return each(e.split("."), function (e) {
      t = t[e]
    }), t
  }

  function makeContextModuleFunc(e, t, n) {
    return function () {
      var r = aps.call(arguments, 0),
        i;
      return n && isFunction(i = r[r.length - 1]) && (i.__requireJsBuild = !0), r.push(t), e.apply(null, r)
    }
  }

  function addRequireMethods(e, t, n) {
    each([
      ["toUrl"],
      ["undef"],
      ["defined", "requireDefined"],
      ["specified", "requireSpecified"]
    ], function (r) {
      var i = r[1] || r[0];
      e[r[0]] = t ? makeContextModuleFunc(t[i], n) : function () {
        var e = contexts[defContextName];
        return e[i].apply(e, arguments)
      }
    })
  }

  function makeError(e, t, n, r) {
    var i = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
    return i.requireType = e, i.requireModules = r, n && (i.originalError = n), i
  }

  function newContext(e) {
    function v(e) {
      var t, n;
      for (t = 0; e[t]; t += 1) {
        n = e[t];
        if (n === ".") {
          e.splice(t, 1), t -= 1
        } else {
          if (n === "..") {
            if (t === 1 && (e[2] === ".." || e[0] === "..")) {
              break
            }
            t > 0 && (e.splice(t - 1, 2), t -= 2)
          }
        }
      }
    }

    function m(e, n, r) {
      var i = n && n.split("/"),
        s = i,
        o = t.map,
        u = o && o["*"],
        a, f, l, c, h, p, d, m;
      e && e.charAt(0) === "." && (n ? (t.pkgs[n] ? s = i = [n] : s = i.slice(0, i.length - 1), e = s.concat(e.split("/")), v(e), f = t.pkgs[a = e[0]], e = e.join("/"), f && e === a + "/" + f.main && (e = a)) : e.indexOf("./") === 0 && (e = e.substring(2)));
      if (r && (i || u) && o) {
        c = e.split("/");
        for (h = c.length; h > 0; h -= 1) {
          d = c.slice(0, h).join("/");
          if (i) {
            for (p = i.length; p > 0; p -= 1) {
              l = o[i.slice(0, p).join("/")];
              if (l) {
                l = l[d];
                if (l) {
                  m = l;
                  break
                }
              }
            }
          }!m && u && u[d] && (m = u[d]);
          if (m) {
            c.splice(0, h, m), e = c.join("/");
            break
          }
        }
      }
      return e
    }

    function g(e) {
      isBrowser && each(scripts(), function (t) {
        if (t.getAttribute("data-requiremodule") === e && t.getAttribute("data-requirecontext") === h.contextName) {
          return t.parentNode.removeChild(t), !0
        }
      })
    }

    function y(e) {
      var n = t.paths[e];
      if (n && isArray(n) && n.length > 1) {
        return g(e), n.shift(), h.undef(e), h.require([e]), !0
      }
    }

    function b(e, t, n, r) {
      var i = e ? e.indexOf("!") : -1,
        o = null,
        f = t ? t.name : null,
        l = e,
        c = !0,
        p = "",
        d, v, g;
      return e || (c = !1, e = "_@r" + (u += 1)), i !== -1 && (o = e.substring(0, i), e = e.substring(i + 1, e.length)), o && (o = m(o, f, r), v = s[o]), e && (o ? v && v.normalize ? p = v.normalize(e, function (e) {
        return m(e, f, r)
      }) : p = m(e, f, r) : (p = m(e, f, r), d = h.nameToUrl(p))), g = o && !v && !n ? "_unnormalized" + (a += 1) : "", {
        prefix: o,
        name: p,
        parentMap: t,
        unnormalized: !!g,
        url: d,
        originalName: l,
        isDefine: c,
        id: (o ? o + "!" + p : p) + g
      }
    }

    function w(e) {
      var t = e.id,
        r = n[t];
      return r || (r = n[t] = new h.Module(e)), r
    }

    function E(e, t, r) {
      var i = e.id,
        o = n[i];
      hasProp(s, i) && (!o || o.defineEmitComplete) ? t === "defined" && r(s[i]) : w(e).on(t, r)
    }

    function S(e, t) {
      var r = e.requireModules,
        i = !1;
      t ? t(e) : (each(r, function (t) {
        var r = n[t];
        r && (r.error = e, r.events.error && (i = !0, r.emit("error", e)))
      }), i || req.onError(e))
    }

    function x() {
      globalDefQueue.length && (apsp.apply(i, [i.length - 1, 0].concat(globalDefQueue)), globalDefQueue = [])
    }

    function T(e, t, n) {
      var r = e && e.map,
        i = makeContextModuleFunc(n || h.require, r, t);
      return addRequireMethods(i, h, r), i.isBrowser = isBrowser, i
    }

    function N(e) {
      delete n[e], each(f, function (t, n) {
        if (t.map.id === e) {
          return f.splice(n, 1), t.defined || (h.waitCount -= 1), !0
        }
      })
    }

    function C(e, t) {
      var r = e.map.id,
        i = e.depMaps,
        s;
      if (!e.inited) {
        return
      }
      return t[r] ? e : (t[r] = !0, each(i, function (e) {
        var i = e.id,
          o = n[i];
        if (!o) {
          return
        }
        return !o.inited || !o.enabled ? (s = null, delete t[r], !0) : s = C(o, mixin({}, t))
      }), s)
    }

    function k(e, t, r) {
      var i = e.map.id,
        o = e.depMaps;
      if (!e.inited || !e.map.isDefine) {
        return
      }
      return t[i] ? s[i] : (t[i] = e, each(o, function (s) {
        var o = s.id,
          u = n[o],
          a;
        if (p[o]) {
          return
        }
        if (u) {
          if (!u.inited || !u.enabled) {
            r[i] = !0;
            return
          }
          a = k(u, t, r), r[o] || e.defineDepById(o, a)
        }
      }), e.check(!0), s[i])
    }

    function L(e) {
      e.check()
    }

    function A() {
      var e = t.waitSeconds * 1000,
        r = e && h.startTime + e < (new Date).getTime(),
        i = [],
        s = !1,
        o = !0,
        u, a, c, p;
      if (l) {
        return
      }
      l = !0, eachProp(n, function (e) {
        u = e.map, a = u.id;
        if (!e.enabled) {
          return
        }
        if (!e.error) {
          if (!e.inited && r) {
            y(a) ? (p = !0, s = !0) : (i.push(a), g(a))
          } else {
            if (!e.inited && e.fetched && u.isDefine) {
              s = !0;
              if (!u.prefix) {
                return o = !1
              }
            }
          }
        }
      });
      if (r && i.length) {
        return c = makeError("timeout", "Load timeout for modules: " + i, null, i), c.contextName = h.contextName, S(c)
      }
      o && (each(f, function (e) {
        if (e.defined) {
          return
        }
        var t = C(e, {}),
          n = {};
        t && (k(t, n, {}), eachProp(n, L))
      }), eachProp(n, L)), (!r || p) && s && (isBrowser || isWebWorker) && !d && (d = setTimeout(function () {
        d = 0, A()
      }, 50)), l = !1
    }

    function O(e) {
      w(b(e[0], null, !0)).init(e[1], e[2])
    }

    function M(e, t, n, r) {
      e.detachEvent && !isOpera ? r && e.detachEvent(r, t) : e.removeEventListener(n, t, !1)
    }

    function _(e) {
      var t = e.currentTarget || e.srcElement;
      return M(t, h.onScriptLoad, "load", "onreadystatechange"), M(t, h.onScriptError, "error"), {
        node: t,
        id: t && t.getAttribute("data-requiremodule")
      }
    }
    var t = {
      waitSeconds: 7,
      baseUrl: "./",
      paths: {},
      pkgs: {},
      shim: {}
    },
      n = {},
      r = {},
      i = [],
      s = {},
      o = {},
      u = 1,
      a = 1,
      f = [],
      l, c, h, p, d;
    return p = {
      require: function (e) {
        return T(e)
      },
      exports: function (e) {
        e.usingExports = !0;
        if (e.map.isDefine) {
          return e.exports = s[e.map.id] = {}
        }
      },
      module: function (e) {
        return e.module = {
          id: e.map.id,
          uri: e.map.url,
          config: function () {
            return t.config && t.config[e.map.id] || {}
          },
          exports: s[e.map.id]
        }
      }
    }, c = function (e) {
      this.events = r[e.id] || {}, this.map = e, this.shim = t.shim[e.id], this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0
    }, c.prototype = {
      init: function (e, t, n, r) {
        r = r || {};
        if (this.inited) {
          return
        }
        this.factory = t, n ? this.on("error", n) : this.events.error && (n = bind(this, function (e) {
          this.emit("error", e)
        })), this.depMaps = e && e.slice(0), this.depMaps.rjsSkipMap = e.rjsSkipMap, this.errback = n, this.inited = !0, this.ignore = r.ignore, r.enabled || this.enabled ? this.enable() : this.check()
      },
      defineDepById: function (e, t) {
        var n;
        return each(this.depMaps, function (t, r) {
          if (t.id === e) {
            return n = r, !0
          }
        }), this.defineDep(n, t)
      },
      defineDep: function (e, t) {
        this.depMatched[e] || (this.depMatched[e] = !0, this.depCount -= 1, this.depExports[e] = t)
      },
      fetch: function () {
        if (this.fetched) {
          return
        }
        this.fetched = !0, h.startTime = (new Date).getTime();
        var e = this.map;
        if (!this.shim) {
          return e.prefix ? this.callPlugin() : this.load()
        }
        T(this, !0)(this.shim.deps || [], bind(this, function () {
          return e.prefix ? this.callPlugin() : this.load()
        }))
      },
      load: function () {
        var e = this.map.url;
        o[e] || (o[e] = !0, h.load(this.map.id, e))
      },
      check: function (e) {
        if (!this.enabled || this.enabling) {
          return
        }
        var t = this.map.id,
          r = this.depExports,
          i = this.exports,
          o = this.factory,
          u, a;
        if (!this.inited) {
          this.fetch()
        } else {
          if (this.error) {
            this.emit("error", this.error)
          } else {
            if (!this.defining) {
              this.defining = !0;
              if (this.depCount < 1 && !this.defined) {
                if (isFunction(o)) {
                  if (this.events.error) {
                    try {
                      i = h.execCb(t, o, r, i)
                    } catch (l) {
                      u = l
                    }
                  } else {
                    i = h.execCb(t, o, r, i)
                  }
                  this.map.isDefine && (a = this.module, a && a.exports !== undefined && a.exports !== this.exports ? i = a.exports : i === undefined && this.usingExports && (i = this.exports));
                  if (u) {
                    return u.requireMap = this.map, u.requireModules = [this.map.id], u.requireType = "define", S(this.error = u)
                  }
                } else {
                  i = o
                }
                this.exports = i, this.map.isDefine && !this.ignore && (s[t] = i, req.onResourceLoad && req.onResourceLoad(h, this.map, this.depMaps)), delete n[t], this.defined = !0, h.waitCount -= 1, h.waitCount === 0 && (f = [])
              }
              this.defining = !1, e || this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit("defined", this.exports), this.defineEmitComplete = !0)
            }
          }
        }
      },
      callPlugin: function () {
        var e = this.map,
          r = e.id,
          i = b(e.prefix, null, !1, !0);
        E(i, "defined", bind(this, function (i) {
          var s = this.map.name,
            o = this.map.parentMap ? this.map.parentMap.name : null,
            u, a, f;
          if (this.map.unnormalized) {
            i.normalize && (s = i.normalize(s, function (e) {
              return m(e, o, !0)
            }) || ""), a = b(e.prefix + "!" + s, this.map.parentMap, !1, !0), E(a, "defined", bind(this, function (e) {
              this.init([], function () {
                return e
              }, null, {
                enabled: !0,
                ignore: !0
              })
            })), f = n[a.id], f && (this.events.error && f.on("error", bind(this, function (e) {
              this.emit("error", e)
            })), f.enable());
            return
          }
          u = bind(this, function (e) {
            this.init([], function () {
              return e
            }, null, {
              enabled: !0
            })
          }), u.error = bind(this, function (e) {
            this.inited = !0, this.error = e, e.requireModules = [r], eachProp(n, function (e) {
              e.map.id.indexOf(r + "_unnormalized") === 0 && N(e.map.id)
            }), S(e)
          }), u.fromText = function (e, t) {
            var n = useInteractive;
            n && (useInteractive = !1), w(b(e)), req.exec(t), n && (useInteractive = !0), h.completeLoad(e)
          }, i.load(e.name, T(e.parentMap, !0, function (e, t) {
            return e.rjsSkipMap = !0, h.require(e, t)
          }), u, t)
        })), h.enable(i, this), this.pluginMaps[i.id] = i
      },
      enable: function () {
        this.enabled = !0, this.waitPushed || (f.push(this), h.waitCount += 1, this.waitPushed = !0), this.enabling = !0, each(this.depMaps, bind(this, function (e, t) {
          var r, i, s;
          if (typeof e == "string") {
            e = b(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.depMaps.rjsSkipMap), this.depMaps[t] = e, s = p[e.id];
            if (s) {
              this.depExports[t] = s(this);
              return
            }
            this.depCount += 1, E(e, "defined", bind(this, function (e) {
              this.defineDep(t, e), this.check()
            })), this.errback && E(e, "error", this.errback)
          }
          r = e.id, i = n[r], !p[r] && i && !i.enabled && h.enable(e, this)
        })), eachProp(this.pluginMaps, bind(this, function (e) {
          var t = n[e.id];
          t && !t.enabled && h.enable(e, this)
        })), this.enabling = !1, this.check()
      },
      on: function (e, t) {
        var n = this.events[e];
        n || (n = this.events[e] = []), n.push(t)
      },
      emit: function (e, t) {
        each(this.events[e], function (e) {
          e(t)
        }), e === "error" && delete this.events[e]
      }
    }, h = {
      config: t,
      contextName: e,
      registry: n,
      defined: s,
      urlFetched: o,
      waitCount: 0,
      defQueue: i,
      Module: c,
      makeModuleMap: b,
      configure: function (e) {
        e.baseUrl && e.baseUrl.charAt(e.baseUrl.length - 1) !== "/" && (e.baseUrl += "/");
        var r = t.pkgs,
          i = t.shim,
          s = t.paths,
          o = t.map;
        mixin(t, e, !0), t.paths = mixin(s, e.paths, !0), e.map && (t.map = mixin(o || {}, e.map, !0, !0)), e.shim && (eachProp(e.shim, function (e, t) {
          isArray(e) && (e = {
            deps: e
          }), e.exports && !e.exports.__buildReady && (e.exports = h.makeShimExports(e.exports)), i[t] = e
        }), t.shim = i), e.packages && (each(e.packages, function (e) {
          var t;
          e = typeof e == "string" ? {
            name: e
          } : e, t = e.location, r[e.name] = {
            name: e.name,
            location: t || e.name,
            main: (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
          }
        }), t.pkgs = r), eachProp(n, function (e, t) {
          e.map = b(t)
        }), (e.deps || e.callback) && h.require(e.deps || [], e.callback)
      },
      makeShimExports: function (e) {
        var t;
        return typeof e == "string" ? (t = function () {
          return getGlobal(e)
        }, t.exports = e, t) : function () {
          return e.apply(global, arguments)
        }
      },
      requireDefined: function (e, t) {
        return hasProp(s, b(e, t, !1, !0).id)
      },
      requireSpecified: function (e, t) {
        return e = b(e, t, !1, !0).id, hasProp(s, e) || hasProp(n, e)
      },
      require: function (t, n, r, o) {
        var u, a, f, l, c;
        if (typeof t == "string") {
          return isFunction(n) ? S(makeError("requireargs", "Invalid require call"), r) : req.get ? req.get(h, t, n) : (u = t, o = n, f = b(u, o, !1, !0), a = f.id, hasProp(s, a) ? s[a] : S(makeError("notloaded", 'Module name "' + a + '" has not been loaded yet for context: ' + e)))
        }
        r && !isFunction(r) && (o = r, r = undefined), n && !isFunction(n) && (o = n, n = undefined), x();
        while (i.length) {
          c = i.shift();
          if (c[0] === null) {
            return S(makeError("mismatch", "Mismatched anonymous define() module: " + c[c.length - 1]))
          }
          O(c)
        }
        return l = w(b(null, o)), l.init(t, n, r, {
          enabled: !0
        }), A(), h.require
      },
      undef: function (e) {
        var t = b(e, null, !0),
          i = n[e];
        delete s[e], delete o[t.url], delete r[e], i && (i.events.defined && (r[e] = i.events), N(e))
      },
      enable: function (e, t) {
        var r = n[e.id];
        r && w(e).enable()
      },
      completeLoad: function (e) {
        var r = t.shim[e] || {},
          o = r.exports && r.exports.exports,
          u, a, f;
        x();
        while (i.length) {
          a = i.shift();
          if (a[0] === null) {
            a[0] = e;
            if (u) {
              break
            }
            u = !0
          } else {
            a[0] === e && (u = !0)
          }
          O(a)
        }
        f = n[e];
        if (!u && !s[e] && f && !f.inited) {
          if (t.enforceDefine && (!o || !getGlobal(o))) {
            if (y(e)) {
              return
            }
            return S(makeError("nodefine", "No define call for " + e, null, [e]))
          }
          O([e, r.deps || [], r.exports])
        }
        A()
      },
      toUrl: function (e, t) {
        var n = e.lastIndexOf("."),
          r = null;
        return n !== -1 && (r = e.substring(n, e.length), e = e.substring(0, n)), h.nameToUrl(m(e, t && t.id, !0), r)
      },
      nameToUrl: function (e, n) {
        var r, i, s, o, u, a, f, l, c;
        if (req.jsExtRegExp.test(e)) {
          l = e + (n || "")
        } else {
          r = t.paths, i = t.pkgs, u = e.split("/");
          for (a = u.length; a > 0; a -= 1) {
            f = u.slice(0, a).join("/"), s = i[f], c = r[f];
            if (c) {
              isArray(c) && (c = c[0]), u.splice(0, a, c);
              break
            }
            if (s) {
              e === s.name ? o = s.location + "/" + s.main : o = s.location, u.splice(0, a, o);
              break
            }
          }
          l = u.join("/") + (n || ".js"), l = (l.charAt(0) === "/" || l.match(/^[\w\+\.\-]+:/) ? "" : t.baseUrl) + l
        }
        return t.urlArgs ? l + ((l.indexOf("?") === -1 ? "?" : "&") + t.urlArgs) : l
      },
      load: function (e, t) {
        req.load(h, e, t)
      },
      execCb: function (e, t, n, r) {
        return t.apply(r, n)
      },
      onScriptLoad: function (e) {
        if (e.type === "load" || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
          interactiveScript = null;
          var t = _(e);
          h.completeLoad(t.id)
        }
      },
      onScriptError: function (e) {
        var t = _(e);
        if (!y(t.id)) {
          return S(makeError("scripterror", "Script error", e, [t.id]))
        }
      }
    }
  }

  function getInteractiveScript() {
    return interactiveScript && interactiveScript.readyState === "interactive" ? interactiveScript : (eachReverse(scripts(), function (e) {
      if (e.readyState === "interactive") {
        return interactiveScript = e
      }
    }), interactiveScript)
  }
  var version = "2.0.4",
    commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
    cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
    jsSuffixRegExp = /\.js$/,
    currDirRegExp = /^\.\//,
    ostring = Object.prototype.toString,
    ap = Array.prototype,
    aps = ap.slice,
    apsp = ap.splice,
    isBrowser = typeof window != "undefined" && !!navigator && !!document,
    isWebWorker = !isBrowser && typeof importScripts != "undefined",
    readyRegExp = isBrowser && navigator.platform === "PLAYSTATION 3" ? /^complete$/ : /^(complete|loaded)$/,
    defContextName = "_",
    isOpera = typeof opera != "undefined" && opera.toString() === "[object Opera]",
    contexts = {},
    cfg = {},
    globalDefQueue = [],
    useInteractive = !1,
    req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath;
  if (typeof define != "undefined") {
    return
  }
  if (typeof requirejs != "undefined") {
    if (isFunction(requirejs)) {
      return
    }
    cfg = requirejs, requirejs = undefined
  }
  typeof require != "undefined" && !isFunction(require) && (cfg = require, require = undefined), req = requirejs = function (e, t, n, r) {
    var i = defContextName,
      s, o;
    return !isArray(e) && typeof e != "string" && (o = e, isArray(t) ? (e = t, t = n, n = r) : e = []), o && o.context && (i = o.context), s = contexts[i], s || (s = contexts[i] = req.s.newContext(i)), o && s.configure(o), s.require(e, t, n)
  }, req.config = function (e) {
    return req(e)
  }, require || (require = req), req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, req.isBrowser = isBrowser, s = req.s = {
    contexts: contexts,
    newContext: newContext
  }, req({}), addRequireMethods(req), isBrowser && (head = s.head = document.getElementsByTagName("head")[0], baseElement = document.getElementsByTagName("base")[0], baseElement && (head = s.head = baseElement.parentNode)), req.onError = function (e) {
    throw e
  }, req.load = function (e, t, n) {
    var r = e && e.config || {},
      i;
    if (isBrowser) {
      return i = r.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script"), i.type = r.scriptType || "text/javascript", i.charset = "utf-8", i.async = !0, i.setAttribute("data-requirecontext", e.contextName), i.setAttribute("data-requiremodule", t), i.attachEvent && !(i.attachEvent.toString && i.attachEvent.toString().indexOf("[native code") < 0) && !isOpera ? (useInteractive = !0, i.attachEvent("onreadystatechange", e.onScriptLoad)) : (i.addEventListener("load", e.onScriptLoad, !1), i.addEventListener("error", e.onScriptError, !1)), i.src = n, currentlyAddingScript = i, baseElement ? head.insertBefore(i, baseElement) : head.appendChild(i), currentlyAddingScript = null, i
    }
isWebWorker && (importScripts(n), e.completeLoad(t))
}, isBrowser && eachReverse(scripts(), function (e) {
  head || (head = e.parentNode), dataMain = e.getAttribute("data-main");
  if (dataMain) {
    return cfg.baseUrl || (src = dataMain.split("/"), mainScript = src.pop(), subPath = src.length ? src.join("/") + "/" : "./", cfg.baseUrl = subPath, dataMain = mainScript), dataMain = dataMain.replace(jsSuffixRegExp, ""), cfg.deps = cfg.deps ? cfg.deps.concat(dataMain) : [dataMain], !0
  }
}), define = function (e, t, n) {
  var r, i;
  typeof e != "string" && (n = t, t = e, e = null), isArray(t) || (n = t, t = []), !t.length && isFunction(n) && n.length && (n.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function (e, n) {
    t.push(n)
  }), t = (n.length === 1 ? ["require"] : ["require", "exports", "module"]).concat(t)), useInteractive && (r = currentlyAddingScript || getInteractiveScript(), r && (e || (e = r.getAttribute("data-requiremodule")), i = contexts[r.getAttribute("data-requirecontext")])), (i ? i.defQueue : globalDefQueue).push([e, t, n])
}, define.amd = {
  jQuery: !0
}, req.exec = function (text) {
  return eval(text)
}, req(cfg)
})(this), define("../lib/require", function () {}),
  function (g) {
    function f(i) {
      var a = document.createEvent("CustomEvent");
      a.initCustomEvent("fullscreenchange", !0, !1, null), document.dispatchEvent(a)
    }

    function l(i) {
      var a = document.createEvent("CustomEvent");
      a.initCustomEvent("fullscreenerror", !0, !1, null), document.dispatchEvent(a)
    }

    function j(i) {
      var a = document.createEvent("CustomEvent");
      a.initCustomEvent("pointerlockchange", !0, !1, null), document.dispatchEvent(a)
    }

    function h(i) {
      var a = document.createEvent("CustomEvent");
      a.initCustomEvent("pointerlockerror", !0, !1, null), document.dispatchEvent(a)
    }
    var k = (g.HTMLElement || g.Element).prototype,
      d, b = g.GameShim = {
        supports: {
          fullscreen: !0,
          pointerLock: !0,
          gamepad: !0,
          highResTimer: !0
        }
      };
    (function () {
      var m = 0,
        a = ["webkit", "moz", "ms", "o"],
        i;
      for (i = 0; i < a.length && !window.requestAnimationFrame; ++i) {
        window.requestAnimationFrame = window[a[i] + "RequestAnimationFrame"]
      }
      window.cancelAnimationFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
      for (i = 0; i < a.length && !window.cancelAnimationFrame; ++i) {
        window.cancelAnimationFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"]
      }
      window.requestAnimationFrame || (window.requestAnimationFrame = function (o, u) {
        var q = Date.now(),
          e = Math.max(0, 16 - (q - m)),
          p = window.setTimeout(function () {
            o(q + e)
          }, e);
        return m = q + e, p
      }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (n) {
        clearTimeout(n)
      }), window.animationStartTime || (d = function () {
        for (i = 0; i < a.length; ++i) {
          if (window[a[i] + "AnimationStartTime"]) {
            return function () {
              return window[a[i] + "AnimationStartTime"]
            }
          }
        }
        return function () {
          return Date.now()
        }
      }(), Object.defineProperty(window, "animationStartTime", {
        enumerable: !0,
        configurable: !1,
        writeable: !1,
        get: d
      }))
    })(), document.hasOwnProperty("fullscreenEnabled") || (d = function () {
      return "webkitIsFullScreen" in document ? function () {
        return webkitRequestFullScreen in document
      } : "mozFullScreenEnabled" in document ? function () {
        return document.mozFullScreenEnabled
      } : (b.supports.fullscreen = !1, function () {
        return !1
      })
    }(), Object.defineProperty(document, "fullscreenEnabled", {
      enumerable: !0,
      configurable: !1,
      writeable: !1,
      get: d
    })), document.hasOwnProperty("fullscreenElement") || (d = function () {
      var i = 0,
        a = ["webkitCurrentFullScreenElement", "webkitFullscreenElement", "mozFullScreenElement"];
      for (; i < a.length; i++) {
        if (a[i] in document) {
          return function () {
            return document[a[i]]
          }
        }
      }
      return function () {
        return null
      }
    }(), Object.defineProperty(document, "fullscreenElement", {
      enumerable: !0,
      configurable: !1,
      writeable: !1,
      get: d
    })), document.addEventListener("webkitfullscreenchange", f, !1), document.addEventListener("mozfullscreenchange", f, !1), document.addEventListener("webkitfullscreenerror", l, !1), document.addEventListener("mozfullscreenerror", l, !1), k.requestFullscreen || (k.requestFullscreen = function () {
      return k.webkitRequestFullScreen ? function () {
        this.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      } : k.mozRequestFullScreen ? function () {
        this.mozRequestFullScreen()
      } : function () {}
    }()), document.exitFullscreen || (document.exitFullscreen = function () {
      return document.webkitExitFullscreen || document.mozCancelFullScreen || function () {}
    }());
    var c = g.MouseEvent.prototype;
"movementX" in c || Object.defineProperty(c, "movementX", {
  enumerable: !0,
  configurable: !1,
  writeable: !1,
  get: function () {
    return this.webkitMovementX || this.mozMovementX || 0
  }
}), "movementY" in c || Object.defineProperty(c, "movementY", {
  enumerable: !0,
  configurable: !1,
  writeable: !1,
  get: function () {
    return this.webkitMovementY || this.mozMovementY || 0
  }
}), navigator.pointer || (navigator.pointer = navigator.webkitPointer || navigator.mozPointer), document.addEventListener("webkitpointerlockchange", j, !1), document.addEventListener("webkitpointerlocklost", j, !1), document.addEventListener("mozpointerlockchange", j, !1), document.addEventListener("mozpointerlocklost", j, !1), document.addEventListener("webkitpointerlockerror", h, !1), document.addEventListener("mozpointerlockerror", h, !1), document.hasOwnProperty("pointerLockElement") || (d = function () {
return "webkitPointerLockElement" in document ? function () {
  return document.webkitPointerLockElement
} : "mozPointerLockElement" in document ? function () {
  return document.mozPointerLockElement
} : function () {
  return null
}
}(), Object.defineProperty(document, "pointerLockElement", {
  enumerable: !0,
  configurable: !1,
  writeable: !1,
  get: d
})), k.requestPointerLock || (k.requestPointerLock = function () {
  return k.webkitRequestPointerLock ? function () {
    this.webkitRequestPointerLock()
  } : k.mozRequestPointerLock ? function () {
    this.mozRequestPointerLock()
  } : navigator.pointer ? function () {
    var a = this;
    navigator.pointer.lock(a, j, h)
  } : (b.supports.pointerLock = !1, function () {})
}()), document.exitPointerLock || (document.exitPointerLock = function () {
  return document.webkitExitPointerLock || document.mozExitPointerLock || function () {
    if (navigator.pointer) {
      var a = this;
      navigator.pointer.unlock()
    }
  }
}()), navigator.gamepads || (d = function () {
  if ("webkitGamepads" in navigator) {
    return function () {
      return navigator.webkitGamepads
    }
  }
  if ("mozGamepads" in navigator) {
    return function () {
      return navigator.mozGamepads
    }
  }
  b.supports.gamepad = !1;
  var a = [];
  return function () {
    return a
  }
}(), Object.defineProperty(navigator, "gamepads", {
  enumerable: !0,
  configurable: !1,
  writeable: !1,
  get: d
})), window.performance || (window.performance = {}), window.performance.timing || (window.performance.timing = {
  navigationStart: Date.now()
}), window.performance.now || (window.performance.now = function () {
  return window.performance.webkitNow ? window.performance.webkitNow : (b.supports.highResTimer = !1, function () {
    return Date.now() - window.performance.timing.navigationStart
  })
}())
}(typeof exports != "undefined" ? global : window), define("game-shim", function () {}), define("text", ["module"], function (x) {
  var C, k, b, q, D, j = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
    B = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
    A = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
    w = typeof location != "undefined" && location.href,
    m = w && location.protocol && location.protocol.replace(/\:/, ""),
    z = w && location.hostname,
    v = w && (location.port || undefined),
    g = {},
    y = x.config && x.config() || {};
  C = {
    version: "2.0.14",
    strip: function (c) {
      if (c) {
        c = c.replace(B, "");
        var a = c.match(A);
        a && (c = a[1])
      } else {
        c = ""
      }
      return c
    },
    jsEscape: function (a) {
      return a.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
    },
    createXhr: y.createXhr || function () {
      var d, a, f;
      if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest
      }
      if (typeof ActiveXObject != "undefined") {
        for (a = 0; a < 3; a += 1) {
          f = j[a];
          try {
            d = new ActiveXObject(f)
          } catch (c) {}
          if (d) {
            j = [f];
            break
          }
        }
      }
      return d
    },
    parseName: function (h) {
      var c, p, f, a = !1,
        d = h.lastIndexOf("."),
        l = h.indexOf("./") === 0 || h.indexOf("../") === 0;
      return d !== -1 && (!l || d > 1) ? (c = h.substring(0, d), p = h.substring(d + 1)) : c = h, f = p || c, d = f.indexOf("!"), d !== -1 && (a = f.substring(d + 1) === "strip", f = f.substring(0, d), p ? p = f : c = f), {
        moduleName: c,
        ext: p,
        strip: a
      }
    },
    xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
    useXhr: function (p, E, l, f) {
      var h, t, d, c = C.xdRegExp.exec(p);
      return c ? (h = c[2], t = c[3], t = t.split(":"), d = t[1], t = t[0], (!h || h === E) && (!t || t.toLowerCase() === l.toLowerCase()) && (!d && !t || d === f)) : !0
    },
    finishLoad: function (d, f, c, a) {
      c = f ? C.strip(c) : c, y.isBuild && (g[d] = c), a(c)
    },
    load: function (p, E, l, f) {
      if (f && f.isBuild && !f.inlineText) {
        l();
        return
      }
      y.isBuild = f && f.isBuild;
      var h = C.parseName(p),
        t = h.moduleName + (h.ext ? "." + h.ext : ""),
        d = E.toUrl(t),
        c = y.useXhr || C.useXhr;
      if (d.indexOf("empty:") === 0) {
        l();
        return
      }!w || c(d, m, z, v) ? C.get(d, function (a) {
        C.finishLoad(p, h.strip, a, l)
      }, function (a) {
        l.error && l.error(a)
      }) : E([t], function (a) {
        C.finishLoad(h.moduleName + "." + h.ext, h.strip, a, l)
      })
    },
    write: function (f, h, d, a) {
      if (g.hasOwnProperty(h)) {
        var c = C.jsEscape(g[h]);
        d.asModule(f + "!" + h, "define(function () { return '" + c + "';});\n")
      }
    },
    writeFile: function (t, h, c, l, G) {
      var d = C.parseName(h),
        F = d.ext ? "." + d.ext : "",
        E = d.moduleName + F,
        p = c.toUrl(d.moduleName + F) + ".js";
      C.load(E, c, function (e) {
        var a = function (f) {
          return l(p, f)
        };
        a.asModule = function (i, f) {
          return l.asModule(i, p, f)
        }, C.write(t, E, a, G)
      }, G)
    }
  };
  if (y.env === "node" || !y.env && typeof process != "undefined" && process.versions && !!process.versions.node && !process.versions["node-webkit"] && !process.versions["atom-shell"]) {
    k = require.nodeRequire("fs"), C.get = function (h, c, f) {
      try {
        var a = k.readFileSync(h, "utf8");
        a[0] === "" && (a = a.substring(1)), c(a)
      } catch (d) {
        f && f(d)
      }
    }
  } else {
    if (y.env === "xhr" || !y.env && C.createXhr()) {
      C.get = function (f, l, d, a) {
        var c = C.createXhr(),
          h;
        c.open("GET", f, !0);
        if (a) {
          for (h in a) {
            a.hasOwnProperty(h) && c.setRequestHeader(h.toLowerCase(), a[h])
          }
        }
        y.onXhr && y.onXhr(c, f), c.onreadystatechange = function (n) {
          var e, p;
          c.readyState === 4 && (e = c.status || 0, e > 399 && e < 600 ? (p = new Error(f + " HTTP status: " + e), p.xhr = c, d && d(p)) : l(c.responseText), y.onXhrComplete && y.onXhrComplete(c, f))
        }, c.send(null)
      }
    } else {
      if (y.env === "rhino" || !y.env && typeof Packages != "undefined" && typeof java != "undefined") {
        C.get = function (l, F) {
          var f, c, h = "utf-8",
            G = new java.io.File(l),
            d = java.lang.System.getProperty("line.separator"),
            E = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(G), h)),
            p = "";
          try {
            f = new java.lang.StringBuffer, c = E.readLine(), c && c.length() && c.charAt(0) === 65279 && (c = c.substring(1)), c !== null && f.append(c);
            while ((c = E.readLine()) !== null) {
              f.append(d), f.append(c)
            }
            p = String(f.toString())
          } finally {
            E.close()
          }
          F(p)
        }
      } else {
        if (y.env === "xpconnect" || !y.env && typeof Components != "undefined" && Components.classes && Components.interfaces) {
          b = Components.classes, q = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), D = "@mozilla.org/windows-registry-key;1" in b, C.get = function (l, h) {
            var r, p, d, c = {};
            D && (l = l.replace(/\//g, "\\")), d = new FileUtils.File(l);
            try {
              r = b["@mozilla.org/network/file-input-stream;1"].createInstance(q.nsIFileInputStream), r.init(d, 1, 0, !1), p = b["@mozilla.org/intl/converter-input-stream;1"].createInstance(q.nsIConverterInputStream), p.init(r, "utf-8", r.available(), q.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), p.readString(r.available(), c), p.close(), r.close(), h(c.value)
            } catch (i) {
              throw new Error((d && d.path || "") + ": " + i)
            }
          }
        }
      }
    }
  }
  return C
}), define("text!shaders/advect.frag", [], function () {
  return "precision highp float;\nuniform sampler2D source;\nuniform sampler2D velocity;\nuniform float dt;\nuniform float scale;\nuniform vec2 px1;\nvarying vec2 uv;\nuniform float tension;\n\nvoid main(){\n    gl_FragColor = texture2D(source, uv-texture2D(velocity, uv).xy*dt*px1)*scale*tension;\n}\n"
}), define("text!shaders/addForce.frag", [], function () {
  return "precision highp float;\n\nuniform vec2 force;\nuniform vec2 center;\nuniform vec2 scale;\nuniform vec2 px;\nvarying vec2 uv;\n\nvoid main(){\n    float distance_ = 1.0-min(length((uv-center)/scale), 1.0);\n    gl_FragColor = vec4(force*distance_, 0, 1);\n}\n"
}), define("text!shaders/divergence.frag", [], function () {
  return "precision highp float;\nuniform sampler2D velocity;\nuniform float dt;\nuniform vec2 px;\nvarying vec2 uv;\nuniform float divergenceMagnifier;\n\nvoid main(){\n    float x0 = texture2D(velocity, uv-vec2(px.x, 0)).x;\n    float x1 = texture2D(velocity, uv+vec2(px.x, 0)).x;\n    float y0 = texture2D(velocity, uv-vec2(0, px.y)).y;\n    float y1 = texture2D(velocity, uv+vec2(0, px.y)).y;\n    float divergence = (x1-x0 + y1-y0)*divergenceMagnifier;\n    gl_FragColor = vec4(divergence);\n}\n"
}), define("text!shaders/jacobi.frag", [], function () {
  return "precision highp float;\nuniform sampler2D pressure;\nuniform sampler2D divergence;\nuniform float alpha;\nuniform float beta;\nuniform vec2 px;\nvarying vec2 uv;\n\nvoid main(){\n    float x0 = texture2D(pressure, uv-vec2(px.x, 0)).r;\n    float x1 = texture2D(pressure, uv+vec2(px.x, 0)).r;\n    float y0 = texture2D(pressure, uv-vec2(0, px.y)).r;\n    float y1 = texture2D(pressure, uv+vec2(0, px.y)).r;\n    float d = texture2D(divergence, uv).r;\n    float relaxed = (x0 + x1 + y0 + y1 + alpha * d) * beta;\n    gl_FragColor = vec4(relaxed);\n}\n"
}), define("text!shaders/subtractPressureGradient.frag", [], function () {
  return "precision highp float;\nuniform sampler2D pressure;\nuniform sampler2D velocity;\nuniform float alpha;\nuniform float beta;\nuniform float scale;\nuniform vec2 px;\nvarying vec2 uv;\n\nvoid main(){\n    float x0 = texture2D(pressure, uv-vec2(px.x, 0)).r;\n    float x1 = texture2D(pressure, uv+vec2(px.x, 0)).r;\n    float y0 = texture2D(pressure, uv-vec2(0, px.y)).r;\n    float y1 = texture2D(pressure, uv+vec2(0, px.y)).r;\n    vec2 v = texture2D(velocity, uv).xy;\n    gl_FragColor = vec4((v-(vec2(x1, y1)-vec2(x0, y0))*0.5)*scale, 1.0, 1.0);\n}\n"
}), define("text!shaders/visualizeBlack.frag", [], function () {
  var a = "";
  a += "precision lowp float;\n";
  a += "uniform sampler2D velocity;\n";
  a += "uniform float brightness;\n";
  a += "uniform float cursor_intensity;\n";
  a += "\n";
  a += "\n";
  a += "varying vec2 uv;\n";
  a += "\n";
  a += "void main(){\n";
  a += "	lowp float temp = (texture2D(velocity, uv)*cursor_intensity+brightness).x;\n";
  a += "	gl_FragColor = vec4(\n temp,\n temp,\n temp,\n .5);\n";
  a += "}\n";
  return a
}), define("text!shaders/visualize.frag", [], function () {
  var a = "";
  a += "precision lowp float;\n";
  a += "uniform sampler2D velocity;\n";
  a += "uniform float brightness;\n";
  a += "uniform float cursor_intensity;\n";
  a += "\n";
  a += "\n";
  a += "varying vec2 uv;\n";
  a += "\n";
  a += "void main(){\n";
  a += "	lowp float temp = (texture2D(velocity, uv)*cursor_intensity+brightness).x;\n";
  a += "	lowp float temp1 = (texture2D(velocity, uv)*cursor_intensity+brightness).x;\n";
  a += "	lowp float temp2 = (texture2D(velocity, uv)*cursor_intensity+brightness).x*0.952;\n";
  a += "	lowp float temp3 = (texture2D(velocity, uv)*cursor_intensity+brightness).x*0.736;\n";
  a += "	gl_FragColor = vec4(\n temp1,\n temp2,\n temp3,\n .5);\n";
  a += "}\n";
  return a
}), define("text!shaders/cursor.vertex", [], function () {
  return "precision highp float;\n\nattribute vec3 position;\nuniform vec2 center;\nuniform vec2 px;\nvarying vec2 uv;\n\n\nvoid main(){\n    uv = clamp(position.xy+center, vec2(-1.0+px*2.0), vec2(1.0-px*2.0));\n    gl_Position = vec4(uv, 0.0, 1.0);\n}\n"
}), define("text!shaders/boundary.vertex", [], function () {
  return "attribute vec3 position;\nattribute vec3 offset;\nvarying vec2 uv;\n\n//precision highp float;\n\nvoid main(){\n    uv = offset.xy*0.5+0.5;\n    gl_Position = vec4(position, 1.0);\n}\n"
}), define("text!shaders/kernel.vertex", [], function () {
  return "precision highp float;\nattribute vec3 position;\nuniform vec2 px;\nvarying vec2 uv;\n\n\n\nvoid main(){\n    uv = vec2(0.5)+(position.xy)*0.5;\n    gl_Position = vec4(position, 1.0);\n}\n"
}), define("engine/fragments", ["text!shaders/advect.frag", "text!shaders/addForce.frag", "text!shaders/divergence.frag", "text!shaders/jacobi.frag", "text!shaders/subtractPressureGradient.frag", "text!shaders/visualize.frag", "text!shaders/cursor.vertex", "text!shaders/boundary.vertex", "text!shaders/kernel.vertex", "text!shaders/visualizeBlack.frag",], function (g, k, d, b, f, l, c, j, h, t) {
  return {
    resources: {
"shaders/addForce.frag": k,
"shaders/advect.frag": g,
"shaders/boundary.vertex": j,
"shaders/cursor.vertex": c,
"shaders/divergence.frag": d,
"shaders/jacobi.frag": b,
"shaders/kernel.vertex": h,
"shaders/subtractPressureGradient.frag": f,
"shaders/visualize.frag": t,
"shaders/visualizeBlack.frag": l
    }
  }
}), define("engine/clock", ["require", "exports", "module"], function (d, b, f) {
  var c = b,
    a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
  c.Clock = function () {
    this.running = !1, this.interval = null, this.t0 = this.now(), this.t = 0, this.maxdt = 0.25
  }, c.Clock.prototype = {
    tick: function () {
      var h = this.now(),
        g = (h - this.t0) / 1000;
      this.t0 = h, this.t += g, g < this.maxdt && g > 0 && this.ontick(g)
    },
    start: function (h) {
      this.running = !0;
      var g = this,
        i;
      a ? a(i = function () {
        g.tick(), g.running && a(i, h)
      }, h) : this.interval = window.setInterval(function () {
        g.tick()
      }, 1), this.t0 = this.now()
    },
    stop: function () {
      this.interval && (window.clearInterval(this.interval), this.interval = null), this.running = !1
    },
    now: function () {
      return window.performance.now()
    },
    ontick: function (g) {}
  }, c.fixedstep = function (k, h, l) {
    var j = 0,
      g = 0;
    return function (e) {
      j += e;
      while (j >= k) {
        h(k, g), j -= k, e -= k, g += k
      }
      l(e, g)
    }
  }
}), define("engine/utils", ["require", "exports", "module"], function (c, a, d) {
  var b = a;
  b.extend = function () {
    var f = arguments[0],
      k, h, e, g, j;
    for (k = 1; k < arguments.length; k++) {
      h = arguments[k];
      for (e in h) {
        f[e] = h[e]
      }
    }
    return f
  }, b.debounce = function (k, g) {
    function h() {
      k.apply(f, l)
    }
    var l, j, f;
    return function () {
      f = this, l = arguments, clearTimeout(j), j = setTimeout(h, g)
    }
  }, b.clamp = function (e, g, f) {
    return e < g ? g : e > f ? f : e
  }, b.getHashValue = function (g, f) {
    var h = window.location.hash.match("[#,]+" + g + "(=([^,]*))?");
    return h ? h.length == 3 && h[2] != null ? h[2] : !0 : f
  }
}), define("engine/input", ["require", "exports", "module", "engine/utils"], function (f, b, g) {
  var d = b,
    a = f("engine/utils").clamp,
    c = {
      32: "SPACE",
      13: "ENTER",
      9: "TAB",
      8: "BACKSPACE",
      16: "SHIFT",
      17: "CTRL",
      18: "ALT",
      20: "CAPS_LOCK",
      144: "NUM_LOCK",
      145: "SCROLL_LOCK",
      37: "LEFT",
      38: "UP",
      39: "RIGHT",
      40: "DOWN",
      33: "PAGE_UP",
      34: "PAGE_DOWN",
      36: "HOME",
      35: "END",
      45: "INSERT",
      46: "DELETE",
      27: "ESCAPE",
      19: "PAUSE"
    };
  d.Handler = function (e) {
    this.bind(e), this.reset()
  }, d.Handler.prototype = {
    offset: {
      x: 0,
      y: 0
    },
    onClick: null,
    onKeyUp: null,
    onKeyDown: null,
    hasFocus: !0,
    bind: function (i) {
      var h = this;
      this.element = i, this.updateOffset(), document.addEventListener("keydown", function (j) {
        !h.keyDown(j.keyCode)
      }), document.addEventListener("keyup", function (j) {
        !h.keyUp(j.keyCode)
      }), window.addEventListener("click", function (e) {
        e.target != i ? h.blur() : h.focus()
      }), window.addEventListener("blur", function (j) {
        h.blur()
      }), document.addEventListener("mousemove", function (j) {
        h.mouseMove(j.clientX, j.clientY)
      }), document.addEventListener("touchmove", function (j) {
        if (j.targetTouches.length == 1) {
          j = j.targetTouches[0];
          h.touchMove(j.clientX, j.clientY);
          // document.querySelector('#fluid_wrapper').innerHTML = j.clientY;
        }
      }), i.addEventListener("mousedown", function (j) {
        h.mouseDown()
      }), i.addEventListener("mouseup", function (j) {
        h.mouseUp()
      }), document.addEventListener("selectstart", function (j) {})
    },
    updateOffset: function () {
      var h = this.element.getBoundingClientRect();
      this.offset = {
        x: h.left,
        y: h.top
      }
    },
    blur: function () {
      this.hasFocus = !1, this.reset()
    },
    focus: function () {
      this.hasFocus || (this.hasFocus = !0, this.reset())
    },
    reset: function () {
      this.keys = {};
      for (var h = 65; h < 128; h++) {
        this.keys[String.fromCharCode(h)] = !1
      }
      for (h in c) {
        c.hasOwnProperty(h) && (this.keys[c[h]] = !1)
      }
      this.mouse = {
        down: !1,
        x: 0,
        y: 0
      }
    },
    keyDown: function (i) {
      var h = this._getKeyName(i),
        j = this.keys[h];
      return this.keys[h] = !0, this.onKeyDown && !j && this.onKeyDown(h), this.hasFocus
    },
    keyUp: function (i) {
      var h = this._getKeyName(i);
      return this.keys[h] = !1, this.onKeyUp && this.onKeyUp(h), this.hasFocus
    },
    mouseDown: function () {
      this.mouse.down = !0
    },
    mouseUp: function () {
      this.mouse.down = !1, this.hasFocus && this.onClick && this.onClick(this.mouse.x, this.mouse.y)
    },
    mouseMove: function (i, h) {
      this.mouse.x = a(i - this.offset.x, 0, window.outerWidth);
      this.mouse.y = a(h - this.offset.y, 0, window.outerHeight);
      // document.querySelector('#fluid_wrapper').innerHTML = this.mouse.x + '' + this.mouse.y;
      // console.log(this);
      // document.querySelector('#fluid_wrapper').innerHTML = JSON.stringify(this);
    },
    touchMove: function (i, h) {
      this.mouse.x = a(i - this.offset.x, 0, window.outerWidth);
      this.mouse.y = a(h - this.offset.y, 0, window.outerHeight);
      // this.mouse.x = 100;
      // this.mouse.y = 100;
      // document.querySelector('#fluid_wrapper').innerHTML = this.mouse.x + '' + this.mouse.y;
      // console.log(this);
      // document.querySelector('#fluid_wrapper').innerHTML = JSON.stringify(this);
    },
    _getKeyName: function (h) {
      return h in c ? c[h] : String.fromCharCode(h)
    }
  }
}), define("engine/gl/shader", ["require", "exports", "module"], function (d, b, f) {
  function c(h) {
    var g = [];
    for (var i in h) {
      g.push(i)
    }
    return g
  }

  function a(h, g, i) {
    this.gl = h, this.program = this.makeProgram(g, i), this.uniformLocations = {}, this.uniformValues = {}, this.uniformNames = [], this.attributeLocations = {}
  }
  a.prototype = {
    use: function () {
      this.gl.useProgram(this.program)
    },
    prepareUniforms: function (h) {
      this.uniformNames = c(h);
      for (var g = 0; g < this.uniformNames.length; g++) {
        var i = this.uniformNames[g];
        this.uniformLocations[i] = this.gl.getUniformLocation(this.program, i)
      }
    },
    uniforms: function (m) {
      this.uniformNames.length === 0 && this.prepareUniforms(m);
      for (var j = 0; j < this.uniformNames.length; j++) {
        var q = this.uniformNames[j],
          l = this.uniformLocations[q],
          h = m[q];
        if (l === null) {
          continue
        }
        if (h.uniform) {
          h.equals(this.uniformValues[q]) || (h.uniform(l), h.set(this.uniformValues, q))
        } else {
          if (h.length) {
            var k = this.uniformValues[q];
            if (k !== undefined) {
              for (var p = 0, g = h.length; p < g; p++) {
                if (h[p] != k[p]) {
                  break
                }
              }
              if (p != g) {
                for (p = 0, g = h.length; p < g; p++) {
                  k[p] = h[p]
                }
              }
            } else {
              this.uniformValues[q] = new Float32Array(h)
            }
            switch (h.length) {
              case 2:
                this.gl.uniform2fv(l, h);
                break;
              case 3:
                this.gl.uniform3fv(l, h);
                break;
              case 4:
                this.gl.uniform4fv(l, h);
                break;
              case 9:
                this.gl.uniformMatrix3fv(l, !1, h);
                break;
              case 16:
                this.gl.uniformMatrix4fv(l, !1, h)
            }
          } else {
            h != this.uniformValues[q] && (this.gl.uniform1f(l, h), this.uniformValues[q] = h)
          }
        }
      }
    },
    getUniformLocation: function (g) {
      return this.uniformLocations[g] === undefined && (this.uniformLocations[g] = this.gl.getUniformLocation(this.program, g)), this.uniformLocations[g]
    },
    getAttribLocation: function (h) {
      if (!(h in this.attributeLocations)) {
        var g = this.gl.getAttribLocation(this.program, h);
        if (g < 0) {
          throw "undefined attribute " + h
        }
        this.attributeLocations[h] = g
      }
      return this.attributeLocations[h]
    },
    makeShader: function (h, g) {
      var i = this.gl.createShader(h);
      this.gl.shaderSource(i, g), this.gl.compileShader(i);
      if (!this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS)) {
        throw console.log(this.gl.getShaderInfoLog(i), h, g), 'Compiler exception: "' + this.gl.getShaderInfoLog(i) + '"'
      }
      return i
    },
    makeProgram: function (k, h) {
      var l = this.makeShader(this.gl.VERTEX_SHADER, k),
        j = this.makeShader(this.gl.FRAGMENT_SHADER, h),
        g = this.gl.createProgram();
      this.gl.attachShader(g, l), this.gl.attachShader(g, j), this.gl.linkProgram(g);
      if (!this.gl.getProgramParameter(g, this.gl.LINK_STATUS)) {
        throw "Linker exception: " + this.gl.getProgramInfoLog(g)
      }
      return g
    }
  }, b.Shader = a, b.Manager = function (e, h, g) {
    this.gl = e, this.resources = h, this.shaders = [], g = g || {}, this.prefix = g.prefix || "shaders/"
  }, b.Manager.prototype = {
    includeExpression: /#include "([^"]+)"/g,
    preprocess: function (h, g) {
      return g.replace(this.includeExpression, function (j, i) {
        return this.getSource(i)
      }.bind(this))
    },
    getSource: function (h) {
      var g = this.resources[this.prefix + h];
      if (g == null) {
        throw "shader not found: " + h
      }
      return this.preprocess(h, g)
    },
    get: function (h, g) {
      g || (g = h), g += ".frag", h += ".vertex";
      var i = g + ";" + h;
      return i in this.shaders || (this.shaders[i] = new a(this.gl, this.getSource(h), this.getSource(g))), this.shaders[i]
    }
  }
}), define("engine/gl/geometry", ["require", "exports", "module"], function (b, a, c) {
  a.grid = function (j) {
    var f = new Float32Array(j * j * 6 * 3),
      k = 0,
      h = j * 0.5;
    for (var d = 0; d < j; d++) {
      for (var g = 0; g < j; g++) {
        f[k++] = g / j, f[k++] = 0, f[k++] = d / j, f[k++] = g / j, f[k++] = 0, f[k++] = (d + 1) / j, f[k++] = (g + 1) / j, f[k++] = 0, f[k++] = (d + 1) / j, f[k++] = g / j, f[k++] = 0, f[k++] = d / j, f[k++] = (g + 1) / j, f[k++] = 0, f[k++] = (d + 1) / j, f[k++] = (g + 1) / j, f[k++] = 0, f[k++] = d / j
      }
    }
    return f
  }, a.wireFrame = function (j) {
    var f = new Float32Array(j.length * 2),
      l = j.length / 9;
    for (var h = 0; h < l; h++) {
      for (var d = 0; d < 3; d++) {
        var g = (d + 1) % 3;
        for (var k = 0; k < 3; k++) {
          f[h * 18 + d * 3 + k] = j[h * 9 + d * 3 + k], f[h * 18 + d * 3 + 9 + k] = j[h * 9 + g * 3 + k]
        }
      }
    }
    return f
  }, a.screen_quad = function (d, e) {
    return d = d || 1, e = e || d, new Float32Array([-d, e, 0, -d, -e, 0, d, -e, 0, -d, e, 0, d, -e, 0, d, e, 0])
  }, a.cube = function (d) {
    return d = d || 1, new Float32Array([d, d, d, d, -d, d, -d, -d, d, d, d, d, -d, -d, d, -d, d, d, -d, d, -d, -d, -d, -d, d, d, -d, d, d, -d, -d, -d, -d, d, -d, -d, -d, d, d, -d, -d, -d, -d, d, -d, -d, d, d, -d, -d, d, -d, -d, -d, d, d, d, d, d, -d, d, -d, -d, d, d, d, d, -d, -d, d, -d, d, d, d, d, -d, d, d, -d, d, -d, d, d, -d, d, d, d, -d, d, -d, -d, -d, -d, -d, -d, d, d, -d, d, -d, -d, -d, d, -d, d, d, -d, -d])
  }
}), define("engine/gl/texture", ["require", "exports", "module", "../utils"], function (c, a, d) {
  var b = c("../utils").extend;
  a.Texture2D = function (e, g, f) {
    this.gl = e, this.texture = e.createTexture(), this.unit = -1, this.bound = !1, this.bindTexture(), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.NONE), e.texImage2D(e.TEXTURE_2D, 0, f.internalformat || f.format || e.RGBA, f.format || e.RGBA, f.type || e.UNSIGNED_BYTE, g), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, f.mag_filter || e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, f.min_filter || e.LINEAR_MIPMAP_LINEAR), e.texParameterf(e.TEXTURE_2D, e.TEXTURE_WRAP_S, f.wrap_s || e.REPEAT), e.texParameterf(e.TEXTURE_2D, e.TEXTURE_WRAP_T, f.wrap_t || e.REPEAT), f.mipmap !== !1 && e.generateMipmap(e.TEXTURE_2D)
  }, a.Texture2D.prototype = {
    bindTexture: function (f) {
      f !== undefined && (this.gl.activeTexture(this.gl.TEXTURE0 + f), this.unit = f), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture), this.bound = !0
    },
    unbindTexture: function () {
      this.gl.activeTexture(this.gl.TEXTURE0 + this.unit), this.gl.bindTexture(this.gl.TEXTURE_2D, null), this.unit = -1, this.bound = !1
    },
    uniform: function (f) {
      this.gl.uniform1i(f, this.unit)
    },
    equals: function (f) {
      return this.unit === f
    },
    set: function (g, f) {
      g[f] = this.unit
    }
  }, a.FBO = function (f, j, h, e, g) {
    this.width = j, this.height = h, this.gl = f, this.framebuffer = f.createFramebuffer(), f.bindFramebuffer(f.FRAMEBUFFER, this.framebuffer), this.texture = f.createTexture(), f.bindTexture(f.TEXTURE_2D, this.texture), f.texImage2D(f.TEXTURE_2D, 0, g || f.RGBA, j, h, 0, g || f.RGBA, e || f.UNSIGNED_BYTE, null), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, f.LINEAR), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, f.LINEAR), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.CLAMP_TO_EDGE), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.CLAMP_TO_EDGE), this.depth = f.createRenderbuffer(), f.bindRenderbuffer(f.RENDERBUFFER, this.depth), f.renderbufferStorage(f.RENDERBUFFER, f.DEPTH_COMPONENT16, j, h), f.framebufferTexture2D(f.FRAMEBUFFER, f.COLOR_ATTACHMENT0, f.TEXTURE_2D, this.texture, 0), f.framebufferRenderbuffer(f.FRAMEBUFFER, f.DEPTH_ATTACHMENT, f.RENDERBUFFER, this.depth), this.supported = f.checkFramebufferStatus(f.FRAMEBUFFER) === f.FRAMEBUFFER_COMPLETE, f.bindTexture(f.TEXTURE_2D, null), f.bindRenderbuffer(f.RENDERBUFFER, null), f.bindFramebuffer(f.FRAMEBUFFER, null), this.unit = -1
  }, a.FBO.prototype = b({}, a.Texture2D.prototype, {
    bind: function () {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    },
    unbind: function () {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    }
  })
}), define("engine/gl/mesh", ["require", "exports", "module"], function (d, b, f) {
  var c = function (h, g) {
    this.gl = h, this.ibo = g.ibo, this.vbo = g.vbo || new a(h, g.vertex), this.mode = g.mode || h.TRIANGLES;
    if (this.ibo) {
      switch (this.ibo.byteLength / this.ibo.length) {
        case 1:
          this.iboType = h.UNSIGNED_BYTE;
          break;
        case 2:
          this.iboType = h.UNSIGNED_SHORT;
          break;
        case 4:
          this.iboType = h.UNSIGNED_LONG;
          break;
        default:
          this.iboType = h.UNSIGNED_SHORT
      }
    } else {
      this.iboType = 0
    }
    this.setAttributes(g.attributes)
  };
  c.prototype = {
    setAttributes: function (l) {
      var h = Object.keys(l);
      this.attributes = [], this.vertexSize = 0;
      for (var m = 0; m < h.length; m++) {
        var k = h[m],
          g = l[k],
          j = {
            name: k,
            size: g.size || 3,
            type: g.type || this.gl.FLOAT,
            stride: g.stride || 0,
            offset: g.offset || 0,
            normalized: !!g.normalized
          };
        this.vertexSize += j.size, this.attributes.push(j)
      }
    },
    bindAttributes: function (i) {
      for (var g = 0; g < this.attributes.length; g++) {
        var j = this.attributes[g],
          h = i.getAttribLocation(j.name);
        this.gl.enableVertexAttribArray(h), this.gl.vertexAttribPointer(h, j.size, j.type, j.normalized, j.stride, j.offset)
      }
    },
    draw: function (g) {
      g.use(), this.vbo.bind(), this.bindAttributes(g), this.ibo ? (this.ibo.bind(), this.gl.drawElements(this.mode, this.ibo.length, this.iboType, 0)) : this.gl.drawArrays(this.mode, 0, this.vbo.length / this.vertexSize), this.vbo.unbind()
    }
  }, b.Mesh = c;
  var a = function (i, g, j, h) {
    this.gl = i, this.target = j || i.ARRAY_BUFFER, this.buffer = i.createBuffer(), this.bind(), i.bufferData(i.ARRAY_BUFFER, g, h || i.STATIC_DRAW), this.unbind(), this.length = g.length, this.btyeLength = g.byteLength
  };
  a.prototype = {
    bind: function () {
      this.gl.bindBuffer(this.target, this.buffer)
    },
    unbind: function () {
      this.gl.bindBuffer(this.target, null)
    },
    free: function (g) {
      this.gl.deleteBuffer(this.buffer), delete this.buffer
    }
  }, b.Buffer = a
}), WebGLDebugUtils = function () {
  function q(c) {
    if (b == null) {
      b = {};
      for (var a in c) {
        typeof c[a] == "number" && (b[c[a]] = a)
      }
    }
  }

  function D() {
    if (b == null) {
      throw "WebGLDebugUtils.init(ctx) not called"
    }
  }

  function j(a) {
    return D(), b[a] !== undefined
  }

  function B(c) {
    D();
    var a = b[c];
    return a !== undefined ? a : "*UNKNOWN WebGL ENUM (0x" + c.toString(16) + ")"
  }

  function A(f, c, d) {
    var a = k[f];
    return a !== undefined && a[c] ? B(d) : d === null ? "null" : d === undefined ? "undefined" : d.toString()
  }

  function w(d, a) {
    var f = "";
    for (var c = 0; c < a.length; ++c) {
      f += (c == 0 ? "" : ", ") + A(d, c, a[c])
    }
    return f
  }

  function m(c, a, d) {
    c.__defineGetter__(d, function () {
      return a[d]
    }), c.__defineSetter__(d, function (f) {
      a[d] = f
    })
  }

  function z(c, a) {
    var d = c[a];
    return function () {
      var e = d.apply(c, arguments);
      return e
    }
  }

  function v(i, t, d) {
    function l(f, c) {
      return function () {
        d && d(c, arguments);
        var e = f[c].apply(f, arguments),
          n = f.getError();
        return n != 0 && (a[n] = !0, t(n, c, arguments)), e
      }
    }
    q(i), t = t || function (u, E, o) {
      var c = "";
      for (var f = 0; f < o.length; ++f) {
        c += (f == 0 ? "" : ", ") + A(E, f, o[f])
      }
      C("WebGL error " + B(u) + " in " + E + "(" + c + ")")
    };
    var a = {},
      h = {};
    for (var p in i) {
      typeof i[p] == "function" ? h[p] = l(i, p) : m(h, i, p)
    }
    return h.getError = function () {
      for (var c in a) {
        if (a.hasOwnProperty(c) && a[c]) {
          return a[c] = !1, c
        }
      }
      return i.NO_ERROR
    }, h
  }

  function g(f) {
    var c = f.getParameter(f.MAX_VERTEX_ATTRIBS),
      h = f.createBuffer();
    f.bindBuffer(f.ARRAY_BUFFER, h);
    for (var d = 0; d < c; ++d) {
      f.disableVertexAttribArray(d), f.vertexAttribPointer(d, 4, f.FLOAT, !1, 0, 0), f.vertexAttrib1f(d, 0)
    }
    f.deleteBuffer(h);
    var a = f.getParameter(f.MAX_TEXTURE_IMAGE_UNITS);
    for (var d = 0; d < a; ++d) {
      f.activeTexture(f.TEXTURE0 + d), f.bindTexture(f.TEXTURE_CUBE_MAP, null), f.bindTexture(f.TEXTURE_2D, null)
    }
    f.activeTexture(f.TEXTURE0), f.useProgram(null), f.bindBuffer(f.ARRAY_BUFFER, null), f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, null), f.bindFramebuffer(f.FRAMEBUFFER, null), f.bindRenderbuffer(f.RENDERBUFFER, null), f.disable(f.BLEND), f.disable(f.CULL_FACE), f.disable(f.DEPTH_TEST), f.disable(f.DITHER), f.disable(f.SCISSOR_TEST), f.blendColor(0, 0, 0, 0), f.blendEquation(f.FUNC_ADD), f.blendFunc(f.ONE, f.ZERO), f.clearColor(0, 0, 0, 0), f.clearDepth(1), f.clearStencil(-1), f.colorMask(!0, !0, !0, !0), f.cullFace(f.BACK), f.depthFunc(f.LESS), f.depthMask(!0), f.depthRange(0, 1), f.frontFace(f.CCW), f.hint(f.GENERATE_MIPMAP_HINT, f.DONT_CARE), f.lineWidth(1), f.pixelStorei(f.PACK_ALIGNMENT, 4), f.pixelStorei(f.UNPACK_ALIGNMENT, 4), f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, !1), f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), f.UNPACK_COLORSPACE_CONVERSION_WEBGL && f.pixelStorei(f.UNPACK_COLORSPACE_CONVERSION_WEBGL, f.BROWSER_DEFAULT_WEBGL), f.polygonOffset(0, 0), f.sampleCoverage(1, !1), f.scissor(0, 0, f.canvas.width, f.canvas.height), f.stencilFunc(f.ALWAYS, 0, 4294967295), f.stencilMask(4294967295), f.stencilOp(f.KEEP, f.KEEP, f.KEEP), f.viewport(0, 0, f.canvas.width, f.canvas.height), f.clear(f.COLOR_BUFFER_BIT | f.DEPTH_BUFFER_BIT | f.STENCIL_BUFFER_BIT);
    while (f.getError()) {}
  }

function y(ab) {
  function V(a) {
    return typeof a == "function" ? a : function (c) {
      a.handleEvent(c)
    }
  }

  function ae(c) {
    var a = c.addEventListener;
    c.addEventListener = function (f, e, d) {
      switch (f) {
        case "webglcontextlost":
          Z(e);
          break;
        case "webglcontextrestored":
          G(e);
          break;
        default:
          a.apply(c, arguments)
      }
    }
  }

  function I(a) {
    return a instanceof WebGLBuffer || a instanceof WebGLFramebuffer || a instanceof WebGLProgram || a instanceof WebGLRenderbuffer || a instanceof WebGLShader || a instanceof WebGLTexture
  }

  function L(c) {
    for (var a = 0; a < c.length; ++a) {
      var d = c[a];
      if (I(d)) {
        return d.__webglDebugContextLostId__ == O
      }
    }
    return !0
  }

  function p() {
    var c = Object.keys(J);
    for (var a = 0; a < c.length; ++a) {
      delete J[c]
    }
  }

  function H() {
    ++ad, R || aa == ad && ab.loseContext()
  }

  function l(c, a) {
    var d = c[a];
    return function () {
      H();
      if (!R) {
        var e = d.apply(c, arguments);
        return e
      }
    }
  }

  function F() {
    for (var a = 0; a < af.length; ++a) {
      var c = af[a];
      c instanceof WebGLBuffer ? M.deleteBuffer(c) : c instanceof WebGLFramebuffer ? M.deleteFramebuffer(c) : c instanceof WebGLProgram ? M.deleteProgram(c) : c instanceof WebGLRenderbuffer ? M.deleteRenderbuffer(c) : c instanceof WebGLShader ? M.deleteShader(c) : c instanceof WebGLTexture && M.deleteTexture(c)
    }
  }

  function P(a) {
    return {
      statusMessage: a,
      preventDefault: function () {
        Y = !0
      }
    }
  }

  function W(t) {
    for (var o in t) {
      typeof t[o] == "function" ? U[o] = l(t, o) : m(U, t, o)
    }
    U.getError = function () {
      H();
      if (!R) {
        var c;
        while (c = M.getError()) {
          J[c] = !0
        }
      }
      for (var c in J) {
        if (J[c]) {
          return delete J[c], c
        }
      }
      return U.NO_ERROR
    };
    var d = ["createBuffer", "createFramebuffer", "createProgram", "createRenderbuffer", "createShader", "createTexture"];
    for (var a = 0; a < d.length; ++a) {
      var s = d[a];
      U[s] = function (c) {
        return function () {
          H();
          if (R) {
            return null
          }
          var e = c.apply(t, arguments);
          return e.__webglDebugContextLostId__ = O, af.push(e), e
        }
      }(t[s])
    }
    var E = ["getActiveAttrib", "getActiveUniform", "getBufferParameter", "getContextAttributes", "getAttachedShaders", "getFramebufferAttachmentParameter", "getParameter", "getProgramParameter", "getProgramInfoLog", "getRenderbufferParameter", "getShaderParameter", "getShaderInfoLog", "getShaderSource", "getTexParameter", "getUniform", "getUniformLocation", "getVertexAttrib"];
    for (var a = 0; a < E.length; ++a) {
      var s = E[a];
      U[s] = function (c) {
        return function () {
          return H(), R ? null : c.apply(t, arguments)
        }
      }(U[s])
    }
    var n = ["isBuffer", "isEnabled", "isFramebuffer", "isProgram", "isRenderbuffer", "isShader", "isTexture"];
    for (var a = 0; a < n.length; ++a) {
      var s = n[a];
      U[s] = function (c) {
        return function () {
          return H(), R ? !1 : c.apply(t, arguments)
        }
      }(U[s])
    }
    return U.checkFramebufferStatus = function (c) {
      return function () {
        return H(), R ? U.FRAMEBUFFER_UNSUPPORTED : c.apply(t, arguments)
      }
    }(U.checkFramebufferStatus), U.getAttribLocation = function (c) {
      return function () {
        return H(), R ? -1 : c.apply(t, arguments)
      }
    }(U.getAttribLocation), U.getVertexAttribOffset = function (c) {
      return function () {
        return H(), R ? 0 : c.apply(t, arguments)
      }
    }(U.getVertexAttribOffset), U.isContextLost = function () {
      return R
    }, U
  }
  var M, U, Q = [],
    X = [],
    U = {},
    O = 1,
    R = !1,
    K = 0,
    af = [],
    aa = 0,
    ad = 0,
    Y = !1,
    ac = 0,
    J = {};
  ab.getContext = function (a) {
    return function () {
      var c = a.apply(ab, arguments);
      if (c instanceof WebGLRenderingContext) {
        if (c != M) {
          if (M) {
            throw "got different context"
          }
          M = c, U = W(M)
        }
        return U
      }
      return c
    }
  }(ab.getContext);
  var Z = function (a) {
    Q.push(V(a))
  },
    G = function (a) {
      X.push(V(a))
    };
  return ae(ab), ab.loseContext = function () {
    if (!R) {
      R = !0, aa = 0, ++O;
      while (M.getError()) {}
      p(), J[M.CONTEXT_LOST_WEBGL] = !0;
      var c = P("context lost"),
        a = Q.slice();
      setTimeout(function () {
        for (var d = 0; d < a.length; ++d) {
          a[d](c)
        }
        ac >= 0 && setTimeout(function () {
          ab.restoreContext()
        }, ac)
      }, 0)
    }
  }, ab.restoreContext = function () {
    R && X.length && setTimeout(function () {
      if (!Y) {
        throw "can not restore. webglcontestlost listener did not call event.preventDefault"
      }
      F(), g(M), R = !1, ad = 0, Y = !1;
      var c = X.slice(),
        d = P("context restored");
      for (var a = 0; a < c.length; ++a) {
        c[a](d)
      }
    }, 0)
  }, ab.loseContextInNCalls = function (a) {
    if (R) {
      throw "You can not ask a lost contet to be lost"
    }
    aa = ad + a
  }, ab.getNumCalls = function () {
    return ad
  }, ab.setRestoreTimeout = function (a) {
    ac = a
  }, ab
}
var x = function (a) {
  window.console && window.console.log && window.console.log(a)
},
  C = function (a) {
    window.console && window.console.error ? window.console.error(a) : x(a)
  },
  k = {
    enable: {
      0: !0
    },
    disable: {
      0: !0
    },
    getParameter: {
      0: !0
    },
    drawArrays: {
      0: !0
    },
    drawElements: {
      0: !0,
      2: !0
    },
    createShader: {
      0: !0
    },
    getShaderParameter: {
      1: !0
    },
    getProgramParameter: {
      1: !0
    },
    getVertexAttrib: {
      1: !0
    },
    vertexAttribPointer: {
      2: !0
    },
    bindTexture: {
      0: !0
    },
    activeTexture: {
      0: !0
    },
    getTexParameter: {
      0: !0,
      1: !0
    },
    texParameterf: {
      0: !0,
      1: !0
    },
    texParameteri: {
      0: !0,
      1: !0,
      2: !0
    },
    texImage2D: {
      0: !0,
      2: !0,
      6: !0,
      7: !0
    },
    texSubImage2D: {
      0: !0,
      6: !0,
      7: !0
    },
    copyTexImage2D: {
      0: !0,
      2: !0
    },
    copyTexSubImage2D: {
      0: !0
    },
    generateMipmap: {
      0: !0
    },
    bindBuffer: {
      0: !0
    },
    bufferData: {
      0: !0,
      2: !0
    },
    bufferSubData: {
      0: !0
    },
    getBufferParameter: {
      0: !0,
      1: !0
    },
    pixelStorei: {
      0: !0,
      1: !0
    },
    readPixels: {
      4: !0,
      5: !0
    },
    bindRenderbuffer: {
      0: !0
    },
    bindFramebuffer: {
      0: !0
    },
    checkFramebufferStatus: {
      0: !0
    },
    framebufferRenderbuffer: {
      0: !0,
      1: !0,
      2: !0
    },
    framebufferTexture2D: {
      0: !0,
      1: !0,
      2: !0
    },
    getFramebufferAttachmentParameter: {
      0: !0,
      1: !0,
      2: !0
    },
    getRenderbufferParameter: {
      0: !0,
      1: !0
    },
    renderbufferStorage: {
      0: !0,
      1: !0
    },
    clear: {
      0: !0
    },
    depthFunc: {
      0: !0
    },
    blendFunc: {
      0: !0,
      1: !0
    },
    blendFuncSeparate: {
      0: !0,
      1: !0,
      2: !0,
      3: !0
    },
    blendEquation: {
      0: !0
    },
    blendEquationSeparate: {
      0: !0,
      1: !0
    },
    stencilFunc: {
      0: !0
    },
    stencilFuncSeparate: {
      0: !0,
      1: !0
    },
    stencilMaskSeparate: {
      0: !0
    },
    stencilOp: {
      0: !0,
      1: !0,
      2: !0
    },
    stencilOpSeparate: {
      0: !0,
      1: !0,
      2: !0,
      3: !0
    },
    cullFace: {
      0: !0
    },
    frontFace: {
      0: !0
    }
  },
  b = null;
return {
  init: q,
  mightBeEnum: j,
  glEnumToString: B,
  glFunctionArgToString: A,
  glFunctionArgsToString: w,
  makeDebugContext: v,
  makeLostContextSimulatingCanvas: y,
  resetToInitialState: g
}
}(), define("engine/gl/_webgl-debug", function () {}), define("engine/gl/context", ["require", "exports", "module", "./mesh", "./texture", "../utils", "./shader", "./_webgl-debug"], function (g, c, j) {
  function a(k, i, l) {
    window.console && window.console.error && console.error(l, i)
  }
  var f = g("./mesh"),
    b = g("./texture"),
    d = g("../utils").extend,
    h = g("./shader");
  g("./_webgl-debug"), c.Context = function (k, i) {
    this.gl = k, this.resources = i, this.shaderManager = new h.Manager(i)
  }, c.Context.prototype = {
    getBuffer: function (m, l, o) {
      var k = this.resources[m];
      new f.Buffer(this.gl, k, l, o)
    },
    getFBO: function () {},
    getTexture: function (k, i) {
      var l = this.resources[k];
      return new b.Texture2D(this.gl, l, i)
    },
    getShader: function (i) {}
  }, c.initialize = function (q, m, u) {
    var p = "Try upgrading to the latest version of firefox or chrome.";
    u = u || a;
    if (!q.getContext) {
      u(q, "canvas is not supported by your browser. " + p, "no-canvas");
      return
    }
    // console.log(q.getContext("webgl").drawArrays);
    var l = d({
      alpha: !1,
      depth: !0,
      stencil: !1,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !1
    }, m.context),
      s = m.extensions || {},
      k = q.getContext("webgl", l);
    if (k == null) {
      k = q.getContext("experimental-webgl", l);
      if (k == null) {
        u(q, "webgl is not supported by your browser. " + p, "no-webgl");
        document.querySelector('#fluid_wrapper').classList.add('no-gl');
        return
      }
    }
    if (m.vertex_texture_units && k.getParameter(k.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < m.vertex_texture_units) {
      u(q, "This application needs at least two vertex texture units which are not supported by your browser. " + p, "no-vertext-texture-units");
      return
    }
    if (s.texture_float && k.getExtension("OES_texture_float") == null) {
      u(q, "This application needs float textures which is not supported by your browser. " + p, "no-OES_texture_float");
      return
    }
    return s.standard_derivatives && k.getExtension("OES_standard_derivatives") == null && u(q, "This application need the standard deriviates extensions for WebGL which is not supported by your Browser." + p, "no-OES_standard_derivatives"), window.WebGLDebugUtils && m.debug && (m.log_all ? k = WebGLDebugUtils.makeDebugContext(k, undefined, function () {
      console.log.apply(console, arguments)
    }) : k = WebGLDebugUtils.makeDebugContext(k), console.log("running in debug context")), l.depth ? k.enable(k.DEPTH_TEST) : k.disable(k.DEPTH_TEST), k.enable(k.CULL_FACE), k.lost = !1, q.addEventListener("webglcontextlost", function () {
      u(q, "Lost webgl context!", "context-lost"), k.lost = !0
    }, !1), k
  }
}),
  function (b, a) {
    typeof exports == "object" ? module.exports = a(global) : typeof define == "function" && define.amd ? define("gl-matrix", [], function () {
      return a(b)
    }) : a(b)
  }(this, function (J) {
    function F(a) {
      return z = a, z
    }

    function x() {
      return z = typeof Float32Array != "undefined" ? Float32Array : Array, z
    }
    var w = 0.000001,
      C = {};
    (function () {
      if (typeof Float32Array != "undefined") {
        var b = new Float32Array(1),
          a = new Int32Array(b.buffer);
        C.invsqrt = function (f) {
          var e = f * 0.5;
          b[0] = f;
          var c = 1.5;
          a[0] = 1597463007 - (a[0] >> 1);
          var d = b[0];
          return d * (c - e * d * d)
        }
      } else {
        C.invsqrt = function (c) {
          return 1 / Math.sqrt(c)
        }
      }
    })();
    var z = null;
    x();
    var B = {};
    B.create = function (b) {
      var a = new z(3);
      return b ? (a[0] = b[0], a[1] = b[1], a[2] = b[2]) : a[0] = a[1] = a[2] = 0, a
    }, B.createFrom = function (c, b, d) {
      var a = new z(3);
      return a[0] = c, a[1] = b, a[2] = d, a
    }, B.set = function (b, a) {
      return a[0] = b[0], a[1] = b[1], a[2] = b[2], a
    }, B.equal = function (a, b) {
      return a === b || Math.abs(a[0] - b[0]) < w && Math.abs(a[1] - b[1]) < w && Math.abs(a[2] - b[2]) < w
    }, B.add = function (b, a, c) {
      return !c || b === c ? (b[0] += a[0], b[1] += a[1], b[2] += a[2], b) : (c[0] = b[0] + a[0], c[1] = b[1] + a[1], c[2] = b[2] + a[2], c)
    }, B.subtract = function (b, a, c) {
      return !c || b === c ? (b[0] -= a[0], b[1] -= a[1], b[2] -= a[2], b) : (c[0] = b[0] - a[0], c[1] = b[1] - a[1], c[2] = b[2] - a[2], c)
    }, B.multiply = function (b, a, c) {
      return !c || b === c ? (b[0] *= a[0], b[1] *= a[1], b[2] *= a[2], b) : (c[0] = b[0] * a[0], c[1] = b[1] * a[1], c[2] = b[2] * a[2], c)
    }, B.negate = function (b, a) {
      return a || (a = b), a[0] = -b[0], a[1] = -b[1], a[2] = -b[2], a
    }, B.scale = function (b, a, c) {
      return !c || b === c ? (b[0] *= a, b[1] *= a, b[2] *= a, b) : (c[0] = b[0] * a, c[1] = b[1] * a, c[2] = b[2] * a, c)
    }, B.normalize = function (f, b) {
      b || (b = f);
      var g = f[0],
        d = f[1],
        a = f[2],
        c = Math.sqrt(g * g + d * d + a * a);
      return c ? c === 1 ? (b[0] = g, b[1] = d, b[2] = a, b) : (c = 1 / c, b[0] = g * c, b[1] = d * c, b[2] = a * c, b) : (b[0] = 0, b[1] = 0, b[2] = 0, b)
    }, B.cross = function (g, m, d) {
      d || (d = g);
      var b = g[0],
        f = g[1],
        p = g[2],
        c = m[0],
        l = m[1],
        h = m[2];
      return d[0] = f * h - p * l, d[1] = p * c - b * h, d[2] = b * l - f * c, d
    }, B.length = function (c) {
      var a = c[0],
        d = c[1],
        b = c[2];
      return Math.sqrt(a * a + d * d + b * b)
    }, B.squaredLength = function (c) {
      var a = c[0],
        d = c[1],
        b = c[2];
      return a * a + d * d + b * b
    }, B.dot = function (b, a) {
      return b[0] * a[0] + b[1] * a[1] + b[2] * a[2]
    }, B.direction = function (f, b, h) {
      h || (h = f);
      var d = f[0] - b[0],
        a = f[1] - b[1],
        c = f[2] - b[2],
        g = Math.sqrt(d * d + a * a + c * c);
      return g ? (g = 1 / g, h[0] = d * g, h[1] = a * g, h[2] = c * g, h) : (h[0] = 0, h[1] = 0, h[2] = 0, h)
    }, B.lerp = function (c, a, d, b) {
      return b || (b = c), b[0] = c[0] + d * (a[0] - c[0]), b[1] = c[1] + d * (a[1] - c[1]), b[2] = c[2] + d * (a[2] - c[2]), b
    }, B.dist = function (d, b) {
      var f = b[0] - d[0],
        c = b[1] - d[1],
        a = b[2] - d[2];
      return Math.sqrt(f * f + c * c + a * a)
    };
    var q = null,
      N = new z(4);
    B.unproject = function (f, b, h, d, a) {
      a || (a = f), q || (q = K.create());
      var c = q,
        g = N;
      return g[0] = (f[0] - d[0]) * 2 / d[2] - 1, g[1] = (f[1] - d[1]) * 2 / d[3] - 1, g[2] = 2 * f[2] - 1, g[3] = 1, K.multiply(h, b, c), K.inverse(c) ? (K.multiplyVec4(c, g), g[3] === 0 ? null : (a[0] = g[0] / g[3], a[1] = g[1] / g[3], a[2] = g[2] / g[3], a)) : null
    };
    var I = B.createFrom(1, 0, 0),
      E = B.createFrom(0, 1, 0),
      L = B.createFrom(0, 0, 1),
      G = B.create();
    B.rotationTo = function (g, c, h) {
      h || (h = k.create());
      var f = B.dot(g, c),
        b = G;
      if (f >= 1) {
        k.set(D, h)
      } else {
        if (f < 0.000001 - 1) {
          B.cross(I, g, b), B.length(b) < 0.000001 && B.cross(E, g, b), B.length(b) < 0.000001 && B.cross(L, g, b), B.normalize(b), k.fromAngleAxis(Math.PI, b, h)
        } else {
          var d = Math.sqrt((1 + f) * 2),
            a = 1 / d;
          B.cross(g, c, b), h[0] = b[0] * a, h[1] = b[1] * a, h[2] = b[2] * a, h[3] = d * 0.5, k.normalize(h)
        }
      }
      return h[3] > 1 ? h[3] = 1 : h[3] < -1 && (h[3] = -1), h
    }, B.str = function (a) {
      return "[" + a[0] + ", " + a[1] + ", " + a[2] + "]"
    };
    var A = {};
    A.create = function (b) {
      var a = new z(9);
      return b ? (a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8]) : a[0] = a[1] = a[2] = a[3] = a[4] = a[5] = a[6] = a[7] = a[8] = 0, a
    }, A.createFrom = function (m, v, c, g, y, b, r, p, h) {
      var d = new z(9);
      return d[0] = m, d[1] = v, d[2] = c, d[3] = g, d[4] = y, d[5] = b, d[6] = r, d[7] = p, d[8] = h, d
    }, A.determinant = function (l) {
      var v = l[0],
        d = l[1],
        b = l[2],
        g = l[3],
        y = l[4],
        c = l[5],
        p = l[6],
        m = l[7],
        h = l[8];
      return v * (h * y - c * m) + d * (-h * g + c * p) + b * (m * g - y * p)
    }, A.inverse = function (S, Y) {
      var p = S[0],
        b = S[1],
        P = S[2],
        Z = S[3],
        g = S[4],
        X = S[5],
        V = S[6],
        R = S[7],
        O = S[8],
        U = O * g - X * R,
        Q = -O * Z + X * V,
        T = R * Z - g * V,
        W = p * U + b * Q + P * T,
        y;
      return W ? (y = 1 / W, Y || (Y = A.create()), Y[0] = U * y, Y[1] = (-O * b + P * R) * y, Y[2] = (X * b - P * g) * y, Y[3] = Q * y, Y[4] = (O * p - P * V) * y, Y[5] = (-X * p + P * Z) * y, Y[6] = T * y, Y[7] = (-R * p + b * V) * y, Y[8] = (g * p - b * Z) * y, Y) : null
    }, A.multiply = function (ae, S, X) {
      X || (X = ae);
      var U = ae[0],
        aa = ae[1],
        T = ae[2],
        W = ae[3],
        R = ae[4],
        ai = ae[5],
        ad = ae[6],
        Z = ae[7],
        ag = ae[8],
        ab = S[0],
        V = S[1],
        af = S[2],
        Q = S[3],
        Y = S[4],
        ac = S[5],
        O = S[6],
        ah = S[7],
        P = S[8];
      return X[0] = ab * U + V * W + af * ad, X[1] = ab * aa + V * R + af * Z, X[2] = ab * T + V * ai + af * ag, X[3] = Q * U + Y * W + ac * ad, X[4] = Q * aa + Y * R + ac * Z, X[5] = Q * T + Y * ai + ac * ag, X[6] = O * U + ah * W + P * ad, X[7] = O * aa + ah * R + P * Z, X[8] = O * T + ah * ai + P * ag, X
    }, A.multiplyVec2 = function (d, b, f) {
      f || (f = b);
      var c = b[0],
        a = b[1];
      return f[0] = c * d[0] + a * d[3] + d[6], f[1] = c * d[1] + a * d[4] + d[7], f
    }, A.multiplyVec3 = function (f, b, g) {
      g || (g = b);
      var d = b[0],
        a = b[1],
        c = b[2];
      return g[0] = d * f[0] + a * f[3] + c * f[6], g[1] = d * f[1] + a * f[4] + c * f[7], g[2] = d * f[2] + a * f[5] + c * f[8], g
    }, A.set = function (b, a) {
      return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8], a
    }, A.equal = function (a, b) {
      return a === b || Math.abs(a[0] - b[0]) < w && Math.abs(a[1] - b[1]) < w && Math.abs(a[2] - b[2]) < w && Math.abs(a[3] - b[3]) < w && Math.abs(a[4] - b[4]) < w && Math.abs(a[5] - b[5]) < w && Math.abs(a[6] - b[6]) < w && Math.abs(a[7] - b[7]) < w && Math.abs(a[8] - b[8]) < w
    }, A.identity = function (a) {
      return a || (a = A.create()), a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 1, a[5] = 0, a[6] = 0, a[7] = 0, a[8] = 1, a
    }, A.transpose = function (d, b) {
      if (!b || d === b) {
        var f = d[1],
          c = d[2],
          a = d[5];
        return d[1] = d[3], d[2] = d[6], d[3] = f, d[5] = d[7], d[6] = c, d[7] = a, d
      }
      return b[0] = d[0], b[1] = d[3], b[2] = d[6], b[3] = d[1], b[4] = d[4], b[5] = d[7], b[6] = d[2], b[7] = d[5], b[8] = d[8], b
    }, A.toMat4 = function (b, a) {
      return a || (a = K.create()), a[15] = 1, a[14] = 0, a[13] = 0, a[12] = 0, a[11] = 0, a[10] = b[8], a[9] = b[7], a[8] = b[6], a[7] = 0, a[6] = b[5], a[5] = b[4], a[4] = b[3], a[3] = 0, a[2] = b[2], a[1] = b[1], a[0] = b[0], a
    }, A.str = function (a) {
      return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + "]"
    };
    var K = {};
    K.create = function (b) {
      var a = new z(16);
      return b && (a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8], a[9] = b[9], a[10] = b[10], a[11] = b[11], a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15]), a
    }, K.createFrom = function (U, aa, y, Q, ab, r, Z, X, T, P, W, R, b, V, Y, O) {
      var S = new z(16);
      return S[0] = U, S[1] = aa, S[2] = y, S[3] = Q, S[4] = ab, S[5] = r, S[6] = Z, S[7] = X, S[8] = T, S[9] = P, S[10] = W, S[11] = R, S[12] = b, S[13] = V, S[14] = Y, S[15] = O, S
    }, K.set = function (b, a) {
      return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8], a[9] = b[9], a[10] = b[10], a[11] = b[11], a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15], a
    }, K.equal = function (a, b) {
      return a === b || Math.abs(a[0] - b[0]) < w && Math.abs(a[1] - b[1]) < w && Math.abs(a[2] - b[2]) < w && Math.abs(a[3] - b[3]) < w && Math.abs(a[4] - b[4]) < w && Math.abs(a[5] - b[5]) < w && Math.abs(a[6] - b[6]) < w && Math.abs(a[7] - b[7]) < w && Math.abs(a[8] - b[8]) < w && Math.abs(a[9] - b[9]) < w && Math.abs(a[10] - b[10]) < w && Math.abs(a[11] - b[11]) < w && Math.abs(a[12] - b[12]) < w && Math.abs(a[13] - b[13]) < w && Math.abs(a[14] - b[14]) < w && Math.abs(a[15] - b[15]) < w
    }, K.identity = function (a) {
      return a || (a = K.create()), a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
    }, K.transpose = function (g, c) {
      if (!c || g === c) {
        var l = g[1],
          f = g[2],
          b = g[3],
          d = g[6],
          h = g[7],
          a = g[11];
        return g[1] = g[4], g[2] = g[8], g[3] = g[12], g[4] = l, g[6] = g[9], g[7] = g[13], g[8] = f, g[9] = d, g[11] = g[14], g[12] = b, g[13] = h, g[14] = a, g
      }
      return c[0] = g[0], c[1] = g[4], c[2] = g[8], c[3] = g[12], c[4] = g[1], c[5] = g[5], c[6] = g[9], c[7] = g[13], c[8] = g[2], c[9] = g[6], c[10] = g[10], c[11] = g[14], c[12] = g[3], c[13] = g[7], c[14] = g[11], c[15] = g[15], c
    }, K.determinant = function (U) {
      var aa = U[0],
        O = U[1],
        b = U[2],
        R = U[3],
        ab = U[4],
        y = U[5],
        Z = U[6],
        X = U[7],
        T = U[8],
        Q = U[9],
        W = U[10],
        S = U[11],
        g = U[12],
        V = U[13],
        Y = U[14],
        P = U[15];
      return g * Q * Z * R - T * V * Z * R - g * y * W * R + ab * V * W * R + T * y * Y * R - ab * Q * Y * R - g * Q * b * X + T * V * b * X + g * O * W * X - aa * V * W * X - T * O * Y * X + aa * Q * Y * X + g * y * b * S - ab * V * b * S - g * O * Z * S + aa * V * Z * S + ab * O * Y * S - aa * y * Y * S - T * y * b * P + ab * Q * b * P + T * O * Z * P - aa * Q * Z * P - ab * O * W * P + aa * y * W * P
    }, K.inverse = function (at, ad) {
      ad || (ad = at);
      var ak = at[0],
        ag = at[1],
        ao = at[2],
        ae = at[3],
        aj = at[4],
        ab = at[5],
        ax = at[6],
        ar = at[7],
        am = at[8],
        av = at[9],
        ap = at[10],
        ai = at[11],
        au = at[12],
        aa = at[13],
        al = at[14],
        aq = at[15],
        X = ak * ab - ag * aj,
        aw = ak * ax - ao * aj,
        Z = ak * ar - ae * aj,
        ac = ag * ax - ao * ab,
        Q = ag * ar - ae * ab,
        Y = ao * ar - ae * ax,
        P = am * aa - av * au,
        U = am * al - ap * au,
        af = am * aq - ai * au,
        an = av * al - ap * aa,
        W = av * aq - ai * aa,
        ah = ap * aq - ai * al,
        R = X * ah - aw * W + Z * an + ac * af - Q * U + Y * P,
        V;
      return R ? (V = 1 / R, ad[0] = (ab * ah - ax * W + ar * an) * V, ad[1] = (-ag * ah + ao * W - ae * an) * V, ad[2] = (aa * Y - al * Q + aq * ac) * V, ad[3] = (-av * Y + ap * Q - ai * ac) * V, ad[4] = (-aj * ah + ax * af - ar * U) * V, ad[5] = (ak * ah - ao * af + ae * U) * V, ad[6] = (-au * Y + al * Z - aq * aw) * V, ad[7] = (am * Y - ap * Z + ai * aw) * V, ad[8] = (aj * W - ab * af + ar * P) * V, ad[9] = (-ak * W + ag * af - ae * P) * V, ad[10] = (au * Q - aa * Z + aq * X) * V, ad[11] = (-am * Q + av * Z - ai * X) * V, ad[12] = (-aj * an + ab * U - ax * P) * V, ad[13] = (ak * an - ag * U + ao * P) * V, ad[14] = (-au * ac + aa * aw - al * X) * V, ad[15] = (am * ac - av * aw + ap * X) * V, ad) : null
    }, K.toRotationMat = function (b, a) {
      return a || (a = K.create()), a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8], a[9] = b[9], a[10] = b[10], a[11] = b[11], a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
    }, K.toMat3 = function (b, a) {
      return a || (a = A.create()), a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[4], a[4] = b[5], a[5] = b[6], a[6] = b[8], a[7] = b[9], a[8] = b[10], a
    }, K.toInverseMat3 = function (S, Y) {
      var p = S[0],
        b = S[1],
        P = S[2],
        Z = S[4],
        g = S[5],
        X = S[6],
        V = S[8],
        R = S[9],
        O = S[10],
        U = O * g - X * R,
        Q = -O * Z + X * V,
        T = R * Z - g * V,
        W = p * U + b * Q + P * T,
        y;
      return W ? (y = 1 / W, Y || (Y = A.create()), Y[0] = U * y, Y[1] = (-O * b + P * R) * y, Y[2] = (X * b - P * g) * y, Y[3] = Q * y, Y[4] = (O * p - P * V) * y, Y[5] = (-X * p + P * Z) * y, Y[6] = T * y, Y[7] = (-R * p + b * V) * y, Y[8] = (g * p - b * Z) * y, Y) : null
    }, K.multiply = function (ah, V, aa) {
      aa || (aa = ah);
      var X = ah[0],
        ad = ah[1],
        W = ah[2],
        Z = ah[3],
        T = ah[4],
        al = ah[5],
        ag = ah[6],
        ac = ah[7],
        aj = ah[8],
        ae = ah[9],
        Y = ah[10],
        ai = ah[11],
        R = ah[12],
        ab = ah[13],
        af = ah[14],
        P = ah[15],
        ak = V[0],
        Q = V[1],
        U = V[2],
        O = V[3];
      return aa[0] = ak * X + Q * T + U * aj + O * R, aa[1] = ak * ad + Q * al + U * ae + O * ab, aa[2] = ak * W + Q * ag + U * Y + O * af, aa[3] = ak * Z + Q * ac + U * ai + O * P, ak = V[4], Q = V[5], U = V[6], O = V[7], aa[4] = ak * X + Q * T + U * aj + O * R, aa[5] = ak * ad + Q * al + U * ae + O * ab, aa[6] = ak * W + Q * ag + U * Y + O * af, aa[7] = ak * Z + Q * ac + U * ai + O * P, ak = V[8], Q = V[9], U = V[10], O = V[11], aa[8] = ak * X + Q * T + U * aj + O * R, aa[9] = ak * ad + Q * al + U * ae + O * ab, aa[10] = ak * W + Q * ag + U * Y + O * af, aa[11] = ak * Z + Q * ac + U * ai + O * P, ak = V[12], Q = V[13], U = V[14], O = V[15], aa[12] = ak * X + Q * T + U * aj + O * R, aa[13] = ak * ad + Q * al + U * ae + O * ab, aa[14] = ak * W + Q * ag + U * Y + O * af, aa[15] = ak * Z + Q * ac + U * ai + O * P, aa
    }, K.multiplyVec3 = function (f, b, g) {
      g || (g = b);
      var d = b[0],
        a = b[1],
        c = b[2];
      return g[0] = f[0] * d + f[4] * a + f[8] * c + f[12], g[1] = f[1] * d + f[5] * a + f[9] * c + f[13], g[2] = f[2] * d + f[6] * a + f[10] * c + f[14], g
    }, K.multiplyVec4 = function (f, b, h) {
      h || (h = b);
      var d = b[0],
        a = b[1],
        c = b[2],
        g = b[3];
      return h[0] = f[0] * d + f[4] * a + f[8] * c + f[12] * g, h[1] = f[1] * d + f[5] * a + f[9] * c + f[13] * g, h[2] = f[2] * d + f[6] * a + f[10] * c + f[14] * g, h[3] = f[3] * d + f[7] * a + f[11] * c + f[15] * g, h
    }, K.translate = function (aa, O, T) {
      var Q = O[0],
        W = O[1],
        P = O[2],
        S, y, ad, Z, V, ac, X, R, ab, b, U, Y;
      return !T || aa === T ? (aa[12] = aa[0] * Q + aa[4] * W + aa[8] * P + aa[12], aa[13] = aa[1] * Q + aa[5] * W + aa[9] * P + aa[13], aa[14] = aa[2] * Q + aa[6] * W + aa[10] * P + aa[14], aa[15] = aa[3] * Q + aa[7] * W + aa[11] * P + aa[15], aa) : (S = aa[0], y = aa[1], ad = aa[2], Z = aa[3], V = aa[4], ac = aa[5], X = aa[6], R = aa[7], ab = aa[8], b = aa[9], U = aa[10], Y = aa[11], T[0] = S, T[1] = y, T[2] = ad, T[3] = Z, T[4] = V, T[5] = ac, T[6] = X, T[7] = R, T[8] = ab, T[9] = b, T[10] = U, T[11] = Y, T[12] = S * Q + V * W + ab * P + aa[12], T[13] = y * Q + ac * W + b * P + aa[13], T[14] = ad * Q + X * W + U * P + aa[14], T[15] = Z * Q + R * W + Y * P + aa[15], T)
    }, K.scale = function (f, b, g) {
      var d = b[0],
        a = b[1],
        c = b[2];
      return !g || f === g ? (f[0] *= d, f[1] *= d, f[2] *= d, f[3] *= d, f[4] *= a, f[5] *= a, f[6] *= a, f[7] *= a, f[8] *= c, f[9] *= c, f[10] *= c, f[11] *= c, f) : (g[0] = f[0] * d, g[1] = f[1] * d, g[2] = f[2] * d, g[3] = f[3] * d, g[4] = f[4] * a, g[5] = f[5] * a, g[6] = f[6] * a, g[7] = f[7] * a, g[8] = f[8] * c, g[9] = f[9] * c, g[10] = f[10] * c, g[11] = f[11] * c, g[12] = f[12], g[13] = f[13], g[14] = f[14], g[15] = f[15], g)
    }, K.rotate = function (at, ad, ak, ag) {
      var ao = ak[0],
        ae = ak[1],
        aj = ak[2],
        ab = Math.sqrt(ao * ao + ae * ae + aj * aj),
        ax, ar, am, av, ap, ai, au, aa, al, aq, X, aw, Z, ac, Q, Y, P, U, af, an, W, ah, R, V;
      return ab ? (ab !== 1 && (ab = 1 / ab, ao *= ab, ae *= ab, aj *= ab), ax = Math.sin(ad), ar = Math.cos(ad), am = 1 - ar, av = at[0], ap = at[1], ai = at[2], au = at[3], aa = at[4], al = at[5], aq = at[6], X = at[7], aw = at[8], Z = at[9], ac = at[10], Q = at[11], Y = ao * ao * am + ar, P = ae * ao * am + aj * ax, U = aj * ao * am - ae * ax, af = ao * ae * am - aj * ax, an = ae * ae * am + ar, W = aj * ae * am + ao * ax, ah = ao * aj * am + ae * ax, R = ae * aj * am - ao * ax, V = aj * aj * am + ar, ag ? at !== ag && (ag[12] = at[12], ag[13] = at[13], ag[14] = at[14], ag[15] = at[15]) : ag = at, ag[0] = av * Y + aa * P + aw * U, ag[1] = ap * Y + al * P + Z * U, ag[2] = ai * Y + aq * P + ac * U, ag[3] = au * Y + X * P + Q * U, ag[4] = av * af + aa * an + aw * W, ag[5] = ap * af + al * an + Z * W, ag[6] = ai * af + aq * an + ac * W, ag[7] = au * af + X * an + Q * W, ag[8] = av * ah + aa * R + aw * V, ag[9] = ap * ah + al * R + Z * V, ag[10] = ai * ah + aq * R + ac * V, ag[11] = au * ah + X * R + Q * V, ag) : null
    }, K.rotateX = function (O, S, g) {
      var b = Math.sin(S),
        p = Math.cos(S),
        T = O[4],
        d = O[5],
        R = O[6],
        Q = O[7],
        y = O[8],
        m = O[9],
        P = O[10],
        v = O[11];
      return g ? O !== g && (g[0] = O[0], g[1] = O[1], g[2] = O[2], g[3] = O[3], g[12] = O[12], g[13] = O[13], g[14] = O[14], g[15] = O[15]) : g = O, g[4] = T * p + y * b, g[5] = d * p + m * b, g[6] = R * p + P * b, g[7] = Q * p + v * b, g[8] = T * -b + y * p, g[9] = d * -b + m * p, g[10] = R * -b + P * p, g[11] = Q * -b + v * p, g
    }, K.rotateY = function (O, S, g) {
      var b = Math.sin(S),
        p = Math.cos(S),
        T = O[0],
        d = O[1],
        R = O[2],
        Q = O[3],
        y = O[8],
        m = O[9],
        P = O[10],
        v = O[11];
      return g ? O !== g && (g[4] = O[4], g[5] = O[5], g[6] = O[6], g[7] = O[7], g[12] = O[12], g[13] = O[13], g[14] = O[14], g[15] = O[15]) : g = O, g[0] = T * p + y * -b, g[1] = d * p + m * -b, g[2] = R * p + P * -b, g[3] = Q * p + v * -b, g[8] = T * b + y * p, g[9] = d * b + m * p, g[10] = R * b + P * p, g[11] = Q * b + v * p, g
    }, K.rotateZ = function (O, S, g) {
      var b = Math.sin(S),
        p = Math.cos(S),
        T = O[0],
        d = O[1],
        R = O[2],
        Q = O[3],
        y = O[4],
        m = O[5],
        P = O[6],
        v = O[7];
      return g ? O !== g && (g[8] = O[8], g[9] = O[9], g[10] = O[10], g[11] = O[11], g[12] = O[12], g[13] = O[13], g[14] = O[14], g[15] = O[15]) : g = O, g[0] = T * p + y * b, g[1] = d * p + m * b, g[2] = R * p + P * b, g[3] = Q * p + v * b, g[4] = T * -b + y * p, g[5] = d * -b + m * p, g[6] = R * -b + P * p, g[7] = Q * -b + v * p, g
    }, K.frustum = function (l, v, d, b, g, y, c) {
      c || (c = K.create());
      var p = v - l,
        m = b - d,
        h = y - g;
      return c[0] = g * 2 / p, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = g * 2 / m, c[6] = 0, c[7] = 0, c[8] = (v + l) / p, c[9] = (b + d) / m, c[10] = -(y + g) / h, c[11] = -1, c[12] = 0, c[13] = 0, c[14] = -(y * g * 2) / h, c[15] = 0, c
    }, K.perspective = function (f, b, h, d, a) {
      var c = h * Math.tan(f * Math.PI / 360),
        g = c * b;
      return K.frustum(-g, g, -c, c, h, d, a)
    }, K.ortho = function (l, v, d, b, g, y, c) {
      c || (c = K.create());
      var p = v - l,
        m = b - d,
        h = y - g;
      return c[0] = 2 / p, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 2 / m, c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = -2 / h, c[11] = 0, c[12] = -(l + v) / p, c[13] = -(b + d) / m, c[14] = -(y + g) / h, c[15] = 1, c
    }, K.lookAt = function (ah, V, aa, X) {
      X || (X = K.create());
      var ad, W, Z, T, ak, ag, ac, ai, ae, Y, R = ah[0],
        ab = ah[1],
        af = ah[2],
        O = aa[0],
        aj = aa[1],
        Q = aa[2],
        U = V[0],
        d = V[1],
        P = V[2];
      return R === U && ab === d && af === P ? K.identity(X) : (ac = R - U, ai = ab - d, ae = af - P, Y = 1 / Math.sqrt(ac * ac + ai * ai + ae * ae), ac *= Y, ai *= Y, ae *= Y, ad = aj * ae - Q * ai, W = Q * ac - O * ae, Z = O * ai - aj * ac, Y = Math.sqrt(ad * ad + W * W + Z * Z), Y ? (Y = 1 / Y, ad *= Y, W *= Y, Z *= Y) : (ad = 0, W = 0, Z = 0), T = ai * Z - ae * W, ak = ae * ad - ac * Z, ag = ac * W - ai * ad, Y = Math.sqrt(T * T + ak * ak + ag * ag), Y ? (Y = 1 / Y, T *= Y, ak *= Y, ag *= Y) : (T = 0, ak = 0, ag = 0), X[0] = ad, X[1] = T, X[2] = ac, X[3] = 0, X[4] = W, X[5] = ak, X[6] = ai, X[7] = 0, X[8] = Z, X[9] = ag, X[10] = ae, X[11] = 0, X[12] = -(ad * R + W * ab + Z * af), X[13] = -(T * R + ak * ab + ag * af), X[14] = -(ac * R + ai * ab + ae * af), X[15] = 1, X)
    }, K.fromRotationTranslation = function (ac, Q, V) {
      V || (V = K.create());
      var S = ac[0],
        Y = ac[1],
        R = ac[2],
        U = ac[3],
        P = S + S,
        af = Y + Y,
        ab = R + R,
        X = S * P,
        ad = S * af,
        Z = S * ab,
        T = Y * af,
        O = Y * ab,
        W = R * ab,
        aa = U * P,
        d = U * af,
        ae = U * ab;
      return V[0] = 1 - (T + W), V[1] = ad + ae, V[2] = Z - d, V[3] = 0, V[4] = ad - ae, V[5] = 1 - (X + W), V[6] = O + aa, V[7] = 0, V[8] = Z + d, V[9] = O - aa, V[10] = 1 - (X + T), V[11] = 0, V[12] = Q[0], V[13] = Q[1], V[14] = Q[2], V[15] = 1, V
    }, K.str = function (a) {
      return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + "]"
    };
var k = {};
k.create = function (b) {
  var a = new z(4);
  return b ? (a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3]) : a[0] = a[1] = a[2] = a[3] = 0, a
}, k.createFrom = function (d, b, f, a) {
  var c = new z(4);
  return c[0] = d, c[1] = b, c[2] = f, c[3] = a, c
}, k.set = function (b, a) {
  return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a
}, k.equal = function (a, b) {
  return a === b || Math.abs(a[0] - b[0]) < w && Math.abs(a[1] - b[1]) < w && Math.abs(a[2] - b[2]) < w && Math.abs(a[3] - b[3]) < w
}, k.identity = function (a) {
  return a || (a = k.create()), a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 1, a
};
var D = k.identity();
k.calculateW = function (d, b) {
  var f = d[0],
    c = d[1],
    a = d[2];
  return !b || d === b ? (d[3] = -Math.sqrt(Math.abs(1 - f * f - c * c - a * a)), d) : (b[0] = f, b[1] = c, b[2] = a, b[3] = -Math.sqrt(Math.abs(1 - f * f - c * c - a * a)), b)
}, k.dot = function (b, a) {
  return b[0] * a[0] + b[1] * a[1] + b[2] * a[2] + b[3] * a[3]
}, k.inverse = function (g, c) {
  var l = g[0],
    f = g[1],
    b = g[2],
    d = g[3],
    h = l * l + f * f + b * b + d * d,
    a = h ? 1 / h : 0;
  return !c || g === c ? (g[0] *= -a, g[1] *= -a, g[2] *= -a, g[3] *= a, g) : (c[0] = -g[0] * a, c[1] = -g[1] * a, c[2] = -g[2] * a, c[3] = g[3] * a, c)
}, k.conjugate = function (b, a) {
  return !a || b === a ? (b[0] *= -1, b[1] *= -1, b[2] *= -1, b) : (a[0] = -b[0], a[1] = -b[1], a[2] = -b[2], a[3] = b[3], a)
}, k.length = function (d) {
  var b = d[0],
    f = d[1],
    c = d[2],
    a = d[3];
  return Math.sqrt(b * b + f * f + c * c + a * a)
}, k.normalize = function (f, b) {
  b || (b = f);
  var h = f[0],
    d = f[1],
    a = f[2],
    c = f[3],
    g = Math.sqrt(h * h + d * d + a * a + c * c);
  return g === 0 ? (b[0] = 0, b[1] = 0, b[2] = 0, b[3] = 0, b) : (g = 1 / g, b[0] = h * g, b[1] = d * g, b[2] = a * g, b[3] = c * g, b)
}, k.add = function (b, a, c) {
  return !c || b === c ? (b[0] += a[0], b[1] += a[1], b[2] += a[2], b[3] += a[3], b) : (c[0] = b[0] + a[0], c[1] = b[1] + a[1], c[2] = b[2] + a[2], c[3] = b[3] + a[3], c)
}, k.multiply = function (p, O, d) {
  d || (d = p);
  var b = p[0],
    h = p[1],
    P = p[2],
    c = p[3],
    y = O[0],
    v = O[1],
    m = O[2],
    g = O[3];
  return d[0] = b * g + c * y + h * m - P * v, d[1] = h * g + c * v + P * y - b * m, d[2] = P * g + c * m + b * v - h * y, d[3] = c * g - b * y - h * v - P * m, d
}, k.multiplyVec3 = function (Q, U, m) {
  m || (m = U);
  var b = U[0],
    y = U[1],
    V = U[2],
    g = Q[0],
    T = Q[1],
    S = Q[2],
    P = Q[3],
    v = P * b + T * V - S * y,
    R = P * y + S * b - g * V,
    O = P * V + g * y - T * b,
    d = -g * b - T * y - S * V;
  return m[0] = v * P + d * -g + R * -S - O * -T, m[1] = R * P + d * -T + O * -g - v * -S, m[2] = O * P + d * -S + v * -T - R * -g, m
}, k.scale = function (b, a, c) {
  return !c || b === c ? (b[0] *= a, b[1] *= a, b[2] *= a, b[3] *= a, b) : (c[0] = b[0] * a, c[1] = b[1] * a, c[2] = b[2] * a, c[3] = b[3] * a, c)
}, k.toMat3 = function (aa, P) {
  P || (P = A.create());
  var T = aa[0],
    R = aa[1],
    W = aa[2],
    Q = aa[3],
    S = T + T,
    O = R + R,
    ad = W + W,
    Z = T * S,
    V = T * O,
    ac = T * ad,
    X = R * O,
    ab = R * ad,
    p = W * ad,
    U = Q * S,
    Y = Q * O,
    b = Q * ad;
  return P[0] = 1 - (X + p), P[1] = V + b, P[2] = ac - Y, P[3] = V - b, P[4] = 1 - (Z + p), P[5] = ab + U, P[6] = ac + Y, P[7] = ab - U, P[8] = 1 - (Z + X), P
}, k.toMat4 = function (ab, P) {
  P || (P = K.create());
  var U = ab[0],
    R = ab[1],
    X = ab[2],
    Q = ab[3],
    T = U + U,
    O = R + R,
    ad = X + X,
    aa = U * T,
    W = U * O,
    ac = U * ad,
    Y = R * O,
    S = R * ad,
    d = X * ad,
    V = Q * T,
    Z = Q * O,
    b = Q * ad;
  return P[0] = 1 - (Y + d), P[1] = W + b, P[2] = ac - Z, P[3] = 0, P[4] = W - b, P[5] = 1 - (aa + d), P[6] = S + V, P[7] = 0, P[8] = ac + Z, P[9] = S - V, P[10] = 1 - (aa + Y), P[11] = 0, P[12] = 0, P[13] = 0, P[14] = 0, P[15] = 1, P
}, k.slerp = function (g, m, d, b) {
  b || (b = g);
  var f = g[0] * m[0] + g[1] * m[1] + g[2] * m[2] + g[3] * m[3],
    p, c, l, h;
  return Math.abs(f) >= 1 ? (b !== g && (b[0] = g[0], b[1] = g[1], b[2] = g[2], b[3] = g[3]), b) : (p = Math.acos(f), c = Math.sqrt(1 - f * f), Math.abs(c) < 0.001 ? (b[0] = g[0] * 0.5 + m[0] * 0.5, b[1] = g[1] * 0.5 + m[1] * 0.5, b[2] = g[2] * 0.5 + m[2] * 0.5, b[3] = g[3] * 0.5 + m[3] * 0.5, b) : (l = Math.sin((1 - d) * p) / c, h = Math.sin(d * p) / c, b[0] = g[0] * l + m[0] * h, b[1] = g[1] * l + m[1] * h, b[2] = g[2] * l + m[2] * h, b[3] = g[3] * l + m[3] * h, b))
}, k.fromRotationMatrix = function (g, c) {
  c || (c = k.create());
  var l = g[0] + g[4] + g[8],
    f;
  if (l > 0) {
    f = Math.sqrt(l + 1), c[3] = 0.5 * f, f = 0.5 / f, c[0] = (g[7] - g[5]) * f, c[1] = (g[2] - g[6]) * f, c[2] = (g[3] - g[1]) * f
  } else {
    var b = k.fromRotationMatrix.s_iNext = k.fromRotationMatrix.s_iNext || [1, 2, 0],
      d = 0;
    g[4] > g[0] && (d = 1), g[8] > g[d * 3 + d] && (d = 2);
    var h = b[d],
      a = b[h];
    f = Math.sqrt(g[d * 3 + d] - g[h * 3 + h] - g[a * 3 + a] + 1), c[d] = 0.5 * f, f = 0.5 / f, c[3] = (g[a * 3 + h] - g[h * 3 + a]) * f, c[h] = (g[h * 3 + d] + g[d * 3 + h]) * f, c[a] = (g[a * 3 + d] + g[d * 3 + a]) * f
  }
  return c
}, A.toQuat4 = k.fromRotationMatrix,
  function () {
    var a = A.create();
    k.fromAxes = function (c, e, d, b) {
      return a[0] = e[0], a[3] = e[1], a[6] = e[2], a[1] = d[0], a[4] = d[1], a[7] = d[2], a[2] = c[0], a[5] = c[1], a[8] = c[2], k.fromRotationMatrix(a, b)
    }
  }(), k.identity = function (a) {
    return a || (a = k.create()), a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 1, a
  }, k.fromAngleAxis = function (d, b, f) {
    f || (f = k.create());
    var c = d * 0.5,
      a = Math.sin(c);
    return f[3] = Math.cos(c), f[0] = a * b[0], f[1] = a * b[1], f[2] = a * b[2], f
  }, k.toAngleAxis = function (d, b) {
    b || (b = d);
    var c = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
    if (c > 0) {
      b[3] = 2 * Math.acos(d[3]);
      var a = C.invsqrt(c);
      b[0] = d[0] * a, b[1] = d[1] * a, b[2] = d[2] * a
    } else {
      b[3] = 0, b[0] = 1, b[1] = 0, b[2] = 0
    }
    return b
  }, k.str = function (a) {
    return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"
  };
var H = {};
H.create = function (b) {
  var a = new z(2);
  return b ? (a[0] = b[0], a[1] = b[1]) : (a[0] = 0, a[1] = 0), a
}, H.createFrom = function (b, a) {
  var c = new z(2);
  return c[0] = b, c[1] = a, c
}, H.add = function (b, a, c) {
  return c || (c = a), c[0] = b[0] + a[0], c[1] = b[1] + a[1], c
}, H.subtract = function (b, a, c) {
  return c || (c = a), c[0] = b[0] - a[0], c[1] = b[1] - a[1], c
}, H.multiply = function (b, a, c) {
  return c || (c = a), c[0] = b[0] * a[0], c[1] = b[1] * a[1], c
}, H.divide = function (b, a, c) {
  return c || (c = a), c[0] = b[0] / a[0], c[1] = b[1] / a[1], c
}, H.scale = function (b, a, c) {
  return c || (c = b), c[0] = b[0] * a, c[1] = b[1] * a, c
}, H.dist = function (c, a) {
  var d = a[0] - c[0],
    b = a[1] - c[1];
  return Math.sqrt(d * d + b * b)
}, H.set = function (b, a) {
  return a[0] = b[0], a[1] = b[1], a
}, H.equal = function (a, b) {
  return a === b || Math.abs(a[0] - b[0]) < w && Math.abs(a[1] - b[1]) < w
}, H.negate = function (b, a) {
  return a || (a = b), a[0] = -b[0], a[1] = -b[1], a
}, H.normalize = function (b, a) {
  a || (a = b);
  var c = b[0] * b[0] + b[1] * b[1];
  return c > 0 ? (c = Math.sqrt(c), a[0] = b[0] / c, a[1] = b[1] / c) : a[0] = a[1] = 0, a
}, H.cross = function (c, a, d) {
  var b = c[0] * a[1] - c[1] * a[0];
  return d ? (d[0] = d[1] = 0, d[2] = b, d) : b
}, H.length = function (b) {
  var a = b[0],
    c = b[1];
  return Math.sqrt(a * a + c * c)
}, H.squaredLength = function (b) {
  var a = b[0],
    c = b[1];
  return a * a + c * c
}, H.dot = function (b, a) {
  return b[0] * a[0] + b[1] * a[1]
}, H.direction = function (f, b, g) {
  g || (g = f);
  var d = f[0] - b[0],
    a = f[1] - b[1],
    c = d * d + a * a;
  return c ? (c = 1 / Math.sqrt(c), g[0] = d * c, g[1] = a * c, g) : (g[0] = 0, g[1] = 0, g[2] = 0, g)
}, H.lerp = function (c, a, d, b) {
  return b || (b = c), b[0] = c[0] + d * (a[0] - c[0]), b[1] = c[1] + d * (a[1] - c[1]), b
}, H.str = function (a) {
  return "[" + a[0] + ", " + a[1] + "]"
};
var j = {};
j.create = function (b) {
  var a = new z(4);
  return b ? (a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3]) : a[0] = a[1] = a[2] = a[3] = 0, a
}, j.createFrom = function (d, b, f, a) {
  var c = new z(4);
  return c[0] = d, c[1] = b, c[2] = f, c[3] = a, c
}, j.set = function (b, a) {
  return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a
}, j.equal = function (a, b) {
  return a === b || Math.abs(a[0] - b[0]) < w && Math.abs(a[1] - b[1]) < w && Math.abs(a[2] - b[2]) < w && Math.abs(a[3] - b[3]) < w
}, j.identity = function (a) {
  return a || (a = j.create()), a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 1, a
}, j.transpose = function (b, a) {
  if (!a || b === a) {
    var c = b[1];
    return b[1] = b[2], b[2] = c, b
  }
  return a[0] = b[0], a[1] = b[2], a[2] = b[1], a[3] = b[3], a
}, j.determinant = function (a) {
  return a[0] * a[3] - a[2] * a[1]
}, j.inverse = function (f, b) {
  b || (b = f);
  var h = f[0],
    d = f[1],
    a = f[2],
    c = f[3],
    g = h * c - a * d;
  return g ? (g = 1 / g, b[0] = c * g, b[1] = -d * g, b[2] = -a * g, b[3] = h * g, b) : null
}, j.multiply = function (f, b, h) {
  h || (h = f);
  var d = f[0],
    a = f[1],
    c = f[2],
    g = f[3];
  return h[0] = d * b[0] + a * b[2], h[1] = d * b[1] + a * b[3], h[2] = c * b[0] + g * b[2], h[3] = c * b[1] + g * b[3], h
}, j.rotate = function (g, m, d) {
  d || (d = g);
  var b = g[0],
    f = g[1],
    p = g[2],
    c = g[3],
    l = Math.sin(m),
    h = Math.cos(m);
  return d[0] = b * h + f * l, d[1] = b * -l + f * h, d[2] = p * h + c * l, d[3] = p * -l + c * h, d
}, j.multiplyVec2 = function (d, b, f) {
  f || (f = b);
  var c = b[0],
    a = b[1];
  return f[0] = c * d[0] + a * d[1], f[1] = c * d[2] + a * d[3], f
}, j.scale = function (g, m, d) {
  d || (d = g);
  var b = g[0],
    f = g[1],
    p = g[2],
    c = g[3],
    l = m[0],
    h = m[1];
  return d[0] = b * l, d[1] = f * h, d[2] = p * l, d[3] = c * h, d
}, j.str = function (a) {
  return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"
};
var M = {};
return M.create = function (b) {
  var a = new z(4);
  return b ? (a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3]) : (a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 0), a
}, M.createFrom = function (d, b, f, a) {
  var c = new z(4);
  return c[0] = d, c[1] = b, c[2] = f, c[3] = a, c
}, M.add = function (b, a, c) {
  return c || (c = a), c[0] = b[0] + a[0], c[1] = b[1] + a[1], c[2] = b[2] + a[2], c[3] = b[3] + a[3], c
}, M.subtract = function (b, a, c) {
  return c || (c = a), c[0] = b[0] - a[0], c[1] = b[1] - a[1], c[2] = b[2] - a[2], c[3] = b[3] - a[3], c
}, M.multiply = function (b, a, c) {
  return c || (c = a), c[0] = b[0] * a[0], c[1] = b[1] * a[1], c[2] = b[2] * a[2], c[3] = b[3] * a[3], c
}, M.divide = function (b, a, c) {
  return c || (c = a), c[0] = b[0] / a[0], c[1] = b[1] / a[1], c[2] = b[2] / a[2], c[3] = b[3] / a[3], c
}, M.scale = function (b, a, c) {
  return c || (c = b), c[0] = b[0] * a, c[1] = b[1] * a, c[2] = b[2] * a, c[3] = b[3] * a, c
}, M.set = function (b, a) {
  return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a
}, M.equal = function (a, b) {
  return a === b || Math.abs(a[0] - b[0]) < w && Math.abs(a[1] - b[1]) < w && Math.abs(a[2] - b[2]) < w && Math.abs(a[3] - b[3]) < w
}, M.negate = function (b, a) {
  return a || (a = b), a[0] = -b[0], a[1] = -b[1], a[2] = -b[2], a[3] = -b[3], a
}, M.length = function (d) {
  var b = d[0],
    f = d[1],
    c = d[2],
    a = d[3];
  return Math.sqrt(b * b + f * f + c * c + a * a)
}, M.squaredLength = function (d) {
  var b = d[0],
    f = d[1],
    c = d[2],
    a = d[3];
  return b * b + f * f + c * c + a * a
}, M.lerp = function (c, a, d, b) {
  return b || (b = c), b[0] = c[0] + d * (a[0] - c[0]), b[1] = c[1] + d * (a[1] - c[1]), b[2] = c[2] + d * (a[2] - c[2]), b[3] = c[3] + d * (a[3] - c[3]), b
}, M.str = function (a) {
  return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"
}, J && (J.glMatrixArrayType = z, J.MatrixArray = z, J.setMatrixArrayType = F, J.determineMatrixArrayType = x, J.glMath = C, J.vec2 = H, J.vec3 = B, J.vec4 = M, J.mat2 = j, J.mat3 = A, J.mat4 = K, J.quat4 = k), {
  glMatrixArrayType: z,
  MatrixArray: z,
  setMatrixArrayType: F,
  determineMatrixArrayType: x,
  glMath: C,
  vec2: H,
  vec3: B,
  vec4: M,
  mat2: j,
  mat3: A,
  mat4: K,
  quat4: k
}
}), define("compute", ["require", "exports", "module"], function (c, a, d) {
  function b(g, f) {
    this.gl = g, this.shader = f.shader, this.mesh = f.mesh, this.uniforms = f.uniforms, this.outputFBO = f.output, this.blend = f.blend, this.nobind = f.nobind, this.nounbind = f.nounbind
  }
  b.prototype.run = function () {
    this.outputFBO && !this.nobind && this.outputFBO.bind();
    var g = 0,
      f;
    for (var h in this.uniforms) {
      this.uniforms.hasOwnProperty(h) && (f = this.uniforms[h], f.bindTexture && !f.bound && f.bindTexture(g++))
    }
    this.shader.use(), this.shader.uniforms(this.uniforms), this.blend === "add" ? (this.gl.blendFunc(gl.SRC_ALPHA, gl.ONE), this.gl.enable(gl.BLEND)) : this.gl.disable(gl.BLEND), this.mesh.draw(this.shader), this.outputFBO && !this.nounbind && this.outputFBO.unbind();
    for (h in this.uniforms) {
      this.uniforms.hasOwnProperty(h) && (f = this.uniforms[h], f.bindTexture && f.bound && f.unbindTexture())
    }
  }, a.Kernel = b
}), define("main", ["require", "exports", "module", "game-shim", "engine/fragments", "engine/clock", "engine/input", "engine/utils", "engine/gl/shader", "engine/gl/geometry", "engine/gl/texture", "engine/gl/mesh", "engine/gl/context", "gl-matrix", "compute"], function (af, M, X) {
  function j(b, a, c) {
    document.getElementById("video").style.display = "block"
  }

  function B() {
    var a = new ac(ai, 32, 32, ai.FLOAT, ai.LUMINANCE);
    return a.supported
  }

  function Q() {
    F = document.getElementById("fluid_container"), ai = ag.initialize(F, {
      context: {
        depth: !1
      },
      debug: !1,
      extensions: {
        texture_float: !0
      }
    }, j), K = new J(F), H = new aj(F), q = new Z(ai, resources), window.gl = ai, H.mouseUp = function (b, a) {
      V(b, a)
    }, ai.getExtension("OES_texture_float_linear"), ab = B() ? ai.LUMINANCE : ai.RGBA, onresize, window.addEventListener("resize", ae(P, 250)), typeof FLUID_DEBUG != "undefined" && FLUID_DEBUG == 1 && D(), P()
  }

  function aa() {
    var b = document.querySelectorAll(".glass");
    G.divColor[0] = Math.round(G.divColor[0]), G.divColor[1] = Math.round(G.divColor[1]), G.divColor[2] = Math.round(G.divColor[2]), G.divColor[3] = Math.round(G.divColor[3] * 100) / 100;
    for (var a = 0; a < b.length; a++) {
      var c = b[a];
      c.style.backgroundColor = "rgba(" + G.divColor.join(",") + ")"
    }
    b = document.querySelectorAll(".grit");
    for (var a = 0; a < b.length; a++) {
      var c = b[a];
      c.style.opacity = G.divColor[3]
    }
  }

  function D() {
    R = new Stats, R.setMode(0), R.domElement.style.position = "absolute", R.domElement.style.left = "0px", R.domElement.style.top = "0px", document.body.appendChild(R.domElement)
  }

  function V(f, b) {
    advectVelocityKernel.uniforms.dt = G.step, advectVelocityKernel.run(), ad.set([10, 10], addForceKernel.uniforms.force), addForceKernel.run(), velocityBoundaryKernel.run(), divergenceKernel.run();
    var g = pressureFBO0,
      d = pressureFBO1,
      a = g;
    for (var c = 0; c < G.iterations * 2; c++) {
      jacobiKernel.uniforms.pressure = pressureBoundaryKernel.uniforms.pressure = g, jacobiKernel.outputFBO = pressureBoundaryKernel.outputFBO = d, jacobiKernel.run(), pressureBoundaryKernel.run(), a = g, g = d, d = a
    }
    subtractPressureGradientBoundaryKernel.run()
  }

  function z(h, f, l) {
    F.width = h, F.height = f, ai.viewport(0, 0, h, f), ai.lineWidth(1);
    var d = 1 / F.width,
      g = 1 / F.height,
      k = ad.create([d, g]);
    px1 = ad.create([1, F.width / F.height]), inside = new U(ai, {
      vertex: ah.screen_quad(1 - d * 2, 1 - g * 2),
      attributes: {
        position: {}
      }
    }), all = new U(ai, {
      vertex: ah.screen_quad(1, 1),
      attributes: {
        position: {}
      }
    }), boundary = new U(ai, {
      mode: ai.LINES,
      vertex: new Float32Array([-1 + d * 0, -1 + g * 0, -1 + d * 0, -1 + g * 2, 1 - d * 0, -1 + g * 0, 1 - d * 0, -1 + g * 2, -1 + d * 0, 1 - g * 0, -1 + d * 0, 1 - g * 2, 1 - d * 0, 1 - g * 0, 1 - d * 0, 1 - g * 2, -1 + d * 0, 1 - g * 0, -1 + d * 2, 1 - g * 0, -1 + d * 0, -1 + g * 0, -1 + d * 2, -1 + g * 0, 1 - d * 0, 1 - g * 0, 1 - d * 2, 1 - g * 0, 1 - d * 0, -1 + g * 0, 1 - d * 2, -1 + g * 0]),
      attributes: {
        position: {
          size: 2,
          stride: 16,
          offset: 0
        },
        offset: {
          size: 2,
          stride: 16,
          offset: 8
        }
      }
    }), velocityFBO0 = new ac(ai, h, f, ai.FLOAT), velocityFBO1 = new ac(ai, h, f, ai.FLOAT), divergenceFBO = new ac(ai, h, f, ai.FLOAT, l), pressureFBO0 = new ac(ai, h, f, ai.FLOAT, l), pressureFBO1 = new ac(ai, h, f, ai.FLOAT, l), advectVelocityKernel = new Y(ai, {
      shader: q.get("kernel", "advect"),
      mesh: inside,
      uniforms: {
        px: k,
        px1: px1,
        scale: 1,
        velocity: velocityFBO0,
        source: velocityFBO0,
        dt: G.step,
        tension: G.tension
      },
      output: velocityFBO1
    }), velocityBoundaryKernel = new Y(ai, {
      shader: q.get("boundary", "advect"),
      mesh: boundary,
      uniforms: {
        px: k,
        scale: -1,
        velocity: velocityFBO0,
        source: velocityFBO0,
        dt: 1 / 60,
        tension: G.tension
      },
      output: velocityFBO1
    }), cursor = new U(ai, {
      vertex: ah.screen_quad(d * G.cursor_size * 2, g * G.cursor_size * 2),
      attributes: {
        position: {}
      }
    }), addForceKernel = new Y(ai, {
      shader: q.get("cursor", "addForce"),
      mesh: cursor,
      blend: "add",
      uniforms: {
        px: k,
        force: ad.create([0.5, 0.2]),
        center: ad.create([0.1, 0.4]),
        scale: ad.create([G.cursor_size * d, G.cursor_size * g])
      },
      output: velocityFBO1
    }), divergenceKernel = new Y(ai, {
      shader: q.get("kernel", "divergence"),
      mesh: all,
      uniforms: {
        velocity: velocityFBO1,
        px: k,
        divergenceMagnifier: G.divergenceMagnifier
      },
      output: divergenceFBO
    }), jacobiKernel = new Y(ai, {
      shader: q.get("kernel", "jacobi"),
      mesh: all,
      nounbind: !0,
      uniforms: {
        pressure: pressureFBO0,
        divergence: divergenceFBO,
        alpha: -1,
        beta: 0.25,
        px: k
      },
      output: pressureFBO1
    }), pressureBoundaryKernel = new Y(ai, {
      shader: q.get("boundary", "jacobi"),
      mesh: boundary,
      nounbind: !0,
      nobind: !0,
      uniforms: {
        pressure: pressureFBO0,
        divergence: divergenceFBO,
        alpha: -1,
        beta: 0.25,
        px: k
      },
      output: pressureFBO1
    }), subtractPressureGradientKernel = new Y(ai, {
      shader: q.get("kernel", "subtractPressureGradient"),
      mesh: all,
      uniforms: {
        scale: 1,
        pressure: pressureFBO0,
        velocity: velocityFBO1,
        px: k
      },
      output: velocityFBO0
    }), subtractPressureGradientBoundaryKernel = new Y(ai, {
      shader: q.get("boundary", "subtractPressureGradient"),
      mesh: boundary,
      uniforms: {
        scale: -1,
        pressure: pressureFBO0,
        velocity: velocityFBO1,
        px: k
      },
      output: velocityFBO0
    }), drawKernel = new Y(ai, {
      shader: q.get("kernel", "visualize"),
      mesh: all,
      uniforms: {
        velocity: velocityFBO0,
        brightness: G.brightness,
        cursor_intensity: G.cursor_intensity
      },
      output: null
    });
    var c = H.mouse.x,
      b = H.mouse.y;
    K.ontick = function (v) {
      typeof FLUID_DEBUG != "undefined" && FLUID_DEBUG == 1 && R.begin();
      var x = H.mouse.x * G.resolution,
        m = H.mouse.y * G.resolution,
        i = x - c,
        u = m - b;
      c = x, b = m, c === 0 && b === 0 && (i = u = 0), advectVelocityKernel.uniforms.dt = G.step * 1, advectVelocityKernel.run(), ad.set([i * d * G.cursor_size * G.cursor_force, -u * g * G.cursor_size * G.cursor_force], addForceKernel.uniforms.force), ad.set([c * d * 2 - 1, (b * g * 2 - 1) * -1], addForceKernel.uniforms.center), addForceKernel.run(), velocityBoundaryKernel.run(), divergenceKernel.run();
      var r = pressureFBO0,
        w = pressureFBO1,
        s = r;
      for (var a = 0; a < G.iterations; a++) {
        jacobiKernel.uniforms.pressure = pressureBoundaryKernel.uniforms.pressure = r, jacobiKernel.outputFBO = pressureBoundaryKernel.outputFBO = w, jacobiKernel.run(), pressureBoundaryKernel.run(), s = r, r = w, w = s
      }
      subtractPressureGradientKernel.run(), subtractPressureGradientBoundaryKernel.run(), drawKernel.run(), typeof FLUID_DEBUG != "undefined" && FLUID_DEBUG == 1 && R.end()
    }
  }
  af("game-shim");
  var R, ab, P = function () {
    var b = F.getBoundingClientRect(),
      a = b.width * G.resolution,
      c = b.height * G.resolution;
    c = window.innerHeight * G.resolution, H.updateOffset(), z(a, c, ab)
  },
    W = af("engine/fragments"),
    J = af("engine/clock").Clock,
    aj = af("engine/input").Handler,
    ae = af("engine/utils").debounce,
    Z = af("engine/gl/shader").Manager,
    ah = af("engine/gl/geometry"),
    ac = af("engine/gl/texture").FBO,
    U = af("engine/gl/mesh").Mesh,
    ag = af("engine/gl/context"),
    I = af("gl-matrix"),
    Y = af("compute").Kernel,
    ad = I.vec2,
    F, ai, H, K, q, G = {
      iterations: 8,
      resolution: 0.25,
      step: 1 / 120,
      cursor_force: 2,
      cursor_intensity: 0.8,
      cursor_size: 30,
      brightness: 0.1,
      divergenceMagnifier: 0.75,
      tension: 0.995,
      divColor: [50, 50, 50, 0.3]
    };
  resources = W.resources, window.gl = ai, M.updateSize = P, this.init = Q, this.start = function () {
    K.start()
  }, this.stop = function () {
    K.stop()
  }, this.restart = function () {
    P(), K.start()
  }, window.FluidEffect = this
});
require(["main"]);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TouchEmulator = function () {
  function TouchEmulator() {
    _classCallCheck(this, TouchEmulator);
    this.touches = [];
  }
  TouchEmulator.prototype.touchstart = function touchstart(id, point) {
    var target = document.elementFromPoint(point.x, point.y);
    var touch = this.createTouch(id, target, point);
    this.touches.push(touch);
    this.triggerTouchEvent('touchstart', touch);
  };
  TouchEmulator.prototype.touchmove = function touchmove(id, point) {
    var index = this.touches.findIndex(function (t) {
      return t.identifier === id;
    });
    var target = this.touches[index].target;
    var touch = this.createTouch(id, target, point);
    this.touches[index] = touch;
    this.triggerTouchEvent('touchmove', touch);
  };
  TouchEmulator.prototype.touchend = function touchend(id, point) {
    var target = this.touches.find(function (t) {
      return t.identifier === id;
    }).target;
    var touch = this.createTouch(id, target, point);
    this.touches = this.touches.filter(function (t) {
      return t.identifier !== id;
    });

    this.triggerTouchEvent('touchend', touch);
  };
  TouchEmulator.prototype.createTouch = function createTouch(identifier, target, point) {
    return new Touch({
      identifier: identifier,
      target: target,
      clientX: point.x,
      clientY: point.y,
      pageX: point.x + window.pageXOffset,
      pageY: point.y + window.pageYOffset,
      radiusX: 10,
      radiusY: 10,
      force: 1
    });
  };
  TouchEmulator.prototype.triggerTouchEvent = function triggerTouchEvent(name, touch) {
    var targetTouches = this.touches.filter(function (t) {
      return t.target === touch.target;
    });
    var event = new TouchEvent(name, {
      touches: this.touches,
      targetTouches: targetTouches,
      changedTouches: [touch],
      bubbles: true,
      cancelable: true,
      view: window
    });
    touch.target.dispatchEvent(event);
  };
  return TouchEmulator;
}();

document.addEventListener("DOMContentLoaded", function (a) {

  var ua = navigator.userAgent.toLowerCase();
  var isiPhone = (ua.indexOf('iphone') > -1);
  var isiPad = (ua.indexOf('ipad') > -1);
  var isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
  var isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') == -1);
  if(!isiPhone && !isiPad && !isAndroid && !isAndroidTablet) {
    FluidEffect.init();
    FluidEffect.start()
  }

  // setTimeout(function() {
  //   var emulator = new TouchEmulator();
  //   emulator.touchstart(1, {x: 0, y: 0});
  //   emulator.touchmove(1, {x: 100, y: 100});
  // }, 1000);
});