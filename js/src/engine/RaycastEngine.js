class RaycastEngine { 
    static raycast = new THREE.Raycaster();
    static mouse = new THREE.Vector2(-1, -1);
    static rendering_engine;

    static init() {
        window.addEventListener('click', RaycastEngine.onClick, false);
        document.addEventListener('mousemove', RaycastEngine.onMouseMove, false);
    }

    static onMouseMove(event) {
        RaycastEngine.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        RaycastEngine.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    }

    static onClick() {
        RaycastEngine.raycast = new THREE.Raycaster();
        RaycastEngine.raycast.setFromCamera(RaycastEngine.mouse, RenderingEngine.camera);
        var intersection = RaycastEngine.raycast.intersectObjects(RenderingEngine.scene.children);
        var tile;
        // console.log(intersection);
        const entities_hit = [];
        if (intersection.length > 0) {
            console.log(intersection[0].object.visible = !intersection[0].object.visible);
            // console.log(intersection[0].object);
        }

    }
}
