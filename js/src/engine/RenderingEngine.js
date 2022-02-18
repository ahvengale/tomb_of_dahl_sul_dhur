class RenderingEngine
{  
    constructor() {
        
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.aspect_ratio = this.w / this.h;
        this.view_size = 100;

        this.entities = [];

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.camera = new THREE.OrthographicCamera(
            this.view_size * this.aspect_ratio / -2,
            this.view_size * this.aspect_ratio / 2,
            this.view_size / 2,
            this.view_size / -2,
            0.1,
            1000
        );
    }

    init() {
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt(this.scene.position);

        this.scene.background = new THREE.Color(0x666666);

        this.renderer.setSize(this.w, this.h);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(this.renderer.domElement);

        const d_light = new THREE.DirectionalLight(0xffffff, 10.0);
        d_light.position.set(50, 100, 10);
        d_light.castShadow = true;
        var side = 100;
        d_light.shadow.camera.top = side;
        d_light.shadow.camera.bottom = -side;
        d_light.shadow.camera.left = side;
        d_light.shadow.camera.right = -side;
        d_light.shadow.bias = -0.01;
        this.scene.add(d_light);

        // this.test();
    }

    animate() {
        for(var i = 0; i < this.entities.length; i++) {
            this.entities[i].animate();
        }
    }

    test() {
        for(var tile = 0; tile < 3; tile++) {

            var entity = new Entity(["2x2_Solid", "5x5_Outline", "15x15_CubicDesign"]);
            entity.spawn(this.scene);
            this.entities.push(entity);
            entity.doesAnimate = true;
            entity.position_y += 15;
            entity.position_x += 64 * (tile - 1);
    
            var entity = new Entity(["15x15x31_Tower"]);
            entity.spawn(this.scene);
            this.entities.push(entity);
            entity.position_y -= 10;
            entity.position_x += 64 * (tile - 1);
    
            var entity = new Entity(["base_plate"]);
            entity.spawn(this.scene);
            this.entities.push(entity);
            entity.position_y -= 25;
            entity.position_x += 64 * (tile - 1);
            entity.receiveShadow = false;
    
            var entity = new Entity(["2x2_Solid", "5x5_Outline", "15x15_CubicDesign"]);
            entity.spawn(this.scene);
            this.entities.push(entity);
            entity.doesAnimate = true;
            entity.position_y += 15;
            entity.position_z += 64 * (tile - 1);
    
            var entity = new Entity(["15x15x31_Tower"]);
            entity.spawn(this.scene);
            this.entities.push(entity);
            entity.position_y -= 10;
            entity.position_z += 64 * (tile - 1);
    
            var entity = new Entity(["base_plate"]);
            entity.spawn(this.scene);
            this.entities.push(entity);
            entity.position_y -= 25;
            entity.position_z += 64 * (tile - 1);
        }
    }
}