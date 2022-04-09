module.exports = {
    name: 'clear',
    aliases: ['cl'],
    description: "this is a clear console command!",
    execute(client, message, cmd, args, Discord){
        console.clear();
    }
}