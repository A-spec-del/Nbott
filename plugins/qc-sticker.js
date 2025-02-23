  
  /**
  * KyuuRzy
  * Instagram: @kyuubeyours
  * GitHub: @kiuur
  * base ori KyuuRzy :')
  **/

require('../setting/config');
const axios = require('axios')

let handler = async (m, { tex, text, reply, reaction, pushname, makeStickerFromUrl }) => {
        if (!text) return reply(`mana pesannya anjg, contoh: .qc peler`);
    await reaction(m.chat, '⚡')
        
        const obj = {
            type: 'quote',
            format: 'png',
            backgroundColor: '#232023',
            width: 512,
            height: 768,
            scale: 2,
            messages: [{
                entities: [],
                avatar: true,
                from: {
                    id: 1,
                    name: `${pushname}`,
                    photo: {
                        url: await tex.profilePictureUrl(m.sender, "image").catch(() => 
                            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                        ),
                    }
                },
                text: text,
                replyMessage: {},
            }],
        };

        const response = await axios.post('https://bot.lyo.su/quote/generate', obj, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const buffer = Buffer.from(response.data.result.image, 'base64');
        const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
        await makeStickerFromUrl(dataUrl, tex, m);
    }

handler.help = ['qc']
handler.tags = ['sticker']
handler.command = ['qc']

module.exports = handler