var fs = Npm.require('fs');

var path = Npm.require('path');
Meteor.rootPath     = path.resolve('.');
Meteor.absolutePath = Meteor.rootPath.split(path.sep + '.meteor')[0];
var base = Meteor.absolutePath;

WebApp.connectHandlers.use(function(req, res, next) {
    var re = /^\/files\/(.*)$/.exec(req.url);
    if (re !== null) {   // Only handle URLs that start with /files/ prefix
        // 
        var filePath = base+"/.static~/" + re[1];
        var data = fs.readFileSync(filePath);
			if(!re[1].includes('resources')){
				  res.writeHead(200, {
					'Content-Type': 'image'
				  });
				}else{
				  res.writeHead(200, {
					'Content-Type': 'binary',
					'Content-Disposition': 'attachment'
				  });
				}
        res.write(data);
        res.end();
    } else {  // Other urls will have default behaviors
        next();
    }
});