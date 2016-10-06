import {index as fn} from './sample/test/index'

console.log('Test started');
process.nextTick(()=>{
    fn({
        done: function() {
            console.log('Done');
        },
        log: function(msg: any) {
            console.log(msg);
        }
    }, {
        originalUrl: 'woof woof'
    });
});