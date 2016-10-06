"use strict";
var func_middleware_1 = require('../../lib/func-middleware');
var handler = new func_middleware_1.FunctionMiddlewareHandler();
handler.use(function (context) {
    context.log('Hello world');
    context.next();
});
handler
    .use(function (context) {
    context.log('1');
    context.next();
})
    .use(function (context, req) {
    throw new Error("I'm an error");
})
    .use(function (context) {
    context.log("I won't be called");
})
    .use(function (err, context) {
    context.log(err);
    context.done();
}, true);
var index = handler.listen();
exports.index = index;
//# sourceMappingURL=index.js.map