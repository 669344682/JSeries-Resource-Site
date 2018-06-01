//Meteor SEO SSR for BOTS
const SeoRouter = Picker.filter((request, response) => {
  let botAgents = [
    /^facebookexternalhit/i, // Facebook
    /^linkedinbot/i, // LinkedIn
    /^twitterbot/i, // Twitter
    /^slackbot-linkexpanding/i, // Slack
    /^googlebot/i, // surprise!
    /^discordbot/i // discord
  ]

  return /_escaped_fragment_/.test(request.url) || botAgents.some(i => i.test(request.headers['user-agent']))
})

SeoRouter.route('/map/:_id*', (params, request, response) => {
  SSR.compileTemplate('index', Assets.getText('index.html'))
  var postId = params._id;
  postId = postId.split('/')[0]

  Template.index.helpers({
    getDocType: function() {
      return "<!DOCTYPE html>";
    },
    title: function(){
      return posts.findOne({_id: postId}).title
    },
    excerpt: function(){
      return posts.findOne({_id: postId}).excerpt
    },
    thumb: function(){
      return posts.findOne({_id: postId}).thumbnail
    }
  });

  let html = SSR.render('index')

  response.setHeader('Content-Type', 'text/html;charset=utf-8');
  response.end(html)
})
