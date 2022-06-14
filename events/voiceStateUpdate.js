module.exports = {
    name: 'voiceStateUpdate',
    once: true,
    async execute(oldState, newState) {
        try {
            console.log(oldState + ' \n' + newState)
        } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            connection.destroy();
        }
    },
};