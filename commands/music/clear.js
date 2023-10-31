module.exports = {
  name: 'clear',
  description: 'Xóa toàn bộ bài hát trong hàng chờ',
  voiceChannel: true,

  async execute({ interaction }) {
    await interaction.deferReply()

    const queue = player.nodes.get(interaction.guildId)
    if (!queue || !queue.node.isPlaying())
      return client.error.DEFAULT_ERROR(interaction)
    if (!queue.tracks.toArray()[0])
      return client.error.NO_NEXT_TRACKS(interaction)

    await queue.tracks.clear()
    interaction.followUp(`Đã xóa toàn bộ bài hát trong hàng chờ`)
  },
}
