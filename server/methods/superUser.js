Meteor.methods({
  badDl:function(id){
    //this will eventually be super mods
    if(Meteor.user().username == 'CodyJ'){
      var mapId = posts.findOne({_id: id}).mapId
      if(mapId){
        posts.update({_id: id}, {$set:{dlMap: dlMap = '/files/resources/'+mapId }})
      }else{
        posts.update({_id: id}, {$set: {bad: 'dl'}})
      }
    }
  },
  badImg: function(id){
    if(Meteor.user().username == 'CodyJ'){
      posts.update({_id: id}, {$set: {bad: 'img'}})
    }
  },
  del:function(id){
    if(Meteor.user().username == 'CodyJ'){
      var type = posts.findOne({_id: id}).gameMode
      posts.remove({_id: id})
      catagory.update({name:type}, {$inc: {count: -1}})
    }
  },
  
  featureB:function(id){
    if(Meteor.user().username == 'CodyJ'){

			if(featured.findOne({_id: id})){
						console.log(id+' has been unfeatured.')
						featured.remove({_id:id})	
						return false
			}else{
						console.log(id+' has been featured!')
					    featured.insert({_id:id})	
						return true
			}
    }
  }
});
