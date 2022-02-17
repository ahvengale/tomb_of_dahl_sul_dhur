let scene, camera, renderer, sphere;
let w, h, aspect_ratio
let entities = [];

function init() {
    scene = new THREE.Scene();


    var entity = new Entity(["2x2_Solid", "5x5_Outline"]);
    entity.spawn(scene);
    entities.push(entity);
    entity.doesAnimate = true;
    entity.position_y += 15;

    var entity = new Entity(["15x15x31_Tower"]);
    entity.spawn(scene);
    entities.push(entity);
    entity.position_y -= 10;

    // create orthograpic camera
    w = window.innerWidth
    h = window.innerHeight;
    aspect_ratio = w / h;
    var view_size = 50;

    camera = new THREE.OrthographicCamera(
        view_size * aspect_ratio / 2,
        view_size * aspect_ratio / -2,
        view_size / 2,
        view_size / -2,
        0.1,
        1000
    );
    camera.position.set(20, 20, 20);
    camera.lookAt(scene.position);

    // set the background color with hexdecimal
    scene.background = new THREE.Color(0x666666);

    // create a webgl renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // add the renderer to the Document Object Model
    // this is different with node?
    document.body.appendChild(renderer.domElement);

    var light = new THREE.AmbientLight(0xffffff, 3.0);
    light.position.set(0, 0, 0);
    scene.add(light);

    var d_light = new THREE.DirectionalLight(0xffffff, 2.0);
    d_light.position.set(0, -10, -5);
    scene.add(d_light);

    // console.log(scene.children);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    for (var i = 0; i < entities.length; i++) {
        entities[i].animate();
    }
    update();
}

function onWindowResize() {
    var new_aspect = window.innerWidth / window.innerHeight;
    camera.left = view_size * new_aspect / 2;
    camera.right = view_size * new_aspect / -2;
    camera.top = view_size / 2;
    camera.bottom = view_size / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var mouse = new THREE.Vector2(-1, -1);

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function update() {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersection = raycaster.intersectObjects(scene.children);
    const entities_hit = [];
    if (intersection.length > 0) {
        for (var i = 0; i < 1; i++) {
            // console.log(intersection[i].object.uuid);
            for (var j = 0; j < entities.length; j++) {
                console.log(entities[j].geometries.includes(intersection[i].object));
                if (!entities_hit.includes(entities[j])) {
                    entities_hit.push(entities[j]);
                }

            }
        }
        for (var i = 0; i < entities_hit.length; i++) {
            // entities_hit[i].animate();
        }
    }
}

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onMouseMove, false);

init();
animate();