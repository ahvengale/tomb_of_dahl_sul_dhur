import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Unit from "./Unit";

export default class Player {

    constructor(renderer, scene, cam, player_id, color, x, z) {
        this.renderer = renderer
        this.scene = scene
        this.camera = cam
        this.player_id = player_id;
        this.color = color;
        this.x = x;
        this.z = z;
        this.player_units = []
        this.controls = new OrbitControls(this.camera, renderer.domElement)
        this.intersection
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
        let onPointerDown = () => {
            if (this.intersection.length > 0) {

                let currentObject = this.intersection[0].object.parent
                console.log(currentObject)
                currentObject.capturePattern()

                //let original_location = currentObject.position.clone()
                this.controls.enableRotate = false

                // for (var i = 0; i < movableTile.length; i++) {
                //     let edgesMesh = new THREE.BoxHelper(movableTile[i]);
                //     edgesMesh.material.color.set(0x00ff00)
                //     this.scene.add(edgesMesh)
                //     movableTile[i].userData.temp_mesh = edgesMesh
                //     // movableTile[i].userData.original_color = movableTile[i].material[0].color.getHex()
                //     // movableTile[i].material[0].color.set(0x002200)
                // }
            }
        }
        // mouse defined for mousemove event
        const mouse = new THREE.Vector2(-1, -1)
        // variables for raycasting and drag positions
        const raycast = new THREE.Raycaster()
        const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        let onPointerMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
            raycast.setFromCamera(mouse, this.camera);
            this.intersection = raycast.intersectObjects(this.player_units)
            // if (this.intersection.length > 0) {
            //     console.log(this.intersection)
            //     let point = new THREE.Vector3()
            //     point = raycast.ray.intersectPlane(floor, point)
            //     this.intersection[0].object.parent.position.x = point.x
            //     this.intersection[0].object.parent.position.z = point.z
            //     this.intersection[0].object.parent.position.y = 0.3

            // }
        }

        let onPointerUp = (target) => {
            let occupied = false
            this.controls.enableRotate = true
            if (this.intersection > 0) {

                console.log(target)
                // new_position.set(Math.round(draggable.position.x / 2) * 2, 0.0, Math.round(draggable.position.z / 2) * 2)
                // if (original_location.distanceTo(new_position) <= draggable.userData.movement * 2 && original_location.distanceTo(new_position) > 1.0) {
                //     for (let i = 0; i < scene.children.length; i++) {
                //         if (scene.children[i].position.distanceTo(new_position) <= 0.1 && !scene.children[i].userData.tile) {
                //             occupied = true
                //             console.log(occupied)
                //         }
                //     }
                //     if (!occupied) {
                //         draggable.position.set(new_position.x, new_position.y, new_position.z)
                //         moves -= 1
                //         draggable.userData.movable = false
                //         if (moves == 0) {
                //             take_turn()
                //         }
                //     }
                //     else {
                //         draggable.position.set(original_location.x, original_location.y, original_location.z)
                //     }
                // }
                // else {
                //     draggable.position.set(original_location.x, original_location.y, original_location.z)
                // }
                // draggable = false
                // this.controls.enableRotate = true
                // for (var i = 0; i < movableTile.length; i++) {
                //     // movableTile[i].material[0].color.set(movableTile[i].userData.original_color)
                //     scene.remove(movableTile[i].userData.temp_mesh)
                // }
                // console.log(moves)
                // movableTile = []
            }
        }

        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
    }

}