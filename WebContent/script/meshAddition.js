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

function addCelestialBody(radius, segments, color, mass, velocity, position, scene){
    var geometry = new THREE.SphereGeometry( radius, segments, segments);
    var material = new THREE.MeshPhongMaterial( {color: color} );
    var mesh = new THREE.Mesh( geometry, material );
    var body = new CelestialBody(mass, velocity, mesh);
    scene.add( mesh );
//    customLog("position: " + JSON.stringify(position));
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    celestialBodies.push(body);
}

function addDefaultCelestialBody(velocity, position, scene){
    if(!scene){
        customLog("'scene' is not defined, impossible to continue");
        return;
    }
    addCelestialBody(1, 32, 0x00FF00, Constants.MOON_MASS, velocity, position, scene);
}

function addOriginMassiveBody(scene){
    var planetGeometry = new THREE.SphereGeometry( 2, 32, 32);
    var material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    var planetSphere = new THREE.Mesh( planetGeometry, material );
    var planet = new CelestialBody(Constants.EARTH_MASS, new THREE.Vector3(0, -5, 0), planetSphere);
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
    var changingColor = new THREE.Color(0x337722);
    for (var i = 0; i < additionalBodiesCount; i++){
        // var varyingRadius = .1 + .1 * i
        var additionalMoonGeometry = new THREE.SphereGeometry(1, 32, 32);
        changingColor.add( new THREE.Color(256 + i));
        var additionalMaterial = new THREE.MeshLambertMaterial( {color: changingColor} );
        var additionalMoonSphere = new THREE.Mesh(additionalMoonGeometry, additionalMaterial);
        var distance = 50 + i * 2;
        
        var x  = distance * Math.cos(alpha * i);
        var y = distance * Math.sin(i + alpha * i * 6);
        var z = 0; // distance * Math.sin(alpha * i);
        
        var vConst = 10 ;
        var vx = -1 * (vConst) * Math.sin(alpha * i);
        var vz = (vConst) * Math.cos(alpha * i);
        
        var additionalMoon = new CelestialBody(Constants.MOON_MASS * (64/(i+1)), new THREE.Vector3(vx, 0, vz), additionalMoonSphere);
        
        additionalMoonSphere.position.x = x;
        additionalMoonSphere.position.y = y;
        additionalMoonSphere.position.z = z;
        
        scene.add(additionalMoonSphere);
        celestialBodies.push(additionalMoon);
    }
}

function addPlanetAndSatellite(scene){
    
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshLambertMaterial({color: 0x221199});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 140;
    sphere.position.y = 0;
    sphere.position.z = 0;
    var planet = new CelestialBody(Constants.EARTH_MASS, new THREE.Vector3(0, 5, 0), sphere);
    scene.add(sphere);
    celestialBodies.push(planet);
    
    geometry = new THREE.SphereGeometry(1, 32, 32);
    material = new THREE.MeshLambertMaterial({color: 0xFF0000});
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 160;
    sphere.position.y = 0;
    sphere.position.z = 0;
    var satellite = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, 0, 15), sphere);
    scene.add(sphere);
    celestialBodies.push(satellite);

    geometry = new THREE.SphereGeometry(1, 32, 32);
    material = new THREE.MeshLambertMaterial({color: 0x11AABB});
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 15;
    sphere.position.y = 0;
    sphere.position.z = 0;
    var satellite = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, 0, 20), sphere);
    scene.add(sphere);
    celestialBodies.push(satellite);

    geometry = new THREE.SphereGeometry(1, 32, 32);
    material = new THREE.MeshLambertMaterial({color: 0x32F034});
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 190;
    sphere.position.y = 0;
    sphere.position.z = 0;
    var satellite = new CelestialBody(Constants.EARTH_MASS, new THREE.Vector3(0, -5, 0), sphere);
    scene.add(sphere);
    celestialBodies.push(satellite);
}

function drawHelperPlane(scene) {
    // two planes are necessary to intercepts intersection both from
    // the upper and the lower side.
    var geometry = new THREE.PlaneBufferGeometry(50000, 50000);
    // the plane is equal to the y-z axes plane: need to be rotated 90 degrees
    // in order to match with the x-z plane. Thus we obtain a plane that face the up direction
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    var material = new THREE.MeshPhongMaterial({color: 0xDDDDDD, opacity: 0.0, transparent: true});
    var plane = new THREE.Mesh(geometry, material);
    
    var upsideDownPlaneGeometry = geometry.clone();
    // Similar to the previuos case, except that now we must rotate 180 degrees because
    // we need a plane that face the down direction
    upsideDownPlaneGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
    var upsideDownPlane = new THREE.Mesh(upsideDownPlaneGeometry, material);
    
    scene.add(plane);
    scene.add(upsideDownPlane);

    return [plane, upsideDownPlane];
}

function drawHelperGrid(scene){
    var minBound = -400;
    var maxBound = 400;
    var currentBound = minBound;

    var gridLines = [];
    while(currentBound <= maxBound){

        var gridLineMaterial = new THREE.LineBasicMaterial({color: 0xeaecf0, transparent: true, opacity: 0.5});
        var vertexA = new THREE.Vector3(currentBound, 0, minBound);
        var vertexB = new THREE.Vector3(currentBound, 0, maxBound);
        var gridLineGeometry = new THREE.Geometry();
        gridLineGeometry.vertices.push(vertexA, vertexB);
        var line = new THREE.Line(gridLineGeometry, gridLineMaterial);

        gridLines.push(line);
        scene.add(line);

        vertexA = new THREE.Vector3(minBound, 0, currentBound);
        vertexB = new THREE.Vector3(maxBound, 0, currentBound);
        gridLineGeometry = new THREE.Geometry();
        gridLineGeometry.vertices.push(vertexA, vertexB);
        line = new THREE.Line(gridLineGeometry, gridLineMaterial);

        gridLines.push(line);
        scene.add(line);

        currentBound += 10;
    }

    return gridLines;
}

function drawGalaxyBackground(scene)
{
    var distance = 50000;
    // var radius = 200;
        
    var geometry = new THREE.Geometry();

    for (var i = 0; i < 10000; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = THREE.Math.randFloatSpread(distance);
        vertex.y = THREE.Math.randFloatSpread(distance);
        vertex.z = THREE.Math.randFloatSpread(distance);

        geometry.vertices.push(vertex);

    }
    var particles = new THREE.PointCloud(geometry, new THREE.PointCloudMaterial({color: 0x888888}));
    scene.add(particles);
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