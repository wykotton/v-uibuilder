var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, jquery = { exports: {} };
(function(r) {
  (function(i, u) {
    r.exports = i.document ? u(i, !0) : function(d) {
      if (!d.document)
        throw new Error("jQuery requires a window with a document");
      return u(d);
    };
  })(typeof window < "u" ? window : commonjsGlobal, function(i, u) {
    var d = [], h = Object.getPrototypeOf, p = d.slice, m = d.flat ? function(e) {
      return d.flat.call(e);
    } : function(e) {
      return d.concat.apply([], e);
    }, C = d.push, O = d.indexOf, D = {}, R = D.toString, M = D.hasOwnProperty, N = M.toString, Q = N.call(Object), B = {}, q = function(t) {
      return typeof t == "function" && typeof t.nodeType != "number" && typeof t.item != "function";
    }, ee = function(t) {
      return t != null && t === t.window;
    }, F = i.document, ue = {
      type: !0,
      src: !0,
      nonce: !0,
      noModule: !0
    };
    function Ae(e, t, n) {
      n = n || F;
      var a, s, f = n.createElement("script");
      if (f.text = e, t)
        for (a in ue)
          s = t[a] || t.getAttribute && t.getAttribute(a), s && f.setAttribute(a, s);
      n.head.appendChild(f).parentNode.removeChild(f);
    }
    function pe(e) {
      return e == null ? e + "" : typeof e == "object" || typeof e == "function" ? D[R.call(e)] || "object" : typeof e;
    }
    var X = "3.6.1", o = function(e, t) {
      return new o.fn.init(e, t);
    };
    o.fn = o.prototype = {
      jquery: X,
      constructor: o,
      length: 0,
      toArray: function() {
        return p.call(this);
      },
      get: function(e) {
        return e == null ? p.call(this) : e < 0 ? this[e + this.length] : this[e];
      },
      pushStack: function(e) {
        var t = o.merge(this.constructor(), e);
        return t.prevObject = this, t;
      },
      each: function(e) {
        return o.each(this, e);
      },
      map: function(e) {
        return this.pushStack(o.map(this, function(t, n) {
          return e.call(t, n, t);
        }));
      },
      slice: function() {
        return this.pushStack(p.apply(this, arguments));
      },
      first: function() {
        return this.eq(0);
      },
      last: function() {
        return this.eq(-1);
      },
      even: function() {
        return this.pushStack(o.grep(this, function(e, t) {
          return (t + 1) % 2;
        }));
      },
      odd: function() {
        return this.pushStack(o.grep(this, function(e, t) {
          return t % 2;
        }));
      },
      eq: function(e) {
        var t = this.length, n = +e + (e < 0 ? t : 0);
        return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      push: C,
      sort: d.sort,
      splice: d.splice
    }, o.extend = o.fn.extend = function() {
      var e, t, n, a, s, f, l = arguments[0] || {}, v = 1, g = arguments.length, x = !1;
      for (typeof l == "boolean" && (x = l, l = arguments[v] || {}, v++), typeof l != "object" && !q(l) && (l = {}), v === g && (l = this, v--); v < g; v++)
        if ((e = arguments[v]) != null)
          for (t in e)
            a = e[t], !(t === "__proto__" || l === a) && (x && a && (o.isPlainObject(a) || (s = Array.isArray(a))) ? (n = l[t], s && !Array.isArray(n) ? f = [] : !s && !o.isPlainObject(n) ? f = {} : f = n, s = !1, l[t] = o.extend(x, f, a)) : a !== void 0 && (l[t] = a));
      return l;
    }, o.extend({
      expando: "jQuery" + (X + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function(e) {
        throw new Error(e);
      },
      noop: function() {
      },
      isPlainObject: function(e) {
        var t, n;
        return !e || R.call(e) !== "[object Object]" ? !1 : (t = h(e), t ? (n = M.call(t, "constructor") && t.constructor, typeof n == "function" && N.call(n) === Q) : !0);
      },
      isEmptyObject: function(e) {
        var t;
        for (t in e)
          return !1;
        return !0;
      },
      globalEval: function(e, t, n) {
        Ae(e, { nonce: t && t.nonce }, n);
      },
      each: function(e, t) {
        var n, a = 0;
        if (nt(e))
          for (n = e.length; a < n && t.call(e[a], a, e[a]) !== !1; a++)
            ;
        else
          for (a in e)
            if (t.call(e[a], a, e[a]) === !1)
              break;
        return e;
      },
      makeArray: function(e, t) {
        var n = t || [];
        return e != null && (nt(Object(e)) ? o.merge(
          n,
          typeof e == "string" ? [e] : e
        ) : C.call(n, e)), n;
      },
      inArray: function(e, t, n) {
        return t == null ? -1 : O.call(t, e, n);
      },
      merge: function(e, t) {
        for (var n = +t.length, a = 0, s = e.length; a < n; a++)
          e[s++] = t[a];
        return e.length = s, e;
      },
      grep: function(e, t, n) {
        for (var a, s = [], f = 0, l = e.length, v = !n; f < l; f++)
          a = !t(e[f], f), a !== v && s.push(e[f]);
        return s;
      },
      map: function(e, t, n) {
        var a, s, f = 0, l = [];
        if (nt(e))
          for (a = e.length; f < a; f++)
            s = t(e[f], f, n), s != null && l.push(s);
        else
          for (f in e)
            s = t(e[f], f, n), s != null && l.push(s);
        return m(l);
      },
      guid: 1,
      support: B
    }), typeof Symbol == "function" && (o.fn[Symbol.iterator] = d[Symbol.iterator]), o.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
      function(e, t) {
        D["[object " + t + "]"] = t.toLowerCase();
      }
    );
    function nt(e) {
      var t = !!e && "length" in e && e.length, n = pe(e);
      return q(e) || ee(e) ? !1 : n === "array" || t === 0 || typeof t == "number" && t > 0 && t - 1 in e;
    }
    var Se = function(e) {
      var t, n, a, s, f, l, v, g, x, E, P, A, S, H, J, k, le, fe, me, re = "sizzle" + 1 * new Date(), K = e.document, ve = 0, Z = 0, se = _t(), ht = _t(), St = _t(), Te = _t(), We = function(c, y) {
        return c === y && (P = !0), 0;
      }, Ge = {}.hasOwnProperty, be = [], Fe = be.pop, Ee = be.push, Be = be.push, Ir = be.slice, Ve = function(c, y) {
        for (var b = 0, w = c.length; b < w; b++)
          if (c[b] === y)
            return b;
        return -1;
      }, Xt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", te = "[\\x20\\t\\r\\n\\f]", ze = "(?:\\\\[\\da-fA-F]{1,6}" + te + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", Mr = "\\[" + te + "*(" + ze + ")(?:" + te + "*([*^$|!~]?=)" + te + `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + ze + "))|)" + te + "*\\]", Kt = ":(" + ze + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Mr + ")*)|.*)\\)|)", kn = new RegExp(te + "+", "g"), wt = new RegExp("^" + te + "+|((?:^|[^\\\\])(?:\\\\.)*)" + te + "+$", "g"), Un = new RegExp("^" + te + "*," + te + "*"), qr = new RegExp("^" + te + "*([>+~]|" + te + ")" + te + "*"), Wn = new RegExp(te + "|>"), Gn = new RegExp(Kt), Vn = new RegExp("^" + ze + "$"), Ot = {
        ID: new RegExp("^#(" + ze + ")"),
        CLASS: new RegExp("^\\.(" + ze + ")"),
        TAG: new RegExp("^(" + ze + "|[*])"),
        ATTR: new RegExp("^" + Mr),
        PSEUDO: new RegExp("^" + Kt),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + te + "*(even|odd|(([+-]|)(\\d*)n|)" + te + "*(?:([+-]|)" + te + "*(\\d+)|))" + te + "*\\)|)", "i"),
        bool: new RegExp("^(?:" + Xt + ")$", "i"),
        needsContext: new RegExp("^" + te + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + te + "*((?:-\\d)?\\d*)" + te + "*\\)|)(?=[^-]|$)", "i")
      }, zn = /HTML$/i, Xn = /^(?:input|select|textarea|button)$/i, Kn = /^h\d$/i, gt = /^[^{]+\{\s*\[native \w/, Jn = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Jt = /[+~]/, Me = new RegExp("\\\\[\\da-fA-F]{1,6}" + te + "?|\\\\([^\\r\\n\\f])", "g"), qe = function(c, y) {
        var b = "0x" + c.slice(1) - 65536;
        return y || (b < 0 ? String.fromCharCode(b + 65536) : String.fromCharCode(b >> 10 | 55296, b & 1023 | 56320));
      }, Fr = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, Br = function(c, y) {
        return y ? c === "\0" ? "�" : c.slice(0, -1) + "\\" + c.charCodeAt(c.length - 1).toString(16) + " " : "\\" + c;
      }, Hr = function() {
        A();
      }, Yn = jt(
        function(c) {
          return c.disabled === !0 && c.nodeName.toLowerCase() === "fieldset";
        },
        { dir: "parentNode", next: "legend" }
      );
      try {
        Be.apply(
          be = Ir.call(K.childNodes),
          K.childNodes
        ), be[K.childNodes.length].nodeType;
      } catch {
        Be = {
          apply: be.length ? function(y, b) {
            Ee.apply(y, Ir.call(b));
          } : function(y, b) {
            for (var w = y.length, T = 0; y[w++] = b[T++]; )
              ;
            y.length = w - 1;
          }
        };
      }
      function ne(c, y, b, w) {
        var T, _, j, L, I, G, U, z = y && y.ownerDocument, Y = y ? y.nodeType : 9;
        if (b = b || [], typeof c != "string" || !c || Y !== 1 && Y !== 9 && Y !== 11)
          return b;
        if (!w && (A(y), y = y || S, J)) {
          if (Y !== 11 && (I = Jn.exec(c)))
            if (T = I[1]) {
              if (Y === 9)
                if (j = y.getElementById(T)) {
                  if (j.id === T)
                    return b.push(j), b;
                } else
                  return b;
              else if (z && (j = z.getElementById(T)) && me(y, j) && j.id === T)
                return b.push(j), b;
            } else {
              if (I[2])
                return Be.apply(b, y.getElementsByTagName(c)), b;
              if ((T = I[3]) && n.getElementsByClassName && y.getElementsByClassName)
                return Be.apply(b, y.getElementsByClassName(T)), b;
            }
          if (n.qsa && !Te[c + " "] && (!k || !k.test(c)) && (Y !== 1 || y.nodeName.toLowerCase() !== "object")) {
            if (U = c, z = y, Y === 1 && (Wn.test(c) || qr.test(c))) {
              for (z = Jt.test(c) && Qt(y.parentNode) || y, (z !== y || !n.scope) && ((L = y.getAttribute("id")) ? L = L.replace(Fr, Br) : y.setAttribute("id", L = re)), G = l(c), _ = G.length; _--; )
                G[_] = (L ? "#" + L : ":scope") + " " + Pt(G[_]);
              U = G.join(",");
            }
            try {
              return Be.apply(
                b,
                z.querySelectorAll(U)
              ), b;
            } catch {
              Te(c, !0);
            } finally {
              L === re && y.removeAttribute("id");
            }
          }
        }
        return g(c.replace(wt, "$1"), y, b, w);
      }
      function _t() {
        var c = [];
        function y(b, w) {
          return c.push(b + " ") > a.cacheLength && delete y[c.shift()], y[b + " "] = w;
        }
        return y;
      }
      function _e(c) {
        return c[re] = !0, c;
      }
      function Pe(c) {
        var y = S.createElement("fieldset");
        try {
          return !!c(y);
        } catch {
          return !1;
        } finally {
          y.parentNode && y.parentNode.removeChild(y), y = null;
        }
      }
      function Yt(c, y) {
        for (var b = c.split("|"), w = b.length; w--; )
          a.attrHandle[b[w]] = y;
      }
      function kr(c, y) {
        var b = y && c, w = b && c.nodeType === 1 && y.nodeType === 1 && c.sourceIndex - y.sourceIndex;
        if (w)
          return w;
        if (b) {
          for (; b = b.nextSibling; )
            if (b === y)
              return -1;
        }
        return c ? 1 : -1;
      }
      function Qn(c) {
        return function(y) {
          var b = y.nodeName.toLowerCase();
          return b === "input" && y.type === c;
        };
      }
      function Zn(c) {
        return function(y) {
          var b = y.nodeName.toLowerCase();
          return (b === "input" || b === "button") && y.type === c;
        };
      }
      function Ur(c) {
        return function(y) {
          return "form" in y ? y.parentNode && y.disabled === !1 ? "label" in y ? "label" in y.parentNode ? y.parentNode.disabled === c : y.disabled === c : y.isDisabled === c || y.isDisabled !== !c && Yn(y) === c : y.disabled === c : "label" in y ? y.disabled === c : !1;
        };
      }
      function Xe(c) {
        return _e(function(y) {
          return y = +y, _e(function(b, w) {
            for (var T, _ = c([], b.length, y), j = _.length; j--; )
              b[T = _[j]] && (b[T] = !(w[T] = b[T]));
          });
        });
      }
      function Qt(c) {
        return c && typeof c.getElementsByTagName < "u" && c;
      }
      n = ne.support = {}, f = ne.isXML = function(c) {
        var y = c && c.namespaceURI, b = c && (c.ownerDocument || c).documentElement;
        return !zn.test(y || b && b.nodeName || "HTML");
      }, A = ne.setDocument = function(c) {
        var y, b, w = c ? c.ownerDocument || c : K;
        return w == S || w.nodeType !== 9 || !w.documentElement || (S = w, H = S.documentElement, J = !f(S), K != S && (b = S.defaultView) && b.top !== b && (b.addEventListener ? b.addEventListener("unload", Hr, !1) : b.attachEvent && b.attachEvent("onunload", Hr)), n.scope = Pe(function(T) {
          return H.appendChild(T).appendChild(S.createElement("div")), typeof T.querySelectorAll < "u" && !T.querySelectorAll(":scope fieldset div").length;
        }), n.attributes = Pe(function(T) {
          return T.className = "i", !T.getAttribute("className");
        }), n.getElementsByTagName = Pe(function(T) {
          return T.appendChild(S.createComment("")), !T.getElementsByTagName("*").length;
        }), n.getElementsByClassName = gt.test(S.getElementsByClassName), n.getById = Pe(function(T) {
          return H.appendChild(T).id = re, !S.getElementsByName || !S.getElementsByName(re).length;
        }), n.getById ? (a.filter.ID = function(T) {
          var _ = T.replace(Me, qe);
          return function(j) {
            return j.getAttribute("id") === _;
          };
        }, a.find.ID = function(T, _) {
          if (typeof _.getElementById < "u" && J) {
            var j = _.getElementById(T);
            return j ? [j] : [];
          }
        }) : (a.filter.ID = function(T) {
          var _ = T.replace(Me, qe);
          return function(j) {
            var L = typeof j.getAttributeNode < "u" && j.getAttributeNode("id");
            return L && L.value === _;
          };
        }, a.find.ID = function(T, _) {
          if (typeof _.getElementById < "u" && J) {
            var j, L, I, G = _.getElementById(T);
            if (G) {
              if (j = G.getAttributeNode("id"), j && j.value === T)
                return [G];
              for (I = _.getElementsByName(T), L = 0; G = I[L++]; )
                if (j = G.getAttributeNode("id"), j && j.value === T)
                  return [G];
            }
            return [];
          }
        }), a.find.TAG = n.getElementsByTagName ? function(T, _) {
          if (typeof _.getElementsByTagName < "u")
            return _.getElementsByTagName(T);
          if (n.qsa)
            return _.querySelectorAll(T);
        } : function(T, _) {
          var j, L = [], I = 0, G = _.getElementsByTagName(T);
          if (T === "*") {
            for (; j = G[I++]; )
              j.nodeType === 1 && L.push(j);
            return L;
          }
          return G;
        }, a.find.CLASS = n.getElementsByClassName && function(T, _) {
          if (typeof _.getElementsByClassName < "u" && J)
            return _.getElementsByClassName(T);
        }, le = [], k = [], (n.qsa = gt.test(S.querySelectorAll)) && (Pe(function(T) {
          var _;
          H.appendChild(T).innerHTML = "<a id='" + re + "'></a><select id='" + re + "-\r\\' msallowcapture=''><option selected=''></option></select>", T.querySelectorAll("[msallowcapture^='']").length && k.push("[*^$]=" + te + `*(?:''|"")`), T.querySelectorAll("[selected]").length || k.push("\\[" + te + "*(?:value|" + Xt + ")"), T.querySelectorAll("[id~=" + re + "-]").length || k.push("~="), _ = S.createElement("input"), _.setAttribute("name", ""), T.appendChild(_), T.querySelectorAll("[name='']").length || k.push("\\[" + te + "*name" + te + "*=" + te + `*(?:''|"")`), T.querySelectorAll(":checked").length || k.push(":checked"), T.querySelectorAll("a#" + re + "+*").length || k.push(".#.+[+~]"), T.querySelectorAll("\\\f"), k.push("[\\r\\n\\f]");
        }), Pe(function(T) {
          T.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
          var _ = S.createElement("input");
          _.setAttribute("type", "hidden"), T.appendChild(_).setAttribute("name", "D"), T.querySelectorAll("[name=d]").length && k.push("name" + te + "*[*^$|!~]?="), T.querySelectorAll(":enabled").length !== 2 && k.push(":enabled", ":disabled"), H.appendChild(T).disabled = !0, T.querySelectorAll(":disabled").length !== 2 && k.push(":enabled", ":disabled"), T.querySelectorAll("*,:x"), k.push(",.*:");
        })), (n.matchesSelector = gt.test(fe = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && Pe(function(T) {
          n.disconnectedMatch = fe.call(T, "*"), fe.call(T, "[s!='']:x"), le.push("!=", Kt);
        }), k = k.length && new RegExp(k.join("|")), le = le.length && new RegExp(le.join("|")), y = gt.test(H.compareDocumentPosition), me = y || gt.test(H.contains) ? function(T, _) {
          var j = T.nodeType === 9 ? T.documentElement : T, L = _ && _.parentNode;
          return T === L || !!(L && L.nodeType === 1 && (j.contains ? j.contains(L) : T.compareDocumentPosition && T.compareDocumentPosition(L) & 16));
        } : function(T, _) {
          if (_) {
            for (; _ = _.parentNode; )
              if (_ === T)
                return !0;
          }
          return !1;
        }, We = y ? function(T, _) {
          if (T === _)
            return P = !0, 0;
          var j = !T.compareDocumentPosition - !_.compareDocumentPosition;
          return j || (j = (T.ownerDocument || T) == (_.ownerDocument || _) ? T.compareDocumentPosition(_) : 1, j & 1 || !n.sortDetached && _.compareDocumentPosition(T) === j ? T == S || T.ownerDocument == K && me(K, T) ? -1 : _ == S || _.ownerDocument == K && me(K, _) ? 1 : E ? Ve(E, T) - Ve(E, _) : 0 : j & 4 ? -1 : 1);
        } : function(T, _) {
          if (T === _)
            return P = !0, 0;
          var j, L = 0, I = T.parentNode, G = _.parentNode, U = [T], z = [_];
          if (!I || !G)
            return T == S ? -1 : _ == S ? 1 : I ? -1 : G ? 1 : E ? Ve(E, T) - Ve(E, _) : 0;
          if (I === G)
            return kr(T, _);
          for (j = T; j = j.parentNode; )
            U.unshift(j);
          for (j = _; j = j.parentNode; )
            z.unshift(j);
          for (; U[L] === z[L]; )
            L++;
          return L ? kr(U[L], z[L]) : U[L] == K ? -1 : z[L] == K ? 1 : 0;
        }), S;
      }, ne.matches = function(c, y) {
        return ne(c, null, null, y);
      }, ne.matchesSelector = function(c, y) {
        if (A(c), n.matchesSelector && J && !Te[y + " "] && (!le || !le.test(y)) && (!k || !k.test(y)))
          try {
            var b = fe.call(c, y);
            if (b || n.disconnectedMatch || c.document && c.document.nodeType !== 11)
              return b;
          } catch {
            Te(y, !0);
          }
        return ne(y, S, null, [c]).length > 0;
      }, ne.contains = function(c, y) {
        return (c.ownerDocument || c) != S && A(c), me(c, y);
      }, ne.attr = function(c, y) {
        (c.ownerDocument || c) != S && A(c);
        var b = a.attrHandle[y.toLowerCase()], w = b && Ge.call(a.attrHandle, y.toLowerCase()) ? b(c, y, !J) : void 0;
        return w !== void 0 ? w : n.attributes || !J ? c.getAttribute(y) : (w = c.getAttributeNode(y)) && w.specified ? w.value : null;
      }, ne.escape = function(c) {
        return (c + "").replace(Fr, Br);
      }, ne.error = function(c) {
        throw new Error("Syntax error, unrecognized expression: " + c);
      }, ne.uniqueSort = function(c) {
        var y, b = [], w = 0, T = 0;
        if (P = !n.detectDuplicates, E = !n.sortStable && c.slice(0), c.sort(We), P) {
          for (; y = c[T++]; )
            y === c[T] && (w = b.push(T));
          for (; w--; )
            c.splice(b[w], 1);
        }
        return E = null, c;
      }, s = ne.getText = function(c) {
        var y, b = "", w = 0, T = c.nodeType;
        if (T) {
          if (T === 1 || T === 9 || T === 11) {
            if (typeof c.textContent == "string")
              return c.textContent;
            for (c = c.firstChild; c; c = c.nextSibling)
              b += s(c);
          } else if (T === 3 || T === 4)
            return c.nodeValue;
        } else
          for (; y = c[w++]; )
            b += s(y);
        return b;
      }, a = ne.selectors = {
        cacheLength: 50,
        createPseudo: _e,
        match: Ot,
        attrHandle: {},
        find: {},
        relative: {
          ">": { dir: "parentNode", first: !0 },
          " ": { dir: "parentNode" },
          "+": { dir: "previousSibling", first: !0 },
          "~": { dir: "previousSibling" }
        },
        preFilter: {
          ATTR: function(c) {
            return c[1] = c[1].replace(Me, qe), c[3] = (c[3] || c[4] || c[5] || "").replace(Me, qe), c[2] === "~=" && (c[3] = " " + c[3] + " "), c.slice(0, 4);
          },
          CHILD: function(c) {
            return c[1] = c[1].toLowerCase(), c[1].slice(0, 3) === "nth" ? (c[3] || ne.error(c[0]), c[4] = +(c[4] ? c[5] + (c[6] || 1) : 2 * (c[3] === "even" || c[3] === "odd")), c[5] = +(c[7] + c[8] || c[3] === "odd")) : c[3] && ne.error(c[0]), c;
          },
          PSEUDO: function(c) {
            var y, b = !c[6] && c[2];
            return Ot.CHILD.test(c[0]) ? null : (c[3] ? c[2] = c[4] || c[5] || "" : b && Gn.test(b) && (y = l(b, !0)) && (y = b.indexOf(")", b.length - y) - b.length) && (c[0] = c[0].slice(0, y), c[2] = b.slice(0, y)), c.slice(0, 3));
          }
        },
        filter: {
          TAG: function(c) {
            var y = c.replace(Me, qe).toLowerCase();
            return c === "*" ? function() {
              return !0;
            } : function(b) {
              return b.nodeName && b.nodeName.toLowerCase() === y;
            };
          },
          CLASS: function(c) {
            var y = se[c + " "];
            return y || (y = new RegExp("(^|" + te + ")" + c + "(" + te + "|$)")) && se(
              c,
              function(b) {
                return y.test(
                  typeof b.className == "string" && b.className || typeof b.getAttribute < "u" && b.getAttribute("class") || ""
                );
              }
            );
          },
          ATTR: function(c, y, b) {
            return function(w) {
              var T = ne.attr(w, c);
              return T == null ? y === "!=" : y ? (T += "", y === "=" ? T === b : y === "!=" ? T !== b : y === "^=" ? b && T.indexOf(b) === 0 : y === "*=" ? b && T.indexOf(b) > -1 : y === "$=" ? b && T.slice(-b.length) === b : y === "~=" ? (" " + T.replace(kn, " ") + " ").indexOf(b) > -1 : y === "|=" ? T === b || T.slice(0, b.length + 1) === b + "-" : !1) : !0;
            };
          },
          CHILD: function(c, y, b, w, T) {
            var _ = c.slice(0, 3) !== "nth", j = c.slice(-4) !== "last", L = y === "of-type";
            return w === 1 && T === 0 ? function(I) {
              return !!I.parentNode;
            } : function(I, G, U) {
              var z, Y, ie, V, ce, de, $e = _ !== j ? "nextSibling" : "previousSibling", oe = I.parentNode, yt = L && I.nodeName.toLowerCase(), vt = !U && !L, xe = !1;
              if (oe) {
                if (_) {
                  for (; $e; ) {
                    for (V = I; V = V[$e]; )
                      if (L ? V.nodeName.toLowerCase() === yt : V.nodeType === 1)
                        return !1;
                    de = $e = c === "only" && !de && "nextSibling";
                  }
                  return !0;
                }
                if (de = [j ? oe.firstChild : oe.lastChild], j && vt) {
                  for (V = oe, ie = V[re] || (V[re] = {}), Y = ie[V.uniqueID] || (ie[V.uniqueID] = {}), z = Y[c] || [], ce = z[0] === ve && z[1], xe = ce && z[2], V = ce && oe.childNodes[ce]; V = ++ce && V && V[$e] || (xe = ce = 0) || de.pop(); )
                    if (V.nodeType === 1 && ++xe && V === I) {
                      Y[c] = [ve, ce, xe];
                      break;
                    }
                } else if (vt && (V = I, ie = V[re] || (V[re] = {}), Y = ie[V.uniqueID] || (ie[V.uniqueID] = {}), z = Y[c] || [], ce = z[0] === ve && z[1], xe = ce), xe === !1)
                  for (; (V = ++ce && V && V[$e] || (xe = ce = 0) || de.pop()) && !((L ? V.nodeName.toLowerCase() === yt : V.nodeType === 1) && ++xe && (vt && (ie = V[re] || (V[re] = {}), Y = ie[V.uniqueID] || (ie[V.uniqueID] = {}), Y[c] = [ve, xe]), V === I)); )
                    ;
                return xe -= T, xe === w || xe % w === 0 && xe / w >= 0;
              }
            };
          },
          PSEUDO: function(c, y) {
            var b, w = a.pseudos[c] || a.setFilters[c.toLowerCase()] || ne.error("unsupported pseudo: " + c);
            return w[re] ? w(y) : w.length > 1 ? (b = [c, c, "", y], a.setFilters.hasOwnProperty(c.toLowerCase()) ? _e(function(T, _) {
              for (var j, L = w(T, y), I = L.length; I--; )
                j = Ve(T, L[I]), T[j] = !(_[j] = L[I]);
            }) : function(T) {
              return w(T, 0, b);
            }) : w;
          }
        },
        pseudos: {
          not: _e(function(c) {
            var y = [], b = [], w = v(c.replace(wt, "$1"));
            return w[re] ? _e(function(T, _, j, L) {
              for (var I, G = w(T, null, L, []), U = T.length; U--; )
                (I = G[U]) && (T[U] = !(_[U] = I));
            }) : function(T, _, j) {
              return y[0] = T, w(y, null, j, b), y[0] = null, !b.pop();
            };
          }),
          has: _e(function(c) {
            return function(y) {
              return ne(c, y).length > 0;
            };
          }),
          contains: _e(function(c) {
            return c = c.replace(Me, qe), function(y) {
              return (y.textContent || s(y)).indexOf(c) > -1;
            };
          }),
          lang: _e(function(c) {
            return Vn.test(c || "") || ne.error("unsupported lang: " + c), c = c.replace(Me, qe).toLowerCase(), function(y) {
              var b;
              do
                if (b = J ? y.lang : y.getAttribute("xml:lang") || y.getAttribute("lang"))
                  return b = b.toLowerCase(), b === c || b.indexOf(c + "-") === 0;
              while ((y = y.parentNode) && y.nodeType === 1);
              return !1;
            };
          }),
          target: function(c) {
            var y = e.location && e.location.hash;
            return y && y.slice(1) === c.id;
          },
          root: function(c) {
            return c === H;
          },
          focus: function(c) {
            return c === S.activeElement && (!S.hasFocus || S.hasFocus()) && !!(c.type || c.href || ~c.tabIndex);
          },
          enabled: Ur(!1),
          disabled: Ur(!0),
          checked: function(c) {
            var y = c.nodeName.toLowerCase();
            return y === "input" && !!c.checked || y === "option" && !!c.selected;
          },
          selected: function(c) {
            return c.parentNode && c.parentNode.selectedIndex, c.selected === !0;
          },
          empty: function(c) {
            for (c = c.firstChild; c; c = c.nextSibling)
              if (c.nodeType < 6)
                return !1;
            return !0;
          },
          parent: function(c) {
            return !a.pseudos.empty(c);
          },
          header: function(c) {
            return Kn.test(c.nodeName);
          },
          input: function(c) {
            return Xn.test(c.nodeName);
          },
          button: function(c) {
            var y = c.nodeName.toLowerCase();
            return y === "input" && c.type === "button" || y === "button";
          },
          text: function(c) {
            var y;
            return c.nodeName.toLowerCase() === "input" && c.type === "text" && ((y = c.getAttribute("type")) == null || y.toLowerCase() === "text");
          },
          first: Xe(function() {
            return [0];
          }),
          last: Xe(function(c, y) {
            return [y - 1];
          }),
          eq: Xe(function(c, y, b) {
            return [b < 0 ? b + y : b];
          }),
          even: Xe(function(c, y) {
            for (var b = 0; b < y; b += 2)
              c.push(b);
            return c;
          }),
          odd: Xe(function(c, y) {
            for (var b = 1; b < y; b += 2)
              c.push(b);
            return c;
          }),
          lt: Xe(function(c, y, b) {
            for (var w = b < 0 ? b + y : b > y ? y : b; --w >= 0; )
              c.push(w);
            return c;
          }),
          gt: Xe(function(c, y, b) {
            for (var w = b < 0 ? b + y : b; ++w < y; )
              c.push(w);
            return c;
          })
        }
      }, a.pseudos.nth = a.pseudos.eq;
      for (t in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
        a.pseudos[t] = Qn(t);
      for (t in { submit: !0, reset: !0 })
        a.pseudos[t] = Zn(t);
      function Wr() {
      }
      Wr.prototype = a.filters = a.pseudos, a.setFilters = new Wr(), l = ne.tokenize = function(c, y) {
        var b, w, T, _, j, L, I, G = ht[c + " "];
        if (G)
          return y ? 0 : G.slice(0);
        for (j = c, L = [], I = a.preFilter; j; ) {
          (!b || (w = Un.exec(j))) && (w && (j = j.slice(w[0].length) || j), L.push(T = [])), b = !1, (w = qr.exec(j)) && (b = w.shift(), T.push({
            value: b,
            type: w[0].replace(wt, " ")
          }), j = j.slice(b.length));
          for (_ in a.filter)
            (w = Ot[_].exec(j)) && (!I[_] || (w = I[_](w))) && (b = w.shift(), T.push({
              value: b,
              type: _,
              matches: w
            }), j = j.slice(b.length));
          if (!b)
            break;
        }
        return y ? j.length : j ? ne.error(c) : ht(c, L).slice(0);
      };
      function Pt(c) {
        for (var y = 0, b = c.length, w = ""; y < b; y++)
          w += c[y].value;
        return w;
      }
      function jt(c, y, b) {
        var w = y.dir, T = y.next, _ = T || w, j = b && _ === "parentNode", L = Z++;
        return y.first ? function(I, G, U) {
          for (; I = I[w]; )
            if (I.nodeType === 1 || j)
              return c(I, G, U);
          return !1;
        } : function(I, G, U) {
          var z, Y, ie, V = [ve, L];
          if (U) {
            for (; I = I[w]; )
              if ((I.nodeType === 1 || j) && c(I, G, U))
                return !0;
          } else
            for (; I = I[w]; )
              if (I.nodeType === 1 || j)
                if (ie = I[re] || (I[re] = {}), Y = ie[I.uniqueID] || (ie[I.uniqueID] = {}), T && T === I.nodeName.toLowerCase())
                  I = I[w] || I;
                else {
                  if ((z = Y[_]) && z[0] === ve && z[1] === L)
                    return V[2] = z[2];
                  if (Y[_] = V, V[2] = c(I, G, U))
                    return !0;
                }
          return !1;
        };
      }
      function Zt(c) {
        return c.length > 1 ? function(y, b, w) {
          for (var T = c.length; T--; )
            if (!c[T](y, b, w))
              return !1;
          return !0;
        } : c[0];
      }
      function ei(c, y, b) {
        for (var w = 0, T = y.length; w < T; w++)
          ne(c, y[w], b);
        return b;
      }
      function Nt(c, y, b, w, T) {
        for (var _, j = [], L = 0, I = c.length, G = y != null; L < I; L++)
          (_ = c[L]) && (!b || b(_, w, T)) && (j.push(_), G && y.push(L));
        return j;
      }
      function er(c, y, b, w, T, _) {
        return w && !w[re] && (w = er(w)), T && !T[re] && (T = er(T, _)), _e(function(j, L, I, G) {
          var U, z, Y, ie = [], V = [], ce = L.length, de = j || ei(
            y || "*",
            I.nodeType ? [I] : I,
            []
          ), $e = c && (j || !y) ? Nt(de, ie, c, I, G) : de, oe = b ? T || (j ? c : ce || w) ? [] : L : $e;
          if (b && b($e, oe, I, G), w)
            for (U = Nt(oe, V), w(U, [], I, G), z = U.length; z--; )
              (Y = U[z]) && (oe[V[z]] = !($e[V[z]] = Y));
          if (j) {
            if (T || c) {
              if (T) {
                for (U = [], z = oe.length; z--; )
                  (Y = oe[z]) && U.push($e[z] = Y);
                T(null, oe = [], U, G);
              }
              for (z = oe.length; z--; )
                (Y = oe[z]) && (U = T ? Ve(j, Y) : ie[z]) > -1 && (j[U] = !(L[U] = Y));
            }
          } else
            oe = Nt(
              oe === L ? oe.splice(ce, oe.length) : oe
            ), T ? T(null, L, oe, G) : Be.apply(L, oe);
        });
      }
      function tr(c) {
        for (var y, b, w, T = c.length, _ = a.relative[c[0].type], j = _ || a.relative[" "], L = _ ? 1 : 0, I = jt(function(z) {
          return z === y;
        }, j, !0), G = jt(function(z) {
          return Ve(y, z) > -1;
        }, j, !0), U = [function(z, Y, ie) {
          var V = !_ && (ie || Y !== x) || ((y = Y).nodeType ? I(z, Y, ie) : G(z, Y, ie));
          return y = null, V;
        }]; L < T; L++)
          if (b = a.relative[c[L].type])
            U = [jt(Zt(U), b)];
          else {
            if (b = a.filter[c[L].type].apply(null, c[L].matches), b[re]) {
              for (w = ++L; w < T && !a.relative[c[w].type]; w++)
                ;
              return er(
                L > 1 && Zt(U),
                L > 1 && Pt(
                  c.slice(0, L - 1).concat({ value: c[L - 2].type === " " ? "*" : "" })
                ).replace(wt, "$1"),
                b,
                L < w && tr(c.slice(L, w)),
                w < T && tr(c = c.slice(w)),
                w < T && Pt(c)
              );
            }
            U.push(b);
          }
        return Zt(U);
      }
      function ti(c, y) {
        var b = y.length > 0, w = c.length > 0, T = function(_, j, L, I, G) {
          var U, z, Y, ie = 0, V = "0", ce = _ && [], de = [], $e = x, oe = _ || w && a.find.TAG("*", G), yt = ve += $e == null ? 1 : Math.random() || 0.1, vt = oe.length;
          for (G && (x = j == S || j || G); V !== vt && (U = oe[V]) != null; V++) {
            if (w && U) {
              for (z = 0, !j && U.ownerDocument != S && (A(U), L = !J); Y = c[z++]; )
                if (Y(U, j || S, L)) {
                  I.push(U);
                  break;
                }
              G && (ve = yt);
            }
            b && ((U = !Y && U) && ie--, _ && ce.push(U));
          }
          if (ie += V, b && V !== ie) {
            for (z = 0; Y = y[z++]; )
              Y(ce, de, j, L);
            if (_) {
              if (ie > 0)
                for (; V--; )
                  ce[V] || de[V] || (de[V] = Fe.call(I));
              de = Nt(de);
            }
            Be.apply(I, de), G && !_ && de.length > 0 && ie + y.length > 1 && ne.uniqueSort(I);
          }
          return G && (ve = yt, x = $e), ce;
        };
        return b ? _e(T) : T;
      }
      return v = ne.compile = function(c, y) {
        var b, w = [], T = [], _ = St[c + " "];
        if (!_) {
          for (y || (y = l(c)), b = y.length; b--; )
            _ = tr(y[b]), _[re] ? w.push(_) : T.push(_);
          _ = St(
            c,
            ti(T, w)
          ), _.selector = c;
        }
        return _;
      }, g = ne.select = function(c, y, b, w) {
        var T, _, j, L, I, G = typeof c == "function" && c, U = !w && l(c = G.selector || c);
        if (b = b || [], U.length === 1) {
          if (_ = U[0] = U[0].slice(0), _.length > 2 && (j = _[0]).type === "ID" && y.nodeType === 9 && J && a.relative[_[1].type]) {
            if (y = (a.find.ID(j.matches[0].replace(Me, qe), y) || [])[0], y)
              G && (y = y.parentNode);
            else
              return b;
            c = c.slice(_.shift().value.length);
          }
          for (T = Ot.needsContext.test(c) ? 0 : _.length; T-- && (j = _[T], !a.relative[L = j.type]); )
            if ((I = a.find[L]) && (w = I(
              j.matches[0].replace(Me, qe),
              Jt.test(_[0].type) && Qt(y.parentNode) || y
            ))) {
              if (_.splice(T, 1), c = w.length && Pt(_), !c)
                return Be.apply(b, w), b;
              break;
            }
        }
        return (G || v(c, U))(
          w,
          y,
          !J,
          b,
          !y || Jt.test(c) && Qt(y.parentNode) || y
        ), b;
      }, n.sortStable = re.split("").sort(We).join("") === re, n.detectDuplicates = !!P, A(), n.sortDetached = Pe(function(c) {
        return c.compareDocumentPosition(S.createElement("fieldset")) & 1;
      }), Pe(function(c) {
        return c.innerHTML = "<a href='#'></a>", c.firstChild.getAttribute("href") === "#";
      }) || Yt("type|href|height|width", function(c, y, b) {
        if (!b)
          return c.getAttribute(y, y.toLowerCase() === "type" ? 1 : 2);
      }), (!n.attributes || !Pe(function(c) {
        return c.innerHTML = "<input/>", c.firstChild.setAttribute("value", ""), c.firstChild.getAttribute("value") === "";
      })) && Yt("value", function(c, y, b) {
        if (!b && c.nodeName.toLowerCase() === "input")
          return c.defaultValue;
      }), Pe(function(c) {
        return c.getAttribute("disabled") == null;
      }) || Yt(Xt, function(c, y, b) {
        var w;
        if (!b)
          return c[y] === !0 ? y.toLowerCase() : (w = c.getAttributeNode(y)) && w.specified ? w.value : null;
      }), ne;
    }(i);
    o.find = Se, o.expr = Se.selectors, o.expr[":"] = o.expr.pseudos, o.uniqueSort = o.unique = Se.uniqueSort, o.text = Se.getText, o.isXMLDoc = Se.isXML, o.contains = Se.contains, o.escapeSelector = Se.escape;
    var De = function(e, t, n) {
      for (var a = [], s = n !== void 0; (e = e[t]) && e.nodeType !== 9; )
        if (e.nodeType === 1) {
          if (s && o(e).is(n))
            break;
          a.push(e);
        }
      return a;
    }, it = function(e, t) {
      for (var n = []; e; e = e.nextSibling)
        e.nodeType === 1 && e !== t && n.push(e);
      return n;
    }, Ke = o.expr.match.needsContext;
    function ae(e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    }
    var Re = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function we(e, t, n) {
      return q(t) ? o.grep(e, function(a, s) {
        return !!t.call(a, s, a) !== n;
      }) : t.nodeType ? o.grep(e, function(a) {
        return a === t !== n;
      }) : typeof t != "string" ? o.grep(e, function(a) {
        return O.call(t, a) > -1 !== n;
      }) : o.filter(t, e, n);
    }
    o.filter = function(e, t, n) {
      var a = t[0];
      return n && (e = ":not(" + e + ")"), t.length === 1 && a.nodeType === 1 ? o.find.matchesSelector(a, e) ? [a] : [] : o.find.matches(e, o.grep(t, function(s) {
        return s.nodeType === 1;
      }));
    }, o.fn.extend({
      find: function(e) {
        var t, n, a = this.length, s = this;
        if (typeof e != "string")
          return this.pushStack(o(e).filter(function() {
            for (t = 0; t < a; t++)
              if (o.contains(s[t], this))
                return !0;
          }));
        for (n = this.pushStack([]), t = 0; t < a; t++)
          o.find(e, s[t], n);
        return a > 1 ? o.uniqueSort(n) : n;
      },
      filter: function(e) {
        return this.pushStack(we(this, e || [], !1));
      },
      not: function(e) {
        return this.pushStack(we(this, e || [], !0));
      },
      is: function(e) {
        return !!we(
          this,
          typeof e == "string" && Ke.test(e) ? o(e) : e || [],
          !1
        ).length;
      }
    });
    var bt, at = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, Gr = o.fn.init = function(e, t, n) {
      var a, s;
      if (!e)
        return this;
      if (n = n || bt, typeof e == "string")
        if (e[0] === "<" && e[e.length - 1] === ">" && e.length >= 3 ? a = [null, e, null] : a = at.exec(e), a && (a[1] || !t))
          if (a[1]) {
            if (t = t instanceof o ? t[0] : t, o.merge(this, o.parseHTML(
              a[1],
              t && t.nodeType ? t.ownerDocument || t : F,
              !0
            )), Re.test(a[1]) && o.isPlainObject(t))
              for (a in t)
                q(this[a]) ? this[a](t[a]) : this.attr(a, t[a]);
            return this;
          } else
            return s = F.getElementById(a[2]), s && (this[0] = s, this.length = 1), this;
        else
          return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
      else {
        if (e.nodeType)
          return this[0] = e, this.length = 1, this;
        if (q(e))
          return n.ready !== void 0 ? n.ready(e) : e(o);
      }
      return o.makeArray(e, this);
    };
    Gr.prototype = o.fn, bt = o(F);
    var Vr = /^(?:parents|prev(?:Until|All))/, zr = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
    o.fn.extend({
      has: function(e) {
        var t = o(e, this), n = t.length;
        return this.filter(function() {
          for (var a = 0; a < n; a++)
            if (o.contains(this, t[a]))
              return !0;
        });
      },
      closest: function(e, t) {
        var n, a = 0, s = this.length, f = [], l = typeof e != "string" && o(e);
        if (!Ke.test(e)) {
          for (; a < s; a++)
            for (n = this[a]; n && n !== t; n = n.parentNode)
              if (n.nodeType < 11 && (l ? l.index(n) > -1 : n.nodeType === 1 && o.find.matchesSelector(n, e))) {
                f.push(n);
                break;
              }
        }
        return this.pushStack(f.length > 1 ? o.uniqueSort(f) : f);
      },
      index: function(e) {
        return e ? typeof e == "string" ? O.call(o(e), this[0]) : O.call(
          this,
          e.jquery ? e[0] : e
        ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      },
      add: function(e, t) {
        return this.pushStack(
          o.uniqueSort(
            o.merge(this.get(), o(e, t))
          )
        );
      },
      addBack: function(e) {
        return this.add(
          e == null ? this.prevObject : this.prevObject.filter(e)
        );
      }
    });
    function rr(e, t) {
      for (; (e = e[t]) && e.nodeType !== 1; )
        ;
      return e;
    }
    o.each({
      parent: function(e) {
        var t = e.parentNode;
        return t && t.nodeType !== 11 ? t : null;
      },
      parents: function(e) {
        return De(e, "parentNode");
      },
      parentsUntil: function(e, t, n) {
        return De(e, "parentNode", n);
      },
      next: function(e) {
        return rr(e, "nextSibling");
      },
      prev: function(e) {
        return rr(e, "previousSibling");
      },
      nextAll: function(e) {
        return De(e, "nextSibling");
      },
      prevAll: function(e) {
        return De(e, "previousSibling");
      },
      nextUntil: function(e, t, n) {
        return De(e, "nextSibling", n);
      },
      prevUntil: function(e, t, n) {
        return De(e, "previousSibling", n);
      },
      siblings: function(e) {
        return it((e.parentNode || {}).firstChild, e);
      },
      children: function(e) {
        return it(e.firstChild);
      },
      contents: function(e) {
        return e.contentDocument != null && h(e.contentDocument) ? e.contentDocument : (ae(e, "template") && (e = e.content || e), o.merge([], e.childNodes));
      }
    }, function(e, t) {
      o.fn[e] = function(n, a) {
        var s = o.map(this, t, n);
        return e.slice(-5) !== "Until" && (a = n), a && typeof a == "string" && (s = o.filter(a, s)), this.length > 1 && (zr[e] || o.uniqueSort(s), Vr.test(e) && s.reverse()), this.pushStack(s);
      };
    });
    var je = /[^\x20\t\r\n\f]+/g;
    function Xr(e) {
      var t = {};
      return o.each(e.match(je) || [], function(n, a) {
        t[a] = !0;
      }), t;
    }
    o.Callbacks = function(e) {
      e = typeof e == "string" ? Xr(e) : o.extend({}, e);
      var t, n, a, s, f = [], l = [], v = -1, g = function() {
        for (s = s || e.once, a = t = !0; l.length; v = -1)
          for (n = l.shift(); ++v < f.length; )
            f[v].apply(n[0], n[1]) === !1 && e.stopOnFalse && (v = f.length, n = !1);
        e.memory || (n = !1), t = !1, s && (n ? f = [] : f = "");
      }, x = {
        add: function() {
          return f && (n && !t && (v = f.length - 1, l.push(n)), function E(P) {
            o.each(P, function(A, S) {
              q(S) ? (!e.unique || !x.has(S)) && f.push(S) : S && S.length && pe(S) !== "string" && E(S);
            });
          }(arguments), n && !t && g()), this;
        },
        remove: function() {
          return o.each(arguments, function(E, P) {
            for (var A; (A = o.inArray(P, f, A)) > -1; )
              f.splice(A, 1), A <= v && v--;
          }), this;
        },
        has: function(E) {
          return E ? o.inArray(E, f) > -1 : f.length > 0;
        },
        empty: function() {
          return f && (f = []), this;
        },
        disable: function() {
          return s = l = [], f = n = "", this;
        },
        disabled: function() {
          return !f;
        },
        lock: function() {
          return s = l = [], !n && !t && (f = n = ""), this;
        },
        locked: function() {
          return !!s;
        },
        fireWith: function(E, P) {
          return s || (P = P || [], P = [E, P.slice ? P.slice() : P], l.push(P), t || g()), this;
        },
        fire: function() {
          return x.fireWith(this, arguments), this;
        },
        fired: function() {
          return !!a;
        }
      };
      return x;
    };
    function Je(e) {
      return e;
    }
    function mt(e) {
      throw e;
    }
    function nr(e, t, n, a) {
      var s;
      try {
        e && q(s = e.promise) ? s.call(e).done(t).fail(n) : e && q(s = e.then) ? s.call(e, t, n) : t.apply(void 0, [e].slice(a));
      } catch (f) {
        n.apply(void 0, [f]);
      }
    }
    o.extend({
      Deferred: function(e) {
        var t = [
          [
            "notify",
            "progress",
            o.Callbacks("memory"),
            o.Callbacks("memory"),
            2
          ],
          [
            "resolve",
            "done",
            o.Callbacks("once memory"),
            o.Callbacks("once memory"),
            0,
            "resolved"
          ],
          [
            "reject",
            "fail",
            o.Callbacks("once memory"),
            o.Callbacks("once memory"),
            1,
            "rejected"
          ]
        ], n = "pending", a = {
          state: function() {
            return n;
          },
          always: function() {
            return s.done(arguments).fail(arguments), this;
          },
          catch: function(f) {
            return a.then(null, f);
          },
          pipe: function() {
            var f = arguments;
            return o.Deferred(function(l) {
              o.each(t, function(v, g) {
                var x = q(f[g[4]]) && f[g[4]];
                s[g[1]](function() {
                  var E = x && x.apply(this, arguments);
                  E && q(E.promise) ? E.promise().progress(l.notify).done(l.resolve).fail(l.reject) : l[g[0] + "With"](
                    this,
                    x ? [E] : arguments
                  );
                });
              }), f = null;
            }).promise();
          },
          then: function(f, l, v) {
            var g = 0;
            function x(E, P, A, S) {
              return function() {
                var H = this, J = arguments, k = function() {
                  var fe, me;
                  if (!(E < g)) {
                    if (fe = A.apply(H, J), fe === P.promise())
                      throw new TypeError("Thenable self-resolution");
                    me = fe && (typeof fe == "object" || typeof fe == "function") && fe.then, q(me) ? S ? me.call(
                      fe,
                      x(g, P, Je, S),
                      x(g, P, mt, S)
                    ) : (g++, me.call(
                      fe,
                      x(g, P, Je, S),
                      x(g, P, mt, S),
                      x(
                        g,
                        P,
                        Je,
                        P.notifyWith
                      )
                    )) : (A !== Je && (H = void 0, J = [fe]), (S || P.resolveWith)(H, J));
                  }
                }, le = S ? k : function() {
                  try {
                    k();
                  } catch (fe) {
                    o.Deferred.exceptionHook && o.Deferred.exceptionHook(
                      fe,
                      le.stackTrace
                    ), E + 1 >= g && (A !== mt && (H = void 0, J = [fe]), P.rejectWith(H, J));
                  }
                };
                E ? le() : (o.Deferred.getStackHook && (le.stackTrace = o.Deferred.getStackHook()), i.setTimeout(le));
              };
            }
            return o.Deferred(function(E) {
              t[0][3].add(
                x(
                  0,
                  E,
                  q(v) ? v : Je,
                  E.notifyWith
                )
              ), t[1][3].add(
                x(
                  0,
                  E,
                  q(f) ? f : Je
                )
              ), t[2][3].add(
                x(
                  0,
                  E,
                  q(l) ? l : mt
                )
              );
            }).promise();
          },
          promise: function(f) {
            return f != null ? o.extend(f, a) : a;
          }
        }, s = {};
        return o.each(t, function(f, l) {
          var v = l[2], g = l[5];
          a[l[1]] = v.add, g && v.add(
            function() {
              n = g;
            },
            t[3 - f][2].disable,
            t[3 - f][3].disable,
            t[0][2].lock,
            t[0][3].lock
          ), v.add(l[3].fire), s[l[0]] = function() {
            return s[l[0] + "With"](this === s ? void 0 : this, arguments), this;
          }, s[l[0] + "With"] = v.fireWith;
        }), a.promise(s), e && e.call(s, s), s;
      },
      when: function(e) {
        var t = arguments.length, n = t, a = Array(n), s = p.call(arguments), f = o.Deferred(), l = function(v) {
          return function(g) {
            a[v] = this, s[v] = arguments.length > 1 ? p.call(arguments) : g, --t || f.resolveWith(a, s);
          };
        };
        if (t <= 1 && (nr(
          e,
          f.done(l(n)).resolve,
          f.reject,
          !t
        ), f.state() === "pending" || q(s[n] && s[n].then)))
          return f.then();
        for (; n--; )
          nr(s[n], l(n), f.reject);
        return f.promise();
      }
    });
    var Kr = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    o.Deferred.exceptionHook = function(e, t) {
      i.console && i.console.warn && e && Kr.test(e.name) && i.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
    }, o.readyException = function(e) {
      i.setTimeout(function() {
        throw e;
      });
    };
    var Dt = o.Deferred();
    o.fn.ready = function(e) {
      return Dt.then(e).catch(function(t) {
        o.readyException(t);
      }), this;
    }, o.extend({
      isReady: !1,
      readyWait: 1,
      ready: function(e) {
        (e === !0 ? --o.readyWait : o.isReady) || (o.isReady = !0, !(e !== !0 && --o.readyWait > 0) && Dt.resolveWith(F, [o]));
      }
    }), o.ready.then = Dt.then;
    function Tt() {
      F.removeEventListener("DOMContentLoaded", Tt), i.removeEventListener("load", Tt), o.ready();
    }
    F.readyState === "complete" || F.readyState !== "loading" && !F.documentElement.doScroll ? i.setTimeout(o.ready) : (F.addEventListener("DOMContentLoaded", Tt), i.addEventListener("load", Tt));
    var Le = function(e, t, n, a, s, f, l) {
      var v = 0, g = e.length, x = n == null;
      if (pe(n) === "object") {
        s = !0;
        for (v in n)
          Le(e, t, v, n[v], !0, f, l);
      } else if (a !== void 0 && (s = !0, q(a) || (l = !0), x && (l ? (t.call(e, a), t = null) : (x = t, t = function(E, P, A) {
        return x.call(o(E), A);
      })), t))
        for (; v < g; v++)
          t(
            e[v],
            n,
            l ? a : a.call(e[v], v, t(e[v], n))
          );
      return s ? e : x ? t.call(e) : g ? t(e[0], n) : f;
    }, Jr = /^-ms-/, Yr = /-([a-z])/g;
    function Qr(e, t) {
      return t.toUpperCase();
    }
    function Ne(e) {
      return e.replace(Jr, "ms-").replace(Yr, Qr);
    }
    var ot = function(e) {
      return e.nodeType === 1 || e.nodeType === 9 || !+e.nodeType;
    };
    function st() {
      this.expando = o.expando + st.uid++;
    }
    st.uid = 1, st.prototype = {
      cache: function(e) {
        var t = e[this.expando];
        return t || (t = {}, ot(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
          value: t,
          configurable: !0
        }))), t;
      },
      set: function(e, t, n) {
        var a, s = this.cache(e);
        if (typeof t == "string")
          s[Ne(t)] = n;
        else
          for (a in t)
            s[Ne(a)] = t[a];
        return s;
      },
      get: function(e, t) {
        return t === void 0 ? this.cache(e) : e[this.expando] && e[this.expando][Ne(t)];
      },
      access: function(e, t, n) {
        return t === void 0 || t && typeof t == "string" && n === void 0 ? this.get(e, t) : (this.set(e, t, n), n !== void 0 ? n : t);
      },
      remove: function(e, t) {
        var n, a = e[this.expando];
        if (a !== void 0) {
          if (t !== void 0)
            for (Array.isArray(t) ? t = t.map(Ne) : (t = Ne(t), t = t in a ? [t] : t.match(je) || []), n = t.length; n--; )
              delete a[t[n]];
          (t === void 0 || o.isEmptyObject(a)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando]);
        }
      },
      hasData: function(e) {
        var t = e[this.expando];
        return t !== void 0 && !o.isEmptyObject(t);
      }
    };
    var W = new st(), he = new st(), Zr = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, en = /[A-Z]/g;
    function tn(e) {
      return e === "true" ? !0 : e === "false" ? !1 : e === "null" ? null : e === +e + "" ? +e : Zr.test(e) ? JSON.parse(e) : e;
    }
    function ir(e, t, n) {
      var a;
      if (n === void 0 && e.nodeType === 1)
        if (a = "data-" + t.replace(en, "-$&").toLowerCase(), n = e.getAttribute(a), typeof n == "string") {
          try {
            n = tn(n);
          } catch {
          }
          he.set(e, t, n);
        } else
          n = void 0;
      return n;
    }
    o.extend({
      hasData: function(e) {
        return he.hasData(e) || W.hasData(e);
      },
      data: function(e, t, n) {
        return he.access(e, t, n);
      },
      removeData: function(e, t) {
        he.remove(e, t);
      },
      _data: function(e, t, n) {
        return W.access(e, t, n);
      },
      _removeData: function(e, t) {
        W.remove(e, t);
      }
    }), o.fn.extend({
      data: function(e, t) {
        var n, a, s, f = this[0], l = f && f.attributes;
        if (e === void 0) {
          if (this.length && (s = he.get(f), f.nodeType === 1 && !W.get(f, "hasDataAttrs"))) {
            for (n = l.length; n--; )
              l[n] && (a = l[n].name, a.indexOf("data-") === 0 && (a = Ne(a.slice(5)), ir(f, a, s[a])));
            W.set(f, "hasDataAttrs", !0);
          }
          return s;
        }
        return typeof e == "object" ? this.each(function() {
          he.set(this, e);
        }) : Le(this, function(v) {
          var g;
          if (f && v === void 0)
            return g = he.get(f, e), g !== void 0 || (g = ir(f, e), g !== void 0) ? g : void 0;
          this.each(function() {
            he.set(this, e, v);
          });
        }, null, t, arguments.length > 1, null, !0);
      },
      removeData: function(e) {
        return this.each(function() {
          he.remove(this, e);
        });
      }
    }), o.extend({
      queue: function(e, t, n) {
        var a;
        if (e)
          return t = (t || "fx") + "queue", a = W.get(e, t), n && (!a || Array.isArray(n) ? a = W.access(e, t, o.makeArray(n)) : a.push(n)), a || [];
      },
      dequeue: function(e, t) {
        t = t || "fx";
        var n = o.queue(e, t), a = n.length, s = n.shift(), f = o._queueHooks(e, t), l = function() {
          o.dequeue(e, t);
        };
        s === "inprogress" && (s = n.shift(), a--), s && (t === "fx" && n.unshift("inprogress"), delete f.stop, s.call(e, l, f)), !a && f && f.empty.fire();
      },
      _queueHooks: function(e, t) {
        var n = t + "queueHooks";
        return W.get(e, n) || W.access(e, n, {
          empty: o.Callbacks("once memory").add(function() {
            W.remove(e, [t + "queue", n]);
          })
        });
      }
    }), o.fn.extend({
      queue: function(e, t) {
        var n = 2;
        return typeof e != "string" && (t = e, e = "fx", n--), arguments.length < n ? o.queue(this[0], e) : t === void 0 ? this : this.each(function() {
          var a = o.queue(this, e, t);
          o._queueHooks(this, e), e === "fx" && a[0] !== "inprogress" && o.dequeue(this, e);
        });
      },
      dequeue: function(e) {
        return this.each(function() {
          o.dequeue(this, e);
        });
      },
      clearQueue: function(e) {
        return this.queue(e || "fx", []);
      },
      promise: function(e, t) {
        var n, a = 1, s = o.Deferred(), f = this, l = this.length, v = function() {
          --a || s.resolveWith(f, [f]);
        };
        for (typeof e != "string" && (t = e, e = void 0), e = e || "fx"; l--; )
          n = W.get(f[l], e + "queueHooks"), n && n.empty && (a++, n.empty.add(v));
        return v(), s.promise(t);
      }
    });
    var ar = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, ut = new RegExp("^(?:([+-])=|)(" + ar + ")([a-z%]*)$", "i"), Ie = ["Top", "Right", "Bottom", "Left"], He = F.documentElement, Ye = function(e) {
      return o.contains(e.ownerDocument, e);
    }, rn = { composed: !0 };
    He.getRootNode && (Ye = function(e) {
      return o.contains(e.ownerDocument, e) || e.getRootNode(rn) === e.ownerDocument;
    });
    var $t = function(e, t) {
      return e = t || e, e.style.display === "none" || e.style.display === "" && Ye(e) && o.css(e, "display") === "none";
    };
    function or(e, t, n, a) {
      var s, f, l = 20, v = a ? function() {
        return a.cur();
      } : function() {
        return o.css(e, t, "");
      }, g = v(), x = n && n[3] || (o.cssNumber[t] ? "" : "px"), E = e.nodeType && (o.cssNumber[t] || x !== "px" && +g) && ut.exec(o.css(e, t));
      if (E && E[3] !== x) {
        for (g = g / 2, x = x || E[3], E = +g || 1; l--; )
          o.style(e, t, E + x), (1 - f) * (1 - (f = v() / g || 0.5)) <= 0 && (l = 0), E = E / f;
        E = E * 2, o.style(e, t, E + x), n = n || [];
      }
      return n && (E = +E || +g || 0, s = n[1] ? E + (n[1] + 1) * n[2] : +n[2], a && (a.unit = x, a.start = E, a.end = s)), s;
    }
    var sr = {};
    function nn(e) {
      var t, n = e.ownerDocument, a = e.nodeName, s = sr[a];
      return s || (t = n.body.appendChild(n.createElement(a)), s = o.css(t, "display"), t.parentNode.removeChild(t), s === "none" && (s = "block"), sr[a] = s, s);
    }
    function Qe(e, t) {
      for (var n, a, s = [], f = 0, l = e.length; f < l; f++)
        a = e[f], a.style && (n = a.style.display, t ? (n === "none" && (s[f] = W.get(a, "display") || null, s[f] || (a.style.display = "")), a.style.display === "" && $t(a) && (s[f] = nn(a))) : n !== "none" && (s[f] = "none", W.set(a, "display", n)));
      for (f = 0; f < l; f++)
        s[f] != null && (e[f].style.display = s[f]);
      return e;
    }
    o.fn.extend({
      show: function() {
        return Qe(this, !0);
      },
      hide: function() {
        return Qe(this);
      },
      toggle: function(e) {
        return typeof e == "boolean" ? e ? this.show() : this.hide() : this.each(function() {
          $t(this) ? o(this).show() : o(this).hide();
        });
      }
    });
    var ft = /^(?:checkbox|radio)$/i, ur = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, fr = /^$|^module$|\/(?:java|ecma)script/i;
    (function() {
      var e = F.createDocumentFragment(), t = e.appendChild(F.createElement("div")), n = F.createElement("input");
      n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), B.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", B.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, t.innerHTML = "<option></option>", B.option = !!t.lastChild;
    })();
    var Ce = {
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
    Ce.tbody = Ce.tfoot = Ce.colgroup = Ce.caption = Ce.thead, Ce.th = Ce.td, B.option || (Ce.optgroup = Ce.option = [1, "<select multiple='multiple'>", "</select>"]);
    function ge(e, t) {
      var n;
      return typeof e.getElementsByTagName < "u" ? n = e.getElementsByTagName(t || "*") : typeof e.querySelectorAll < "u" ? n = e.querySelectorAll(t || "*") : n = [], t === void 0 || t && ae(e, t) ? o.merge([e], n) : n;
    }
    function Rt(e, t) {
      for (var n = 0, a = e.length; n < a; n++)
        W.set(
          e[n],
          "globalEval",
          !t || W.get(t[n], "globalEval")
        );
    }
    var an = /<|&#?\w+;/;
    function lr(e, t, n, a, s) {
      for (var f, l, v, g, x, E, P = t.createDocumentFragment(), A = [], S = 0, H = e.length; S < H; S++)
        if (f = e[S], f || f === 0)
          if (pe(f) === "object")
            o.merge(A, f.nodeType ? [f] : f);
          else if (!an.test(f))
            A.push(t.createTextNode(f));
          else {
            for (l = l || P.appendChild(t.createElement("div")), v = (ur.exec(f) || ["", ""])[1].toLowerCase(), g = Ce[v] || Ce._default, l.innerHTML = g[1] + o.htmlPrefilter(f) + g[2], E = g[0]; E--; )
              l = l.lastChild;
            o.merge(A, l.childNodes), l = P.firstChild, l.textContent = "";
          }
      for (P.textContent = "", S = 0; f = A[S++]; ) {
        if (a && o.inArray(f, a) > -1) {
          s && s.push(f);
          continue;
        }
        if (x = Ye(f), l = ge(P.appendChild(f), "script"), x && Rt(l), n)
          for (E = 0; f = l[E++]; )
            fr.test(f.type || "") && n.push(f);
      }
      return P;
    }
    var cr = /^([^.]*)(?:\.(.+)|)/;
    function Ze() {
      return !0;
    }
    function et() {
      return !1;
    }
    function on(e, t) {
      return e === sn() == (t === "focus");
    }
    function sn() {
      try {
        return F.activeElement;
      } catch {
      }
    }
    function Lt(e, t, n, a, s, f) {
      var l, v;
      if (typeof t == "object") {
        typeof n != "string" && (a = a || n, n = void 0);
        for (v in t)
          Lt(e, v, n, a, t[v], f);
        return e;
      }
      if (a == null && s == null ? (s = n, a = n = void 0) : s == null && (typeof n == "string" ? (s = a, a = void 0) : (s = a, a = n, n = void 0)), s === !1)
        s = et;
      else if (!s)
        return e;
      return f === 1 && (l = s, s = function(g) {
        return o().off(g), l.apply(this, arguments);
      }, s.guid = l.guid || (l.guid = o.guid++)), e.each(function() {
        o.event.add(this, t, s, a, n);
      });
    }
    o.event = {
      global: {},
      add: function(e, t, n, a, s) {
        var f, l, v, g, x, E, P, A, S, H, J, k = W.get(e);
        if (ot(e))
          for (n.handler && (f = n, n = f.handler, s = f.selector), s && o.find.matchesSelector(He, s), n.guid || (n.guid = o.guid++), (g = k.events) || (g = k.events = /* @__PURE__ */ Object.create(null)), (l = k.handle) || (l = k.handle = function(le) {
            return typeof o < "u" && o.event.triggered !== le.type ? o.event.dispatch.apply(e, arguments) : void 0;
          }), t = (t || "").match(je) || [""], x = t.length; x--; )
            v = cr.exec(t[x]) || [], S = J = v[1], H = (v[2] || "").split(".").sort(), S && (P = o.event.special[S] || {}, S = (s ? P.delegateType : P.bindType) || S, P = o.event.special[S] || {}, E = o.extend({
              type: S,
              origType: J,
              data: a,
              handler: n,
              guid: n.guid,
              selector: s,
              needsContext: s && o.expr.match.needsContext.test(s),
              namespace: H.join(".")
            }, f), (A = g[S]) || (A = g[S] = [], A.delegateCount = 0, (!P.setup || P.setup.call(e, a, H, l) === !1) && e.addEventListener && e.addEventListener(S, l)), P.add && (P.add.call(e, E), E.handler.guid || (E.handler.guid = n.guid)), s ? A.splice(A.delegateCount++, 0, E) : A.push(E), o.event.global[S] = !0);
      },
      remove: function(e, t, n, a, s) {
        var f, l, v, g, x, E, P, A, S, H, J, k = W.hasData(e) && W.get(e);
        if (!(!k || !(g = k.events))) {
          for (t = (t || "").match(je) || [""], x = t.length; x--; ) {
            if (v = cr.exec(t[x]) || [], S = J = v[1], H = (v[2] || "").split(".").sort(), !S) {
              for (S in g)
                o.event.remove(e, S + t[x], n, a, !0);
              continue;
            }
            for (P = o.event.special[S] || {}, S = (a ? P.delegateType : P.bindType) || S, A = g[S] || [], v = v[2] && new RegExp("(^|\\.)" + H.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = f = A.length; f--; )
              E = A[f], (s || J === E.origType) && (!n || n.guid === E.guid) && (!v || v.test(E.namespace)) && (!a || a === E.selector || a === "**" && E.selector) && (A.splice(f, 1), E.selector && A.delegateCount--, P.remove && P.remove.call(e, E));
            l && !A.length && ((!P.teardown || P.teardown.call(e, H, k.handle) === !1) && o.removeEvent(e, S, k.handle), delete g[S]);
          }
          o.isEmptyObject(g) && W.remove(e, "handle events");
        }
      },
      dispatch: function(e) {
        var t, n, a, s, f, l, v = new Array(arguments.length), g = o.event.fix(e), x = (W.get(this, "events") || /* @__PURE__ */ Object.create(null))[g.type] || [], E = o.event.special[g.type] || {};
        for (v[0] = g, t = 1; t < arguments.length; t++)
          v[t] = arguments[t];
        if (g.delegateTarget = this, !(E.preDispatch && E.preDispatch.call(this, g) === !1)) {
          for (l = o.event.handlers.call(this, g, x), t = 0; (s = l[t++]) && !g.isPropagationStopped(); )
            for (g.currentTarget = s.elem, n = 0; (f = s.handlers[n++]) && !g.isImmediatePropagationStopped(); )
              (!g.rnamespace || f.namespace === !1 || g.rnamespace.test(f.namespace)) && (g.handleObj = f, g.data = f.data, a = ((o.event.special[f.origType] || {}).handle || f.handler).apply(s.elem, v), a !== void 0 && (g.result = a) === !1 && (g.preventDefault(), g.stopPropagation()));
          return E.postDispatch && E.postDispatch.call(this, g), g.result;
        }
      },
      handlers: function(e, t) {
        var n, a, s, f, l, v = [], g = t.delegateCount, x = e.target;
        if (g && x.nodeType && !(e.type === "click" && e.button >= 1)) {
          for (; x !== this; x = x.parentNode || this)
            if (x.nodeType === 1 && !(e.type === "click" && x.disabled === !0)) {
              for (f = [], l = {}, n = 0; n < g; n++)
                a = t[n], s = a.selector + " ", l[s] === void 0 && (l[s] = a.needsContext ? o(s, this).index(x) > -1 : o.find(s, this, null, [x]).length), l[s] && f.push(a);
              f.length && v.push({ elem: x, handlers: f });
            }
        }
        return x = this, g < t.length && v.push({ elem: x, handlers: t.slice(g) }), v;
      },
      addProp: function(e, t) {
        Object.defineProperty(o.Event.prototype, e, {
          enumerable: !0,
          configurable: !0,
          get: q(t) ? function() {
            if (this.originalEvent)
              return t(this.originalEvent);
          } : function() {
            if (this.originalEvent)
              return this.originalEvent[e];
          },
          set: function(n) {
            Object.defineProperty(this, e, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: n
            });
          }
        });
      },
      fix: function(e) {
        return e[o.expando] ? e : new o.Event(e);
      },
      special: {
        load: {
          noBubble: !0
        },
        click: {
          setup: function(e) {
            var t = this || e;
            return ft.test(t.type) && t.click && ae(t, "input") && xt(t, "click", Ze), !1;
          },
          trigger: function(e) {
            var t = this || e;
            return ft.test(t.type) && t.click && ae(t, "input") && xt(t, "click"), !0;
          },
          _default: function(e) {
            var t = e.target;
            return ft.test(t.type) && t.click && ae(t, "input") && W.get(t, "click") || ae(t, "a");
          }
        },
        beforeunload: {
          postDispatch: function(e) {
            e.result !== void 0 && e.originalEvent && (e.originalEvent.returnValue = e.result);
          }
        }
      }
    };
    function xt(e, t, n) {
      if (!n) {
        W.get(e, t) === void 0 && o.event.add(e, t, Ze);
        return;
      }
      W.set(e, t, !1), o.event.add(e, t, {
        namespace: !1,
        handler: function(a) {
          var s, f, l = W.get(this, t);
          if (a.isTrigger & 1 && this[t]) {
            if (l.length)
              (o.event.special[t] || {}).delegateType && a.stopPropagation();
            else if (l = p.call(arguments), W.set(this, t, l), s = n(this, t), this[t](), f = W.get(this, t), l !== f || s ? W.set(this, t, !1) : f = {}, l !== f)
              return a.stopImmediatePropagation(), a.preventDefault(), f && f.value;
          } else
            l.length && (W.set(this, t, {
              value: o.event.trigger(
                o.extend(l[0], o.Event.prototype),
                l.slice(1),
                this
              )
            }), a.stopImmediatePropagation());
        }
      });
    }
    o.removeEvent = function(e, t, n) {
      e.removeEventListener && e.removeEventListener(t, n);
    }, o.Event = function(e, t) {
      if (!(this instanceof o.Event))
        return new o.Event(e, t);
      e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === void 0 && e.returnValue === !1 ? Ze : et, this.target = e.target && e.target.nodeType === 3 ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && o.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[o.expando] = !0;
    }, o.Event.prototype = {
      constructor: o.Event,
      isDefaultPrevented: et,
      isPropagationStopped: et,
      isImmediatePropagationStopped: et,
      isSimulated: !1,
      preventDefault: function() {
        var e = this.originalEvent;
        this.isDefaultPrevented = Ze, e && !this.isSimulated && e.preventDefault();
      },
      stopPropagation: function() {
        var e = this.originalEvent;
        this.isPropagationStopped = Ze, e && !this.isSimulated && e.stopPropagation();
      },
      stopImmediatePropagation: function() {
        var e = this.originalEvent;
        this.isImmediatePropagationStopped = Ze, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation();
      }
    }, o.each({
      altKey: !0,
      bubbles: !0,
      cancelable: !0,
      changedTouches: !0,
      ctrlKey: !0,
      detail: !0,
      eventPhase: !0,
      metaKey: !0,
      pageX: !0,
      pageY: !0,
      shiftKey: !0,
      view: !0,
      char: !0,
      code: !0,
      charCode: !0,
      key: !0,
      keyCode: !0,
      button: !0,
      buttons: !0,
      clientX: !0,
      clientY: !0,
      offsetX: !0,
      offsetY: !0,
      pointerId: !0,
      pointerType: !0,
      screenX: !0,
      screenY: !0,
      targetTouches: !0,
      toElement: !0,
      touches: !0,
      which: !0
    }, o.event.addProp), o.each({ focus: "focusin", blur: "focusout" }, function(e, t) {
      o.event.special[e] = {
        setup: function() {
          return xt(this, e, on), !1;
        },
        trigger: function() {
          return xt(this, e), !0;
        },
        _default: function(n) {
          return W.get(n.target, e);
        },
        delegateType: t
      };
    }), o.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(e, t) {
      o.event.special[e] = {
        delegateType: t,
        bindType: t,
        handle: function(n) {
          var a, s = this, f = n.relatedTarget, l = n.handleObj;
          return (!f || f !== s && !o.contains(s, f)) && (n.type = l.origType, a = l.handler.apply(this, arguments), n.type = t), a;
        }
      };
    }), o.fn.extend({
      on: function(e, t, n, a) {
        return Lt(this, e, t, n, a);
      },
      one: function(e, t, n, a) {
        return Lt(this, e, t, n, a, 1);
      },
      off: function(e, t, n) {
        var a, s;
        if (e && e.preventDefault && e.handleObj)
          return a = e.handleObj, o(e.delegateTarget).off(
            a.namespace ? a.origType + "." + a.namespace : a.origType,
            a.selector,
            a.handler
          ), this;
        if (typeof e == "object") {
          for (s in e)
            this.off(s, t, e[s]);
          return this;
        }
        return (t === !1 || typeof t == "function") && (n = t, t = void 0), n === !1 && (n = et), this.each(function() {
          o.event.remove(this, e, n, t);
        });
      }
    });
    var un = /<script|<style|<link/i, fn = /checked\s*(?:[^=]|=\s*.checked.)/i, ln = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
    function dr(e, t) {
      return ae(e, "table") && ae(t.nodeType !== 11 ? t : t.firstChild, "tr") && o(e).children("tbody")[0] || e;
    }
    function cn(e) {
      return e.type = (e.getAttribute("type") !== null) + "/" + e.type, e;
    }
    function dn(e) {
      return (e.type || "").slice(0, 5) === "true/" ? e.type = e.type.slice(5) : e.removeAttribute("type"), e;
    }
    function pr(e, t) {
      var n, a, s, f, l, v, g;
      if (t.nodeType === 1) {
        if (W.hasData(e) && (f = W.get(e), g = f.events, g)) {
          W.remove(t, "handle events");
          for (s in g)
            for (n = 0, a = g[s].length; n < a; n++)
              o.event.add(t, s, g[s][n]);
        }
        he.hasData(e) && (l = he.access(e), v = o.extend({}, l), he.set(t, v));
      }
    }
    function pn(e, t) {
      var n = t.nodeName.toLowerCase();
      n === "input" && ft.test(e.type) ? t.checked = e.checked : (n === "input" || n === "textarea") && (t.defaultValue = e.defaultValue);
    }
    function tt(e, t, n, a) {
      t = m(t);
      var s, f, l, v, g, x, E = 0, P = e.length, A = P - 1, S = t[0], H = q(S);
      if (H || P > 1 && typeof S == "string" && !B.checkClone && fn.test(S))
        return e.each(function(J) {
          var k = e.eq(J);
          H && (t[0] = S.call(this, J, k.html())), tt(k, t, n, a);
        });
      if (P && (s = lr(t, e[0].ownerDocument, !1, e, a), f = s.firstChild, s.childNodes.length === 1 && (s = f), f || a)) {
        for (l = o.map(ge(s, "script"), cn), v = l.length; E < P; E++)
          g = s, E !== A && (g = o.clone(g, !0, !0), v && o.merge(l, ge(g, "script"))), n.call(e[E], g, E);
        if (v)
          for (x = l[l.length - 1].ownerDocument, o.map(l, dn), E = 0; E < v; E++)
            g = l[E], fr.test(g.type || "") && !W.access(g, "globalEval") && o.contains(x, g) && (g.src && (g.type || "").toLowerCase() !== "module" ? o._evalUrl && !g.noModule && o._evalUrl(g.src, {
              nonce: g.nonce || g.getAttribute("nonce")
            }, x) : Ae(g.textContent.replace(ln, ""), g, x));
      }
      return e;
    }
    function hr(e, t, n) {
      for (var a, s = t ? o.filter(t, e) : e, f = 0; (a = s[f]) != null; f++)
        !n && a.nodeType === 1 && o.cleanData(ge(a)), a.parentNode && (n && Ye(a) && Rt(ge(a, "script")), a.parentNode.removeChild(a));
      return e;
    }
    o.extend({
      htmlPrefilter: function(e) {
        return e;
      },
      clone: function(e, t, n) {
        var a, s, f, l, v = e.cloneNode(!0), g = Ye(e);
        if (!B.noCloneChecked && (e.nodeType === 1 || e.nodeType === 11) && !o.isXMLDoc(e))
          for (l = ge(v), f = ge(e), a = 0, s = f.length; a < s; a++)
            pn(f[a], l[a]);
        if (t)
          if (n)
            for (f = f || ge(e), l = l || ge(v), a = 0, s = f.length; a < s; a++)
              pr(f[a], l[a]);
          else
            pr(e, v);
        return l = ge(v, "script"), l.length > 0 && Rt(l, !g && ge(e, "script")), v;
      },
      cleanData: function(e) {
        for (var t, n, a, s = o.event.special, f = 0; (n = e[f]) !== void 0; f++)
          if (ot(n)) {
            if (t = n[W.expando]) {
              if (t.events)
                for (a in t.events)
                  s[a] ? o.event.remove(n, a) : o.removeEvent(n, a, t.handle);
              n[W.expando] = void 0;
            }
            n[he.expando] && (n[he.expando] = void 0);
          }
      }
    }), o.fn.extend({
      detach: function(e) {
        return hr(this, e, !0);
      },
      remove: function(e) {
        return hr(this, e);
      },
      text: function(e) {
        return Le(this, function(t) {
          return t === void 0 ? o.text(this) : this.empty().each(function() {
            (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) && (this.textContent = t);
          });
        }, null, e, arguments.length);
      },
      append: function() {
        return tt(this, arguments, function(e) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var t = dr(this, e);
            t.appendChild(e);
          }
        });
      },
      prepend: function() {
        return tt(this, arguments, function(e) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var t = dr(this, e);
            t.insertBefore(e, t.firstChild);
          }
        });
      },
      before: function() {
        return tt(this, arguments, function(e) {
          this.parentNode && this.parentNode.insertBefore(e, this);
        });
      },
      after: function() {
        return tt(this, arguments, function(e) {
          this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
        });
      },
      empty: function() {
        for (var e, t = 0; (e = this[t]) != null; t++)
          e.nodeType === 1 && (o.cleanData(ge(e, !1)), e.textContent = "");
        return this;
      },
      clone: function(e, t) {
        return e = e ?? !1, t = t ?? e, this.map(function() {
          return o.clone(this, e, t);
        });
      },
      html: function(e) {
        return Le(this, function(t) {
          var n = this[0] || {}, a = 0, s = this.length;
          if (t === void 0 && n.nodeType === 1)
            return n.innerHTML;
          if (typeof t == "string" && !un.test(t) && !Ce[(ur.exec(t) || ["", ""])[1].toLowerCase()]) {
            t = o.htmlPrefilter(t);
            try {
              for (; a < s; a++)
                n = this[a] || {}, n.nodeType === 1 && (o.cleanData(ge(n, !1)), n.innerHTML = t);
              n = 0;
            } catch {
            }
          }
          n && this.empty().append(t);
        }, null, e, arguments.length);
      },
      replaceWith: function() {
        var e = [];
        return tt(this, arguments, function(t) {
          var n = this.parentNode;
          o.inArray(this, e) < 0 && (o.cleanData(ge(this)), n && n.replaceChild(t, this));
        }, e);
      }
    }), o.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(e, t) {
      o.fn[e] = function(n) {
        for (var a, s = [], f = o(n), l = f.length - 1, v = 0; v <= l; v++)
          a = v === l ? this : this.clone(!0), o(f[v])[t](a), C.apply(s, a.get());
        return this.pushStack(s);
      };
    });
    var It = new RegExp("^(" + ar + ")(?!px)[a-z%]+$", "i"), Mt = /^--/, At = function(e) {
      var t = e.ownerDocument.defaultView;
      return (!t || !t.opener) && (t = i), t.getComputedStyle(e);
    }, gr = function(e, t, n) {
      var a, s, f = {};
      for (s in t)
        f[s] = e.style[s], e.style[s] = t[s];
      a = n.call(e);
      for (s in t)
        e.style[s] = f[s];
      return a;
    }, hn = new RegExp(Ie.join("|"), "i"), yr = "[\\x20\\t\\r\\n\\f]", gn = new RegExp(
      "^" + yr + "+|((?:^|[^\\\\])(?:\\\\.)*)" + yr + "+$",
      "g"
    );
    (function() {
      function e() {
        if (x) {
          g.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", x.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", He.appendChild(g).appendChild(x);
          var E = i.getComputedStyle(x);
          n = E.top !== "1%", v = t(E.marginLeft) === 12, x.style.right = "60%", f = t(E.right) === 36, a = t(E.width) === 36, x.style.position = "absolute", s = t(x.offsetWidth / 3) === 12, He.removeChild(g), x = null;
        }
      }
      function t(E) {
        return Math.round(parseFloat(E));
      }
      var n, a, s, f, l, v, g = F.createElement("div"), x = F.createElement("div");
      x.style && (x.style.backgroundClip = "content-box", x.cloneNode(!0).style.backgroundClip = "", B.clearCloneStyle = x.style.backgroundClip === "content-box", o.extend(B, {
        boxSizingReliable: function() {
          return e(), a;
        },
        pixelBoxStyles: function() {
          return e(), f;
        },
        pixelPosition: function() {
          return e(), n;
        },
        reliableMarginLeft: function() {
          return e(), v;
        },
        scrollboxSize: function() {
          return e(), s;
        },
        reliableTrDimensions: function() {
          var E, P, A, S;
          return l == null && (E = F.createElement("table"), P = F.createElement("tr"), A = F.createElement("div"), E.style.cssText = "position:absolute;left:-11111px;border-collapse:separate", P.style.cssText = "border:1px solid", P.style.height = "1px", A.style.height = "9px", A.style.display = "block", He.appendChild(E).appendChild(P).appendChild(A), S = i.getComputedStyle(P), l = parseInt(S.height, 10) + parseInt(S.borderTopWidth, 10) + parseInt(S.borderBottomWidth, 10) === P.offsetHeight, He.removeChild(E)), l;
        }
      }));
    })();
    function lt(e, t, n) {
      var a, s, f, l, v = Mt.test(t), g = e.style;
      return n = n || At(e), n && (l = n.getPropertyValue(t) || n[t], v && (l = l.replace(gn, "$1")), l === "" && !Ye(e) && (l = o.style(e, t)), !B.pixelBoxStyles() && It.test(l) && hn.test(t) && (a = g.width, s = g.minWidth, f = g.maxWidth, g.minWidth = g.maxWidth = g.width = l, l = n.width, g.width = a, g.minWidth = s, g.maxWidth = f)), l !== void 0 ? l + "" : l;
    }
    function vr(e, t) {
      return {
        get: function() {
          if (e()) {
            delete this.get;
            return;
          }
          return (this.get = t).apply(this, arguments);
        }
      };
    }
    var br = ["Webkit", "Moz", "ms"], mr = F.createElement("div").style, Tr = {};
    function yn(e) {
      for (var t = e[0].toUpperCase() + e.slice(1), n = br.length; n--; )
        if (e = br[n] + t, e in mr)
          return e;
    }
    function qt(e) {
      var t = o.cssProps[e] || Tr[e];
      return t || (e in mr ? e : Tr[e] = yn(e) || e);
    }
    var vn = /^(none|table(?!-c[ea]).+)/, bn = { position: "absolute", visibility: "hidden", display: "block" }, $r = {
      letterSpacing: "0",
      fontWeight: "400"
    };
    function xr(e, t, n) {
      var a = ut.exec(t);
      return a ? Math.max(0, a[2] - (n || 0)) + (a[3] || "px") : t;
    }
    function Ft(e, t, n, a, s, f) {
      var l = t === "width" ? 1 : 0, v = 0, g = 0;
      if (n === (a ? "border" : "content"))
        return 0;
      for (; l < 4; l += 2)
        n === "margin" && (g += o.css(e, n + Ie[l], !0, s)), a ? (n === "content" && (g -= o.css(e, "padding" + Ie[l], !0, s)), n !== "margin" && (g -= o.css(e, "border" + Ie[l] + "Width", !0, s))) : (g += o.css(e, "padding" + Ie[l], !0, s), n !== "padding" ? g += o.css(e, "border" + Ie[l] + "Width", !0, s) : v += o.css(e, "border" + Ie[l] + "Width", !0, s));
      return !a && f >= 0 && (g += Math.max(0, Math.ceil(
        e["offset" + t[0].toUpperCase() + t.slice(1)] - f - g - v - 0.5
      )) || 0), g;
    }
    function Ar(e, t, n) {
      var a = At(e), s = !B.boxSizingReliable() || n, f = s && o.css(e, "boxSizing", !1, a) === "border-box", l = f, v = lt(e, t, a), g = "offset" + t[0].toUpperCase() + t.slice(1);
      if (It.test(v)) {
        if (!n)
          return v;
        v = "auto";
      }
      return (!B.boxSizingReliable() && f || !B.reliableTrDimensions() && ae(e, "tr") || v === "auto" || !parseFloat(v) && o.css(e, "display", !1, a) === "inline") && e.getClientRects().length && (f = o.css(e, "boxSizing", !1, a) === "border-box", l = g in e, l && (v = e[g])), v = parseFloat(v) || 0, v + Ft(
        e,
        t,
        n || (f ? "border" : "content"),
        l,
        a,
        v
      ) + "px";
    }
    o.extend({
      cssHooks: {
        opacity: {
          get: function(e, t) {
            if (t) {
              var n = lt(e, "opacity");
              return n === "" ? "1" : n;
            }
          }
        }
      },
      cssNumber: {
        animationIterationCount: !0,
        columnCount: !0,
        fillOpacity: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        gridArea: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnStart: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowStart: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0
      },
      cssProps: {},
      style: function(e, t, n, a) {
        if (!(!e || e.nodeType === 3 || e.nodeType === 8 || !e.style)) {
          var s, f, l, v = Ne(t), g = Mt.test(t), x = e.style;
          if (g || (t = qt(v)), l = o.cssHooks[t] || o.cssHooks[v], n !== void 0) {
            if (f = typeof n, f === "string" && (s = ut.exec(n)) && s[1] && (n = or(e, t, s), f = "number"), n == null || n !== n)
              return;
            f === "number" && !g && (n += s && s[3] || (o.cssNumber[v] ? "" : "px")), !B.clearCloneStyle && n === "" && t.indexOf("background") === 0 && (x[t] = "inherit"), (!l || !("set" in l) || (n = l.set(e, n, a)) !== void 0) && (g ? x.setProperty(t, n) : x[t] = n);
          } else
            return l && "get" in l && (s = l.get(e, !1, a)) !== void 0 ? s : x[t];
        }
      },
      css: function(e, t, n, a) {
        var s, f, l, v = Ne(t), g = Mt.test(t);
        return g || (t = qt(v)), l = o.cssHooks[t] || o.cssHooks[v], l && "get" in l && (s = l.get(e, !0, n)), s === void 0 && (s = lt(e, t, a)), s === "normal" && t in $r && (s = $r[t]), n === "" || n ? (f = parseFloat(s), n === !0 || isFinite(f) ? f || 0 : s) : s;
      }
    }), o.each(["height", "width"], function(e, t) {
      o.cssHooks[t] = {
        get: function(n, a, s) {
          if (a)
            return vn.test(o.css(n, "display")) && (!n.getClientRects().length || !n.getBoundingClientRect().width) ? gr(n, bn, function() {
              return Ar(n, t, s);
            }) : Ar(n, t, s);
        },
        set: function(n, a, s) {
          var f, l = At(n), v = !B.scrollboxSize() && l.position === "absolute", g = v || s, x = g && o.css(n, "boxSizing", !1, l) === "border-box", E = s ? Ft(
            n,
            t,
            s,
            x,
            l
          ) : 0;
          return x && v && (E -= Math.ceil(
            n["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(l[t]) - Ft(n, t, "border", !1, l) - 0.5
          )), E && (f = ut.exec(a)) && (f[3] || "px") !== "px" && (n.style[t] = a, a = o.css(n, t)), xr(n, a, E);
        }
      };
    }), o.cssHooks.marginLeft = vr(
      B.reliableMarginLeft,
      function(e, t) {
        if (t)
          return (parseFloat(lt(e, "marginLeft")) || e.getBoundingClientRect().left - gr(e, { marginLeft: 0 }, function() {
            return e.getBoundingClientRect().left;
          })) + "px";
      }
    ), o.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(e, t) {
      o.cssHooks[e + t] = {
        expand: function(n) {
          for (var a = 0, s = {}, f = typeof n == "string" ? n.split(" ") : [n]; a < 4; a++)
            s[e + Ie[a] + t] = f[a] || f[a - 2] || f[0];
          return s;
        }
      }, e !== "margin" && (o.cssHooks[e + t].set = xr);
    }), o.fn.extend({
      css: function(e, t) {
        return Le(this, function(n, a, s) {
          var f, l, v = {}, g = 0;
          if (Array.isArray(a)) {
            for (f = At(n), l = a.length; g < l; g++)
              v[a[g]] = o.css(n, a[g], !1, f);
            return v;
          }
          return s !== void 0 ? o.style(n, a, s) : o.css(n, a);
        }, e, t, arguments.length > 1);
      }
    });
    function ye(e, t, n, a, s) {
      return new ye.prototype.init(e, t, n, a, s);
    }
    o.Tween = ye, ye.prototype = {
      constructor: ye,
      init: function(e, t, n, a, s, f) {
        this.elem = e, this.prop = n, this.easing = s || o.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = a, this.unit = f || (o.cssNumber[n] ? "" : "px");
      },
      cur: function() {
        var e = ye.propHooks[this.prop];
        return e && e.get ? e.get(this) : ye.propHooks._default.get(this);
      },
      run: function(e) {
        var t, n = ye.propHooks[this.prop];
        return this.options.duration ? this.pos = t = o.easing[this.easing](
          e,
          this.options.duration * e,
          0,
          1,
          this.options.duration
        ) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : ye.propHooks._default.set(this), this;
      }
    }, ye.prototype.init.prototype = ye.prototype, ye.propHooks = {
      _default: {
        get: function(e) {
          var t;
          return e.elem.nodeType !== 1 || e.elem[e.prop] != null && e.elem.style[e.prop] == null ? e.elem[e.prop] : (t = o.css(e.elem, e.prop, ""), !t || t === "auto" ? 0 : t);
        },
        set: function(e) {
          o.fx.step[e.prop] ? o.fx.step[e.prop](e) : e.elem.nodeType === 1 && (o.cssHooks[e.prop] || e.elem.style[qt(e.prop)] != null) ? o.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now;
        }
      }
    }, ye.propHooks.scrollTop = ye.propHooks.scrollLeft = {
      set: function(e) {
        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
      }
    }, o.easing = {
      linear: function(e) {
        return e;
      },
      swing: function(e) {
        return 0.5 - Math.cos(e * Math.PI) / 2;
      },
      _default: "swing"
    }, o.fx = ye.prototype.init, o.fx.step = {};
    var rt, Ct, mn = /^(?:toggle|show|hide)$/, Tn = /queueHooks$/;
    function Bt() {
      Ct && (F.hidden === !1 && i.requestAnimationFrame ? i.requestAnimationFrame(Bt) : i.setTimeout(Bt, o.fx.interval), o.fx.tick());
    }
    function Cr() {
      return i.setTimeout(function() {
        rt = void 0;
      }), rt = Date.now();
    }
    function Et(e, t) {
      var n, a = 0, s = { height: e };
      for (t = t ? 1 : 0; a < 4; a += 2 - t)
        n = Ie[a], s["margin" + n] = s["padding" + n] = e;
      return t && (s.opacity = s.width = e), s;
    }
    function Er(e, t, n) {
      for (var a, s = (Oe.tweeners[t] || []).concat(Oe.tweeners["*"]), f = 0, l = s.length; f < l; f++)
        if (a = s[f].call(n, t, e))
          return a;
    }
    function $n(e, t, n) {
      var a, s, f, l, v, g, x, E, P = "width" in t || "height" in t, A = this, S = {}, H = e.style, J = e.nodeType && $t(e), k = W.get(e, "fxshow");
      n.queue || (l = o._queueHooks(e, "fx"), l.unqueued == null && (l.unqueued = 0, v = l.empty.fire, l.empty.fire = function() {
        l.unqueued || v();
      }), l.unqueued++, A.always(function() {
        A.always(function() {
          l.unqueued--, o.queue(e, "fx").length || l.empty.fire();
        });
      }));
      for (a in t)
        if (s = t[a], mn.test(s)) {
          if (delete t[a], f = f || s === "toggle", s === (J ? "hide" : "show"))
            if (s === "show" && k && k[a] !== void 0)
              J = !0;
            else
              continue;
          S[a] = k && k[a] || o.style(e, a);
        }
      if (g = !o.isEmptyObject(t), !(!g && o.isEmptyObject(S))) {
        P && e.nodeType === 1 && (n.overflow = [H.overflow, H.overflowX, H.overflowY], x = k && k.display, x == null && (x = W.get(e, "display")), E = o.css(e, "display"), E === "none" && (x ? E = x : (Qe([e], !0), x = e.style.display || x, E = o.css(e, "display"), Qe([e]))), (E === "inline" || E === "inline-block" && x != null) && o.css(e, "float") === "none" && (g || (A.done(function() {
          H.display = x;
        }), x == null && (E = H.display, x = E === "none" ? "" : E)), H.display = "inline-block")), n.overflow && (H.overflow = "hidden", A.always(function() {
          H.overflow = n.overflow[0], H.overflowX = n.overflow[1], H.overflowY = n.overflow[2];
        })), g = !1;
        for (a in S)
          g || (k ? "hidden" in k && (J = k.hidden) : k = W.access(e, "fxshow", { display: x }), f && (k.hidden = !J), J && Qe([e], !0), A.done(function() {
            J || Qe([e]), W.remove(e, "fxshow");
            for (a in S)
              o.style(e, a, S[a]);
          })), g = Er(J ? k[a] : 0, a, A), a in k || (k[a] = g.start, J && (g.end = g.start, g.start = 0));
      }
    }
    function xn(e, t) {
      var n, a, s, f, l;
      for (n in e)
        if (a = Ne(n), s = t[a], f = e[n], Array.isArray(f) && (s = f[1], f = e[n] = f[0]), n !== a && (e[a] = f, delete e[n]), l = o.cssHooks[a], l && "expand" in l) {
          f = l.expand(f), delete e[a];
          for (n in f)
            n in e || (e[n] = f[n], t[n] = s);
        } else
          t[a] = s;
    }
    function Oe(e, t, n) {
      var a, s, f = 0, l = Oe.prefilters.length, v = o.Deferred().always(function() {
        delete g.elem;
      }), g = function() {
        if (s)
          return !1;
        for (var P = rt || Cr(), A = Math.max(0, x.startTime + x.duration - P), S = A / x.duration || 0, H = 1 - S, J = 0, k = x.tweens.length; J < k; J++)
          x.tweens[J].run(H);
        return v.notifyWith(e, [x, H, A]), H < 1 && k ? A : (k || v.notifyWith(e, [x, 1, 0]), v.resolveWith(e, [x]), !1);
      }, x = v.promise({
        elem: e,
        props: o.extend({}, t),
        opts: o.extend(!0, {
          specialEasing: {},
          easing: o.easing._default
        }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: rt || Cr(),
        duration: n.duration,
        tweens: [],
        createTween: function(P, A) {
          var S = o.Tween(
            e,
            x.opts,
            P,
            A,
            x.opts.specialEasing[P] || x.opts.easing
          );
          return x.tweens.push(S), S;
        },
        stop: function(P) {
          var A = 0, S = P ? x.tweens.length : 0;
          if (s)
            return this;
          for (s = !0; A < S; A++)
            x.tweens[A].run(1);
          return P ? (v.notifyWith(e, [x, 1, 0]), v.resolveWith(e, [x, P])) : v.rejectWith(e, [x, P]), this;
        }
      }), E = x.props;
      for (xn(E, x.opts.specialEasing); f < l; f++)
        if (a = Oe.prefilters[f].call(x, e, E, x.opts), a)
          return q(a.stop) && (o._queueHooks(x.elem, x.opts.queue).stop = a.stop.bind(a)), a;
      return o.map(E, Er, x), q(x.opts.start) && x.opts.start.call(e, x), x.progress(x.opts.progress).done(x.opts.done, x.opts.complete).fail(x.opts.fail).always(x.opts.always), o.fx.timer(
        o.extend(g, {
          elem: e,
          anim: x,
          queue: x.opts.queue
        })
      ), x;
    }
    o.Animation = o.extend(Oe, {
      tweeners: {
        "*": [function(e, t) {
          var n = this.createTween(e, t);
          return or(n.elem, e, ut.exec(t), n), n;
        }]
      },
      tweener: function(e, t) {
        q(e) ? (t = e, e = ["*"]) : e = e.match(je);
        for (var n, a = 0, s = e.length; a < s; a++)
          n = e[a], Oe.tweeners[n] = Oe.tweeners[n] || [], Oe.tweeners[n].unshift(t);
      },
      prefilters: [$n],
      prefilter: function(e, t) {
        t ? Oe.prefilters.unshift(e) : Oe.prefilters.push(e);
      }
    }), o.speed = function(e, t, n) {
      var a = e && typeof e == "object" ? o.extend({}, e) : {
        complete: n || !n && t || q(e) && e,
        duration: e,
        easing: n && t || t && !q(t) && t
      };
      return o.fx.off ? a.duration = 0 : typeof a.duration != "number" && (a.duration in o.fx.speeds ? a.duration = o.fx.speeds[a.duration] : a.duration = o.fx.speeds._default), (a.queue == null || a.queue === !0) && (a.queue = "fx"), a.old = a.complete, a.complete = function() {
        q(a.old) && a.old.call(this), a.queue && o.dequeue(this, a.queue);
      }, a;
    }, o.fn.extend({
      fadeTo: function(e, t, n, a) {
        return this.filter($t).css("opacity", 0).show().end().animate({ opacity: t }, e, n, a);
      },
      animate: function(e, t, n, a) {
        var s = o.isEmptyObject(e), f = o.speed(t, n, a), l = function() {
          var v = Oe(this, o.extend({}, e), f);
          (s || W.get(this, "finish")) && v.stop(!0);
        };
        return l.finish = l, s || f.queue === !1 ? this.each(l) : this.queue(f.queue, l);
      },
      stop: function(e, t, n) {
        var a = function(s) {
          var f = s.stop;
          delete s.stop, f(n);
        };
        return typeof e != "string" && (n = t, t = e, e = void 0), t && this.queue(e || "fx", []), this.each(function() {
          var s = !0, f = e != null && e + "queueHooks", l = o.timers, v = W.get(this);
          if (f)
            v[f] && v[f].stop && a(v[f]);
          else
            for (f in v)
              v[f] && v[f].stop && Tn.test(f) && a(v[f]);
          for (f = l.length; f--; )
            l[f].elem === this && (e == null || l[f].queue === e) && (l[f].anim.stop(n), s = !1, l.splice(f, 1));
          (s || !n) && o.dequeue(this, e);
        });
      },
      finish: function(e) {
        return e !== !1 && (e = e || "fx"), this.each(function() {
          var t, n = W.get(this), a = n[e + "queue"], s = n[e + "queueHooks"], f = o.timers, l = a ? a.length : 0;
          for (n.finish = !0, o.queue(this, e, []), s && s.stop && s.stop.call(this, !0), t = f.length; t--; )
            f[t].elem === this && f[t].queue === e && (f[t].anim.stop(!0), f.splice(t, 1));
          for (t = 0; t < l; t++)
            a[t] && a[t].finish && a[t].finish.call(this);
          delete n.finish;
        });
      }
    }), o.each(["toggle", "show", "hide"], function(e, t) {
      var n = o.fn[t];
      o.fn[t] = function(a, s, f) {
        return a == null || typeof a == "boolean" ? n.apply(this, arguments) : this.animate(Et(t, !0), a, s, f);
      };
    }), o.each({
      slideDown: Et("show"),
      slideUp: Et("hide"),
      slideToggle: Et("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(e, t) {
      o.fn[e] = function(n, a, s) {
        return this.animate(t, n, a, s);
      };
    }), o.timers = [], o.fx.tick = function() {
      var e, t = 0, n = o.timers;
      for (rt = Date.now(); t < n.length; t++)
        e = n[t], !e() && n[t] === e && n.splice(t--, 1);
      n.length || o.fx.stop(), rt = void 0;
    }, o.fx.timer = function(e) {
      o.timers.push(e), o.fx.start();
    }, o.fx.interval = 13, o.fx.start = function() {
      Ct || (Ct = !0, Bt());
    }, o.fx.stop = function() {
      Ct = null;
    }, o.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
    }, o.fn.delay = function(e, t) {
      return e = o.fx && o.fx.speeds[e] || e, t = t || "fx", this.queue(t, function(n, a) {
        var s = i.setTimeout(n, e);
        a.stop = function() {
          i.clearTimeout(s);
        };
      });
    }, function() {
      var e = F.createElement("input"), t = F.createElement("select"), n = t.appendChild(F.createElement("option"));
      e.type = "checkbox", B.checkOn = e.value !== "", B.optSelected = n.selected, e = F.createElement("input"), e.value = "t", e.type = "radio", B.radioValue = e.value === "t";
    }();
    var Sr, ct = o.expr.attrHandle;
    o.fn.extend({
      attr: function(e, t) {
        return Le(this, o.attr, e, t, arguments.length > 1);
      },
      removeAttr: function(e) {
        return this.each(function() {
          o.removeAttr(this, e);
        });
      }
    }), o.extend({
      attr: function(e, t, n) {
        var a, s, f = e.nodeType;
        if (!(f === 3 || f === 8 || f === 2)) {
          if (typeof e.getAttribute > "u")
            return o.prop(e, t, n);
          if ((f !== 1 || !o.isXMLDoc(e)) && (s = o.attrHooks[t.toLowerCase()] || (o.expr.match.bool.test(t) ? Sr : void 0)), n !== void 0) {
            if (n === null) {
              o.removeAttr(e, t);
              return;
            }
            return s && "set" in s && (a = s.set(e, n, t)) !== void 0 ? a : (e.setAttribute(t, n + ""), n);
          }
          return s && "get" in s && (a = s.get(e, t)) !== null ? a : (a = o.find.attr(e, t), a ?? void 0);
        }
      },
      attrHooks: {
        type: {
          set: function(e, t) {
            if (!B.radioValue && t === "radio" && ae(e, "input")) {
              var n = e.value;
              return e.setAttribute("type", t), n && (e.value = n), t;
            }
          }
        }
      },
      removeAttr: function(e, t) {
        var n, a = 0, s = t && t.match(je);
        if (s && e.nodeType === 1)
          for (; n = s[a++]; )
            e.removeAttribute(n);
      }
    }), Sr = {
      set: function(e, t, n) {
        return t === !1 ? o.removeAttr(e, n) : e.setAttribute(n, n), n;
      }
    }, o.each(o.expr.match.bool.source.match(/\w+/g), function(e, t) {
      var n = ct[t] || o.find.attr;
      ct[t] = function(a, s, f) {
        var l, v, g = s.toLowerCase();
        return f || (v = ct[g], ct[g] = l, l = n(a, s, f) != null ? g : null, ct[g] = v), l;
      };
    });
    var An = /^(?:input|select|textarea|button)$/i, Cn = /^(?:a|area)$/i;
    o.fn.extend({
      prop: function(e, t) {
        return Le(this, o.prop, e, t, arguments.length > 1);
      },
      removeProp: function(e) {
        return this.each(function() {
          delete this[o.propFix[e] || e];
        });
      }
    }), o.extend({
      prop: function(e, t, n) {
        var a, s, f = e.nodeType;
        if (!(f === 3 || f === 8 || f === 2))
          return (f !== 1 || !o.isXMLDoc(e)) && (t = o.propFix[t] || t, s = o.propHooks[t]), n !== void 0 ? s && "set" in s && (a = s.set(e, n, t)) !== void 0 ? a : e[t] = n : s && "get" in s && (a = s.get(e, t)) !== null ? a : e[t];
      },
      propHooks: {
        tabIndex: {
          get: function(e) {
            var t = o.find.attr(e, "tabindex");
            return t ? parseInt(t, 10) : An.test(e.nodeName) || Cn.test(e.nodeName) && e.href ? 0 : -1;
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), B.optSelected || (o.propHooks.selected = {
      get: function(e) {
        var t = e.parentNode;
        return t && t.parentNode && t.parentNode.selectedIndex, null;
      },
      set: function(e) {
        var t = e.parentNode;
        t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
      }
    }), o.each([
      "tabIndex",
      "readOnly",
      "maxLength",
      "cellSpacing",
      "cellPadding",
      "rowSpan",
      "colSpan",
      "useMap",
      "frameBorder",
      "contentEditable"
    ], function() {
      o.propFix[this.toLowerCase()] = this;
    });
    function ke(e) {
      var t = e.match(je) || [];
      return t.join(" ");
    }
    function Ue(e) {
      return e.getAttribute && e.getAttribute("class") || "";
    }
    function Ht(e) {
      return Array.isArray(e) ? e : typeof e == "string" ? e.match(je) || [] : [];
    }
    o.fn.extend({
      addClass: function(e) {
        var t, n, a, s, f, l;
        return q(e) ? this.each(function(v) {
          o(this).addClass(e.call(this, v, Ue(this)));
        }) : (t = Ht(e), t.length ? this.each(function() {
          if (a = Ue(this), n = this.nodeType === 1 && " " + ke(a) + " ", n) {
            for (f = 0; f < t.length; f++)
              s = t[f], n.indexOf(" " + s + " ") < 0 && (n += s + " ");
            l = ke(n), a !== l && this.setAttribute("class", l);
          }
        }) : this);
      },
      removeClass: function(e) {
        var t, n, a, s, f, l;
        return q(e) ? this.each(function(v) {
          o(this).removeClass(e.call(this, v, Ue(this)));
        }) : arguments.length ? (t = Ht(e), t.length ? this.each(function() {
          if (a = Ue(this), n = this.nodeType === 1 && " " + ke(a) + " ", n) {
            for (f = 0; f < t.length; f++)
              for (s = t[f]; n.indexOf(" " + s + " ") > -1; )
                n = n.replace(" " + s + " ", " ");
            l = ke(n), a !== l && this.setAttribute("class", l);
          }
        }) : this) : this.attr("class", "");
      },
      toggleClass: function(e, t) {
        var n, a, s, f, l = typeof e, v = l === "string" || Array.isArray(e);
        return q(e) ? this.each(function(g) {
          o(this).toggleClass(
            e.call(this, g, Ue(this), t),
            t
          );
        }) : typeof t == "boolean" && v ? t ? this.addClass(e) : this.removeClass(e) : (n = Ht(e), this.each(function() {
          if (v)
            for (f = o(this), s = 0; s < n.length; s++)
              a = n[s], f.hasClass(a) ? f.removeClass(a) : f.addClass(a);
          else
            (e === void 0 || l === "boolean") && (a = Ue(this), a && W.set(this, "__className__", a), this.setAttribute && this.setAttribute(
              "class",
              a || e === !1 ? "" : W.get(this, "__className__") || ""
            ));
        }));
      },
      hasClass: function(e) {
        var t, n, a = 0;
        for (t = " " + e + " "; n = this[a++]; )
          if (n.nodeType === 1 && (" " + ke(Ue(n)) + " ").indexOf(t) > -1)
            return !0;
        return !1;
      }
    });
    var En = /\r/g;
    o.fn.extend({
      val: function(e) {
        var t, n, a, s = this[0];
        return arguments.length ? (a = q(e), this.each(function(f) {
          var l;
          this.nodeType === 1 && (a ? l = e.call(this, f, o(this).val()) : l = e, l == null ? l = "" : typeof l == "number" ? l += "" : Array.isArray(l) && (l = o.map(l, function(v) {
            return v == null ? "" : v + "";
          })), t = o.valHooks[this.type] || o.valHooks[this.nodeName.toLowerCase()], (!t || !("set" in t) || t.set(this, l, "value") === void 0) && (this.value = l));
        })) : s ? (t = o.valHooks[s.type] || o.valHooks[s.nodeName.toLowerCase()], t && "get" in t && (n = t.get(s, "value")) !== void 0 ? n : (n = s.value, typeof n == "string" ? n.replace(En, "") : n ?? "")) : void 0;
      }
    }), o.extend({
      valHooks: {
        option: {
          get: function(e) {
            var t = o.find.attr(e, "value");
            return t ?? ke(o.text(e));
          }
        },
        select: {
          get: function(e) {
            var t, n, a, s = e.options, f = e.selectedIndex, l = e.type === "select-one", v = l ? null : [], g = l ? f + 1 : s.length;
            for (f < 0 ? a = g : a = l ? f : 0; a < g; a++)
              if (n = s[a], (n.selected || a === f) && !n.disabled && (!n.parentNode.disabled || !ae(n.parentNode, "optgroup"))) {
                if (t = o(n).val(), l)
                  return t;
                v.push(t);
              }
            return v;
          },
          set: function(e, t) {
            for (var n, a, s = e.options, f = o.makeArray(t), l = s.length; l--; )
              a = s[l], (a.selected = o.inArray(o.valHooks.option.get(a), f) > -1) && (n = !0);
            return n || (e.selectedIndex = -1), f;
          }
        }
      }
    }), o.each(["radio", "checkbox"], function() {
      o.valHooks[this] = {
        set: function(e, t) {
          if (Array.isArray(t))
            return e.checked = o.inArray(o(e).val(), t) > -1;
        }
      }, B.checkOn || (o.valHooks[this].get = function(e) {
        return e.getAttribute("value") === null ? "on" : e.value;
      });
    }), B.focusin = "onfocusin" in i;
    var wr = /^(?:focusinfocus|focusoutblur)$/, Or = function(e) {
      e.stopPropagation();
    };
    o.extend(o.event, {
      trigger: function(e, t, n, a) {
        var s, f, l, v, g, x, E, P, A = [n || F], S = M.call(e, "type") ? e.type : e, H = M.call(e, "namespace") ? e.namespace.split(".") : [];
        if (f = P = l = n = n || F, !(n.nodeType === 3 || n.nodeType === 8) && !wr.test(S + o.event.triggered) && (S.indexOf(".") > -1 && (H = S.split("."), S = H.shift(), H.sort()), g = S.indexOf(":") < 0 && "on" + S, e = e[o.expando] ? e : new o.Event(S, typeof e == "object" && e), e.isTrigger = a ? 2 : 3, e.namespace = H.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + H.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = t == null ? [e] : o.makeArray(t, [e]), E = o.event.special[S] || {}, !(!a && E.trigger && E.trigger.apply(n, t) === !1))) {
          if (!a && !E.noBubble && !ee(n)) {
            for (v = E.delegateType || S, wr.test(v + S) || (f = f.parentNode); f; f = f.parentNode)
              A.push(f), l = f;
            l === (n.ownerDocument || F) && A.push(l.defaultView || l.parentWindow || i);
          }
          for (s = 0; (f = A[s++]) && !e.isPropagationStopped(); )
            P = f, e.type = s > 1 ? v : E.bindType || S, x = (W.get(f, "events") || /* @__PURE__ */ Object.create(null))[e.type] && W.get(f, "handle"), x && x.apply(f, t), x = g && f[g], x && x.apply && ot(f) && (e.result = x.apply(f, t), e.result === !1 && e.preventDefault());
          return e.type = S, !a && !e.isDefaultPrevented() && (!E._default || E._default.apply(A.pop(), t) === !1) && ot(n) && g && q(n[S]) && !ee(n) && (l = n[g], l && (n[g] = null), o.event.triggered = S, e.isPropagationStopped() && P.addEventListener(S, Or), n[S](), e.isPropagationStopped() && P.removeEventListener(S, Or), o.event.triggered = void 0, l && (n[g] = l)), e.result;
        }
      },
      simulate: function(e, t, n) {
        var a = o.extend(
          new o.Event(),
          n,
          {
            type: e,
            isSimulated: !0
          }
        );
        o.event.trigger(a, null, t);
      }
    }), o.fn.extend({
      trigger: function(e, t) {
        return this.each(function() {
          o.event.trigger(e, t, this);
        });
      },
      triggerHandler: function(e, t) {
        var n = this[0];
        if (n)
          return o.event.trigger(e, t, n, !0);
      }
    }), B.focusin || o.each({ focus: "focusin", blur: "focusout" }, function(e, t) {
      var n = function(a) {
        o.event.simulate(t, a.target, o.event.fix(a));
      };
      o.event.special[t] = {
        setup: function() {
          var a = this.ownerDocument || this.document || this, s = W.access(a, t);
          s || a.addEventListener(e, n, !0), W.access(a, t, (s || 0) + 1);
        },
        teardown: function() {
          var a = this.ownerDocument || this.document || this, s = W.access(a, t) - 1;
          s ? W.access(a, t, s) : (a.removeEventListener(e, n, !0), W.remove(a, t));
        }
      };
    });
    var dt = i.location, _r = { guid: Date.now() }, kt = /\?/;
    o.parseXML = function(e) {
      var t, n;
      if (!e || typeof e != "string")
        return null;
      try {
        t = new i.DOMParser().parseFromString(e, "text/xml");
      } catch {
      }
      return n = t && t.getElementsByTagName("parsererror")[0], (!t || n) && o.error("Invalid XML: " + (n ? o.map(n.childNodes, function(a) {
        return a.textContent;
      }).join(`
`) : e)), t;
    };
    var Sn = /\[\]$/, Pr = /\r?\n/g, wn = /^(?:submit|button|image|reset|file)$/i, On = /^(?:input|select|textarea|keygen)/i;
    function Ut(e, t, n, a) {
      var s;
      if (Array.isArray(t))
        o.each(t, function(f, l) {
          n || Sn.test(e) ? a(e, l) : Ut(
            e + "[" + (typeof l == "object" && l != null ? f : "") + "]",
            l,
            n,
            a
          );
        });
      else if (!n && pe(t) === "object")
        for (s in t)
          Ut(e + "[" + s + "]", t[s], n, a);
      else
        a(e, t);
    }
    o.param = function(e, t) {
      var n, a = [], s = function(f, l) {
        var v = q(l) ? l() : l;
        a[a.length] = encodeURIComponent(f) + "=" + encodeURIComponent(v ?? "");
      };
      if (e == null)
        return "";
      if (Array.isArray(e) || e.jquery && !o.isPlainObject(e))
        o.each(e, function() {
          s(this.name, this.value);
        });
      else
        for (n in e)
          Ut(n, e[n], t, s);
      return a.join("&");
    }, o.fn.extend({
      serialize: function() {
        return o.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var e = o.prop(this, "elements");
          return e ? o.makeArray(e) : this;
        }).filter(function() {
          var e = this.type;
          return this.name && !o(this).is(":disabled") && On.test(this.nodeName) && !wn.test(e) && (this.checked || !ft.test(e));
        }).map(function(e, t) {
          var n = o(this).val();
          return n == null ? null : Array.isArray(n) ? o.map(n, function(a) {
            return { name: t.name, value: a.replace(Pr, `\r
`) };
          }) : { name: t.name, value: n.replace(Pr, `\r
`) };
        }).get();
      }
    });
    var _n = /%20/g, Pn = /#.*$/, jn = /([?&])_=[^&]*/, Nn = /^(.*?):[ \t]*([^\r\n]*)$/mg, Dn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Rn = /^(?:GET|HEAD)$/, Ln = /^\/\//, jr = {}, Wt = {}, Nr = "*/".concat("*"), Gt = F.createElement("a");
    Gt.href = dt.href;
    function Dr(e) {
      return function(t, n) {
        typeof t != "string" && (n = t, t = "*");
        var a, s = 0, f = t.toLowerCase().match(je) || [];
        if (q(n))
          for (; a = f[s++]; )
            a[0] === "+" ? (a = a.slice(1) || "*", (e[a] = e[a] || []).unshift(n)) : (e[a] = e[a] || []).push(n);
      };
    }
    function Rr(e, t, n, a) {
      var s = {}, f = e === Wt;
      function l(v) {
        var g;
        return s[v] = !0, o.each(e[v] || [], function(x, E) {
          var P = E(t, n, a);
          if (typeof P == "string" && !f && !s[P])
            return t.dataTypes.unshift(P), l(P), !1;
          if (f)
            return !(g = P);
        }), g;
      }
      return l(t.dataTypes[0]) || !s["*"] && l("*");
    }
    function Vt(e, t) {
      var n, a, s = o.ajaxSettings.flatOptions || {};
      for (n in t)
        t[n] !== void 0 && ((s[n] ? e : a || (a = {}))[n] = t[n]);
      return a && o.extend(!0, e, a), e;
    }
    function In(e, t, n) {
      for (var a, s, f, l, v = e.contents, g = e.dataTypes; g[0] === "*"; )
        g.shift(), a === void 0 && (a = e.mimeType || t.getResponseHeader("Content-Type"));
      if (a) {
        for (s in v)
          if (v[s] && v[s].test(a)) {
            g.unshift(s);
            break;
          }
      }
      if (g[0] in n)
        f = g[0];
      else {
        for (s in n) {
          if (!g[0] || e.converters[s + " " + g[0]]) {
            f = s;
            break;
          }
          l || (l = s);
        }
        f = f || l;
      }
      if (f)
        return f !== g[0] && g.unshift(f), n[f];
    }
    function Mn(e, t, n, a) {
      var s, f, l, v, g, x = {}, E = e.dataTypes.slice();
      if (E[1])
        for (l in e.converters)
          x[l.toLowerCase()] = e.converters[l];
      for (f = E.shift(); f; )
        if (e.responseFields[f] && (n[e.responseFields[f]] = t), !g && a && e.dataFilter && (t = e.dataFilter(t, e.dataType)), g = f, f = E.shift(), f) {
          if (f === "*")
            f = g;
          else if (g !== "*" && g !== f) {
            if (l = x[g + " " + f] || x["* " + f], !l) {
              for (s in x)
                if (v = s.split(" "), v[1] === f && (l = x[g + " " + v[0]] || x["* " + v[0]], l)) {
                  l === !0 ? l = x[s] : x[s] !== !0 && (f = v[0], E.unshift(v[1]));
                  break;
                }
            }
            if (l !== !0)
              if (l && e.throws)
                t = l(t);
              else
                try {
                  t = l(t);
                } catch (P) {
                  return {
                    state: "parsererror",
                    error: l ? P : "No conversion from " + g + " to " + f
                  };
                }
          }
        }
      return { state: "success", data: t };
    }
    o.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: dt.href,
        type: "GET",
        isLocal: Dn.test(dt.protocol),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": Nr,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript"
        },
        contents: {
          xml: /\bxml\b/,
          html: /\bhtml/,
          json: /\bjson\b/
        },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON"
        },
        converters: {
          "* text": String,
          "text html": !0,
          "text json": JSON.parse,
          "text xml": o.parseXML
        },
        flatOptions: {
          url: !0,
          context: !0
        }
      },
      ajaxSetup: function(e, t) {
        return t ? Vt(Vt(e, o.ajaxSettings), t) : Vt(o.ajaxSettings, e);
      },
      ajaxPrefilter: Dr(jr),
      ajaxTransport: Dr(Wt),
      ajax: function(e, t) {
        typeof e == "object" && (t = e, e = void 0), t = t || {};
        var n, a, s, f, l, v, g, x, E, P, A = o.ajaxSetup({}, t), S = A.context || A, H = A.context && (S.nodeType || S.jquery) ? o(S) : o.event, J = o.Deferred(), k = o.Callbacks("once memory"), le = A.statusCode || {}, fe = {}, me = {}, re = "canceled", K = {
          readyState: 0,
          getResponseHeader: function(Z) {
            var se;
            if (g) {
              if (!f)
                for (f = {}; se = Nn.exec(s); )
                  f[se[1].toLowerCase() + " "] = (f[se[1].toLowerCase() + " "] || []).concat(se[2]);
              se = f[Z.toLowerCase() + " "];
            }
            return se == null ? null : se.join(", ");
          },
          getAllResponseHeaders: function() {
            return g ? s : null;
          },
          setRequestHeader: function(Z, se) {
            return g == null && (Z = me[Z.toLowerCase()] = me[Z.toLowerCase()] || Z, fe[Z] = se), this;
          },
          overrideMimeType: function(Z) {
            return g == null && (A.mimeType = Z), this;
          },
          statusCode: function(Z) {
            var se;
            if (Z)
              if (g)
                K.always(Z[K.status]);
              else
                for (se in Z)
                  le[se] = [le[se], Z[se]];
            return this;
          },
          abort: function(Z) {
            var se = Z || re;
            return n && n.abort(se), ve(0, se), this;
          }
        };
        if (J.promise(K), A.url = ((e || A.url || dt.href) + "").replace(Ln, dt.protocol + "//"), A.type = t.method || t.type || A.method || A.type, A.dataTypes = (A.dataType || "*").toLowerCase().match(je) || [""], A.crossDomain == null) {
          v = F.createElement("a");
          try {
            v.href = A.url, v.href = v.href, A.crossDomain = Gt.protocol + "//" + Gt.host != v.protocol + "//" + v.host;
          } catch {
            A.crossDomain = !0;
          }
        }
        if (A.data && A.processData && typeof A.data != "string" && (A.data = o.param(A.data, A.traditional)), Rr(jr, A, t, K), g)
          return K;
        x = o.event && A.global, x && o.active++ === 0 && o.event.trigger("ajaxStart"), A.type = A.type.toUpperCase(), A.hasContent = !Rn.test(A.type), a = A.url.replace(Pn, ""), A.hasContent ? A.data && A.processData && (A.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && (A.data = A.data.replace(_n, "+")) : (P = A.url.slice(a.length), A.data && (A.processData || typeof A.data == "string") && (a += (kt.test(a) ? "&" : "?") + A.data, delete A.data), A.cache === !1 && (a = a.replace(jn, "$1"), P = (kt.test(a) ? "&" : "?") + "_=" + _r.guid++ + P), A.url = a + P), A.ifModified && (o.lastModified[a] && K.setRequestHeader("If-Modified-Since", o.lastModified[a]), o.etag[a] && K.setRequestHeader("If-None-Match", o.etag[a])), (A.data && A.hasContent && A.contentType !== !1 || t.contentType) && K.setRequestHeader("Content-Type", A.contentType), K.setRequestHeader(
          "Accept",
          A.dataTypes[0] && A.accepts[A.dataTypes[0]] ? A.accepts[A.dataTypes[0]] + (A.dataTypes[0] !== "*" ? ", " + Nr + "; q=0.01" : "") : A.accepts["*"]
        );
        for (E in A.headers)
          K.setRequestHeader(E, A.headers[E]);
        if (A.beforeSend && (A.beforeSend.call(S, K, A) === !1 || g))
          return K.abort();
        if (re = "abort", k.add(A.complete), K.done(A.success), K.fail(A.error), n = Rr(Wt, A, t, K), !n)
          ve(-1, "No Transport");
        else {
          if (K.readyState = 1, x && H.trigger("ajaxSend", [K, A]), g)
            return K;
          A.async && A.timeout > 0 && (l = i.setTimeout(function() {
            K.abort("timeout");
          }, A.timeout));
          try {
            g = !1, n.send(fe, ve);
          } catch (Z) {
            if (g)
              throw Z;
            ve(-1, Z);
          }
        }
        function ve(Z, se, ht, St) {
          var Te, We, Ge, be, Fe, Ee = se;
          g || (g = !0, l && i.clearTimeout(l), n = void 0, s = St || "", K.readyState = Z > 0 ? 4 : 0, Te = Z >= 200 && Z < 300 || Z === 304, ht && (be = In(A, K, ht)), !Te && o.inArray("script", A.dataTypes) > -1 && o.inArray("json", A.dataTypes) < 0 && (A.converters["text script"] = function() {
          }), be = Mn(A, be, K, Te), Te ? (A.ifModified && (Fe = K.getResponseHeader("Last-Modified"), Fe && (o.lastModified[a] = Fe), Fe = K.getResponseHeader("etag"), Fe && (o.etag[a] = Fe)), Z === 204 || A.type === "HEAD" ? Ee = "nocontent" : Z === 304 ? Ee = "notmodified" : (Ee = be.state, We = be.data, Ge = be.error, Te = !Ge)) : (Ge = Ee, (Z || !Ee) && (Ee = "error", Z < 0 && (Z = 0))), K.status = Z, K.statusText = (se || Ee) + "", Te ? J.resolveWith(S, [We, Ee, K]) : J.rejectWith(S, [K, Ee, Ge]), K.statusCode(le), le = void 0, x && H.trigger(
            Te ? "ajaxSuccess" : "ajaxError",
            [K, A, Te ? We : Ge]
          ), k.fireWith(S, [K, Ee]), x && (H.trigger("ajaxComplete", [K, A]), --o.active || o.event.trigger("ajaxStop")));
        }
        return K;
      },
      getJSON: function(e, t, n) {
        return o.get(e, t, n, "json");
      },
      getScript: function(e, t) {
        return o.get(e, void 0, t, "script");
      }
    }), o.each(["get", "post"], function(e, t) {
      o[t] = function(n, a, s, f) {
        return q(a) && (f = f || s, s = a, a = void 0), o.ajax(o.extend({
          url: n,
          type: t,
          dataType: f,
          data: a,
          success: s
        }, o.isPlainObject(n) && n));
      };
    }), o.ajaxPrefilter(function(e) {
      var t;
      for (t in e.headers)
        t.toLowerCase() === "content-type" && (e.contentType = e.headers[t] || "");
    }), o._evalUrl = function(e, t, n) {
      return o.ajax({
        url: e,
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        converters: {
          "text script": function() {
          }
        },
        dataFilter: function(a) {
          o.globalEval(a, t, n);
        }
      });
    }, o.fn.extend({
      wrapAll: function(e) {
        var t;
        return this[0] && (q(e) && (e = e.call(this[0])), t = o(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
          for (var n = this; n.firstElementChild; )
            n = n.firstElementChild;
          return n;
        }).append(this)), this;
      },
      wrapInner: function(e) {
        return q(e) ? this.each(function(t) {
          o(this).wrapInner(e.call(this, t));
        }) : this.each(function() {
          var t = o(this), n = t.contents();
          n.length ? n.wrapAll(e) : t.append(e);
        });
      },
      wrap: function(e) {
        var t = q(e);
        return this.each(function(n) {
          o(this).wrapAll(t ? e.call(this, n) : e);
        });
      },
      unwrap: function(e) {
        return this.parent(e).not("body").each(function() {
          o(this).replaceWith(this.childNodes);
        }), this;
      }
    }), o.expr.pseudos.hidden = function(e) {
      return !o.expr.pseudos.visible(e);
    }, o.expr.pseudos.visible = function(e) {
      return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    }, o.ajaxSettings.xhr = function() {
      try {
        return new i.XMLHttpRequest();
      } catch {
      }
    };
    var qn = {
      0: 200,
      1223: 204
    }, pt = o.ajaxSettings.xhr();
    B.cors = !!pt && "withCredentials" in pt, B.ajax = pt = !!pt, o.ajaxTransport(function(e) {
      var t, n;
      if (B.cors || pt && !e.crossDomain)
        return {
          send: function(a, s) {
            var f, l = e.xhr();
            if (l.open(
              e.type,
              e.url,
              e.async,
              e.username,
              e.password
            ), e.xhrFields)
              for (f in e.xhrFields)
                l[f] = e.xhrFields[f];
            e.mimeType && l.overrideMimeType && l.overrideMimeType(e.mimeType), !e.crossDomain && !a["X-Requested-With"] && (a["X-Requested-With"] = "XMLHttpRequest");
            for (f in a)
              l.setRequestHeader(f, a[f]);
            t = function(v) {
              return function() {
                t && (t = n = l.onload = l.onerror = l.onabort = l.ontimeout = l.onreadystatechange = null, v === "abort" ? l.abort() : v === "error" ? typeof l.status != "number" ? s(0, "error") : s(
                  l.status,
                  l.statusText
                ) : s(
                  qn[l.status] || l.status,
                  l.statusText,
                  (l.responseType || "text") !== "text" || typeof l.responseText != "string" ? { binary: l.response } : { text: l.responseText },
                  l.getAllResponseHeaders()
                ));
              };
            }, l.onload = t(), n = l.onerror = l.ontimeout = t("error"), l.onabort !== void 0 ? l.onabort = n : l.onreadystatechange = function() {
              l.readyState === 4 && i.setTimeout(function() {
                t && n();
              });
            }, t = t("abort");
            try {
              l.send(e.hasContent && e.data || null);
            } catch (v) {
              if (t)
                throw v;
            }
          },
          abort: function() {
            t && t();
          }
        };
    }), o.ajaxPrefilter(function(e) {
      e.crossDomain && (e.contents.script = !1);
    }), o.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function(e) {
          return o.globalEval(e), e;
        }
      }
    }), o.ajaxPrefilter("script", function(e) {
      e.cache === void 0 && (e.cache = !1), e.crossDomain && (e.type = "GET");
    }), o.ajaxTransport("script", function(e) {
      if (e.crossDomain || e.scriptAttrs) {
        var t, n;
        return {
          send: function(a, s) {
            t = o("<script>").attr(e.scriptAttrs || {}).prop({ charset: e.scriptCharset, src: e.url }).on("load error", n = function(f) {
              t.remove(), n = null, f && s(f.type === "error" ? 404 : 200, f.type);
            }), F.head.appendChild(t[0]);
          },
          abort: function() {
            n && n();
          }
        };
      }
    });
    var Lr = [], zt = /(=)\?(?=&|$)|\?\?/;
    o.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var e = Lr.pop() || o.expando + "_" + _r.guid++;
        return this[e] = !0, e;
      }
    }), o.ajaxPrefilter("json jsonp", function(e, t, n) {
      var a, s, f, l = e.jsonp !== !1 && (zt.test(e.url) ? "url" : typeof e.data == "string" && (e.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && zt.test(e.data) && "data");
      if (l || e.dataTypes[0] === "jsonp")
        return a = e.jsonpCallback = q(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, l ? e[l] = e[l].replace(zt, "$1" + a) : e.jsonp !== !1 && (e.url += (kt.test(e.url) ? "&" : "?") + e.jsonp + "=" + a), e.converters["script json"] = function() {
          return f || o.error(a + " was not called"), f[0];
        }, e.dataTypes[0] = "json", s = i[a], i[a] = function() {
          f = arguments;
        }, n.always(function() {
          s === void 0 ? o(i).removeProp(a) : i[a] = s, e[a] && (e.jsonpCallback = t.jsonpCallback, Lr.push(a)), f && q(s) && s(f[0]), f = s = void 0;
        }), "script";
    }), B.createHTMLDocument = function() {
      var e = F.implementation.createHTMLDocument("").body;
      return e.innerHTML = "<form></form><form></form>", e.childNodes.length === 2;
    }(), o.parseHTML = function(e, t, n) {
      if (typeof e != "string")
        return [];
      typeof t == "boolean" && (n = t, t = !1);
      var a, s, f;
      return t || (B.createHTMLDocument ? (t = F.implementation.createHTMLDocument(""), a = t.createElement("base"), a.href = F.location.href, t.head.appendChild(a)) : t = F), s = Re.exec(e), f = !n && [], s ? [t.createElement(s[1])] : (s = lr([e], t, f), f && f.length && o(f).remove(), o.merge([], s.childNodes));
    }, o.fn.load = function(e, t, n) {
      var a, s, f, l = this, v = e.indexOf(" ");
      return v > -1 && (a = ke(e.slice(v)), e = e.slice(0, v)), q(t) ? (n = t, t = void 0) : t && typeof t == "object" && (s = "POST"), l.length > 0 && o.ajax({
        url: e,
        type: s || "GET",
        dataType: "html",
        data: t
      }).done(function(g) {
        f = arguments, l.html(a ? o("<div>").append(o.parseHTML(g)).find(a) : g);
      }).always(n && function(g, x) {
        l.each(function() {
          n.apply(this, f || [g.responseText, x, g]);
        });
      }), this;
    }, o.expr.pseudos.animated = function(e) {
      return o.grep(o.timers, function(t) {
        return e === t.elem;
      }).length;
    }, o.offset = {
      setOffset: function(e, t, n) {
        var a, s, f, l, v, g, x, E = o.css(e, "position"), P = o(e), A = {};
        E === "static" && (e.style.position = "relative"), v = P.offset(), f = o.css(e, "top"), g = o.css(e, "left"), x = (E === "absolute" || E === "fixed") && (f + g).indexOf("auto") > -1, x ? (a = P.position(), l = a.top, s = a.left) : (l = parseFloat(f) || 0, s = parseFloat(g) || 0), q(t) && (t = t.call(e, n, o.extend({}, v))), t.top != null && (A.top = t.top - v.top + l), t.left != null && (A.left = t.left - v.left + s), "using" in t ? t.using.call(e, A) : P.css(A);
      }
    }, o.fn.extend({
      offset: function(e) {
        if (arguments.length)
          return e === void 0 ? this : this.each(function(s) {
            o.offset.setOffset(this, e, s);
          });
        var t, n, a = this[0];
        if (a)
          return a.getClientRects().length ? (t = a.getBoundingClientRect(), n = a.ownerDocument.defaultView, {
            top: t.top + n.pageYOffset,
            left: t.left + n.pageXOffset
          }) : { top: 0, left: 0 };
      },
      position: function() {
        if (this[0]) {
          var e, t, n, a = this[0], s = { top: 0, left: 0 };
          if (o.css(a, "position") === "fixed")
            t = a.getBoundingClientRect();
          else {
            for (t = this.offset(), n = a.ownerDocument, e = a.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && o.css(e, "position") === "static"; )
              e = e.parentNode;
            e && e !== a && e.nodeType === 1 && (s = o(e).offset(), s.top += o.css(e, "borderTopWidth", !0), s.left += o.css(e, "borderLeftWidth", !0));
          }
          return {
            top: t.top - s.top - o.css(a, "marginTop", !0),
            left: t.left - s.left - o.css(a, "marginLeft", !0)
          };
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var e = this.offsetParent; e && o.css(e, "position") === "static"; )
            e = e.offsetParent;
          return e || He;
        });
      }
    }), o.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(e, t) {
      var n = t === "pageYOffset";
      o.fn[e] = function(a) {
        return Le(this, function(s, f, l) {
          var v;
          if (ee(s) ? v = s : s.nodeType === 9 && (v = s.defaultView), l === void 0)
            return v ? v[t] : s[f];
          v ? v.scrollTo(
            n ? v.pageXOffset : l,
            n ? l : v.pageYOffset
          ) : s[f] = l;
        }, e, a, arguments.length);
      };
    }), o.each(["top", "left"], function(e, t) {
      o.cssHooks[t] = vr(
        B.pixelPosition,
        function(n, a) {
          if (a)
            return a = lt(n, t), It.test(a) ? o(n).position()[t] + "px" : a;
        }
      );
    }), o.each({ Height: "height", Width: "width" }, function(e, t) {
      o.each({
        padding: "inner" + e,
        content: t,
        "": "outer" + e
      }, function(n, a) {
        o.fn[a] = function(s, f) {
          var l = arguments.length && (n || typeof s != "boolean"), v = n || (s === !0 || f === !0 ? "margin" : "border");
          return Le(this, function(g, x, E) {
            var P;
            return ee(g) ? a.indexOf("outer") === 0 ? g["inner" + e] : g.document.documentElement["client" + e] : g.nodeType === 9 ? (P = g.documentElement, Math.max(
              g.body["scroll" + e],
              P["scroll" + e],
              g.body["offset" + e],
              P["offset" + e],
              P["client" + e]
            )) : E === void 0 ? o.css(g, x, v) : o.style(g, x, E, v);
          }, t, l ? s : void 0, l);
        };
      });
    }), o.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(e, t) {
      o.fn[t] = function(n) {
        return this.on(t, n);
      };
    }), o.fn.extend({
      bind: function(e, t, n) {
        return this.on(e, null, t, n);
      },
      unbind: function(e, t) {
        return this.off(e, null, t);
      },
      delegate: function(e, t, n, a) {
        return this.on(t, e, n, a);
      },
      undelegate: function(e, t, n) {
        return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n);
      },
      hover: function(e, t) {
        return this.mouseenter(e).mouseleave(t || e);
      }
    }), o.each(
      "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
      function(e, t) {
        o.fn[t] = function(n, a) {
          return arguments.length > 0 ? this.on(t, null, n, a) : this.trigger(t);
        };
      }
    );
    var Fn = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
    o.proxy = function(e, t) {
      var n, a, s;
      if (typeof t == "string" && (n = e[t], t = e, e = n), !!q(e))
        return a = p.call(arguments, 2), s = function() {
          return e.apply(t || this, a.concat(p.call(arguments)));
        }, s.guid = e.guid = e.guid || o.guid++, s;
    }, o.holdReady = function(e) {
      e ? o.readyWait++ : o.ready(!0);
    }, o.isArray = Array.isArray, o.parseJSON = JSON.parse, o.nodeName = ae, o.isFunction = q, o.isWindow = ee, o.camelCase = Ne, o.type = pe, o.now = Date.now, o.isNumeric = function(e) {
      var t = o.type(e);
      return (t === "number" || t === "string") && !isNaN(e - parseFloat(e));
    }, o.trim = function(e) {
      return e == null ? "" : (e + "").replace(Fn, "$1");
    };
    var Bn = i.jQuery, Hn = i.$;
    return o.noConflict = function(e) {
      return i.$ === o && (i.$ = Hn), e && i.jQuery === o && (i.jQuery = Bn), o;
    }, typeof u > "u" && (i.jQuery = i.$ = o), o;
  });
})(jquery);
const $ = jquery.exports;
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
const freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self, root = freeGlobal$1 || freeSelf || Function("return this")();
const root$1 = root;
var Symbol$1 = root$1.Symbol;
const Symbol$2 = Symbol$1;
var objectProto$f = Object.prototype, hasOwnProperty$c = objectProto$f.hasOwnProperty, nativeObjectToString$1 = objectProto$f.toString, symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(r) {
  var i = hasOwnProperty$c.call(r, symToStringTag$1), u = r[symToStringTag$1];
  try {
    r[symToStringTag$1] = void 0;
    var d = !0;
  } catch {
  }
  var h = nativeObjectToString$1.call(r);
  return d && (i ? r[symToStringTag$1] = u : delete r[symToStringTag$1]), h;
}
var objectProto$e = Object.prototype, nativeObjectToString = objectProto$e.toString;
function objectToString(r) {
  return nativeObjectToString.call(r);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]", symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(r) {
  return r == null ? r === void 0 ? undefinedTag : nullTag : symToStringTag && symToStringTag in Object(r) ? getRawTag(r) : objectToString(r);
}
function isObjectLike(r) {
  return r != null && typeof r == "object";
}
var isArray$1 = Array.isArray;
const isArray$2 = isArray$1;
function isObject$1(r) {
  var i = typeof r;
  return r != null && (i == "object" || i == "function");
}
function identity(r) {
  return r;
}
var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$1(r) {
  if (!isObject$1(r))
    return !1;
  var i = baseGetTag(r);
  return i == funcTag$2 || i == genTag$1 || i == asyncTag || i == proxyTag;
}
var coreJsData = root$1["__core-js_shared__"];
const coreJsData$1 = coreJsData;
var maskSrcKey = function() {
  var r = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
}();
function isMasked(r) {
  return !!maskSrcKey && maskSrcKey in r;
}
var funcProto$2 = Function.prototype, funcToString$2 = funcProto$2.toString;
function toSource(r) {
  if (r != null) {
    try {
      return funcToString$2.call(r);
    } catch {
    }
    try {
      return r + "";
    } catch {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reIsHostCtor = /^\[object .+?Constructor\]$/, funcProto$1 = Function.prototype, objectProto$d = Object.prototype, funcToString$1 = funcProto$1.toString, hasOwnProperty$b = objectProto$d.hasOwnProperty, reIsNative = RegExp(
  "^" + funcToString$1.call(hasOwnProperty$b).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(r) {
  if (!isObject$1(r) || isMasked(r))
    return !1;
  var i = isFunction$1(r) ? reIsNative : reIsHostCtor;
  return i.test(toSource(r));
}
function getValue(r, i) {
  return r == null ? void 0 : r[i];
}
function getNative(r, i) {
  var u = getValue(r, i);
  return baseIsNative(u) ? u : void 0;
}
var WeakMap = getNative(root$1, "WeakMap");
const WeakMap$1 = WeakMap;
var objectCreate = Object.create, baseCreate = function() {
  function r() {
  }
  return function(i) {
    if (!isObject$1(i))
      return {};
    if (objectCreate)
      return objectCreate(i);
    r.prototype = i;
    var u = new r();
    return r.prototype = void 0, u;
  };
}();
const baseCreate$1 = baseCreate;
function apply(r, i, u) {
  switch (u.length) {
    case 0:
      return r.call(i);
    case 1:
      return r.call(i, u[0]);
    case 2:
      return r.call(i, u[0], u[1]);
    case 3:
      return r.call(i, u[0], u[1], u[2]);
  }
  return r.apply(i, u);
}
function noop() {
}
function copyArray(r, i) {
  var u = -1, d = r.length;
  for (i || (i = Array(d)); ++u < d; )
    i[u] = r[u];
  return i;
}
var HOT_COUNT = 800, HOT_SPAN = 16, nativeNow = Date.now;
function shortOut(r) {
  var i = 0, u = 0;
  return function() {
    var d = nativeNow(), h = HOT_SPAN - (d - u);
    if (u = d, h > 0) {
      if (++i >= HOT_COUNT)
        return arguments[0];
    } else
      i = 0;
    return r.apply(void 0, arguments);
  };
}
function constant(r) {
  return function() {
    return r;
  };
}
var defineProperty = function() {
  try {
    var r = getNative(Object, "defineProperty");
    return r({}, "", {}), r;
  } catch {
  }
}();
const defineProperty$1 = defineProperty;
var baseSetToString = defineProperty$1 ? function(r, i) {
  return defineProperty$1(r, "toString", {
    configurable: !0,
    enumerable: !1,
    value: constant(i),
    writable: !0
  });
} : identity;
const baseSetToString$1 = baseSetToString;
var setToString = shortOut(baseSetToString$1);
const setToString$1 = setToString;
function arrayEach(r, i) {
  for (var u = -1, d = r == null ? 0 : r.length; ++u < d && i(r[u], u, r) !== !1; )
    ;
  return r;
}
function baseFindIndex(r, i, u, d) {
  for (var h = r.length, p = u + (d ? 1 : -1); d ? p-- : ++p < h; )
    if (i(r[p], p, r))
      return p;
  return -1;
}
function baseIsNaN(r) {
  return r !== r;
}
function strictIndexOf(r, i, u) {
  for (var d = u - 1, h = r.length; ++d < h; )
    if (r[d] === i)
      return d;
  return -1;
}
function baseIndexOf(r, i, u) {
  return i === i ? strictIndexOf(r, i, u) : baseFindIndex(r, baseIsNaN, u);
}
function arrayIncludes(r, i) {
  var u = r == null ? 0 : r.length;
  return !!u && baseIndexOf(r, i, 0) > -1;
}
var MAX_SAFE_INTEGER$1 = 9007199254740991, reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(r, i) {
  var u = typeof r;
  return i = i ?? MAX_SAFE_INTEGER$1, !!i && (u == "number" || u != "symbol" && reIsUint.test(r)) && r > -1 && r % 1 == 0 && r < i;
}
function baseAssignValue(r, i, u) {
  i == "__proto__" && defineProperty$1 ? defineProperty$1(r, i, {
    configurable: !0,
    enumerable: !0,
    value: u,
    writable: !0
  }) : r[i] = u;
}
function eq(r, i) {
  return r === i || r !== r && i !== i;
}
var objectProto$c = Object.prototype, hasOwnProperty$a = objectProto$c.hasOwnProperty;
function assignValue(r, i, u) {
  var d = r[i];
  (!(hasOwnProperty$a.call(r, i) && eq(d, u)) || u === void 0 && !(i in r)) && baseAssignValue(r, i, u);
}
function copyObject(r, i, u, d) {
  var h = !u;
  u || (u = {});
  for (var p = -1, m = i.length; ++p < m; ) {
    var C = i[p], O = d ? d(u[C], r[C], C, u, r) : void 0;
    O === void 0 && (O = r[C]), h ? baseAssignValue(u, C, O) : assignValue(u, C, O);
  }
  return u;
}
var nativeMax = Math.max;
function overRest(r, i, u) {
  return i = nativeMax(i === void 0 ? r.length - 1 : i, 0), function() {
    for (var d = arguments, h = -1, p = nativeMax(d.length - i, 0), m = Array(p); ++h < p; )
      m[h] = d[i + h];
    h = -1;
    for (var C = Array(i + 1); ++h < i; )
      C[h] = d[h];
    return C[i] = u(m), apply(r, this, C);
  };
}
function baseRest(r, i) {
  return setToString$1(overRest(r, i, identity), r + "");
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(r) {
  return typeof r == "number" && r > -1 && r % 1 == 0 && r <= MAX_SAFE_INTEGER;
}
function isArrayLike(r) {
  return r != null && isLength(r.length) && !isFunction$1(r);
}
function isIterateeCall(r, i, u) {
  if (!isObject$1(u))
    return !1;
  var d = typeof i;
  return (d == "number" ? isArrayLike(u) && isIndex(i, u.length) : d == "string" && i in u) ? eq(u[i], r) : !1;
}
function createAssigner(r) {
  return baseRest(function(i, u) {
    var d = -1, h = u.length, p = h > 1 ? u[h - 1] : void 0, m = h > 2 ? u[2] : void 0;
    for (p = r.length > 3 && typeof p == "function" ? (h--, p) : void 0, m && isIterateeCall(u[0], u[1], m) && (p = h < 3 ? void 0 : p, h = 1), i = Object(i); ++d < h; ) {
      var C = u[d];
      C && r(i, C, d, p);
    }
    return i;
  });
}
var objectProto$b = Object.prototype;
function isPrototype(r) {
  var i = r && r.constructor, u = typeof i == "function" && i.prototype || objectProto$b;
  return r === u;
}
function baseTimes(r, i) {
  for (var u = -1, d = Array(r); ++u < r; )
    d[u] = i(u);
  return d;
}
var argsTag$3 = "[object Arguments]";
function baseIsArguments(r) {
  return isObjectLike(r) && baseGetTag(r) == argsTag$3;
}
var objectProto$a = Object.prototype, hasOwnProperty$9 = objectProto$a.hasOwnProperty, propertyIsEnumerable$1 = objectProto$a.propertyIsEnumerable, isArguments = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(r) {
  return isObjectLike(r) && hasOwnProperty$9.call(r, "callee") && !propertyIsEnumerable$1.call(r, "callee");
};
const isArguments$1 = isArguments;
function stubFalse() {
  return !1;
}
var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports, freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module, moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2, Buffer$2 = moduleExports$2 ? root$1.Buffer : void 0, nativeIsBuffer = Buffer$2 ? Buffer$2.isBuffer : void 0, isBuffer$1 = nativeIsBuffer || stubFalse;
const isBuffer$2 = isBuffer$1;
var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$4 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$5 = "[object Map]", numberTag$3 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$3 = "[object String]", weakMapTag$2 = "[object WeakMap]", arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]", typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = !0;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$4] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = !1;
function baseIsTypedArray(r) {
  return isObjectLike(r) && isLength(r.length) && !!typedArrayTags[baseGetTag(r)];
}
function baseUnary(r) {
  return function(i) {
    return r(i);
  };
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports, freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module, moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1, freeProcess = moduleExports$1 && freeGlobal$1.process, nodeUtil = function() {
  try {
    var r = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
    return r || freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch {
  }
}();
const nodeUtil$1 = nodeUtil;
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray, isTypedArray$1 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
const isTypedArray$2 = isTypedArray$1;
var objectProto$9 = Object.prototype, hasOwnProperty$8 = objectProto$9.hasOwnProperty;
function arrayLikeKeys(r, i) {
  var u = isArray$2(r), d = !u && isArguments$1(r), h = !u && !d && isBuffer$2(r), p = !u && !d && !h && isTypedArray$2(r), m = u || d || h || p, C = m ? baseTimes(r.length, String) : [], O = C.length;
  for (var D in r)
    (i || hasOwnProperty$8.call(r, D)) && !(m && (D == "length" || h && (D == "offset" || D == "parent") || p && (D == "buffer" || D == "byteLength" || D == "byteOffset") || isIndex(D, O))) && C.push(D);
  return C;
}
function overArg(r, i) {
  return function(u) {
    return r(i(u));
  };
}
var nativeKeys = overArg(Object.keys, Object);
const nativeKeys$1 = nativeKeys;
var objectProto$8 = Object.prototype, hasOwnProperty$7 = objectProto$8.hasOwnProperty;
function baseKeys(r) {
  if (!isPrototype(r))
    return nativeKeys$1(r);
  var i = [];
  for (var u in Object(r))
    hasOwnProperty$7.call(r, u) && u != "constructor" && i.push(u);
  return i;
}
function keys(r) {
  return isArrayLike(r) ? arrayLikeKeys(r) : baseKeys(r);
}
function nativeKeysIn(r) {
  var i = [];
  if (r != null)
    for (var u in Object(r))
      i.push(u);
  return i;
}
var objectProto$7 = Object.prototype, hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function baseKeysIn(r) {
  if (!isObject$1(r))
    return nativeKeysIn(r);
  var i = isPrototype(r), u = [];
  for (var d in r)
    d == "constructor" && (i || !hasOwnProperty$6.call(r, d)) || u.push(d);
  return u;
}
function keysIn(r) {
  return isArrayLike(r) ? arrayLikeKeys(r, !0) : baseKeysIn(r);
}
var nativeCreate = getNative(Object, "create");
const nativeCreate$1 = nativeCreate;
function hashClear() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {}, this.size = 0;
}
function hashDelete(r) {
  var i = this.has(r) && delete this.__data__[r];
  return this.size -= i ? 1 : 0, i;
}
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__", objectProto$6 = Object.prototype, hasOwnProperty$5 = objectProto$6.hasOwnProperty;
function hashGet(r) {
  var i = this.__data__;
  if (nativeCreate$1) {
    var u = i[r];
    return u === HASH_UNDEFINED$2 ? void 0 : u;
  }
  return hasOwnProperty$5.call(i, r) ? i[r] : void 0;
}
var objectProto$5 = Object.prototype, hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function hashHas(r) {
  var i = this.__data__;
  return nativeCreate$1 ? i[r] !== void 0 : hasOwnProperty$4.call(i, r);
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(r, i) {
  var u = this.__data__;
  return this.size += this.has(r) ? 0 : 1, u[r] = nativeCreate$1 && i === void 0 ? HASH_UNDEFINED$1 : i, this;
}
function Hash(r) {
  var i = -1, u = r == null ? 0 : r.length;
  for (this.clear(); ++i < u; ) {
    var d = r[i];
    this.set(d[0], d[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype.delete = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [], this.size = 0;
}
function assocIndexOf(r, i) {
  for (var u = r.length; u--; )
    if (eq(r[u][0], i))
      return u;
  return -1;
}
var arrayProto = Array.prototype, splice = arrayProto.splice;
function listCacheDelete(r) {
  var i = this.__data__, u = assocIndexOf(i, r);
  if (u < 0)
    return !1;
  var d = i.length - 1;
  return u == d ? i.pop() : splice.call(i, u, 1), --this.size, !0;
}
function listCacheGet(r) {
  var i = this.__data__, u = assocIndexOf(i, r);
  return u < 0 ? void 0 : i[u][1];
}
function listCacheHas(r) {
  return assocIndexOf(this.__data__, r) > -1;
}
function listCacheSet(r, i) {
  var u = this.__data__, d = assocIndexOf(u, r);
  return d < 0 ? (++this.size, u.push([r, i])) : u[d][1] = i, this;
}
function ListCache(r) {
  var i = -1, u = r == null ? 0 : r.length;
  for (this.clear(); ++i < u; ) {
    var d = r[i];
    this.set(d[0], d[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype.delete = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map = getNative(root$1, "Map");
const Map$1 = Map;
function mapCacheClear() {
  this.size = 0, this.__data__ = {
    hash: new Hash(),
    map: new (Map$1 || ListCache)(),
    string: new Hash()
  };
}
function isKeyable(r) {
  var i = typeof r;
  return i == "string" || i == "number" || i == "symbol" || i == "boolean" ? r !== "__proto__" : r === null;
}
function getMapData(r, i) {
  var u = r.__data__;
  return isKeyable(i) ? u[typeof i == "string" ? "string" : "hash"] : u.map;
}
function mapCacheDelete(r) {
  var i = getMapData(this, r).delete(r);
  return this.size -= i ? 1 : 0, i;
}
function mapCacheGet(r) {
  return getMapData(this, r).get(r);
}
function mapCacheHas(r) {
  return getMapData(this, r).has(r);
}
function mapCacheSet(r, i) {
  var u = getMapData(this, r), d = u.size;
  return u.set(r, i), this.size += u.size == d ? 0 : 1, this;
}
function MapCache(r) {
  var i = -1, u = r == null ? 0 : r.length;
  for (this.clear(); ++i < u; ) {
    var d = r[i];
    this.set(d[0], d[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype.delete = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
function arrayPush(r, i) {
  for (var u = -1, d = i.length, h = r.length; ++u < d; )
    r[h + u] = i[u];
  return r;
}
var getPrototype = overArg(Object.getPrototypeOf, Object);
const getPrototype$1 = getPrototype;
var objectTag$3 = "[object Object]", funcProto = Function.prototype, objectProto$4 = Object.prototype, funcToString = funcProto.toString, hasOwnProperty$3 = objectProto$4.hasOwnProperty, objectCtorString = funcToString.call(Object);
function isPlainObject$1(r) {
  if (!isObjectLike(r) || baseGetTag(r) != objectTag$3)
    return !1;
  var i = getPrototype$1(r);
  if (i === null)
    return !0;
  var u = hasOwnProperty$3.call(i, "constructor") && i.constructor;
  return typeof u == "function" && u instanceof u && funcToString.call(u) == objectCtorString;
}
function stackClear() {
  this.__data__ = new ListCache(), this.size = 0;
}
function stackDelete(r) {
  var i = this.__data__, u = i.delete(r);
  return this.size = i.size, u;
}
function stackGet(r) {
  return this.__data__.get(r);
}
function stackHas(r) {
  return this.__data__.has(r);
}
var LARGE_ARRAY_SIZE$1 = 200;
function stackSet(r, i) {
  var u = this.__data__;
  if (u instanceof ListCache) {
    var d = u.__data__;
    if (!Map$1 || d.length < LARGE_ARRAY_SIZE$1 - 1)
      return d.push([r, i]), this.size = ++u.size, this;
    u = this.__data__ = new MapCache(d);
  }
  return u.set(r, i), this.size = u.size, this;
}
function Stack(r) {
  var i = this.__data__ = new ListCache(r);
  this.size = i.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype.delete = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
function baseAssign(r, i) {
  return r && copyObject(i, keys(i), r);
}
function baseAssignIn(r, i) {
  return r && copyObject(i, keysIn(i), r);
}
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports, freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module, moduleExports = freeModule && freeModule.exports === freeExports, Buffer$1 = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : void 0;
function cloneBuffer(r, i) {
  if (i)
    return r.slice();
  var u = r.length, d = allocUnsafe ? allocUnsafe(u) : new r.constructor(u);
  return r.copy(d), d;
}
function arrayFilter(r, i) {
  for (var u = -1, d = r == null ? 0 : r.length, h = 0, p = []; ++u < d; ) {
    var m = r[u];
    i(m, u, r) && (p[h++] = m);
  }
  return p;
}
function stubArray() {
  return [];
}
var objectProto$3 = Object.prototype, propertyIsEnumerable = objectProto$3.propertyIsEnumerable, nativeGetSymbols$1 = Object.getOwnPropertySymbols, getSymbols = nativeGetSymbols$1 ? function(r) {
  return r == null ? [] : (r = Object(r), arrayFilter(nativeGetSymbols$1(r), function(i) {
    return propertyIsEnumerable.call(r, i);
  }));
} : stubArray;
const getSymbols$1 = getSymbols;
function copySymbols(r, i) {
  return copyObject(r, getSymbols$1(r), i);
}
var nativeGetSymbols = Object.getOwnPropertySymbols, getSymbolsIn = nativeGetSymbols ? function(r) {
  for (var i = []; r; )
    arrayPush(i, getSymbols$1(r)), r = getPrototype$1(r);
  return i;
} : stubArray;
const getSymbolsIn$1 = getSymbolsIn;
function copySymbolsIn(r, i) {
  return copyObject(r, getSymbolsIn$1(r), i);
}
function baseGetAllKeys(r, i, u) {
  var d = i(r);
  return isArray$2(r) ? d : arrayPush(d, u(r));
}
function getAllKeys(r) {
  return baseGetAllKeys(r, keys, getSymbols$1);
}
function getAllKeysIn(r) {
  return baseGetAllKeys(r, keysIn, getSymbolsIn$1);
}
var DataView = getNative(root$1, "DataView");
const DataView$1 = DataView;
var Promise$1 = getNative(root$1, "Promise");
const Promise$2 = Promise$1;
var Set = getNative(root$1, "Set");
const Set$1 = Set;
var mapTag$4 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]", dataViewTag$3 = "[object DataView]", dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1), getTag = baseGetTag;
(DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$4 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$4 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) && (getTag = function(r) {
  var i = baseGetTag(r), u = i == objectTag$2 ? r.constructor : void 0, d = u ? toSource(u) : "";
  if (d)
    switch (d) {
      case dataViewCtorString:
        return dataViewTag$3;
      case mapCtorString:
        return mapTag$4;
      case promiseCtorString:
        return promiseTag;
      case setCtorString:
        return setTag$4;
      case weakMapCtorString:
        return weakMapTag$1;
    }
  return i;
});
const getTag$1 = getTag;
var objectProto$2 = Object.prototype, hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function initCloneArray(r) {
  var i = r.length, u = new r.constructor(i);
  return i && typeof r[0] == "string" && hasOwnProperty$2.call(r, "index") && (u.index = r.index, u.input = r.input), u;
}
var Uint8Array$1 = root$1.Uint8Array;
const Uint8Array$2 = Uint8Array$1;
function cloneArrayBuffer(r) {
  var i = new r.constructor(r.byteLength);
  return new Uint8Array$2(i).set(new Uint8Array$2(r)), i;
}
function cloneDataView(r, i) {
  var u = i ? cloneArrayBuffer(r.buffer) : r.buffer;
  return new r.constructor(u, r.byteOffset, r.byteLength);
}
var reFlags = /\w*$/;
function cloneRegExp(r) {
  var i = new r.constructor(r.source, reFlags.exec(r));
  return i.lastIndex = r.lastIndex, i;
}
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function cloneSymbol(r) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(r)) : {};
}
function cloneTypedArray(r, i) {
  var u = i ? cloneArrayBuffer(r.buffer) : r.buffer;
  return new r.constructor(u, r.byteOffset, r.length);
}
var boolTag$3 = "[object Boolean]", dateTag$2 = "[object Date]", mapTag$3 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$2 = "[object String]", symbolTag$2 = "[object Symbol]", arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag(r, i, u) {
  var d = r.constructor;
  switch (i) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(r);
    case boolTag$3:
    case dateTag$2:
      return new d(+r);
    case dataViewTag$2:
      return cloneDataView(r, u);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(r, u);
    case mapTag$3:
      return new d();
    case numberTag$2:
    case stringTag$2:
      return new d(r);
    case regexpTag$2:
      return cloneRegExp(r);
    case setTag$3:
      return new d();
    case symbolTag$2:
      return cloneSymbol(r);
  }
}
function initCloneObject(r) {
  return typeof r.constructor == "function" && !isPrototype(r) ? baseCreate$1(getPrototype$1(r)) : {};
}
var mapTag$2 = "[object Map]";
function baseIsMap(r) {
  return isObjectLike(r) && getTag$1(r) == mapTag$2;
}
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap, isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
const isMap$1 = isMap;
var setTag$2 = "[object Set]";
function baseIsSet(r) {
  return isObjectLike(r) && getTag$1(r) == setTag$2;
}
var nodeIsSet = nodeUtil$1 && nodeUtil$1.isSet, isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
const isSet$1 = isSet;
var CLONE_DEEP_FLAG$1 = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG$1 = 4, argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$1 = "[object Map]", numberTag$1 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$1 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]", arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]", cloneableTags = {};
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$2] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = !0;
cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = !1;
function baseClone(r, i, u, d, h, p) {
  var m, C = i & CLONE_DEEP_FLAG$1, O = i & CLONE_FLAT_FLAG, D = i & CLONE_SYMBOLS_FLAG$1;
  if (u && (m = h ? u(r, d, h, p) : u(r)), m !== void 0)
    return m;
  if (!isObject$1(r))
    return r;
  var R = isArray$2(r);
  if (R) {
    if (m = initCloneArray(r), !C)
      return copyArray(r, m);
  } else {
    var M = getTag$1(r), N = M == funcTag || M == genTag;
    if (isBuffer$2(r))
      return cloneBuffer(r, C);
    if (M == objectTag$1 || M == argsTag$1 || N && !h) {
      if (m = O || N ? {} : initCloneObject(r), !C)
        return O ? copySymbolsIn(r, baseAssignIn(m, r)) : copySymbols(r, baseAssign(m, r));
    } else {
      if (!cloneableTags[M])
        return h ? r : {};
      m = initCloneByTag(r, M, C);
    }
  }
  p || (p = new Stack());
  var Q = p.get(r);
  if (Q)
    return Q;
  p.set(r, m), isSet$1(r) ? r.forEach(function(ee) {
    m.add(baseClone(ee, i, u, ee, r, p));
  }) : isMap$1(r) && r.forEach(function(ee, F) {
    m.set(F, baseClone(ee, i, u, F, r, p));
  });
  var B = D ? O ? getAllKeysIn : getAllKeys : O ? keysIn : keys, q = R ? void 0 : B(r);
  return arrayEach(q || r, function(ee, F) {
    q && (F = ee, ee = r[F]), assignValue(m, F, baseClone(ee, i, u, F, r, p));
  }), m;
}
var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
function cloneDeep(r) {
  return baseClone(r, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(r) {
  return this.__data__.set(r, HASH_UNDEFINED), this;
}
function setCacheHas(r) {
  return this.__data__.has(r);
}
function SetCache(r) {
  var i = -1, u = r == null ? 0 : r.length;
  for (this.__data__ = new MapCache(); ++i < u; )
    this.add(r[i]);
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function arraySome(r, i) {
  for (var u = -1, d = r == null ? 0 : r.length; ++u < d; )
    if (i(r[u], u, r))
      return !0;
  return !1;
}
function cacheHas(r, i) {
  return r.has(i);
}
var COMPARE_PARTIAL_FLAG$3 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function equalArrays(r, i, u, d, h, p) {
  var m = u & COMPARE_PARTIAL_FLAG$3, C = r.length, O = i.length;
  if (C != O && !(m && O > C))
    return !1;
  var D = p.get(r), R = p.get(i);
  if (D && R)
    return D == i && R == r;
  var M = -1, N = !0, Q = u & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0;
  for (p.set(r, i), p.set(i, r); ++M < C; ) {
    var B = r[M], q = i[M];
    if (d)
      var ee = m ? d(q, B, M, i, r, p) : d(B, q, M, r, i, p);
    if (ee !== void 0) {
      if (ee)
        continue;
      N = !1;
      break;
    }
    if (Q) {
      if (!arraySome(i, function(F, ue) {
        if (!cacheHas(Q, ue) && (B === F || h(B, F, u, d, p)))
          return Q.push(ue);
      })) {
        N = !1;
        break;
      }
    } else if (!(B === q || h(B, q, u, d, p))) {
      N = !1;
      break;
    }
  }
  return p.delete(r), p.delete(i), N;
}
function mapToArray(r) {
  var i = -1, u = Array(r.size);
  return r.forEach(function(d, h) {
    u[++i] = [h, d];
  }), u;
}
function setToArray(r) {
  var i = -1, u = Array(r.size);
  return r.forEach(function(d) {
    u[++i] = d;
  }), u;
}
var COMPARE_PARTIAL_FLAG$2 = 1, COMPARE_UNORDERED_FLAG = 2, boolTag$1 = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag(r, i, u, d, h, p, m) {
  switch (u) {
    case dataViewTag:
      if (r.byteLength != i.byteLength || r.byteOffset != i.byteOffset)
        return !1;
      r = r.buffer, i = i.buffer;
    case arrayBufferTag:
      return !(r.byteLength != i.byteLength || !p(new Uint8Array$2(r), new Uint8Array$2(i)));
    case boolTag$1:
    case dateTag:
    case numberTag:
      return eq(+r, +i);
    case errorTag:
      return r.name == i.name && r.message == i.message;
    case regexpTag:
    case stringTag:
      return r == i + "";
    case mapTag:
      var C = mapToArray;
    case setTag:
      var O = d & COMPARE_PARTIAL_FLAG$2;
      if (C || (C = setToArray), r.size != i.size && !O)
        return !1;
      var D = m.get(r);
      if (D)
        return D == i;
      d |= COMPARE_UNORDERED_FLAG, m.set(r, i);
      var R = equalArrays(C(r), C(i), d, h, p, m);
      return m.delete(r), R;
    case symbolTag:
      if (symbolValueOf)
        return symbolValueOf.call(r) == symbolValueOf.call(i);
  }
  return !1;
}
var COMPARE_PARTIAL_FLAG$1 = 1, objectProto$1 = Object.prototype, hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function equalObjects(r, i, u, d, h, p) {
  var m = u & COMPARE_PARTIAL_FLAG$1, C = getAllKeys(r), O = C.length, D = getAllKeys(i), R = D.length;
  if (O != R && !m)
    return !1;
  for (var M = O; M--; ) {
    var N = C[M];
    if (!(m ? N in i : hasOwnProperty$1.call(i, N)))
      return !1;
  }
  var Q = p.get(r), B = p.get(i);
  if (Q && B)
    return Q == i && B == r;
  var q = !0;
  p.set(r, i), p.set(i, r);
  for (var ee = m; ++M < O; ) {
    N = C[M];
    var F = r[N], ue = i[N];
    if (d)
      var Ae = m ? d(ue, F, N, i, r, p) : d(F, ue, N, r, i, p);
    if (!(Ae === void 0 ? F === ue || h(F, ue, u, d, p) : Ae)) {
      q = !1;
      break;
    }
    ee || (ee = N == "constructor");
  }
  if (q && !ee) {
    var pe = r.constructor, X = i.constructor;
    pe != X && "constructor" in r && "constructor" in i && !(typeof pe == "function" && pe instanceof pe && typeof X == "function" && X instanceof X) && (q = !1);
  }
  return p.delete(r), p.delete(i), q;
}
var COMPARE_PARTIAL_FLAG = 1, argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]", objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty;
function baseIsEqualDeep(r, i, u, d, h, p) {
  var m = isArray$2(r), C = isArray$2(i), O = m ? arrayTag : getTag$1(r), D = C ? arrayTag : getTag$1(i);
  O = O == argsTag ? objectTag : O, D = D == argsTag ? objectTag : D;
  var R = O == objectTag, M = D == objectTag, N = O == D;
  if (N && isBuffer$2(r)) {
    if (!isBuffer$2(i))
      return !1;
    m = !0, R = !1;
  }
  if (N && !R)
    return p || (p = new Stack()), m || isTypedArray$2(r) ? equalArrays(r, i, u, d, h, p) : equalByTag(r, i, O, u, d, h, p);
  if (!(u & COMPARE_PARTIAL_FLAG)) {
    var Q = R && hasOwnProperty.call(r, "__wrapped__"), B = M && hasOwnProperty.call(i, "__wrapped__");
    if (Q || B) {
      var q = Q ? r.value() : r, ee = B ? i.value() : i;
      return p || (p = new Stack()), h(q, ee, u, d, p);
    }
  }
  return N ? (p || (p = new Stack()), equalObjects(r, i, u, d, h, p)) : !1;
}
function baseIsEqual(r, i, u, d, h) {
  return r === i ? !0 : r == null || i == null || !isObjectLike(r) && !isObjectLike(i) ? r !== r && i !== i : baseIsEqualDeep(r, i, u, d, baseIsEqual, h);
}
function createBaseFor(r) {
  return function(i, u, d) {
    for (var h = -1, p = Object(i), m = d(i), C = m.length; C--; ) {
      var O = m[r ? C : ++h];
      if (u(p[O], O, p) === !1)
        break;
    }
    return i;
  };
}
var baseFor = createBaseFor();
const baseFor$1 = baseFor;
function assignMergeValue(r, i, u) {
  (u !== void 0 && !eq(r[i], u) || u === void 0 && !(i in r)) && baseAssignValue(r, i, u);
}
function isArrayLikeObject(r) {
  return isObjectLike(r) && isArrayLike(r);
}
function safeGet(r, i) {
  if (!(i === "constructor" && typeof r[i] == "function") && i != "__proto__")
    return r[i];
}
function toPlainObject(r) {
  return copyObject(r, keysIn(r));
}
function baseMergeDeep(r, i, u, d, h, p, m) {
  var C = safeGet(r, u), O = safeGet(i, u), D = m.get(O);
  if (D) {
    assignMergeValue(r, u, D);
    return;
  }
  var R = p ? p(C, O, u + "", r, i, m) : void 0, M = R === void 0;
  if (M) {
    var N = isArray$2(O), Q = !N && isBuffer$2(O), B = !N && !Q && isTypedArray$2(O);
    R = O, N || Q || B ? isArray$2(C) ? R = C : isArrayLikeObject(C) ? R = copyArray(C) : Q ? (M = !1, R = cloneBuffer(O, !0)) : B ? (M = !1, R = cloneTypedArray(O, !0)) : R = [] : isPlainObject$1(O) || isArguments$1(O) ? (R = C, isArguments$1(C) ? R = toPlainObject(C) : (!isObject$1(C) || isFunction$1(C)) && (R = initCloneObject(O))) : M = !1;
  }
  M && (m.set(O, R), h(R, O, d, p, m), m.delete(O)), assignMergeValue(r, u, R);
}
function baseMerge(r, i, u, d, h) {
  r !== i && baseFor$1(i, function(p, m) {
    if (h || (h = new Stack()), isObject$1(p))
      baseMergeDeep(r, i, m, u, baseMerge, d, h);
    else {
      var C = d ? d(safeGet(r, m), p, m + "", r, i, h) : void 0;
      C === void 0 && (C = p), assignMergeValue(r, m, C);
    }
  }, keysIn);
}
function arrayIncludesWith(r, i, u) {
  for (var d = -1, h = r == null ? 0 : r.length; ++d < h; )
    if (u(i, r[d]))
      return !0;
  return !1;
}
var boolTag = "[object Boolean]";
function isBoolean(r) {
  return r === !0 || r === !1 || isObjectLike(r) && baseGetTag(r) == boolTag;
}
function isEqual(r, i) {
  return baseIsEqual(r, i);
}
var merge$1 = createAssigner(function(r, i, u) {
  baseMerge(r, i, u);
});
const merge$2 = merge$1;
var INFINITY = 1 / 0, createSet = Set$1 && 1 / setToArray(new Set$1([, -0]))[1] == INFINITY ? function(r) {
  return new Set$1(r);
} : noop;
const createSet$1 = createSet;
var LARGE_ARRAY_SIZE = 200;
function baseUniq(r, i, u) {
  var d = -1, h = arrayIncludes, p = r.length, m = !0, C = [], O = C;
  if (u)
    m = !1, h = arrayIncludesWith;
  else if (p >= LARGE_ARRAY_SIZE) {
    var D = i ? null : createSet$1(r);
    if (D)
      return setToArray(D);
    m = !1, h = cacheHas, O = new SetCache();
  } else
    O = i ? [] : C;
  e:
    for (; ++d < p; ) {
      var R = r[d], M = i ? i(R) : R;
      if (R = u || R !== 0 ? R : 0, m && M === M) {
        for (var N = O.length; N--; )
          if (O[N] === M)
            continue e;
        i && O.push(M), C.push(R);
      } else
        h(O, M, u) || (O !== C && O.push(M), C.push(R));
    }
  return C;
}
function uniqWith(r, i) {
  return i = typeof i == "function" ? i : void 0, r && r.length ? baseUniq(r, void 0, i) : [];
}
var jsonfn = {};
(function(exports) {
  (function(exports) {
    exports.stringify = function(r) {
      return JSON.stringify(r, function(i, u) {
        var d;
        return u instanceof Function || typeof u == "function" ? (d = u.toString(), d.length < 8 || d.substring(0, 8) !== "function" ? "_NuFrRa_" + d : d) : u instanceof RegExp ? "_PxEgEr_" + u : u;
      });
    }, exports.parse = function(str, date2obj) {
      var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : !1;
      return JSON.parse(str, function(key, value) {
        var prefix;
        return typeof value != "string" || value.length < 8 ? value : (prefix = value.substring(0, 8), iso8061 && value.match(iso8061) ? new Date(value) : prefix === "function" ? eval("(" + value + ")") : prefix === "_PxEgEr_" || prefix === "_NuFrRa_" ? eval(value.slice(8)) : value);
      });
    }, exports.clone = function(r, i) {
      return exports.parse(exports.stringify(r), i);
    };
  })(exports);
})(jsonfn);
var axios$2 = { exports: {} }, axios$1 = { exports: {} }, bind$2 = function r(i, u) {
  return function() {
    for (var h = new Array(arguments.length), p = 0; p < h.length; p++)
      h[p] = arguments[p];
    return i.apply(u, h);
  };
}, bind$1 = bind$2, toString = Object.prototype.toString, kindOf = function(r) {
  return function(i) {
    var u = toString.call(i);
    return r[u] || (r[u] = u.slice(8, -1).toLowerCase());
  };
}(/* @__PURE__ */ Object.create(null));
function kindOfTest(r) {
  return r = r.toLowerCase(), function(u) {
    return kindOf(u) === r;
  };
}
function isArray(r) {
  return Array.isArray(r);
}
function isUndefined(r) {
  return typeof r > "u";
}
function isBuffer(r) {
  return r !== null && !isUndefined(r) && r.constructor !== null && !isUndefined(r.constructor) && typeof r.constructor.isBuffer == "function" && r.constructor.isBuffer(r);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(r) {
  var i;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? i = ArrayBuffer.isView(r) : i = r && r.buffer && isArrayBuffer(r.buffer), i;
}
function isString(r) {
  return typeof r == "string";
}
function isNumber(r) {
  return typeof r == "number";
}
function isObject(r) {
  return r !== null && typeof r == "object";
}
function isPlainObject(r) {
  if (kindOf(r) !== "object")
    return !1;
  var i = Object.getPrototypeOf(r);
  return i === null || i === Object.prototype;
}
var isDate = kindOfTest("Date"), isFile = kindOfTest("File"), isBlob = kindOfTest("Blob"), isFileList = kindOfTest("FileList");
function isFunction(r) {
  return toString.call(r) === "[object Function]";
}
function isStream(r) {
  return isObject(r) && isFunction(r.pipe);
}
function isFormData(r) {
  var i = "[object FormData]";
  return r && (typeof FormData == "function" && r instanceof FormData || toString.call(r) === i || isFunction(r.toString) && r.toString() === i);
}
var isURLSearchParams = kindOfTest("URLSearchParams");
function trim(r) {
  return r.trim ? r.trim() : r.replace(/^\s+|\s+$/g, "");
}
function isStandardBrowserEnv() {
  return typeof navigator < "u" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS") ? !1 : typeof window < "u" && typeof document < "u";
}
function forEach(r, i) {
  if (!(r === null || typeof r > "u"))
    if (typeof r != "object" && (r = [r]), isArray(r))
      for (var u = 0, d = r.length; u < d; u++)
        i.call(null, r[u], u, r);
    else
      for (var h in r)
        Object.prototype.hasOwnProperty.call(r, h) && i.call(null, r[h], h, r);
}
function merge() {
  var r = {};
  function i(h, p) {
    isPlainObject(r[p]) && isPlainObject(h) ? r[p] = merge(r[p], h) : isPlainObject(h) ? r[p] = merge({}, h) : isArray(h) ? r[p] = h.slice() : r[p] = h;
  }
  for (var u = 0, d = arguments.length; u < d; u++)
    forEach(arguments[u], i);
  return r;
}
function extend(r, i, u) {
  return forEach(i, function(h, p) {
    u && typeof h == "function" ? r[p] = bind$1(h, u) : r[p] = h;
  }), r;
}
function stripBOM(r) {
  return r.charCodeAt(0) === 65279 && (r = r.slice(1)), r;
}
function inherits(r, i, u, d) {
  r.prototype = Object.create(i.prototype, d), r.prototype.constructor = r, u && Object.assign(r.prototype, u);
}
function toFlatObject(r, i, u) {
  var d, h, p, m = {};
  i = i || {};
  do {
    for (d = Object.getOwnPropertyNames(r), h = d.length; h-- > 0; )
      p = d[h], m[p] || (i[p] = r[p], m[p] = !0);
    r = Object.getPrototypeOf(r);
  } while (r && (!u || u(r, i)) && r !== Object.prototype);
  return i;
}
function endsWith(r, i, u) {
  r = String(r), (u === void 0 || u > r.length) && (u = r.length), u -= i.length;
  var d = r.indexOf(i, u);
  return d !== -1 && d === u;
}
function toArray(r) {
  if (!r)
    return null;
  var i = r.length;
  if (isUndefined(i))
    return null;
  for (var u = new Array(i); i-- > 0; )
    u[i] = r[i];
  return u;
}
var isTypedArray = function(r) {
  return function(i) {
    return r && i instanceof r;
  };
}(typeof Uint8Array < "u" && Object.getPrototypeOf(Uint8Array)), utils$b = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isFunction,
  isStream,
  isURLSearchParams,
  isStandardBrowserEnv,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  isTypedArray,
  isFileList
}, utils$a = utils$b;
function encode(r) {
  return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var buildURL$1 = function r(i, u, d) {
  if (!u)
    return i;
  var h;
  if (d)
    h = d(u);
  else if (utils$a.isURLSearchParams(u))
    h = u.toString();
  else {
    var p = [];
    utils$a.forEach(u, function(O, D) {
      O === null || typeof O > "u" || (utils$a.isArray(O) ? D = D + "[]" : O = [O], utils$a.forEach(O, function(M) {
        utils$a.isDate(M) ? M = M.toISOString() : utils$a.isObject(M) && (M = JSON.stringify(M)), p.push(encode(D) + "=" + encode(M));
      }));
    }), h = p.join("&");
  }
  if (h) {
    var m = i.indexOf("#");
    m !== -1 && (i = i.slice(0, m)), i += (i.indexOf("?") === -1 ? "?" : "&") + h;
  }
  return i;
}, utils$9 = utils$b;
function InterceptorManager$1() {
  this.handlers = [];
}
InterceptorManager$1.prototype.use = function r(i, u, d) {
  return this.handlers.push({
    fulfilled: i,
    rejected: u,
    synchronous: d ? d.synchronous : !1,
    runWhen: d ? d.runWhen : null
  }), this.handlers.length - 1;
};
InterceptorManager$1.prototype.eject = function r(i) {
  this.handlers[i] && (this.handlers[i] = null);
};
InterceptorManager$1.prototype.forEach = function r(i) {
  utils$9.forEach(this.handlers, function(d) {
    d !== null && i(d);
  });
};
var InterceptorManager_1 = InterceptorManager$1, utils$8 = utils$b, normalizeHeaderName$1 = function r(i, u) {
  utils$8.forEach(i, function(h, p) {
    p !== u && p.toUpperCase() === u.toUpperCase() && (i[u] = h, delete i[p]);
  });
}, utils$7 = utils$b;
function AxiosError$2(r, i, u, d, h) {
  Error.call(this), this.message = r, this.name = "AxiosError", i && (this.code = i), u && (this.config = u), d && (this.request = d), h && (this.response = h);
}
utils$7.inherits(AxiosError$2, Error, {
  toJSON: function r() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
var prototype = AxiosError$2.prototype, descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED"
].forEach(function(r) {
  descriptors[r] = { value: r };
});
Object.defineProperties(AxiosError$2, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: !0 });
AxiosError$2.from = function(r, i, u, d, h, p) {
  var m = Object.create(prototype);
  return utils$7.toFlatObject(r, m, function(O) {
    return O !== Error.prototype;
  }), AxiosError$2.call(m, r.message, i, u, d, h), m.name = r.name, p && Object.assign(m, p), m;
};
var AxiosError_1 = AxiosError$2, transitional = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, utils$6 = utils$b;
function toFormData$1(r, i) {
  i = i || new FormData();
  var u = [];
  function d(p) {
    return p === null ? "" : utils$6.isDate(p) ? p.toISOString() : utils$6.isArrayBuffer(p) || utils$6.isTypedArray(p) ? typeof Blob == "function" ? new Blob([p]) : Buffer.from(p) : p;
  }
  function h(p, m) {
    if (utils$6.isPlainObject(p) || utils$6.isArray(p)) {
      if (u.indexOf(p) !== -1)
        throw Error("Circular reference detected in " + m);
      u.push(p), utils$6.forEach(p, function(O, D) {
        if (!utils$6.isUndefined(O)) {
          var R = m ? m + "." + D : D, M;
          if (O && !m && typeof O == "object") {
            if (utils$6.endsWith(D, "{}"))
              O = JSON.stringify(O);
            else if (utils$6.endsWith(D, "[]") && (M = utils$6.toArray(O))) {
              M.forEach(function(N) {
                !utils$6.isUndefined(N) && i.append(R, d(N));
              });
              return;
            }
          }
          h(O, R);
        }
      }), u.pop();
    } else
      i.append(m, d(p));
  }
  return h(r), i;
}
var toFormData_1 = toFormData$1, settle, hasRequiredSettle;
function requireSettle() {
  if (hasRequiredSettle)
    return settle;
  hasRequiredSettle = 1;
  var r = AxiosError_1;
  return settle = function(u, d, h) {
    var p = h.config.validateStatus;
    !h.status || !p || p(h.status) ? u(h) : d(new r(
      "Request failed with status code " + h.status,
      [r.ERR_BAD_REQUEST, r.ERR_BAD_RESPONSE][Math.floor(h.status / 100) - 4],
      h.config,
      h.request,
      h
    ));
  }, settle;
}
var cookies, hasRequiredCookies;
function requireCookies() {
  if (hasRequiredCookies)
    return cookies;
  hasRequiredCookies = 1;
  var r = utils$b;
  return cookies = r.isStandardBrowserEnv() ? function() {
    return {
      write: function(d, h, p, m, C, O) {
        var D = [];
        D.push(d + "=" + encodeURIComponent(h)), r.isNumber(p) && D.push("expires=" + new Date(p).toGMTString()), r.isString(m) && D.push("path=" + m), r.isString(C) && D.push("domain=" + C), O === !0 && D.push("secure"), document.cookie = D.join("; ");
      },
      read: function(d) {
        var h = document.cookie.match(new RegExp("(^|;\\s*)(" + d + ")=([^;]*)"));
        return h ? decodeURIComponent(h[3]) : null;
      },
      remove: function(d) {
        this.write(d, "", Date.now() - 864e5);
      }
    };
  }() : function() {
    return {
      write: function() {
      },
      read: function() {
        return null;
      },
      remove: function() {
      }
    };
  }(), cookies;
}
var isAbsoluteURL$1 = function r(i) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(i);
}, combineURLs$1 = function r(i, u) {
  return u ? i.replace(/\/+$/, "") + "/" + u.replace(/^\/+/, "") : i;
}, isAbsoluteURL = isAbsoluteURL$1, combineURLs = combineURLs$1, buildFullPath$1 = function r(i, u) {
  return i && !isAbsoluteURL(u) ? combineURLs(i, u) : u;
}, parseHeaders, hasRequiredParseHeaders;
function requireParseHeaders() {
  if (hasRequiredParseHeaders)
    return parseHeaders;
  hasRequiredParseHeaders = 1;
  var r = utils$b, i = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  return parseHeaders = function(d) {
    var h = {}, p, m, C;
    return d && r.forEach(d.split(`
`), function(D) {
      if (C = D.indexOf(":"), p = r.trim(D.substr(0, C)).toLowerCase(), m = r.trim(D.substr(C + 1)), p) {
        if (h[p] && i.indexOf(p) >= 0)
          return;
        p === "set-cookie" ? h[p] = (h[p] ? h[p] : []).concat([m]) : h[p] = h[p] ? h[p] + ", " + m : m;
      }
    }), h;
  }, parseHeaders;
}
var isURLSameOrigin, hasRequiredIsURLSameOrigin;
function requireIsURLSameOrigin() {
  if (hasRequiredIsURLSameOrigin)
    return isURLSameOrigin;
  hasRequiredIsURLSameOrigin = 1;
  var r = utils$b;
  return isURLSameOrigin = r.isStandardBrowserEnv() ? function() {
    var u = /(msie|trident)/i.test(navigator.userAgent), d = document.createElement("a"), h;
    function p(m) {
      var C = m;
      return u && (d.setAttribute("href", C), C = d.href), d.setAttribute("href", C), {
        href: d.href,
        protocol: d.protocol ? d.protocol.replace(/:$/, "") : "",
        host: d.host,
        search: d.search ? d.search.replace(/^\?/, "") : "",
        hash: d.hash ? d.hash.replace(/^#/, "") : "",
        hostname: d.hostname,
        port: d.port,
        pathname: d.pathname.charAt(0) === "/" ? d.pathname : "/" + d.pathname
      };
    }
    return h = p(window.location.href), function(C) {
      var O = r.isString(C) ? p(C) : C;
      return O.protocol === h.protocol && O.host === h.host;
    };
  }() : function() {
    return function() {
      return !0;
    };
  }(), isURLSameOrigin;
}
var CanceledError_1, hasRequiredCanceledError;
function requireCanceledError() {
  if (hasRequiredCanceledError)
    return CanceledError_1;
  hasRequiredCanceledError = 1;
  var r = AxiosError_1, i = utils$b;
  function u(d) {
    r.call(this, d ?? "canceled", r.ERR_CANCELED), this.name = "CanceledError";
  }
  return i.inherits(u, r, {
    __CANCEL__: !0
  }), CanceledError_1 = u, CanceledError_1;
}
var parseProtocol, hasRequiredParseProtocol;
function requireParseProtocol() {
  return hasRequiredParseProtocol || (hasRequiredParseProtocol = 1, parseProtocol = function(i) {
    var u = /^([-+\w]{1,25})(:?\/\/|:)/.exec(i);
    return u && u[1] || "";
  }), parseProtocol;
}
var xhr, hasRequiredXhr;
function requireXhr() {
  if (hasRequiredXhr)
    return xhr;
  hasRequiredXhr = 1;
  var r = utils$b, i = requireSettle(), u = requireCookies(), d = buildURL$1, h = buildFullPath$1, p = requireParseHeaders(), m = requireIsURLSameOrigin(), C = transitional, O = AxiosError_1, D = requireCanceledError(), R = requireParseProtocol();
  return xhr = function(N) {
    return new Promise(function(B, q) {
      var ee = N.data, F = N.headers, ue = N.responseType, Ae;
      function pe() {
        N.cancelToken && N.cancelToken.unsubscribe(Ae), N.signal && N.signal.removeEventListener("abort", Ae);
      }
      r.isFormData(ee) && r.isStandardBrowserEnv() && delete F["Content-Type"];
      var X = new XMLHttpRequest();
      if (N.auth) {
        var o = N.auth.username || "", nt = N.auth.password ? unescape(encodeURIComponent(N.auth.password)) : "";
        F.Authorization = "Basic " + btoa(o + ":" + nt);
      }
      var Se = h(N.baseURL, N.url);
      X.open(N.method.toUpperCase(), d(Se, N.params, N.paramsSerializer), !0), X.timeout = N.timeout;
      function De() {
        if (X) {
          var ae = "getAllResponseHeaders" in X ? p(X.getAllResponseHeaders()) : null, Re = !ue || ue === "text" || ue === "json" ? X.responseText : X.response, we = {
            data: Re,
            status: X.status,
            statusText: X.statusText,
            headers: ae,
            config: N,
            request: X
          };
          i(function(at) {
            B(at), pe();
          }, function(at) {
            q(at), pe();
          }, we), X = null;
        }
      }
      if ("onloadend" in X ? X.onloadend = De : X.onreadystatechange = function() {
        !X || X.readyState !== 4 || X.status === 0 && !(X.responseURL && X.responseURL.indexOf("file:") === 0) || setTimeout(De);
      }, X.onabort = function() {
        X && (q(new O("Request aborted", O.ECONNABORTED, N, X)), X = null);
      }, X.onerror = function() {
        q(new O("Network Error", O.ERR_NETWORK, N, X, X)), X = null;
      }, X.ontimeout = function() {
        var Re = N.timeout ? "timeout of " + N.timeout + "ms exceeded" : "timeout exceeded", we = N.transitional || C;
        N.timeoutErrorMessage && (Re = N.timeoutErrorMessage), q(new O(
          Re,
          we.clarifyTimeoutError ? O.ETIMEDOUT : O.ECONNABORTED,
          N,
          X
        )), X = null;
      }, r.isStandardBrowserEnv()) {
        var it = (N.withCredentials || m(Se)) && N.xsrfCookieName ? u.read(N.xsrfCookieName) : void 0;
        it && (F[N.xsrfHeaderName] = it);
      }
      "setRequestHeader" in X && r.forEach(F, function(Re, we) {
        typeof ee > "u" && we.toLowerCase() === "content-type" ? delete F[we] : X.setRequestHeader(we, Re);
      }), r.isUndefined(N.withCredentials) || (X.withCredentials = !!N.withCredentials), ue && ue !== "json" && (X.responseType = N.responseType), typeof N.onDownloadProgress == "function" && X.addEventListener("progress", N.onDownloadProgress), typeof N.onUploadProgress == "function" && X.upload && X.upload.addEventListener("progress", N.onUploadProgress), (N.cancelToken || N.signal) && (Ae = function(ae) {
        X && (q(!ae || ae && ae.type ? new D() : ae), X.abort(), X = null);
      }, N.cancelToken && N.cancelToken.subscribe(Ae), N.signal && (N.signal.aborted ? Ae() : N.signal.addEventListener("abort", Ae))), ee || (ee = null);
      var Ke = R(Se);
      if (Ke && ["http", "https", "file"].indexOf(Ke) === -1) {
        q(new O("Unsupported protocol " + Ke + ":", O.ERR_BAD_REQUEST, N));
        return;
      }
      X.send(ee);
    });
  }, xhr;
}
var _null, hasRequired_null;
function require_null() {
  return hasRequired_null || (hasRequired_null = 1, _null = null), _null;
}
var utils$5 = utils$b, normalizeHeaderName = normalizeHeaderName$1, AxiosError$1 = AxiosError_1, transitionalDefaults = transitional, toFormData = toFormData_1, DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function setContentTypeIfUnset(r, i) {
  !utils$5.isUndefined(r) && utils$5.isUndefined(r["Content-Type"]) && (r["Content-Type"] = i);
}
function getDefaultAdapter() {
  var r;
  return (typeof XMLHttpRequest < "u" || typeof process < "u" && Object.prototype.toString.call(process) === "[object process]") && (r = requireXhr()), r;
}
function stringifySafely(r, i, u) {
  if (utils$5.isString(r))
    try {
      return (i || JSON.parse)(r), utils$5.trim(r);
    } catch (d) {
      if (d.name !== "SyntaxError")
        throw d;
    }
  return (u || JSON.stringify)(r);
}
var defaults$3 = {
  transitional: transitionalDefaults,
  adapter: getDefaultAdapter(),
  transformRequest: [function r(i, u) {
    if (normalizeHeaderName(u, "Accept"), normalizeHeaderName(u, "Content-Type"), utils$5.isFormData(i) || utils$5.isArrayBuffer(i) || utils$5.isBuffer(i) || utils$5.isStream(i) || utils$5.isFile(i) || utils$5.isBlob(i))
      return i;
    if (utils$5.isArrayBufferView(i))
      return i.buffer;
    if (utils$5.isURLSearchParams(i))
      return setContentTypeIfUnset(u, "application/x-www-form-urlencoded;charset=utf-8"), i.toString();
    var d = utils$5.isObject(i), h = u && u["Content-Type"], p;
    if ((p = utils$5.isFileList(i)) || d && h === "multipart/form-data") {
      var m = this.env && this.env.FormData;
      return toFormData(p ? { "files[]": i } : i, m && new m());
    } else if (d || h === "application/json")
      return setContentTypeIfUnset(u, "application/json"), stringifySafely(i);
    return i;
  }],
  transformResponse: [function r(i) {
    var u = this.transitional || defaults$3.transitional, d = u && u.silentJSONParsing, h = u && u.forcedJSONParsing, p = !d && this.responseType === "json";
    if (p || h && utils$5.isString(i) && i.length)
      try {
        return JSON.parse(i);
      } catch (m) {
        if (p)
          throw m.name === "SyntaxError" ? AxiosError$1.from(m, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response) : m;
      }
    return i;
  }],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: require_null()
  },
  validateStatus: function r(i) {
    return i >= 200 && i < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*"
    }
  }
};
utils$5.forEach(["delete", "get", "head"], function r(i) {
  defaults$3.headers[i] = {};
});
utils$5.forEach(["post", "put", "patch"], function r(i) {
  defaults$3.headers[i] = utils$5.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_1 = defaults$3, utils$4 = utils$b, defaults$2 = defaults_1, transformData$1 = function r(i, u, d) {
  var h = this || defaults$2;
  return utils$4.forEach(d, function(m) {
    i = m.call(h, i, u);
  }), i;
}, isCancel$1, hasRequiredIsCancel;
function requireIsCancel() {
  return hasRequiredIsCancel || (hasRequiredIsCancel = 1, isCancel$1 = function(i) {
    return !!(i && i.__CANCEL__);
  }), isCancel$1;
}
var utils$3 = utils$b, transformData = transformData$1, isCancel = requireIsCancel(), defaults$1 = defaults_1, CanceledError = requireCanceledError();
function throwIfCancellationRequested(r) {
  if (r.cancelToken && r.cancelToken.throwIfRequested(), r.signal && r.signal.aborted)
    throw new CanceledError();
}
var dispatchRequest$1 = function r(i) {
  throwIfCancellationRequested(i), i.headers = i.headers || {}, i.data = transformData.call(
    i,
    i.data,
    i.headers,
    i.transformRequest
  ), i.headers = utils$3.merge(
    i.headers.common || {},
    i.headers[i.method] || {},
    i.headers
  ), utils$3.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function(h) {
      delete i.headers[h];
    }
  );
  var u = i.adapter || defaults$1.adapter;
  return u(i).then(function(h) {
    return throwIfCancellationRequested(i), h.data = transformData.call(
      i,
      h.data,
      h.headers,
      i.transformResponse
    ), h;
  }, function(h) {
    return isCancel(h) || (throwIfCancellationRequested(i), h && h.response && (h.response.data = transformData.call(
      i,
      h.response.data,
      h.response.headers,
      i.transformResponse
    ))), Promise.reject(h);
  });
}, utils$2 = utils$b, mergeConfig$2 = function r(i, u) {
  u = u || {};
  var d = {};
  function h(R, M) {
    return utils$2.isPlainObject(R) && utils$2.isPlainObject(M) ? utils$2.merge(R, M) : utils$2.isPlainObject(M) ? utils$2.merge({}, M) : utils$2.isArray(M) ? M.slice() : M;
  }
  function p(R) {
    if (utils$2.isUndefined(u[R])) {
      if (!utils$2.isUndefined(i[R]))
        return h(void 0, i[R]);
    } else
      return h(i[R], u[R]);
  }
  function m(R) {
    if (!utils$2.isUndefined(u[R]))
      return h(void 0, u[R]);
  }
  function C(R) {
    if (utils$2.isUndefined(u[R])) {
      if (!utils$2.isUndefined(i[R]))
        return h(void 0, i[R]);
    } else
      return h(void 0, u[R]);
  }
  function O(R) {
    if (R in u)
      return h(i[R], u[R]);
    if (R in i)
      return h(void 0, i[R]);
  }
  var D = {
    url: m,
    method: m,
    data: m,
    baseURL: C,
    transformRequest: C,
    transformResponse: C,
    paramsSerializer: C,
    timeout: C,
    timeoutMessage: C,
    withCredentials: C,
    adapter: C,
    responseType: C,
    xsrfCookieName: C,
    xsrfHeaderName: C,
    onUploadProgress: C,
    onDownloadProgress: C,
    decompress: C,
    maxContentLength: C,
    maxBodyLength: C,
    beforeRedirect: C,
    transport: C,
    httpAgent: C,
    httpsAgent: C,
    cancelToken: C,
    socketPath: C,
    responseEncoding: C,
    validateStatus: O
  };
  return utils$2.forEach(Object.keys(i).concat(Object.keys(u)), function(M) {
    var N = D[M] || p, Q = N(M);
    utils$2.isUndefined(Q) && N !== O || (d[M] = Q);
  }), d;
}, data, hasRequiredData;
function requireData() {
  return hasRequiredData || (hasRequiredData = 1, data = {
    version: "0.27.2"
  }), data;
}
var VERSION = requireData().version, AxiosError = AxiosError_1, validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function(r, i) {
  validators$1[r] = function(d) {
    return typeof d === r || "a" + (i < 1 ? "n " : " ") + r;
  };
});
var deprecatedWarnings = {};
validators$1.transitional = function r(i, u, d) {
  function h(p, m) {
    return "[Axios v" + VERSION + "] Transitional option '" + p + "'" + m + (d ? ". " + d : "");
  }
  return function(p, m, C) {
    if (i === !1)
      throw new AxiosError(
        h(m, " has been removed" + (u ? " in " + u : "")),
        AxiosError.ERR_DEPRECATED
      );
    return u && !deprecatedWarnings[m] && (deprecatedWarnings[m] = !0, console.warn(
      h(
        m,
        " has been deprecated since v" + u + " and will be removed in the near future"
      )
    )), i ? i(p, m, C) : !0;
  };
};
function assertOptions(r, i, u) {
  if (typeof r != "object")
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  for (var d = Object.keys(r), h = d.length; h-- > 0; ) {
    var p = d[h], m = i[p];
    if (m) {
      var C = r[p], O = C === void 0 || m(C, p, r);
      if (O !== !0)
        throw new AxiosError("option " + p + " must be " + O, AxiosError.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (u !== !0)
      throw new AxiosError("Unknown option " + p, AxiosError.ERR_BAD_OPTION);
  }
}
var validator$1 = {
  assertOptions,
  validators: validators$1
}, utils$1 = utils$b, buildURL = buildURL$1, InterceptorManager = InterceptorManager_1, dispatchRequest = dispatchRequest$1, mergeConfig$1 = mergeConfig$2, buildFullPath = buildFullPath$1, validator = validator$1, validators = validator.validators;
function Axios$1(r) {
  this.defaults = r, this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios$1.prototype.request = function r(i, u) {
  typeof i == "string" ? (u = u || {}, u.url = i) : u = i || {}, u = mergeConfig$1(this.defaults, u), u.method ? u.method = u.method.toLowerCase() : this.defaults.method ? u.method = this.defaults.method.toLowerCase() : u.method = "get";
  var d = u.transitional;
  d !== void 0 && validator.assertOptions(d, {
    silentJSONParsing: validators.transitional(validators.boolean),
    forcedJSONParsing: validators.transitional(validators.boolean),
    clarifyTimeoutError: validators.transitional(validators.boolean)
  }, !1);
  var h = [], p = !0;
  this.interceptors.request.forEach(function(Q) {
    typeof Q.runWhen == "function" && Q.runWhen(u) === !1 || (p = p && Q.synchronous, h.unshift(Q.fulfilled, Q.rejected));
  });
  var m = [];
  this.interceptors.response.forEach(function(Q) {
    m.push(Q.fulfilled, Q.rejected);
  });
  var C;
  if (!p) {
    var O = [dispatchRequest, void 0];
    for (Array.prototype.unshift.apply(O, h), O = O.concat(m), C = Promise.resolve(u); O.length; )
      C = C.then(O.shift(), O.shift());
    return C;
  }
  for (var D = u; h.length; ) {
    var R = h.shift(), M = h.shift();
    try {
      D = R(D);
    } catch (N) {
      M(N);
      break;
    }
  }
  try {
    C = dispatchRequest(D);
  } catch (N) {
    return Promise.reject(N);
  }
  for (; m.length; )
    C = C.then(m.shift(), m.shift());
  return C;
};
Axios$1.prototype.getUri = function r(i) {
  i = mergeConfig$1(this.defaults, i);
  var u = buildFullPath(i.baseURL, i.url);
  return buildURL(u, i.params, i.paramsSerializer);
};
utils$1.forEach(["delete", "get", "head", "options"], function r(i) {
  Axios$1.prototype[i] = function(u, d) {
    return this.request(mergeConfig$1(d || {}, {
      method: i,
      url: u,
      data: (d || {}).data
    }));
  };
});
utils$1.forEach(["post", "put", "patch"], function r(i) {
  function u(d) {
    return function(p, m, C) {
      return this.request(mergeConfig$1(C || {}, {
        method: i,
        headers: d ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: p,
        data: m
      }));
    };
  }
  Axios$1.prototype[i] = u(), Axios$1.prototype[i + "Form"] = u(!0);
});
var Axios_1 = Axios$1, CancelToken_1, hasRequiredCancelToken;
function requireCancelToken() {
  if (hasRequiredCancelToken)
    return CancelToken_1;
  hasRequiredCancelToken = 1;
  var r = requireCanceledError();
  function i(u) {
    if (typeof u != "function")
      throw new TypeError("executor must be a function.");
    var d;
    this.promise = new Promise(function(m) {
      d = m;
    });
    var h = this;
    this.promise.then(function(p) {
      if (h._listeners) {
        var m, C = h._listeners.length;
        for (m = 0; m < C; m++)
          h._listeners[m](p);
        h._listeners = null;
      }
    }), this.promise.then = function(p) {
      var m, C = new Promise(function(O) {
        h.subscribe(O), m = O;
      }).then(p);
      return C.cancel = function() {
        h.unsubscribe(m);
      }, C;
    }, u(function(m) {
      h.reason || (h.reason = new r(m), d(h.reason));
    });
  }
  return i.prototype.throwIfRequested = function() {
    if (this.reason)
      throw this.reason;
  }, i.prototype.subscribe = function(d) {
    if (this.reason) {
      d(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(d) : this._listeners = [d];
  }, i.prototype.unsubscribe = function(d) {
    if (this._listeners) {
      var h = this._listeners.indexOf(d);
      h !== -1 && this._listeners.splice(h, 1);
    }
  }, i.source = function() {
    var d, h = new i(function(m) {
      d = m;
    });
    return {
      token: h,
      cancel: d
    };
  }, CancelToken_1 = i, CancelToken_1;
}
var spread, hasRequiredSpread;
function requireSpread() {
  return hasRequiredSpread || (hasRequiredSpread = 1, spread = function(i) {
    return function(d) {
      return i.apply(null, d);
    };
  }), spread;
}
var isAxiosError, hasRequiredIsAxiosError;
function requireIsAxiosError() {
  if (hasRequiredIsAxiosError)
    return isAxiosError;
  hasRequiredIsAxiosError = 1;
  var r = utils$b;
  return isAxiosError = function(u) {
    return r.isObject(u) && u.isAxiosError === !0;
  }, isAxiosError;
}
var utils = utils$b, bind = bind$2, Axios = Axios_1, mergeConfig = mergeConfig$2, defaults = defaults_1;
function createInstance(r) {
  var i = new Axios(r), u = bind(Axios.prototype.request, i);
  return utils.extend(u, Axios.prototype, i), utils.extend(u, i), u.create = function(h) {
    return createInstance(mergeConfig(r, h));
  }, u;
}
var axios = createInstance(defaults);
axios.Axios = Axios;
axios.CanceledError = requireCanceledError();
axios.CancelToken = requireCancelToken();
axios.isCancel = requireIsCancel();
axios.VERSION = requireData().version;
axios.toFormData = toFormData_1;
axios.AxiosError = AxiosError_1;
axios.Cancel = axios.CanceledError;
axios.all = function r(i) {
  return Promise.all(i);
};
axios.spread = requireSpread();
axios.isAxiosError = requireIsAxiosError();
axios$1.exports = axios;
axios$1.exports.default = axios;
(function(r) {
  r.exports = axios$1.exports;
})(axios$2);
function deepWatchModelProxy(r, i, u, d) {
  return new Proxy(r, {
    get(h, p, m) {
      const C = Reflect.get(h, p, m);
      return isObject$1(C) && !isFunction$1(C) ? deepWatchModelProxy(C, i ?? p, u ?? r, d) : C;
    },
    set: function(h, p, m, C) {
      const O = i ?? p, D = u ?? r, R = cloneDeep(D[O]), M = Reflect.set(h, p, m, C);
      ((D.onWatchSetting || {})[O] ?? []).forEach((B) => {
        B && B(D[O], R, D);
      });
      try {
        d == null || d.callback(C, O);
      } catch {
      }
      return M;
    },
    deleteProperty(h, p) {
      return Reflect.deleteProperty(h, p);
    }
  });
}
const mergeModel = (r, i) => !r || !i ? {} : Object.defineProperties(r, Object.getOwnPropertyDescriptors(i));
function deepAssign(...r) {
  const i = Object.assign({}, ...r);
  for (const u of r)
    for (const [d, h] of Object.entries(u))
      typeof h == "object" && (i[d] = deepAssign(i[d], h));
  return i;
}
function createOptionsView(r) {
  const i = {
    description: "组件model",
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "组件id",
        disabled: !0
      },
      contextType: {
        type: "boolean",
        description: "运行时状态"
      }
    }
  };
  return deepAssign(cloneDeep(r.iovSchema.optionsView.model) || {}, cloneDeep(i));
}
function stringifyDeep(r) {
  return jsonfn.stringify(r);
}
const EVENTBUS_NAME = "eventBus";
class EventBus {
  constructor() {
    this.eventBusInit = () => {
      eventBus.registerEventHandlers(EVENTBUS_NAME, (i) => {
        const { detail: u } = i, {
          header: { src: d }
        } = u;
        [...document.querySelectorAll("q-router-config")].map(
          (p) => p.value
        ).forEach((p) => {
          const m = p[d];
          m && (console.log("事件总线接收消息:", {
            staticRoute: m,
            data: (i == null ? void 0 : i.detail) ?? {}
          }), this.messageDispatch({ staticRoute: m, data: (i == null ? void 0 : i.detail) ?? {} }));
        });
      });
    }, this.messageDispatch = ({ staticRoute: i = {}, data: u = {} } = {}) => {
      const {
        header: { src: d, srcType: h, reply: p },
        body: m
      } = u, { src: C, trigger: O = [], receive: D = [] } = i;
      if (C === d && O.includes(h)) {
        D.forEach((R) => {
          var B;
          const { target: M, event: N = [] } = R;
          let { script: Q = "return data" } = R;
          Q.length || (Q = "function (body, data){return data}");
          try {
            const q = new Function(`return ${Q}`)(), ee = q(m, u) || null, F = {
              header: {
                src: d,
                srcType: h,
                dst: M,
                dstType: N[0],
                fn: q,
                reply: p
              },
              body: ee
            };
            console.log("事件总线分发消息:", F);
            const ue = document.querySelector(`#${M}`);
            if (ue && (ue != null && ue.componentModel)) {
              (B = ue.componentModel) == null || B.onMessage(F);
              return;
            }
          } catch (q) {
            console.log(q);
          }
        });
        return;
      }
    };
  }
  registerEventHandlers(i, u) {
    window.addEventListener(i, (d) => {
      u && u(d);
    });
  }
  sendMessage(i, u = { isFirstMessage: !0 }) {
    return new Promise((d, h) => {
      const { header: p } = i;
      Object.assign(p, { reply: { resolve: d, reject: h }, options: u });
      const m = new CustomEvent(EVENTBUS_NAME, { detail: i });
      window.dispatchEvent(m);
    });
  }
}
const eventBus = new EventBus();
class ComponentModel {
  constructor(i) {
    var h, p;
    this.model = {}, this.update = new Proxy({ callback: () => {
    } }, {});
    const { el: u, model: d } = i;
    this.el = u, this.initBaseModel(d), this.domAssemblyCustomEvents(u, d.onDOMEvent || d._onDOMEvent), this.connectedCallback(), (p = (h = this.model) == null ? void 0 : h.lifeCycle) != null && p.created && this.model.lifeCycle.created(this.el, this.model);
  }
  onMessage(i) {
    const { header: u } = i, { dstType: d } = u, h = `on${d}`, m = this[h], C = this.model.onMessageMeta[d];
    if (m && m.length) {
      this.el.dispatchEvent(i.body);
      return;
    }
    C && C.forEach((O) => {
      const D = O;
      D && new Function("imessage", `return (${D.toString()}).call(this.el,imessage)`).call(this, i);
    });
  }
  sendMessage(i) {
    const {
      header: { srcType: u }
    } = i, d = `on${u}`;
    return this.model.onDOMEvent[d] && this.model.onDOMEvent[d].forEach((h) => {
      const p = h;
      p && new Function("imessage", `return (${p.toString()}).call(this.el,imessage)`).call(this, i);
    }), eventBus.sendMessage(i);
  }
  getModelEntity() {
    return stringifyDeep(this.model);
  }
  updateModelEntity(i) {
    var m, C, O;
    const u = JSON.parse(this.getModelEntity()), d = JSON.parse(i), h = [];
    Object.keys(d).forEach((D) => {
      isEqual(d[D], u[D]) || h.push(D);
    }), h.forEach((D) => {
      const R = D.substring(1, 1 / 0);
      D.includes("_") && h.includes(D.substring(1, 1 / 0)) && (d[R] = d[D]);
    });
    const p = jsonfn.parse(JSON.stringify(d));
    console.log(p), h.forEach((D) => {
      try {
        const R = p[D];
        this.model[D] = R, D === "onDOMEvent" && this.domAssemblyCustomEvents(this.el, this.model.onDOMEvent || this.model._onDOMEvent);
      } catch (R) {
        console.log(R);
      }
    }), (m = this.model) != null && m.lifeCycle && ((O = (C = this.model) == null ? void 0 : C.lifeCycle) != null && O.updated) && this.model.lifeCycle.updated(this.el, this.model);
  }
  getAttributeList() {
    return Object.keys(this.model).map((i) => Object.getOwnPropertyDescriptor(this.model, i)).filter(({ set: i }) => i);
  }
  connectedCallback() {
    const i = {
      attributes: !0
    }, u = () => {
      var h, p, m;
      (h = this.model) != null && h.lifeCycle && ((m = (p = this.model) == null ? void 0 : p.lifeCycle) != null && m.updated) && this.model.lifeCycle.updated(this.el, this.model);
    };
    new MutationObserver(u).observe(this.el, i), $(this.el).on("DOMNodeRemoved", () => {
      var h, p;
      this.el.isConnected || ($(this.el).off(), (p = (h = this.model) == null ? void 0 : h.lifeCycle) == null || p.destroy());
    });
  }
  initBaseModel(i = {}) {
    var d, h;
    const u = this;
    try {
      (h = (d = i == null ? void 0 : i.iovSchema) == null ? void 0 : d.optionsView) != null && h.model && (i.iovSchema.optionsView.model = createOptionsView(i));
    } catch (p) {
      console.log(p);
    }
    this.model = deepWatchModelProxy(
      mergeModel(
        {
          get id() {
            return cloneDeep(u.el.id);
          },
          set id(p) {
            u.el.setAttribute("id", p);
          },
          _initStyle: "height:150px;width:150px;",
          get initStyle() {
            return this._initStyle;
          },
          set initStyle(p) {
            const m = document.createElement("div");
            m.style.cssText = p, this._initStyle = m.style.cssText, u.el.style.cssText = this._initStyle;
          },
          _onMessageMeta: {},
          _onDOMEvent: {},
          _onWatchSetting: {},
          _lifeCycle: {},
          _contextType: !1,
          _attrBindRelationship: [],
          _componentAliasName: "",
          get onMessageMeta() {
            return cloneDeep(this._onMessageMeta);
          },
          set onMessageMeta(p) {
            if (!isObject$1(p))
              return;
            const m = merge$2(this._onMessageMeta, p);
            this._onMessageMeta = m;
          },
          get onDOMEvent() {
            return cloneDeep(this._onDOMEvent);
          },
          set onDOMEvent(p) {
            isObject$1(p) && (u.domAssemblyCustomEvents(u.el, p), this._onDOMEvent = p);
          },
          get onWatchSetting() {
            return cloneDeep(this._onWatchSetting);
          },
          set onWatchSetting(p) {
            if (!isObject$1(p))
              return;
            const m = merge$2(this._onWatchSetting, p);
            this._onWatchSetting = m;
          },
          get lifeCycle() {
            return this._lifeCycle;
          },
          set lifeCycle(p) {
            this._lifeCycle = p;
          },
          get contextType() {
            return this._contextType;
          },
          set contextType(p) {
            if (!isBoolean(p))
              throw new Error("contextType必须是boolean类型");
            this._contextType = p;
          },
          get attrBindRelationship() {
            return this._attrBindRelationship;
          },
          set attrBindRelationship(p) {
            if (isObject$1(p)) {
              if (isArray$2(p)) {
                this._attrBindRelationship = uniqWith([...this.attrBindRelationship, ...p], isEqual);
                return;
              }
              this._attrBindRelationship = uniqWith([...this.attrBindRelationship, p], isEqual);
            }
          },
          get componentAliasName() {
            return this._componentAliasName;
          },
          set componentAliasName(p) {
            this._componentAliasName = p;
          }
        },
        i
      ),
      void 0,
      null,
      this.update
    );
  }
  domAssemblyCustomEvents(i, u) {
    !i || !u || ($(i).off(), Object.keys(u).forEach((d) => {
      const h = u[d];
      h && h.length > 0 ? h.map((p) => ($(i).off(d), p)).forEach((p) => {
        $(i).on(d, function(m) {
          const C = Object.defineProperties({}, Object.getOwnPropertyDescriptors(m));
          p && p.call(i, C);
        });
      }) : $(i).off(d);
    }));
  }
}
export {
  ComponentModel
};


