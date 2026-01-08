import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Variables globales
let scene, camera, renderer, controls, labelRenderer;

// Initialisation
function init() {
    const container = document.getElementById("container3D");
    if (!container) return;

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let hoveredObject = null;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(100, 200, 400);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Label Renderer
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2.2;

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        const tooltip = document.getElementById('hover-tooltip');

        if (intersects.length > 0) {
            const object = intersects[0].object;
            tooltip.textContent = object.name || "Objet non nommé";
            tooltip.style.display = 'block';
            tooltip.style.left = (event.clientX + 10) + 'px';
            tooltip.style.top = (event.clientY + 10) + 'px';
            hoveredObject = object;
        } else {
            tooltip.style.display = 'none';
            hoveredObject = null;
        }
    });

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0x404040));

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(1, 1, -1);
    scene.add(light2);
    scene.add(new THREE.AmbientLight(0x404040));

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // Ajouter des étiquettes aux axes
    const xLabel = createAxisLabel('X', new THREE.Vector3(100, 0, 0));
    const yLabel = createAxisLabel('Y', new THREE.Vector3(0, 100, 0));
    const zLabel = createAxisLabel('Z', new THREE.Vector3(0, 0, 100));
    scene.add(xLabel);
    scene.add(yLabel);
    scene.add(zLabel);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
        "./main/main.gltf",
        (gltf) => {
            const object = gltf.scene;
            const x = 7;
            object.scale.set(x, x, x);
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            object.position.set(100, 0, 0);
            object.rotation.x = -Math.PI / 2;
            object.rotation.z = -Math.PI / 2;
            scene.add(object);
        }
    );

    // Resize
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Créer une étiquette pour un axe
function createAxisLabel(text, position) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'axis-label';
    labelDiv.textContent = text;
    labelDiv.style.color = 'white';
    labelDiv.style.fontSize = '20px';
    labelDiv.style.fontFamily = 'Arial, sans-serif';
    labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    labelDiv.style.padding = '5px 10px';
    labelDiv.style.borderRadius = '5px';
    const label = new CSS2DObject(labelDiv);
    label.position.copy(position);
    return label;
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && camera && scene) renderer.render(scene, camera);
    if (labelRenderer && camera && scene) labelRenderer.render(scene, camera);
}

// Lancer l'application
init();
animate();
