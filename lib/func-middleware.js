"use strict";
var FunctionMiddlewareHandler = (function () {
    function FunctionMiddlewareHandler() {
        this.stack = [];
    }
    FunctionMiddlewareHandler.prototype.use = function (fn, isErrorHandler) {
        this.stack.push({ fn: fn, error: isErrorHandler });
        return this;
    };
    FunctionMiddlewareHandler.prototype.listen = function () {
        var _this = this;
        return function (context) {
            var inputs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                inputs[_i - 1] = arguments[_i];
            }
            return _this.handle.apply(_this, [context].concat(inputs));
        };
    };
    FunctionMiddlewareHandler.prototype.handle = function (context) {
        var inputs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            inputs[_i - 1] = arguments[_i];
        }
        var index = 0;
        var stack = this.stack;
        var ctx = context;
        var ins = inputs;
        var origDone = context.done;
        var isDone = false;
        var done = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (isDone)
                return;
            isDone = true;
            origDone.apply(void 0, args);
        };
        ctx.done = done;
        function next(err) {
            var layer = stack[index++];
            var error = err;
            ctx.next = next;
            if (!layer) {
                done(error);
                return;
            }
            if (error && layer.error) {
                return layer.fn.apply(layer, [error, ctx].concat(ins));
            }
            else if (error) {
                return next(error);
            }
            try {
                return layer.fn.apply(layer, [ctx].concat(ins));
            }
            catch (e) {
                error = e;
            }
            return next(error);
        }
        return next();
    };
    return FunctionMiddlewareHandler;
}());
exports.FunctionMiddlewareHandler = FunctionMiddlewareHandler;
//# sourceMappingURL=func-middleware.js.map