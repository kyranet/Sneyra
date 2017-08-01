exports.run = client => client.user.setGame('m!help').catch(err => client.emit('log', err, 'error'));
