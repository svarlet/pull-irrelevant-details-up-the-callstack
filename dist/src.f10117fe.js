// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/fp-ts/es6/function.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SK = void 0;
exports.absurd = absurd;
exports.constVoid = exports.constUndefined = exports.constTrue = exports.constNull = exports.constFalse = exports.apply = void 0;
exports.constant = constant;
exports.decrement = decrement;
exports.flip = flip;
exports.flow = flow;
exports.hole = exports.getSemiring = exports.getSemigroup = exports.getRing = exports.getMonoid = exports.getEndomorphismMonoid = exports.getBooleanAlgebra = void 0;
exports.identity = identity;
exports.increment = increment;
exports.not = not;
exports.pipe = pipe;
exports.tuple = tuple;
exports.tupled = tupled;
exports.unsafeCoerce = void 0;
exports.untupled = untupled;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var getBooleanAlgebra = function (B) {
  return function () {
    return {
      meet: function (x, y) {
        return function (a) {
          return B.meet(x(a), y(a));
        };
      },
      join: function (x, y) {
        return function (a) {
          return B.join(x(a), y(a));
        };
      },
      zero: function () {
        return B.zero;
      },
      one: function () {
        return B.one;
      },
      implies: function (x, y) {
        return function (a) {
          return B.implies(x(a), y(a));
        };
      },
      not: function (x) {
        return function (a) {
          return B.not(x(a));
        };
      }
    };
  };
};
/**
 * Unary functions form a semigroup as long as you can provide a semigroup for the codomain.
 *
 * @example
 * import { Predicate, getSemigroup } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const S1 = getSemigroup(B.SemigroupAll)<number>()
 *
 * assert.deepStrictEqual(S1.concat(f, g)(1), true)
 * assert.deepStrictEqual(S1.concat(f, g)(3), false)
 *
 * const S2 = getSemigroup(B.SemigroupAny)<number>()
 *
 * assert.deepStrictEqual(S2.concat(f, g)(1), true)
 * assert.deepStrictEqual(S2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
exports.getBooleanAlgebra = getBooleanAlgebra;
var getSemigroup = function (S) {
  return function () {
    return {
      concat: function (f, g) {
        return function (a) {
          return S.concat(f(a), g(a));
        };
      }
    };
  };
};
/**
 * Unary functions form a monoid as long as you can provide a monoid for the codomain.
 *
 * @example
 * import { Predicate } from 'fp-ts/Predicate'
 * import { getMonoid } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const M1 = getMonoid(B.MonoidAll)<number>()
 *
 * assert.deepStrictEqual(M1.concat(f, g)(1), true)
 * assert.deepStrictEqual(M1.concat(f, g)(3), false)
 *
 * const M2 = getMonoid(B.MonoidAny)<number>()
 *
 * assert.deepStrictEqual(M2.concat(f, g)(1), true)
 * assert.deepStrictEqual(M2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
exports.getSemigroup = getSemigroup;
var getMonoid = function (M) {
  var getSemigroupM = getSemigroup(M);
  return function () {
    return {
      concat: getSemigroupM().concat,
      empty: function () {
        return M.empty;
      }
    };
  };
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.getMonoid = getMonoid;
var getSemiring = function (S) {
  return {
    add: function (f, g) {
      return function (x) {
        return S.add(f(x), g(x));
      };
    },
    zero: function () {
      return S.zero;
    },
    mul: function (f, g) {
      return function (x) {
        return S.mul(f(x), g(x));
      };
    },
    one: function () {
      return S.one;
    }
  };
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.getSemiring = getSemiring;
var getRing = function (R) {
  var S = getSemiring(R);
  return {
    add: S.add,
    mul: S.mul,
    one: S.one,
    zero: S.zero,
    sub: function (f, g) {
      return function (x) {
        return R.sub(f(x), g(x));
      };
    }
  };
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.getRing = getRing;
var apply = function (a) {
  return function (f) {
    return f(a);
  };
};
/**
 * @since 2.0.0
 */
exports.apply = apply;
function identity(a) {
  return a;
}
/**
 * @since 2.0.0
 */
var unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
exports.unsafeCoerce = unsafeCoerce;
function constant(a) {
  return function () {
    return a;
  };
}
/**
 * A thunk that returns always `true`.
 *
 * @since 2.0.0
 */
var constTrue = /*#__PURE__*/constant(true);
/**
 * A thunk that returns always `false`.
 *
 * @since 2.0.0
 */
exports.constTrue = constTrue;
var constFalse = /*#__PURE__*/constant(false);
/**
 * A thunk that returns always `null`.
 *
 * @since 2.0.0
 */
exports.constFalse = constFalse;
var constNull = /*#__PURE__*/constant(null);
/**
 * A thunk that returns always `undefined`.
 *
 * @since 2.0.0
 */
exports.constNull = constNull;
var constUndefined = /*#__PURE__*/constant(undefined);
/**
 * A thunk that returns always `void`.
 *
 * @since 2.0.0
 */
exports.constUndefined = constUndefined;
var constVoid = constUndefined;
exports.constVoid = constVoid;
function flip(f) {
  return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (args.length > 1) {
      return f(args[1], args[0]);
    }
    return function (a) {
      return f(a)(args[0]);
    };
  };
}
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
  switch (arguments.length) {
    case 1:
      return ab;
    case 2:
      return function () {
        return bc(ab.apply(this, arguments));
      };
    case 3:
      return function () {
        return cd(bc(ab.apply(this, arguments)));
      };
    case 4:
      return function () {
        return de(cd(bc(ab.apply(this, arguments))));
      };
    case 5:
      return function () {
        return ef(de(cd(bc(ab.apply(this, arguments)))));
      };
    case 6:
      return function () {
        return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
      };
    case 7:
      return function () {
        return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
      };
    case 8:
      return function () {
        return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
      };
    case 9:
      return function () {
        return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
      };
  }
  return;
}
/**
 * @since 2.0.0
 */
function tuple() {
  var t = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    t[_i] = arguments[_i];
  }
  return t;
}
/**
 * @since 2.0.0
 */
function increment(n) {
  return n + 1;
}
/**
 * @since 2.0.0
 */
function decrement(n) {
  return n - 1;
}
/**
 * @since 2.0.0
 */
function absurd(_) {
  throw new Error('Called `absurd` function which should be uncallable');
}
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from 'fp-ts/function'
 *
 * const add = tupled((x: number, y: number): number => x + y)
 *
 * assert.strictEqual(add([1, 2]), 3)
 *
 * @since 2.4.0
 */
function tupled(f) {
  return function (a) {
    return f.apply(void 0, a);
  };
}
/**
 * Inverse function of `tupled`
 *
 * @since 2.4.0
 */
function untupled(f) {
  return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return f(a);
  };
}
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default:
      {
        var ret = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
          ret = arguments[i](ret);
        }
        return ret;
      }
  }
}
/**
 * Type hole simulation
 *
 * @since 2.7.0
 */
var hole = absurd;
/**
 * @since 2.11.0
 */
exports.hole = hole;
var SK = function (_, b) {
  return b;
};
/**
 * Use `Predicate` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.SK = SK;
function not(predicate) {
  return function (a) {
    return !predicate(a);
  };
}
/**
 * Use `Endomorphism` module instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
var getEndomorphismMonoid = function () {
  return {
    concat: function (first, second) {
      return flow(first, second);
    },
    empty: identity
  };
};
exports.getEndomorphismMonoid = getEndomorphismMonoid;
},{}],"node_modules/fp-ts/es6/internal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tail = exports.some = exports.singleton = exports.right = exports.none = exports.left = exports.isSome = exports.isRight = exports.isNone = exports.isNonEmpty = exports.isLeft = exports.head = exports.has = exports.fromReadonlyNonEmptyArray = exports.emptyRecord = exports.emptyReadonlyArray = void 0;
var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
var isNone = function (fa) {
  return fa._tag === 'None';
};
/** @internal */
exports.isNone = isNone;
var isSome = function (fa) {
  return fa._tag === 'Some';
};
/** @internal */
exports.isSome = isSome;
var none = {
  _tag: 'None'
};
/** @internal */
exports.none = none;
var some = function (a) {
  return {
    _tag: 'Some',
    value: a
  };
};
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
exports.some = some;
var isLeft = function (ma) {
  return ma._tag === 'Left';
};
/** @internal */
exports.isLeft = isLeft;
var isRight = function (ma) {
  return ma._tag === 'Right';
};
/** @internal */
exports.isRight = isRight;
var left = function (e) {
  return {
    _tag: 'Left',
    left: e
  };
};
/** @internal */
exports.left = left;
var right = function (a) {
  return {
    _tag: 'Right',
    right: a
  };
};
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
exports.right = right;
var singleton = function (a) {
  return [a];
};
/** @internal */
exports.singleton = singleton;
var isNonEmpty = function (as) {
  return as.length > 0;
};
/** @internal */
exports.isNonEmpty = isNonEmpty;
var head = function (as) {
  return as[0];
};
/** @internal */
exports.head = head;
var tail = function (as) {
  return as.slice(1);
};
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
exports.tail = tail;
var emptyReadonlyArray = [];
/** @internal */
exports.emptyReadonlyArray = emptyReadonlyArray;
var emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
exports.emptyRecord = emptyRecord;
var has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
exports.has = has;
var fromReadonlyNonEmptyArray = function (as) {
  return __spreadArray([as[0]], as.slice(1), true);
};
exports.fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray;
},{}],"node_modules/fp-ts/es6/Apply.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ap = ap;
exports.apFirst = apFirst;
exports.apS = apS;
exports.apSecond = apSecond;
exports.getApplySemigroup = getApplySemigroup;
exports.sequenceS = sequenceS;
exports.sequenceT = sequenceT;
var _function = require("./function");
var _ = _interopRequireWildcard(require("./internal"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ap(F, G) {
  return function (fa) {
    return function (fab) {
      return F.ap(F.map(fab, function (gab) {
        return function (ga) {
          return G.ap(gab, ga);
        };
      }), fa);
    };
  };
}
function apFirst(A) {
  return function (second) {
    return function (first) {
      return A.ap(A.map(first, function (a) {
        return function () {
          return a;
        };
      }), second);
    };
  };
}
function apSecond(A) {
  return function (second) {
    return function (first) {
      return A.ap(A.map(first, function () {
        return function (b) {
          return b;
        };
      }), second);
    };
  };
}
function apS(F) {
  return function (name, fb) {
    return function (fa) {
      return F.ap(F.map(fa, function (a) {
        return function (b) {
          var _a;
          return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
        };
      }), fb);
    };
  };
}
function getApplySemigroup(F) {
  return function (S) {
    return {
      concat: function (first, second) {
        return F.ap(F.map(first, function (x) {
          return function (y) {
            return S.concat(x, y);
          };
        }), second);
      }
    };
  };
}
function curried(f, n, acc) {
  return function (x) {
    var combined = Array(acc.length + 1);
    for (var i = 0; i < acc.length; i++) {
      combined[i] = acc[i];
    }
    combined[acc.length] = x;
    return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
  };
}
var tupleConstructors = {
  1: function (a) {
    return [a];
  },
  2: function (a) {
    return function (b) {
      return [a, b];
    };
  },
  3: function (a) {
    return function (b) {
      return function (c) {
        return [a, b, c];
      };
    };
  },
  4: function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return [a, b, c, d];
        };
      };
    };
  },
  5: function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return [a, b, c, d, e];
          };
        };
      };
    };
  }
};
function getTupleConstructor(len) {
  if (!_.has.call(tupleConstructors, len)) {
    tupleConstructors[len] = curried(_function.tuple, len - 1, []);
  }
  return tupleConstructors[len];
}
function sequenceT(F) {
  return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var len = args.length;
    var f = getTupleConstructor(len);
    var fas = F.map(args[0], f);
    for (var i = 1; i < len; i++) {
      fas = F.ap(fas, args[i]);
    }
    return fas;
  };
}
function getRecordConstructor(keys) {
  var len = keys.length;
  switch (len) {
    case 1:
      return function (a) {
        var _a;
        return _a = {}, _a[keys[0]] = a, _a;
      };
    case 2:
      return function (a) {
        return function (b) {
          var _a;
          return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a;
        };
      };
    case 3:
      return function (a) {
        return function (b) {
          return function (c) {
            var _a;
            return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a;
          };
        };
      };
    case 4:
      return function (a) {
        return function (b) {
          return function (c) {
            return function (d) {
              var _a;
              return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a[keys[3]] = d, _a;
            };
          };
        };
      };
    case 5:
      return function (a) {
        return function (b) {
          return function (c) {
            return function (d) {
              return function (e) {
                var _a;
                return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a[keys[3]] = d, _a[keys[4]] = e, _a;
              };
            };
          };
        };
      };
    default:
      return curried(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var r = {};
        for (var i = 0; i < len; i++) {
          r[keys[i]] = args[i];
        }
        return r;
      }, len - 1, []);
  }
}
function sequenceS(F) {
  return function (r) {
    var keys = Object.keys(r);
    var len = keys.length;
    var f = getRecordConstructor(keys);
    var fr = F.map(r[keys[0]], f);
    for (var i = 1; i < len; i++) {
      fr = F.ap(fr, r[keys[i]]);
    }
    return fr;
  };
}
},{"./function":"node_modules/fp-ts/es6/function.js","./internal":"node_modules/fp-ts/es6/internal.js"}],"node_modules/fp-ts/es6/Functor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindTo = bindTo;
exports.flap = flap;
exports.getFunctorComposition = getFunctorComposition;
exports.let = let_;
exports.map = map;
var _function = require("./function");
/**
 * A `Functor` is a type constructor which supports a mapping operation `map`.
 *
 * `map` can be used to turn functions `a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.map(fa, a => a) <-> fa`
 * 2. Composition: `F.map(fa, a => bc(ab(a))) <-> F.map(F.map(fa, ab), bc)`
 *
 * @since 2.0.0
 */

function map(F, G) {
  return function (f) {
    return function (fa) {
      return F.map(fa, function (ga) {
        return G.map(ga, f);
      });
    };
  };
}
function flap(F) {
  return function (a) {
    return function (fab) {
      return F.map(fab, function (f) {
        return f(a);
      });
    };
  };
}
function bindTo(F) {
  return function (name) {
    return function (fa) {
      return F.map(fa, function (a) {
        var _a;
        return _a = {}, _a[name] = a, _a;
      });
    };
  };
}
function let_(F) {
  return function (name, f) {
    return function (fa) {
      return F.map(fa, function (a) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = f(a), _a));
      });
    };
  };
}
/** @deprecated */
function getFunctorComposition(F, G) {
  var _map = map(F, G);
  return {
    map: function (fga, f) {
      return (0, _function.pipe)(fga, _map(f));
    }
  };
}
},{"./function":"node_modules/fp-ts/es6/function.js"}],"node_modules/fp-ts/es6/Applicative.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApplicativeComposition = getApplicativeComposition;
exports.getApplicativeMonoid = getApplicativeMonoid;
var _Apply = require("./Apply");
var _function = require("./function");
var _Functor = require("./Functor");
/**
 * The `Applicative` type class extends the `Apply` type class with a `of` function, which can be used to create values
 * of type `f a` from values of type `a`.
 *
 * Where `Apply` provides the ability to lift functions of two or more arguments to functions whose arguments are
 * wrapped using `f`, and `Functor` provides the ability to lift functions of one argument, `pure` can be seen as the
 * function which lifts functions of _zero_ arguments. That is, `Applicative` functors support a lifting operation for
 * any number of function arguments.
 *
 * Instances must satisfy the following laws in addition to the `Apply` laws:
 *
 * 1. Identity: `A.ap(A.of(a => a), fa) <-> fa`
 * 2. Homomorphism: `A.ap(A.of(ab), A.of(a)) <-> A.of(ab(a))`
 * 3. Interchange: `A.ap(fab, A.of(a)) <-> A.ap(A.of(ab => ab(a)), fab)`
 *
 * Note. `Functor`'s `map` can be derived: `A.map(x, f) = A.ap(A.of(f), x)`
 *
 * @since 2.0.0
 */

function getApplicativeMonoid(F) {
  var f = (0, _Apply.getApplySemigroup)(F);
  return function (M) {
    return {
      concat: f(M).concat,
      empty: F.of(M.empty)
    };
  };
}
/** @deprecated */
function getApplicativeComposition(F, G) {
  var map = (0, _Functor.getFunctorComposition)(F, G).map;
  var _ap = (0, _Apply.ap)(F, G);
  return {
    map: map,
    of: function (a) {
      return F.of(G.of(a));
    },
    ap: function (fgab, fga) {
      return (0, _function.pipe)(fgab, _ap(fga));
    }
  };
}
},{"./Apply":"node_modules/fp-ts/es6/Apply.js","./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js"}],"node_modules/fp-ts/es6/Chain.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = bind;
exports.chainFirst = chainFirst;
function chainFirst(M) {
  return function (f) {
    return function (first) {
      return M.chain(first, function (a) {
        return M.map(f(a), function () {
          return a;
        });
      });
    };
  };
}
function bind(M) {
  return function (name, f) {
    return function (ma) {
      return M.chain(ma, function (a) {
        return M.map(f(a), function (b) {
          var _a;
          return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
        });
      });
    };
  };
}
},{}],"node_modules/fp-ts/es6/FromEither.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chainEitherK = chainEitherK;
exports.chainFirstEitherK = chainFirstEitherK;
exports.chainOptionK = chainOptionK;
exports.filterOrElse = filterOrElse;
exports.fromEitherK = fromEitherK;
exports.fromOption = fromOption;
exports.fromOptionK = fromOptionK;
exports.fromPredicate = fromPredicate;
var _Chain = require("./Chain");
var _function = require("./function");
var _ = _interopRequireWildcard(require("./internal"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 2.10.0
 */

function fromOption(F) {
  return function (onNone) {
    return function (ma) {
      return F.fromEither(_.isNone(ma) ? _.left(onNone()) : _.right(ma.value));
    };
  };
}
function fromPredicate(F) {
  return function (predicate, onFalse) {
    return function (a) {
      return F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a)));
    };
  };
}
function fromOptionK(F) {
  var fromOptionF = fromOption(F);
  return function (onNone) {
    var from = fromOptionF(onNone);
    return function (f) {
      return (0, _function.flow)(f, from);
    };
  };
}
function chainOptionK(F, M) {
  var fromOptionKF = fromOptionK(F);
  return function (onNone) {
    var from = fromOptionKF(onNone);
    return function (f) {
      return function (ma) {
        return M.chain(ma, from(f));
      };
    };
  };
}
function fromEitherK(F) {
  return function (f) {
    return (0, _function.flow)(f, F.fromEither);
  };
}
function chainEitherK(F, M) {
  var fromEitherKF = fromEitherK(F);
  return function (f) {
    return function (ma) {
      return M.chain(ma, fromEitherKF(f));
    };
  };
}
function chainFirstEitherK(F, M) {
  return (0, _function.flow)(fromEitherK(F), (0, _Chain.chainFirst)(M));
}
function filterOrElse(F, M) {
  return function (predicate, onFalse) {
    return function (ma) {
      return M.chain(ma, function (a) {
        return F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a)));
      });
    };
  };
}
},{"./Chain":"node_modules/fp-ts/es6/Chain.js","./function":"node_modules/fp-ts/es6/function.js","./internal":"node_modules/fp-ts/es6/internal.js"}],"node_modules/fp-ts/es6/Predicate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.or = exports.not = exports.getSemigroupAny = exports.getSemigroupAll = exports.getMonoidAny = exports.getMonoidAll = exports.contramap = exports.and = exports.URI = exports.Contravariant = void 0;
var _function = require("./function");
var contramap_ = function (predicate, f) {
  return (0, _function.pipe)(predicate, contramap(f));
};
/**
 * @since 2.11.0
 */
var contramap = function (f) {
  return function (predicate) {
    return (0, _function.flow)(f, predicate);
  };
};
/**
 * @category type lambdas
 * @since 2.11.0
 */
exports.contramap = contramap;
var URI = 'Predicate';
/**
 * @category instances
 * @since 2.11.0
 */
exports.URI = URI;
var getSemigroupAny = function () {
  return {
    concat: function (first, second) {
      return (0, _function.pipe)(first, or(second));
    }
  };
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.getSemigroupAny = getSemigroupAny;
var getMonoidAny = function () {
  return {
    concat: getSemigroupAny().concat,
    empty: _function.constFalse
  };
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.getMonoidAny = getMonoidAny;
var getSemigroupAll = function () {
  return {
    concat: function (first, second) {
      return (0, _function.pipe)(first, and(second));
    }
  };
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.getSemigroupAll = getSemigroupAll;
var getMonoidAll = function () {
  return {
    concat: getSemigroupAll().concat,
    empty: _function.constTrue
  };
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.getMonoidAll = getMonoidAll;
var Contravariant = {
  URI: URI,
  contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.Contravariant = Contravariant;
var not = function (predicate) {
  return function (a) {
    return !predicate(a);
  };
};
/**
 * @since 2.11.0
 */
exports.not = not;
var or = function (second) {
  return function (first) {
    return function (a) {
      return first(a) || second(a);
    };
  };
};
/**
 * @since 2.11.0
 */
exports.or = or;
var and = function (second) {
  return function (first) {
    return function (a) {
      return first(a) && second(a);
    };
  };
};
exports.and = and;
},{"./function":"node_modules/fp-ts/es6/function.js"}],"node_modules/fp-ts/es6/Magma.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reverse = exports.filterSecond = exports.filterFirst = exports.endo = exports.concatAll = void 0;
/**
 * A `Magma` is a pair `(A, concat)` in which `A` is a non-empty set and `concat` is a binary operation on `A`
 *
 * See [Semigroup](https://gcanti.github.io/fp-ts/modules/Semigroup.ts.html) for some instances.
 *
 * @since 2.0.0
 */
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Magma`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse, concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(reverse(N.MagmaSub))(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), 2)
 *
 * @since 2.11.0
 */
var reverse = function (M) {
  return {
    concat: function (first, second) {
      return M.concat(second, first);
    }
  };
};
/**
 * @since 2.11.0
 */
exports.reverse = reverse;
var filterFirst = function (predicate) {
  return function (M) {
    return {
      concat: function (first, second) {
        return predicate(first) ? M.concat(first, second) : second;
      }
    };
  };
};
/**
 * @since 2.11.0
 */
exports.filterFirst = filterFirst;
var filterSecond = function (predicate) {
  return function (M) {
    return {
      concat: function (first, second) {
        return predicate(second) ? M.concat(first, second) : first;
      }
    };
  };
};
/**
 * @since 2.11.0
 */
exports.filterSecond = filterSecond;
var endo = function (f) {
  return function (M) {
    return {
      concat: function (first, second) {
        return M.concat(f(first), f(second));
      }
    };
  };
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(N.MagmaSub)(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), -6)
 *
 * @since 2.11.0
 */
exports.endo = endo;
var concatAll = function (M) {
  return function (startWith) {
    return function (as) {
      return as.reduce(function (a, acc) {
        return M.concat(a, acc);
      }, startWith);
    };
  };
};
exports.concatAll = concatAll;
},{}],"node_modules/fp-ts/es6/Eq.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tuple = exports.struct = exports.strictEqual = exports.getTupleEq = exports.getStructEq = exports.getSemigroup = exports.getMonoid = exports.fromEquals = exports.eqString = exports.eqStrict = exports.eqNumber = exports.eqDate = exports.eqBoolean = exports.eq = exports.contramap = exports.URI = exports.Contravariant = void 0;
var _function = require("./function");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var fromEquals = function (equals) {
  return {
    equals: function (x, y) {
      return x === y || equals(x, y);
    }
  };
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
exports.fromEquals = fromEquals;
var struct = function (eqs) {
  return fromEquals(function (first, second) {
    for (var key in eqs) {
      if (!eqs[key].equals(first[key], second[key])) {
        return false;
      }
    }
    return true;
  });
};
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { tuple } from 'fp-ts/Eq'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import * as B from 'fp-ts/boolean'
 *
 * const E = tuple(S.Eq, N.Eq, B.Eq)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @since 2.10.0
 */
exports.struct = struct;
var tuple = function () {
  var eqs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    eqs[_i] = arguments[_i];
  }
  return fromEquals(function (first, second) {
    return eqs.every(function (E, i) {
      return E.equals(first[i], second[i]);
    });
  });
};
/* istanbul ignore next */
exports.tuple = tuple;
var contramap_ = function (fa, f) {
  return (0, _function.pipe)(fa, contramap(f));
};
/**
 * A typical use case for `contramap` would be like, given some `User` type, to construct an `Eq<User>`.
 *
 * We can do so with a function from `User -> X` where `X` is some value that we know how to compare
 * for equality (meaning we have an `Eq<X>`)
 *
 * For example, given the following `User` type, we want to construct an `Eq<User>` that just looks at the `key` field
 * for each user (since it's known to be unique).
 *
 * If we have a way of comparing `UUID`s for equality (`eqUUID: Eq<UUID>`) and we know how to go from `User -> UUID`,
 * using `contramap` we can do this
 *
 * @example
 * import { contramap, Eq } from 'fp-ts/Eq'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/string'
 *
 * type UUID = string
 *
 * interface User {
 *   readonly key: UUID
 *   readonly firstName: string
 *   readonly lastName: string
 * }
 *
 * const eqUUID: Eq<UUID> = S.Eq
 *
 * const eqUserByKey: Eq<User> = pipe(
 *   eqUUID,
 *   contramap((user) => user.key)
 * )
 *
 * assert.deepStrictEqual(
 *   eqUserByKey.equals(
 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
 *     { key: 'k2', firstName: 'a1', lastName: 'b1' }
 *   ),
 *   false
 * )
 * assert.deepStrictEqual(
 *   eqUserByKey.equals(
 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
 *     { key: 'k1', firstName: 'a2', lastName: 'b1' }
 *   ),
 *   true
 * )
 *
 * @since 2.0.0
 */
var contramap = function (f) {
  return function (fa) {
    return fromEquals(function (x, y) {
      return fa.equals(f(x), f(y));
    });
  };
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.contramap = contramap;
var URI = 'Eq';
/**
 * @category instances
 * @since 2.5.0
 */
exports.URI = URI;
var eqStrict = {
  equals: function (a, b) {
    return a === b;
  }
};
exports.eqStrict = eqStrict;
var empty = {
  equals: function () {
    return true;
  }
};
/**
 * @category instances
 * @since 2.10.0
 */
var getSemigroup = function () {
  return {
    concat: function (x, y) {
      return fromEquals(function (a, b) {
        return x.equals(a, b) && y.equals(a, b);
      });
    }
  };
};
/**
 * @category instances
 * @since 2.6.0
 */
exports.getSemigroup = getSemigroup;
var getMonoid = function () {
  return {
    concat: getSemigroup().concat,
    empty: empty
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.getMonoid = getMonoid;
var Contravariant = {
  URI: URI,
  contramap: contramap_
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.Contravariant = Contravariant;
var getTupleEq = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleEq = getTupleEq;
var getStructEq = struct;
/**
 * Use [`eqStrict`](#eqstrict) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getStructEq = getStructEq;
var strictEqual = eqStrict.equals;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Contravariant` instance, pass `E.Contravariant` instead of `E.eq`
 * (where `E` is from `import E from 'fp-ts/Eq'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.strictEqual = strictEqual;
var eq = Contravariant;
/**
 * Use [`Eq`](./boolean.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eq = eq;
var eqBoolean = eqStrict;
/**
 * Use [`Eq`](./string.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqBoolean = eqBoolean;
var eqString = eqStrict;
/**
 * Use [`Eq`](./number.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqString = eqString;
var eqNumber = eqStrict;
/**
 * Use [`Eq`](./Date.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqNumber = eqNumber;
var eqDate = {
  equals: function (first, second) {
    return first.valueOf() === second.valueOf();
  }
};
exports.eqDate = eqDate;
},{"./function":"node_modules/fp-ts/es6/function.js"}],"node_modules/fp-ts/es6/Ord.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tuple = exports.trivial = exports.reverse = exports.ordString = exports.ordNumber = exports.ordDate = exports.ordBoolean = exports.ord = exports.min = exports.max = exports.lt = exports.leq = exports.gt = exports.getTupleOrd = exports.getSemigroup = exports.getMonoid = exports.getDualOrd = exports.geq = exports.fromCompare = exports.equalsDefault = exports.equals = exports.contramap = exports.clamp = exports.between = exports.URI = exports.Contravariant = void 0;
var _Eq = require("./Eq");
var _function = require("./function");
// -------------------------------------------------------------------------------------
// defaults
// -------------------------------------------------------------------------------------
/**
 * @category defaults
 * @since 2.10.0
 */
var equalsDefault = function (compare) {
  return function (first, second) {
    return first === second || compare(first, second) === 0;
  };
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
exports.equalsDefault = equalsDefault;
var fromCompare = function (compare) {
  return {
    equals: equalsDefault(compare),
    compare: function (first, second) {
      return first === second ? 0 : compare(first, second);
    }
  };
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Given a tuple of `Ord`s returns an `Ord` for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Ord'
 * import * as B from 'fp-ts/boolean'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 *
 * const O = tuple(S.Ord, N.Ord, B.Ord)
 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
 *
 * @since 2.10.0
 */
exports.fromCompare = fromCompare;
var tuple = function () {
  var ords = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    ords[_i] = arguments[_i];
  }
  return fromCompare(function (first, second) {
    var i = 0;
    for (; i < ords.length - 1; i++) {
      var r = ords[i].compare(first[i], second[i]);
      if (r !== 0) {
        return r;
      }
    }
    return ords[i].compare(first[i], second[i]);
  });
};
/**
 * @since 2.10.0
 */
exports.tuple = tuple;
var reverse = function (O) {
  return fromCompare(function (first, second) {
    return O.compare(second, first);
  });
};
/* istanbul ignore next */
exports.reverse = reverse;
var contramap_ = function (fa, f) {
  return (0, _function.pipe)(fa, contramap(f));
};
/**
 * A typical use case for `contramap` would be like, given some `User` type, to construct an `Ord<User>`.
 *
 * We can do so with a function from `User -> X` where `X` is some value that we know how to compare
 * for ordering (meaning we have an `Ord<X>`)
 *
 * For example, given the following `User` type, there are lots of possible choices for `X`,
 * but let's say we want to sort a list of users by `lastName`.
 *
 * If we have a way of comparing `lastName`s for ordering (`ordLastName: Ord<string>`) and we know how to go from `User -> string`,
 * using `contramap` we can do this
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { contramap, Ord } from 'fp-ts/Ord'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * interface User {
 *   readonly firstName: string
 *   readonly lastName: string
 * }
 *
 * const ordLastName: Ord<string> = S.Ord
 *
 * const ordByLastName: Ord<User> = pipe(
 *   ordLastName,
 *   contramap((user) => user.lastName)
 * )
 *
 * assert.deepStrictEqual(
 *   RA.sort(ordByLastName)([
 *     { firstName: 'a', lastName: 'd' },
 *     { firstName: 'c', lastName: 'b' }
 *   ]),
 *   [
 *     { firstName: 'c', lastName: 'b' },
 *     { firstName: 'a', lastName: 'd' }
 *   ]
 * )
 *
 * @since 2.0.0
 */
var contramap = function (f) {
  return function (fa) {
    return fromCompare(function (first, second) {
      return fa.compare(f(first), f(second));
    });
  };
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.contramap = contramap;
var URI = 'Ord';
/**
 * A typical use case for the `Semigroup` instance of `Ord` is merging two or more orderings.
 *
 * For example the following snippet builds an `Ord` for a type `User` which
 * sorts by `created` date descending, and **then** `lastName`
 *
 * @example
 * import * as D from 'fp-ts/Date'
 * import { pipe } from 'fp-ts/function'
 * import { contramap, getSemigroup, Ord, reverse } from 'fp-ts/Ord'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * interface User {
 *   readonly id: string
 *   readonly lastName: string
 *   readonly created: Date
 * }
 *
 * const ordByLastName: Ord<User> = pipe(
 *   S.Ord,
 *   contramap((user) => user.lastName)
 * )
 *
 * const ordByCreated: Ord<User> = pipe(
 *   D.Ord,
 *   contramap((user) => user.created)
 * )
 *
 * const ordUserByCreatedDescThenLastName = getSemigroup<User>().concat(
 *   reverse(ordByCreated),
 *   ordByLastName
 * )
 *
 * assert.deepStrictEqual(
 *   RA.sort(ordUserByCreatedDescThenLastName)([
 *     { id: 'c', lastName: 'd', created: new Date(1973, 10, 30) },
 *     { id: 'a', lastName: 'b', created: new Date(1973, 10, 30) },
 *     { id: 'e', lastName: 'f', created: new Date(1980, 10, 30) }
 *   ]),
 *   [
 *     { id: 'e', lastName: 'f', created: new Date(1980, 10, 30) },
 *     { id: 'a', lastName: 'b', created: new Date(1973, 10, 30) },
 *     { id: 'c', lastName: 'd', created: new Date(1973, 10, 30) }
 *   ]
 * )
 *
 * @category instances
 * @since 2.0.0
 */
exports.URI = URI;
var getSemigroup = function () {
  return {
    concat: function (first, second) {
      return fromCompare(function (a, b) {
        var ox = first.compare(a, b);
        return ox !== 0 ? ox : second.compare(a, b);
      });
    }
  };
};
/**
 * Returns a `Monoid` such that:
 *
 * - its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`
 * - its `empty` value is an `Ord` that always considers compared elements equal
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import { contramap, reverse, getMonoid } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as B from 'fp-ts/boolean'
 * import { pipe } from 'fp-ts/function'
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface User {
 *   readonly id: number
 *   readonly name: string
 *   readonly age: number
 *   readonly rememberMe: boolean
 * }
 *
 * const byName = pipe(
 *   S.Ord,
 *   contramap((p: User) => p.name)
 * )
 *
 * const byAge = pipe(
 *   N.Ord,
 *   contramap((p: User) => p.age)
 * )
 *
 * const byRememberMe = pipe(
 *   B.Ord,
 *   contramap((p: User) => p.rememberMe)
 * )
 *
 * const M = getMonoid<User>()
 *
 * const users: Array<User> = [
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
 * ]
 *
 * // sort by name, then by age, then by `rememberMe`
 * const O1 = concatAll(M)([byName, byAge, byRememberMe])
 * assert.deepStrictEqual(sort(O1)(users), [
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * // now `rememberMe = true` first, then by name, then by age
 * const O2 = concatAll(M)([reverse(byRememberMe), byName, byAge])
 * assert.deepStrictEqual(sort(O2)(users), [
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * @category instances
 * @since 2.4.0
 */
exports.getSemigroup = getSemigroup;
var getMonoid = function () {
  return {
    concat: getSemigroup().concat,
    empty: fromCompare(function () {
      return 0;
    })
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.getMonoid = getMonoid;
var Contravariant = {
  URI: URI,
  contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.Contravariant = Contravariant;
var trivial = {
  equals: _function.constTrue,
  compare: /*#__PURE__*/(0, _function.constant)(0)
};
/**
 * @since 2.11.0
 */
exports.trivial = trivial;
var equals = function (O) {
  return function (second) {
    return function (first) {
      return first === second || O.compare(first, second) === 0;
    };
  };
};
// TODO: curry in v3
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
exports.equals = equals;
var lt = function (O) {
  return function (first, second) {
    return O.compare(first, second) === -1;
  };
};
// TODO: curry in v3
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
exports.lt = lt;
var gt = function (O) {
  return function (first, second) {
    return O.compare(first, second) === 1;
  };
};
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
exports.gt = gt;
var leq = function (O) {
  return function (first, second) {
    return O.compare(first, second) !== 1;
  };
};
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
exports.leq = leq;
var geq = function (O) {
  return function (first, second) {
    return O.compare(first, second) !== -1;
  };
};
// TODO: curry in v3
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
exports.geq = geq;
var min = function (O) {
  return function (first, second) {
    return first === second || O.compare(first, second) < 1 ? first : second;
  };
};
// TODO: curry in v3
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
exports.min = min;
var max = function (O) {
  return function (first, second) {
    return first === second || O.compare(first, second) > -1 ? first : second;
  };
};
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
exports.max = max;
var clamp = function (O) {
  var minO = min(O);
  var maxO = max(O);
  return function (low, hi) {
    return function (a) {
      return maxO(minO(a, hi), low);
    };
  };
};
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
exports.clamp = clamp;
var between = function (O) {
  var ltO = lt(O);
  var gtO = gt(O);
  return function (low, hi) {
    return function (a) {
      return ltO(a, low) || gtO(a, hi) ? false : true;
    };
  };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.between = between;
var getTupleOrd = tuple;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleOrd = getTupleOrd;
var getDualOrd = reverse;
/**
 * Use [`Contravariant`](#contravariant) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getDualOrd = getDualOrd;
var ord = Contravariant;
// default compare for primitive types
exports.ord = ord;
function compare(first, second) {
  return first < second ? -1 : first > second ? 1 : 0;
}
var strictOrd = {
  equals: _Eq.eqStrict.equals,
  compare: compare
};
/**
 * Use [`Ord`](./boolean.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var ordBoolean = strictOrd;
/**
 * Use [`Ord`](./string.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ordBoolean = ordBoolean;
var ordString = strictOrd;
/**
 * Use [`Ord`](./number.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ordString = ordString;
var ordNumber = strictOrd;
/**
 * Use [`Ord`](./Date.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ordNumber = ordNumber;
var ordDate = /*#__PURE__*/(0, _function.pipe)(ordNumber, /*#__PURE__*/
contramap(function (date) {
  return date.valueOf();
}));
exports.ordDate = ordDate;
},{"./Eq":"node_modules/fp-ts/es6/Eq.js","./function":"node_modules/fp-ts/es6/function.js"}],"node_modules/fp-ts/es6/Semigroup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.first = exports.constant = exports.concatAll = void 0;
exports.fold = fold;
exports.tuple = exports.struct = exports.semigroupVoid = exports.semigroupSum = exports.semigroupString = exports.semigroupProduct = exports.semigroupAny = exports.semigroupAll = exports.reverse = exports.min = exports.max = exports.last = exports.intercalate = exports.getTupleSemigroup = exports.getStructSemigroup = exports.getObjectSemigroup = exports.getMeetSemigroup = exports.getLastSemigroup = exports.getJoinSemigroup = exports.getIntercalateSemigroup = exports.getFunctionSemigroup = exports.getFirstSemigroup = exports.getDualSemigroup = void 0;
var _function = require("./function");
var _ = _interopRequireWildcard(require("./internal"));
var M = _interopRequireWildcard(require("./Magma"));
var Or = _interopRequireWildcard(require("./Ord"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * If a type `A` can form a `Semigroup` it has an **associative** binary operation.
 *
 * ```ts
 * interface Semigroup<A> {
 *   readonly concat: (x: A, y: A) => A
 * }
 * ```
 *
 * Associativity means the following equality must hold for any choice of `x`, `y`, and `z`.
 *
 * ```ts
 * concat(x, concat(y, z)) = concat(concat(x, y), z)
 * ```
 *
 * A common example of a semigroup is the type `string` with the operation `+`.
 *
 * ```ts
 * import { Semigroup } from 'fp-ts/Semigroup'
 *
 * const semigroupString: Semigroup<string> = {
 *   concat: (x, y) => x + y
 * }
 *
 * const x = 'x'
 * const y = 'y'
 * const z = 'z'
 *
 * semigroupString.concat(x, y) // 'xy'
 *
 * semigroupString.concat(x, semigroupString.concat(y, z)) // 'xyz'
 *
 * semigroupString.concat(semigroupString.concat(x, y), z) // 'xyz'
 * ```
 *
 * *Adapted from https://typelevel.org/cats*
 *
 * @since 2.0.0
 */

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get a semigroup where `concat` will return the minimum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.min(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 1)
 *
 * @category constructors
 * @since 2.10.0
 */
var min = function (O) {
  return {
    concat: Or.min(O)
  };
};
/**
 * Get a semigroup where `concat` will return the maximum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.max(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 2)
 *
 * @category constructors
 * @since 2.10.0
 */
exports.min = min;
var max = function (O) {
  return {
    concat: Or.max(O)
  };
};
/**
 * @category constructors
 * @since 2.10.0
 */
exports.max = max;
var constant = function (a) {
  return {
    concat: function () {
      return a;
    }
  };
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Semigroup`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(reverse(S.Semigroup).concat('a', 'b'), 'ba')
 *
 * @since 2.10.0
 */
exports.constant = constant;
var reverse = M.reverse;
/**
 * Given a struct of semigroups returns a semigroup for the struct.
 *
 * @example
 * import { struct } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const S = struct<Point>({
 *   x: N.SemigroupSum,
 *   y: N.SemigroupSum
 * })
 *
 * assert.deepStrictEqual(S.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @since 2.10.0
 */
exports.reverse = reverse;
var struct = function (semigroups) {
  return {
    concat: function (first, second) {
      var r = {};
      for (var k in semigroups) {
        if (_.has.call(semigroups, k)) {
          r[k] = semigroups[k].concat(first[k], second[k]);
        }
      }
      return r;
    }
  };
};
/**
 * Given a tuple of semigroups returns a semigroup for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Semigroup'
 * import * as B from 'fp-ts/boolean'
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/string'
 *
 * const S1 = tuple(S.Semigroup, N.SemigroupSum)
 * assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const S2 = tuple(S.Semigroup, N.SemigroupSum, B.SemigroupAll)
 * assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @since 2.10.0
 */
exports.struct = struct;
var tuple = function () {
  var semigroups = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    semigroups[_i] = arguments[_i];
  }
  return {
    concat: function (first, second) {
      return semigroups.map(function (s, i) {
        return s.concat(first[i], second[i]);
      });
    }
  };
};
/**
 * Between each pair of elements insert `middle`.
 *
 * @example
 * import { intercalate } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * const S1 = pipe(S.Semigroup, intercalate(' + '))
 *
 * assert.strictEqual(S1.concat('a', 'b'), 'a + b')
 *
 * @since 2.10.0
 */
exports.tuple = tuple;
var intercalate = function (middle) {
  return function (S) {
    return {
      concat: function (x, y) {
        return S.concat(x, S.concat(middle, y));
      }
    };
  };
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * Always return the first argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.first<number>().concat(1, 2), 1)
 *
 * @category instances
 * @since 2.10.0
 */
exports.intercalate = intercalate;
var first = function () {
  return {
    concat: _function.identity
  };
};
/**
 * Always return the last argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.last<number>().concat(1, 2), 2)
 *
 * @category instances
 * @since 2.10.0
 */
exports.first = first;
var last = function () {
  return {
    concat: function (_, y) {
      return y;
    }
  };
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * const sum = concatAll(N.SemigroupSum)(0)
 *
 * assert.deepStrictEqual(sum([1, 2, 3]), 6)
 * assert.deepStrictEqual(sum([]), 0)
 *
 * @since 2.10.0
 */
exports.last = last;
var concatAll = M.concatAll;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `void` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.concatAll = concatAll;
var semigroupVoid = constant(undefined);
/**
 * Use [`getAssignSemigroup`](./struct.ts.html#getAssignSemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupVoid = semigroupVoid;
var getObjectSemigroup = function () {
  return {
    concat: function (first, second) {
      return Object.assign({}, first, second);
    }
  };
};
/**
 * Use [`last`](#last) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getObjectSemigroup = getObjectSemigroup;
var getLastSemigroup = last;
/**
 * Use [`first`](#first) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getLastSemigroup = getLastSemigroup;
var getFirstSemigroup = first;
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getFirstSemigroup = getFirstSemigroup;
var getTupleSemigroup = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleSemigroup = getTupleSemigroup;
var getStructSemigroup = struct;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getStructSemigroup = getStructSemigroup;
var getDualSemigroup = reverse;
/**
 * Use [`max`](#max) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getDualSemigroup = getDualSemigroup;
var getJoinSemigroup = max;
/**
 * Use [`min`](#min) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getJoinSemigroup = getJoinSemigroup;
var getMeetSemigroup = min;
/**
 * Use [`intercalate`](#intercalate) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.getMeetSemigroup = getMeetSemigroup;
var getIntercalateSemigroup = intercalate;
exports.getIntercalateSemigroup = getIntercalateSemigroup;
function fold(S) {
  var concatAllS = concatAll(S);
  return function (startWith, as) {
    return as === undefined ? concatAllS(startWith) : concatAllS(startWith)(as);
  };
}
/**
 * Use [`SemigroupAll`](./boolean.ts.html#SemigroupAll) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var semigroupAll = {
  concat: function (x, y) {
    return x && y;
  }
};
/**
 * Use [`SemigroupAny`](./boolean.ts.html#SemigroupAny) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupAll = semigroupAll;
var semigroupAny = {
  concat: function (x, y) {
    return x || y;
  }
};
/**
 * Use [`getSemigroup`](./function.ts.html#getSemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupAny = semigroupAny;
var getFunctionSemigroup = _function.getSemigroup;
/**
 * Use [`Semigroup`](./string.ts.html#Semigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getFunctionSemigroup = getFunctionSemigroup;
var semigroupString = {
  concat: function (x, y) {
    return x + y;
  }
};
/**
 * Use [`SemigroupSum`](./number.ts.html#SemigroupSum) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupString = semigroupString;
var semigroupSum = {
  concat: function (x, y) {
    return x + y;
  }
};
/**
 * Use [`SemigroupProduct`](./number.ts.html#SemigroupProduct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupSum = semigroupSum;
var semigroupProduct = {
  concat: function (x, y) {
    return x * y;
  }
};
exports.semigroupProduct = semigroupProduct;
},{"./function":"node_modules/fp-ts/es6/function.js","./internal":"node_modules/fp-ts/es6/internal.js","./Magma":"node_modules/fp-ts/es6/Magma.js","./Ord":"node_modules/fp-ts/es6/Ord.js"}],"node_modules/fp-ts/es6/Separated.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.separated = exports.right = exports.mapLeft = exports.map = exports.left = exports.flap = exports.bimap = exports.URI = exports.Functor = exports.Bifunctor = void 0;
var _function = require("./function");
var _Functor = require("./Functor");
/**
 * ```ts
 * interface Separated<E, A> {
 *    readonly left: E
 *    readonly right: A
 * }
 * ```
 *
 * Represents a result of separating a whole into two parts.
 *
 * @since 2.10.0
 */

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
var separated = function (left, right) {
  return {
    left: left,
    right: right
  };
};
exports.separated = separated;
var _map = function (fa, f) {
  return (0, _function.pipe)(fa, map(f));
};
var _mapLeft = function (fa, f) {
  return (0, _function.pipe)(fa, mapLeft(f));
};
var _bimap = function (fa, g, f) {
  return (0, _function.pipe)(fa, bimap(g, f));
};
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.10.0
 */
var map = function (f) {
  return function (fa) {
    return separated(left(fa), f(right(fa)));
  };
};
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.10.0
 */
exports.map = map;
var mapLeft = function (f) {
  return function (fa) {
    return separated(f(left(fa)), right(fa));
  };
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.10.0
 */
exports.mapLeft = mapLeft;
var bimap = function (f, g) {
  return function (fa) {
    return separated(f(left(fa)), g(right(fa)));
  };
};
/**
 * @category type lambdas
 * @since 2.10.0
 */
exports.bimap = bimap;
var URI = 'Separated';
/**
 * @category instances
 * @since 2.10.0
 */
exports.URI = URI;
var Bifunctor = {
  URI: URI,
  mapLeft: _mapLeft,
  bimap: _bimap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Bifunctor = Bifunctor;
var Functor = {
  URI: URI,
  map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
exports.Functor = Functor;
var flap = /*#__PURE__*/(0, _Functor.flap)(Functor);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
exports.flap = flap;
var left = function (s) {
  return s.left;
};
/**
 * @since 2.10.0
 */
exports.left = left;
var right = function (s) {
  return s.right;
};
exports.right = right;
},{"./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js"}],"node_modules/fp-ts/es6/Witherable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterE = filterE;
exports.wiltDefault = wiltDefault;
exports.witherDefault = witherDefault;
var _ = _interopRequireWildcard(require("./internal"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function wiltDefault(T, C) {
  return function (F) {
    var traverseF = T.traverse(F);
    return function (wa, f) {
      return F.map(traverseF(wa, f), C.separate);
    };
  };
}
function witherDefault(T, C) {
  return function (F) {
    var traverseF = T.traverse(F);
    return function (wa, f) {
      return F.map(traverseF(wa, f), C.compact);
    };
  };
}
function filterE(W) {
  return function (F) {
    var witherF = W.wither(F);
    return function (predicate) {
      return function (ga) {
        return witherF(ga, function (a) {
          return F.map(predicate(a), function (b) {
            return b ? _.some(a) : _.none;
          });
        });
      };
    };
  };
}
},{"./internal":"node_modules/fp-ts/es6/internal.js"}],"node_modules/fp-ts/es6/Zero.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.guard = guard;
function guard(F, P) {
  return function (b) {
    return b ? P.of(undefined) : F.zero();
  };
}
},{}],"node_modules/fp-ts/es6/Option.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicate = exports.compact = exports.chainNullableK = exports.chainFirstEitherK = exports.chainFirst = exports.chainEitherK = exports.chain = exports.bindTo = exports.bind = exports.apSecond = exports.apS = exports.apFirst = exports.ap = exports.altW = exports.alt = exports.Zero = exports.Witherable = exports.URI = exports.Traversable = exports.Pointed = exports.MonadThrow = exports.Monad = exports.Functor = exports.FromEither = exports.Foldable = exports.Filterable = exports.Extend = exports.Do = exports.Compactable = exports.Chain = exports.Apply = exports.Applicative = exports.ApT = exports.Alternative = exports.Alt = void 0;
exports.elem = elem;
exports.fromNullableK = exports.fromNullable = exports.fromEitherK = exports.fromEither = exports.foldW = exports.foldMap = exports.fold = exports.flatten = exports.flap = exports.filterMap = exports.filter = exports.extend = exports.exists = void 0;
exports.fromPredicate = fromPredicate;
exports.getOrd = exports.getOrElseW = exports.getOrElse = exports.getMonoid = exports.getLeft = exports.getLastMonoid = exports.getFirstMonoid = exports.getEq = exports.getApplySemigroup = exports.getApplyMonoid = void 0;
exports.getRefinement = getRefinement;
exports.zero = exports.wither = exports.wilt = exports.tryCatchK = exports.tryCatch = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseArrayWithIndex = exports.traverseArray = exports.traverse = exports.toUndefined = exports.toNullable = exports.throwError = exports.some = exports.sequenceArray = exports.sequence = exports.separate = exports.reduceRight = exports.reduce = exports.partitionMap = exports.partition = exports.option = exports.of = exports.none = exports.matchW = exports.match = exports.mapNullable = exports.map = exports.let = exports.isSome = exports.isNone = exports.guard = exports.getShow = exports.getRight = void 0;
var _Applicative = require("./Applicative");
var _Apply = require("./Apply");
var _Chain = require("./Chain");
var _FromEither = require("./FromEither");
var _function = require("./function");
var _Functor = require("./Functor");
var _ = _interopRequireWildcard(require("./internal"));
var _Predicate = require("./Predicate");
var _Semigroup = require("./Semigroup");
var _Separated = require("./Separated");
var _Witherable = require("./Witherable");
var _Zero = require("./Zero");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 2.0.0
 */
var none = _.none;
/**
 * Constructs a `Some`. Represents an optional value that exists.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.none = none;
var some = _.some;
exports.some = some;
function fromPredicate(predicate) {
  return function (a) {
    return predicate(a) ? some(a) : none;
  };
}
/**
 * Returns the `Left` value of an `Either` if possible.
 *
 * @example
 * import { getLeft, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 *
 * @category constructors
 * @since 2.0.0
 */
var getLeft = function (ma) {
  return ma._tag === 'Right' ? none : some(ma.left);
};
/**
 * Returns the `Right` value of an `Either` if possible.
 *
 * @example
 * import { getRight, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(left('a')), none)
 *
 * @category constructors
 * @since 2.0.0
 */
exports.getLeft = getLeft;
var getRight = function (ma) {
  return ma._tag === 'Left' ? none : some(ma.right);
};
exports.getRight = getRight;
var _map = function (fa, f) {
  return (0, _function.pipe)(fa, map(f));
};
var _ap = function (fab, fa) {
  return (0, _function.pipe)(fab, ap(fa));
};
var _chain = function (ma, f) {
  return (0, _function.pipe)(ma, chain(f));
};
var _reduce = function (fa, b, f) {
  return (0, _function.pipe)(fa, reduce(b, f));
};
var _foldMap = function (M) {
  var foldMapM = foldMap(M);
  return function (fa, f) {
    return (0, _function.pipe)(fa, foldMapM(f));
  };
};
var _reduceRight = function (fa, b, f) {
  return (0, _function.pipe)(fa, reduceRight(b, f));
};
var _traverse = function (F) {
  var traverseF = traverse(F);
  return function (ta, f) {
    return (0, _function.pipe)(ta, traverseF(f));
  };
};
/* istanbul ignore next */
var _alt = function (fa, that) {
  return (0, _function.pipe)(fa, alt(that));
};
var _filter = function (fa, predicate) {
  return (0, _function.pipe)(fa, filter(predicate));
};
/* istanbul ignore next */
var _filterMap = function (fa, f) {
  return (0, _function.pipe)(fa, filterMap(f));
};
/* istanbul ignore next */
var _extend = function (wa, f) {
  return (0, _function.pipe)(wa, extend(f));
};
/* istanbul ignore next */
var _partition = function (fa, predicate) {
  return (0, _function.pipe)(fa, partition(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) {
  return (0, _function.pipe)(fa, partitionMap(f));
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
var URI = 'Option';
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = URI;
var getShow = function (S) {
  return {
    show: function (ma) {
      return isNone(ma) ? 'none' : "some(".concat(S.show(ma.value), ")");
    }
  };
};
/**
 * @example
 * import { none, some, getEq } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals(none, none), true)
 * assert.strictEqual(E.equals(none, some(1)), false)
 * assert.strictEqual(E.equals(some(1), none), false)
 * assert.strictEqual(E.equals(some(1), some(2)), false)
 * assert.strictEqual(E.equals(some(1), some(1)), true)
 *
 * @category instances
 * @since 2.0.0
 */
exports.getShow = getShow;
var getEq = function (E) {
  return {
    equals: function (x, y) {
      return x === y || (isNone(x) ? isNone(y) : isNone(y) ? false : E.equals(x.value, y.value));
    }
  };
};
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const O = getOrd(N.Ord)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @category instances
 * @since 2.0.0
 */
exports.getEq = getEq;
var getOrd = function (O) {
  return {
    equals: getEq(O).equals,
    compare: function (x, y) {
      return x === y ? 0 : isSome(x) ? isSome(y) ? O.compare(x.value, y.value) : 1 : -1;
    }
  };
};
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(b) | some(b)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/Option'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const M = getMonoid(SemigroupSum)
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(3))
 *
 * @category instances
 * @since 2.0.0
 */
exports.getOrd = getOrd;
var getMonoid = function (S) {
  return {
    concat: function (x, y) {
      return isNone(x) ? y : isNone(y) ? x : some(S.concat(x.value, y.value));
    },
    empty: none
  };
};
/**
 * @category mapping
 * @since 2.0.0
 */
exports.getMonoid = getMonoid;
var map = function (f) {
  return function (fa) {
    return isNone(fa) ? none : some(f(fa.value));
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.map = map;
var Functor = {
  URI: URI,
  map: _map
};
/**
 * @category constructors
 * @since 2.7.0
 */
exports.Functor = Functor;
var of = some;
/**
 * @category instances
 * @since 2.10.0
 */
exports.of = of;
var Pointed = {
  URI: URI,
  of: of
};
/**
 * @since 2.0.0
 */
exports.Pointed = Pointed;
var ap = function (fa) {
  return function (fab) {
    return isNone(fab) ? none : isNone(fa) ? none : some(fab.value(fa.value));
  };
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ap = ap;
var Apply = {
  URI: URI,
  map: _map,
  ap: _ap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Apply = Apply;
var Applicative = {
  URI: URI,
  map: _map,
  ap: _ap,
  of: of
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.Applicative = Applicative;
var chain = function (f) {
  return function (ma) {
    return isNone(ma) ? none : f(ma.value);
  };
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.chain = chain;
var Chain = {
  URI: URI,
  map: _map,
  ap: _ap,
  chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Chain = Chain;
var Monad = {
  URI: URI,
  map: _map,
  ap: _ap,
  of: of,
  chain: _chain
};
/**
 * @category folding
 * @since 2.0.0
 */
exports.Monad = Monad;
var reduce = function (b, f) {
  return function (fa) {
    return isNone(fa) ? b : f(b, fa.value);
  };
};
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduce = reduce;
var foldMap = function (M) {
  return function (f) {
    return function (fa) {
      return isNone(fa) ? M.empty : f(fa.value);
    };
  };
};
/**
 * @category folding
 * @since 2.0.0
 */
exports.foldMap = foldMap;
var reduceRight = function (b, f) {
  return function (fa) {
    return isNone(fa) ? b : f(fa.value, b);
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.reduceRight = reduceRight;
var Foldable = {
  URI: URI,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
exports.Foldable = Foldable;
var altW = function (that) {
  return function (fa) {
    return isNone(fa) ? that() : fa;
  };
};
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Option` returns the left-most non-`None` value.
 *
 * | x       | y       | pipe(x, alt(() => y) |
 * | ------- | ------- | -------------------- |
 * | none    | none    | none                 |
 * | some(a) | none    | some(a)              |
 * | none    | some(b) | some(b)              |
 * | some(a) | some(b) | some(a)              |
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     O.alt(() => O.none)
 *   ),
 *   O.none
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.alt<string>(() => O.none)
 *   ),
 *   O.some('a')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('a')
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.altW = altW;
var alt = altW;
/**
 * @category instances
 * @since 2.7.0
 */
exports.alt = alt;
var Alt = {
  URI: URI,
  map: _map,
  alt: _alt
};
/**
 * @since 2.7.0
 */
exports.Alt = Alt;
var zero = function () {
  return none;
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.zero = zero;
var Zero = {
  URI: URI,
  zero: zero
};
/**
 * @category do notation
 * @since 2.11.0
 */
exports.Zero = Zero;
var guard = /*#__PURE__*/(0, _Zero.guard)(Zero, Pointed);
/**
 * @category instances
 * @since 2.7.0
 */
exports.guard = guard;
var Alternative = {
  URI: URI,
  map: _map,
  ap: _ap,
  of: of,
  alt: _alt,
  zero: zero
};
/**
 * @since 2.0.0
 */
exports.Alternative = Alternative;
var extend = function (f) {
  return function (wa) {
    return isNone(wa) ? none : some(f(wa));
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.extend = extend;
var Extend = {
  URI: URI,
  map: _map,
  extend: _extend
};
/**
 * @category filtering
 * @since 2.0.0
 */
exports.Extend = Extend;
var compact = /*#__PURE__*/chain(_function.identity);
exports.compact = compact;
var defaultSeparated = /*#__PURE__*/(0, _Separated.separated)(none, none);
/**
 * @category filtering
 * @since 2.0.0
 */
var separate = function (ma) {
  return isNone(ma) ? defaultSeparated : (0, _Separated.separated)(getLeft(ma.value), getRight(ma.value));
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.separate = separate;
var Compactable = {
  URI: URI,
  compact: compact,
  separate: separate
};
/**
 * @category filtering
 * @since 2.0.0
 */
exports.Compactable = Compactable;
var filter = function (predicate) {
  return function (fa) {
    return isNone(fa) ? none : predicate(fa.value) ? fa : none;
  };
};
/**
 * @category filtering
 * @since 2.0.0
 */
exports.filter = filter;
var filterMap = function (f) {
  return function (fa) {
    return isNone(fa) ? none : f(fa.value);
  };
};
/**
 * @category filtering
 * @since 2.0.0
 */
exports.filterMap = filterMap;
var partition = function (predicate) {
  return function (fa) {
    return (0, _Separated.separated)(_filter(fa, (0, _Predicate.not)(predicate)), _filter(fa, predicate));
  };
};
/**
 * @category filtering
 * @since 2.0.0
 */
exports.partition = partition;
var partitionMap = function (f) {
  return (0, _function.flow)(map(f), separate);
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.partitionMap = partitionMap;
var Filterable = {
  URI: URI,
  map: _map,
  compact: compact,
  separate: separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap
};
/**
 * @category traversing
 * @since 2.6.3
 */
exports.Filterable = Filterable;
var traverse = function (F) {
  return function (f) {
    return function (ta) {
      return isNone(ta) ? F.of(none) : F.map(f(ta.value), some);
    };
  };
};
/**
 * @category traversing
 * @since 2.6.3
 */
exports.traverse = traverse;
var sequence = function (F) {
  return function (ta) {
    return isNone(ta) ? F.of(none) : F.map(ta.value, some);
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.sequence = sequence;
var Traversable = {
  URI: URI,
  map: _map,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence: sequence
};
exports.Traversable = Traversable;
var _wither = /*#__PURE__*/(0, _Witherable.witherDefault)(Traversable, Compactable);
var _wilt = /*#__PURE__*/(0, _Witherable.wiltDefault)(Traversable, Compactable);
/**
 * @category filtering
 * @since 2.6.5
 */
var wither = function (F) {
  var _witherF = _wither(F);
  return function (f) {
    return function (fa) {
      return _witherF(fa, f);
    };
  };
};
/**
 * @category filtering
 * @since 2.6.5
 */
exports.wither = wither;
var wilt = function (F) {
  var _wiltF = _wilt(F);
  return function (f) {
    return function (fa) {
      return _wiltF(fa, f);
    };
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.wilt = wilt;
var Witherable = {
  URI: URI,
  map: _map,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence: sequence,
  compact: compact,
  separate: separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap,
  wither: _wither,
  wilt: _wilt
};
/**
 * @since 2.7.0
 */
exports.Witherable = Witherable;
var throwError = function () {
  return none;
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.throwError = throwError;
var MonadThrow = {
  URI: URI,
  map: _map,
  ap: _ap,
  of: of,
  chain: _chain,
  throwError: throwError
};
/**
 * Transforms an `Either` to an `Option` discarding the error.
 *
 * Alias of [getRight](#getright)
 *
 * @category conversions
 * @since 2.0.0
 */
exports.MonadThrow = MonadThrow;
var fromEither = getRight;
/**
 * @category instances
 * @since 2.11.0
 */
exports.fromEither = fromEither;
var FromEither = {
  URI: URI,
  fromEither: fromEither
};
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise.
 *
 * @example
 * import { some, none, isSome } from 'fp-ts/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @category refinements
 * @since 2.0.0
 */
exports.FromEither = FromEither;
var isSome = _.isSome;
/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isSome = isSome;
var isNone = function (fa) {
  return fa._tag === 'None';
};
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.isNone = isNone;
var matchW = function (onNone, onSome) {
  return function (ma) {
    return isNone(ma) ? onNone() : onSome(ma.value);
  };
};
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchW = matchW;
var foldW = matchW;
/**
 * Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, match } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = foldW;
var match = matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.match = match;
var fold = match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
exports.fold = fold;
var getOrElseW = function (onNone) {
  return function (ma) {
    return isNone(ma) ? onNone() : ma.value;
  };
};
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns the given default value
 *
 * @example
 * import { some, none, getOrElse } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.getOrElseW = getOrElseW;
var getOrElse = getOrElseW;
/**
 * @category mapping
 * @since 2.10.0
 */
exports.getOrElse = getOrElse;
var flap = /*#__PURE__*/(0, _Functor.flap)(Functor);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.flap = flap;
var apFirst = /*#__PURE__*/(0, _Apply.apFirst)(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apFirst = apFirst;
var apSecond = /*#__PURE__*/(0, _Apply.apSecond)(Apply);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.apSecond = apSecond;
var flatten = compact;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = flatten;
var chainFirst = /*#__PURE__*/(0, _Chain.chainFirst)(Chain);
/**
 * @since 2.0.0
 */
exports.chainFirst = chainFirst;
var duplicate = /*#__PURE__*/extend(_function.identity);
/**
 * @category lifting
 * @since 2.11.0
 */
exports.duplicate = duplicate;
var fromEitherK = /*#__PURE__*/(0, _FromEither.fromEitherK)(FromEither);
/**
 * @category sequencing
 * @since 2.11.0
 */
exports.fromEitherK = fromEitherK;
var chainEitherK = /*#__PURE__*/(0, _FromEither.chainEitherK)(FromEither, Chain);
/**
 * @category sequencing
 * @since 2.12.0
 */
exports.chainEitherK = chainEitherK;
var chainFirstEitherK = /*#__PURE__*/(0, _FromEither.chainFirstEitherK)(FromEither, Chain);
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category conversions
 * @since 2.0.0
 */
exports.chainFirstEitherK = chainFirstEitherK;
var fromNullable = function (a) {
  return a == null ? none : some(a);
};
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in a
 * `Some`.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(tryCatch(() => 1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
exports.fromNullable = fromNullable;
var tryCatch = function (f) {
  try {
    return some(f());
  } catch (e) {
    return none;
  }
};
/**
 * Converts a function that may throw to one returning a `Option`.
 *
 * @category interop
 * @since 2.10.0
 */
exports.tryCatch = tryCatch;
var tryCatchK = function (f) {
  return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return tryCatch(function () {
      return f.apply(void 0, a);
    });
  };
};
/**
 * Returns a *smart constructor* from a function that returns a nullable value.
 *
 * @example
 * import { fromNullableK, none, some } from 'fp-ts/Option'
 *
 * const f = (s: string): number | undefined => {
 *   const n = parseFloat(s)
 *   return isNaN(n) ? undefined : n
 * }
 *
 * const g = fromNullableK(f)
 *
 * assert.deepStrictEqual(g('1'), some(1))
 * assert.deepStrictEqual(g('a'), none)
 *
 * @category lifting
 * @since 2.9.0
 */
exports.tryCatchK = tryCatchK;
var fromNullableK = function (f) {
  return (0, _function.flow)(f, fromNullable);
};
/**
 * This is `chain` + `fromNullable`, useful when working with optional values.
 *
 * @example
 * import { some, none, fromNullable, chainNullableK } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Employee {
 *   readonly company?: {
 *     readonly address?: {
 *       readonly street?: {
 *         readonly name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee1.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee2.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   none
 * )
 *
 * @category sequencing
 * @since 2.9.0
 */
exports.fromNullableK = fromNullableK;
var chainNullableK = function (f) {
  return function (ma) {
    return isNone(ma) ? none : fromNullable(f(ma.value));
  };
};
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `null`.
 *
 * @example
 * import { some, none, toNullable } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toNullable
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toNullable
 *   ),
 *   null
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
exports.chainNullableK = chainNullableK;
var toNullable = /*#__PURE__*/match(_function.constNull, _function.identity);
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.
 *
 * @example
 * import { some, none, toUndefined } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toUndefined
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toUndefined
 *   ),
 *   undefined
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
exports.toNullable = toNullable;
var toUndefined = /*#__PURE__*/match(_function.constUndefined, _function.identity);
exports.toUndefined = toUndefined;
function elem(E) {
  return function (a, ma) {
    if (ma === undefined) {
      var elemE_1 = elem(E);
      return function (ma) {
        return elemE_1(a, ma);
      };
    }
    return isNone(ma) ? false : E.equals(a, ma.value);
  };
}
/**
 * Returns `true` if the predicate is satisfied by the wrapped value
 *
 * @example
 * import { some, none, exists } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 0)
 *   ),
 *   true
 * )
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 1)
 *   ),
 *   false
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     exists(n => n > 0)
 *   ),
 *   false
 * )
 *
 * @since 2.0.0
 */
var exists = function (predicate) {
  return function (ma) {
    return isNone(ma) ? false : predicate(ma.value);
  };
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.exists = exists;
var Do = /*#__PURE__*/of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.Do = Do;
var bindTo = /*#__PURE__*/(0, _Functor.bindTo)(Functor);
exports.bindTo = bindTo;
var let_ = /*#__PURE__*/(0, _Functor.let)(Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
var bind = /*#__PURE__*/(0, _Chain.bind)(Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = bind;
var apS = /*#__PURE__*/(0, _Apply.apS)(Apply);
/**
 * @since 2.11.0
 */
exports.apS = apS;
var ApT = /*#__PURE__*/of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.ApT = ApT;
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
  return function (as) {
    var o = f(0, _.head(as));
    if (isNone(o)) {
      return none;
    }
    var out = [o.value];
    for (var i = 1; i < as.length; i++) {
      var o_1 = f(i, as[i]);
      if (isNone(o_1)) {
        return none;
      }
      out.push(o_1.value);
    }
    return some(out);
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
var traverseReadonlyArrayWithIndex = function (f) {
  var g = traverseReadonlyNonEmptyArrayWithIndex(f);
  return function (as) {
    return _.isNonEmpty(as) ? g(as) : ApT;
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = traverseArrayWithIndex;
var traverseArray = function (f) {
  return traverseReadonlyArrayWithIndex(function (_, a) {
    return f(a);
  });
};
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArray = traverseArray;
var sequenceArray = /*#__PURE__*/traverseArray(_function.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `Refinement` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.sequenceArray = sequenceArray;
function getRefinement(getOption) {
  return function (a) {
    return isSome(getOption(a));
  };
}
/**
 * Use [`chainNullableK`](#chainnullablek) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var mapNullable = chainNullableK;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `O.Functor` instead of `O.option`
 * (where `O` is from `import O from 'fp-ts/Option'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.mapNullable = mapNullable;
var option = {
  URI: URI,
  map: _map,
  of: of,
  ap: _ap,
  chain: _chain,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence: sequence,
  zero: zero,
  alt: _alt,
  extend: _extend,
  compact: compact,
  separate: separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap,
  wither: _wither,
  wilt: _wilt,
  throwError: throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.option = option;
var getApplySemigroup = /*#__PURE__*/(0, _Apply.getApplySemigroup)(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = getApplySemigroup;
var getApplyMonoid = /*#__PURE__*/(0, _Applicative.getApplicativeMonoid)(Applicative);
/**
 * Use
 *
 * ```ts
 * import { first } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(first())
 * ```
 *
 * instead.
 *
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(1))
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = getApplyMonoid;
var getFirstMonoid = function () {
  return getMonoid((0, _Semigroup.first)());
};
/**
 * Use
 *
 * ```ts
 * import { last } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(last())
 * ```
 *
 * instead.
 *
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(2))
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getFirstMonoid = getFirstMonoid;
var getLastMonoid = function () {
  return getMonoid((0, _Semigroup.last)());
};
exports.getLastMonoid = getLastMonoid;
},{"./Applicative":"node_modules/fp-ts/es6/Applicative.js","./Apply":"node_modules/fp-ts/es6/Apply.js","./Chain":"node_modules/fp-ts/es6/Chain.js","./FromEither":"node_modules/fp-ts/es6/FromEither.js","./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js","./internal":"node_modules/fp-ts/es6/internal.js","./Predicate":"node_modules/fp-ts/es6/Predicate.js","./Semigroup":"node_modules/fp-ts/es6/Semigroup.js","./Separated":"node_modules/fp-ts/es6/Separated.js","./Witherable":"node_modules/fp-ts/es6/Witherable.js","./Zero":"node_modules/fp-ts/es6/Zero.js"}],"node_modules/fp-ts/es6/Compactable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;
exports.getCompactableComposition = getCompactableComposition;
exports.separate = separate;
var _function = require("./function");
var _Functor = require("./Functor");
var _Option = require("./Option");
var S = _interopRequireWildcard(require("./Separated"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function compact(F, G) {
  return function (fga) {
    return F.map(fga, G.compact);
  };
}
function separate(F, C, G) {
  var _compact = compact(F, C);
  var _map = (0, _Functor.map)(F, G);
  return function (fge) {
    return S.separated(_compact((0, _function.pipe)(fge, _map(_Option.getLeft))), _compact((0, _function.pipe)(fge, _map(_Option.getRight))));
  };
}
/** @deprecated */
function getCompactableComposition(F, G) {
  var map = (0, _Functor.getFunctorComposition)(F, G).map;
  return {
    map: map,
    compact: compact(F, G),
    separate: separate(F, G, G)
  };
}
},{"./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js","./Option":"node_modules/fp-ts/es6/Option.js","./Separated":"node_modules/fp-ts/es6/Separated.js"}],"node_modules/fp-ts/es6/ChainRec.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tailRec = void 0;
/**
 * @since 2.0.0
 */
var tailRec = function (startWith, f) {
  var ab = f(startWith);
  while (ab._tag === 'Left') {
    ab = f(ab.left);
  }
  return ab.right;
};
exports.tailRec = tailRec;
},{}],"node_modules/fp-ts/es6/Either.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.either = exports.duplicate = exports.chainW = exports.chainOptionK = exports.chainNullableK = exports.chainFirstW = exports.chainFirst = exports.chain = exports.bindW = exports.bindTo = exports.bind = exports.bimap = exports.apW = exports.apSecondW = exports.apSecond = exports.apSW = exports.apS = exports.apFirstW = exports.apFirst = exports.ap = exports.altW = exports.alt = exports.URI = exports.Traversable = exports.Pointed = exports.MonadThrow = exports.Monad = exports.Functor = exports.FromEither = exports.Foldable = exports.Extend = exports.Do = exports.ChainRec = exports.Chain = exports.Bifunctor = exports.Apply = exports.Applicative = exports.ApT = exports.Alt = void 0;
exports.elem = elem;
exports.getShow = exports.getSemigroup = exports.getOrElseW = exports.getOrElse = exports.getFilterable = exports.getEq = exports.getCompactable = exports.getApplySemigroup = exports.getApplyMonoid = exports.getApplicativeValidation = exports.getAltValidation = exports.fromPredicate = exports.fromOptionK = exports.fromOption = exports.fromNullableK = exports.fromNullable = exports.foldW = exports.foldMap = exports.fold = exports.flattenW = exports.flatten = exports.flap = exports.filterOrElseW = exports.filterOrElse = exports.extend = exports.exists = void 0;
exports.getValidation = getValidation;
exports.orElseW = exports.orElse = exports.of = exports.matchW = exports.match = exports.mapLeft = exports.map = exports.let = exports.left = exports.isRight = exports.isLeft = exports.getWitherable = exports.getValidationSemigroup = exports.getValidationMonoid = void 0;
exports.parseJSON = parseJSON;
exports.throwError = exports.swap = exports.stringifyJSON = exports.sequenceArray = exports.sequence = exports.right = exports.reduceRight = exports.reduce = void 0;
exports.toError = toError;
exports.tryCatchK = exports.tryCatch = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseArrayWithIndex = exports.traverseArray = exports.traverse = exports.toUnion = void 0;
var _Applicative = require("./Applicative");
var _Apply = require("./Apply");
var _Chain = require("./Chain");
var _ChainRec = require("./ChainRec");
var _FromEither = require("./FromEither");
var _function = require("./function");
var _Functor = require("./Functor");
var _ = _interopRequireWildcard(require("./internal"));
var _Separated = require("./Separated");
var _Witherable = require("./Witherable");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var left = _.left;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.left = left;
var right = _.right;
exports.right = right;
var _map = function (fa, f) {
  return (0, _function.pipe)(fa, map(f));
};
var _ap = function (fab, fa) {
  return (0, _function.pipe)(fab, ap(fa));
};
/* istanbul ignore next */
var _chain = function (ma, f) {
  return (0, _function.pipe)(ma, chain(f));
};
/* istanbul ignore next */
var _reduce = function (fa, b, f) {
  return (0, _function.pipe)(fa, reduce(b, f));
};
/* istanbul ignore next */
var _foldMap = function (M) {
  return function (fa, f) {
    var foldMapM = foldMap(M);
    return (0, _function.pipe)(fa, foldMapM(f));
  };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) {
  return (0, _function.pipe)(fa, reduceRight(b, f));
};
var _traverse = function (F) {
  var traverseF = traverse(F);
  return function (ta, f) {
    return (0, _function.pipe)(ta, traverseF(f));
  };
};
var _bimap = function (fa, f, g) {
  return (0, _function.pipe)(fa, bimap(f, g));
};
var _mapLeft = function (fa, f) {
  return (0, _function.pipe)(fa, mapLeft(f));
};
/* istanbul ignore next */
var _alt = function (fa, that) {
  return (0, _function.pipe)(fa, alt(that));
};
/* istanbul ignore next */
var _extend = function (wa, f) {
  return (0, _function.pipe)(wa, extend(f));
};
var _chainRec = function (a, f) {
  return (0, _ChainRec.tailRec)(f(a), function (e) {
    return isLeft(e) ? right(left(e.left)) : isLeft(e.right) ? left(f(e.right.left)) : right(right(e.right.right));
  });
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
var URI = 'Either';
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = URI;
var getShow = function (SE, SA) {
  return {
    show: function (ma) {
      return isLeft(ma) ? "left(".concat(SE.show(ma.left), ")") : "right(".concat(SA.show(ma.right), ")");
    }
  };
};
/**
 * @category instances
 * @since 2.0.0
 */
exports.getShow = getShow;
var getEq = function (EL, EA) {
  return {
    equals: function (x, y) {
      return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
    }
  };
};
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/Either'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const S = getSemigroup<string, number>(SemigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
exports.getEq = getEq;
var getSemigroup = function (S) {
  return {
    concat: function (x, y) {
      return isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right));
    }
  };
};
/**
 * Builds a `Compactable` instance for `Either` given `Monoid` for the left side.
 *
 * @category filtering
 * @since 2.10.0
 */
exports.getSemigroup = getSemigroup;
var getCompactable = function (M) {
  var empty = left(M.empty);
  return {
    URI: URI,
    _E: undefined,
    compact: function (ma) {
      return isLeft(ma) ? ma : ma.right._tag === 'None' ? empty : right(ma.right.value);
    },
    separate: function (ma) {
      return isLeft(ma) ? (0, _Separated.separated)(ma, ma) : isLeft(ma.right) ? (0, _Separated.separated)(right(ma.right.left), empty) : (0, _Separated.separated)(empty, right(ma.right.right));
    }
  };
};
/**
 * Builds a `Filterable` instance for `Either` given `Monoid` for the left side
 *
 * @category filtering
 * @since 2.10.0
 */
exports.getCompactable = getCompactable;
var getFilterable = function (M) {
  var empty = left(M.empty);
  var _a = getCompactable(M),
    compact = _a.compact,
    separate = _a.separate;
  var filter = function (ma, predicate) {
    return isLeft(ma) ? ma : predicate(ma.right) ? ma : empty;
  };
  var partition = function (ma, p) {
    return isLeft(ma) ? (0, _Separated.separated)(ma, ma) : p(ma.right) ? (0, _Separated.separated)(empty, right(ma.right)) : (0, _Separated.separated)(right(ma.right), empty);
  };
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: function (ma, f) {
      if (isLeft(ma)) {
        return ma;
      }
      var ob = f(ma.right);
      return ob._tag === 'None' ? empty : right(ob.value);
    },
    partition: partition,
    partitionMap: function (ma, f) {
      if (isLeft(ma)) {
        return (0, _Separated.separated)(ma, ma);
      }
      var e = f(ma.right);
      return isLeft(e) ? (0, _Separated.separated)(right(e.left), empty) : (0, _Separated.separated)(empty, right(e.right));
    }
  };
};
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category filtering
 * @since 2.0.0
 */
exports.getFilterable = getFilterable;
var getWitherable = function (M) {
  var F_ = getFilterable(M);
  var C = getCompactable(M);
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    compact: F_.compact,
    separate: F_.separate,
    filter: F_.filter,
    filterMap: F_.filterMap,
    partition: F_.partition,
    partitionMap: F_.partitionMap,
    traverse: _traverse,
    sequence: sequence,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    wither: (0, _Witherable.witherDefault)(Traversable, C),
    wilt: (0, _Witherable.wiltDefault)(Traversable, C)
  };
};
/**
 * The default [`Applicative`](#applicative) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as A from 'fp-ts/Apply'
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 *
 * const parseString = (u: unknown): E.Either<string, string> =>
 *   typeof u === 'string' ? E.right(u) : E.left('not a string')
 *
 * const parseNumber = (u: unknown): E.Either<string, number> =>
 *   typeof u === 'number' ? E.right(u) : E.left('not a number')
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 *
 * const parsePerson = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     E.apS('name', parseString(input.name)),
 *     E.apS('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePerson({}), E.left('not a string')) // <= first error
 *
 * const Applicative = E.getApplicativeValidation(
 *   pipe(string.Semigroup, S.intercalate(', '))
 * )
 *
 * const apS = A.apS(Applicative)
 *
 * const parsePersonAll = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     apS('name', parseString(input.name)),
 *     apS('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePersonAll({}), E.left('not a string, not a number')) // <= all errors
 *
 * @category error handling
 * @since 2.7.0
 */
exports.getWitherable = getWitherable;
var getApplicativeValidation = function (SE) {
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) {
      return isLeft(fab) ? isLeft(fa) ? left(SE.concat(fab.left, fa.left)) : fab : isLeft(fa) ? fa : right(fab.right(fa.right));
    },
    of: of
  };
};
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 *
 * const parseString = (u: unknown): E.Either<string, string> =>
 *   typeof u === 'string' ? E.right(u) : E.left('not a string')
 *
 * const parseNumber = (u: unknown): E.Either<string, number> =>
 *   typeof u === 'number' ? E.right(u) : E.left('not a number')
 *
 * const parse = (u: unknown): E.Either<string, string | number> =>
 *   pipe(
 *     parseString(u),
 *     E.alt<string, string | number>(() => parseNumber(u))
 *   )
 *
 * assert.deepStrictEqual(parse(true), E.left('not a number')) // <= last error
 *
 * const Alt = E.getAltValidation(pipe(string.Semigroup, S.intercalate(', ')))
 *
 * const parseAll = (u: unknown): E.Either<string, string | number> =>
 *   Alt.alt<string | number>(parseString(u), () => parseNumber(u))
 *
 * assert.deepStrictEqual(parseAll(true), E.left('not a string, not a number')) // <= all errors
 *
 * @category error handling
 * @since 2.7.0
 */
exports.getApplicativeValidation = getApplicativeValidation;
var getAltValidation = function (SE) {
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    alt: function (me, that) {
      if (isRight(me)) {
        return me;
      }
      var ea = that();
      return isLeft(ea) ? left(SE.concat(me.left, ea.left)) : ea;
    }
  };
};
/**
 * @category mapping
 * @since 2.0.0
 */
exports.getAltValidation = getAltValidation;
var map = function (f) {
  return function (fa) {
    return isLeft(fa) ? fa : right(f(fa.right));
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.map = map;
var Functor = {
  URI: URI,
  map: _map
};
/**
 * @category constructors
 * @since 2.7.0
 */
exports.Functor = Functor;
var of = right;
/**
 * @category instances
 * @since 2.10.0
 */
exports.of = of;
var Pointed = {
  URI: URI,
  of: of
};
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
exports.Pointed = Pointed;
var apW = function (fa) {
  return function (fab) {
    return isLeft(fab) ? fab : isLeft(fa) ? fa : right(fab.right(fa.right));
  };
};
/**
 * @since 2.0.0
 */
exports.apW = apW;
var ap = apW;
/**
 * @category instances
 * @since 2.10.0
 */
exports.ap = ap;
var Apply = {
  URI: URI,
  map: _map,
  ap: _ap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Apply = Apply;
var Applicative = {
  URI: URI,
  map: _map,
  ap: _ap,
  of: of
};
/**
 * Less strict version of [`chain`](#chain).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * const e1: E.Either<string, number> = E.right(1)
 * const e2: E.Either<number, number> = E.right(2)
 *
 * export const result1 = pipe(
 *   // @ts-expect-error
 *   e1,
 *   E.chain(() => e2)
 * )
 *
 * // merged error types -----v-------------v
 * // const result2: E.Either<string | number, number>
 * export const result2 = pipe(
 *   e1, // no error
 *   E.chainW(() => e2)
 * )
 *
 * @category sequencing
 * @since 2.6.0
 */
exports.Applicative = Applicative;
var chainW = function (f) {
  return function (ma) {
    return isLeft(ma) ? ma : f(ma.right);
  };
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.chainW = chainW;
var chain = chainW;
/**
 * @category instances
 * @since 2.10.0
 */
exports.chain = chain;
var Chain = {
  URI: URI,
  map: _map,
  ap: _ap,
  chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Chain = Chain;
var Monad = {
  URI: URI,
  map: _map,
  ap: _ap,
  of: of,
  chain: _chain
};
/**
 * Left-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'prefix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduce(startWith, concat)),
 *   'prefix:a'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduce(startWith, concat)),
 *   'prefix'
 * )
 *
 * @category folding
 * @since 2.0.0
 */
exports.Monad = Monad;
var reduce = function (b, f) {
  return function (fa) {
    return isLeft(fa) ? b : f(b, fa.right);
  };
};
/**
 * Map each element of the structure to a monoid, and combine the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as S from 'fp-ts/string'
 *
 * const yell = (a: string) => `${a}!`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.foldMap(S.Monoid)(yell)),
 *   'a!'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.foldMap(S.Monoid)(yell)),
 *   S.Monoid.empty
 * )
 *
 * @category folding
 * @since 2.0.0
 */
exports.reduce = reduce;
var foldMap = function (M) {
  return function (f) {
    return function (fa) {
      return isLeft(fa) ? M.empty : f(fa.right);
    };
  };
};
/**
 * Right-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'postfix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduceRight(startWith, concat)),
 *   'a:postfix'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduceRight(startWith, concat)),
 *   'postfix'
 * )
 *
 * @category folding
 * @since 2.0.0
 */
exports.foldMap = foldMap;
var reduceRight = function (b, f) {
  return function (fa) {
    return isLeft(fa) ? b : f(fa.right, b);
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.reduceRight = reduceRight;
var Foldable = {
  URI: URI,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight
};
/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Applicative)(RA.head)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Applicative)(RA.head)),
 *   O.none
 * )
 *
 * @category traversing
 * @since 2.6.3
 */
exports.Foldable = Foldable;
var traverse = function (F) {
  return function (f) {
    return function (ta) {
      return isLeft(ta) ? F.of(left(ta.left)) : F.map(f(ta.right), right);
    };
  };
};
/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.some('a')), E.sequence(O.Applicative)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.none), E.sequence(O.Applicative)),
 *   O.none
 * )
 *
 * @category traversing
 * @since 2.6.3
 */
exports.traverse = traverse;
var sequence = function (F) {
  return function (ma) {
    return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.sequence = sequence;
var Traversable = {
  URI: URI,
  map: _map,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence: sequence
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
exports.Traversable = Traversable;
var bimap = function (f, g) {
  return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : right(g(fa.right));
  };
};
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
exports.bimap = bimap;
var mapLeft = function (f) {
  return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : fa;
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.mapLeft = mapLeft;
var Bifunctor = {
  URI: URI,
  bimap: _bimap,
  mapLeft: _mapLeft
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
exports.Bifunctor = Bifunctor;
var altW = function (that) {
  return function (fa) {
    return isLeft(fa) ? that() : fa;
  };
};
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Either` returns the left-most non-`Left` value (or the right-most `Left` value if both values are `Left`).
 *
 * | x        | y        | pipe(x, alt(() => y) |
 * | -------- | -------- | -------------------- |
 * | left(a)  | left(b)  | left(b)              |
 * | left(a)  | right(2) | right(2)             |
 * | right(1) | left(b)  | right(1)             |
 * | right(1) | right(2) | right(1)             |
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.alt(() => E.left('b'))
 *   ),
 *   E.left('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.alt(() => E.right(2))
 *   ),
 *   E.right(2)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.alt(() => E.left('b'))
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.alt(() => E.right(2))
 *   ),
 *   E.right(1)
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.altW = altW;
var alt = altW;
/**
 * @category instances
 * @since 2.7.0
 */
exports.alt = alt;
var Alt = {
  URI: URI,
  map: _map,
  alt: _alt
};
/**
 * @since 2.0.0
 */
exports.Alt = Alt;
var extend = function (f) {
  return function (wa) {
    return isLeft(wa) ? wa : right(f(wa));
  };
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.extend = extend;
var Extend = {
  URI: URI,
  map: _map,
  extend: _extend
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Extend = Extend;
var ChainRec = {
  URI: URI,
  map: _map,
  ap: _ap,
  chain: _chain,
  chainRec: _chainRec
};
/**
 * @since 2.6.3
 */
exports.ChainRec = ChainRec;
var throwError = left;
/**
 * @category instances
 * @since 2.7.0
 */
exports.throwError = throwError;
var MonadThrow = {
  URI: URI,
  map: _map,
  ap: _ap,
  of: of,
  chain: _chain,
  throwError: throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadThrow = MonadThrow;
var FromEither = {
  URI: URI,
  fromEither: _function.identity
};
/**
 * @example
 * import { fromPredicate, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('error')
 * )
 *
 * @category lifting
 * @since 2.0.0
 */
exports.FromEither = FromEither;
var fromPredicate = /*#__PURE__*/(0, _FromEither.fromPredicate)(FromEither);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption(() => 'error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption(() => 'error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
exports.fromPredicate = fromPredicate;
var fromOption = /*#__PURE__*/(0, _FromEither.fromOption)(FromEither);
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
exports.fromOption = fromOption;
var isLeft = _.isLeft;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isLeft = isLeft;
var isRight = _.isRight;
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.isRight = isRight;
var matchW = function (onLeft, onRight) {
  return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
  };
};
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchW = matchW;
var foldW = matchW;
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { match, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     match(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     match(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = foldW;
var match = matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.match = match;
var fold = match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
exports.fold = fold;
var getOrElseW = function (onLeft) {
  return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : ma.right;
  };
};
/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import { getOrElse, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     right(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     left('error'),
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.getOrElseW = getOrElseW;
var getOrElse = getOrElseW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category mapping
 * @since 2.10.0
 */
exports.getOrElse = getOrElse;
var flap = /*#__PURE__*/(0, _Functor.flap)(Functor);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.flap = flap;
var apFirst = /*#__PURE__*/(0, _Apply.apFirst)(Apply);
/**
 * Less strict version of [`apFirst`](#apfirst)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apFirst = apFirst;
var apFirstW = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apFirstW = apFirstW;
var apSecond = /*#__PURE__*/(0, _Apply.apSecond)(Apply);
/**
 * Less strict version of [`apSecond`](#apsecond)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apSecond = apSecond;
var apSecondW = apSecond;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.apSecondW = apSecondW;
var chainFirst = /*#__PURE__*/(0, _Chain.chainFirst)(Chain);
/**
 * Less strict version of [`chainFirst`](#chainfirst)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.8.0
 */
exports.chainFirst = chainFirst;
var chainFirstW = chainFirst;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
exports.chainFirstW = chainFirstW;
var flattenW = /*#__PURE__*/chainW(_function.identity);
/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.flattenW = flattenW;
var flatten = flattenW;
/**
 * @since 2.0.0
 */
exports.flatten = flatten;
var duplicate = /*#__PURE__*/extend(_function.identity);
/**
 * @category lifting
 * @since 2.10.0
 */
exports.duplicate = duplicate;
var fromOptionK = /*#__PURE__*/(0, _FromEither.fromOptionK)(FromEither);
/**
 * @category sequencing
 * @since 2.11.0
 */
exports.fromOptionK = fromOptionK;
var chainOptionK = /*#__PURE__*/(0, _FromEither.chainOptionK)(FromEither, Chain);
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(-1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('a')
 * )
 *
 * @category filtering
 * @since 2.0.0
 */
exports.chainOptionK = chainOptionK;
var filterOrElse = /*#__PURE__*/(0, _FromEither.filterOrElse)(FromEither, Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
exports.filterOrElse = filterOrElse;
var filterOrElseW = filterOrElse;
/**
 * Returns a `Right` if is a `Left` (and vice versa).
 *
 * @since 2.0.0
 */
exports.filterOrElseW = filterOrElseW;
var swap = function (ma) {
  return isLeft(ma) ? right(ma.left) : left(ma.right);
};
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
exports.swap = swap;
var orElseW = function (onLeft) {
  return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : ma;
  };
};
/**
 * Useful for recovering from errors.
 *
 * @category error handling
 * @since 2.0.0
 */
exports.orElseW = orElseW;
var orElse = orElseW;
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @category conversions
 * @since 2.0.0
 */
exports.orElse = orElse;
var fromNullable = function (e) {
  return function (a) {
    return a == null ? left(e) : right(a);
  };
};
/**
 * Constructs a new `Either` from a function that might throw.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<Error, A> =>
 *   E.tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @category interop
 * @since 2.0.0
 */
exports.fromNullable = fromNullable;
var tryCatch = function (f, onThrow) {
  try {
    return right(f());
  } catch (e) {
    return left(onThrow(e));
  }
};
/**
 * Converts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 2.10.0
 */
exports.tryCatch = tryCatch;
var tryCatchK = function (f, onThrow) {
  return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return tryCatch(function () {
      return f.apply(void 0, a);
    }, onThrow);
  };
};
/**
 * @category lifting
 * @since 2.9.0
 */
exports.tryCatchK = tryCatchK;
var fromNullableK = function (e) {
  var from = fromNullable(e);
  return function (f) {
    return (0, _function.flow)(f, from);
  };
};
/**
 * @category sequencing
 * @since 2.9.0
 */
exports.fromNullableK = fromNullableK;
var chainNullableK = function (e) {
  var from = fromNullableK(e);
  return function (f) {
    return chain(from(f));
  };
};
/**
 * @category conversions
 * @since 2.10.0
 */
exports.chainNullableK = chainNullableK;
var toUnion = /*#__PURE__*/foldW(_function.identity, _function.identity);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
exports.toUnion = toUnion;
function toError(e) {
  return e instanceof Error ? e : new Error(String(e));
}
function elem(E) {
  return function (a, ma) {
    if (ma === undefined) {
      var elemE_1 = elem(E);
      return function (ma) {
        return elemE_1(a, ma);
      };
    }
    return isLeft(ma) ? false : E.equals(a, ma.right);
  };
}
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
var exists = function (predicate) {
  return function (ma) {
    return isLeft(ma) ? false : predicate(ma.right);
  };
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.exists = exists;
var Do = /*#__PURE__*/of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.Do = Do;
var bindTo = /*#__PURE__*/(0, _Functor.bindTo)(Functor);
exports.bindTo = bindTo;
var let_ = /*#__PURE__*/(0, _Functor.let)(Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
var bind = /*#__PURE__*/(0, _Chain.bind)(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.bind = bind;
var bindW = bind;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindW = bindW;
var apS = /*#__PURE__*/(0, _Apply.apS)(Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.apS = apS;
var apSW = apS;
/**
 * @since 2.11.0
 */
exports.apSW = apSW;
var ApT = /*#__PURE__*/of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.ApT = ApT;
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
  return function (as) {
    var e = f(0, _.head(as));
    if (isLeft(e)) {
      return e;
    }
    var out = [e.right];
    for (var i = 1; i < as.length; i++) {
      var e_1 = f(i, as[i]);
      if (isLeft(e_1)) {
        return e_1;
      }
      out.push(e_1.right);
    }
    return right(out);
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
var traverseReadonlyArrayWithIndex = function (f) {
  var g = traverseReadonlyNonEmptyArrayWithIndex(f);
  return function (as) {
    return _.isNonEmpty(as) ? g(as) : ApT;
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = traverseArrayWithIndex;
var traverseArray = function (f) {
  return traverseReadonlyArrayWithIndex(function (_, a) {
    return f(a);
  });
};
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArray = traverseArray;
var sequenceArray = /*#__PURE__*/traverseArray(_function.identity);
/**
 * Use [`parse`](./Json.ts.html#parse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.sequenceArray = sequenceArray;
function parseJSON(s, onError) {
  return tryCatch(function () {
    return JSON.parse(s);
  }, onError);
}
/**
 * Use [`stringify`](./Json.ts.html#stringify) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var stringifyJSON = function (u, onError) {
  return tryCatch(function () {
    var s = JSON.stringify(u);
    if (typeof s !== 'string') {
      throw new Error('Converting unsupported structure to JSON');
    }
    return s;
  }, onError);
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `E.Functor` instead of `E.either`
 * (where `E` is from `import E from 'fp-ts/Either'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.stringifyJSON = stringifyJSON;
var either = {
  URI: URI,
  map: _map,
  of: of,
  ap: _ap,
  chain: _chain,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence: sequence,
  bimap: _bimap,
  mapLeft: _mapLeft,
  alt: _alt,
  extend: _extend,
  chainRec: _chainRec,
  throwError: throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.either = either;
var getApplySemigroup = /*#__PURE__*/(0, _Apply.getApplySemigroup)(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = getApplySemigroup;
var getApplyMonoid = /*#__PURE__*/(0, _Applicative.getApplicativeMonoid)(Applicative);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = getApplyMonoid;
var getValidationSemigroup = function (SE, SA) {
  return (0, _Apply.getApplySemigroup)(getApplicativeValidation(SE))(SA);
};
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getValidationSemigroup = getValidationSemigroup;
var getValidationMonoid = function (SE, MA) {
  return (0, _Applicative.getApplicativeMonoid)(getApplicativeValidation(SE))(MA);
};
/**
 * Use [`getApplicativeValidation`](#getapplicativevalidation) and [`getAltValidation`](#getaltvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getValidationMonoid = getValidationMonoid;
function getValidation(SE) {
  var ap = getApplicativeValidation(SE).ap;
  var alt = getAltValidation(SE).alt;
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    of: of,
    chain: _chain,
    bimap: _bimap,
    mapLeft: _mapLeft,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    extend: _extend,
    traverse: _traverse,
    sequence: sequence,
    chainRec: _chainRec,
    throwError: throwError,
    ap: ap,
    alt: alt
  };
}
},{"./Applicative":"node_modules/fp-ts/es6/Applicative.js","./Apply":"node_modules/fp-ts/es6/Apply.js","./Chain":"node_modules/fp-ts/es6/Chain.js","./ChainRec":"node_modules/fp-ts/es6/ChainRec.js","./FromEither":"node_modules/fp-ts/es6/FromEither.js","./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js","./internal":"node_modules/fp-ts/es6/internal.js","./Separated":"node_modules/fp-ts/es6/Separated.js","./Witherable":"node_modules/fp-ts/es6/Witherable.js"}],"node_modules/fp-ts/es6/EitherT.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alt = alt;
exports.altValidation = altValidation;
exports.ap = ap;
exports.bimap = bimap;
exports.chain = chain;
exports.chainNullableK = chainNullableK;
exports.fromNullable = fromNullable;
exports.fromNullableK = fromNullableK;
exports.getEitherM = getEitherM;
exports.getOrElse = getOrElse;
exports.left = left;
exports.leftF = leftF;
exports.map = map;
exports.mapLeft = mapLeft;
exports.match = match;
exports.matchE = matchE;
exports.orElse = orElse;
exports.orElseFirst = orElseFirst;
exports.orLeft = orLeft;
exports.right = right;
exports.rightF = rightF;
exports.swap = swap;
exports.toUnion = toUnion;
var _Apply = require("./Apply");
var E = _interopRequireWildcard(require("./Either"));
var _function = require("./function");
var _Functor = require("./Functor");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function right(F) {
  return (0, _function.flow)(E.right, F.of);
}
function left(F) {
  return (0, _function.flow)(E.left, F.of);
}
function rightF(F) {
  return function (fa) {
    return F.map(fa, E.right);
  };
}
function leftF(F) {
  return function (fe) {
    return F.map(fe, E.left);
  };
}
function fromNullable(F) {
  return function (e) {
    return (0, _function.flow)(E.fromNullable(e), F.of);
  };
}
function fromNullableK(F) {
  var fromNullableF = fromNullable(F);
  return function (e) {
    var fromNullableFE = fromNullableF(e);
    return function (f) {
      return (0, _function.flow)(f, fromNullableFE);
    };
  };
}
function chainNullableK(M) {
  var chainM = chain(M);
  var fromNullableKM = fromNullableK(M);
  return function (e) {
    var fromNullableKMe = fromNullableKM(e);
    return function (f) {
      return chainM(fromNullableKMe(f));
    };
  };
}
function map(F) {
  return (0, _Functor.map)(F, E.Functor);
}
function ap(F) {
  return (0, _Apply.ap)(F, E.Apply);
}
function chain(M) {
  return function (f) {
    return function (ma) {
      return M.chain(ma, function (e) {
        return E.isLeft(e) ? M.of(e) : f(e.right);
      });
    };
  };
}
function alt(M) {
  return function (second) {
    return function (first) {
      return M.chain(first, function (e) {
        return E.isLeft(e) ? second() : M.of(e);
      });
    };
  };
}
function bimap(F) {
  return function (f, g) {
    return function (fea) {
      return F.map(fea, E.bimap(f, g));
    };
  };
}
function mapLeft(F) {
  return function (f) {
    return function (fea) {
      return F.map(fea, E.mapLeft(f));
    };
  };
}
function altValidation(M, S) {
  return function (second) {
    return function (first) {
      return M.chain(first, E.match(function (e1) {
        return M.map(second(), E.mapLeft(function (e2) {
          return S.concat(e1, e2);
        }));
      }, right(M)));
    };
  };
}
function match(F) {
  return function (onLeft, onRight) {
    return function (ma) {
      return F.map(ma, E.match(onLeft, onRight));
    };
  };
}
function matchE(M) {
  return function (onLeft, onRight) {
    return function (ma) {
      return M.chain(ma, E.match(onLeft, onRight));
    };
  };
}
function getOrElse(M) {
  return function (onLeft) {
    return function (ma) {
      return M.chain(ma, E.match(onLeft, M.of));
    };
  };
}
function orElse(M) {
  return function (onLeft) {
    return function (ma) {
      return M.chain(ma, function (e) {
        return E.isLeft(e) ? onLeft(e.left) : M.of(e);
      });
    };
  };
}
function orElseFirst(M) {
  var orElseM = orElse(M);
  return function (onLeft) {
    return orElseM(function (e) {
      return M.map(onLeft(e), function (eb) {
        return E.isLeft(eb) ? eb : E.left(e);
      });
    });
  };
}
function orLeft(M) {
  return function (onLeft) {
    return function (ma) {
      return M.chain(ma, E.match(function (e) {
        return M.map(onLeft(e), E.left);
      }, function (a) {
        return M.of(E.right(a));
      }));
    };
  };
}
function swap(F) {
  return function (ma) {
    return F.map(ma, E.swap);
  };
}
function toUnion(F) {
  return function (fa) {
    return F.map(fa, E.toUnion);
  };
}
/** @deprecated  */
/* istanbul ignore next */
function getEitherM(M) {
  var _ap = ap(M);
  var _map = map(M);
  var _chain = chain(M);
  var _alt = alt(M);
  var _bimap = bimap(M);
  var _mapLeft = mapLeft(M);
  var _fold = matchE(M);
  var _getOrElse = getOrElse(M);
  var _orElse = orElse(M);
  return {
    map: function (fa, f) {
      return (0, _function.pipe)(fa, _map(f));
    },
    ap: function (fab, fa) {
      return (0, _function.pipe)(fab, _ap(fa));
    },
    of: right(M),
    chain: function (ma, f) {
      return (0, _function.pipe)(ma, _chain(f));
    },
    alt: function (fa, that) {
      return (0, _function.pipe)(fa, _alt(that));
    },
    bimap: function (fea, f, g) {
      return (0, _function.pipe)(fea, _bimap(f, g));
    },
    mapLeft: function (fea, f) {
      return (0, _function.pipe)(fea, _mapLeft(f));
    },
    fold: function (fa, onLeft, onRight) {
      return (0, _function.pipe)(fa, _fold(onLeft, onRight));
    },
    getOrElse: function (fa, onLeft) {
      return (0, _function.pipe)(fa, _getOrElse(onLeft));
    },
    orElse: function (fa, f) {
      return (0, _function.pipe)(fa, _orElse(f));
    },
    swap: swap(M),
    rightM: rightF(M),
    leftM: leftF(M),
    left: left(M)
  };
}
},{"./Apply":"node_modules/fp-ts/es6/Apply.js","./Either":"node_modules/fp-ts/es6/Either.js","./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js"}],"node_modules/fp-ts/es6/Filterable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = filter;
exports.filterMap = filterMap;
exports.getFilterableComposition = getFilterableComposition;
exports.partition = partition;
exports.partitionMap = partitionMap;
var _Compactable = require("./Compactable");
var _function = require("./function");
var _Functor = require("./Functor");
var _Option = require("./Option");
var _Predicate = require("./Predicate");
var _Separated = require("./Separated");
/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */

function filter(F, G) {
  return function (predicate) {
    return function (fga) {
      return F.map(fga, function (ga) {
        return G.filter(ga, predicate);
      });
    };
  };
}
function filterMap(F, G) {
  return function (f) {
    return function (fga) {
      return F.map(fga, function (ga) {
        return G.filterMap(ga, f);
      });
    };
  };
}
function partition(F, G) {
  var _filter = filter(F, G);
  return function (predicate) {
    var left = _filter((0, _Predicate.not)(predicate));
    var right = _filter(predicate);
    return function (fgb) {
      return (0, _Separated.separated)(left(fgb), right(fgb));
    };
  };
}
function partitionMap(F, G) {
  var _filterMap = filterMap(F, G);
  return function (f) {
    return function (fga) {
      return (0, _Separated.separated)((0, _function.pipe)(fga, _filterMap(function (a) {
        return (0, _Option.getLeft)(f(a));
      })), (0, _function.pipe)(fga, _filterMap(function (a) {
        return (0, _Option.getRight)(f(a));
      })));
    };
  };
}
/** @deprecated */
function getFilterableComposition(F, G) {
  var map = (0, _Functor.getFunctorComposition)(F, G).map;
  var _compact = (0, _Compactable.compact)(F, G);
  var _separate = (0, _Compactable.separate)(F, G, G);
  var _filter = filter(F, G);
  var _filterMap = filterMap(F, G);
  var _partition = partition(F, G);
  var _partitionMap = partitionMap(F, G);
  return {
    map: map,
    compact: _compact,
    separate: _separate,
    filter: function (fga, f) {
      return (0, _function.pipe)(fga, _filter(f));
    },
    filterMap: function (fga, f) {
      return (0, _function.pipe)(fga, _filterMap(f));
    },
    partition: function (fga, p) {
      return (0, _function.pipe)(fga, _partition(p));
    },
    partitionMap: function (fga, f) {
      return (0, _function.pipe)(fga, _partitionMap(f));
    }
  };
}
},{"./Compactable":"node_modules/fp-ts/es6/Compactable.js","./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js","./Option":"node_modules/fp-ts/es6/Option.js","./Predicate":"node_modules/fp-ts/es6/Predicate.js","./Separated":"node_modules/fp-ts/es6/Separated.js"}],"node_modules/fp-ts/es6/FromIO.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chainFirstIOK = chainFirstIOK;
exports.chainIOK = chainIOK;
exports.fromIOK = fromIOK;
var _Chain = require("./Chain");
var _function = require("./function");
/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */

function fromIOK(F) {
  return function (f) {
    return (0, _function.flow)(f, F.fromIO);
  };
}
function chainIOK(F, M) {
  return function (f) {
    var g = (0, _function.flow)(f, F.fromIO);
    return function (first) {
      return M.chain(first, g);
    };
  };
}
function chainFirstIOK(F, M) {
  var chainFirstM = (0, _Chain.chainFirst)(M);
  return function (f) {
    return chainFirstM((0, _function.flow)(f, F.fromIO));
  };
}
},{"./Chain":"node_modules/fp-ts/es6/Chain.js","./function":"node_modules/fp-ts/es6/function.js"}],"node_modules/fp-ts/es6/FromTask.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chainFirstTaskK = chainFirstTaskK;
exports.chainTaskK = chainTaskK;
exports.fromTaskK = fromTaskK;
var _Chain = require("./Chain");
var _function = require("./function");
/**
 * Lift a computation from the `Task` monad
 *
 * @since 2.10.0
 */

function fromTaskK(F) {
  return function (f) {
    return (0, _function.flow)(f, F.fromTask);
  };
}
function chainTaskK(F, M) {
  return function (f) {
    var g = (0, _function.flow)(f, F.fromTask);
    return function (first) {
      return M.chain(first, g);
    };
  };
}
function chainFirstTaskK(F, M) {
  var chainFirstM = (0, _Chain.chainFirst)(M);
  return function (f) {
    return chainFirstM((0, _function.flow)(f, F.fromTask));
  };
}
},{"./Chain":"node_modules/fp-ts/es6/Chain.js","./function":"node_modules/fp-ts/es6/function.js"}],"node_modules/fp-ts/es6/Task.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chainIOK = exports.chainFirstIOK = exports.chainFirst = exports.chain = exports.bindTo = exports.bind = exports.apSecond = exports.apS = exports.apFirst = exports.ap = exports.URI = exports.Pointed = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Functor = exports.FromTask = exports.FromIO = exports.Do = exports.Chain = exports.ApplySeq = exports.ApplyPar = exports.ApplicativeSeq = exports.ApplicativePar = exports.ApT = void 0;
exports.delay = delay;
exports.getMonoid = exports.fromTask = exports.fromIOK = exports.fromIO = exports.flatten = exports.flap = void 0;
exports.getRaceMonoid = getRaceMonoid;
exports.traverseSeqArrayWithIndex = exports.traverseSeqArray = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseArrayWithIndex = exports.traverseArray = exports.taskSeq = exports.task = exports.sequenceSeqArray = exports.sequenceArray = exports.of = exports.never = exports.map = exports.let = exports.getSemigroup = void 0;
var _Applicative = require("./Applicative");
var _Apply = require("./Apply");
var _Chain = require("./Chain");
var _FromIO = require("./FromIO");
var _function = require("./function");
var _Functor = require("./Functor");
var _ = _interopRequireWildcard(require("./internal"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * ```ts
 * interface Task<A> {
 *   (): Promise<A>
 * }
 * ```
 *
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see `TaskEither`.
 *
 * @since 2.0.0
 */

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
var fromIO = function (ma) {
  return function () {
    return Promise.resolve().then(ma);
  };
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Creates a task that will complete after a time delay
 *
 * @example
 * import { sequenceT } from 'fp-ts/Apply'
 * import * as T from 'fp-ts/Task'
 * import { takeRight } from 'fp-ts/Array'
 *
 * async function test() {
 *   const log: Array<string> = []
 *   const append = (message: string): T.Task<void> =>
 *     T.fromIO(() => {
 *       log.push(message)
 *     })
 *   const fa = append('a')
 *   const fb = T.delay(20)(append('b'))
 *   const fc = T.delay(10)(append('c'))
 *   const fd = append('d')
 *   await sequenceT(T.ApplyPar)(fa, fb, fc, fd)()
 *   assert.deepStrictEqual(takeRight(2)(log), ['c', 'b'])
 * }
 *
 * test()
 *
 * @since 2.0.0
 */
exports.fromIO = fromIO;
function delay(millis) {
  return function (ma) {
    return function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          Promise.resolve().then(ma).then(resolve);
        }, millis);
      });
    };
  };
}
var _map = function (fa, f) {
  return (0, _function.pipe)(fa, map(f));
};
var _apPar = function (fab, fa) {
  return (0, _function.pipe)(fab, ap(fa));
};
var _apSeq = function (fab, fa) {
  return (0, _function.pipe)(fab, chain(function (f) {
    return (0, _function.pipe)(fa, map(f));
  }));
};
var _chain = function (ma, f) {
  return (0, _function.pipe)(ma, chain(f));
};
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) {
  return function (fa) {
    return function () {
      return Promise.resolve().then(fa).then(f);
    };
  };
};
/**
 * @since 2.0.0
 */
exports.map = map;
var ap = function (fa) {
  return function (fab) {
    return function () {
      return Promise.all([Promise.resolve().then(fab), Promise.resolve().then(fa)]).then(function (_a) {
        var f = _a[0],
          a = _a[1];
        return f(a);
      });
    };
  };
};
/**
 * @category constructors
 * @since 2.0.0
 */
exports.ap = ap;
var of = function (a) {
  return function () {
    return Promise.resolve(a);
  };
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.of = of;
var chain = function (f) {
  return function (ma) {
    return function () {
      return Promise.resolve().then(ma).then(function (a) {
        return f(a)();
      });
    };
  };
};
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.chain = chain;
var flatten = /*#__PURE__*/chain(_function.identity);
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.flatten = flatten;
var URI = 'Task';
/**
 * Monoid returning the first completed task.
 *
 * Note: uses `Promise.race` internally.
 *
 * @example
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const S = T.getRaceMonoid<string>()
 *   const fa = T.delay(20)(T.of('a'))
 *   const fb = T.delay(10)(T.of('b'))
 *   assert.deepStrictEqual(await S.concat(fa, fb)(), 'b')
 * }
 *
 * test()
 *
 * @category instances
 * @since 2.0.0
 */
exports.URI = URI;
function getRaceMonoid() {
  return {
    concat: function (x, y) {
      return function () {
        return Promise.race([Promise.resolve().then(x), Promise.resolve().then(y)]);
      };
    },
    empty: never
  };
}
/**
 * @category instances
 * @since 2.7.0
 */
var Functor = {
  URI: URI,
  map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
exports.Functor = Functor;
var flap = /*#__PURE__*/(0, _Functor.flap)(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.flap = flap;
var Pointed = {
  URI: URI,
  of: of
};
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = Pointed;
var ApplyPar = {
  URI: URI,
  map: _map,
  ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.ApplyPar = ApplyPar;
var apFirst = /*#__PURE__*/(0, _Apply.apFirst)(ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apFirst = apFirst;
var apSecond = /*#__PURE__*/(0, _Apply.apSecond)(ApplyPar);
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
exports.apSecond = apSecond;
var ApplicativePar = {
  URI: URI,
  map: _map,
  ap: _apPar,
  of: of
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplicativePar = ApplicativePar;
var ApplySeq = {
  URI: URI,
  map: _map,
  ap: _apSeq
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplySeq = ApplySeq;
var ApplicativeSeq = {
  URI: URI,
  map: _map,
  ap: _apSeq,
  of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplicativeSeq = ApplicativeSeq;
var Chain = {
  URI: URI,
  map: _map,
  ap: _apPar,
  chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = Chain;
var Monad = {
  URI: URI,
  map: _map,
  of: of,
  ap: _apPar,
  chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = Monad;
var MonadIO = {
  URI: URI,
  map: _map,
  of: of,
  ap: _apPar,
  chain: _chain,
  fromIO: fromIO
};
/**
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
exports.MonadIO = MonadIO;
var fromTask = _function.identity;
/**
 * @category instances
 * @since 2.10.0
 */
exports.fromTask = fromTask;
var MonadTask = {
  URI: URI,
  map: _map,
  of: of,
  ap: _apPar,
  chain: _chain,
  fromIO: fromIO,
  fromTask: fromTask
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.MonadTask = MonadTask;
var chainFirst = /*#__PURE__*/(0, _Chain.chainFirst)(Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.chainFirst = chainFirst;
var FromIO = {
  URI: URI,
  fromIO: fromIO
};
/**
 * @category lifting
 * @since 2.4.0
 */
exports.FromIO = FromIO;
var fromIOK = /*#__PURE__*/(0, _FromIO.fromIOK)(FromIO);
/**
 * @category sequencing
 * @since 2.4.0
 */
exports.fromIOK = fromIOK;
var chainIOK = /*#__PURE__*/(0, _FromIO.chainIOK)(FromIO, Chain);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.chainIOK = chainIOK;
var chainFirstIOK = /*#__PURE__*/(0, _FromIO.chainFirstIOK)(FromIO, Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.chainFirstIOK = chainFirstIOK;
var FromTask = {
  URI: URI,
  fromIO: fromIO,
  fromTask: fromTask
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * A `Task` that never completes.
 *
 * @since 2.0.0
 */
exports.FromTask = FromTask;
var never = function () {
  return new Promise(function (_) {
    return undefined;
  });
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.never = never;
var Do = /*#__PURE__*/of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.Do = Do;
var bindTo = /*#__PURE__*/(0, _Functor.bindTo)(Functor);
exports.bindTo = bindTo;
var let_ = /*#__PURE__*/(0, _Functor.let)(Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
var bind = /*#__PURE__*/(0, _Chain.bind)(Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = bind;
var apS = /*#__PURE__*/(0, _Apply.apS)(ApplyPar);
/**
 * @since 2.11.0
 */
exports.apS = apS;
var ApT = /*#__PURE__*/of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.ApT = ApT;
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
  return function (as) {
    return function () {
      return Promise.all(as.map(function (a, i) {
        return Promise.resolve().then(function () {
          return f(i, a)();
        });
      }));
    };
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
var traverseReadonlyArrayWithIndex = function (f) {
  var g = traverseReadonlyNonEmptyArrayWithIndex(f);
  return function (as) {
    return _.isNonEmpty(as) ? g(as) : ApT;
  };
};
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
  return function (as) {
    return function () {
      return _.tail(as).reduce(function (acc, a, i) {
        return acc.then(function (bs) {
          return Promise.resolve().then(f(i + 1, a)).then(function (b) {
            bs.push(b);
            return bs;
          });
        });
      }, Promise.resolve().then(f(0, _.head(as))).then(_.singleton));
    };
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
var traverseReadonlyArrayWithIndexSeq = function (f) {
  var g = traverseReadonlyNonEmptyArrayWithIndexSeq(f);
  return function (as) {
    return _.isNonEmpty(as) ? g(as) : ApT;
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = traverseArrayWithIndex;
var traverseArray = function (f) {
  return traverseReadonlyArrayWithIndex(function (_, a) {
    return f(a);
  });
};
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArray = traverseArray;
var sequenceArray = /*#__PURE__*/traverseArray(_function.identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = sequenceArray;
var traverseSeqArrayWithIndex = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = traverseSeqArrayWithIndex;
var traverseSeqArray = function (f) {
  return traverseReadonlyArrayWithIndexSeq(function (_, a) {
    return f(a);
  });
};
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseSeqArray = traverseSeqArray;
var sequenceSeqArray = /*#__PURE__*/traverseSeqArray(_function.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.task`
 * (where `T` is from `import T from 'fp-ts/Task'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.sequenceSeqArray = sequenceSeqArray;
var task = {
  URI: URI,
  map: _map,
  of: of,
  ap: _apPar,
  chain: _chain,
  fromIO: fromIO,
  fromTask: fromTask
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.taskSeq`
 * (where `T` is from `import T from 'fp-ts/Task'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.task = task;
var taskSeq = {
  URI: URI,
  map: _map,
  of: of,
  ap: _apSeq,
  chain: _chain,
  fromIO: fromIO,
  fromTask: fromTask
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskSeq = taskSeq;
var getSemigroup = /*#__PURE__*/(0, _Apply.getApplySemigroup)(ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * Lift a monoid into 'Task', the inner values are concatenated using the provided `Monoid`.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getSemigroup = getSemigroup;
var getMonoid = /*#__PURE__*/(0, _Applicative.getApplicativeMonoid)(ApplicativeSeq);
exports.getMonoid = getMonoid;
},{"./Applicative":"node_modules/fp-ts/es6/Applicative.js","./Apply":"node_modules/fp-ts/es6/Apply.js","./Chain":"node_modules/fp-ts/es6/Chain.js","./FromIO":"node_modules/fp-ts/es6/FromIO.js","./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js","./internal":"node_modules/fp-ts/es6/internal.js"}],"node_modules/fp-ts/es6/TaskEither.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromTaskOptionK = exports.fromTaskOption = exports.fromTaskK = exports.fromTask = exports.fromPredicate = exports.fromOptionK = exports.fromOption = exports.fromNullableK = exports.fromNullable = exports.fromIOK = exports.fromIOEitherK = exports.fromIOEither = exports.fromIO = exports.fromEitherK = exports.fromEither = exports.foldW = exports.fold = exports.flattenW = exports.flatten = exports.flap = exports.filterOrElseW = exports.filterOrElse = exports.chainW = exports.chainTaskOptionKW = exports.chainTaskOptionK = exports.chainTaskK = exports.chainOptionK = exports.chainNullableK = exports.chainIOK = exports.chainIOEitherKW = exports.chainIOEitherK = exports.chainFirstW = exports.chainFirstTaskK = exports.chainFirstIOK = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainFirst = exports.chainEitherKW = exports.chainEitherK = exports.chain = exports.bracketW = exports.bracket = exports.bindW = exports.bindTo = exports.bind = exports.bimap = exports.apW = exports.apSecondW = exports.apSecond = exports.apSW = exports.apS = exports.apFirstW = exports.apFirst = exports.ap = exports.altW = exports.alt = exports.URI = exports.Pointed = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Functor = exports.FromTask = exports.FromIO = exports.FromEither = exports.Do = exports.Chain = exports.Bifunctor = exports.ApplySeq = exports.ApplyPar = exports.ApplicativeSeq = exports.ApplicativePar = exports.ApT = exports.Alt = void 0;
exports.getAltTaskValidation = getAltTaskValidation;
exports.getApplicativeTaskValidation = getApplicativeTaskValidation;
exports.getCompactable = exports.getApplySemigroup = exports.getApplyMonoid = void 0;
exports.getFilterable = getFilterable;
exports.getSemigroup = exports.getOrElseW = exports.getOrElse = void 0;
exports.getTaskValidation = getTaskValidation;
exports.orElseFirstTaskK = exports.orElseFirstIOK = exports.orElseFirst = exports.orElse = exports.of = exports.matchW = exports.matchEW = exports.matchE = exports.match = exports.mapLeft = exports.map = exports.let = exports.leftTask = exports.leftIO = exports.left = void 0;
exports.taskEitherSeq = exports.taskEither = exports.swap = exports.sequenceSeqArray = exports.sequenceArray = exports.rightTask = exports.rightIO = exports.right = exports.orLeft = exports.orElseW = exports.orElseFirstW = void 0;
exports.taskify = taskify;
exports.tryCatchK = exports.tryCatch = exports.traverseSeqArrayWithIndex = exports.traverseSeqArray = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseArrayWithIndex = exports.traverseArray = exports.toUnion = exports.throwError = void 0;
var _Applicative = require("./Applicative");
var _Apply = require("./Apply");
var _Chain = require("./Chain");
var _Compactable = require("./Compactable");
var E = _interopRequireWildcard(require("./Either"));
var ET = _interopRequireWildcard(require("./EitherT"));
var _Filterable = require("./Filterable");
var _FromEither = require("./FromEither");
var _FromIO = require("./FromIO");
var _FromTask = require("./FromTask");
var _function = require("./function");
var _Functor = require("./Functor");
var _ = _interopRequireWildcard(require("./internal"));
var T = _interopRequireWildcard(require("./Task"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var left = /*#__PURE__*/ET.left(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = left;
var right = /*#__PURE__*/ET.right(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = right;
var rightTask = /*#__PURE__*/ET.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightTask = rightTask;
var leftTask = /*#__PURE__*/ET.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftTask = leftTask;
var rightIO = /*#__PURE__*/(0, _function.flow)(T.fromIO, rightTask);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = rightIO;
var leftIO = /*#__PURE__*/(0, _function.flow)(T.fromIO, leftTask);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.7.0
 */
exports.leftIO = leftIO;
var fromIO = rightIO;
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromIO = fromIO;
var fromTask = rightTask;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromTask = fromTask;
var fromEither = T.of;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromEither = fromEither;
var fromIOEither = T.fromIO;
/**
 * @category conversions
 * @since 2.11.0
 */
exports.fromIOEither = fromIOEither;
var fromTaskOption = function (onNone) {
  return T.map(E.fromOption(onNone));
};
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.fromTaskOption = fromTaskOption;
var match = /*#__PURE__*/ET.match(T.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = match;
var matchW = match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchW = matchW;
var matchE = /*#__PURE__*/ET.matchE(T.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.matchE = matchE;
var fold = matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.fold = fold;
var matchEW = matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchEW = matchEW;
var foldW = matchEW;
/**
 * @category error handling
 * @since 2.0.0
 */
exports.foldW = foldW;
var getOrElse = /*#__PURE__*/ET.getOrElse(T.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
exports.getOrElse = getOrElse;
var getOrElseW = getOrElse;
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
exports.getOrElseW = getOrElseW;
var tryCatch = function (f, onRejected) {
  return function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var reason_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2,, 3]);
            return [4 /*yield*/, f().then(_.right)];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            reason_1 = _a.sent();
            return [2 /*return*/, _.left(onRejected(reason_1))];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
};
/**
 * Converts a function returning a `Promise` to one returning a `TaskEither`.
 *
 * @category interop
 * @since 2.5.0
 */
exports.tryCatch = tryCatch;
var tryCatchK = function (f, onRejected) {
  return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return tryCatch(function () {
      return f.apply(void 0, a);
    }, onRejected);
  };
};
/**
 * @category conversions
 * @since 2.10.0
 */
exports.tryCatchK = tryCatchK;
var toUnion = /*#__PURE__*/ET.toUnion(T.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.toUnion = toUnion;
var fromNullable = /*#__PURE__*/ET.fromNullable(T.Pointed);
/**
 * @category lifting
 * @since 2.12.0
 */
exports.fromNullable = fromNullable;
var fromNullableK = /*#__PURE__*/ET.fromNullableK(T.Pointed);
/**
 * @category sequencing
 * @since 2.12.0
 */
exports.fromNullableK = fromNullableK;
var chainNullableK = /*#__PURE__*/ET.chainNullableK(T.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Returns `ma` if is a `Right` or the value returned by `onLeft` otherwise.
 *
 * See also [alt](#alt).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   const errorHandler = TE.orElse((error: string) => TE.right(`recovering from ${error}...`))
 *   assert.deepStrictEqual(await pipe(TE.right('ok'), errorHandler)(), E.right('ok'))
 *   assert.deepStrictEqual(await pipe(TE.left('ko'), errorHandler)(), E.right('recovering from ko...'))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
exports.chainNullableK = chainNullableK;
var orElse = /*#__PURE__*/ET.orElse(T.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
exports.orElse = orElse;
var orElseW = orElse;
/**
 * @category error handling
 * @since 2.11.0
 */
exports.orElseW = orElseW;
var orElseFirst = /*#__PURE__*/ET.orElseFirst(T.Monad);
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category error handling
 * @since 2.11.0
 */
exports.orElseFirst = orElseFirst;
var orElseFirstW = orElseFirst;
/**
 * @category error handling
 * @since 2.12.0
 */
exports.orElseFirstW = orElseFirstW;
var orElseFirstIOK = function (onLeft) {
  return orElseFirst(fromIOK(onLeft));
};
/**
 * @category error handling
 * @since 2.12.0
 */
exports.orElseFirstIOK = orElseFirstIOK;
var orElseFirstTaskK = function (onLeft) {
  return orElseFirst(fromTaskK(onLeft));
};
/**
 * @category error handling
 * @since 2.11.0
 */
exports.orElseFirstTaskK = orElseFirstTaskK;
var orLeft = /*#__PURE__*/ET.orLeft(T.Monad);
/**
 * @since 2.0.0
 */
exports.orLeft = orLeft;
var swap = /*#__PURE__*/ET.swap(T.Functor);
/**
 * @category lifting
 * @since 2.11.0
 */
exports.swap = swap;
var fromTaskOptionK = function (onNone) {
  var from = fromTaskOption(onNone);
  return function (f) {
    return (0, _function.flow)(f, from);
  };
};
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.12.3
 */
exports.fromTaskOptionK = fromTaskOptionK;
var chainTaskOptionKW = function (onNone) {
  return function (f) {
    return function (ma) {
      return (0, _function.pipe)(ma, chain(fromTaskOptionK(onNone)(f)));
    };
  };
};
/**
 * @category sequencing
 * @since 2.11.0
 */
exports.chainTaskOptionKW = chainTaskOptionKW;
var chainTaskOptionK = chainTaskOptionKW;
/**
 * @category lifting
 * @since 2.4.0
 */
exports.chainTaskOptionK = chainTaskOptionK;
var fromIOEitherK = function (f) {
  return (0, _function.flow)(f, fromIOEither);
};
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.6.1
 */
exports.fromIOEitherK = fromIOEitherK;
var chainIOEitherKW = function (f) {
  return chainW(fromIOEitherK(f));
};
/**
 * @category sequencing
 * @since 2.4.0
 */
exports.chainIOEitherKW = chainIOEitherKW;
var chainIOEitherK = chainIOEitherKW;
exports.chainIOEitherK = chainIOEitherK;
var _map = function (fa, f) {
  return (0, _function.pipe)(fa, map(f));
};
var _apPar = function (fab, fa) {
  return (0, _function.pipe)(fab, ap(fa));
};
var _apSeq = function (fab, fa) {
  return (0, _function.pipe)(fab, chain(function (f) {
    return (0, _function.pipe)(fa, map(f));
  }));
};
/* istanbul ignore next */
var _chain = function (ma, f) {
  return (0, _function.pipe)(ma, chain(f));
};
/* istanbul ignore next */
var _bimap = function (fa, f, g) {
  return (0, _function.pipe)(fa, bimap(f, g));
};
/* istanbul ignore next */
var _mapLeft = function (fa, f) {
  return (0, _function.pipe)(fa, mapLeft(f));
};
/* istanbul ignore next */
var _alt = function (fa, that) {
  return (0, _function.pipe)(fa, alt(that));
};
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = /*#__PURE__*/ET.map(T.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
exports.map = map;
var bimap = /*#__PURE__*/ET.bimap(T.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
exports.bimap = bimap;
var mapLeft = /*#__PURE__*/ET.mapLeft(T.Functor);
/**
 * @since 2.0.0
 */
exports.mapLeft = mapLeft;
var ap = /*#__PURE__*/ET.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
exports.ap = ap;
var apW = ap;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.apW = apW;
var chain = /*#__PURE__*/ET.chain(T.Monad);
/**
 * Less strict version of [`chain`](#chain).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.6.0
 */
exports.chain = chain;
var chainW = chain;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
exports.chainW = chainW;
var flattenW = /*#__PURE__*/chainW(_function.identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flattenW = flattenW;
var flatten = flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `TaskEither` returns `fa` if is a `Right` or the value returned by `that` otherwise.
 *
 * See also [orElse](#orelse).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.right(1),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(1)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(2)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.left('b'))
 *     )(),
 *     E.left('b')
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
exports.flatten = flatten;
var alt = /*#__PURE__*/ET.alt(T.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
exports.alt = alt;
var altW = alt;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.altW = altW;
var of = right;
/**
 * @since 2.7.0
 */
exports.of = of;
var throwError = left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.throwError = throwError;
var URI = 'TaskEither';
/**
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 * import * as T from 'fp-ts/Task'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * interface User {
 *   readonly id: string
 *   readonly name: string
 * }
 *
 * const remoteDatabase: ReadonlyArray<User> = [
 *   { id: 'id1', name: 'John' },
 *   { id: 'id2', name: 'Mary' },
 *   { id: 'id3', name: 'Joey' }
 * ]
 *
 * const fetchUser = (id: string): TE.TaskEither<string, User> =>
 *   pipe(
 *     remoteDatabase,
 *     RA.findFirst((user) => user.id === id),
 *     TE.fromOption(() => `${id} not found`)
 *   )
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(TE.ApplicativePar)(fetchUser))(),
 *     E.left('id4 not found') // <= first error
 *   )
 *
 *   const Applicative = TE.getApplicativeTaskValidation(
 *     T.ApplyPar,
 *     pipe(string.Semigroup, S.intercalate(', '))
 *   )
 *
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(Applicative)(fetchUser))(),
 *     E.left('id4 not found, id5 not found') // <= all errors
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.7.0
 */
exports.URI = URI;
function getApplicativeTaskValidation(A, S) {
  var ap = (0, _Apply.ap)(A, E.getApplicativeValidation(S));
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) {
      return (0, _function.pipe)(fab, ap(fa));
    },
    of: of
  };
}
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getAltValidation`](./Either.ts.html#getaltvalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
function getAltTaskValidation(S) {
  var alt = ET.altValidation(T.Monad, S);
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    alt: function (fa, that) {
      return (0, _function.pipe)(fa, alt(that));
    }
  };
}
/**
 * @category filtering
 * @since 2.10.0
 */
var getCompactable = function (M) {
  var C = E.getCompactable(M);
  return {
    URI: URI,
    _E: undefined,
    compact: (0, _Compactable.compact)(T.Functor, C),
    separate: (0, _Compactable.separate)(T.Functor, C, E.Functor)
  };
};
/**
 * @category filtering
 * @since 2.1.0
 */
exports.getCompactable = getCompactable;
function getFilterable(M) {
  var F = E.getFilterable(M);
  var C = getCompactable(M);
  var filter = (0, _Filterable.filter)(T.Functor, F);
  var filterMap = (0, _Filterable.filterMap)(T.Functor, F);
  var partition = (0, _Filterable.partition)(T.Functor, F);
  var partitionMap = (0, _Filterable.partitionMap)(T.Functor, F);
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    compact: C.compact,
    separate: C.separate,
    filter: function (fa, predicate) {
      return (0, _function.pipe)(fa, filter(predicate));
    },
    filterMap: function (fa, f) {
      return (0, _function.pipe)(fa, filterMap(f));
    },
    partition: function (fa, predicate) {
      return (0, _function.pipe)(fa, partition(predicate));
    },
    partitionMap: function (fa, f) {
      return (0, _function.pipe)(fa, partitionMap(f));
    }
  };
}
/**
 * @category instances
 * @since 2.7.0
 */
var Functor = {
  URI: URI,
  map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
exports.Functor = Functor;
var flap = /*#__PURE__*/(0, _Functor.flap)(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.flap = flap;
var Pointed = {
  URI: URI,
  of: of
};
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = Pointed;
var ApplyPar = {
  URI: URI,
  map: _map,
  ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.ApplyPar = ApplyPar;
var apFirst = /*#__PURE__*/(0, _Apply.apFirst)(ApplyPar);
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apFirst = apFirst;
var apFirstW = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apFirstW = apFirstW;
var apSecond = /*#__PURE__*/(0, _Apply.apSecond)(ApplyPar);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apSecond = apSecond;
var apSecondW = apSecond;
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
exports.apSecondW = apSecondW;
var ApplicativePar = {
  URI: URI,
  map: _map,
  ap: _apPar,
  of: of
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplicativePar = ApplicativePar;
var ApplySeq = {
  URI: URI,
  map: _map,
  ap: _apSeq
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplySeq = ApplySeq;
var ApplicativeSeq = {
  URI: URI,
  map: _map,
  ap: _apSeq,
  of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplicativeSeq = ApplicativeSeq;
var Chain = {
  URI: URI,
  map: _map,
  ap: _apPar,
  chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = Chain;
var Monad = {
  URI: URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = Monad;
var MonadIO = {
  URI: URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of: of,
  fromIO: fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = MonadIO;
var MonadTask = {
  URI: URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of: of,
  fromIO: fromIO,
  fromTask: fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = MonadTask;
var MonadThrow = {
  URI: URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of: of,
  throwError: throwError
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.MonadThrow = MonadThrow;
var chainFirst = /*#__PURE__*/(0, _Chain.chainFirst)(Chain);
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.8.0
 */
exports.chainFirst = chainFirst;
var chainFirstW = chainFirst;
/**
 * @category instances
 * @since 2.7.0
 */
exports.chainFirstW = chainFirstW;
var Bifunctor = {
  URI: URI,
  bimap: _bimap,
  mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = Bifunctor;
var Alt = {
  URI: URI,
  map: _map,
  alt: _alt
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Alt = Alt;
var FromEither = {
  URI: URI,
  fromEither: fromEither
};
/**
 * @category conversions
 * @since 2.0.0
 */
exports.FromEither = FromEither;
var fromOption = /*#__PURE__*/(0, _FromEither.fromOption)(FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromOption = fromOption;
var fromOptionK = /*#__PURE__*/(0, _FromEither.fromOptionK)(FromEither);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.fromOptionK = fromOptionK;
var chainOptionK = /*#__PURE__*/(0, _FromEither.chainOptionK)(FromEither, Chain);
/**
 * @category sequencing
 * @since 2.4.0
 */
exports.chainOptionK = chainOptionK;
var chainEitherK = /*#__PURE__*/(0, _FromEither.chainEitherK)(FromEither, Chain);
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.6.1
 */
exports.chainEitherK = chainEitherK;
var chainEitherKW = chainEitherK;
/**
 * @category sequencing
 * @since 2.12.0
 */
exports.chainEitherKW = chainEitherKW;
var chainFirstEitherK = /*#__PURE__*/(0, _FromEither.chainFirstEitherK)(FromEither, Chain);
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.12.0
 */
exports.chainFirstEitherK = chainFirstEitherK;
var chainFirstEitherKW = chainFirstEitherK;
/**
 * @category lifting
 * @since 2.0.0
 */
exports.chainFirstEitherKW = chainFirstEitherKW;
var fromPredicate = /*#__PURE__*/(0, _FromEither.fromPredicate)(FromEither);
/**
 * @category filtering
 * @since 2.0.0
 */
exports.fromPredicate = fromPredicate;
var filterOrElse = /*#__PURE__*/(0, _FromEither.filterOrElse)(FromEither, Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
exports.filterOrElse = filterOrElse;
var filterOrElseW = filterOrElse;
/**
 * @category lifting
 * @since 2.4.0
 */
exports.filterOrElseW = filterOrElseW;
var fromEitherK = /*#__PURE__*/(0, _FromEither.fromEitherK)(FromEither);
/**
 * @category instances
 * @since 2.10.0
 */
exports.fromEitherK = fromEitherK;
var FromIO = {
  URI: URI,
  fromIO: fromIO
};
/**
 * @category lifting
 * @since 2.10.0
 */
exports.FromIO = FromIO;
var fromIOK = /*#__PURE__*/(0, _FromIO.fromIOK)(FromIO);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.fromIOK = fromIOK;
var chainIOK = /*#__PURE__*/(0, _FromIO.chainIOK)(FromIO, Chain);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.chainIOK = chainIOK;
var chainFirstIOK = /*#__PURE__*/(0, _FromIO.chainFirstIOK)(FromIO, Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.chainFirstIOK = chainFirstIOK;
var FromTask = {
  URI: URI,
  fromIO: fromIO,
  fromTask: fromTask
};
/**
 * @category lifting
 * @since 2.10.0
 */
exports.FromTask = FromTask;
var fromTaskK = /*#__PURE__*/(0, _FromTask.fromTaskK)(FromTask);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.fromTaskK = fromTaskK;
var chainTaskK = /*#__PURE__*/(0, _FromTask.chainTaskK)(FromTask, Chain);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.chainTaskK = chainTaskK;
var chainFirstTaskK = /*#__PURE__*/(0, _FromTask.chainFirstTaskK)(FromTask, Chain);
exports.chainFirstTaskK = chainFirstTaskK;
function taskify(f) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return function () {
      return new Promise(function (resolve) {
        var cbResolver = function (e, r) {
          return e != null ? resolve(_.left(e)) : resolve(_.right(r));
        };
        f.apply(null, args.concat(cbResolver));
      });
    };
  };
}
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
var bracket = function (acquire, use, release) {
  return bracketW(acquire, use, release);
};
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.bracket = bracket;
var bracketW = function (acquire, use, release) {
  return (0, _function.pipe)(acquire, chainW(function (a) {
    return (0, _function.pipe)(use(a), T.chain(function (e) {
      return (0, _function.pipe)(release(a, e), chainW(function () {
        return T.of(e);
      }));
    }));
  }));
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.bracketW = bracketW;
var Do = /*#__PURE__*/of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.Do = Do;
var bindTo = /*#__PURE__*/(0, _Functor.bindTo)(Functor);
exports.bindTo = bindTo;
var let_ = /*#__PURE__*/(0, _Functor.let)(Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
var bind = /*#__PURE__*/(0, _Chain.bind)(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.bind = bind;
var bindW = bind;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindW = bindW;
var apS = /*#__PURE__*/(0, _Apply.apS)(ApplyPar);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.apS = apS;
var apSW = apS;
/**
 * @since 2.11.0
 */
exports.apSW = apSW;
var ApT = /*#__PURE__*/of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.ApT = ApT;
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
  return (0, _function.flow)(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(E.traverseReadonlyNonEmptyArrayWithIndex(_function.SK)));
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
var traverseReadonlyArrayWithIndex = function (f) {
  var g = traverseReadonlyNonEmptyArrayWithIndex(f);
  return function (as) {
    return _.isNonEmpty(as) ? g(as) : ApT;
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
  return function (as) {
    return function () {
      return _.tail(as).reduce(function (acc, a, i) {
        return acc.then(function (ebs) {
          return _.isLeft(ebs) ? acc : f(i + 1, a)().then(function (eb) {
            if (_.isLeft(eb)) {
              return eb;
            }
            ebs.right.push(eb.right);
            return ebs;
          });
        });
      }, f(0, _.head(as))().then(E.map(_.singleton)));
    };
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
var traverseReadonlyArrayWithIndexSeq = function (f) {
  var g = traverseReadonlyNonEmptyArrayWithIndexSeq(f);
  return function (as) {
    return _.isNonEmpty(as) ? g(as) : ApT;
  };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = traverseArrayWithIndex;
var traverseArray = function (f) {
  return traverseReadonlyArrayWithIndex(function (_, a) {
    return f(a);
  });
};
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArray = traverseArray;
var sequenceArray = /*#__PURE__*/traverseArray(_function.identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = sequenceArray;
var traverseSeqArrayWithIndex = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = traverseSeqArrayWithIndex;
var traverseSeqArray = function (f) {
  return traverseReadonlyArrayWithIndexSeq(function (_, a) {
    return f(a);
  });
};
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseSeqArray = traverseSeqArray;
var sequenceSeqArray = /*#__PURE__*/traverseSeqArray(_function.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEither`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.sequenceSeqArray = sequenceSeqArray;
var taskEither = {
  URI: URI,
  bimap: _bimap,
  mapLeft: _mapLeft,
  map: _map,
  of: of,
  ap: _apPar,
  chain: _chain,
  alt: _alt,
  fromIO: fromIO,
  fromTask: fromTask,
  throwError: throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEitherSeq`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskEither = taskEither;
var taskEitherSeq = {
  URI: URI,
  bimap: _bimap,
  mapLeft: _mapLeft,
  map: _map,
  of: of,
  ap: _apSeq,
  chain: _chain,
  alt: _alt,
  fromIO: fromIO,
  fromTask: fromTask,
  throwError: throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskEitherSeq = taskEitherSeq;
var getApplySemigroup = /*#__PURE__*/(0, _Apply.getApplySemigroup)(ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = getApplySemigroup;
var getApplyMonoid = /*#__PURE__*/(0, _Applicative.getApplicativeMonoid)(ApplicativeSeq);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = getApplyMonoid;
var getSemigroup = function (S) {
  return (0, _Apply.getApplySemigroup)(T.ApplySeq)(E.getSemigroup(S));
};
/**
 * Use [`getApplicativeTaskValidation`](#getapplicativetaskvalidation) and [`getAltTaskValidation`](#getalttaskvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getSemigroup = getSemigroup;
function getTaskValidation(SE) {
  var applicativeTaskValidation = getApplicativeTaskValidation(T.ApplicativePar, SE);
  var altTaskValidation = getAltTaskValidation(SE);
  return {
    URI: URI,
    _E: undefined,
    map: _map,
    ap: applicativeTaskValidation.ap,
    of: of,
    chain: _chain,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: altTaskValidation.alt,
    fromIO: fromIO,
    fromTask: fromTask,
    throwError: throwError
  };
}
},{"./Applicative":"node_modules/fp-ts/es6/Applicative.js","./Apply":"node_modules/fp-ts/es6/Apply.js","./Chain":"node_modules/fp-ts/es6/Chain.js","./Compactable":"node_modules/fp-ts/es6/Compactable.js","./Either":"node_modules/fp-ts/es6/Either.js","./EitherT":"node_modules/fp-ts/es6/EitherT.js","./Filterable":"node_modules/fp-ts/es6/Filterable.js","./FromEither":"node_modules/fp-ts/es6/FromEither.js","./FromIO":"node_modules/fp-ts/es6/FromIO.js","./FromTask":"node_modules/fp-ts/es6/FromTask.js","./function":"node_modules/fp-ts/es6/function.js","./Functor":"node_modules/fp-ts/es6/Functor.js","./internal":"node_modules/fp-ts/es6/internal.js","./Task":"node_modules/fp-ts/es6/Task.js"}],"src/HttpConnectionError.ts":[function(require,module,exports) {
"use strict";

// Please read explanation in SqlError.ts if you are not familiar with
// this trick to create a nominal type in typescript.
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHttpConnectionError = exports.httpConnectionError = void 0;
var httpConnectionErrorTag = Symbol();
var httpConnectionError = function httpConnectionError(status, reason) {
  return {
    _tag: httpConnectionErrorTag,
    status: status,
    reason: reason
  };
};
exports.httpConnectionError = httpConnectionError;
var isHttpConnectionError = function isHttpConnectionError(error) {
  return error._tag === httpConnectionErrorTag;
};
exports.isHttpConnectionError = isHttpConnectionError;
},{}],"src/SqlError.ts":[function(require,module,exports) {
"use strict";

// Here we use a trick to make nominal types in typescript.
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSqlError = exports.sqlError = void 0;
// As a Symbol is unique in js, and because we don't export it, the
// only way to get a SqlError value is to use the constructor in this module.
// In turn, we can build an Either<NotAnSqlError, SqlError> parser.
// And we can also build a "type guard", which helps when we map the union of
// error types downstream to an HttpResponse, a Loggable message, etc.
var sqlErrorTag = Symbol();
var sqlError = function sqlError(errorCode, reason) {
  return {
    _tag: sqlErrorTag,
    errorCode: errorCode,
    reason: reason
  };
};
exports.sqlError = sqlError;
// The following is the "Type Guard"
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
var isSqlError = function isSqlError(error) {
  return error._tag === sqlErrorTag;
};
exports.isSqlError = isSqlError;
},{}],"src/PostgresConfig.ts":[function(require,module,exports) {
"use strict";

// Please read explanation in SqlError.ts if you are not familiar with
// this trick to create a nominal type in typescript.
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPostgresConfig = exports.postgresConfig = void 0;
var postgresConfigTag = Symbol();
var postgresConfig = function postgresConfig(url) {
  return {
    _tag: postgresConfigTag,
    url: url
  };
};
exports.postgresConfig = postgresConfig;
var isPostgresConfig = function isPostgresConfig(config) {
  return config._tag === postgresConfigTag;
};
exports.isPostgresConfig = isPostgresConfig;
},{}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greetByTimeOfDay = exports.fetchTimeOfDayForUser = exports.fetchFullDenomination = exports.readDbConfigFromFs = void 0;
var function_1 = require("fp-ts/function");
var TE = __importStar(require("fp-ts/TaskEither"));
var HttpConnectionError_1 = require("./HttpConnectionError");
var SqlError_1 = require("./SqlError");
var PostgresConfig_1 = require("./PostgresConfig");
var readDbConfigFromFs = function readDbConfigFromFs() {
  return TE.right((0, PostgresConfig_1.postgresConfig)(new URL('https://rds.aws.com/abc123')));
};
exports.readDbConfigFromFs = readDbConfigFromFs;
var fetchFullDenomination = function fetchFullDenomination(dbConfig, userId) {
  return TE.left((0, HttpConnectionError_1.httpConnectionError)(400, "Irrelevant, I'm just forcing an error"));
};
exports.fetchFullDenomination = fetchFullDenomination;
var fetchTimeOfDayForUser = function fetchTimeOfDayForUser(dbConfig, userId) {
  return TE.left((0, SqlError_1.sqlError)(3029, "Irrelevant, I'm just forcing an error"));
};
exports.fetchTimeOfDayForUser = fetchTimeOfDayForUser;
var greetByTimeOfDay = function greetByTimeOfDay(userId) {
  return (0, function_1.pipe)(TE.Do, TE.bind('dbConfig', function () {
    return (0, exports.readDbConfigFromFs)();
  }), TE.bindW('fullDenomination', function (_ref) {
    var dbConfig = _ref.dbConfig;
    return (0, exports.fetchFullDenomination)(dbConfig, userId);
  }), TE.bindW('timeOfDayForUser', function (_ref2) {
    var dbConfig = _ref2.dbConfig;
    return (0, exports.fetchTimeOfDayForUser)(dbConfig, userId);
  }), TE.map(function (_ref3) {
    var fullDenomination = _ref3.fullDenomination,
      timeOfDayForUser = _ref3.timeOfDayForUser;
    return "Good ".concat(timeOfDayForUser, ", ").concat(fullDenomination);
  }));
};
exports.greetByTimeOfDay = greetByTimeOfDay;
(0, function_1.pipe)(TE.Do, TE.bind('userId', function () {
  return TE.of('af8c4600-46a8-4b80-a4d3-9583b4f1085b');
}), TE.bindW('greeting', function (_ref4) {
  var userId = _ref4.userId;
  return (0, exports.greetByTimeOfDay)(userId);
}), TE.match(function (error) {
  return console.error('Oops something went wrong: ' + JSON.stringify(error));
}, function (_ref5) {
  var greeting = _ref5.greeting;
  return console.log(greeting);
}))();
},{"fp-ts/function":"node_modules/fp-ts/es6/function.js","fp-ts/TaskEither":"node_modules/fp-ts/es6/TaskEither.js","./HttpConnectionError":"src/HttpConnectionError.ts","./SqlError":"src/SqlError.ts","./PostgresConfig":"src/PostgresConfig.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34403" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map