LGTV = require("lgtv-serial")

module.exports = function(RED) {
    function LGTVSerial(config) {
        
        RED.nodes.createNode(this,config);
        
        var node = this;

        node.on('input', function(msg) {
        
            this.config = RED.nodes.getNode(config.path);
        
            const lgtv = this.config.LGTV
        
            var result=null 

            const date = new Date(Date.now()).toLocaleTimeString("fr-FR")

            // If payload is an object, we set the value on the TV
	        if (typeof(msg.payload) == "object") {
		        command=Object.keys(msg.payload)[0]
                result = lgtv.set(command,msg.payload[command])
                    .then(r => { 
                        msg.payload = r
                        if (r.status == "OK") {
                            this.status({fill:"green",shape:"dot",text:`${r.status} ${r.result} at ${date}`});
                        }
                        else {
                            this.status({fill:"red",shape:"dot",text:`${r.status} ${r.result} at ${date}`});
                        }
			            node.send(msg)
                    })
                    .catch(error => {
                        this.status({fill:"red",shape:"circle",text:`ERR ${error} at ${date}`});
                        })
            }
	        else if (typeof(msg.payload == "string")){
                result = lgtv.get(msg.payload)
                    .then(r => {
                        msg.payload = r
                        if (r.status == "OK") {
                            this.status({fill:"green",shape:"dot",text:`${r.status} ${r.result} at ${date}`});
                        }
                        else {
                            this.status({fill:"red",shape:"dot",text:`${r.status} ${r.result} at ${date}`});
                        }
		                node.send(msg)
		        })
                    .catch(error => {
                        this.status({fill:"red",shape:"ring",text:`ERR ${error} at ${date}`});
                        })
            }
	        else {
		        this.status({fill:"red",shape:"ring",text:"Incorrect payload, nor a string or an object"});
		        msg.payload = undefined
                node.send(msg)
                return
	        }
	        this.status({fill:"yellow",shape:"dot",text:`Sending at ${date}`});
        });
    }
    RED.nodes.registerType("lgtv-serial",LGTVSerial);
}