
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const pkg = require('../package.json');

cmd({
    pattern: "uptime",
    alias: ["runtime", "run"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const uptime = runtime(process.uptime());
        const seconds = Math.floor(process.uptime());
        const startTime = new Date(Date.now() - seconds * 1000);
        const version = pkg.version || "1.0.0";

        const styles = [
`╭────『 *UPTIME* 』───╮
│ ╭╌┈┈┈┈┈┄┄┈╌┈⊷
│ ┆⏱️ ${uptime}
│ ┆🧭 ${seconds} seconds
│ ┆🚀 Started: ${startTime.toLocaleString()}
│ ╰┄┄┄┄┄┄┄┄┄┄┈ ┈⊷
╰────────────────╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀsᴛᴇʀᴛᴇᴄʜ-xᴅ*`,

`╭╼═⧼𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗧𝗔𝗧𝗨𝗦⧽═╾╮
┃╭╼═══════════━┈⊷
┃│♢ ʀᴜɴɴɪɴɢ: ${uptime}
┃│♢ sᴇᴄᴏɴᴅs: ${seconds}
┃│♢ sɪɴᴄᴇ: ${startTime.toLocaleDateString()}
┃╰╼════════════┈⊷
╰╼═══════════════╾╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀsᴛᴇʀᴛᴇᴄʜ-xᴅ*`,

`╭╼━━━━━━━━━━━━━━╾╮
│        *⟬ UPTIME STATUS ⟭*  
│╭┅┅┅┅┅┅┅┅┅┅┅╍⊷
││ • ᴛɪᴍᴇ: ${uptime}
││ • sᴇᴄᴏɴᴅs: ${seconds}
││ • sᴛᴀʀᴛᴇᴅ: ${startTime.toLocaleString()}
│╰┅┅┅┅┅┅┅┅┅┅┅┈⊷
╰╼━━━━━━━━━━━━━━╾╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀsᴛᴇʀᴛᴇᴄʜ-xᴅ*`,

`╭╼┅⧼ 🅤🅟🅣🅘🅜🅔 ⧽┉╾╮
┋ ⏳ ${uptime}
┋ 🕰️ ${startTime.toLocaleString()}
┋ 🔢 ${seconds} sᴇᴄᴏɴᴅs
╰╼┉┅┉┅┉┅┉┅┉┅┉╍┅╾╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀsᴛᴇʀᴛᴇᴄʜ-xᴅ*`,

`╭╼═══════════════╾╮
║  *MASTERTECH-XD V2 𝑼𝑷𝑻𝑰𝑴𝑬*
║  ʀᴜɴᴛɪᴍᴇ: ${uptime}
║  sᴇᴄᴏɴᴅs:: ${seconds}
║  sɪɴᴄᴇʀᴇʟʏ: ${startTime.toLocaleString()}
╰════════════════╾╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀsᴛᴇʀᴛᴇᴄʜ-xᴅ`,

`> ╭━━━━━━━━━━━━━━╾╮
> ┃⏱️ *UᎮTIMᏋ ᎦTᏘTUᎦ* ⏱️
> ┃🟢 ᴏɴʟɪɴᴇ ғᴏʀ: ${uptime}
> ┃🔢 sᴇᴄᴏɴᴅs: ${seconds}
> ┃📅 sɪɴᴄᴇ: ${startTime.toLocaleString()}
> ╰━━━━━━━━━━━━━━╾╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀsᴛᴇʀᴛᴇᴄʜ-xᴅ*`,

`╭━━━━━━━━━━━━━━━━╮
┃  MASTERTECH-XD V2 𝐔𝐏𝐓𝐈𝐌𝐄  
┃╭┅┅┅┅┅┅┅┅┅┅┉┉┈⊷
┃╏◈ ᴅᴜʀᴀᴛɪᴏɴ: ${uptime}
┃╏◈ sᴇᴄᴏɴᴅs: ${seconds}
┃╏◈ sᴛᴀʀᴛ ᴛɪᴍᴇs: ${startTime.toLocaleString()}
┃╏◈ sᴛᴀʙɪʟɪᴛʏ: 100%
┃╰┅┅┅┅┅┅┅┉┅┅┅┈⊷
╰━━━━━━━━━━━━━━━━╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀsᴛᴇʀᴛᴇᴄʜ-xᴅ*`
        ];

        let selectedStyle;
        if (args[0] && args[0].toLowerCase().startsWith("style")) {
            const index = parseInt(args[0].replace("style", "")) - 1;
            if (!isNaN(index) && styles[index]) {
                selectedStyle = styles[index];
            } else {
                return reply(`❌ Style not found.\n✅ Use: style1 to style${styles.length}`);
            }
        } else {
            selectedStyle = styles[Math.floor(Math.random() * styles.length)];
        }

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/1r2s5m.png' },
            caption: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363393631540851@newsletter',
                    newsletterName: 'MASTERTECH-XD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
