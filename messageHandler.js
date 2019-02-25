const roleRequests = require('./roleRequests');

class MessageHandler {
  constructor(client) {
    this.client = client;
  }

  init() {
    this.client.on('message', msg => {
      if (msg.author.bot) return;
      switch (msg.channel.name) {
        case 'butcher-bot':
        case 'region-role-request':
          this.roleRequest(msg);
          break;
        default:
          break;
      }
    });
  }
  
  roleRequest(msg) {
    const allRoles = msg.guild.roles;
    const re = /^!([^\s]+)\s+(.+)$/ig;
    const match = re.exec(msg.content);

    if (!match) return;

    const reqType = match[1].toLowerCase();
    const req = match[2] ? match[2].split(',').map(s => s.trim()) : null;
    
    if (typeof roleRequests[reqType] !== 'function') return;
    
    roleRequests[reqType]({ msg, req, allRoles });
  }
}

module.exports = MessageHandler;