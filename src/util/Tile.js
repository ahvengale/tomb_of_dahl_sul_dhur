class Tile
{  
    constructor(filename, x, z) {
        this.entity = new Entity([filename]);
        this.tower = new Entity(["2x2_Solid", "5x5_Outline", "15x15_CubicDesign"]);;
        this.hasTower = false;
        this.x = x;
        this.z = z;
        this.entity.position_x = this.x;
        this.entity.position_z = this.z;
        // console.log(this.entity);
    }

    animate() {
        this.entity.animate();
        if(this.hasTower) {
            this.tower.animate();
            console.log();
        }
    }
}