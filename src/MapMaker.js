import load from "./Loader"
import { FileLoader } from "three"
import { Group } from "three"
import * as THREE from "three";

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
                    let new_tile = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial())
                    switch (mapstring[j]) {
                        case "#":
                            load("grass_tile_base", (e) => {
                                new_tile.geometry = e.geometry
                                new_tile.material = e.material
                                new_tile.castShadow = true
                                new_tile.receiveShadow = true
                                new_tile.userData.tile = true
                                new_tile.scale.set(1.3, 1, 1.3)
                                new_tile.position.set(i * 2, 0, j * 2)
                            })
                            break;
                        case "X":
                            load("ModularFloor", (e) => {
                                new_tile.position.set(i * 2, 0, j * 2)
                                new_tile.geometry = e.geometry
                                new_tile.material = e.material
                                new_tile.castShadow = true
                                new_tile.receiveShadow = true
                                new_tile.userData.tile = true
                                new_tile.material[0].color.set(0x0f0f0f)
                            })
                            break;
                        case "T":
                            load("tree_tile_test", (e) => {
                                new_tile.position.set(i * 2, 61, j * 2)
                                new_tile.geometry = e.geometry
                                new_tile.material = e.material
                                new_tile.castShadow = true
                                new_tile.receiveShadow = true
                                new_tile.userData.tile = true
                            })
                            break;
                    }
                    this.tiles.push(new_tile)
                }

            }
            console.log(this.tiles)
            for(let i = 0; i < this.tiles.length; i++) {
                console.log('here')
                this.boardGroup.add(this.tiles[i])
                if(this.boardGroup.children.indexOf(this.tiles[i]) != -1) {
                    console.log("yay!")
                }
            }
            console.log(this.boardGroup)
        })
        
        return this.boardGroup
    }
}