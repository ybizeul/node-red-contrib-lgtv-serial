const LGTV = require("lgtv-serial")

module.exports = function(RED) {
    function LGTVSerialConfiguration(config) {
        RED.nodes.createNode(this,config);
        this.path=config.path
        this.LGTV = new LGTV(this.path)
    }
    RED.nodes.registerType("lgtv-serial-config",LGTVSerialConfiguration);
}
