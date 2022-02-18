class Tile
{  
    constructor(filename, x, z) {
        this.entity = new Entity([filename]);
        this.hasTower = false;
        this.x = x;
        this.z = z;
        this.entity.position_x = this.x;
        this.entity.position_z = this.z;
        console.log(this.entity);
    }

    animate() {
        this.entity.animate();
    }
}