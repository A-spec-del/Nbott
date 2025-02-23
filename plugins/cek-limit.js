 
   /**
  * KyuuRzy
  * Instagram: @kyuubeyours
  * GitHub: @kiuur
  * base ori KyuuRzy :')
  **/
  
require('../setting/config');
const axios = require('axios')

let handler = async (m, { tex, text, reply, users, Access, isPremium, isBan }) => {
    if (isBan) return
    let limitnya = users.limit
    reply(`— information users
 ▢ limit : ${limitnya}
 ▢ status : ${Access ? "owner" : "user"}
 ▢ user : ${isPremium ? 'premium' : 'free'}`)
}

handler.help = ['cek limit'];
handler.tags = ['users'];
handler.command = ["limit", "cek-limit"];

module.exports = handler;
