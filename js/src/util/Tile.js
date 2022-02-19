class Tile
{  
    constructor(filename, x, z) {
        this.entity = new Entity([filename]);
        this.tower = new Entity(["Book_Open"]);
        this.hasTower = true;
        this.x = x;
        this.z = z;
        this.entity.position_x = this.x;
        this.entity.position_z = this.z;
        this.tower.position_x = this.x;
        this.tower.position_z = this.z;
        // console.log(this.entity);
    }

    animate() {
        this.entity.animate();
        if(this.hasTower) {
            this.tower.animate();
            // console.log();
        }
    }
}