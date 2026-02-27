import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Can {

    constructor(sceneRef) {
        this.scene = sceneRef
        this.path = './assets/aluminium_can-_500ml/scene.gltf'
        this.canMesh = null
        this.labelMesh = null
        this.firstCanLabel = null
        this.loadModel()
    }

    loadModel(path) {
        if (path) this.path = path

        const loader = new GLTFLoader()
        loader.load(this.path, (gltf) => {
            this.model = gltf.scene
            this.model.scale.set(0.5, 0.5, 0.5)
            this.scene.add(this.model)

            // Led efter meshes vi kan sætte labels på
            this.model.traverse((child) => {
                if (child.isMesh) {
                    // console.log("Mesh fundet:", child.name, child.material)
                    
                    if (child.name.toLowerCase().includes('can')) {
                        console.log("Materiale med 'can' fundet i:", child.name, child.material)
                        this.canMesh = child
                    } 
                }
            })

            // Sæt første label når modellen er loaded og materiale er fundet
            if (this.canMesh && this.firstCanLabel) {
                this.setLabel(this.firstCanLabel.path)
                this.setBaseColor(this.firstCanLabel.baseColor)
                this.setLabelScale(this.firstCanLabel.scale)
                this.setLabelPosition(this.firstCanLabel.position)
            }
        })
    }

    setLabel(path) {
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load(path)

        // Vend tekstur og sæt farverum
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace

        // canMesh er den del af modellen der skal have sat label på
        if (this.canMesh) {

            // Fjern den gamle label, hvis den allerede er sat
            if (this.labelMesh) {
                this.canMesh.remove(this.labelMesh)
            }

            // Opret kopi af geometrien
            const labelGeometry = this.canMesh.geometry.clone()

            // Opret nyt materiale til labelen
            const labelMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                roughness: 0.4,
                metalness: 0.1 // Labels er sjældent metal
            })

            this.labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)

            // Skaler den en lille smule op for at undgå z-fighting
            this.labelMesh.scale.set(1.001, 1.001, 1.001)

            this.canMesh.add(this.labelMesh)

            this.currentLabelTexture = texture // Gem denne så vi kan opdatere den senere

        } else {
            console.warn("Can mesh ikke fundet, kunne ikke sætte label")
        }
    }

    setBaseColor(color) {
        if (this.canMesh) {
            this.canMesh.material.color.set(color)
            this.canMesh.material.roughness = 0.4
            this.canMesh.material.metalness = 0.8
            this.canMesh.material.needsUpdate = true
        }
    }

    setLabelScale({x, y}) {
        if (this.currentLabelTexture) {
            // ClampToEdgeWrapping strækker med den yderste pixel i stedet for at gantage
            this.currentLabelTexture.wrapS = THREE.ClampToEdgeWrapping
            this.currentLabelTexture.wrapT = THREE.ClampToEdgeWrapping

            // repeat(2,2) gør billedet halvt så stort i stedet for dobbelt så stort
            // Brug 1/x for at vende logikken om
            this.currentLabelTexture.repeat.set(1/x, 1/y)

        }

    }
    setLabelPosition({x, y}) {
        if (this.currentLabelTexture) {
            this.currentLabelTexture.offset.set(x, y)
        }
    }
}
