function threeApp()
{
	var scene = new THREE.Scene();
	var width = 40;
	
//	var height = 40 / ( window.innerWidth / window.innerHeight);
//	var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 ); 
	var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
	
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
	var ambientLight = new THREE.AmbientLight( 0x000000 );
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0x00FF00, 1.0 );
	light2.position.set( -400, 200, -300 );

	scene.add(ambientLight);
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

    var planetGeometry = new THREE.SphereGeometry( .5, 64, 64);
    material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    planetSphere = new THREE.Mesh( planetGeometry, material );
    scene.add( planetSphere );

    var moonGeometry = new THREE.SphereGeometry( .5, 64, 64);
    material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    moonSphere = new THREE.Mesh( moonGeometry, material );
    scene.add( moonSphere );
    
    //
	drawAxis(scene);
    //
    
    moonSphere.position.x = 6;
    moonSphere.position.y = 0;
    moonSphere.position.z = -4.5;
    
	camera.position.z = 12;
	camera.position.x = -2;
	camera.position.y = 4;
	camera.rotation.x = - Math.PI / 8;
	camera.rotation.y = - Math.PI / 8;
	camera.rotation.z = - Math.PI / 24;

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
	
	function render()
	{	
		var delta = clock.getDelta();
		elapsedTime += delta;
//		cameraControls.update(delta);
		requestAnimationFrame(render);
                
        // -----------------------------------------------------------
//        var currentZ = camera.position.z += cameraDirection * 0.02;
//        camera.position.x += cameraDirection * 0.01;
//        camera.position.y += cameraDirection * 0.01;
//        console.log("camera.position.z = " + camera.position.z);
//        if(cameraDirection >= 1 && currentZ > 10)
//            cameraDirection = -1;
//        if(cameraDirection <= -1 && currentZ < 5)
//            cameraDirection = 1;
//                
//		cube.rotation.x += 0.005;
//		cube.rotation.y += 0.005;
//
//		parall.rotation.z += 0.004;
//		parall.rotation.y +=.005;
		// -----------------------------------------------------------
		
		var squareElapsedTime = elapsedTime * elapsedTime

		var moonX = 6 * Math.cos(elapsedTime);
		var moonY = Math.sin(elapsedTime * 6);
		var moonZ = -4.5 * Math.sin(elapsedTime);
		
//		console.log(moonX + ", " + moonY);
		
		moonSphere.position.x = moonX;
		moonSphere.position.y = moonY;
		moonSphere.position.z = moonZ;
        
		controls.update();
		
		renderer.render(scene, camera);
	}
	
	render();
}

function drawAxis(scene){
	
	var AXIS_EXTREME = 10; 
	
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
	
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, 0, -AXIS_EXTREME));
	geometry.vertices.push(new THREE.Vector3(0, 0, AXIS_EXTREME));
	var zAxis = new THREE.Line(geometry, lineMaterial);
	scene.add(zAxis);
	
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-AXIS_EXTREME, 0, -AXIS_EXTREME));
	geometry.vertices.push(new THREE.Vector3(AXIS_EXTREME, 0, -AXIS_EXTREME));
	var controlLine = new THREE.Line(geometry, lineMaterial);
	scene.add(controlLine);
}