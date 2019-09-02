const ip = require('ip');
module.exports = (toolbox) => {

    async function getIp() {
        return await ip.address();
    }

    toolbox.getIp = getIp;
}