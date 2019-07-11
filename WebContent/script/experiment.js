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
    var ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(200, 400, 500);

    var light2 = new THREE.DirectionalLight(0xFFFFFF, .6);
    light2.position.set(-400, 200, -300);

    scene.add(light);
    scene.add(light2);
    //Lights end
}

Experiment.addTrackballControls = function(camera){
    var trackBallControls = new THREE.TrackballControls(camera);
    trackBallControls.rotateSpeed = 1.0;
    trackBallControls.zoomSpeed = 1.2;
    trackBallControls.panSpeed = 0.8;
    trackBallControls.noZoom = false;
    trackBallControls.noPan = false;
    trackBallControls.staticMoving = true;
    trackBallControls.dynamicDampingFactor = 0.3;

    return trackBallControls;
}

Experiment.setupScene_02 = function (){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );
    clock = new THREE.Clock();

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    var container = document.getElementById("container");
    container.appendChild( renderer.domElement );

    Experiment.addDefaultLights(scene);
    controls = Experiment.addTrackballControls(camera);

    geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(1, 0, 0));
    geometry.vertices.push(new THREE.Vector3(1, 1, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));

    material = new THREE.LineBasicMaterial( { color: 0x88ff88 } );
    var line = new THREE.Line( geometry, material );
    scene.add( line );

    camera.position.z = 5

    var animate = function () {

        controls.update(.02);

        updateObjects();

        requestAnimationFrame( animate );

        renderer.render( scene, camera );
    };

    oldSpiral = null;
    spiralPoints = [];
    rumor = 0;

    function updateObjects(){

        var sign = Math.random() < .5 ? -1 : 1;
        rumor = sign * .1 * Math.random();

        var a = .1;
        var t = clock.getElapsedTime();
        var x = a * t * Math.cos(t) + rumor;
        var y = a * t * Math.sin(t) + rumor;
        var z = 0.1 * t + rumor;
        var newSpiralPoint = new THREE.Vector3(x, y, z);
        spiralPoints.push(newSpiralPoint);

        var spiralGeometry = new THREE.Geometry();
        spiralGeometry.vertices = spiralPoints;
        var line = new THREE.Line( spiralGeometry, material );
        if(oldSpiral !== null){
            scene.remove(oldSpiral);
        }
        scene.add(line);
        oldSpiral = line;
    }

    animate();
}

