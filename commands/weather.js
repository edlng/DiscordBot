const axios = require('axios');


module.exports = {
    name: 'weather',
    aliases: ['w'],
    description: "this is a weather command!",
    async execute(client, message, cmd, args, Discord){

        let getWeather = async() => {
            let response = await axios.get("http://api.openweathermap.org/data/2.5/weather?q=richmond+,+ca&appid=f51c373faf134eb299ce32bb41b90f75");
            let weatherdata = response.data;
            return weatherdata;
        }
        let weatherValue = await getWeather();
        var temperature = `${weatherValue.main.temp}` - 273.15;

        if ((`${weatherValue.weather[0].main}` == "Clear") || (`${weatherValue.weather[0].main}` == "Clouds")){
            return message.channel.send(`${weatherValue.weather[0].main}` + " meaning " + `${weatherValue.weather[0].description}` +  ". It feels like " + Math.floor(temperature) + `°C.`);       
        }
        return message.channel.send(`${weatherValue.weather[0].main}` + " meaning " + `${weatherValue.weather[0].description}` +  ". It feels like " + Math.floor(temperature) + `°C.`);

    }
}
