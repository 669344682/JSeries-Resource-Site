Meteor.methods({
  createComment:function(comment){
    comment.username = Meteor.user().username;
    var daId = Random.id();
    comment.saveid = daId

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
    var level = 0

    if(comment.parentId != null || comment.parentId != "" ){
      var id = comment.parentId;
      comments.update({_id: id}, {$inc: {score: 1}});
      try{
        var lastLevel = comments.findOne({_id: id}).level
        level = lastLevel + 1
      }catch(e){}
    }

    comment.level = level

    comment.date = new Date();
    comment.newDate = newDate
    comments.insert(comment);

    posts.update({_id: comment.postId}, {$inc:{comments: 1}});
  }
});

Meteor.methods({
  deleteComment:function(id){
    var username = Meteor.user().username

    if(comments.findOne({_id: id}).username == username){
      var post = comments.findOne({_id: id}).postId
      posts.update({_id: post}, {$inc: {comments: -1}})
      comments.remove({_id: id})
      return 'deleted'
    }else{
      return 'fail'
    }
  }
});


Meteor.methods({
  editComment:function(id, meat){
    var username = Meteor.user().username

    if(comments.findOne({_id: id}).username == username){
      comments.update({_id: id}, {$set:{meat:meat}})
      comments.update({_id: id}, {$set:{edited:new Date()}})
      return 'edit'
    }else{
      return 'fail'
    }
  }
});
