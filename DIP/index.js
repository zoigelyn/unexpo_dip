const app = require ('./app');
const port = process.env.PORT || 3000;

app.listen(port, 'localhost');
console.log('server on puerto 3000');
/*(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

console.log( process.env.PATH );*/