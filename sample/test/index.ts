import {FunctionMiddlewareHandler} from '../../lib/func-middleware';

var handler = new FunctionMiddlewareHandler();

handler.use(function(context) {
    context.log('Hello world');
    context.next();
})

handler
.use(function(context) {
    context.log('1');
    context.next();
})
.use(function(context, req) {
    throw new Error("I'm an error");
})
.use(function(context) {
    context.log("I won't be called");
})
.use(function(err, context) {
    context.log(err);
    context.done();
}, true)

let index = handler.listen();
export {index}
