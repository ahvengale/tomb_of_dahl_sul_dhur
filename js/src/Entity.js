class Entity {
    constructor(files) {
        this.files = files;
        this.geometries = [];
        this.outlines = [];
        this.doesAnimate = false;
        this.position_x = 0;
        this.position_y = 0;
        this.position_z = 0;
    }
    animate() {
        for (var i = 0; i < this.geometries.length; i++) {
            this.geometries[i].position.x = this.position_x;
            this.geometries[i].position.y = this.position_y;
            this.geometries[i].position.z = this.position_z;
        }
        if (this.doesAnimate) {
            for (var i = 0; i < this.geometries.length; i++) {
                this.geometries[i].rotation.x = i + Date.now() * 0.001;
                this.geometries[i].rotation.y = i + Date.now() * 0.001;
                this.geometries[i].rotation.z = i + Date.now() * 0.001;
            }
        }
    }
    spawn(scene) {
        var mtlLoader = new THREE.MTLLoader();
        var geometries = [];
        var outlines = [];
        mtlLoader.setPath('models/models/obj/');
        for (var i = 0; i < this.files.length; i++) {
            const url = this.files[i];
            var _geometry = new THREE.Mesh();
            mtlLoader.load(url + ".mtl", function (materials) {
                materials.preload();

                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath('models/models/obj/');
                objLoader.load(url + ".obj", function (object) {
                    _geometry = object.children[0];
                    _geometry.geometry.center();
                    _geometry.scale.set(10, 10, 10);
                    _geometry.material.side = THREE.DoubleSide;
                    _geometry.castShadow = true;
                    _geometry.receiveShadow = true;
                    scene.add(_geometry);
                    geometries.push(_geometry);
                    // _geometry.visible = false;
                });
            });
        }
        this.geometries = geometries;
    }
    despawn(scene) {
        for(var i = 0; i < this.geometries.length; i++) {
            scene.remove(this.geometries[i]);
        }
    }
}