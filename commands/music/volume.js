const { ApplicationCommandOptionType } = require('discord.js')
const MIN_VOL = client.config.opt.minVol
const MAX_VOL = client.config.opt.maxVol

module.exports = {
  name: 'volume',
  description: 'Điều chỉnh âm lượng',
  voiceChannel: true,
  options: [
    {
      name: 'amount',
      type: ApplicationCommandOptionType.Number,
      description: `Âm lượng (${MIN_VOL}-${MAX_VOL})`,
      required: false,
      minValue: MIN_VOL,
      maxValue: MAX_VOL,
    },
  ],

  async execute({ interaction }) {
    await interaction.deferReply()

    const queue = player.nodes.get(interaction.guildId)
    if (!queue) return client.error.DEFAULT_ERROR(interaction)

    const volume = parseInt(interaction.options.getNumber('amount'))

    if (isNaN(volume))
      return interaction.followUp({
        content: `🎧 Âm lượng hiện tại **${queue.node.volume}**%`,
        ephemeral: true,
      })

    const success = queue.node.setVolume(volume)
    return interaction.followUp({
      content: success
        ? `Âm lượng **${queue.node.volume}**%! ✅`
        : `Có lỗi xảy ra ${interaction.member}... thử lại sau ? ❌`,
    })
  },
}
