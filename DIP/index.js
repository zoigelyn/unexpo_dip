const app = require ('./app');
require('dotenv').config({path: __dirname + '/.env'});

console.log(process.env.PORT);
app.set('port', process.env.PORT || 3000);

/*sequelize.sync().then(function() {*/
    app.listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
   /* 
  });*/
  