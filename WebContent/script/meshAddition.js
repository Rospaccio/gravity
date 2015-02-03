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

function addOriginMassiveBody(scene){
    var planetGeometry = new THREE.SphereGeometry( 2, 32, 32);
    var material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    var planetSphere = new THREE.Mesh( planetGeometry, material );
    var planet = new CelestialBody(Constants.EARTH_MASS, new THREE.Vector3(0, 0, 0), planetSphere);
    scene.add( planetSphere );
    celestialBodies.push(planet);
}

function addSimpleTestBodies(scene){
    var moonGeometry = new THREE.SphereGeometry( .5, 32, 32);
    var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    var moonSphere = new THREE.Mesh( moonGeometry, material );
    var moon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, -15, 3), moonSphere);
    scene.add( moonSphere );
        
    moonSphere.position.x = 20;
    moonSphere.position.y = 0;
    moonSphere.position.z = 0;
    
    celestialBodies.push(moon);
    
    var secondMoonGeometry = new THREE.SphereGeometry(.5, 32, 32);
    material = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
    var secondMoonSphere = new THREE.Mesh( secondMoonGeometry, material);
    var secondMoon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, 10, -7), secondMoonSphere);
    scene.add(secondMoonSphere);   
    
    secondMoonSphere.position.x = 30;
    secondMoonSphere.position.y = 0;
    secondMoonSphere.position.z = -30;
    
    celestialBodies.push(secondMoon);
}

function addSpiralOfBodies(scene){
    var additionalBodiesCount = 64;
    var alpha = Math.PI / 12;
    for (var i = 0; i < additionalBodiesCount; i++){
        // var varyingRadius = .1 + .1 * i
        var additionalMoonGeometry = new THREE.SphereGeometry(1, 32, 32);
        var changingColor = 0x115511 + i;
        var additionalMaterial = new THREE.MeshLambertMaterial( {color: changingColor} );
        var additionalMoonSphere = new THREE.Mesh(additionalMoonGeometry, additionalMaterial);
        var distance = 40 + i * 2;
        
        var x  = distance * Math.cos(alpha * i);
        var y = .2 * i;
        var z = distance * Math.sin(alpha * i);
        
        var vConst = 5;
        var vx = -1 * (vConst) * Math.sin(alpha * i);
        var vz = (vConst) * Math.cos(alpha * i);
        
        var additionalMoon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(vx, 0, vz), additionalMoonSphere);
        
        additionalMoonSphere.position.x = x;
        additionalMoonSphere.position.y = y;
        additionalMoonSphere.position.z = z;
        
        scene.add(additionalMoonSphere);
        celestialBodies.push(additionalMoon);
    }
}

function drawGalaxyBackground(scene)
{
    var addBackgroundStar = function(radius, position) {
        var aStarGeometry = new THREE.SphereGeometry(radius, 8, 8);
        var material = new THREE.MeshLambertMaterial({color: 0xffffff});
        var starMesh = new THREE.Mesh(aStarGeometry, material);

        starMesh.position.x = position.x;
        starMesh.position.y = position.y;
        starMesh.position.z = position.z;

        scene.add(starMesh);
    };

    for (var i = 0; i < 2 * Math.PI; i = i + Math.PI / 6) {
        var distance = 50000;
        var radius = 200;
        var position = new THREE.Vector3(distance * Math.cos(i), 0, distance * Math.sin(i));
        addBackgroundStar(radius, position);
    }
}

function drawAxes(scene){
	var AXIS_EXTREME = 100; 
	
	var geometry = new THREE.Geometry();
	var lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000, opacity: 0.9 });
	
	geometry.vertices.push(new THREE.Vector3(-AXIS_EXTREME, 0, 0));
	geometry.vertices.push(new THREE.Vector3(AXIS_EXTREME, 0, 0));
	var xAxis =  new THREE.Line(geometry, lineMaterial);
	scene.add(xAxis);
	
	lineMaterial = new THREE.LineBasicMaterial({ color: 0x00FF00, opacity: 0.9 });
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, -AXIS_EXTREME, 0));
	geometry.vertices.push(new THREE.Vector3(0, AXIS_EXTREME, 0));
	var yAxis = new THREE.Line(geometry, lineMaterial);
	scene.add(yAxis);
	
	lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000FF, opacity: 0.9 });
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, 0, -AXIS_EXTREME));
	geometry.vertices.push(new THREE.Vector3(0, 0, AXIS_EXTREME));
	var zAxis = new THREE.Line(geometry, lineMaterial);
	scene.add(zAxis);
	
//	geometry = new THREE.Geometry();
//	geometry.vertices.push(new THREE.Vector3(-AXIS_EXTREME, 0, -AXIS_EXTREME));
//	geometry.vertices.push(new THREE.Vector3(AXIS_EXTREME, 0, -AXIS_EXTREME));
//	var controlLine = new THREE.Line(geometry, lineMaterial);
//	scene.add(controlLine);
}