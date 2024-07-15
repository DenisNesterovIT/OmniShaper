const response =  fetch("http://62.68.147.69:8000/request/2D/Bunny")
.then(() => {
console.log(response);
})
let scene, camera, renderer, model;

        function init() {
            // Scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xaaaaaa);

            // Camera
            camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
            camera.position.z = 5;

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            const container = document.getElementById('scene');
            renderer.setSize(400, 300);
            renderer.set
            container.appendChild(renderer.domElement);

            // Lights
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            // Load Model
            const mtlLoader = new THREE.MTLLoader();
            mtlLoader.load('/Models/material0.mtl', function(materials) {
                materials.preload();

                const objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('/Models/mushroom.obj', function(object) {
                    model = object;
                    scene.add(model);
                    animate();
                });
            });

            window.addEventListener('resize', onWindowResize, false);
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

            if (model) {
                model.rotation.y += 0.01;
            }

            renderer.render(scene, camera);
        }

        init();