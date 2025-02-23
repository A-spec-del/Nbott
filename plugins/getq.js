  
  /**
  * KyuuRzy
  * Instagram: @kyuubeyours
  * GitHub: @kiuur
  * base ori KyuuRzy :')
  **/

const kripto = require("crypto")
const fs = require("fs")

let handler = async (m, { tex, prefix, reply }) => {
    if (!m.quoted) return reply(`reply pesan yang quotednya mau diambil`);
    let penis = JSON.stringify({ [m.quoted.mtype]: m.quoted }, null, 2);
    let jeneng = `MessageData_${kripto.randomBytes(8).toString('hex')}.json`
    await fs.writeFileSync(jeneng, penis);  
    await tex.sendMessage(m.chat, { 
        document: { url: `./${jeneng}` }, 
        fileName: jeneng,
        mimetype: '*/*'
    }, { quoted: m });
        await fs.unlinkSync(jeneng);
}
    
handler.help = ['getquoted'];
handler.tags = ['owner'];
handler.command = ["getq"];
handler.owner = true;

module.exports = handler;
