import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

function load(filename, fn) {
    const mtlLoader = new MTLLoader()
    mtlLoader.setPath('../res/models/obj/')
    mtlLoader.load(filename + ".mtl", function (materials) {
        materials.preload()
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.setPath('../res/models/obj/')
        objLoader.load(filename + ".obj", function (object) {
            fn(object.children[0])
        });
    });
}

export default load