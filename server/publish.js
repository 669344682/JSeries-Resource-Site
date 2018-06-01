Meteor.publish("posts", function(limit, currentUser, page, sortBy, post, game, save, search){
  var dl = limit || 5;
  var skip = 0
  var featured = ['']
  try{
    featured = featured.find({}).map(function(e) { return e._id; })
  }catch(e){}

  if(page){
    skip = page * 10 - 10;
  }
  if(post){
    return posts.find({_id: post})
  }else{
    if(search){
      var searchLen = search.split(' ')
      console.log(searchLen.length)
      var safeSearch = search
      // look for results that contain this string at any point
      function getInfo(target, callback){
        var charLook = target

        var tags = search.split(/\s/).reduce(function (previous, word) {
          if (word.charAt(0) === charLook) {
            previous.push(word.slice(1));
            // strip search of mutator
            safeSearch = safeSearch.replace(word+' ', '')
            if(safeSearch.includes(word)){
              safeSearch = safeSearch.replace(word, '')
            }
            console.log(safeSearch)
            word = word.replace(/charLook/g, "")
            word = charLook+word
          }
          return previous;
        }, []).join(" ");
        callback(tags)
      }

      if(searchLen.length > 1){
        if(search.includes('@') && !search.includes('#')){
          // show posts by @ matching title
          var username = ''
          getInfo('@', function(e){
            username = e
          })
          safeSearch = ".*" + safeSearch + ".*";
          safeSearch = safeSearch.toLocaleLowerCase()

          return posts.find({username: {$regex: new RegExp (username, "i")}, title: {$regex: new RegExp (safeSearch, "i")}}, {sort: {score: -1}, skip: skip, limit: dl})
        }if(search.includes('#') && !search.includes('@')){
          // show posts by # matching title
          var tags = []
          getInfo('#', function(e){
            tags = e
            tags = tags.split(' ')
            for (var i = 0; i < tags.length; i++){
              tags[i] = '#'+tags[i].toLocaleLowerCase()
            }
          })
          safeSearch = ".*" + safeSearch + ".*";
          safeSearch = safeSearch.toLocaleLowerCase()

          return posts.find({tagList: { $in: tags }, title: {$regex: new RegExp (safeSearch, "i")}}, {sort: {score: -1}, skip: skip, limit: dl})
        }
        if(search.includes('@') && search.includes('#')){
          // show posts by @ tagged #
          var username = ''
          var tags = ''
          getInfo('@', function(e){
            username = e
          })
          getInfo('#', function(e){
            tags = e
            tags = tags.split(' ')
            for (var i = 0; i < tags.length; i++){
              tags[i] = '#'+tags[i].toLocaleLowerCase()
            }
          })
          safeSearch = safeSearch.toLocaleLowerCase()
          if(safeSearch){
            safeSearch = ".*" + safeSearch + ".*";

            return posts.find({title:{$regex: new RegExp (safeSearch, "i")}, username: {$regex: new RegExp (username, "i")}, tagList: { $in: tags }}, {sort: {score: -1}, skip: skip, limit: dl})
          }else{
            return posts.find({username: {$regex: new RegExp (username, "i")}, tagList: { $in: tags }}, {sort: {score: -1}, skip: skip, limit: dl})
          }
        }
        if(!search.includes('@') && !search.includes('#')){
          // show posts with title matching string
          safeSearch = ".*" + safeSearch + ".*";
          console.log(safeSearch)
          return posts.find({title:{$regex: new RegExp (safeSearch, "i")}}, {sort: {score: -1}, skip: skip, limit: dl})
        }
      }else{ // our length is 1
        if(search.includes('@')){
          // show posts by @ matching title
          var username = ''
          getInfo('@', function(e){
            username = e
          })
          safeSearch = ".*" + safeSearch + ".*";
          safeSearch = safeSearch.toLocaleLowerCase()

          return posts.find({username: {$regex: new RegExp (username, "i")}}, {sort: {score: -1}, skip: skip, limit: dl})
        }
        if(search.includes('#')){
          // show posts with tag
          var tags = ''
          getInfo('#', function(e){
            tags = e
            tags = tags.split(' ')
            for (var i = 0; i < tags.length; i++){
              tags[i] = '#'+tags[i].toLocaleLowerCase()
            }
          })
          return posts.find({tagList: { $in: tags }}, {sort: {score: -1}, skip: skip, limit: dl})
        }
        if(!search.includes('@') && !search.includes('#')){
          safeSearch = ".*" + safeSearch + ".*";
          return posts.find({title: {$regex: new RegExp (safeSearch, "i")}}, {sort: {score: -1}, skip: skip, limit: dl})
        }
      }
    }else if(currentUser){
      var createdPosts = userStuff.findOne({username: {$regex: new RegExp (currentUser, "i")}}).createdPosts
      if(game){
        return posts.find({_id: {$in: createdPosts}, gameMode: game}, {sort: {date: -1}, skip: skip, limit: dl});
      }else{
        return posts.find({_id: {$in: createdPosts}}, {sort: {date: -1}, skip: skip, limit: dl});
      }
    }else{
      if(save){
        var savedPosts = userStuff.findOne({username: {$regex: new RegExp (Meteor.user().username, "i")}}).savedPosts
        if(game){
          return posts.find({_id: {$in: savedPosts}, gameMode: game}, {sort: {date: -1}, skip: skip, limit: dl});
        }else{
          return posts.find({_id: {$in: savedPosts}}, {sort: {date: -1}, skip: skip, limit: dl});
        }
      }else{
        if(game){
          if(sortBy == 'new'){
            return posts.find({gameMode: game}, {sort: {date: -1}, skip: skip, limit: dl});
          }
          if(sortBy == 'hot'){
            return posts.find({gameMode: game}, {sort: {score: -1}, skip: skip, limit: dl});
          }
          if(sortBy == 'topDl'){
            return posts.find({gameMode: game}, {sort: {downloads: -1}, skip: skip, limit: dl});
          }
          if(sortBy == 'updated'){
            return posts.find({gameMode: game}, {sort: {lastEdit: -1}, skip: skip, limit: dl});
          }
        }else{
          if(sortBy == 'new'){
            return posts.find({}, {sort: {date: -1}, skip: skip, limit: dl});
          }
          if(sortBy == 'hot'){
            return posts.find({}, {sort: {score: -1}, skip: skip, limit: dl});
          }
          if(sortBy == 'topDl'){
            return posts.find({}, {sort: {downloads: -1}, skip: skip, limit: dl});
          }
          if(sortBy == 'updated'){
            return posts.find({}, {sort: {lastEdit: -1}, skip: skip, limit: dl});
          }
        }
      }
    }
  }
});

Meteor.publish("catagory", function(argument){
  return catagory.find({})
});


Meteor.publish("comments", function(post){
  console.log(post)
  return comments.find({postId:post})
});

Meteor.publish("userStuff", function(){
if (!(Meteor.user() == null)) {
  return userStuff.find({username:Meteor.user().username})
}});
