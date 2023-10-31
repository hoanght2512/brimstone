const { Collection } = require('discord.js')
const { readdirSync } = require('fs')
const path = require('path')

client.commands = new Collection()
commandsList = []

// load all commands from subfolders
const commandFolders = readdirSync('./commands')

console.log(`Loading commands...`)

for (const folder of commandFolders) {
  const commandFiles = readdirSync(`./commands/${folder}`).filter((file) =>
    file.endsWith('.js')
  )
  for (const file of commandFiles) {
    const command = require(`../commands/${folder}/${file}`)
    client.commands.set(command.name, command)
    commandsList.push(command)
  }
}

console.log(`=> [Loaded ${commandsList.length} commands]`)

const events = readdirSync('./events/').filter((file) => file.endsWith('.js'))

for (const file of events) {
  const event = require(`../events/${file}`)
  client.on(file.split('.')[0], event.bind(null, client))
  delete require.cache[require.resolve(`../events/${file}`)]
}

console.log(`=> [Loaded ${events.length} events]`)

client.on('ready', (client) => {
  client.application.commands.set(commandsList)
})
