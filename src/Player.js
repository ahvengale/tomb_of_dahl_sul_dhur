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
        this.unit_intersection
        this.active
        this.floor_intersection
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
            if (this.active) {
                this.active.position.x = (this.floor_intersection.x)
                this.active.position.y = (this.floor_intersection.y)
                this.active.position.z = (this.floor_intersection.z)
                this.active = false
            }
            else {
                if (this.unit_intersection.length > 0) {
                    this.active = this.unit_intersection[0].object.parent
                }
            }
        }

        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointerdown', onPointerDown);
        // window.addEventListener('pointermove', onPointerMove);
    }

}