document.addEventListener('DOMContentLoaded', () => {
    const productListElement = document.getElementById('product-list');
    const cartCountElement = document.getElementById('cart-count');
    const contactForm = document.getElementById('contact-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-btn');
    const clearCartButton = document.getElementById('clear-cart-btn');

    const products = [
        { id: 1, name: 'Café LeBlanc Original', price: 2500, description: 'El blend especial de la casa, preparado con granos de café de tueste medio.', image: 'imagenes/imagen1.png' },
        { id: 2, name: 'Curry LeBlanc Original', price: 6000, description: 'El famoso curry casero con la receta secreta, servido con arroz japonés.', image: 'imagenes/imagen2.jpg' },
        { id: 3, name: 'Cheesecake Persona', price: 4500, description: 'Cheesecake de estilo japonés con base de galleta y topping de frutos rojos.', image: 'imagenes/imagen3.jpg' },
        { id: 4, name: 'Katsu Sando', price: 5000, description: 'Sándwich japonés con chuleta de cerdo empanizada, col rallada y salsa tonkatsu.', image: 'imagenes/imagen4.jpg' },
        { id: 5, name: 'Desayuno Japonés', price: 4000, description: 'Set de desayuno tradicional con arroz, huevo, nori y sopa miso.', image: 'imagenes/imagen5.png' },
        { id: 6, name: '"Joker\'s Wild" Cocktail', price: 3500, description: 'Cóctel sin alcohol con jugo de granada, ginger ale y un toque de lima.', image: 'imagenes/imagen6.png' }
    ];

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    function renderProducts() {
        if (productListElement) {
            productListElement.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="price">$${product.price}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Añadir al Carrito</button>
                </div>
            `).join('');
        }
    }

    function addToCart(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productToAdd = products.find(p => p.id === productId);

        if (productToAdd) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...productToAdd, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${productToAdd.name} ha sido añadido al carrito.`);
        }
    }

    function renderCart() {
        if (cartItemsContainer) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            let total = 0;
            cartItemsContainer.innerHTML = ''; 

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
            } else {
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    cartItemElement.innerHTML = `
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Cantidad: ${item.quantity}</p>
                            <p class="item-price">Precio: $${itemTotal.toLocaleString()}</p>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">Quitar</button>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                });
            }
            
            cartTotalPriceElement.textContent = total.toLocaleString();
        }
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
    
    // Event Listeners para la página principal
    if (productListElement) {
        productListElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(event.target.dataset.id);
                addToCart(productId);
            }
        });
    }

    // Event listeners para la página del carrito
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-btn')) {
                const productId = parseInt(event.target.dataset.id);
                removeFromCart(productId);
            }
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('¡Compra realizada con éxito! ¡Gracias por tu pedido!');
            localStorage.removeItem('cart');
            updateCartCount();
            if (cartItemsContainer) {
                renderCart();
            }
        });
    }
    
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            const confirmation = confirm("¿Estás seguro de que quieres vaciar el carrito?");
            if (confirmation) {
                localStorage.removeItem('cart');
                updateCartCount();
                renderCart();
                alert("El carrito ha sido vaciado.");
            }
        });
    }

    // Funciones de validación
    function setOk(el) {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
        const fb = el.parentElement.querySelector('.invalid-feedback');
        if (fb) fb.textContent = '';
    }

    function setError(el, msg) {
        el.classList.remove('is-valid');
        el.classList.add('is-invalid');
        const fb = el.parentElement.querySelector('.invalid-feedback');
        if (fb && msg) fb.textContent = msg;
    }
    
    // Validaciones del formulario de contacto
    if (contactForm) {
        const contactName = document.getElementById('contact-name');
        const contactEmail = document.getElementById('contact-email');
        const contactMessage = document.getElementById('contact-message');

        function validarContactName() {
            const v = contactName.value.trim();
            if (v.length > 100 || v.length === 0) {
                setError(contactName, 'El nombre es requerido y no puede exceder los 100 caracteres.');
                return false;
            }
            setOk(contactName);
            return true;
        }

        function validarContactEmail() {
            const v = contactEmail.value.trim();
            const rx = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
            if (!v || !rx.test(v)) {
                setError(contactEmail, 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                return false;
            }
            setOk(contactEmail);
            return true;
        }

        function validarContactMessage() {
            const v = contactMessage.value.trim();
            if (v.length > 500 || v.length === 0) {
                setError(contactMessage, 'El comentario es requerido y no puede exceder los 500 caracteres.');
                return false;
            }
            setOk(contactMessage);
            return true;
        }

        contactName.addEventListener('input', validarContactName);
        contactEmail.addEventListener('input', validarContactEmail);
        contactMessage.addEventListener('input', validarContactMessage);

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const ok = validarContactName() & validarContactEmail() & validarContactMessage();

            if (ok) {
                alert('Mensaje enviado con éxito.');
                contactForm.reset();
            } else {
                alert('Error, revisa los campos marcados en rojo.');
            }
        });
    }

    // Validaciones del formulario de registro
    if (registerForm) {
        const registerRun = document.getElementById('register-run');
        const registerName = document.getElementById('register-name');
        const registerApellidos = document.getElementById('register-apellidos');
        const registerEmail = document.getElementById('register-email');
        const registerRegion = document.getElementById('register-region');
        const registerComuna = document.getElementById('register-comuna');
        const registerDireccion = document.getElementById('register-direccion');
        const registerPassword = document.getElementById('register-password');
        const registerConfirmPassword = document.getElementById('register-confirm-password');

        const regionesData = [
            { nombre: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
            { nombre: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"] },
            { nombre: "Antofagasta", comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"] },
            { nombre: "Atacama", comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"] },
            { nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"] },
            { nombre: "Valparaíso", comunas: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Limache", "Olmué", "Quilpué", "Villa Alemana"] },
            { nombre: "Metropolitana de Santiago", comunas: ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"] },
            { nombre: "O’Higgins", comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"] },
            { nombre: "Maule", comunas: ["Talca", "Curepto", "Constitución", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén"] },
            { nombre: "Ñuble", comunas: ["Chillán", "Bulnes", "Chillán Viejo", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"] },
            { nombre: "Biobío", comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"] },
            { nombre: "Araucanía", comunas: ["Temuco", "Carahue", "Cholchol", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"] },
            { nombre: "Los Ríos", comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Panguipulli", "Paillaco", "Futrono", "La Unión", "Lago Ranco", "Río Bueno"] },
            { nombre: "Los Lagos", comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Ancud", "Castro", "Chaitén", "Chonchi", "Dalcahue", "Futaleufú", "Hualaihué", "Palena", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao"] },
            { nombre: "Aysén del General Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"] },
            { nombre: "Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"] }
        ];

        function populateRegiones() {
            regionesData.forEach(region => {
                const option = document.createElement('option');
                option.value = region.nombre;
                option.textContent = region.nombre;
                registerRegion.appendChild(option);
            });
        }

        function populateComunas(regionNombre) {
            registerComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
            registerComuna.disabled = true;

            const region = regionesData.find(r => r.nombre === regionNombre);
            if (region) {
                region.comunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    registerComuna.appendChild(option);
                });
                registerComuna.disabled = false;
            }
        }
        
        registerRegion.addEventListener('change', (event) => {
            const selectedRegion = event.target.value;
            populateComunas(selectedRegion);
            validarRegisterRegion();
            validarRegisterComuna();
        });
        
        // Funciones de validación de campos del registro
        function validarRun() {
            let run = registerRun.value.trim().replace(/\./g, "").replace(/-/g, "").toUpperCase();
            if (run.length < 7 || run.length > 9) {
                setError(registerRun, 'El RUN debe tener entre 7 y 9 caracteres (sin puntos ni guion).');
                return false;
            }
            if (!/^[0-9]+[0-9K]$/.test(run)) {
                setError(registerRun, 'El formato del RUN no es válido.');
                return false;
            }
            
            let cuerpo = run.slice(0, -1);
            let dv = run.slice(-1);
            let suma = 0;
            let multiplo = 2;
            
            for (let i = cuerpo.length - 1; i >= 0; i--) {
                suma += parseInt(cuerpo[i]) * multiplo;
                multiplo = multiplo === 7 ? 2 : multiplo + 1;
            }
            
            let dvEsperado = 11 - (suma % 11);
            if (dvEsperado === 11) dvEsperado = '0';
            else if (dvEsperado === 10) dvEsperado = 'K';
            
            if (dv !== dvEsperado.toString()) {
                setError(registerRun, 'El RUN no es válido (dígito verificador incorrecto).');
                return false;
            }
            
            setOk(registerRun);
            return true;
        }

        function validarRegisterName() {
            const v = registerName.value.trim();
            if (v.length < 3 || v.length > 50) {
                setError(registerName, 'El nombre debe tener entre 3 y 50 caracteres.');
                return false;
            }
            setOk(registerName);
            return true;
        }

        function validarRegisterApellidos() {
            const v = registerApellidos.value.trim();
            if (v.length < 3 || v.length > 100) {
                setError(registerApellidos, 'Los apellidos deben tener entre 3 y 100 caracteres.');
                return false;
            }
            setOk(registerApellidos);
            return true;
        }

        function validarRegisterEmail() {
            const v = registerEmail.value.trim();
            const rx = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
            if (v.length > 100 || !rx.test(v)) {
                setError(registerEmail, 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                return false;
            }
            setOk(registerEmail);
            return true;
        }

        function validarRegisterRegion() {
            const v = registerRegion.value;
            if (!v) {
                setError(registerRegion, 'Debe seleccionar una región.');
                return false;
            }
            setOk(registerRegion);
            return true;
        }

        function validarRegisterComuna() {
            const v = registerComuna.value;
            if (!v) {
                setError(registerComuna, 'Debe seleccionar una comuna.');
                return false;
            }
            setOk(registerComuna);
            return true;
        }

        function validarRegisterDireccion() {
            const v = registerDireccion.value.trim();
            if (v.length > 300 || v.length === 0) {
                setError(registerDireccion, 'La dirección es requerida y no debe exceder los 300 caracteres.');
                return false;
            }
            setOk(registerDireccion);
            return true;
        }

        function validarRegisterPassword() {
            const v = registerPassword.value.trim();
            if (v.length < 4 || v.length > 10) {
                setError(registerPassword, 'La contraseña debe tener entre 4 y 10 caracteres.');
                return false;
            }
            setOk(registerPassword);
            return true;
        }

        function validarRegisterConfirmPassword() {
            const v = registerConfirmPassword.value.trim();
            if (v.length < 4 || v.length > 10 || v !== registerPassword.value.trim()) {
                setError(registerConfirmPassword, 'Las contraseñas no coinciden.');
                return false;
            }
            setOk(registerConfirmPassword);
            return true;
        }

        registerRun.addEventListener('input', validarRun);
        registerName.addEventListener('input', validarRegisterName);
        registerApellidos.addEventListener('input', validarRegisterApellidos);
        registerEmail.addEventListener('input', validarRegisterEmail);
        registerDireccion.addEventListener('input', validarRegisterDireccion);
        registerPassword.addEventListener('input', validarRegisterPassword);
        registerConfirmPassword.addEventListener('input', validarRegisterConfirmPassword);
        registerRegion.addEventListener('change', validarRegisterRegion);
        registerComuna.addEventListener('change', validarRegisterComuna);
        
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const ok =
                validarRun() &
                validarRegisterName() &
                validarRegisterApellidos() &
                validarRegisterEmail() &
                validarRegisterRegion() &
                validarRegisterComuna() &
                validarRegisterDireccion() &
                validarRegisterPassword() &
                validarRegisterConfirmPassword();

            if (ok) {
                alert('Registro exitoso.');
                registerForm.reset();
                populateComunas('');
            } else {
                alert('Error, revisa los campos marcados en rojo.');
                const firstInvalid = registerForm.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
            }
        });
        
        populateRegiones();
    }

    // Inicializar la página
    renderProducts();
    updateCartCount();
    if (document.body.id === 'cart-page') {
        renderCart();
    }
});