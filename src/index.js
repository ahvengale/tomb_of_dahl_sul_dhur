import * as THREE from "three";

import { Vector3 } from "three";
import gui from "./Details.js"
import Player from "./Player.js";
import MapMaker from "./MapMaker.js";
import load from "./Loader"

let arr = [[]]

//create 3 required objects: scene, camera, and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#C'),
});

// create camera, set size, camera control
const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000)
camera.position.set(5, 10, 5)
renderer.setSize(w, h)


// enable shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// make light
const light = new THREE.AmbientLight(0xffffff, 1.0)

const d_light = new THREE.DirectionalLight(0xffffff, 5.0)
d_light.position.set(40, 50, 60)
d_light.castShadow = true
d_light.shadow.bias = -0.0025;
let side = 100;
d_light.shadow.camera.top = side;
d_light.shadow.camera.bottom = -side;
d_light.shadow.camera.left = side;
d_light.shadow.camera.right = -side;

const sun = new THREE.PointLight(0xffffff, 1, 50, 2);
sun.position.set(20, 10, 20);

gui.add(sun, 'intensity', 1, 10, .1)

// scene.add(gui);
scene.add(sun);
scene.add(light)
scene.add(d_light)

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(sun, sphereSize);
scene.add(pointLightHelper);



// variables for raycasting and drag positions

const floor = new THREE.Plane(new Vector3(0, 1, 0), 0)

let turn_number = 0

const MAP = new MapMaker();
(async () => {
    let tiles = await MAP.generate("map1")
    scene.add(tiles)
})();

let players = []
let moves

let p1 = new Player(renderer, scene, camera, 1, 0x00ff00, 12, 12, MAP);
let newUnit = p1.addUnit("standard")
scene.add(newUnit)

let p2 = new Player(renderer, scene, camera, 1, 0xff0000, 24, 24, MAP)
let _newUnit = p2.addUnit("standard")
scene.add(_newUnit)
// let p2 = new Player(2, 0xff0000, 0, 0)
// scene.add(p2.createPlayer())

players.push(p1, p2)
p1.init()

console.table(players)

animate();

take_turn()

load("test", (e) => {
    e.position.set(20, 12.1, 20)
    e.geometry.center()
    e.castShadow = true
    e.receiveShadow = true
    scene.add(e)
})

function take_turn() {
    turn_number++
    if (turn_number > players.length) {
        turn_number = 1
    }
    let currentPlayer = players[turn_number - 1]
    console.log(currentPlayer == players[0] ? "your Turn" : "AI")

    let units = currentPlayer.getPlayerUnits().length;

    //UI showing current player and number of units active
    document.getElementById("Player").innerText = turn_number
    document.getElementById("Units").innerText = units


    if (currentPlayer == players[1]) {
        // enemy  ai turn
        console.log("AI")
        setTimeout(() => { take_turn() }, 5000)
    }
    else {
        // player turn
        currentPlayer.playerTurn()
        console.log("Your Turn")
        moves = units

    }

}

const addBtn = document.getElementById("AddUnit")
addBtn.addEventListener("click", () => {
    scene.add(p1.addUnit("standard"))
    take_turn()
})

function animate() {
    requestAnimationFrame(animate)
    p1.getPlayerControls().update()

    scene.traverse(function (obj) {
        if (obj.userData.animated) {
            obj.rotation.x += 0.01
            obj.rotation.y += 0.01
            obj.rotation.z += 0.01
        }
    })

    renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

})