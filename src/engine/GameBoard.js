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
            }
        }
    }

    animate() {
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].animate();
        }
    }

    test(renderer, number) {
        var entity = this.tiles[number].tower;
        this.tiles[number].hasTower = true;
        entity.spawn(renderer.scene);
        renderer.entities.push(entity);
        entity.doesAnimate = true;
        entity.position_y += 20;
        entity.position_x = this.tiles[number].tower.position_x;
        entity.position_z = this.tiles[number].tower.position_z;
        this.tiles[number].tower = entity;

        // var entity = new Entity(["15x15x31_Tower"]);
        // entity.spawn(renderer.scene);
        // renderer.entities.push(entity);
        // entity.position_y += 15;
    }
}