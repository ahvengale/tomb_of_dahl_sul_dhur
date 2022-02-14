let scene, camera, renderer, sphere;
let w, h, aspect_ratio
let entities = [];

function init () {
    scene = new THREE.Scene();

    const entity = new Entity();
    entity.spawn(scene);
    entities.push(entity);

    // create orthograpic camera
    w = window.innerWidth
    h = window.innerHeight;
    aspect_ratio =  w / h;
    view_size = 5;
    
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
    scene.background = new THREE.Color(0x004400);

    // create a webgl renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // add the renderer to the Document Object Model
    // this is different with node?
    document.body.appendChild(renderer.domElement);

    var light = new THREE.DirectionalLight(0xffffff, 1.0, 10);
    light.position.set(10,30,10);
    scene.add(light);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    for(var i = 0; i < entities.length; i++) {
        entities[i].animate();
    }
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
