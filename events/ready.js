exports.run = client => client.user.setGame('m!help').catch(e => client.emit('log', e, 'error'));
