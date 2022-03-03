import load from "./Loader"
import { FileLoader } from "three"
import { Group } from "three"

export default class MapMaker {
    constructor(level) {
        this.level = level
        this.boardGroup = new Group()
        this.tiles = []
        this.size = {}
    }

    getBoardGroup() {
        return this.boardGroup
    }

    getTiles() {
        return this.tiles
    }

    position_to_index(x, z) {
        return (x * this.size.x) + (z)
    }

    index_to_position(index) {
        return {x: (Math.floor(index / this.size.x)), z: (index % this.size.x)}
    }

    async generate(file) {
        let txtLoader = new FileLoader()
        let mapstring
        await txtLoader.load("res/maps/" + file + ".txt", (f) => {
            let lines = f.split('\n');
            this.size.z = lines.length
            this.size.x = lines[0].length
            for (let i = 0; i < lines.length; i++) {
                mapstring = lines[i]
                for (let j = 0; j < mapstring.length; j++) {
                    switch (mapstring[j]) {
                        case "#":
                            load("grass_tile_base", (e) => {
                                e.scale.set(1.3, 1, 1.3)
                                e.position.set(i * 2, 0, j * 2)
                                e.castShadow = true
                                e.receiveShadow = true
                                e.userData.tile = true
                                this.boardGroup.add(e)
                                this.tiles.push(e)
                            })
                            break;
                        case "X":
                            load("ModularFloor", (e) => {
                                e.position.set(i * 2, 0, j * 2)
                                e.castShadow = true
                                e.receiveShadow = true
                                e.userData.tile = true
                                e.material[0].color.set(0x0f0f0f)
                                this.boardGroup.add(e)
                                this.tiles.push(e)
                            })
                            break;
                        case "T":
                            load("tree_tile_test", (e) => {
                                e.position.set(i * 2, 61, j * 2)
                                e.castShadow = true
                                e.receiveShadow = true
                                e.userData.tile = true
                                this.boardGroup.add(e)
                                this.tiles.push(e)
                                // console.log(this.tiles)
                            })
                            break;

                    }
                }
            }
        })
        return this.boardGroup
    }
}