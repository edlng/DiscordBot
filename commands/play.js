const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const got = require('got');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require("axios");
const qs = require("qs");

//Global queue for your bot. Every server will have a key and value pair in this map. { guild.id, queue_constructor{} }
const queue = new Map();

var token = {};

module.exports = {
    name: 'play',
    aliases: ['skip', 'leave', 's', 'p', 'l', 'queue', 'q'],
    description: 'Advanced music bot',
    async execute(client, message, cmd, args, Discord, profileData) {

        //Checking for the voicechannel and permissions (you can add more permissions if you like).
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions');

        //This is our server queue. We are getting this server queue from the global queue.
        const server_queue = queue.get(message.guild.id);
        let song = {};
        let not_spotify_search = true;

        //If the user has used the play command
        if (cmd === 'play' || cmd === 'p') {
            if (!args.length) return message.channel.send('You need to send the second argument!');

            //If the first argument is a link. Set the song object to have two keys. Title and URl.
            if (args[0].includes('open.spotify.com/playlist/')) {
                await add_spotify_playlist(message, args[0]).then(() => {
                    message.channel.send(`Added songs to the queue`);
                });
                not_spotify_search = false;
            } else if (args[0].includes('open.spotify.com/album/')) {
                await add_spotify_album(message, args[0]).then(() => {
                    message.channel.send(`Added songs to the queue`);
                });
                not_spotify_search = false;        
            } else if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = {title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}
            } else {
                //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
                const video_finder = async (query) => {
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if (video) {
                    song = {title: video.title, url: video.url}
                } else {
                    message.channel.send('Error finding video.');
                }
            }

            //If the server queue does not exist (which doesn't for the first video queued) then create a constructor to be added to our global queue.
            if (server_queue === undefined && song !== {} && not_spotify_search) {
                await init_song_queue(voice_channel, message, song);
            } else if (song !== {} && not_spotify_search) {
                server_queue.songs.push(song);
                return message.channel.send(`👍 **${song.title}** added to queue!`);
            }
        } else if ((cmd === 'skip' || cmd === "s") && server_queue) skip_song(message, server_queue);
        else if ((cmd === 'leave' || cmd === "l") && server_queue) stop_song(message, server_queue);
        else if ((cmd === 'queue' || cmd === "q") && server_queue) {
            // generate_queue_embed(Discord, message);
            let count = 1;
            let embed = new MessageEmbed()
                .setTitle('Queue')
                .setColor(`#${randomizeColour()}`)
            for (const song of server_queue.songs) {
                if (count === 1) {
                    embed.addField("Now playing: ", song.title);
                } else {
                    embed.addField(`${count}: `, song.title);
                }
                count++;
            }
            message.channel.send(embed);
        }
    }

}

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {filter: 'audioonly'});
    song_queue.connection.play(stream, {seek: 0, volume: 0.5})
        .on('finish', () => {
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0]);
        });
    await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`)
}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if (!server_queue) {
        return message.channel.send(`There are no songs in queue 😔`);
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}

async function add_spotify_album(message, link) {
    token = await getToken();
    const options = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const album_id_split = link.split('/')[4];
    const album_id = album_id_split.substr(0, album_id_split.indexOf('?'));
    const voice_channel = message.member.voice.channel;
    await got(`https://api.spotify.com/v1/albums/${album_id}/tracks?market=ES`, options).then(async (response) => {
        const album_songs = JSON.parse(response.body).items;
        album_songs.sort();
        for (const song of album_songs) {
            let song_queue = queue.get(message.guild.id);
            let query = song.name + ' ' + song.artists[0].name + " lyrics";
            const video_result = await ytSearch(query);
            const actual_video = (video_result.videos.length > 1) ? video_result.videos[0] : null;
            const result = {title: actual_video.title, url: actual_video.url}
            if (song_queue === undefined) {
                await init_song_queue(voice_channel, message, result);
            } else {
                song_queue.songs.push(result);
            }
        }
    })
}

async function add_spotify_playlist(message, link) {
    token = await getToken();
    const options = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const playlist_id_split = link.split('/')[4];
    const playlist_id = playlist_id_split.substr(0, playlist_id_split.indexOf('?'));
    const voice_channel = message.member.voice.channel;
    await get_spotify_offset(playlist_id, 0);
    let offset = recursive_count;
    let random_offset_times_100 = Math.floor(Math.random() * (Math.floor(Math.random() * offset) * 100));
    await got(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?market=ES&offset=${random_offset_times_100}`, options).then(async (response) => {
        const playlist_songs = JSON.parse(response.body).items;
        const randomized_15 = randomize_playlist_songs(playlist_songs);
        for (const song of randomized_15) {
            let song_queue = queue.get(message.guild.id);
            let query = song.track.name + ' ' + song.track.artists[0].name + " lyrics";
            const video_result = await ytSearch(query);
            const actual_video = (video_result.videos.length > 1) ? video_result.videos[0] : null;
            const result = {title: actual_video.title, url: actual_video.url}
            if (song_queue === undefined) {
                await init_song_queue(voice_channel, message, result);
            } else {
                song_queue.songs.push(result);
            }
        }
    })
    recursive_count = 0;
}

function randomize_playlist_songs(song_list) {
    let randomized_playlist = [];
    if (song_list.length < 15) {
        for (const song of song_list) {
            randomized_playlist.push(song);
        }
        return randomized_playlist;
    }
    for (let i = 0; i < 15; i++) {
        let random_num = Math.floor(Math.random() * song_list.length);
        if (song_list.length > 0) {
            randomized_playlist.push(song_list[random_num])
            song_list.splice(random_num, 1);
        }
    }
    return randomized_playlist;
}

function randomizeColour() {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

async function init_song_queue(voice_channel, message, song) {
    const queue_constructor = {
        voice_channel: voice_channel,
        text_channel: message.channel,
        connection: null,
        songs: []
    }

    //Add our key and value pair into the global queue. We then use this to get our server queue.
    queue.set(message.guild.id, queue_constructor);
    queue_constructor.songs.push(song);

    //Establish a connection and play the song with the vide_player function.
    try {
        const connection = await voice_channel.join();
        queue_constructor.connection = connection;
        video_player(message.guild, queue_constructor.songs[0]);
    } catch (err) {
        queue.delete(message.guild.id);
        message.channel.send('There was an error connecting!');
        throw err;
    }
}

async function generate_queue_embed(Discord, message) {
    const backId = 'back'
    const forwardId = 'forward'
    const backButton = new MessageButton().setStyle('SECONDARY').setLabel('Back ⬅ ').setCustomId(backId);
    const forwardButton = new MessageButton().setStyle('SECONDARY').setLabel('Forward ➡').setCustomId(forwardId);

// Put the following code wherever you want to send the embed pages:

    const {author, channel} = message
    const song_queue = queue.get(message.guild.id).songs

    /**
     * Creates an embed with guilds starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */
    const generateEmbed = async start => {
        const current = song_queue.slice(start, start + 10)

        // You can of course customise this embed however you want
        return new MessageEmbed({
            title: `Showing songs ${start + 1}-${start + current.length} out of ${
                song_queue.length
            }`,
            fields: await Promise.all(
                current.map(async song => ({
                    name: song.title,
                    value: `\u200b`
                }))
            )
        })
    }

    // Send the embed with the first 10 guilds
    const canFitOnOnePage = song_queue.length <= 10
    const embedMessage = await channel.send({
        embeds: [await generateEmbed(0)],
        components: canFitOnOnePage
            ? []
            : [new MessageActionRow({components: [forwardButton]})]
    })
    // Exit if there is only one page of guilds (no need for all of this)
    if (canFitOnOnePage) return

    // Collect button interactions (when a user clicks a button),
    // but only when the button as clicked by the original message author
    const collector = embedMessage.createMessageComponentCollector({
        filter: ({user}) => user.id === author.id
    })

    let currentIndex = 0
    collector.on('collect', async interaction => {
        // Increase/decrease index
        interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)
        // Respond to interaction by updating message with new embed
        await interaction.update({
            embeds: [await generateEmbed(currentIndex)],
            components: [
                new MessageActionRow({
                    components: [
                        // back button if it isn't the start
                        ...(currentIndex ? [backButton] : []),
                        // forward button if it isn't the end
                        ...(currentIndex + 10 < song_queue.length ? [forwardButton] : [])
                    ]
                })
            ]
        })
    })
}

const getToken = async (
    clientId = process.env.SPOTIFY_CLIENT_ID,
    clientSecret = process.env.SPOTIFY_CLIENT_SECRET
) => {
    const headers = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
            username: clientId,
            password: clientSecret,
        },
    };
    const data = {
        grant_type: "client_credentials",
    };
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            qs.stringify(data),
            headers
        );
        return response.data.access_token;
    } catch (err) {
        console.log(err);
    }
};

// Keeps track of current_offset value in a global scope
var recursive_count = 0;

const get_spotify_offset = async (playlist_id, offset) => {
    /**
     * @param {number} offset: local variable to help keep track of recursive process
     * @param {playlist_id} playlist_id: id of playlist to get songs from 
     */
    var current_offset = offset;
    var current_offset_100 = current_offset * 100;
    const options = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    await got(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?market=ES&offset=${current_offset_100}`, options).then((response) => {
        const json = JSON.parse(response.body);
        if (json.items.length < 100) {
            return current_offset;
        } else {
            current_offset++;
            recursive_count++;
            return get_spotify_offset(playlist_id, current_offset);
        }
    });
}