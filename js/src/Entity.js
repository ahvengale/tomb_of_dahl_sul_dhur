class Entity {
    constructor() {
        this.files = [ "res/16x16.obj",
                        //"res/14x14.obj",
                        "res/12x12.obj",
                        //"res/10x10.obj",
                        "res/8x8.obj",
                        //"res/6x6.obj",
                        "res/core_shell.obj"
                      ];
        this.geometries = [];
        this.materials = [];
        this.colors =   [ 0xffffff,
                          0x444444,
                          0x111111,
                          0xff0000
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
                console.log(temp_geometry);
                _scene.add(temp_geometry);
                _geometry.push(temp_geometry);
            });
        }
        // console.log(_geometry);
        this.geometries = _geometry;
    }
    animate() {
        for(var i = 0; i < this.geometries.length; i++) {
            this.geometries[i].rotation.x += (i + 1) / 1000;
            this.geometries[i].rotation.y += (i + 1) / 1000;
            this.geometries[i].rotation.z += (i + 1) / 1000;
        }
    }
}