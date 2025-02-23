console.log("starting...");
require("./setting/config");
process.on("uncaughtException", console.error);
const {
  default: makeWASocket,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
  getContentType,
  jidDecode,
  MessageRetryMap,
  getAggregateVotesInPollMessage,
  proto,
  delay
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const readline = require("readline");
const fs = require("fs");
const chalk = require("chalk");
const _ = require("lodash");
const util = require("util");
const path = require("path");
const fetch = require("node-fetch");
const FileType = require("file-type");
const {
  Boom
} = require("@hapi/boom");
const NodeCache = require("node-cache");
const PhoneNumber = require("awesome-phonenumber");
const syntax = require("syntax-error");
const msgRetryCounterCache = new NodeCache();
const retryCache = new NodeCache({
  stdTTL: 30,
  checkperiod: 20
});
const sendCache = new NodeCache({
  stdTTL: 30,
  checkperiod: 20
});
const {
  color
} = require("./start/lib/color");
const {
  smsg,
  sendGmail,
  formatSize,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  runtime,
  fetchJson,
  sleep
} = require("./start/lib/myfunction");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require("./start/lib/exif");
const usePairingCode = true;
const question = _0x145e8e => {
  const _0x481b19 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(_0x437445 => {
    _0x481b19.question(_0x145e8e, _0x437445);
  });
};
const low = require("./start/lib/lowdb");
const yargs = require("yargs/yargs");
const {
  Low,
  JSONFile
} = low;
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.db = new Low(/https?:\/\//.test(opts.db || "") ? new cloudDBAdapter(opts.db) : /mongodb/.test(opts.db) ? new mongoDB(opts.db) : new JSONFile("./tmp/database.json"));
global.db = new Low(db);
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise(_0x58e859 => setInterval(function () {
      if (!global.db.READ) {
        clearInterval(this);
        _0x58e859(global.db.data == null ? global.loadDatabase() : global.db.data);
      } else {
        null;
      }
    }, 1000));
  }
  if (global.db.data !== null) {
    return;
  }
  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  };
  global.db.chain = _.chain(global.db.data);
};
global.loadDatabase();
async function clientstart() {
  const {
    state: _0x129d39,
    saveCreds: _0x5e31df
  } = await useMultiFileAuthState("session");
  const _0x2d2ad4 = makeWASocket({
    printQRInTerminal: !usePairingCode,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: _0x3f0458 => {
      const _0x43ed20 = !!_0x3f0458.buttonsMessage || !!_0x3f0458.templateMessage || !!_0x3f0458.listMessage;
      if (_0x43ed20) {
        _0x3f0458 = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {}
              },
              ..._0x3f0458
            }
          }
        };
      }
      return _0x3f0458;
    },
    version: (await (await fetch("https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json")).json()).version,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    logger: pino({
      level: "fatal"
    }),
    auth: {
      creds: _0x129d39.creds,
      keys: makeCacheableSignalKeyStore(_0x129d39.keys, pino().child({
        level: "silent",
        stream: "store"
      }))
    }
  });
  if (!_0x2d2ad4.authState.creds.registered) {
    const _0x3aa101 = await question("𝗛𝗘𝗥𝗘 𝗜𝗦 𝗠𝗬 𝗖𝗥𝗘𝗔𝗧𝗘𝗥 +923466586515 : 𝗣𝗟𝗭 𝗘𝗡𝗧𝗘𝗥 𝗬𝗢𝗨𝗥 𝗡𝗨𝗠𝗕𝗘𝗥  92𝘅𝘅𝘅:\n");
    const _0x4a9a7e = await _0x2d2ad4.requestPairingCode(_0x3aa101.trim());
    console.log(chalk.blue.bold("your pairing code: " + _0x4a9a7e));
  }
  const _0x56516c = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store"
    })
  });
  _0x56516c.bind(_0x2d2ad4.ev);
  _0x2d2ad4.ev.on("messages.upsert", async _0x5d7f1a => {
    try {
      let _0x19c803 = _0x5d7f1a.messages[0];
      if (!_0x19c803.message) {
        return;
      }
      _0x19c803.message = Object.keys(_0x19c803.message)[0] === "ephemeralMessage" ? _0x19c803.message.ephemeralMessage.message : _0x19c803.message;
      if (_0x19c803.key && _0x19c803.key.remoteJid === "status@broadcast") {
        return;
      }
      if (!_0x2d2ad4.public && !_0x19c803.key.fromMe && _0x5d7f1a.type === "notify") {
        return;
      }
      let _0x15cf2d = smsg(_0x2d2ad4, _0x19c803, _0x56516c);
      require("./start/nadirv26")(_0x2d2ad4, _0x15cf2d, _0x5d7f1a, _0x19c803, _0x56516c);
    } catch (_0x2d534d) {
      console.log(chalk.yellow.bold("[ ERROR ] nadirv26.js :\n") + chalk.redBright(util.format(_0x2d534d)));
    }
  });
  _0x2d2ad4.decodeJid = _0x1787f2 => {
    if (!_0x1787f2) {
      return _0x1787f2;
    }
    if (/:\d+@/gi.test(_0x1787f2)) {
      let _0x510b85 = jidDecode(_0x1787f2) || {};
      return _0x510b85.user && _0x510b85.server && _0x510b85.user + "@" + _0x510b85.server || _0x1787f2;
    } else {
      return _0x1787f2;
    }
  };
  _0x2d2ad4.ev.on("contacts.update", _0x19b35e => {
    for (let _0x4f5fb1 of _0x19b35e) {
      let _0x205e15 = _0x2d2ad4.decodeJid(_0x4f5fb1.id);
      if (_0x56516c && _0x56516c.contacts) {
        _0x56516c.contacts[_0x205e15] = {
          id: _0x205e15,
          name: _0x4f5fb1.notify
        };
      }
    }
  });
  _0x2d2ad4.sendTextWithMentions = async (_0x4fb5b8, _0x1bbecf, _0x43917d, _0x2f8e22 = {}) => _0x2d2ad4.sendMessage(_0x4fb5b8, {
    text: _0x1bbecf,
    contextInfo: {
      mentionedJid: [..._0x1bbecf.matchAll(/@(\d{0,16})/g)].map(_0x3b92f3 => _0x3b92f3[1] + "@s.whatsapp.net")
    },
    ..._0x2f8e22
  }, {
    quoted: _0x43917d
  });
  _0x2d2ad4.sendImageAsSticker = async (_0x508ae3, _0x2d812f, _0x260f63, _0x2faf37 = {}) => {
    let _0xa5163b = Buffer.isBuffer(_0x2d812f) ? _0x2d812f : /^data:.*?\/.*?;base64,/i.test(_0x2d812f) ? Buffer.from(_0x2d812f.split`, `[1], "base64") : /^https?:\/\//.test(_0x2d812f) ? await await getBuffer(_0x2d812f) : fs.existsSync(_0x2d812f) ? fs.readFileSync(_0x2d812f) : Buffer.alloc(0);
    let _0x6fde9a;
    if (_0x2faf37 && (_0x2faf37.packname || _0x2faf37.author)) {
      _0x6fde9a = await writeExifImg(_0xa5163b, _0x2faf37);
    } else {
      _0x6fde9a = await imageToWebp(_0xa5163b);
    }
    await _0x2d2ad4.sendMessage(_0x508ae3, {
      sticker: {
        url: _0x6fde9a
      },
      ..._0x2faf37
    }, {
      quoted: _0x260f63
    });
    return _0x6fde9a;
  };
  _0x2d2ad4.sendVideoAsSticker = async (_0x5c1f9d, _0x4621f5, _0x1697fb, _0x16a5d6 = {}) => {
    let _0x488f53 = Buffer.isBuffer(_0x4621f5) ? _0x4621f5 : /^data:.*?\/.*?;base64,/i.test(_0x4621f5) ? Buffer.from(_0x4621f5.split`, `[1], "base64") : /^https?:\/\//.test(_0x4621f5) ? await await getBuffer(_0x4621f5) : fs.existsSync(_0x4621f5) ? fs.readFileSync(_0x4621f5) : Buffer.alloc(0);
    let _0x5a4581;
    if (_0x16a5d6 && (_0x16a5d6.packname || _0x16a5d6.author)) {
      _0x5a4581 = await writeExifVid(_0x488f53, _0x16a5d6);
    } else {
      _0x5a4581 = await videoToWebp(_0x488f53);
    }
    await _0x2d2ad4.sendMessage(_0x5c1f9d, {
      sticker: {
        url: _0x5a4581
      },
      ..._0x16a5d6
    }, {
      quoted: _0x1697fb
    });
    return _0x5a4581;
  };
  _0x2d2ad4.downloadAndSaveMediaMessage = async (_0x5e4090, _0x52b079, _0x5ce60c = true) => {
    let _0x4cb78e = _0x5e4090.msg ? _0x5e4090.msg : _0x5e4090;
    let _0x49a7cc = (_0x5e4090.msg || _0x5e4090).mimetype || "";
    let _0x934497 = _0x5e4090.mtype ? _0x5e4090.mtype.replace(/Message/gi, "") : _0x49a7cc.split("/")[0];
    const _0x12210a = await downloadContentFromMessage(_0x4cb78e, _0x934497);
    let _0x54c769 = Buffer.from([]);
    for await (const _0xd51039 of _0x12210a) {
      _0x54c769 = Buffer.concat([_0x54c769, _0xd51039]);
    }
    let _0x2eef2e = await FileType.fromBuffer(_0x54c769);
    let _0x427ad2 = _0x5ce60c ? _0x52b079 + "." + _0x2eef2e.ext : _0x52b079;
    await fs.writeFileSync(_0x427ad2, _0x54c769);
    return _0x427ad2;
  };
  _0x2d2ad4.getName = (_0xd6f93f, _0x206a4c = false) => {
    let _0x33af36 = _0x2d2ad4.decodeJid(_0xd6f93f);
    _0x206a4c = _0x2d2ad4.withoutContact || _0x206a4c;
    let _0x572991;
    if (_0x33af36.endsWith("@g.us")) {
      return new Promise(async _0x22951f => {
        _0x572991 = _0x56516c.contacts[_0x33af36] || {};
        if (!_0x572991.name && !_0x572991.subject) {
          _0x572991 = _0x2d2ad4.groupMetadata(_0x33af36) || {};
        }
        _0x22951f(_0x572991.name || _0x572991.subject || PhoneNumber("+" + _0x33af36.replace("@s.whatsapp.net", "")).getNumber("international"));
      });
    } else {
      _0x572991 = _0x33af36 === "0@s.whatsapp.net" ? {
        id: _0x33af36,
        name: "WhatsApp"
      } : _0x33af36 === _0x2d2ad4.decodeJid(_0x2d2ad4.user.id) ? _0x2d2ad4.user : _0x56516c.contacts[_0x33af36] || {};
    }
    return (_0x206a4c ? "" : _0x572991.name) || _0x572991.subject || _0x572991.verifiedName || PhoneNumber("+" + _0xd6f93f.replace("@s.whatsapp.net", "")).getNumber("international");
  };
  _0x2d2ad4.sendContact = async (_0x22b16c, _0x2e5494, _0x316f55 = "", _0x2becc2 = {}) => {
    let _0x30c27b = [];
    for (let _0x181fbf of _0x2e5494) {
      _0x30c27b.push({
        displayName: await _0x2d2ad4.getName(_0x181fbf),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:" + (await _0x2d2ad4.getName(_0x181fbf)) + "\nFN:" + (await _0x2d2ad4.getName(_0x181fbf)) + "\nitem1.TEL;waid=" + _0x181fbf + ":" + _0x181fbf + "\nitem1.X-ABLabel:jangan spam bang\nitem2.EMAIL;type=INTERNET:kyuurzy\nitem2.X-ABLabel:YouTube\nitem3.URL:kyuurzy.tech\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      });
    }
    _0x2d2ad4.sendMessage(_0x22b16c, {
      contacts: {
        displayName: _0x30c27b.length + " Contact",
        contacts: _0x30c27b
      },
      ..._0x2becc2
    }, {
      quoted: _0x316f55
    });
  };
  _0x2d2ad4.serializeM = _0x3d5466 => smsg(_0x2d2ad4, _0x3d5466, _0x56516c);
  _0x2d2ad4.copyNForward = async (_0x1a83a9, _0x3f5b60, _0x183a50 = false, _0x1cddd8 = {}) => {
    let _0x5526cd;
    if (_0x1cddd8.readViewOnce) {
      _0x3f5b60.message = _0x3f5b60.message?.ephemeralMessage?.message || _0x3f5b60.message;
      _0x5526cd = Object.keys(_0x3f5b60.message.viewOnceMessage.message)[0];
      delete _0x3f5b60.message.viewOnceMessage.message[_0x5526cd].viewOnce;
      _0x3f5b60.message = {
        ..._0x3f5b60.message.viewOnceMessage.message
      };
    }
    let _0xf6670a = Object.keys(_0x3f5b60.message)[0];
    let _0x15a2d5 = await generateForwardMessageContent(_0x3f5b60, _0x183a50);
    let _0x1f8c37 = Object.keys(_0x15a2d5)[0];
    let _0x44f444 = {};
    if (_0xf6670a != "conversation") {
      _0x44f444 = _0x3f5b60.message[_0xf6670a].contextInfo;
    }
    _0x15a2d5[_0x1f8c37].contextInfo = {
      ..._0x44f444,
      ..._0x15a2d5[_0x1f8c37].contextInfo
    };
    const _0x3148e4 = await generateWAMessageFromContent(_0x1a83a9, _0x15a2d5, _0x1cddd8 ? {
      ..._0x15a2d5[_0x1f8c37],
      ..._0x1cddd8,
      ...(_0x1cddd8.contextInfo ? {
        contextInfo: {
          ..._0x15a2d5[_0x1f8c37].contextInfo,
          ..._0x1cddd8.contextInfo
        }
      } : {})
    } : {});
    await _0x2d2ad4.relayMessage(_0x1a83a9, _0x3148e4.message, {
      messageId: _0x3148e4.key.id
    });
    return _0x3148e4;
  };
  function _0x4dd340(_0x14db23) {
    const _0x382ade = Object.keys(_0x14db23);
    var _0x5e6304 = !["senderKeyDistributionMessage", "messageContextInfo"].includes(_0x382ade[0]) && _0x382ade[0] || _0x382ade.length >= 3 && _0x382ade[1] !== "messageContextInfo" && _0x382ade[1] || _0x382ade[_0x382ade.length - 1] || Object.keys(_0x14db23)[0];
    return _0x5e6304;
  }
  const _0x6ef7ad = {
    upload: _0x2d2ad4.waUploadToServer
  };
  _0x2d2ad4.prefa = "hah?";
  _0x2d2ad4.public = global.status;
  _0x2d2ad4.serializeM = _0x5d5fb0 => smsg(_0x2d2ad4, _0x5d5fb0, _0x56516c);
  _0x2d2ad4.ev.on("connection.update", async _0x1e256a => {
    let {
      Connecting: _0x298c88
    } = require("./start/lib/connection/connect.js");
    _0x298c88({
      update: _0x1e256a,
      tex: _0x2d2ad4,
      Boom: Boom,
      DisconnectReason: DisconnectReason,
      sleep: sleep,
      color: color,
      clientstart: clientstart
    });
  });
  _0x2d2ad4.ev.on("group-participants.update", async _0x420e38 => {
    if (global.welcome) {
      console.log(_0x420e38);
      let _0x37671b = await _0x2d2ad4.decodeJid(_0x2d2ad4.user.id);
      if (_0x420e38.participants.includes(_0x37671b)) {
        return;
      }
      try {
        let _0x56f602 = await _0x2d2ad4.groupMetadata(_0x420e38.id);
        let _0x4b29cc = _0x56f602.subject;
        let _0x49117c = _0x420e38.participants;
        for (let _0x144ed6 of _0x49117c) {
          let _0x3ce4e8 = _0x420e38.author !== _0x144ed6 && _0x420e38.author.length > 1;
          let _0x37fbf1 = _0x3ce4e8 ? [_0x420e38.author, _0x144ed6] : [_0x144ed6];
          try {
            ppuser = await _0x2d2ad4.profilePictureUrl(_0x144ed6, "image");
          } catch {
            ppuser = "https://pomf2.lain.la/f/dynqtljb.jpg";
          }
          if (_0x420e38.action == "add") {
            _0x2d2ad4.sendMessage(_0x420e38.id, {
              text: _0x3ce4e8 ? "hello @" + _0x144ed6.split("@")[0] + " welcome to *" + _0x4b29cc + "*" : "hello @" + _0x144ed6.split("@")[0] + " welcome to *" + _0x4b29cc + "*",
              contextInfo: {
                mentionedJid: [..._0x37fbf1],
                externalAdReply: {
                  thumbnailUrl: "https://pomf2.lain.la/f/ic51evmj.jpg",
                  title: "© Welcome Message",
                  body: "",
                  renderLargerThumbnail: true,
                  sourceUrl: global.linkch,
                  mediaType: 1
                }
              }
            });
          }
          if (_0x420e38.action == "remove") {
            _0x2d2ad4.sendMessage(_0x420e38.id, {
              text: _0x3ce4e8 ? "@" + _0x144ed6.split("@")[0] + " has left group *" + _0x4b29cc + "*" : "@" + _0x144ed6.split("@")[0] + " has left group *" + _0x4b29cc + "*",
              contextInfo: {
                mentionedJid: [..._0x37fbf1],
                externalAdReply: {
                  thumbnailUrl: "https://pomf2.lain.la/f/7afhwfrz.jpg",
                  title: "© Leaving Message",
                  body: "",
                  renderLargerThumbnail: true,
                  sourceUrl: global.linkch,
                  mediaType: 1
                }
              }
            });
          }
          if (_0x420e38.action == "promote") {
            _0x2d2ad4.sendMessage(_0x420e38.id, {
              text: "@" + _0x420e38.author.split("@")[0] + " has made @" + _0x144ed6.split("@")[0] + " as admin of this group",
              contextInfo: {
                mentionedJid: [..._0x37fbf1],
                externalAdReply: {
                  thumbnailUrl: "https://pomf2.lain.la/f/ibiu2td5.jpg",
                  title: "© Promote Message",
                  body: "",
                  renderLargerThumbnail: true,
                  sourceUrl: global.linkch,
                  mediaType: 1
                }
              }
            });
          }
          if (_0x420e38.action == "demote") {
            _0x2d2ad4.sendMessage(_0x420e38.id, {
              text: "@" + _0x420e38.author.split("@")[0] + " has removed @" + _0x144ed6.split("@")[0] + " as admin of this group",
              contextInfo: {
                mentionedJid: [..._0x37fbf1],
                externalAdReply: {
                  thumbnailUrl: "https://pomf2.lain.la/f/papz9tat.jpg",
                  title: "© Demote Message",
                  body: "",
                  renderLargerThumbnail: true,
                  sourceUrl: global.linkch,
                  mediaType: 1
                }
              }
            });
          }
        }
      } catch (_0x49dfb4) {
        console.log(_0x49dfb4);
      }
    }
  });
  _0x2d2ad4.sendButtonImg = async (_0x54c51d, _0x3da5ce = [], _0x569dfe, _0x1d75c4, _0x3c854d, _0x97c611 = "", _0x44141d = {}) => {
    const _0x4506bb = {
      image: {
        url: _0x1d75c4
      },
      caption: _0x569dfe,
      footer: _0x3c854d,
      buttons: _0x3da5ce.map(_0xfd9d44 => ({
        buttonId: _0xfd9d44.id || "",
        buttonText: {
          displayText: _0xfd9d44.text || "Button"
        },
        type: _0xfd9d44.type || 1
      })),
      headerType: 1,
      viewOnce: _0x44141d.viewOnce || false
    };
    _0x2d2ad4.sendMessage(_0x54c51d, _0x4506bb, {
      quoted: _0x97c611
    });
  };
  _0x2d2ad4.sendList = async (_0x46530f, _0x426201, _0x328e12, _0x330af3, _0x4dc671 = "", _0x28d861 = {}) => {
    let _0x10b7ca = generateWAMessageFromContent(_0x46530f, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            ..._0x28d861,
            body: proto.Message.InteractiveMessage.Body.create({
              text: _0x426201
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: _0x328e12 || "puqi"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [{
                name: "single_select",
                buttonParamsJson: JSON.stringify(_0x330af3)
              }]
            })
          })
        }
      }
    }, {
      quoted: _0x4dc671
    });
    return await _0x2d2ad4.relayMessage(_0x10b7ca.key.remoteJid, _0x10b7ca.message, {
      messageId: _0x10b7ca.key.id
    });
  };
  _0x2d2ad4.sendListImg = async (_0x1285fd, _0x31ebd0, _0xebddb9, _0x117b9a, _0x5a5d7a, _0x2d3700 = "", _0x336617 = {}) => {
    const _0x351b55 = await prepareWAMessageMedia({
      image: {
        url: _0x117b9a
      }
    }, {
      upload: _0x2d2ad4.waUploadToServer
    });
    let _0x557ef9 = generateWAMessageFromContent(_0x1285fd, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            ..._0x336617,
            body: proto.Message.InteractiveMessage.Body.create({
              text: _0x31ebd0
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: _0xebddb9 || "puqi"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ..._0x351b55
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [{
                name: "single_select",
                buttonParamsJson: JSON.stringify(_0x5a5d7a)
              }]
            })
          })
        }
      }
    }, {
      quoted: _0x2d3700
    });
    return await _0x2d2ad4.relayMessage(_0x557ef9.key.remoteJid, _0x557ef9.message, {
      messageId: _0x557ef9.key.id
    });
  };
  _0x2d2ad4.sendButtonProto = async (_0x1d6f9b, _0x44b128, _0x161b5b, _0x438b9a = [], _0x5dddf0 = "", _0x4d42fd = {}) => {
    let _0x26dbb0 = generateWAMessageFromContent(_0x1d6f9b, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            ..._0x4d42fd,
            body: proto.Message.InteractiveMessage.Body.create({
              text: _0x44b128
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: _0x161b5b || "puqi"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: _0x438b9a
            })
          })
        }
      }
    }, {
      quoted: _0x5dddf0
    });
    return await _0x2d2ad4.relayMessage(_0x26dbb0.key.remoteJid, _0x26dbb0.message, {
      messageId: _0x26dbb0.key.id
    });
  };
  _0x2d2ad4.ments = (_0x4e88cf = "") => {
    if (_0x4e88cf.match("@")) {
      return [..._0x4e88cf.matchAll(/@([0-9]{5,16}|0)/g)].map(_0x2e140f => _0x2e140f[1] + "@s.whatsapp.net");
    } else {
      return [];
    }
  };
  _0x2d2ad4.cMod = (_0x82a66c, _0x50032b, _0x40d644 = "", _0x1bdfa2 = _0x2d2ad4.user.id, _0xfa323 = {}) => {
    let _0x3a59ac = Object.keys(_0x50032b.message)[0];
    let _0x2a3db0 = _0x3a59ac === "ephemeralMessage";
    if (_0x2a3db0) {
      _0x3a59ac = Object.keys(_0x50032b.message.ephemeralMessage.message)[0];
    }
    let _0x3f20f9 = _0x2a3db0 ? _0x50032b.message.ephemeralMessage.message : _0x50032b.message;
    let _0x1c2579 = _0x3f20f9[_0x3a59ac];
    if (typeof _0x1c2579 === "string") {
      _0x3f20f9[_0x3a59ac] = _0x40d644 || _0x1c2579;
    } else if (_0x1c2579.caption) {
      _0x1c2579.caption = _0x40d644 || _0x1c2579.caption;
    } else if (_0x1c2579.text) {
      _0x1c2579.text = _0x40d644 || _0x1c2579.text;
    }
    if (typeof _0x1c2579 !== "string") {
      _0x3f20f9[_0x3a59ac] = {
        ..._0x1c2579,
        ..._0xfa323
      };
    }
    if (_0x50032b.key.participant) {
      _0x1bdfa2 = _0x50032b.key.participant = _0x1bdfa2 || _0x50032b.key.participant;
    } else if (_0x50032b.key.participant) {
      _0x1bdfa2 = _0x50032b.key.participant = _0x1bdfa2 || _0x50032b.key.participant;
    }
    if (_0x50032b.key.remoteJid.includes("@s.whatsapp.net")) {
      _0x1bdfa2 = _0x1bdfa2 || _0x50032b.key.remoteJid;
    } else if (_0x50032b.key.remoteJid.includes("@broadcast")) {
      _0x1bdfa2 = _0x1bdfa2 || _0x50032b.key.remoteJid;
    }
    _0x50032b.key.remoteJid = _0x82a66c;
    _0x50032b.key.fromMe = _0x1bdfa2 === _0x2d2ad4.user.id;
    return proto.WebMessageInfo.fromObject(_0x50032b);
  };
  _0x2d2ad4.sendText = (_0x444244, _0x10aa3d, _0x3b2b60 = "", _0x44138b) => _0x2d2ad4.sendMessage(_0x444244, {
    text: _0x10aa3d,
    ..._0x44138b
  }, {
    quoted: _0x3b2b60
  });
  _0x2d2ad4.deleteMessage = async (_0x1cd343, _0x233728) => {
    try {
      await _0x2d2ad4.sendMessage(_0x1cd343, {
        delete: _0x233728
      });
      console.log("Pesan dihapus: " + _0x233728.id);
    } catch (_0x2838ea) {
      console.error("Gagal menghapus pesan:", _0x2838ea);
    }
  };
  _0x2d2ad4.downloadMediaMessage = async _0x463d60 => {
    let _0x23ae6d = (_0x463d60.msg || _0x463d60).mimetype || "";
    let _0x335018 = _0x463d60.mtype ? _0x463d60.mtype.replace(/Message/gi, "") : _0x23ae6d.split("/")[0];
    const _0x4442a0 = await downloadContentFromMessage(_0x463d60, _0x335018);
    let _0x4adf6c = Buffer.from([]);
    for await (const _0x579fa7 of _0x4442a0) {
      _0x4adf6c = Buffer.concat([_0x4adf6c, _0x579fa7]);
    }
    return _0x4adf6c;
  };
  _0x2d2ad4.ev.on("creds.update", _0x5e31df);
  _0x2d2ad4.serializeM = _0x37e91d => smsg(_0x2d2ad4, _0x37e91d, _0x56516c);
  return _0x2d2ad4;
}
clientstart();
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update " + __filename));
  delete require.cache[file];
  require(file);
});