import * as THREE from 'three'

export class SimpleCylinder {
    constructor(scene) {
        this.scene = scene
        this.createCylinder()
    }

    createCylinder() {
        const geometry = new THREE.CylinderGeometry(1, 1, 3, 32)
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.4
        })

        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load('/assets/tuborg.png')
        texture.colorSpace = THREE.SRGBColorSpace

        // Texture settings
        texture.flipY = true // Usually needs to be true for basic geometries, false for GLTF often

        material.map = texture
        material.needsUpdate = true

        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)
    }
}
