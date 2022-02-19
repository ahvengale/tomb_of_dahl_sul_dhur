class GameBoard
{  
    constructor(boardSize) {
        this.tiles = [];
        this.boardSize = boardSize;
    }

    init() {
        for(var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                var tile = new Tile("ModularFloor", i * 21, j * 21);
                this.tiles.push(tile);
                tile.entity.spawn(RenderingEngine.scene);
                RenderingEngine.entities.push(tile);

                var tower = tile.tower;
                tower.doesAnimate = true;
                tower.position_y += 15;
                tower.position_x = tile.tower.position_x;
                tower.position_z = tile.tower.position_z;
                tower.spawn(RenderingEngine.scene);
                RenderingEngine.entities.push(tower);
            }
        }
    }

    animate() {
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].animate();
        }
    }
}