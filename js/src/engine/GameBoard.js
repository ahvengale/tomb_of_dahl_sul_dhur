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
                console.log(tile)
                console.log([i, j]);
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
}