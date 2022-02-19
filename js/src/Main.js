let rendering_engine, gameboard

init();
game_loop();

function init() {
    RenderingEngine.init();
    RaycastEngine.init();
    // RenderingEngine.map.init();

    gameboard = new GameBoard(1);
    gameboard.init(RenderingEngine.renderer);
}

function game_loop() {
    requestAnimationFrame(game_loop);
    RenderingEngine.renderer.render(RenderingEngine.scene, RenderingEngine.camera);
    RenderingEngine.animate();
}
