const got = require("got");

module.exports = {
  name: 'ubc',
  description: "this is a ubc command!",
  async execute(client, message, cmd, args, Discord) {
    let course = args[0].toUpperCase();
    let courseNum = args[1];
    let yearNum = args[2];
    let link = `https://ubcgrades.com/api/v2/grades/UBCV/${yearNum}/${course}/${courseNum}`;
    try {
      await got(link).then(response => {
        let content = JSON.parse(response.body);
        for (i = 0; i < content.length; i++) {
          if (content[i].section != "OVERALL") {
            continue;
          } else {
            let avgNum = content[i].average;
            let ubcmsg = `For the session ${yearNum}, the overall average for ${course} ${courseNum} was ${avgNum}%.`;
            message.channel.send(ubcmsg);
            break;
          }
        }

      });
    } catch (error) {
      await message.channel.send("Bad Request//Data Not Listed");
    }

  }
}