/* 
 * Copyright (C) 2015 Alberto Mercati
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function testTranslate(x, y){

	var transform = document.getElementById('canvasTranslation');
	transform.setAttribute("transform", "translate(" + x + ", " + y + ")");
}


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