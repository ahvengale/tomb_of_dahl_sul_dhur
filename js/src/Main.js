const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#C'),
});

const w = window.innerWidth;
const h = window.innerHeight;
const aspect_ratio = w / h;
const view_size = 5;
const camera = new THREE.OrthographicCamera(
    view_size * aspect_ratio / -2,
    view_size * aspect_ratio / 2,
    view_size / 2,
    view_size / -2,
    0.1,
    1000
);
camera.position.set(5, 5, 5);
camera.lookAt(scene.position);

renderer.setSize(w, h);

const amb_light = new THREE.AmbientLight( 0xffffff, 2.0);
amb_light.position.set(0, 0, 0);
scene.add(amb_light)

const dir_light = new THREE.DirectionalLight( 0xffffff, 2.0);
dir_light.position.set(0, 100, 50);
scene.add(dir_light)

load("ModularFloor", 0, 0, 0);
load("ModularFloor", 2, 0, 2);
load("ModularFloor", 0, 0, 2);
load("ModularFloor", 2, 0, 0);

renderer.render(scene, camera);

animate();

function load(filename, x, y, z) {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/models/obj/');
    mtlLoader.load(filename + ".mtl", function (materials) {
        materials.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/models/obj/');
        objLoader.load(filename + ".obj", function (object) {
            object.children[0].position.set(x, y, z);
            scene.add( object.children[0] )
        });
    });
}

const mouse = new THREE.Vector2(-1, -1);

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function onClick() {
    const raycast = new THREE.Raycaster();
    raycast.setFromCamera(mouse, camera);
    var intersection = raycast.intersectObjects(scene.children);
    if (intersection.length > 0) {
        console.log(intersection[0])
        intersection[0].object.visible = !intersection[0].object.visible
    }
}

function onWindowResize() {
    const new_aspect = window.innerWidth / window.innerHeight;
    camera.left = view_size * new_aspect / -2;
    camera.right = view_size * new_aspect / 2;
    camera.top = view_size / 2;
    camera.bottom = view_size / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('mousedown', onClick, false);
document.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('resize', onWindowResize, false);

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};
