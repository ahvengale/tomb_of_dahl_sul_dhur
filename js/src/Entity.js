class Entity {
    constructor() {
        this.files = [
            "3xCube", "15x15_outline",
        ];
        this.geometries = [];         
    }
    animate() {
        for(var i = 0; i < this.geometries.length; i++) {
            this.geometries[i].rotation.x += (i + 1) * 0.001;
            this.geometries[i].rotation.y += (i + 1) * 0.001;
            this.geometries[i].rotation.z += (i + 1) * 0.001;
        }
    }
    spawn(scene) {
        const mtlLoader = new THREE.MTLLoader();
        const geometries = [];
        mtlLoader.setPath( 'res/models/obj/' );
        for (var i = 0; i < this.files.length; i++) {
            const url = this.files[i];
            var _geometry = new THREE.Mesh();
            mtlLoader.load( url + ".mtl", function( materials ) {
                materials.preload();

                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath( 'res/models/obj/' );
                objLoader.load( url + ".obj", function ( object ) {
                    _geometry = object.children[0];
                    _geometry.geometry.center();
                    _geometry.material.side = 1;
                    scene.add( _geometry );
                    geometries.push(_geometry);
                    // console.log(_geometry)
                });
            });
        } 
        this.geometries = geometries;
        // console.log(this.geometries);
        // console.log(this.geometries[0]);
    }
}