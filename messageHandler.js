const normalizeNames = val => val.replace(/[^A-Z0-9]+/ig, '').toLowerCase();

class MessageHandler {
  constructor(client) {
    this.client = client;
  }

  init() {
    this.client.on('message', msg => {
      if (msg.author.bot) return;
      switch (msg.channel.name) {
        case 'butcher-bot':
          this.roleRequest(msg);
          break;
        case 'region-role-request':
          this.roleRequest(msg);
          break;
        default:
          break;
      }
    });
  }
  
  roleRequest(msg) {
    const {
      content = '',
      member,
      guild
    } = msg;
    const allRoles = guild.roles;
    const match = /^([^\s]*)\s+(.*)/ig.exec(content);
    const reqType = match[1];
    const req = match[2];
    
    if (/^!characters?/.test(reqType)) { // Character role request
      const charReq = req.split(',').map(normalizeNames);
      // Character roles are identified by a specific color because there is no way to add meta data
      const characterRoleColor = 5533306;
      const charRoles = allRoles.filter(role => !role.deleted && (role.color === characterRoleColor));
      const charNames = charRoles.map(c => c.name);
      const helpMsg = `Requests **MUST** use the following format \`!character Sol, Ky, Potemkin, etc.\`
The options are as follows: **${charNames.join(', ')}**`;
      const newRoles = charReq
        .map(roleName => charRoles.find(char => normalizeNames(char.name) === roleName))
        .filter(val => !!val);
      const newRoleNames = newRoles.map(role => role.name);

      if (newRoles.length) {
        member.addRoles(newRoles)
          .then(response => {
            const noun = newRoles.length > 1 ? 'groups' : 'group';
            msg.reply(`You were added to the **${newRoleNames.join(', ')}** ${noun}`);
          })
          .catch(console.error);
      } else {
        msg.reply(helpMsg);
      }
    } else if (reqType.toLowerCase() === '!region') {
      
    }
  }
}

module.exports = MessageHandler;