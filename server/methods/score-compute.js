//awesome MIT score decay
var decay = require('decay')
Fiber = Npm.require('fibers');

computeScore = function(id){
  //get the details
  var date = posts.findOne({_id:id}).date
  let up = posts.findOne({_id:id}).upUsers
  let down = posts.findOne({_id:id}).downUsers
  var downloads = posts.findOne({_id: id}).downloads

  up = up.length
  down = down.length

  var redditHotScore = decay.redditHot(45000);

  if(date instanceof Date == false){
    dateVal = date.split(' ')

    var daScore = redditHotScore(up + downloads, down, new Date(dateVal[0] +' '+ dateVal[1] +', '+ dateVal[2]) );
  }else{
    var daScore = redditHotScore(up + downloads, down, date);
  }
  console.log('post: ' + id + ' score: '+daScore)

  posts.update({_id: id}, {$set: {score: daScore}})

  try{
    var totalVotes = up + down
    var upVotes = up
    console.log(up, totalVotes)

    var percent = upVotes/totalVotes*100
    percent_to_stars(percent)
    function percent_to_stars(p){
      if(p < 94){
        var star="X"
        var half="/"
        var stars = (Math.round((p / 10.0)) / 2)
        var halves = (p / 10.0) % 2
        var empties = 5 - stars - halves

        var rating = star.repeat( stars ) + half.repeat( halves )
        rating = rating.split('')
        posts.update({_id: id}, {$set: {starRating: rating}})

        // source: https://gist.github.com/grough/1268290/0f7948640026ef7e8177f55ed0583d0cac1146c1
      }else{
        posts.update({_id: id}, {$set: {starRating: ['X','X','X','X','X']}})
      }
    }
  }catch(e){console.log(e)}
}
function doSomething() {}

(function loop() {
  // update score every 15-30 minutes
  var rand = Math.floor((Math.random() * 1800000) + 900000)
  setTimeout(function() {
    console.log('Doing score computation \n')
    Fiber(function() {
      posts.find({}).map(function(post) {
        computeScore(post._id)
      });
    }).run();

    loop();
  }, rand);
}());
