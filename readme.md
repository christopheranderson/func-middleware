# func-middleware

> :construction: This is an experimental library and has no official support. Use at your own risk. :construction:

A library to make executing middleware and handling errors easier for Node.js based Azure Functions.

```typescript
var handler = new FunctionMiddlewareHandler();

handler.use(function(context) {
    context.log('Hello world');
    context.next();
});

var index = handler.listen();

export {index}
```

This library takes heavy inspiration from the [connect](https://github.com/senchalabs/connect) framework for Node.js HTTP servers.

## Getting started

### Installation

Temporarily made available only through GitHub. I'll put it up on NPM if I want to take the project forward.
```
npm install christopheranderson/func-middleware
```

## API

### FunctionMiddlewareHandler

JavaScript (ES5)
```javascript
var fmh = require('func-middleware').FunctionMiddlewareHandler;
var handler = new fmh();
```

TypeScript
```typescript
import {FunctionMiddlewareHandler as fmh} from 'func-middleware';
let handler = new fmh();
```

Creates a handler which can have middleware added to it and provide listeners to be exported to the Azure Functions runtime.

### fmh.use(middleware: FunctionHandler, isErrorHandler?: Boolean): this

```javascript
handler
.use(function(context, input) {
    // logic here
})
.use(function(context, input) {
    // additional logic here
})
.use(function(err, context, input) {
    // error handling logic here
}, true)
```

`use` takes a Function Handler method or an Error Handler method, if a true boolean value is passed as the second parameter value.

The order which handlers are added to the handler determines the order in which they'll be executed in the runtime. Error handling functions will only be executed if there an error has been thrown or returned to the `context.next` method, described later, at which point normal Function Handler methods will stop being executed.

Example:

Given the following code:
```javascript
handler
.use(function(context, input) {
    // logic here
    context.log("I'm called first...");
})
.use(function(context, input) {
    // additional logic here
    context.log("Then I throw...");
    throw new Error("I'm a big bad error");
})
.use(function(err, context, input) {
    // error handling logic here
    context.log("Then I catch the error...");
    context.log(err);
    context.done(err);
}, true).
use(function(context, input){
    context.log("I'm never called...");
})
```

the following is the results:
```
I'm called first...
Then I throw...
Then I catch the error...
{...stack trace...}
```

Note that the last function is never called because it isn't an error handling function and the second function threw an error.

#### Function Handler - (context, ...inputs): any

A Function Handler is the normal syntax for an Azure Function. Any existing Node.js Functions could be used in this place. Note that you have to use the `context.next` method to trigger the next piece of middleware, which would require changes to any existing code that was used with func-middleware.

#### Error Function Handler - (err, context, ...inputs): any

Same as a normal Function Handler, but the first parameter is instead a context object.

#### context.next(err?: Error)

The `context.next` method triggers the next middleware to start. If an error is passed as a parameter, it will trigger the next Error Function Handler or, if there is none, call context.done with the error passed along.

#### context.done(err?: Error, output: any)

The `context.done` method works the same as normal, but it's been wrapped by the func-middleware library to prevent multiple calls.

### fmh.listen() & exporting

JavaScript
```javascript
module.exports = handler.listen();
```

TypeScript
```typescript
let index = handler.listen();
export {index}
```

Creates a function which can be exported as an Azure Function module.

### License

[MIT](LICENSE)