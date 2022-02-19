let rendering_engine, gameboard

init();
game_loop();

function init() {
    RenderingEngine.init();
    RaycastEngine.init();
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
    RenderingEngine.renderer.render(RenderingEngine.scene, RenderingEngine.camera);
    RenderingEngine.animate();
}
