/**
 * 
 */

function MultiBrowserMouseEvent(innerEvent){
	this.innerEvent = innerEvent;
	
	this.getX = function(){
		return this.innerEvent.offsetX ? this.innerEvent.offsetX : this.innerEvent.clientX - mainCanvas.getBoundingClientRect().left;
	};
	
	this.getY = function(){
		return this.innerEvent.offsetY ? this.innerEvent.offsetY : this.innerEvent.clientY - mainCanvas.getBoundingClientRect().top;
	};
}