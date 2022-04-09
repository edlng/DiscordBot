const got = require("got");
let randomColor;

module.exports = {
  name: 'reddit',
  aliases: ['r'],
  description: "this is the reddit command",
  async execute(client, message, cmd, args, Discord) {
    let embed1 = new Discord.MessageEmbed()
    let embed2 = new Discord.MessageEmbed()
    let embed3 = new Discord.MessageEmbed()
    if (args[0]) {
      let choice = args.join("")
      try {
        await got('https://www.reddit.com/r/' + choice + '/random/.json').then(response => {
          let content = JSON.parse(response.body);
          searchWithGivenSubreddit(content, embed1, message, embed2, embed3)
        })
      } catch (error) {
        message.channel.send("HTTP Error // Bad Subreddit");
      }
    } else {
      let choices = ["funny", "memes"]; // Default choices
      let choice = choices[Math.floor(Math.random() * choices.length)];
      try {
        await got('https://www.reddit.com/r/' + choice + '/random/.json').then(response => {
          redditSearchWithNoArgs(response, embed1, message, embed2, embed3);
        })
      } catch (error) {
        message.channel.send("HTTP Error // Bad Subreddit");
      }
    }
  }
}

// Execute when given a specific subreddit arg
function searchWithGivenSubreddit(content, embed1, message, embed2, embed3) {
  if (!Array.isArray(content)) {
    message.channel.send("Invalid Subreddit");
  } else {
    let contentMedia = content[0].data.children[0].data.url;
    if (contentMedia.substring(23, 30) == "gallery") {
      multipleItems(content, contentMedia, embed1, message, embed2, embed3);
    } else {
      onlyOneItem(contentMedia, content, embed1, message);
    }
  }
}

// Execute when no arg given (no specific subreddit)
function redditSearchWithNoArgs(response, embed1, message, embed2, embed3) {
  let content = JSON.parse(response.body);
  let contentMedia = content[0].data.children[0].data.url;
  if (contentMedia.substring(23, 30) === "gallery") {
    multipleItems(content, contentMedia, embed1, message, embed2, embed3);
  } else {
    onlyOneItem(contentMedia, content, embed1, message);
  }
}

function checkGfyCatMedia(content) {
  return (content[0].data.children[0].data.domain === "gfycat.com" || content[0].data.children[0].data.url.substring(8, 17) === "v.redd.it"
  || content[0].data.children[0].data.url.substring(8, 16) === "youtu.be"
  || content[0].data.children[0].data.url.substring(8, 23) === "www.youtube.com"
  || content[0].data.children[0].data.url.substring(8, 21) === "www.imgur.com"
  || content[0].data.children[0].data.url.substring(8, 17) === "imgur.com");
}

function randomizeColour() {
  randomColor = Math.floor(Math.random() * 16777215).toString(16);
}

function onlyOneItem(contentMedia, content, embed1, message) {
  randomizeColour();
  contentMedia = content[0].data.children[0].data.url;
  let contentTitle = content[0].data.children[0].data.title;
  let description = "";
  if (content[1].data.children.length >= 1) {
    let funnyTextLength = Math.floor(Math.random() * content[1].data.children.length)
    description = content[1].data.children[funnyTextLength].data.body;
  } else {
    description = "Hahaha!";
  }
  embed1.setColor("#" + randomColor);
  embed1.setTitle(contentTitle);
  embed1.setDescription(description);
  if (!checkGfyCatMedia(content)) {
    embed1.setImage(contentMedia);
    message.channel.send(embed1);
  } else {
    message.channel.send(embed1);
    message.channel.send(contentMedia);
  }
}

function multipleItems(content, contentMedia, embed1, message, embed2, embed3) {
  let maxLength = 0;
  if (content[0].data.children[0].data.gallery_data.items.length > 3) {
    maxLength = 3;
  } else {
    maxLength = content[0].data.children[0].data.gallery_data.items.length;
  }
  let contentTitle = content[0].data.children[0].data.title;
  for (let i = 0; i < maxLength; i++) {
    randomizeColour();
    memeImageid = content[0].data.children[0].data.gallery_data.items[i].media_id;
    contentMedia = `https://i.redd.it/${memeImageid}.jpg`
    let description = "";
    if (content[1].data.children.length >= 1) {
      let funnyTextLength = Math.floor(Math.random() * content[1].data.children.length)
      description = content[1].data.children[funnyTextLength].data.body;
    } else {
      description = "LOL!";
    }
    if (i === 0) {
      embed1.setColor("#" + randomColor);
      embed1.setTitle(contentTitle);
      embed1.setDescription(description);
      embed1.setImage(contentMedia);
      message.channel.send(embed1);
    } else if (i === 1) {
      embed2.setColor("#" + randomColor);
      embed2.setTitle(contentTitle);
      embed2.setDescription(description);
      embed2.setImage(contentMedia);
      message.channel.send(embed2);
    } else if (i === 2) {
      embed3.setColor("#" + randomColor);
      embed3.setTitle(contentTitle);
      embed3.setImage(contentMedia);
      embed3.setDescription(description);
      message.channel.send(embed3);
    }
  }
}
