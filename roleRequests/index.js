const normalizeNames = val => val.replace(/[^A-Z0-9]+/ig, '').toLowerCase();
const filterRoles = (a, b) => a.filter(val_a => !b.some(val_b => val_a.id === val_b.id));

function character({msg, req, allRoles}) {
  const charReq = req.map(normalizeNames);
  const characterRoleColor = 5533306; // Character roles are identified by a specific color because there is no way to add meta data
  const charRoles = allRoles.filter(role => !role.deleted && (role.color === characterRoleColor));
  const charNames = charRoles.map(c => c.name);
  const helpMsg = `Requests **MUST** use the following format \`!character Sol, Ky, Potemkin, etc.\`
The options are as follows: **${charNames.join(', ')}**`;
  const requestedRoles = charReq
    .map(roleName => charRoles.find(char => normalizeNames(char.name) === roleName))
    .filter(val => !!val);
  const requestedRoleNames = requestedRoles.map(role => role.name);
  const newRoles = filterRoles(requestedRoles, msg.member.roles);
  const newRoleNames = newRoles.map(role => role.name);
  
  if (newRoles.length) {
    msg.member.addRoles(newRoles)
      .then(response => {
        const noun = newRoles.length > 1 ? 'groups' : 'group';
        msg.reply(`You were added to the **${newRoleNames.join(', ')}** ${noun}`);
      })
      .catch((err) => {
        console.error(err);
        msg.reply(`There was an issue with your request. ${helpMsg}`);
      });
  } else if (requestedRoles.length) {
    const noun = requestedRoles.length > 1 ? 'groups' : 'group';
    msg.reply(`You are already in the **${requestedRoleNames.join(', ')}** ${noun}`);
  } else {
    msg.reply(helpMsg);
  }
}

const region = ({ msg, req, allRoles }) => {
  const regionMap = {
    '544931132282634292': 'Tampa Gear',
    '545448258718269453': 'North FL Gear',
    '545029153565704194': 'Central FL Gear',
    '547636153323356170': 'South FL Gear ',
    '549597665311064064': 'Panhandle Gear'
  };
  const regionRoles = Object.keys(regionMap).map(key => allRoles.find(r => r.id === key));
  const regionNames = regionRoles.map(r => r.name);
  const helpMsg = `Requests **MUST** use the following format \`!region Tampa Gear\`
The options are as follows: **${regionNames.join(', ')}**`;
  const requestedRoles = req
    .map(roleName => regionRoles.find(region => normalizeNames(region.name) === normalizeNames(roleName)))
    .filter(val => !!val);
  const requestedRoleNames = requestedRoles.map(role => role.name);
  const newRoles = filterRoles(requestedRoles, msg.member.roles);
  const newRoleNames = newRoles.map(role => role.name);

  if (newRoles.length) {
    msg.member.addRoles(newRoles)
      .then(response => {
        msg.reply(`You were added to the **${newRoleNames.join(', ')}** region`);
      })
      .catch((err) => {
        console.error(err);
        msg.reply(`There was an issue with your request. ${helpMsg}`);
      });
  } else if (requestedRoles.length) {
    msg.reply(`You are already in the **${requestedRoleNames.join(', ')}** region`);
  } else {
    msg.reply(helpMsg);
  }
}

module.exports = {
  character,
  region
}