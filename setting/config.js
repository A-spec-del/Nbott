const fs = require('fs')

/** info id **/
global.owner = "2348024322741@s.whatsapp.net"
global.idch = "nadir-md"

/** your dad nadir md **/
global.status = true
global.welcome = true
global.antispam = true
global.autoread = true

/** sticker watermark **/
global.packname = 'nadir-md'
global.author = 'nadir-md'

/** nadir-md **/
global.linkch = ''

/** nadir-md **/
global.gcount = {
    prem : 500,
    user: 15
}

/** limit **/
global.limitCount = 10,

/** message **/
global.mess = {
    group: "only group",
    admin: "only admin nadir-md",
    owner: "lawak, bukan owner",
    premium: "only user premium",
    botadmin: "bot admin only",
    limited: "don't cross limt",
    private: " private chat"
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
