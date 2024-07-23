
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
let scene, camera, renderer;
const handle = "http://81.94.156.31:8000";
let sprite;
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xC6D9E1);

    // Camera
    camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.z = 2;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    const container = document.getElementById('scene');
    renderer.setSize(600, 400);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Add 2D Image as Sprite
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/img/wait.png', function (texture) {
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(0, 0, 0); // Adjust the position as needed
        sprite.scale.set(1, 1, 1); // Adjust the scale as needed
        scene.add(sprite);
    });

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    const container = document.getElementById('scene');
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();


        

async function request2D(prompt){
    startLoading();
    const response = await fetch(`${handle}/request/2D/${prompt}`);
    const result = await response.json();
    stopLoading();
    return result;
}

async function request3D(id, num){
    startLoading();
    const response = await fetch(`${handle}/request/3D/${id}/${num}`);
    console.log(id + " " + num)
    const result = await response.json();
    stopLoading();
    return result;
}

const fadeIn = (el, timeout, display) =>{
    el.style.opacity = 0;
    el.style.display = display || 'block';
    el.style.transition = `opacity ${timeout}ms`;
    setTimeout(() =>{
        el.style.opacity = 1;
    }, 10);
};
const fadeOut = (el, timeout) =>{
    el.style.opacity = 1;
    el.style.transition = `opacity ${timeout}ms`;
    el.style.opacity = 0;
    setTimeout(() =>{
        el.style.display = 'none';
    }, timeout);
};



function decodeImage(image, index){
    try{
        const base64ImageData = image;
        
        // Decode the base64 image string
        const decodedImageData = atob(base64ImageData); 

        // Convert the decoded image data to a binary array
        const binaryImageData = new Uint8Array(decodedImageData.length);
        for (let i = 0; i < decodedImageData.length; i++) {
            binaryImageData[i] = decodedImageData.charCodeAt(i);
        }
        
        // Create a blob object from the binary image data
        const blob = new Blob([binaryImageData], { type: 'image/png' });

        // Create an image URL from the blob
        const imageUrl = URL.createObjectURL(blob);

        // Create an image element in the DOM and set its src attribute
        const imgElement = document.getElementById(`img_${index}`);
        imgElement.src = imageUrl;
        // Append the image element to the body or any other container in the DOM
    }
    catch(error){
        console.log(error);
    };
}

const promptInput = document.getElementById("prompt");
const generateButtton = document.getElementById("generate");
const generateForm = document.getElementById("generateForm");
const imageContainer = document.querySelector(".images__imageContainer");
const images = document.querySelector(".images");
const images2D = document.querySelectorAll(".image2D");
let requestId;

generateButtton.addEventListener("click", async function(e) {
    e.preventDefault();
    console.log("Submit...");
    const result = await request2D(promptInput.value);
    console.log(result);
    result.images.forEach((image, index) => {
        decodeImage(image, index);
    });
    requestId = result.request_id;
    fadeIn(images, 500, "flex");
});

function startLoading(){
    document.querySelector(".loading").style.display = "flex";
}
function stopLoading(){
    document.querySelector(".loading").style.display = "none";
}

images2D.forEach((image, index) => {
    image.addEventListener("click", async function(){
        fadeOut(images, 500);
        const result = await request3D(requestId, index);
        // const uint8Array = base64ToUint8Array(result.obj_mtl_png[0]);
        // const objFileContent = uint8ArrayToString(uint8Array);
        // console.log(objFileContent)

        const objData = result.obj_mtl_png[0];
        const mtlData = result.obj_mtl_png[1];
        const pngData = result.obj_mtl_png[2];

        function base64ToBlob(base64, mime) {
            const binary = atob(base64);
            const array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: mime });
        }
        
        const objBlobUrl = URL.createObjectURL(base64ToBlob(objData, 'text/plain'));
        const mtlBlobUrl = URL.createObjectURL(base64ToBlob(mtlData, 'text/plain'));
        const pngBlobUrl = URL.createObjectURL(base64ToBlob(pngData, 'image/png'));

        // Three.js setup
        scene.remove(sprite);
        camera.updateProjectionMatrix();
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.enableZoom = false

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(pngBlobUrl, function (texture) {
            const mtlLoader = new THREE.MTLLoader();
            mtlLoader.setMaterialOptions({ side: THREE.DoubleSide });
            mtlLoader.load(mtlBlobUrl, function (materials) {
                materials.preload();
                // Override material map with the loaded texture
                for (const material of Object.values(materials.materials)) {
                    material.map = texture;
                    material.needsUpdate = true;
                }

                const objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(objBlobUrl, function (object) {
                    scene.add(object);
                    object.position.y = 0; 
                    // Add rotation to the object
                    const animate = function () {
                        requestAnimationFrame(animate);
                        object.rotation.y += 0.01; // Rotation animation
                        controls.update(); // Update controls
                        renderer.render(scene, camera);
                    };

                    animate();// Adjust based on your model
                });
            });
        });

        camera.position.z = 1.5;

        window.addEventListener('resize', onWindowResize, false);
        // Handle window resize
        function onWindowResize() {
            const container = document.getElementById('scene');
            const width = container.clientWidth;
            const height = container.clientHeight;
        
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });
});


    

    // Convert Base64 to text or binary data
    
    // Set up Three.js scene
    