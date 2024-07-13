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

        const fadeIn = (el, timeout, display) =>{
    el.style.opacity = 0;
    el.style.display = display || 'flex';
    el.style.transition = `opacity ${timeout}ms`
    setTimeout(() => {
        el.style.opacity = 1;
    }, 10);
};

const fadeOut = (el, timeout, modalForm) =>{
    el.style.opacity = 1;
    el.style.transition = `opacity ${timeout}ms`
    el.style.opacity = 0;
    setTimeout(() => {
        el.style.display = 'none';
        modalForm.innerHTML = ``;
    },timeout);
};
let action;

const modalSub = `
<label for="name">
                <span>Ваше имя</span>
                <input type="text" id="name" placeholder="<Name prompt>" required>
            </label>
            <label  for="email">
                <span style="margin-top: 50px;">Ваш Email</span>
                <input type="text" id="email" placeholder="<Email prompt>" required>
            </label>
            <button type="submit" id="submit" class="subscription__btn">Отправить</button>
`;


const modalLogin = 
`
            <h3>Вход в аккаунт</h3>
            <label for="email">
                <span>Ваше email</span>
                <input type="text" id="email" placeholder="Email" required>
            </label>
            <label  for="password">
                <span style="margin-top: 50px;">Ваш пароль</span>
                <input type="text" id="password" placeholder="Пароль" required>
            </label>
            <button type="submit" id="submit" class="subscription__btn">Войти</button>
            <span class="modal__form__no">нет аккаунта?</span>
            <button type="button" id="register" class="subscription__btn">Зарегистрироваться</button>`;
const modalLogup = `
<h3>Регистрация</h3>
            <label for="name">
                <span>Ваше имя</span>
                <input type="text" id="name" placeholder="Имя" required>
            </label>
            <label for="email">
                <span style="margin-top: 50px;">Ваше Email</span>
                <input type="text" id="email" placeholder="Email" required>
            </label>
            <label  for="password">
                <span style="margin-top: 50px;">Ваш пароль</span>
                <input type="text" id="password" placeholder="Пароль" required>
            </label>
            <button type="submit" id="submit" class="subscription__btn">Зарегистрироваться</button>`;
const modalForm = document.querySelector(".modal__form__container");
const closeBtn = document.querySelector(".modal__form__close");
const modal = document.querySelector(".modal");

closeBtn.addEventListener("click", function(){
    fadeOut(modal, 500, modalForm);
});

document.querySelectorAll(".login").forEach(el => {
    el.addEventListener("click", function(){
        action = "login";
        modalForm.insertAdjacentHTML("afterbegin", modalLogin);
        fadeIn(modal, 500);
        document.getElementById("register").addEventListener("click", function(){
            action = "register";
            setTimeout(() => {
                modalForm.innerHTML = ``;
            },250);
            setTimeout(() => {
                modalForm.insertAdjacentHTML("afterbegin", modalLogup);
            },250);
        });
    });
    
});

        document.querySelectorAll(".open").forEach(el => {
            el.addEventListener("click", function(){
                action = "sub";
                modalForm.insertAdjacentHTML("afterbegin", modalSub);
                fadeIn(modal, 500);
            })
        });
        const token = "7463729868:AAFbaZhiEezzloI2c4T-CgXosOpY7pD9yKU";
        const chat_id = "-4207837555";
        document.getElementById("form").addEventListener("submit", function(e){
            e.preventDefault();
            if(action === "sub"){
                let message = `Заявка с сайта\n`;
            message += `Имя: ${document.getElementById("name").value}\n`;
            message += `Email: ${document.getElementById("email").value}\n`;
            const URIAPI = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(message)}`;
            fetch(URIAPI, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(() => {
                document.getElementById("email").value = "";
                document.getElementById("name").value = "";
                fadeOut(document.querySelector(".modal"), 1000);
            })
            .catch(error => {
                alert('Error: ' + error);
            });
            } else if(action === "login"){
                console.log("Login");
                //For login
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
            }else if (action === "register"){
                console.log("Register");
                //For register
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const name = document.getElementById("name").value;
            }else{
                alert("Ошибка");
            }
            
        });