  
  /**
  * KyuuRzy
  * Instagram: @kyuubeyours
  * GitHub: @kiuur
  * base ori KyuuRzy :')
  **/

require('../setting/config');
const fs = require('fs')

let handler = async (m, { tex, text, reply }) => {
  reply('tunggu sebentar, proses getting creds.json')
  let sesi = await fs.readFileSync('./session/creds.json')
  return await tex.sendMessage(m.chat, { 
    document: sesi, 
    mimetype: 'application/json', 
    fileName: 'creds.json' 
  }, { quoted: m })
}

handler.help = ['getsession']
handler.tags = ['owner']
handler.command = ['getsesi', 'getsession']
handler.owner = true

module.exports = handler