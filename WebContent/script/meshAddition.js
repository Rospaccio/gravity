/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
        var additionalMoonSphere = new THREE.Mesh( additionalMoonGeometry, additionalMaterial);
        var distance = 30 + i * 2;
        
        var x  = distance * Math.cos(alpha * i);
        var y = 0;
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
