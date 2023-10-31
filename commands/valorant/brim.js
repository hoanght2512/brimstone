const { ApplicationCommandOptionType } = require('discord.js')

const rankChoices = [
  {
    name: 'Unranked',
    value: 'Unranked',
    image:
      'https://media.discordapp.net/attachments/905794241882636318/1008780589123510273/unrated.png',
  },
  {
    name: 'Iron',
    value: 'Iron',
    image:
      'https://media.discordapp.net/attachments/905794241882636318/1008780589123510273/unrated.png',
  },
  {
    name: 'Bronze',
    value: 'Bronze',
    image:
      'https://cdn.discordapp.com/attachments/947974495132581899/947975803906437170/bronze.png',
  },
  {
    name: 'Silver',
    value: 'Silver',
    image:
      'https://cdn.discordapp.com/attachments/947974495132581899/947975805185695804/silver.png',
  },
  {
    name: 'Gold',
    value: 'Gold',
    image:
      'https://cdn.discordapp.com/attachments/947974495132581899/947975804376186911/gold.png',
  },
  {
    name: 'Platinum',
    value: 'Platinum',
    image:
      'https://cdn.discordapp.com/attachments/947974495132581899/947975804841766982/plat.png',
  },
  {
    name: 'Diamond',
    value: 'Diamond',
    image:
      'https://cdn.discordapp.com/attachments/947974495132581899/947975804153897061/diamond.png',
  },
  {
    name: 'Ascendant',
    value: 'Ascendant',
    image:
      'https://media.discordapp.net/attachments/905794241882636318/1008778875230224475/ascendant.png',
  },
  {
    name: 'Immortal',
    value: 'Immortal',
    image:
      'https://cdn.discordapp.com/attachments/947974495132581899/947976076045471795/250.png',
  },
  {
    name: 'Radiant',
    value: 'Radiant',
    image:
      'https://cdn.discordapp.com/attachments/905794241882636318/1008779886787313834/radiant.png',
  },
]

module.exports = {
  name: 'brim',
  description: 'Chiêu mộ thành viên vào team',
  voiceChannel: true,
  options: [
    {
      name: 'rank',
      description: 'Rank yêu cầu',
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: rankChoices,
    },
    {
      name: 'msg',
      description: 'Lời nhắn',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  async execute({ interaction }) {
    await interaction.deferReply()

    const { options } = interaction
    const guild = client.guilds.cache.get(interaction.guildId)
    const user = interaction.user
    const rank = options.rank ?? 'Unranked'
    const msg = options.msg

    const member =
      guild.members.cache.get(user.id) ?? (await guild.members.fetch(user.id))

    const inviteEmbed = {
      color: 0xffffff,
      author: {
        name: user.username,
        icon_url: user.avatarURL,
      },
      fields: [
        {
          name: '> **[Room]**',
          value: `> **${member.voice.channel.name}**`,
          inline: true,
        },
        {
          name: '> **[Slot]**',
          value: `> **${member.voice.channel.members.size}/${
            member.voice.channel.userLimit == 0
              ? '∞'
              : member.voice.channel.userLimit
          }**`,
          inline: true,
        },
        {
          name: '> **[Rank]**',
          value: '> **' + (rank ?? 'Unranked') + '**',
          inline: true,
        },
        ...(msg
          ? [
              {
                name: '> **[Message]**',
                value: '> **' + msg + '**',
                inline: false,
              },
            ]
          : []),
      ],
      thumbnail: {
        url: rankChoices.find((choice) => choice.value === rank).image,
      },
      footer: {
        text: 'Cách sử dụng: /brim [rank] [msg]',
        icon_url:
          'https://media.discordapp.net/attachments/789783622902874148/901316520691515402/valorant.png',
      },
    }

    const invite = await member.voice.channel.createInvite({
      maxAge: 3600,
      maxUses: 0,
    })

    const inviteButton = {
      type: 2,
      style: 5,
      label: '🔊Tham gia tổ đội!',
      url: invite.url,
    }

    await interaction.editReply({
      embeds: [inviteEmbed],
      components: [
        {
          type: 1,
          components: [inviteButton],
        },
      ],
    })
  },
}
