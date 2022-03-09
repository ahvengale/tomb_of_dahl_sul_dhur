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

    playerTurn() {
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
            console.log(this.floor_intersection)
        }

        let onPointerUp = () => {
            // player has already clicked on something to move
            if (this.active) {
                // track indicies
                let indicies = []
                // move the unit and reset to not active state
                for(let i = 0; i < this.active.pattern.length; i++) {
                    if(this.active.pattern[i].x + this.active.position.x >= 0 && this.active.pattern[i].z + this.active.position.z  >= 0) {
                        try {
                            let index = this.map.position_to_index(
                                this.active.pattern[i].x + (this.active.position.x / 2),
                                this.active.pattern[i].z  + (this.active.position.z / 2)
                            )
                            indicies.push(index)
                            this.unhighlight_tile(index)
                        }
                        catch(err) {

                        }
                    }
                }
                console.log(indicies)
                console.log(this.map.position_to_index(this.floor_intersection.x, this.floor_intersection.z))
                if(indicies.includes(this.map.position_to_index(this.floor_intersection.x / 2, this.floor_intersection.z / 2))) {
                    this.active.position.x = (this.floor_intersection.x)
                    this.active.position.y = (this.floor_intersection.y)
                    this.active.position.z = (this.floor_intersection.z)
                }
                this.active = false
            }
            // player has clicked on something for the first time
            else {
                // the raycast hit something
                if (this.unit_intersection.length > 0) {
                    // set the active object to the unit clicked on, select all tiles in pattern
                    this.active = this.unit_intersection[0].object.parent
                    for(let i = 0; i < this.active.pattern.length; i++) {
                        if(this.active.pattern[i].x + this.active.position.x >= 0 && this.active.pattern[i].z + this.active.position.z  >= 0) {
                            try {
                                let index = this.map.position_to_index(
                                    this.active.pattern[i].x + (this.active.position.x / 2),
                                    this.active.pattern[i].z  + (this.active.position.z / 2)
                                )
                                this.highlight_tile(index)
                            }
                            catch(err) {

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

    highlight_tile(index) {
        console.log(this.map.tiles[index])
        this.map.tiles[index].userData.outline = new THREE.LineSegments(new THREE.EdgesGeometry(this.map.tiles[index].geometry), new THREE.MeshBasicMaterial())
        this.map.tiles[index].userData.outline.position.set(this.map.tiles[index].position.x, this.map.tiles[index].position.y, this.map.tiles[index].position.z)
        this.scene.add(this.map.tiles[index].userData.outline)
    }
    unhighlight_tile(index) {
        console.log(this.map.tiles[index].userData.outline)
        this.scene.remove(this.map.tiles[index].userData.outline)
        delete this.map.tiles[index].userData.outline
    }

}