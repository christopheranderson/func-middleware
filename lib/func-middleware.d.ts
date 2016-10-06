export interface FunctionHandler {
    (context: any, ...inputs: any[]): any;
}
export declare class FunctionMiddlewareHandler {
    private stack;
    constructor();
    use(fn: FunctionHandler, isErrorHandler?: Boolean): this;
    listen(): (context: any, ...inputs: any[]) => any;
    private handle(context, ...inputs);
}
