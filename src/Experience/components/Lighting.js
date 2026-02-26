import * as THREE from 'three'

export class Lighting {

    constructor(sceneRef) {
        this.scene = sceneRef
        this.createLights()
    }
    // create 3 point light sources
    createLights() {
        // this.light1 = new THREE.PointLight(0xffffff, 1, 1000)
        this.light1 = new THREE.DirectionalLight(0xffffff, 0.2)
        this.light1.position.set(5, 0, 10)
        this.light1.castShadow = true
        this.light1.target.position.set(0, 0, 0)
        this.scene.add(this.light1)

        // this.light1Helper = new THREE.DirectionalLightHelper(this.light1, 0.5)
        // this.scene.add(this.light1Helper)

        this.light2 = new THREE.PointLight(0xffffff, 2)
        this.light2.position.set(-5, 0, 0.2)
        this.light2.castShadow = true
        this.scene.add(this.light2)

        // this.light2Helper = new THREE.PointLightHelper(this.light2, 0.5)
        // this.scene.add(this.light2Helper)

    }

}