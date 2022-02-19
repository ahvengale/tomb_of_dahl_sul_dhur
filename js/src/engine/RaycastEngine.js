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
        var hit = [];
        // console.log(intersection);
        if (intersection.length > 0) {
            for(var i = 0; i < intersection.length; i++) {
                // intersection[0].object.visible = !intersection[0].object.visible
                if(!hit.includes(intersection[i].object)) {
                    hit.push(intersection[0].object);
                    RaycastEngine.handleRaycast(intersection[i].object, 0);
                }
            }
        }
    }

    static handleRaycast(object, interaction) {
        if(object.userData.tags.includes(Layer.Tile)) {
            console.log(object.userData.parent);
            object.userData.parent.toggleTower();
            // object.userData.parent.hasTower = !object.userData.parent.hasTower;
            // console.log(object.userData.parent)
        }
    }
}
