LGTV = require("lgtv-serial")

module.exports = function(RED) {
    function LGTVSerial(config) {
        
        RED.nodes.createNode(this,config);
        
        var node = this;

        node.on('input', function(msg) {
        
            this.config = RED.nodes.getNode(config.path);
        
            const lgtv = this.config.LGTV
        
            var result=null 

            // If payload is an object, we set the value on the TV
	        if (typeof(msg.payload) == "object") {
		        command=Object.keys(msg.payload)[0]
                result = lgtv.set(command,msg.payload[command])
                    .then(r => { 
                        msg.payload = r
                        const date = new Date(Date.now()).toLocaleTimeString("fr-FR")
			            this.status({fill:"green",shape:"dot",text:`OK ${r} at ${date}`});
			            node.send(msg)
                    })
            }
	        else if (typeof(msg.payload == "string")){
                result = lgtv.get(msg.payload)
                    .then(r => {
                        msg.payload = r
                        const date = new Date(Date.now()).toLocaleTimeString("fr-FR")
			            this.status({fill:"green",shape:"dot",text:`OK ${r} at ${date}`});
		                node.send(msg)
		            })
            }
	        else {
		        this.status({fill:"red",shape:"ring",text:"Incorrect payload, nor a string or an object"});
		        msg.payload = undefined
                node.send(msg)
                return
	        }
            const date = new Date(Date.now()).toLocaleTimeString("fr-FR")
	        this.status({fill:"yellow",shape:"dot",text:`Sending at ${date}`});
        });
    }
    RED.nodes.registerType("lgtv-serial",LGTVSerial);
}