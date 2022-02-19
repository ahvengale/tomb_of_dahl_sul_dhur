class RenderingEngine
{  
    static w = window.innerWidth;
    static h = window.innerHeight;
    static aspect_ratio = RenderingEngine.w / RenderingEngine.h;
    static view_size = 50;
    static entities = [];
    static scene = new THREE.Scene();
    static renderer = new THREE.WebGLRenderer({ antialias: true });
    static camera = new THREE.OrthographicCamera(
        this.view_size * this.aspect_ratio / -2,
        this.view_size * this.aspect_ratio / 2,
        this.view_size / 2,
        this.view_size / -2,
        0.1,
        1000
    );

    static init() {
        window.addEventListener('resize', RenderingEngine.onWindowResize, false);
        RenderingEngine.camera.position.set(500, 500, 500);
        RenderingEngine.camera.lookAt(RenderingEngine.scene.position);

        RenderingEngine.scene.background = new THREE.Color(0x666666);

        RenderingEngine.renderer.setSize(RenderingEngine.w, RenderingEngine.h);
        RenderingEngine.renderer.shadowMap.enabled = true;
        RenderingEngine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(RenderingEngine.renderer.domElement);

        const d_light = new THREE.DirectionalLight(0xffffff, 7.0);
        d_light.position.set(50, 100, 10);
        d_light.castShadow = true;
        var side = 200;
        d_light.shadow.camera.top = side;
        d_light.shadow.camera.bottom = -side;
        d_light.shadow.camera.left = side;
        d_light.shadow.camera.right = -side;
        d_light.shadow.bias = -0.01;
        RenderingEngine.scene.add(d_light);
    }

    static animate() {
        for(var i = 0; i < this.entities.length; i++) {
            this.entities[i].animate();
        }
    }

    static onWindowResize() {
        var new_aspect = window.innerWidth / window.innerHeight;
        this.renderer.camera.left = this.view_size * new_aspect / -2;
        this.renderer.camera.right = this.view_size * new_aspect / 2;
        this.renderer.camera.top = this.view_size / 2;
        this.renderer.camera.bottom = rendering_engine.view_size / -2;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    static onWindowResize() {

    }
}