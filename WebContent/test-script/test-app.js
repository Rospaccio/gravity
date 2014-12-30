/**
 * 
 */
function testDivSize(){
	window
}

function testAddCircle(){
	addCircle('testCircle', 50, 50, 30, 'blue');
}

function testDistance()
{
	var circle = addCircle("c01", 400, 250, 30, 'blue');
	var circle2 = addCircle("c02", 750, 250, 10, 'grey');
	
	wrapWithMassProperty(circle, 10);
	wrapWithMassProperty(circle2, 10);
	
	var distance = circle.distanceFrom(circle2);
	console.log("Distance = " + distance);
}

function testForce()
{
	var circle = addCircle("c01", 400, 250, 30, 'blue');
	var circle2 = addCircle("c02", 750, 250, 10, 'grey');
	
	wrapWithMassProperty(circle, EARTH_MASS);
	wrapWithMassProperty(circle2, MOON_MASS);
	
	var force = circle.forceBetween(circle2);
	console.log("Force = " + force);
}

function testGetX(){
	var circle = addCircle("c01", 400, 250, 30, 'blue');
	wrapWithMassProperty(circle, EARTH_MASS);
	console.log(circle.getX());
}

function testOverlap(){
	var backCircle = addCircle("c01", 400, 250, 30, 'blue');
	var frontCircle = addCircle("c01", 459, 250, 30, 'blue');
	
	console.log("overlap? => " + backCircle.overlaps(frontCircle));
}