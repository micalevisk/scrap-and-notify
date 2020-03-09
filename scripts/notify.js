const Slimbot = require('slimbot')

const {
  // Make your bot here: https://t.me/BotFather and start a new chat
  TELEGRAM_BOT_TOKEN,
  // and get your user chat_id here: https://t.me/chatid_echo_bot
  TELEGRAM_CHAT_ID,
} = process.env

if (process.argv.length !== 3) {
  throw new Error('Missing the text to send arg.')
}

const tgBot = new Slimbot(TELEGRAM_BOT_TOKEN)
const textToSend = process.argv[2]
sendMessageToChat(textToSend, TELEGRAM_CHAT_ID).then(() => console.info('Message sent!'))

/**
 *
 * @param {string} message
 * @param {string} chatId
 */
function sendMessageToChat(message, chatId) {
  console.info(`Will send the text '${message}' to chat ${chatId}...`)
  return tgBot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    disable_notification: true,
  })
}
