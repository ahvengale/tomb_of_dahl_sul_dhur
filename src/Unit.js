import * as THREE from "three"
import load from "./Loader"

export default class Unit extends THREE.Group {
    constructor(type, x, z) {
        super()
        this.uType = type
        this.x = x;
        this.z = z;
        this.unitType = {
            standard: {
                basic: '15x15_basic',
                emissive: '15x15_emissive',
                glass: '15x15_glass'
            }
        }
        this.attack_pattern = []
        this.movement_pattern = []
    }

    create() {

        switch (this.uType) {
            case "standard":
                load(this.unitType.standard.basic, (e) => {
                    e.position.set(0, 2, 0)
                    e.geometry.center()
                    e.userData.animated = true
                    e.castShadow = true
                    e.receiveShadow = true
                    this.add(e)
                })
                load(this.unitType.standard.emissive, (e) => {
                    e.position.set(0, 2, 0)
                    e.geometry.center()
                    e.material = new THREE.MeshBasicMaterial({ color: this.color })
                    e.userData.animated = true
                    e.castShadow = false
                    e.receiveShadow = false
                    this.add(e)
                })
                load(this.unitType.standard.glass, (e) => {
                    e.position.set(0, 2, 0)
                    e.geometry.center()
                    e.material = new THREE.MeshPhysicalMaterial({
                        roughness: 0.2,
                        transmission: 1.0,
                        thickness: 2,
                        clearcoat: 0.3,
                    });
                    // console.log(e.material)
                    e.userData.animated = true
                    e.castShadow = true
                    e.receiveShadow = true
                    this.add(e)
                })
                let light = new THREE.PointLight(this.color, 5.0, 8.0)
                light.position.set(0, 2, 0)
                light.castShadow = true
                this.add(light)
                this.position.set(this.x, 0, this.z)
                this.userData.health = 100;
                this.userData.movement = 2;
                this.userData.movable = true
                this.userData.player_id = this.player_id

                break;
            default:
                console.log("Could not create specified Unit type")
        }
        for(let elem of [ {type: "_attack.txt", arr: this.attack_pattern}, {type: "_movement.txt", arr: this.movement_pattern} ]) {
            this.capturePattern(elem.type, elem.arr)
        }
        console.log(this)
        return this

    }

    // generates array of relative tile positions for valid movement and attacking
    capturePattern(type, arr) {
        let txtLoader = new THREE.FileLoader();
        let capture_map = this.uType + type;
        let mapstring
        txtLoader.load(("res/maps/" + capture_map), (f) => {
            let lines = f.split('\n');
            // calculate offsets assuming unit is always in center
            let x_offset = Math.floor(lines.length / 2)
            let z_offset = Math.floor(lines[0].length / 2)
            for (let i = 0; i < lines.length; i++) {
                mapstring = lines[i]
                // console.log(mapstring)
                for (let j = 0; j < mapstring.length; j++) {
                    switch (mapstring[j]) {
                        case "-":
                            // nothing
                            break;
                        case "X":
                            // push relative position w/ offset
                            arr.push({x: i - x_offset, z: j - z_offset})
                            break;

                    }
                }
            }
        })
        // console.log(this.pattern)
    }

}