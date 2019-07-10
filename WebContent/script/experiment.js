Experiment = {};

Experiment.setupScene_01 = function (){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    var container = document.getElementById("container");
    container.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame( animate );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    };

    animate();
}

Experiment.addDefaultLights = function(scene){
    //Ligths
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(200, 400, 500);

    var light2 = new THREE.DirectionalLight(0xFFFFFF, .6);
    light2.position.set(-400, 200, -300);

    scene.add(light);
    scene.add(light2);
    //Lights end
}

Experiment.setupScene_02 = function (){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    var container = document.getElementById("container");
    container.appendChild( renderer.domElement );

    Experiment.addDefaultLights(scene);

    var geometry = new THREE.Geometry();

    geometry.vertices.push(0, 0, 0);
    geometry.vertices.push(1, 0, 0);
    geometry.vertices.push(1, 10, 0);
    geometry.vertices.push(10, 2, 2);

    var material = new THREE.LineBasicMaterial( { color: 0x778877 } );
    var line = new THREE.Line( geometry, material );
    scene.add( line );

    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame( animate );

        renderer.render( scene, camera );
    };

    animate();
}

