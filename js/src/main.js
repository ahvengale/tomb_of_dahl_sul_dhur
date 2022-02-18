let rendering_engine, gameboard

const mouse = new THREE.Vector2(-1, -1);

init();
game_loop();

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousedown', onClick, false);
document.addEventListener('mousemove', onMouseMove, false);

function init() {
    rendering_engine = new RenderingEngine();
    rendering_engine.init();
    // console.log(rendering_engine.scene)

    gameboard = new GameBoard(3);
    gameboard.init(rendering_engine);
    // gameboard.test(rendering_engine, 0);
    // gameboard.test(rendering_engine, 2);
    // gameboard.test(rendering_engine, 5);
    console.log(gameboard);
}

function game_loop() {
    requestAnimationFrame(game_loop);
    rendering_engine.renderer.render(rendering_engine.scene, rendering_engine.camera);
    rendering_engine.animate();
}

function onWindowResize() {
    var new_aspect = window.innerWidth / window.innerHeight;
    rendering_engine.camera.left = rendering_engine.view_size * new_aspect / -2;
    rendering_engine.camera.right = rendering_engine.view_size * new_aspect / 2;
    rendering_engine.camera.top = rendering_engine.view_size / 2;
    rendering_engine.camera.bottom = rendering_engine.view_size / -2;
    rendering_engine.camera.updateProjectionMatrix();
    rendering_engine.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function onClick() {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, rendering_engine.camera);
    var intersection = raycaster.intersectObjects(rendering_engine.scene.children);
    var tiles = [];
    // console.log(intersection);
    const entities_hit = [];
    if (intersection.length > 0) {
        for (var i = 0; i < intersection.length; i++) {
            // console.log("intersected object");
            // console.log(console.log(intersection[i].object));
            // console.log("tile objects");
            for (var j = 0; j < gameboard.tiles.length; j++) {
                // console.log(gameboard.tiles[j].entity.geometries.includes(intersection[i].object));
                if(gameboard.tiles[j].entity.geometries.includes(intersection[i].object)) {
                    console.log(gameboard.tiles[j].tower);
                    console.log(gameboard.tiles[j].tower.visible);
                    if(!tiles.includes(gameboard.tiles[j])) {
                        tiles.push(gameboard.tiles[j]);
                    }
                }
            }
        }
    }
    // console.log(tiles);
    for(var i = 0; i < tiles.length; i++) {
        tiles[i].hasTower = !tiles[i].hasTower;
    }
}
