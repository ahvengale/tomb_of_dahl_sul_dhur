class GameBoard
{  
    constructor(boardSize) {
        this.tiles = [];
        this.boardSize = boardSize;
    }

    init(renderer) {
        for(var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                var tile = new Tile("base_plate", i * 64, j * 64);
                // console.log(tile)
                // console.log([i, j]);
                this.tiles.push(tile);
                tile.entity.spawn(renderer.scene);
                renderer.entities.push(tile);

                var tower = tile.tower;
                tile.hasTower = true;
                tower.spawn(renderer.scene);
                renderer.entities.push(tower);
                tower.doesAnimate = true;
                tower.position_y += 20;
                tower.position_x = tile.tower.position_x;
                tower.position_z = tile.tower.position_z;
                tile.tower = tower;
            }
        }
    }

    animate() {
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].animate();
        }
    }

    test(renderer, number) {
        var tower = this.tile.tower;
        tile.hasTower = true;
        tower.spawn(renderer.scene);
        renderer.entities.push(entity);
        tower.doesAnimate = false;
        tower.position_y += 20;
        tower.position_x = tile.tower.position_x;
        tower.position_z = tile.tower.position_z;
        this.tiles[number].tower = entity;

        // var entity = new Entity(["15x15x31_Tower"]);
        // entity.spawn(renderer.scene);
        // renderer.entities.push(entity);
        // entity.position_y += 15;
    }
}