function threeApp()
{
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();
        var cameraDirection = 1;
	
	var clock = new THREE.Clock();
	// var cameraControls; /*, effectController;*/
	
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setClearColor( 0xffffff, 1.0 );
	
	scene.fog = new THREE.Fog( 0x111111, 4, 10 );
	//Ligths
	var ambientLight = new THREE.AmbientLight( 0x111111 );
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -400, 200, -300 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);
	//Lights end
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.CubeGeometry(1, 1, 1);
//	var material = new THREE.MeshBasicMaterial( {color : 0x00f233} );
	material = new THREE.MeshLambertMaterial( {color : 0xfff233} );
	var cube = new THREE.Mesh(geometry, material);
	cube.position.x = -2;
	scene.add(cube);
	
	geometry = new THREE.CubeGeometry(1,3,1);
	material = new THREE.MeshLambertMaterial({ color : 0xff44ff});
	var parall = new THREE.Mesh(geometry, material);
	parall.position.x = 2;
	scene.add(parall);

        geometry = new THREE.SphereGeometry( .5, 32, 32 );
        material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
        sphere = new THREE.Mesh( geometry, material );
        scene.add( sphere );

	camera.position.z = 5;

//      cameraControls = new THREE.Camera();
//	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
//	console.log("cameraControls.target = " + cameraControls.target);
//	cameraControls.target.set(0,15,0);
	
	function render()
	{	
//		var delta = clock.getDelta();
//		cameraControls.update(delta);
		requestAnimationFrame(render);
                
                // -----------------------------------------------------------
//                var currentZ = camera.position.z += cameraDirection * 0.02;
//                camera.position.x += cameraDirection * 0.01;
//                camera.position.y += cameraDirection * 0.01;
//                console.log("camera.position.z = " + camera.position.z);
//                if(cameraDirection >= 1 && currentZ > 10)
//                    cameraDirection = -1;
//                if(cameraDirection <= -1 && currentZ < 5)
//                    cameraDirection = 1;
//                
		cube.rotation.x += 0.005;
		cube.rotation.y += 0.005;

		parall.rotation.z += 0.004;
		parall.rotation.y +=.005;
                // -----------------------------------------------------------
                
		renderer.render(scene, camera);
	}
	
	render();
}