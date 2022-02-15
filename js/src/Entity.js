class Entity {
    constructor() {
        this.files = [ "res/63_ring.obj",
                       "res/57_ring.obj",
                       "res/51_ring.obj",
                       "res/31_sphere.obj",
                      ];
        this.geometries = [];
        this.materials = [];
        this.colors =   [   0xffffff,
                            0xffffff,
                            0xffffff,
                            0x00ff00
                        ];
                        
    }
    spawn(scene) {
        const loader = new THREE.OBJLoader();
        var temp_geometry;
        const _scene = scene;
        const _geometry = [];
        for(var i = 0; i < this.files.length; i++) {
            const _colors = this.colors[i];
            loader.load(this.files[i], function(object) {
                var temp_geo = object.children[0].geometry;
                temp_geo.center();
                var temp_mat = new THREE.MeshLambertMaterial({ color: _colors, side: THREE.DoubleSide });
                // var temp_mat = new THREE.LineBasicMaterial({ color: _colors });
                temp_geometry = new THREE.Mesh(temp_geo, temp_mat);
                // temp_geometry = new THREE.LineSegments(temp_geo, temp_mat);
                // console.log(temp_geometry);
                _scene.add(temp_geometry);
                _geometry.push(temp_geometry);
            });
        }
        // console.log(_geometry);
        this.geometries = _geometry;
    }
    animate() {
        for(var i = 0; i < this.geometries.length; i++) {
            this.geometries[i].rotation.x += (i + 1) * 0.001;
            this.geometries[i].rotation.y += (i + 1) * 0.001;
            this.geometries[i].rotation.z += (i + 1) * 0.001;
        }
    }
}