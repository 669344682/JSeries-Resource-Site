FlowRouter.route('/', {
  name: 'home',
  action: function(params, queryParams) {
    // "This is where my Halo Online would go. IF I HAD ONE." -- Microsoft, 2018
  }
});

FlowRouter.route('/page=(.*)?', {
  name: 'page',
  action: function(params){
    console.log(params)
    pageNum.set(parseInt(params[0]))
    setTimeout(function(){
      if(!posts.findOne({})){
        history.pushState('', document.title, "/");
        pageNum.set('')
      }
    }, 500);
  }
})


FlowRouter.route('/map/:_id*', {
  name: 'post',
  subscriptions: function(params, queryParams) {
    // using Fast Render
    let fullParams = params._id;
    fullParams = fullParams.split('/')
    this.register('posts', Meteor.subscribe('posts', fullParams[0]));
    currentPost.set(fullParams[0]);
  },
  action: function(params, queryParams) {
    let fullParams = params._id;
    fullParams = fullParams.split('/')
    let theseParms = fullParams[0];
  
    Meteor.call("postExists", theseParms, 'router', function(error, response){
      try{
        if(response[0] == theseParms){
          currentPost.set(response[0]);
          appTracker.set('post')
          document.title = response[1]
        }else{
          currentPost.set("")
        }
      }catch(e){
        history.pushState('', document.title, "/");
        currentPost.set("")
        appTracker.set('')
      }
    });
  }
});


FlowRouter.route('/user/:_id*', {
  name: 'user',
  action: function(params, queryParams) {
    let fullParams = params._id;
    fullParams = fullParams.split('/')
    let theseParms = fullParams[0];
    theseParms = theseParms.toLocaleLowerCase()
    currentUser.set(theseParms);

    Meteor.call("userExists", theseParms, function(error, response){
      if(response == theseParms){
        currentUser.set(response);
      }else if(error || response != theseParms){
        appTracker.set('404')
        currentUser.set("")
      }
    });
  }
});
