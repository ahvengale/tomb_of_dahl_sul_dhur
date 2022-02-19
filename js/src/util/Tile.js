class Tile
{  
    constructor(filename, x, z) {
        this.entity = new Entity([filename], [Layer.Tile], this);
        this.tower = new Entity(["Book2"], [], this);
        this.hasTower = true;
        this.x = x;
        this.z = z;
        this.entity.position_x = this.x;
        this.entity.position_z = this.z;
        this.tower.position_x = this.x;
        this.tower.position_z = this.z;
    }

    animate() {
        this.entity.animate();
        if(this.hasTower) {
            this.tower.animate();
        }
    }

    toggleTower() {
        this.hasTower = !this.hasTower;
        this.tower.visible = this.hasTower;
        for(var i = 0; i < this.tower.geometries.length; i++) {
            this.tower.geometries[i].visible = this.hasTower;
        }
    }
}