const axios = require("axios");

let API_KEY = "vP3SOc7cZl3JGmtOyeuK3iogqGINKt6xuPm0cBADR7453IAT2JRVisdk_SkVkNJBmPf4E-hdBxfdPiR0oBoxo-O6s1DgJ1nnl00VABbU-l2T2JdYz0hvcuT0iFS0YHYx";

module.exports = {
  name: 'yelp',
  description: "this is a ping command!",
  async execute(client, message, cmd, args, Discord) {
    let yelpREST = axios.create({
      baseURL: "https://api.yelp.com/v3/",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-type": "application/json",
      },
    })

    if (args[0] == "find"){
      let bnames = [];
      args.shift();

      yelpREST("/businesses/search", {
        params: {
          location: args.join(" ") + " Richmond BC",
          term: "restaurant",
          limit: 25,
        },
      }).then(({ data }) => {
        let { businesses } = data
        businesses.forEach((b) => {
          bnames.push(b.name);
        })
        let choice = Math.floor(Math.random() * bnames.length);
        let aname = bnames[choice];
        aname = aname.split("");
        let etxt = "";
        for(i = 0; i < aname.length; i++) {
          etxt += aname[i];
        }
        message.channel.send("You should eat at " + etxt + "!");
    })
    } else if (args[0] == "check") {
      args.shift();
      let aname = args.join("-");
      try {
        await yelpREST(`/businesses/`+aname+`-richmond`+`/reviews`).then(({ data }) => {
        // Do something with the data
        let reviewChoice = Math.floor(Math.random() * data.reviews.length);
        let reviewText = data.reviews[reviewChoice].text;
        let reviewRate = data.reviews[reviewChoice].rating;
        message.channel.send("TupacBot gives this place: " + reviewRate + " stars. " + reviewText + " " + data.reviews[reviewChoice].url);
      })
      } catch (error) {
        message.channel.send("There was an error processing the request.");
      }
      
    } else {
      message.channel.send("Invalid request");
    }
    
  }
}