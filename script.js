const carrito = JSON.parse(localStorage.getItem('carro')) || [];
const itemsEnCarrito = document.getElementById('carrito-items');
const contenedorItems = document.getElementById('items');
const borrarBusqueda = document.getElementById('borrarBusqueda');
const min = document.getElementById('min');
const max = document.getElementById('max');
const contenedorBalance = document.getElementById('balance');
const travelCal = document.getElementById('travelCal');
const input = document.getElementById('text');
const btnFiltrar = document.getElementById('filtro');
const btnBorrar = document.getElementById('btnBorrar');
const alertElement = document.querySelector('.input');
const alertMensajeElement = document.getElementById('alertMensaje');
const formulario = document.getElementById('travelCalc');
const resultado = document.getElementById('resultado');
const calBudget = document.getElementById('calBudget');
const alertError = document.getElementById('alertError');
const calcularPresupuesto = document.getElementById('calcular');
const filtrarBusqueda = document.getElementById('filtrarBusqueda');
const btnComprar = document.getElementById('btnComprar');
const botones = document.getElementsByClassName('compra');

let paquetes;

fetch('paquetes.json')
  .then((response) => response.json())
  .then((data) => {
    paquetes = data;

    renderizarProductos(paquetes);
  })
  .catch((err) => console.error(err));

formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  const presupuesto = document.getElementById('viaje').value;
  const hospedaje = document.getElementById('hospedaje').value;
  const transporte = document.getElementById('transporte').value;
  const comida = document.getElementById('comida').value;

  if (
    presupuesto !== '' &&
    transporte !== '' &&
    comida !== '' &&
    hospedaje !== ''
  ) {
    const { presupuesto, hospedaje, transporte, comida } = getValues();
    const gastos =
      parseInt(hospedaje) + parseInt(transporte) + parseInt(comida);
    const balance = parseInt(presupuesto) - gastos;
    renderizarGastos(hospedaje, transporte, comida, presupuesto, balance);

    calcularPresupuesto.disabled = true;
    calcularPresupuesto.value = 'Presupuesto calculado';

    reset();
  } else {
    mostrarError('alertError', 'Todos los campos deben estar llenos.');
  }

   // Función Obtener valores del input

  function getValues() {
    const presupuesto = document.getElementById('viaje').value;
    const hospedaje = document.getElementById('hospedaje').value;
    const transporte = document.getElementById('transporte').value;
    const comida = document.getElementById('comida').value;
    // const presupuesto = parseFloat(
    //   Math.max(0, document.getElementById('viaje').value)
    // ).toLocaleString('es-CL');

    // const hospedaje = parseFloat(
    //   Math.max(0, document.getElementById('hospedaje').value)
    // ).toLocaleString('es-CL');

    // const transporte = parseFloat(
    //   Math.max(0, document.getElementById('transporte').value)
    // ).toLocaleString('es-CL');
    // const comida = parseFloat(
    //   Math.max(0, document.getElementById('comida').value)
    // ).toLocaleString('es-CL');

    return { presupuesto, hospedaje, transporte, comida };
  }

  // Función Renderizar gastos

  function renderizarGastos(
    hospedaje,
    transporte,
    comida,
    presupuesto,
    balance
  ) {

    const dataPrint = document.createElement('div');
    dataPrint.innerHTML = `
      <div class="card col-sm-3 p-2">
        <div class="card-body">
        <p class="card-text"> ${presupuesto}</p>
          <p class="card-text"> ${transporte}</p>
          <p class="card-text"> ${comida}</p>
          <p class="card-text"> ${hospedaje}</p>
          <p class="card-text"> ${balance}</p>
        </div>
      </div>
    `;

    calBudget.appendChild(dataPrint);

    reset();

    if (balance < 0) {
      const mensajePresupuesto = document.createElement('div');
      mensajePresupuesto.innerHTML = `
      <div role="alert" class="alert alert-danger">
         <p class="mb-0 h6" id="mensajePresupuestoErr">Presupuesto insuficiente. Revisa los montos.</p>
      </div>
      `;
      alertMensajeElement.appendChild(mensajePresupuesto);
    } else {
      const mensajePresupuesto = document.createElement('div');
      mensajePresupuesto.innerHTML = `
      <div role="alert" class="alert alert-success" id="mensajePresupuestoErr">
         <p class="mb-0 h6">Prepárate para tu nueva aventura.</p>
      </div>
      `;
      alertMensajeElement.appendChild(mensajePresupuesto);
    }
  }
  function reset() {
    formulario.reset();
  }
});

addEventListener('input', function (e) {
  const inputValue = parseInt(e.target.value);
  console.log(inputValue);

  if (inputValue < 0) {
    e.target.value = Math.abs(inputValue);
  }
});

addEventListener('keydown', function (event) {
  if (event.key === '-' || event.code === 'Slash') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No puedes ingresar números negativos',
    });
  }
});

btnBorrar.addEventListener('click', function () {
  formulario.reset();
  calBudget.innerHTML = '';
  const mensajePresupuesto = document.getElementById('alertMensaje');
  mensajePresupuesto.innerHTML = '';

  const mensajeError = document.getElementById('alertError');
  mensajeError.innerHTML = '';

  calcularPresupuesto.disabled = false;
  calcularPresupuesto.value = 'Calcular presupuesto';
});

// Agregar el evento de clic al botón
borrarBusqueda.addEventListener('click', filtrarPorPais);

// Función de filtrado y renderizado

function filtrarPorPais() {
  resultado.innerHTML = '';
  const texto = input.value.toLowerCase();
  const paises = ['chile', 'argentina', 'colombia', 'mexico'];

  for (let paquete of paquetes) {
    const pais = paquete.pais.toLowerCase();
    if (pais.includes(texto)) {
      resultado.innerHTML += `
        <div class="card col-sm-3 p-2">
          <li>${pais}</li> 
          <h2>Planifiquemos tu viaje a ${pais}</h2>
        </div>
      `;
    }
  }

  if (resultado.innerHTML === '') {
    resultado.innerHTML += `<li>Resultado no encontrado</li>`;
  }
}

function mostrarError(elementId, mensaje) {
  const elementoError = document.getElementById(elementId);
  elementoError.innerHTML = `
      <div role="alert" class="alert alert-danger">
        <p class="mb-0 h6">${mensaje}</p>
      </div>
    `;
}

// Renderizar productos

function renderizarProductos(listaItems) {
  contenedorItems.innerHTML = '';
  for (const item of listaItems) {
    contenedorItems.innerHTML += `
      <div class="card col-sm-3 p-2">
        <img class="card-img-top" src=${item.foto} alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${item.nombre}</h5>
          <p class="card-text">$ ${item.precio}</p>
          <button id=${item.id} class="btn btn-primary compra">Comprar</button>
        </div>
      </div>
    `;
  }


  for (const boton of botones) {
    boton.addEventListener('click', () => {
      const prodACarro = paquetes.find((producto) => producto.id == boton.id);
      console.log(prodACarro);
      agregarACarrito(prodACarro);
    });

    boton.onmouseover = () => {
      boton.classList.replace('btn-primary', 'btn-success');
    };
    boton.onmouseout = () => {
      boton.classList.replace('btn-success', 'btn-primary');
    };
  }
}

// Función para agregar al carrito

function agregarACarrito(producto) {
  carrito.push(producto);
  itemsEnCarrito.innerHTML += `
    <tr>
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.precio}</td>
    </tr>
  `;

  const total = carrito.reduce((ac, prod) => ac + prod.precio, 0);
  document.getElementById('total').innerText = `Total a pagar: $${total}`;
  localStorage.setItem('carro', JSON.stringify(carrito));
}

// Función para filtrar por precio

function filtrarPorPrecio(precioMin, precioMax) {
  const filtrados = paquetes.filter(
    (prod) => prod.precio >= precioMin && prod.precio <= precioMax
  );
  sessionStorage.setItem('filtrados', JSON.stringify(filtrados));
  return filtrados;
}

filtrarBusqueda.onclick = () => {
  if (
    min.value !== '' &&
    max.value !== '' &&
    parseInt(min.value) < parseInt(max.value)
  ) {
    const listaFiltrados = filtrarPorPrecio(
      parseInt(min.value),
      parseInt(max.value)
    );
    renderizarProductos(listaFiltrados);
  }
};

btnComprar.addEventListener('click', finalizarCompra);

// Función Finalizar compra, agregar productos y si no hay nada agregado lanza alerta.

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'El carrito está vacío. Agrega algunos productos antes de finalizar la compra.',
    });

    return;
  } else {
    const total = carrito.reduce(
      (acumulador, producto) => acumulador + producto.precio,
      0
    );

    const mensaje = `Total a pagar: $${total}`;
    Swal.fire('¡Gracias por tu compra!', mensaje, 'success');
    carrito.length = 0;
    itemsEnCarrito.innerHTML = '';

    document.getElementById('total').innerText = 'Total a pagar: $0';
  }
}
