module.exports = {
    name: 'status',
    aliases: ['stat'],
    description: "this is a status command!",
    statusFunction: function useStatusFunction(client) {
        setStatus(client);
    },
    execute(client, message, cmd, args, Discord){
      setStatus(client);
    }
}

function setStatus(client) {
  let activities = ["STREAMING", "LISTENING"]
  let activityChoice = activities[Math.floor(Math.random() * activities.length)]

  if (activityChoice == "STREAMING") {
    listOfStatus = [
      "Naruto",
      "Attack on Titan",
      "Math Homework",
      "Lofi Radio 24/7",
      "Rollercoaster Tycoon"
    ]
  } else if (activityChoice == "LISTENING") {
    listOfStatus = [
      "BTS",
      "EXO",
      "Black Eyed Peas",
      "Kanye West",
      "BLACKPINK",
      "Anime music",
      "Lofi beats",
      "EDM",
      "LOONA",
      "ITZY",
      "IZONE",
      "TWICE",
      "Red Velvet"
    ]
  } 
  statusChoice = listOfStatus[Math.floor(Math.random() * listOfStatus.length)]

    
    client.user.setPresence({
        activity: {
            name: statusChoice,
            type: activityChoice,
        },
    })
}