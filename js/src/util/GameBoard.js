class GameBoard
{  
    constructor(boardSize) {
        this.tiles = [];
        this.boardSize = boardSize;
    }

    init() {
        for(var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                var tile = new Tile("ModularFloor", i * 20, j * 20);
                this.tiles.push(tile);
                tile.entity.spawn(RenderingEngine.scene);
                RenderingEngine.entities.push(tile);
            }
        }
    }

    animate() {
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].animate();
        }
    }
}