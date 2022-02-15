class Entity {
    constructor() {
        this.files = [
            "res/models/obj/15x15.obj",
            "res/models/obj/13x13.obj",
            "res/models/obj/11x11.obj",
            "res/models/obj/9x9.obj",
            "res/models/obj/7x7.obj",
            "res/models/obj/3xCube.obj"
        ];
        this.geometries = [];
        this.materials = [];
        this.colors =   [   0xffffff,
                            0xaaaaaa,
                            0x777777,
                            0x444444,
                            0x000000,
                            0x00ff00
                        ];
                        
    }
    spawn(scene) {
        const loader = new THREE.OBJLoader();
        var _geometry;
        const geometries = [];
        const _scene = scene;

        for(var i = 0; i < this.files.length; i++) {
            const _color = this.colors[i];
                loader.load(this.files[i],
                    (object) => {
                        _geometry = object.children[0].geometry;
                        _geometry.center();
                        var temp_mat = new THREE.MeshLambertMaterial({ color: _color, side: THREE.DoubleSide });
                        var temp_geo = new THREE.Mesh(_geometry, temp_mat);
                        geometries.push(temp_geo);
                        _scene.add(temp_geo);
                    });
            this.geometries = geometries;
            console.log(this.geometries);
        }
    }
    animate() {
        for(var i = 0; i < this.geometries.length; i++) {
            this.geometries[i].rotation.x += (i + 1) * 0.001;
            this.geometries[i].rotation.y += (i + 1) * 0.001;
            this.geometries[i].rotation.z += (i + 1) * 0.001;
        }
    }
}