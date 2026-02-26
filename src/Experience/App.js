import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { Can } from './components/Can'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Thumbnails } from './components/Thumbails'

export class App {

    constructor(c) {
        this.canvas = c

        // størrelser defineret
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // scene, kamera, renderer
        this.renderer = this.createRenderer()
        this.camera = this.createCamera(40)
        this.scene = this.createScene()

        this.timer = new THREE.Timer()
        this.constrols = new OrbitControls(this.camera, this.renderer.domElement)

        this.renderer.setAnimationLoop(() => this.render())

        this.canData = null
        this.can = null
        this.fetchCanData()


        // Lyt efter resize
        window.addEventListener('resize', () => this.onResize())
    }
    fetchCanData() {
        fetch('./data/cans.json')
            .then(response => response.json())
            .then(data => {
                this.canData = data.cans
                // console.log("Data om dåser er hentet:", this.canData)

                // Opret en verden (pt kun en dåse)
                this.createWorld()

                this.can.firstCanLabel = this.canData[0] // Gem den første label i can-objektet, så vi kan sætte den når modellen er loaded

                // Opret thumbnails
                const thumbnailContainer = document.getElementById('thumbnails')
                this.thumbnails = new Thumbnails(this.canData, thumbnailContainer)

                this.thumbnails.onThumbnailClick = (can) => {
                    // Opdater 3D-modellen baseret på det valgte can
                    console.log("Thumbnail klikket i App:", can)
                    if (this.can) {
                        this.updateCanLabel(can) // Opdater label, skala og position baseret på can-data
                    }
                }

            })
            .catch(error => console.error("Kunne ikke hente data om dåser:", error))


    }

    updateCanLabel(can) {
        this.can.setLabel(can.path) // Antag at can.path indeholder stien til label-teksturen
        this.can.setLabelScale(can.scale) // Juster skalaen efter behov
        this.can.setLabelPosition(can.position) // Juster positionen efter behov
        this.can.setBaseColor(can.baseColor || 0x999999) // Hvis can-data indeholder en baseColor, brug den, ellers brug hvid
    }

    createScene() {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x222222)
        const hdrLoader = new HDRLoader()
        hdrLoader.load('./assets/hdr/pav_studio_03_1k.hdr', (environmentMap) => {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping
            scene.environment = environmentMap
        })

        return scene;
    }

    createCamera(fov = 75) {
        const camera = new THREE.PerspectiveCamera(fov, this.sizes.width / this.sizes.height, 0.1, 1000)
        camera.position.z = 4;
        return camera
    }

    createRenderer() {
        const renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        renderer.setSize(this.sizes.width, this.sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        return renderer
    }

    render() {
        this.timer.update()
        const delta = this.timer.getDelta()

        this.renderer.render(this.scene, this.camera)
    }

    createWorld() {
        this.can = new Can(this.scene)

    }

    onResize() {
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight

        // Opdater kamera
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        // Opdater renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

}