import * as THREE from "three"
import load from "./Loader"

export default class Player {
    constructor(player_id, color, x, z) {
        this.player_id = player_id;
        this.color = color;
        this.x = x;
        this.z = z;
        this.player_units = []
    }

    getPlayerUnits() {
        return this.player_units;
    }

    getPlayerId() {
        return this.player_id;
    }

    createPlayer() {
        let group = new THREE.Group();
        load("test", (e) => {
            e.position.set(0, 5, 0)
            e.geometry.center()
            // e.userData.animated = true
            e.castShadow = true
            e.receiveShadow = true
            group.add(e)
        })
        // load("15x15_emissive", (e) => {
        //     e.position.set(0, 2, 0)
        //     e.geometry.center()
        //     e.material = new THREE.MeshBasicMaterial({ color: this.color })
        //     e.userData.animated = true
        //     e.castShadow = false
        //     e.receiveShadow = false
        //     group.add(e)
        // })
        // load("15x15_glass", (e) => {
        //     e.position.set(0, 2, 0)
        //     e.geometry.center()
        //     e.material = new THREE.MeshPhysicalMaterial({
        //         roughness: 0.2,
        //         transmission: 1.0,
        //         thickness: 2,
        //         clearcoat: 0.3,
        //     });
        //     // console.log(e.material)
        //     e.userData.animated = true
        //     e.castShadow = true
        //     e.receiveShadow = true
        //     group.add(e)
        // })
        // let light = new THREE.PointLight(this.color, 5.0, 8.0)
        // light.position.set(0, 2, 0)
        // light.castShadow = true
        // group.add(light)
        group.position.set(this.x, 0, this.z)
        group.userData.health = 100;
        group.userData.movement = 2;
        group.userData.movable = true
        group.userData.player_id = this.player_id
        if (group.userData.player_id == this.player_id) {
            group.userData.draggable = true
            this.player_units.push(group)
        }

        return group
    }

}