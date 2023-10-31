const { EmbedBuilder, InteractionType } = require('discord.js')

module.exports = async (client, interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = client.commands.get(interaction.commandName)

    if (!command)
      return (
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription('❌ | Có lỗi xảy ra, vui lòng thử lại sau!'),
          ],
          ephemeral: true,
        }),
        client.slash.delete(interaction.commandName)
      )

    if (command.voiceChannel) {
      if (!interaction.member.voice.channel) {
        return interaction.reply({
          content: 'Bạn chưa tham gia kênh thoại!',
          ephemeral: true,
        })
      }

      if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channel.id !==
          interaction.guild.members.me.voice.channel.id
      ) {
        return interaction.reply({
          content: 'Bạn phải tham gia kênh thoại hiện tại của bot!',
          ephemeral: true,
        })
      }
    }
    command.execute({ client, interaction })
  } else if (
    interaction.type === InteractionType.ApplicationCommandAutocomplete
  ) {
    const command = client.commands.get(interaction.commandName)
    await command.autocomplete({ interaction })
  }
}
