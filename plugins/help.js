const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

const helpCommand = {
    name: 'help',
    alias: ['h', 'menu'],
    desc: 'Get detailed information about a specific command',
    category: 'general',
    filename: __filename,
    use: 'Type .help <command name> to get info about a specific command'
};

cmd(helpCommand, async (m, sock, msg, { args, reply }) => {
    await m.sendReadReceipt(msg.remoteJid, { react: { text: '📖', key: msg.key } });
    
    try {
        if (!args[0]) {
            return reply('❌ Please specify a command.\n\nExample: *' + config.PREFIX + 'help menu*\n\nUse *' + config.PREFIX + 'menu* to view all commands.');
        }
        
        const commandName = args[0].toLowerCase();
        const command = Object.values(commands).find(cmd => 
            cmd.name === commandName || (cmd.alias && cmd.alias.includes(commandName))
        );
        
        if (!command) {
            return reply('❌ Command *' + commandName + '* not found.\n\nUse *' + config.PREFIX + 'menu* to view all available commands.');
        }
        
        let helpText = '╭───『 *HELP INFO* 』───⳹\n│\n' +
            '┃▸📄 *COMMAND NAME*: ' + command.name + '\n' +
            '┃▸❕ *DESCRIPTION*: ' + (command.desc || 'No description available') + '\n' +
            '┃▸📂 *CATEGORY*: ' + (command.category || 'Uncategorized') + '\n' +
            '┃▸🔹 *ALIASES*: ' + (command.alias?.length ? command.alias.map(a => '.' + a).join(', ') : 'None') + '\n';
            
        if (command.use) {
            helpText += '┃▸💡 *USAGE*: ' + config.PREFIX + command.name + ' ' + command.use + '\n';
        }
        
        helpText += '│\n╰─────────────────────────\n\n' +
            '📝 *Note*: Don\'t include <> when using commands.';
            
        reply(helpText);
        
    } catch (error) {
        console.error(error);
        reply('❌ An error occurred while fetching command information.');
    }
});