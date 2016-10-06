"use strict";
var index_1 = require('./sample/test/index');
console.log('Test started');
process.nextTick(function () {
    index_1.index({
        done: function () {
            console.log('Done');
        },
        log: function (msg) {
            console.log(msg);
        }
    }, {
        originalUrl: 'woof woof'
    });
});
//# sourceMappingURL=test.js.map