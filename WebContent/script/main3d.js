// Stores all the celestial body added to the simulation
celestialBodies = [];

// bodies to be added at the beginning of the next simulation step
// (e. g. in case of a collision)
newCelestialBodies = [];

function threeApp()
{
    var scene = new THREE.Scene();
    var width = 100;

//	var height = width / ( window.innerWidth / window.innerHeight);
//	var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 ); 
    var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 100000);

    // Camera controls: they are initialized later
    var controls;
    var renderer = new THREE.WebGLRenderer();

    var elapsedTime = 0;
    var cameraDirection = 1;
    var direction = 1;

    var clock = new THREE.Clock();
    var cameraControls; /*, effectController;*/

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setClearColor(0x202020, 1.0);

//	scene.fog = new THREE.Fog( 0x111111, 4, 25 );
    //Ligths
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(200, 400, 500);

    var light2 = new THREE.DirectionalLight(0x00FF00, 1.0);
    light2.position.set(-400, 200, -300);

    scene.add(light);
//	scene.add(light2);
    //Lights end

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

//	var geometry = new THREE.CubeGeometry(1, 1, 1);
////	var material = new THREE.MeshBasicMaterial( {color : 0x00f233} );
//	material = new THREE.MeshLambertMaterial( {color : 0xfff233} );
//	var cube = new THREE.Mesh(geometry, material);
//	cube.position.x = -2;
//	scene.add(cube);
	
//	geometry = new THREE.CubeGeometry(1,3,1);
//	material = new THREE.MeshLambertMaterial({ color : 0xff44ff});
//	var parall = new THREE.Mesh(geometry, material);
//	parall.position.x = 2;
//	scene.add(parall);

    var planetGeometry = new THREE.SphereGeometry( 2, 32, 32);
    material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    planetSphere = new THREE.Mesh( planetGeometry, material );
    planet = new CelestialBody(Constants.EARTH_MASS, new THREE.Vector3(0, 0, 0), planetSphere);
    scene.add( planetSphere );

    var moonGeometry = new THREE.SphereGeometry( .5, 32, 32);
    material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    moonSphere = new THREE.Mesh( moonGeometry, material );
    moon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, -15, 3), moonSphere);
    scene.add( moonSphere );
    
    var secondMoonGeometry = new THREE.SphereGeometry(.5, 32, 32);
    material = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
    secondMoonSphere = new THREE.Mesh( secondMoonGeometry, material);
    secondMoon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, 10, -7), secondMoonSphere);
    scene.add(secondMoonSphere);
    
    var additionalBodiesCount = 16;
    var alpha = Math.PI / 12;
    for (var i = 0; i < additionalBodiesCount; i++){
        var additionalMoonGeometry = new THREE.SphereGeometry(.5, 32, 32);
        var additionalMaterial = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
        var additionalMoonSphere = new THREE.Mesh( additionalMoonGeometry, additionalMaterial);
        var distance = 30 + i * 4;
        
        var x  = distance * Math.cos(alpha * i);
        var y = i;
        var z = distance * Math.sin(alpha * i);
        
        var vConst = 10;
        var vx = -1 * (vConst) * Math.sin(alpha * i);
        var vz = (vConst) * Math.cos(alpha * i);
        
        var additionalMoon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(vx, 0, vz), additionalMoonSphere);
        
        additionalMoonSphere.position.x = x;
        additionalMoonSphere.position.y = y;
        additionalMoonSphere.position.z = z;
        
        scene.add(additionalMoonSphere);
        celestialBodies.push(additionalMoon);
    }
    
    drawAxes(scene);
    drawGalaxyBackground(scene);
    
    moonSphere.position.x = 20;
    moonSphere.position.y = 0;
    moonSphere.position.z = 0;
    
    secondMoonSphere.position.x = 30;
    secondMoonSphere.position.y = 0;
    secondMoonSphere.position.z = -30;
    
    // adds bodies to the array that is scanned in game loop (render function)
    celestialBodies.push(planet);
    celestialBodies.push(moon);
    celestialBodies.push(secondMoon);
    
    camera.position.x = -30;
    camera.position.y = 30;
    camera.position.z = 80;
//	camera.rotation.x = - Math.PI / 8;
//	camera.rotation.y = - Math.PI / 8;
//	camera.rotation.z = - Math.PI / 24;

    // Camera controls initialization: the settings are taken from one of the THREE.js examples (webgl_interactive_draggable.html)
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3; 
	
	// this is obsolete code
//	cameraControls = new THREE.Camera();
//	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
//	console.log("cameraControls.target = " + cameraControls.target);
//	cameraControls.target.set(0,15,0);
	
	// This function is basically the job of the game loop
	// this is good enough, for the moment
    function render()
    {
        var delta = clock.getDelta();
        elapsedTime += delta;
        requestAnimationFrame(render);

        // new: calculates gravitational force
        // old style for loop, I know. gonna include jQuery soon...
        for (var i = 0; i < celestialBodies.length; i++) {
            if (celestialBodies[i].markedForRemoval) {
                scene.remove(celestialBodies[i]);
                var removed = celestialBodies.splice(i, 1);
                //customLog("A CelestialBody has been removed: " + JSON.stringify(removed[0]));
            }
        }
        
        for (var i = 0; i < newCelestialBodies.length; i++){
            scene.add(newCelestialBodies[i].mesh);
            celestialBodies.push(newCelestialBodies[i]);
        }
        // important: empties the new bodies vector
        newCelestialBodies = [];

        for (var i = 0; i < celestialBodies.length; i++) {
            for (var j = 0; j < celestialBodies.length; j++) {
                if (celestialBodies[i] == celestialBodies[j]) {
                    continue;
                }

                celestialBodies[i].addForceContribution(celestialBodies[j]);
            }
        }

        for (var i = 0; i < celestialBodies.length; i++) {
            // not passing delta here: before doing that
            // a problem, that arises when the browser tab is changed, should be fixed 
            celestialBodies[i].updatePosition();
            
            // check if the body is gone too far: if so, marks it for removal
            if (celestialBodies[i].getPosition().distanceTo(new THREE.Vector3(0, 0, 0)) > Constants.REMOVAL_DISTANCE_THRESHOLD) {
                celestialBodies[i].markedForRemoval = true;
                //customLog("A Celestial Body has been marked for removal: " + JSON.stringify(celestialBodies[i]));
            }
        }
        
        for (var i = 0; i < celestialBodies.length; i++) {
            for (var j = 0; j < celestialBodies.length; j++) {
                if (celestialBodies[i] == celestialBodies[j]) {
                    continue;
                }

                resolveCollision(celestialBodies[i], celestialBodies[j]);
            }
        }

        controls.update();
        renderer.render(scene, camera);
    }
    
    render();
}

function resolveCollision(firstBody, secondBody){
    // preconditions: checks if the bodies are relly colliding
    if(!firstBody.overlaps(secondBody)){
        return;
    }
    if (firstBody.markedForRemoval || secondBody.markedForRemoval){
        return;
    }
    
    customLog("resolvingCollision");
    
    firstBody.markedForRemoval = true;
    secondBody.markedForRemoval = true;
    
    var maxRadius = Math.max(firstBody.getRadius(), secondBody.getRadius());
    var unionGeometry = new THREE.SphereGeometry(maxRadius, 32, 32);
    var material = new THREE.MeshLambertMaterial({color: 0xFF0000});
    var unionMesh = new THREE.Mesh(unionGeometry, material);
    
    var position = firstBody.getPosition().clone();
    
    unionMesh.position.x = position.x;
    unionMesh.position.y = position.y;
    unionMesh.position.z = position.z;
    
    // TODO: compute the correct velocity
    
    // m[vx, vy, vz]+mv2[vx2, vy2, vz2]=M[Vx, Vy, Vz]
    // [Vx, Vy, Vz] = m1v1 + m2v2 / M
    var sumMass = firstBody.mass + secondBody.mass;
    var velocity = (firstBody.velocity.clone().multiplyScalar(firstBody.mass).add( secondBody.velocity.clone().multiplyScalar(secondBody.mass) ))
    velocity.divideScalar(sumMass);
    
    var unionBody = new CelestialBody(sumMass, velocity, unionMesh);
    
    newCelestialBodies.push(unionBody);
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

function drawGalaxyBackground(scene)
{
    var addBackgroundStar = function(radius, position) {
        var aStarGeometry = new THREE.SphereGeometry(radius, 8, 8);
        var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
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

function customLog(message){
	if(Constants.LOG_ENABLED){
		console.log(message);
	}
} 
















