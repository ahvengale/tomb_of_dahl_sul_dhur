let rendering_engine

var mouse = new THREE.Vector2(-1, -1);

init();
game_loop();

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onMouseMove, false);

function init() {
    rendering_engine = new RenderingEngine();
    rendering_engine.init();
    console.log(rendering_engine.scene)
}

function game_loop()
{
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

function onMouseOver() {
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
