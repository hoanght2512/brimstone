const { QueueRepeatMode } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

player.events.on('error', (queue, error) => {
  client.emit('trackEnd', queue.metadata.channel.guild.id)
  console.log(`Lỗi phát nhạc: ${error.message}`)
})

player.events.on('playerError', (queue, error) => {
  client.emit('trackEnd', queue.metadata.channel.guild.id)
  console.log(`Lỗi phát nhạc: ${error.message}`)
})

const messages = {}
player.events.on('playerStart', (queue, track) => {
  if (queue.repeatMode === QueueRepeatMode.TRACK) return
  client.emit('trackEnd', queue.metadata.channel.guild.id)
  const embed = new EmbedBuilder()
    .setURL(track.url)
    .setThumbnail(track.thumbnail)
    .setAuthor({
      name: player.client.user.tag,
      iconURL: player.client.user.displayAvatarURL(),
    })
    .addFields({
      name: `${track.title}`,
      value: `0:00 ┃ 🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ┃ ${track.duration}`,
      inline: true,
    })
    .setFooter({
      text: `Yêu cầu bởi ${track.requestedBy.tag}`,
      iconURL: track.requestedBy.displayAvatarURL(),
    })
    .setColor('#13f857')

  queue.metadata.channel
    .send({ embeds: [embed] })
    .then(
      (message) => (messages[`${queue.metadata.channel.guild.id}`] = message)
    )
})

player.events.on('playerSkip', (queue, track) => {
  queue.metadata.channel.send(`Đã bỏ qua **${track.title}** ✅`)
})

player.events.on('audioTrackAdd', (queue, track) => {
  const embed = new EmbedBuilder()
    .setThumbnail(track.thumbnail)
    .addFields(
      {
        name: 'Đã thêm vào hàng đợi ✅',
        value: `${track.title}`,
      },
      {
        name: 'Thời lượng',
        value: track.duration,
        inline: true,
      },
      {
        name: 'Yêu cầu bởi',
        value: track.requestedBy.tag,
        inline: true,
      }
    )
    .setColor('#e6cc00')

  queue.metadata.channel.send({ embeds: [embed] })
})

client.on('trackEnd', (guildId = 0) => {
  if (messages[`${guildId}`]) {
    messages[`${guildId}`].delete()
    messages[`${guildId}`] = null
  }
})

player.events.on('disconnect', (queue) => {
  client.emit('trackEnd', queue.metadata.channel.guild.id)
  queue.metadata.channel.send('Đã rời khỏi kênh thoại ✅')
})

player.events.on('emptyChannel', (queue) => {
  client.emit('trackEnd', queue.metadata.channel.guild.id)
  queue.metadata.channel.send(
    'Không có ai trong kênh thoại, tôi đã rời khỏi kênh thoại ✅'
  )
})

player.events.on('emptyQueue', (queue) => {
  client.emit('trackEnd', queue.metadata.channel.guild.id)
  queue.metadata.channel.send('Hàng đợi đã hết, tôi đã rời khỏi kênh thoại ✅')
})

player.events.on('audioTracksAdd', (queue, tracks) => {
  const embed = new EmbedBuilder()
    .setURL(tracks[0].playlist.url)
    .setTitle(tracks[0].playlist.title)
    .setThumbnail(
      tracks[0].playlist.thumbnail.url ?? tracks[0].playlist.thumbnail
    )
    .addFields(
      {
        name: 'Đã thêm vào hàng đợi ✅',
        value: `${tracks.length} bài hát`,
      },
      {
        name: 'Thời lượng',
        value: tracks[0].playlist.duration,
        inline: true,
      },
      {
        name: 'Yêu cầu bởi',
        value: tracks[0].playlist.requestedBy.tag,
        inline: true,
      }
    )
    .setColor('#e6cc00')

  queue.metadata.channel.send({ embeds: [embed] })
})
