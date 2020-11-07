const app = require ('./app');
const port = process.env.PORT || 3000;

app.listen(port, 'localhost');
console.log('server on puerto 3000');
