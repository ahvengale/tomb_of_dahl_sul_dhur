let rendering_engine

function init() {
    rendering_engine = new RenderingEngine(window);
    rendering_engine.init();
}

function game_loop()
{
    requestAnimationFrame(game_loop);
    rendering_engine.renderer.render(rendering_engine.scene, rendering_engine.camera);
    rendering_engine.animate();
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

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onMouseMove, false);

init();
game_loop();