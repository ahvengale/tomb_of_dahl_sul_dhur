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
        this.capturePattern()
        console.log(this)
        return this

    }

    capturePattern() {
        let txtLoader = new THREE.FileLoader();
        let capture_map = this.uType + "_attack.txt";
        let mapstring
        txtLoader.load(("res/maps/" + capture_map), (f) => {
            var lines = f.split('\n');
            for (let i = 0; i < lines.length; i++) {
                mapstring = lines[i]
                console.log(mapstring)
                for (let j = 0; j < mapstring.length; j++) {
                    switch (mapstring[j]) {
                        case "-":

                            break;
                        case "X":
                            const geometry = new THREE.BoxGeometry(.5, 0.1, .5);
                            const material = new THREE.MeshPhysicalMaterial({ color: 0x00FF00 });
                            material.opacity = 1
                            material.reflectivity = 1
                            material.transmission = .5

                            const cube = new THREE.Mesh(geometry, material);
                            cube.position.set(i * 2, .5, j * 2)
                            cube.position.set(i * 2, .5, j * 2)
                            cube.receiveShadow = true

                            this.add(cube);

                            // load("ModularFloor", (e) => {
                            //     e.position.set(i * 2, 0, j * 2)
                            //     e.castShadow = true
                            //     e.receiveShadow = true
                            //     e.userData.tile = true
                            //     e.material[0].color.set(0x0f0f0f)
                            //     this.boardGroup.add(e)
                            // })
                            break;

                    }
                }
            }
        })

    }

}