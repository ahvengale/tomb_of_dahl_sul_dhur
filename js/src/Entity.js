class Entity {
    constructor(files, tags, parent) {
        this.files = files;
        this.geometries = [];
        this.outlines = [];
        this.doesAnimate = false;
        this.position_x = 0;
        this.position_y = 0;
        this.position_z = 0;
        this.tags = tags
        this.parent = parent;
        console.log()
    }
    animate() {
        for (var i = 0; i < this.geometries.length; i++) {
            this.geometries[i].position.x = this.position_x;
            this.geometries[i].position.y = this.position_y;
            this.geometries[i].position.z = this.position_z;
        }
        if (this.doesAnimate) {
            for (var i = 0; i < this.geometries.length; i++) {
                this.geometries[i].rotation.x = Math.sin(Date.now() * 0.003) * 0.01;
                this.geometries[i].rotation.y = Math.sin(Date.now() * 0.003) * 0.01;
                this.geometries[i].rotation.z = Math.sin(Date.now() * 0.003) * 0.01;
            }
        }
    }
    spawn() {
        var mtlLoader = new THREE.MTLLoader();
        var geometries = [];
        mtlLoader.setPath('models/models/obj/');

        for (var i = 0; i < this.files.length; i++) {
            var url = this.files[i];
            var tags = this.tags;
            var parent = this.parent;
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
                    _geometry.visible = true;
                    _geometry.userData.tags = tags;
                    _geometry.userData.parent = parent;

                    geometries.push(_geometry);
                    RenderingEngine.scene.add(_geometry);
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