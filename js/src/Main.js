let rendering_engine, gameboard

const mouse = new THREE.Vector2(-1, -1);

init();
game_loop();

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', RaycastEngine.onClick, false);
document.addEventListener('mousemove', RaycastEngine.onMouseMove, false);

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
