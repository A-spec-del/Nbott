  
  /**
  * KyuuRzy
  * Instagram: @kyuubeyours
  * GitHub: @kiuur
  * base ori KyuuRzy :')
  **/

require('../setting/config');
const { readdirSync, statSync, unlinkSync } = require('fs');
const { join } = require('path');

let handler = async (m, { tex, prefix, reply, args }) => {
  const sesi = ['./session'];
  const array = [];

  sesi.forEach(dirname => {
    readdirSync(dirname).forEach(file => {
      if (file !== 'creds.json') { 
        array.push(join(dirname, file));
      }
    });
  });

  const deletedFiles = [];

  array.forEach(file => {
    const stats = statSync(file);

    if (stats.isDirectory()) {
      console.log(`skipping directory: ${file}`);
    } else {
      unlinkSync(file);
      deletedFiles.push(file);
    }
  });

  reply('success');

  if (deletedFiles.length > 0) {
    console.log('Deleted files:', deletedFiles);
  }

  if (deletedFiles.length == 0) {
    reply('tidak ada file yang tersisa di folder sessions');
  }
};

handler.help = ['clearsession'];
handler.tags = ['owner'];
handler.command = ["csesi", "clearsesi"];
handler.owner = true;

module.exports = handler;
