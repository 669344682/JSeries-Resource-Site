Meteor.subscribe('userStuff')

Deps.autorun( function(){
  reactPost.set(true)
  Meteor.subscribe('posts', postLimit.get(), currentUser.get(), pageNum.get(), sortBy.get(), currentPost.get(), currentGame.get(), saved.get(), postSearch.get())
});

Deps.autorun(function(){
  Meteor.subscribe('comments', currentPost.get())
});

Meteor.subscribe('catagory')

Meteor.subscribe('featured')

//modal closer
Meteor.modals ={
  closeModal : (target, target2) =>{
    $(document).bind("mouseup touchend", function (e) {
      var container = $(target2);
      var modal = $(target);

      if (!container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
        modal.hide();
      }
    });
  },
  closeDropdown: (trigger, dropdown)=>{
    $(document).bind("mouseup touchend", function (event) {
      if (!event.target.matches(trigger)) {
        $(dropdown).hide()
      }
    })
  }
}

//notification decay
Meteor.notiDecay = {
  notiDecay : (target) =>{
    var thisOne = $('#'+target)
    setTimeout(function () {
      thisOne.fadeOut();
      setTimeout(function () {
        thisOne.remove();
      }, 400);
    }, 3800);
  }
}

// push route
Meteor.pushState ={
  pushState:(target, type) =>{
    console.log(target)
    if(type == 'post'){
      var title = posts.findOne({_id: target}).title
      document.title = title
      title = title.replace(/\s+/g, '-')
      title = title.replace(/[^0-9\-\w]/ig, '')
      title = title.toLocaleLowerCase()
      title = encodeURI(title) + "/"
      target = target + "/" +title
      window.history.pushState("object or string", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
      history.pushState('', document.title, "map/"+target);
    }else if(type == 'user'){
      window.history.pushState("object or string", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
      history.pushState('', document.title, "user/"+target);
      currentUser.set(target.toLocaleLowerCase())
    }else if(target == "home" || !target){
      pageNum.set('')
      history.pushState('', document.title, "/");
      document.title = "Multi Theft Auto | Community"
    }
  }
}
history.pushState(null, null, location.href);
window.onpopstate = function () {
  var takeMeHome = true

  if($('.mobSearch').is(":visible")){
    $('.mobSearch').removeClass('extendSearch')
    setTimeout(function(){
      $('.mobSearch').hide()
    }, 200);
    takeMeHome = false
  }else if(snapper.state().state == 'left'){
    snapper.close()
    takeMeHome = false
  }
  if(takeMeHome && appTracker.get() != ""){
    currentPost.set('')
    appTracker.set('')
    profileTracker.set('')
    currentUser.set('')
    Meteor.pushState.pushState('home')
    history.go(1);
  }
}

Template.app.rendered = function() {
  var docWidth = $(document).width()
  if(docWidth < 750){
    snapper = new Snap({
      element: document.getElementById('content-2'),
      maxPosition: 300,
      resistance: 0.5,
      disable: 'right'
    });
    $('.drawers').show()
    currentTheme.set('modern')
  }
}

Template.main.onRendered(function(){
  // select the target node
  var target = document.querySelector('#feed');
  // create an observer instance
  try{
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        setTimeout(function () {
          reactPost.set(false)
        }, 1500);
      });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true }

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
  }catch(e){
    console.log('cant observe feed')
  }
});

$(document).on('change','.themeSelect',function(){
  console.log($(this))
  currentTheme.set($(this).val())
});
