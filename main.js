let scene, camera, renderer, sphere;
let w, h, aspect_ratio
let player_o, player_i, player_c;
let entity;

function init () {
    scene = new THREE.Scene();

    // const loader = new THREE.OBJLoader();

    // loader.load('res/outter_shell.obj', function(object) {
    //     const player_o_geo = object.children[0].geometry;
    //     player_o_geo.center();
    //     const player_o_mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    //     player_o = new THREE.Mesh(player_o_geo, player_o_mat);
    //     scene.add(player_o);
    // });

    // loader.load('res/inner_shell.obj', function(object) {
    //     const player_i_geo = object.children[0].geometry;
    //     player_i_geo.center();
    //     const player_i_mat = new THREE.MeshLambertMaterial({ color: 0x222222, side: THREE.DoubleSide });
    //     player_i = new THREE.Mesh(player_i_geo, player_i_mat);
    //     scene.add(player_i);
    // });

    // loader.load('res/core_shell.obj', function(object) {
    //     const player_c_geo = object.children[0].geometry;
    //     player_c_geo.center();
    //     const player_c_mat = new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    //     player_c = new THREE.Mesh(player_c_geo, player_c_mat);
    //     scene.add(player_c);
    // });

    entity = new Entity();
    entity.spawn(scene);

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
    scene.background = new THREE.Color(0x000000);

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
    entity.animate();
    update();
    // player_o.rotation.x += 0.003;
    // player_o.rotation.y += 0.003;
    // player_o.rotation.z += 0.003;

    // player_i.rotation.x -= 0.005;
    // player_i.rotation.y -= 0.005;
    // player_i.rotation.z -= 0.005;

    // player_c.rotation.x += 0.01;
    // player_c.rotation.y += 0.01;
    // player_c.rotation.z += 0.01;
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
