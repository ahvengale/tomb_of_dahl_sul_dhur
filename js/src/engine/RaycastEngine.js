class RaycastEngine { 
    static raycast = new THREE.Raycaster();
    static mouse = new THREE.Vector2(-1, -1);
    static rendering_engine;

    init() {

    }

    static onMouseMove(event) {
        RaycastEngine.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        RaycastEngine.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    }

    static onClick() {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(RaycastEngine.mouse, RaycastEngine.rendering_engine.camera);
        var intersection = raycaster.intersectObjects(RaycastEngine.rendering_engine.scene.children);
        var tile;
        // console.log(intersection);
        const entities_hit = [];
        if (intersection.length > 0) {
            console.log(intersection[0].object.visible = !intersection[0].object.visible);
        }

    }
}