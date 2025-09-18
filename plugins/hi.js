 const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "creator",
    alias: ["creator", "coder", "dev"],
    desc: "Show bot creator information",
    category: "info",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Owner information (you can modify these values)
        const ownerInfo = {
            name: "MASTERPEACE ELITE",
            number: "+254743727510",
            photo: "https://files.catbox.moe/cn9yiq.jpg",
            bio: "The creator of this dynamic bot"
        };

        // Beautiful formatted message
        const creatorMessage = `
╭───「 👑 *CREATOR INFO* 👑 」───
│
│ *🪪 Name:* ${ownerInfo.name}
│ *📸 Photo:* ${ownerInfo.photo}
│ *📞 Number:* ${ownerInfo.number}
│ *📝 Bio:* ${ownerInfo.bio}
│ *💼 Role:* Bot Developer & Maintainer
│ *🔖 Prefix:* ${config.PREFIX}
│ *🌐 Mode:* ${config.MODE}
│
│ *🤖 Bot Name:* ${config.BOT_NAME}
│ *⚡ Version:* ${config.VERSION || "2.0.0"}
│
╰─────────────────────

💡 *Contact for bot queries or support*`;

        // Send message with owner photo
        await conn.sendMessage(from, {
            image: { url: ownerInfo.photo },
            caption: creatorMessage,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Creator Command Error:", e);
        // Fallback text if image fails
        await reply(`👑 *Creator Info*\n\nName: Masterpeace Elite\nNumber: +254743727510\n\nContact for bot support!`);
    }
});
