export function setHooks(){
    //////////////////////////////////////////
    //      Init Hooks start here           //
    //////////////////////////////////////////

    game.settings.register(
		"SIFToolkit", "startupId", {
  			name: "startupId",
			scope: "client",
			config: false,
			type: String,
			default: "",
			onChange: (value) => {console.debug("SIFT | StartupId: ",value)}
		}
	);

    game.settings.set("SIFToolkit","startupId",randomID());
    //Load in message history
    
        try{var MessageArray = Array.from(game.messages.values());}catch{console.log("SIFT | Could not clear chat-action history.");}
        console.log("SIFT | Processing Chat Messages");
        for(let i = 1,j=0; j < (SIFT.Settings.messageHistory+1) && i <= MessageArray.length; i++){
            let rollType = SIFT.utils.getFlavorTypeFromChat(MessageArray[i]);
            if(!(rollType && ['healing','damage'].includes(rollType.toLowerCase()))){
                SIFT.utils.hijackTemplateButton(MessageArray[MessageArray.length - i]);
                j++;
            }
        }
        SIFT.utils.clearTemplateData();

    Hooks.on("renderChatMessage",(...args) =>{
        let hijackFlag = args[0].getFlag("SIFToolkit","Hijacked");
            let rollType = SIFT.utils.getFlavorTypeFromChat(args[0]);
        if(args[0].data.content.includes('button data-action="template"')){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);  
            SIFT.utils.extractSIFData(SIFObj);  
            let SIFData = SIFObj.data.flags.SIFToolkit?.SIFData
            
            if((SIFData.playTemplateAudio || SIFData.playDamageAudio) && (SIFData.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            if(!(hijackFlag==game.settings.get("SIFToolkit","startupId"))){
                SIFT.utils.hijackTemplateButton(args[0]);
            }
        }else if(args[0].data.content.includes('button data-action="damage"')){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);    
            let SIFData = SIFObj.data.flags.SIFToolkit.SIFData
            
            if((SIFData.playTemplateAudio || SIFData.playDamageAudio) && (SIFData.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            if(!(hijackFlag==game.settings.get("SIFToolkit","startupId"))){
                SIFT.utils.hijackDamageButton(args[0]);
            }            
        }else if(rollType && ['healing','damage'].includes(rollType.toLowerCase())){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);    
            let SIFData = SIFObj.data.flags.SIFToolkit.SIFData
            
            if(!SIFT.soundHold && SIFData.playDamageAudio && (SIFData.clip != "")){
                SIFT.soundHold = true;
                AudioHelper.play({
                    src: SIFData.clip,
                    volume: ((SIFData.volume??100)/100)
                }, false);
                setTimeout(()=>{SIFT.soundHold = false;5},500); 
            }      
        }
    }); 

    Hooks.on("preUpdateCombat",(...args) => {
        let advanceTime = args[2].advanceTime;
            if(advanceTime != 0 && !(SIFT.Settings.timeProcessor=="SimpleCalendar")) SIFT.utils.ageTemplates(advanceTime);
            SIFT.utils.cleanupTemplates(args[0].combatant.actor.id);
    });
        
}