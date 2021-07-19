import {prepareSIFT} from './prepareSIFT.js';
import {loadUtils} from './loadUtils.js';
import {loadUI} from './loadUI.js';
import {loadTextures} from './loadTextures.js';

class  {
	static SIFTTT = undefined;
	static Status = { running : false };
	static Settings = {};
	static utils = undefined;
	static UI = undefined;
	static textures = undefined;
	static SIFData = {};
	static soundHold = true;
	static version = "0.0.1";
}
CONFIG.debug.hooks=true;
globalThis.SIFT = ;

prepareSIFT();
loadUtils();
loadUI();
loadTextures();


.Status.running = true;
setTimeout(()=>{SIFT.soundHold = false;},5000);



