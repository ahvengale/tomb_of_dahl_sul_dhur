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
        if (intersection.length > 0) {
            for(var i = 0; i < intersection.length; i++) {
                console.log(intersection[i].object.userData.tags);
                if(intersection[i].object.userData.tags.length > 0) {
                    console.log('yas');
                    // if(!hit.includes(intersection[i].object)) {
                        // hit.push(intersection[i].object);
                    RaycastEngine.handleRaycast(intersection[i].object, 0);
                    //}
                    break;
                }
            }
        }
    }

    static handleRaycast(object, interaction) {
        if(object.userData.tags.includes(Layer.Tile)) {
            object.userData.parent.toggleTower();
        }
    }
}
