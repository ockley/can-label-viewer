// https://sketchfab.com/3d-models/aluminium-can-500ml-f6b1379c3b7f476aaec344b4113c9d5a

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Can {

    constructor(sceneRef) {
        this.scene = sceneRef
        this.path = '/assets/aluminium_can-_500ml/scene.gltf'
        this.loadModel()
    }

    loadModel() {
        const loader = new GLTFLoader()
        loader.load(this.path, (gltf) => {
            this.model = gltf.scene
            this.model.scale.set(0.5, 0.5, 0.5)
            this.scene.add(this.model)

            // Led efter meshes vi kan sætte labels på
            this.model.traverse((child) => {
                if (child.isMesh) {
                    console.log("Found mesh:", child.name, child.material)
                    // Sørg for at metalness og roughness er sat fornuftigt hvis de mangler
                    if (child.material.metalness === undefined) child.material.metalness = 0.8
                    child.material.metalness = 0.3
                    if (child.material.roughness === undefined) child.material.roughness = 0.3
                    child.material.roughness = 0.8
                    child.material.side = THREE.DoubleSide // Sørg for at vi kan se den fra alle vinkler
                    child.material.envMapIntensity = 0.1 // Sørg for at den reagerer på environment map
                }
                // Vi leder specifikt efter cylinder-kroppen. Ofte hedder den noget med "cylinder" eller er den største mesh.
                // Her gemmer vi referencer til dem, men prøver at finde den mest sandsynlige kandidat.
                // Hvis modellen kun har få meshes, prøver vi at ramme den rigtige ved navn eller størrelse.
                if (child.isMesh && child.material) {
                    // Hvis navnet indeholder 'can' eller 'cylinder' er det formentlig kroppen
                    if (child.name.toLowerCase().includes('can') || child.name.toLowerCase().includes('cylinder') || !this.canMesh) {
                        this.canMesh = child
                    }
                }
            })

            // Hvis der allerede er angivet en label, load den
            if (this.pendingLabelPath) {
                this.setLabel(this.pendingLabelPath)
            }
        })
    }

    setLabel(path) {
        if (!this.model) {
            this.pendingLabelPath = path
            return
        }

        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load(path)

        // Vigtigt: Texture indstillinger for korrekte farver og orientering
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace

        // Sæt evt. gemte transforms på texturen med det samme
        if (this.pendingLabelScale) texture.repeat.set(this.pendingLabelScale.x, this.pendingLabelScale.y)
        if (this.pendingLabelPosition) texture.offset.set(this.pendingLabelPosition.x, this.pendingLabelPosition.y)
        if (this.pendingLabelRotation) {
            texture.center.set(0.5, 0.5)
            texture.rotation = this.pendingLabelRotation
        }

        if (this.canMesh) {
            console.log('Applying label to:', this.canMesh.name)

            // Løsning: Vi laver en kopi (clone) af dåsen til selve labelen.
            // Den originale dåse forbliver metal (uden map).
            // Kopien bliver gennemsigtig og bærer labelen lidt udenpå den originale.

            // Hvis vi allerede har lavet en label-mesh før, fjerner vi den gamle først
            if (this.labelMesh) {
                this.canMesh.remove(this.labelMesh)
                this.labelMesh.geometry.dispose()
                this.labelMesh.material.dispose()
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

            // Skaler den en lille bitte smule op så den ligger udenpå metalskallen (for at undgå z-fighting)
            // Vi bruger en meget lille værdi, da en stor værdi vil se mærkelig ud ved kanterne
            const scaleFactor = 1.001
            this.labelMesh.scale.set(scaleFactor, scaleFactor, scaleFactor)

            // Tilføj label-meshen som et barn af den originale mesh, så den følger med når dåsen flyttes/roteres
            this.canMesh.add(this.labelMesh)

            // Sørg for at den originale dåse forbliver pæn metal
            this.canMesh.material.map = null // Fjern map fra metal-delen
            this.canMesh.material.transparent = false
            this.canMesh.material.color.set(0xffffff)
            this.canMesh.material.metalness = 0.8 // Fuld metal
            this.canMesh.material.roughness = 0.3
            this.canMesh.material.envMapIntensity = 0.2
            this.canMesh.material.needsUpdate = true

            this.currentLabelTexture = texture
        } else {
            console.warn('No mesh found to apply label to!')
        }
    }

    setLabelScale(x, y) {
        this.pendingLabelScale = { x, y }
        if (this.currentLabelTexture) {
            this.currentLabelTexture.repeat.set(x, y)
            console.log("Setting label scale:", x, y)
        }
    }

    setLabelPosition(x, y) {
        this.pendingLabelPosition = { x, y }
        if (this.currentLabelTexture) {
            this.currentLabelTexture.offset.set(x, y)
            console.log("Setting label position:", x, y)
        }
    }

    setLabelRotation(angle) {
        this.pendingLabelRotation = angle
        if (this.currentLabelTexture) {
            this.currentLabelTexture.center.set(0.5, 0.5)
            this.currentLabelTexture.rotation = angle
        }
    }
}
