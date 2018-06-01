var fs = Npm.require('fs');
var base = process.env.PWD;

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