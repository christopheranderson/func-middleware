
export interface FunctionHandler {
    (context: any, ...inputs: any[]): any;
}

interface FunctionHandlerBag {
    fn: FunctionHandler,
    error: Boolean
}

export class FunctionMiddlewareHandler {
    private stack: FunctionHandlerBag[] = [];

    constructor() {

    }

    public use(fn: FunctionHandler, isErrorHandler?: Boolean): this {
        this.stack.push({fn: fn, error: isErrorHandler})
        return this;
    }

    public listen(): Function {
        return (context: any, ...inputs: any[]) => {
            return this.handle(context, ...inputs);    
        };
    }

    private handle(context: any, ...inputs: any[]) {
        let index: number = 0;
        let stack: FunctionHandlerBag[] = this.stack;

        let ctx = context;
        let ins = inputs;

        // 
        let origDone = context.done
        let isDone = false;
        let done = (...args: any[]) => {
            if (isDone) return;
            isDone = true;
            origDone(...args);
        }
        ctx.done = done;

        function next(err?: Error): any {
            var layer = stack[index++];
            var error = err;
            ctx.next = next;

            // return if no new layer
            if (!layer) {
                done(error);
                return;
            }

            // return on error
            if (error && layer.error) {
                return layer.fn(error, ctx, ...ins);
            } else if(error) {
                return next(error);
            }

            // try next layer, return
            try {
                return layer.fn(ctx, ...ins);
            } catch (e) {
                error = e;
            }

            // return any errors we have
            return next(error);
        }
        return next();
    }
}