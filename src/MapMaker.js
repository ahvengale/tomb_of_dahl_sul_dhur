import load from "./Loader"
import { FileLoader } from "three"
import { Group } from "three"

export default class MapMaker {
    constructor(level) {
        this.level = level
        this.boardGroup = new Group()
    }

    getBoardGroup() {
        return this.boardGroup
    }

    async generate(file) {
        let txtLoader = new FileLoader()
        let mapstring
        txtLoader.load("res/maps/" + file + ".txt", (f) => {
            var lines = f.split('\n');
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
                            })
                            break;
                        case "T":
                            load("tree_tile_test", (e) => {
                                e.position.set(i * 2, 61, j * 2)
                                e.castShadow = true
                                e.receiveShadow = true
                                e.userData.tile = true

                                this.boardGroup.add(e)
                            })
                            break;

                    }
                }
            }
        })
        return this.boardGroup
    }

}