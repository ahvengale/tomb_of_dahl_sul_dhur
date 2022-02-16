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
            for(var i = 0; i < this.geometries.length; i++) {
                this.geometries[i].position.x = this.position_x;
                this.geometries[i].position.y = this.position_y;
                this.geometries[i].position.z = this.position_z;
            }
            for(var i = 0; i < this.outlines.length; i++) {
                this.outlines[i].position.x = this.position_x;
                this.outlines[i].position.y = this.position_y;
                this.outlines[i].position.z = this.position_z;
            }
            if(this.doesAnimate)
            {
                for(var i = 0; i < this.geometries.length; i++) {
                    this.geometries[i].rotation.x = i + Date.now() * 0.001;
                    this.geometries[i].rotation.y = i + Date.now() * 0.001;
                    this.geometries[i].rotation.z = i + Date.now() * 0.001;
                }
                for(var i = 0; i < this.outlines.length; i++) {
                    this.outlines[i].rotation.x = i + Date.now() * 0.001;
                    this.outlines[i].rotation.y = i + Date.now() * 0.001;
                    this.outlines[i].rotation.z = i + Date.now() * 0.001;
                }
            }
    }
    spawn(scene) {
        const mtlLoader = new THREE.MTLLoader();
        const geometries = [];
        const outlines = [];
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
                    var _edges = new THREE.EdgesGeometry( _geometry.geometry );
                    _edges.scale = 1.5;
                    var _edge_model = new THREE.LineSegments(_edges, _geometry.material);
                    // _edge_model.scale += 0.0
                    scene.add( _geometry );
                    scene.add(_edge_model)
                    geometries.push(_geometry);
                    outlines.push(_edge_model);
                    // console.log(_geometry)
                });
            });
        } 
        this.geometries = geometries;
        this.outlines = outlines;
        // console.log(this.geometries);
        // console.log(this.geometries[0]);
    }
}