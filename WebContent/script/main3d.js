// Stores all the celestial body added to the simulation
celestialBodies = [];

function threeApp()
{
	var scene = new THREE.Scene();
	var width = 100;
	
//	var height = width / ( window.innerWidth / window.innerHeight);
//	var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 ); 
	var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
	
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
	renderer.setClearColor( 0xffffff, 1.0 );
	
//	scene.fog = new THREE.Fog( 0x111111, 4, 25 );
	//Ligths
	var ambientLight = new THREE.AmbientLight( 0x111111 );
	scene.add(ambientLight);
	
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0x00FF00, 1.0 );
	light2.position.set( -400, 200, -300 );

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

    var planetGeometry = new THREE.SphereGeometry( .5, 32, 32);
    material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    planetSphere = new THREE.Mesh( planetGeometry, material );
    planet = new CelestialBody(Constants.EARTH_MASS, new THREE.Vector3(0, 0, 0), planetSphere);
    scene.add( planetSphere );

    var moonGeometry = new THREE.SphereGeometry( .5, 32, 32);
    material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    moonSphere = new THREE.Mesh( moonGeometry, material );
    moon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, 15, 3), moonSphere);
    scene.add( moonSphere );
    
    var secondMoonGeometry = new THREE.SphereGeometry(.5, 32, 32);
    material = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
    secondMoonSphere = new THREE.Mesh( secondMoonGeometry, material);
    secondMoon = new CelestialBody(Constants.MOON_MASS, new THREE.Vector3(0, 10, -7), secondMoonSphere);
    scene.add(secondMoonSphere);
    
	drawAxes(scene);
    //
    
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
    
	camera.position.z = 30;
	camera.position.x = 2;
	camera.position.y = 10;
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
		
		var squareElapsedTime = elapsedTime * elapsedTime
		
		// new: calculates gravitational force
		// old style for loop, I know. gonna include jQuery soon...
		for(var i = 0; i < celestialBodies.length; i++){
			if(celestialBodies[i].markedForRemoval){
				scene.remove(celestialBodies[i]);
				var removed = celestialBodies.splice(i, 1);
				customLog("A CelestialBody has been removed: " + removed[0]);
			}
		}
						
		for(var i = 0; i < celestialBodies.length; i++){
			
			for(var j = 0; j < celestialBodies.length; j++){
				if(celestialBodies[i] == celestialBodies[j]){
					continue;
				}
				
				celestialBodies[i].addForceContribution(celestialBodies[j]);
			}
		}
		
		for(var i = 0; i < celestialBodies.length; i++){
			// not passing delta here: before doing that
			// a problem, that arises when the browser tab is changed, should be fixed 
			celestialBodies[i].updatePosition();
			
			// check if the body is gone too far: if so, marks it for removal
			if(celestialBodies[i].getPosition().distanceTo(new THREE.Vector3(0, 0, 0)) > Constants.REMOVAL_DISTANCE_THRESHOLD){
				celestialBodies[i].markedForRemoval = true;
				customLog("A Celestial Body has been marked for removal: " + celestialBodies[i]);
			}
		}
		
		controls.update();
		renderer.render(scene, camera);
	}
	
	render();
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

function customLog(message){
	if(Constants.LOG_ENABLED){
		console.log(message);
	}
} 
















