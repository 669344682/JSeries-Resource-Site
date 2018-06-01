# CommunityMTA


### Running Locally

To run Locally you'll need Meteor.js

    Clone this Git Repo

    git clone https://github.com/codylewiz/CommunityMTA.git
    
    CD into the project

    cd ./CommunityMTA

    Change dictonarys
      -- server/fileserver.js
      -- server/methods/posts.js
      (Replace C:/Users/Administrator/Desktop/Website/CommunityMTA/.static~/ with the folder you want resources in)
      in the folder you linked create the folders images, thumbs and resources
      
    Install the required NPM packages

    meteor npm install --save jimp imagemin decay

    Start Meteor

    meteor --port (Port here)
    
    
