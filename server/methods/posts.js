

var Jimp = require("jimp");
const imagemin = require('imagemin');
var fs = Npm.require('fs');
var dlMap = ''


var path = Npm.require('path');
Meteor.rootPath     = path.resolve('.');
Meteor.absolutePath = Meteor.rootPath.split(path.sep + '.meteor')[0];
var base = Meteor.absolutePath;

var path = base+"/.static~/";



console.log(Meteor.absolutePath)

Meteor.methods({
  createPost:function(title, description, excerpt, tags, url, catagory2, newDat, map, mapName){
	  
    var excerpt = excerpt.substring(0, 300);
    var title = title.substring(0, 300);
    var username = Meteor.user().username

    var daId = Random.id()

    var tags = tags.split(/\s/).reduce(function (previous, word) {
      if (word.charAt(0) === "#") {
        previous.push(word.slice(1));
        word = word.replace(/#/g, "")
        word = '#'+word
      }
      return previous;
    }, []).join(" ");

    tags = tags.split(/\s/);

    var testTags = [];
    for(i = 0; i < tags.length; i++){
      testTags[i] = tags[i].replace(/#/g, "");
      testTags[i] = '#'+testTags[i].toLocaleLowerCase()
    }

    var newDate = new Date()
    newDate = newDate.toString().split(' ')
    function hourConvert(){
      var timeString = newDate[4];
      var H = +timeString.substr(0, 2);
      var h = H % 12 || 12;
      var ampm = (H < 12 || H === 24) ? "AM" : "PM";
      timeString = h + timeString.substr(2, 3) + ampm;
      newDate[4] = timeString
    }
    hourConvert()
    newDate = newDate[1] + ' ' + newDate[2] + ' ' + newDate[3] + ' ' + newDate[4]

    for(var i = 0; i < newDat.length; i++){
      saveImage(newDat[i], i)
    }
    function saveImage(target, number){
      // our data URL string from canvas.toDataUrl();
      var imageDataUrl = target;
      // declare a regexp to match the non base64 first characters
      var dataUrlRegExp = /^data:image\/\w+;base64,/;
      // remove the "header" of the data URL via the regexp
      var base64Data = imageDataUrl.replace(dataUrlRegExp, "");
      // declare a binary buffer to hold decoded base64 data
      var imageBuffer = new Buffer(base64Data, "base64");
	  
	   
	   
      uploadThumb()
      uploadImage()

      function uploadThumb(err){
        try{
          // write the buffer to the path
          fs.writeFile(path+'/thumbs/'+daId+'_'+number+'.png', imageBuffer,
          function (err) {
            if (err) throw err;
            console.log('Done!');
          })}catch(e){console.log(e)}
        }

        function uploadImage(err){
          try{
            // write the buffer to the path
            fs.writeFile(path+'/images/'+daId+'_'+number+'.png', imageBuffer,
            function (err) {
              if (err) throw err;
              console.log('Done!');
            })}catch(e){console.log(e)}
        }

      extension = '.png'
    }
    function uploadMap(map){
      // declare a regexp to match the non base64 first characters
      var dataUrlRegExp = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)\w+;base64,/;
      // remove the "header" of the data URL via the regexp
      var base64Data = map.replace(dataUrlRegExp, "");
      // declare a binary buffer to hold decoded base64 data
      var mapBuffer = new Buffer(base64Data, "base64");

      mapName = mapName.replace(/[^A-Za-z0-9_\.]+/g,"+");
	  dlMap = '/files/resources/'+mapName 
      try{
        // write the buffer to the path
        fs.writeFile(path+'/resources/'+mapName, mapBuffer,
        function (err) {
          if (err) console.log(err);
          console.log('Done!');
        })}catch(e){console.log(e)}
		
    }
    uploadMap(map)

    var thumbnail = '/files/thumbs/'+daId+'_0.png'
    var link = '/files/images/'+daId+'_0.png'

    try{
      getVideo(url, daId)
    }catch(e){}

    posts.insert({_id: daId, username: username, title: title, description:description, link:link, thumbnail: thumbnail, date: new Date(), tagList:testTags, comments: 0, score: 1, excerpt: excerpt, editDate: 'Never', views: 0, newDate: newDate, imgCount: newDat.length, downloads: 0, newScore: 0, gameMode:catagory2, upUsers:[username], downUsers:[],dlMap: dlMap, dlID: mapName })
    userStuff.update({username: Meteor.user().username}, {$push: {createdPosts: daId}})
    catagory.update({name:catagory2}, {$inc:{count: 1}})

    return daId
  }
});

Meteor.methods({
  deletePost:function(id){
    var username = Meteor.user().username

    if(posts.findOne({_id: id}).username == username){
      var gameMode = posts.findOne({_id:id}).gameMode
      catagory.update({name: gameMode}, {$inc: {count: -1}})
      posts.remove({_id: id})
      return 'deleted'
    }else{
      return 'fail'
    }
  }
});

Meteor.methods({
  featured:function(){
    var theFeatured = featured.find({}).map(function(e) { return e._id; })
    var postInfo = [];

    for(var i = 0; i < theFeatured.length; i++){
      var thePost = posts.findOne({_id: theFeatured[i]})
      postInfo[i] = {username: thePost.username, title:thePost.title, excerpt:thePost.excerpt, comments:thePost.comments, _id:thePost._id, date:thePost.date, newDate: thePost.newDate, gameMode: thePost.gameMode, thumbnail: thePost.thumbnail, views:thePost.views, downloads: thePost.downloads, starRating: thePost.starRating};
    }
    // just the 3 for now. We'll add a dedicated featured sort later.
    if(theFeatured.length >= 3){
      return [postInfo[theFeatured.length - 1], postInfo[theFeatured.length - 2], postInfo[theFeatured.length - 3]]
    }else if(theFeatured.length == 2){
      return [postInfo[1], postInfo[0]]
    }else{
      return [postInfo[0], postInfo[1], postInfo[2]]
    }
  }
});

//the post utility / action methods
Meteor.methods({
  'upvote': (id) =>{
    try{
      var user = Meteor.user().username
      if(posts.findOne({_id: id, upUsers: { $in: [user] } })){
        posts.update({_id: id}, {$pull: {upUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: -1}})
      }else if(posts.findOne({_id: id, downUsers: { $in: [user] }})){
        posts.update({_id: id}, {$push: {upUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: 2}})
        posts.update({_id: id}, {$pull: {downUsers: user}})
      }else{
        posts.update({_id: id}, {$push: {upUsers: user}})
        //pull any potential downpaw
        posts.update({_id: id}, {$pull: {downUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: 1}})
      }
      computeScore(id)
    }catch(e){}
  },
  'downvote': (id) =>{
    try{
      var user = Meteor.user().username
      if(posts.findOne({_id: id, downUsers: { $in: [user] } })){
        posts.update({_id: id}, {$pull: {downUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: 1}})
      }else if(posts.findOne({_id: id, upUsers: { $in: [user] }})){
        posts.update({_id: id}, {$push: {downUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: -2}})
        posts.update({_id: id}, {$pull: {upUsers: user}})
      }else{
        posts.update({_id: id}, {$push: {downUsers: user}})
        //pull any potential downpaw
        posts.update({_id: id}, {$pull: {upUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: -1}})
      }
      computeScore(id)
    }catch(e){}
  },
  'savePost': (id)=>{
    try{
      var user = Meteor.user().username
      if(userStuff.findOne({username: user, savedPosts: { $in: [id] } })){
        userStuff.update({username: user}, {$pull: {savedPosts: id}})
        return 'pulled'
      }else{
        userStuff.update({username: user}, {$push: {savedPosts: id}})
        return 'saved'
      }
    }catch(e){}
  }
})

Meteor.methods({
  updatePost:function(id, desc, map, mapName, mapCata, mapExcerpt, newYoutube, newTitle, mapTags){
    var username = Meteor.user().username;

    if((posts.findOne({_id: id}).username == username) || (username == 'CodyJ')){
      function uploadMap(map){
        // declare a regexp to match the non base64 first characters
        var dataUrlRegExp = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)\w+;base64,/;
        // remove the "header" of the data URL via the regexp
        var base64Data = map.replace(dataUrlRegExp, "");
        // declare a binary buffer to hold decoded base64 data
        var mapBuffer = new Buffer(base64Data, "base64");
        mapName = mapName.replace(/[^A-Za-z0-9_\.]+/g,"+");
		dlMap = '/files/resources/'+mapName
              try{
        // write the buffer to the path
        fs.writeFile(path+'/resources/'+mapName , mapBuffer,
        function (err) {
           if (err) console.log(err);
          console.log('Done!');
        })}catch(e){console.log(e)}
		
      }
      if(map && mapName != 'null'){
        uploadMap(map)
      }

      try{
        getVideo(newYoutube, id)
      }catch(e){}

      try{
        var tags = mapTags.split(/\s/).reduce(function (previous, word) {
          if (word.charAt(0) === "#") {
            previous.push(word.slice(1));
            word = word.replace(/#/g, "")
            word = '#'+word
          }
          return previous;
        }, []).join(" ");

        tags = tags.split(/\s/);

        var testTags = [];
        for(i = 0; i < tags.length; i++){
          testTags[i] = tags[i].replace(/#/g, "");
          testTags[i] = '#'+testTags[i].toLocaleLowerCase()
        }
      }catch(e){}

      // pull the count from the old map catagory and push it to the new one
      var oldCata = posts.findOne({_id: id}).gameMode
      catagory.update({name: oldCata}, {$inc: {count: -1}})
      catagory.update({name: mapCata}, {$inc: {count: 1}})
      posts.update({_id: id}, {$set: {description:desc, lastEdit: new Date(), gameMode: mapCata, excerpt: mapExcerpt, title: newTitle, tagList:testTags  ,dlMap: dlMap, dlID: mapName}})
      return 'success'
    }else{
      return 'fail'
    }
  }
});

function getVideo(url, id){
  console.log(url)
  if(!url.includes('youtube.com/watch?v=') && !url.includes('youtu.be/')){
    url = ''
  }else{
    if(url.includes('youtu.be/')){
      url = url.replace('youtu.be/', 'youtube.com/watch?v=')
    }
    var ytThumb = url.split('=')[1];
    ytThumb = 'http://img.youtube.com/vi/'+ytThumb+'/mqdefault.png'
    ytThumb = ytThumb.replace('&feature', '')
    url = url.replace("watch?v=","embed/");
    url = url.replace('&feature=youtu.be', '')
	posts.update({_id: id}, {$set: {video:url, ytThumb: ytThumb}})
  }
}
