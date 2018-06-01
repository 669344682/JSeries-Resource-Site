//first time init
var catagoriesList = [
  'Map',
  'Gamemode',
  'Resource',
  'Script',
  'Shader',
  'Other'
]

for(var i = 0; i < catagoriesList.length; i++){
  if(catagory.findOne({name: catagoriesList[i]})){

  }else{
    catagory.insert({name: catagoriesList[i], count: 0})
  }
}

//convert non-URI URL to URIencoded
//try{
//  var post = posts.find({}).map(function(e) { return e._id; })
//  for(var i = 0; i < post.length; i++){
//    var dlMap = posts.findOne({_id: post[i]}).dlMap

    //if the + sign is non-encoded
//    if(dlMap.includes('+')){
//      dlMap = dlMap.split('/')[5]
//      dlMap = encodeURIComponent(dlMap)
//      posts.update({_id: post[i]}, {$set:{dlMap: '/files/resources/'+dlMap}})
//    }
//  }
//}catch(e){}

// the signup method
Meteor.methods({
  'signup': (username, password) =>{
    if(username.length >= 4 && password.length >= 6 && username.length < 20 && /^[A-Za-z0-9_-]+$/.test(username)){
      Accounts.createUser({
        username: username,
        password: password
      });
      Meteor.call("userStuffCreate", username);
      return 'All Good!'
    }
  },
  'userStuffCreate': function (username){
    console.log('firing')
    if(userStuff.findOne({username: username})){

    }
    else{
      userStuff.insert({username: username, createdPosts: [], createdComments: [], savedPosts: [], email: ''});
    }
  }
})

Meteor.methods({
  'userExists' : (params) =>{
    if(userStuff.findOne({username:{$regex: new RegExp (params, "i")}})){
      return userStuff.findOne({username:{$regex: new RegExp (params, "i")}}).username.toLocaleLowerCase();
    }
  }
})

Meteor.methods({
  'postExists' : (params, type) =>{
    if(posts.findOne({_id: params})){
      if(!type){
        setTimeout(function(){
          Fiber(function() {
            posts.update({_id: params}, {$inc: {views: 1}})
          }).run();
        }, Math.floor((Math.random() * 300000) + 65000));
      }
      return [posts.findOne({_id:params})._id, posts.findOne({_id:params}).title];
    }
    else if(announcements.findOne({_id: params})){
      return announcements.findOne({_id: params})._id;
    }
  }
})

Meteor.methods({
  'download' : (params) =>{
    if(posts.findOne({_id: params})){
      setTimeout(function(){
        Fiber(function() {
          posts.update({_id: params}, {$inc: {downloads: 1}})
        }).run();
      }, Math.floor((Math.random() * 100000) + 10000));
    }
  }
})

Meteor.methods({
  updateUser: (email) =>{
    var user = Meteor.user().username;

    userStuff.update({username: user}, {$set: {email: email}})
    return 'success'
  }
})




