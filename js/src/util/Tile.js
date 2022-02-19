class Tile
{  
    constructor(filename, x, z) {
        this.entity = new Entity([filename], [Layer.Tile], this);
        this.x = x;
        this.z = z;
        this.entity.position_x = this.x;
        this.entity.position_z = this.z;
        this.entity.visible = true;
    }

    animate() {
        this.entity.animate();
        if(this.hasTower) {
            this.tower.animate();
        }
    }
    toggle() {
        this.entity.visible = !this.entity.visible;
        for(var i = 0; i < this.entity.geometries.length; i++) {
            this.entity.geometries[i].visible = this.entity.visible;
        }
    }
}