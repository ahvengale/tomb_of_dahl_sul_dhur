import * as THREE from "three"
import { BoxBufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Unit from "./Unit";

export default class Player {

    constructor(renderer, scene, cam, player_id, color, x, z, map) {
        this.renderer = renderer
        this.scene = scene
        this.camera = cam
        this.player_id = player_id;
        this.color = color;
        this.x = x;
        this.z = z;
        this.player_units = []
        this.controls = new OrbitControls(this.camera, renderer.domElement)
        this.unit_intersection
        this.active
        this.floor_intersection
        this.map = map
    }

    getPlayerControls() {
        return this.controls
    }

    getPlayerUnits() {
        return this.player_units;
    }

    addUnit(type) {
        const u = new Unit(type, this.x, this.z);
        let unit = u.create();
        this.player_units.push(u)
        return unit
    }

    getPlayerId() {
        return this.player_id;
    }

    createPlayer() {

    }

    init() {
        // mouse defined for mousemove event
        const mouse = new THREE.Vector2(-1, -1)
        // variables for raycasting and drag positions
        const raycast = new THREE.Raycaster()
        const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

        let onPointerDown = (e) => {
            // get position for mouse and raycast
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
            raycast.setFromCamera(mouse, this.camera);
            this.unit_intersection = raycast.intersectObjects(this.player_units)
            this.floor_intersection = new THREE.Vector3()
            this.floor_intersection = raycast.ray.intersectPlane(floor, this.floor_intersection)
            this.floor_intersection.set(Math.round(this.floor_intersection.x / 2) * 2, 0.0, Math.round(this.floor_intersection.z / 2) * 2)
            // console.log(this.floor_intersection)
        }

        let onPointerUp = () => {
            // player has already clicked on something to move
            let has_action = true
            let has_enemy = true
            if (this.active) {
                for(let elem of [{arr: this.active.attack_pattern, type: "attack"}, {arr: this.active.movement_pattern, type: "movement"}]) {
                    // track indicies
                    let indicies = []
                    // move the unit and reset to not active state
                    for(let i = 0; i < elem.arr.length; i++) {
                        if(elem.arr[i].x + this.active.position.x >= 0 && elem.arr[i].z + this.active.position.z  >= 0) {
                            try {
                                let index = this.map.position_to_index(
                                    elem.arr[i].x + (this.active.position.x / 2),
                                    elem.arr[i].z  + (this.active.position.z / 2)
                                )
                                indicies.push(index)
                                this.unhighlight_tile(index)
                            }
                            catch(err) {
                                
                            }
                        }
                    }
                    // console.log(indicies)
                    // console.log(this.map.position_to_index(this.floor_intersection.x, this.floor_intersection.z))
                    let index = this.map.position_to_index(this.floor_intersection.x / 2, this.floor_intersection.z / 2)
                    if(indicies.includes(index)) {
                        if(has_action) {
                            if(elem.type == "movement" && !this.map.tiles[index].userData.occupied) {
                                let old_index = this.map.position_to_index((this.active.position.x / 2), (this.active.position.z / 2))
                                this.map.tiles[old_index].userData.occupied = false
                                this.active.position.x = (this.floor_intersection.x)
                                this.active.position.y = (this.floor_intersection.y)
                                this.active.position.z = (this.floor_intersection.z)
                                this.map.tiles[index].userData.occupied = true
                                has_action = false
                            }
                            else if(elem.type == "attack" && this.map.tiles[index].userData.enemy) {
                                console.log("ouch")
                                has_action = false
                            }
                        }
                    }
                }
                this.active = false
            }
            // player has clicked on something for the first time
            else {
                // the raycast hit something
                if (this.unit_intersection.length > 0) {
                    // set the active object to the unit clicked on, select all tiles in pattern
                    this.active = this.unit_intersection[0].object.parent
                    for(let elem of [{arr: this.active.attack_pattern, type: "attack", color: 0xff0000}, {arr: this.active.movement_pattern, type: "movement", color: 0x00ff00}]) {
                        for(let i = 0; i < elem.arr.length; i++) {
                            if(elem.arr[i].x + this.active.position.x >= 0 && elem.arr[i].z + this.active.position.z  >= 0) {
                                try {
                                    let index = this.map.position_to_index(
                                        elem.arr[i].x + (this.active.position.x / 2),
                                        elem.arr[i].z + (this.active.position.z / 2)
                                    )
                                    if(this.map.tiles[index].userData.outline) {
                                        this.unhighlight_tile(index)
                                        this.highlight_tile(index, 0xffff00)
                                    }
                                    else {
                                        this.highlight_tile(index, elem.color)
                                    }
                                }
                                catch(err) {
                                    console.log(err)
                                }
                            }
                        }
                    }
                }
            }
        }

        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointerdown', onPointerDown);
        // window.addEventListener('pointermove', onPointerMove);
    }

    // TODO: Move highlighting into map class

    highlight_tile(index, color) {
        // console.log(this.map.tiles[index])
        this.map.tiles[index].userData.outline = new THREE.LineSegments(new THREE.EdgesGeometry(this.map.tiles[index].geometry),
                                                                        new THREE.LineBasicMaterial({color: color}))
        this.map.tiles[index].userData.outline.position.set(this.map.tiles[index].position.x,
                                                            this.map.tiles[index].position.y,
                                                            this.map.tiles[index].position.z)
        this.scene.add(this.map.tiles[index].userData.outline)
    }
    unhighlight_tile(index) {
        // console.log(this.map.tiles[index].userData.outline)
        this.scene.remove(this.map.tiles[index].userData.outline)
        delete this.map.tiles[index].userData.outline
    }

    playerTurn() {
        
    }

}