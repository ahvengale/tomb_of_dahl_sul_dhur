let scene, camera, renderer, sphere;
let w, h, aspect_ratio

function init () {
    scene = new THREE.Scene();

    const loader = new THREE.OBJLoader();

    // loader.load('res/outter_shell.obj', function(object) {
    //     scene.add(object);
    // });

    // create orthograpic camera
    w = window.innerWidth
    h = window.innerHeight;
    aspect_ratio =  w / h;
    view_size = 10;
    
    camera = new THREE.OrthographicCamera(
        view_size * aspect_ratio / -2,
        view_size * aspect_ratio / 2,
        view_size / -2,
        view_size / 2,
        0.1,
        1000
    );
    camera.position.set(-20, -20, -20);
    camera.lookAt(scene.position);

    // set the background color with hexdecimal
    scene.background = new THREE.Color(0x000000);

    // create a webgl renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // add the renderer to the Document Object Model
    // this is different with node?
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    sphere = new THREE.LineSegments(geometry, material);
    scene.add(sphere);

    const terrain_geo = new THREE.PlaneBufferGeometry(8, 8, 32 ,32);
    const terrain_mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const terrain = new THREE.LineSegments(terrain_geo, terrain_mat);
    terrain.rotation.x = Math.PI / 2;
    terrain.position.y += 1;

    const {array} = terrain.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];

        array[i + 2] = z + Math.random(); 
    }
    scene.add(terrain);
}

function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
    update();
}

function onWindowResize() {
    var new_aspect = window.innerWidth / window.innerHeight;
    camera.left = view_size * new_aspect / -2;
    camera.right = view_size * new_aspect  / 2;
    camera.top = view_size / -2;
    camera.bottom = view_size / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
    
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
