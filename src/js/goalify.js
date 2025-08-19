class Usuario{
    constructor(usuario, password, idPais ){
        this.usuario= usuario
        this.password= password
        this.idPais=idPais    
    }
}

class Evaluacion{
    constructor(idObjetivo, idUsuario, calificacion,fecha ){
        this.idObjetivo= idObjetivo
        this.idUsuario= idUsuario
        this.calificacion=calificacion   
        this.fecha=fecha 
    }
}

//variables globales

let usuarioConectado= null
let listaPaises=[]
let objetivosPorId = {}; 
let usuariosPorPais = []; 
let evaluacionesGuardadas = []; 
let pendingMapa = false
let map 

// cons pantallas

const MENU= document.querySelector("#menu")
const RUTEO= document.querySelector("#ruteo")
const PANTALLAHOME= document.querySelector("#pantallaHome")
const PANTALLALOGIN= document.querySelector("#pantallaLogin")
const PANTALLAREGISTRARUSUARIO= document.querySelector("#pantallaRegistrarUsuario")
const PANTALLAAGREGAREVALUACION= document.querySelector("#pantallaAgregarEvaluacion")
const PANTALLALISTADO= document.querySelector("#pantallaListado")
const PANTALLAINFORME=document.querySelector("#pantallaInforme")
const PANTALLAMAPA= document.querySelector("#pantallaMapa")
inicio()

function inicio(){
    RUTEO.addEventListener("ionRouteDidChange",navegar)
    // escuchas de botones
    document.querySelector("#btnHacerRegistroUsuario").addEventListener("click", previaRegistrarUsuario)
    document.querySelector("#botonLogin").addEventListener("click",previaLogin)
    document.querySelector("#btnLogout").addEventListener("click",logout)
    document.querySelector("#btnAgregarEvaluacion").addEventListener("click",obtenerObjetivos)
    document.querySelector("#fechaEv").addEventListener('ionChange', verFecha);
    document.querySelector("#btnRegistrarEvaluacion").addEventListener("click", previaRegistrarEvaluacion)
    document.querySelector("#btnListado").addEventListener("click", previaListado)
    document.querySelector("#btnInforme").addEventListener("click",previaInforme)
    //paises 
   obtenerPaises()
   //manejo del menu
   ocultarMenu()
   if (localStorage.getItem("token")==null){
    mostrarMenuAnonimo()
   } else {
    mostrarMenuVIP()
   }
}


//navegacion
function navegar(evento){
    
     ocultarTodo()
     if (evento.detail.to=="/") PANTALLAHOME.style.display="block"
     if (evento.detail.to=="/login") PANTALLALOGIN.style.display="block"
     if (evento.detail.to=="/registrarUsuario") PANTALLAREGISTRARUSUARIO.style.display="block"
     if (evento.detail.to=="/agregarEvaluacion") PANTALLAAGREGAREVALUACION.style.display="block"
      if (evento.detail.to=="/listado") { PANTALLALISTADO.style.display="block"; previaListado(); }
     if (evento.detail.to=="/informe") { PANTALLAINFORME.style.display="block"; previaInforme(); }
     if (evento.detail.to=="/mapa"){ PANTALLAMAPA.style.display="block"
     pendingMapa = true;           
    dibujarMapaUsuariosPorPais();}
}


function ocultarTodo(){
        PANTALLAHOME.style.display="none"
        PANTALLALOGIN.style.display="none"
        PANTALLAREGISTRARUSUARIO.style.display="none"
        PANTALLAAGREGAREVALUACION.style.display="none"
        PANTALLALISTADO.style.display="none"
        PANTALLAMAPA.style.display="none"
        PANTALLAINFORME.style.display="none"
}

function cerrarMenu(){
    MENU.close()
}

//REGISTRO
function previaRegistrarUsuario(){
  let usuario  = document.querySelector("#txtUsuarioRU").value.trim();
  let password = document.querySelector("#txtPasswordRU").value.trim();
  let pais     = document.querySelector("#slcPais").value;

  if (usuario === "" || password === "" || !pais) {
    mostrarMensaje("ERROR", "Datos incompletos", "Completá usuario, contraseña y país.", 2500);
    return;
  }

  let nuevoUsuario = new Usuario(usuario, password, pais);
  hacerRegistroUsuario(nuevoUsuario);
}


function hacerRegistroUsuario(nuevoUsuario){
    
    fetch (`https://goalify.develotion.com/usuarios.php`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
        })
        .then(function (response){
            return response.json()
         })
        .then(function(informacion){
            if (informacion.codigo===200){
                mostrarMensaje("SUCESS", "Registro exitoso", "Se ha registrado su usuario",2000)
                localStorage.setItem("token",informacion.token)
                localStorage.setItem("iduser", informacion.id); 
                ocultarMenu();
                mostrarMenuVIP();
                usuarioConectado = nuevoUsuario.usuario;

                ocultarTodo()
                PANTALLAHOME.style.display="block"
            }
           
        })
        .catch(function(error){
        console.log(error)
        })

}

function obtenerPaises(){
    fetch("https://goalify.develotion.com/paises.php")
 .then(function (response){
 return response.json()
 })
 .then(function(data){    
    listaPaises= data.paises
         cargarPaisesRegistrarUSuario()

 })
 .catch(function(error){
 console.log(error)
 })
}


function cargarPaisesRegistrarUSuario(){
  let miSelect="";
  console.log(listaPaises);
  for (let unPais of listaPaises){
    miSelect += `<ion-select-option value=${unPais.id}>${unPais.name}</ion-select-option>`;
  }
  document.querySelector("#slcPais").innerHTML = miSelect;

  if (pendingMapa) {
    dibujarMapaUsuariosPorPais();
  }
}

//MENU

function ocultarMenu(){
    document.querySelector("#btnRegistrarUsuario").style.display="none"
    document.querySelector("#btnLogin").style.display="none"
    document.querySelector("#btnLogout").style.display="none"
    document.querySelector("#btnAgregarEvaluacion").style.display="none"
    document.querySelector("#btnListado").style.display="none"
    document.querySelector("#btnInforme").style.display="none"
    document.querySelector("#btnMapa").style.display="none"
}

function mostrarMenuAnonimo(){
    document.querySelector("#btnRegistrarUsuario").style.display="block"
    document.querySelector("#btnLogin").style.display="block"
}

function mostrarMenuVIP(){
     document.querySelector("#btnLogout").style.display="block"
    document.querySelector("#btnAgregarEvaluacion").style.display="block"
    document.querySelector("#btnListado").style.display="block"
    document.querySelector("#btnInforme").style.display="block"
    document.querySelector("#btnMapa").style.display="block"
}

// LOGUIN
function previaLogin(){

    let usuario= document.querySelector("#txtUsuario").value
    let password= document.querySelector("#txtPass").value  

    let usuarioLogin= new Object()
    usuarioLogin.usuario=usuario 
    usuarioLogin.password=password 

    hacerLogin(usuarioLogin)
}

function previaLogin(){

    let usuario= document.querySelector("#txtUsuario").value
    let password= document.querySelector("#txtPass").value  

    let usuarioLogin= new Object()
    usuarioLogin.usuario=usuario 
    usuarioLogin.password=password

    hacerLogin(usuarioLogin)
}

function hacerLogin(usuarioLogin){
    fetch (`https://goalify.develotion.com/login.php`,{
 method:'POST',
 headers:{
 'Content-Type': 'application/json'
 },
 body: JSON.stringify(usuarioLogin)
 })
 .then(function (response){
    console.log(response)
 return response.json()
 })
 .then(function(informacion){
    console.log(informacion)
    if (informacion.codigo===200){
       mostrarMensaje("SUCESS", "Login exitoso", "Se ha logueado con éxito",2000)
        localStorage.setItem("iduser",informacion.id)
        localStorage.setItem("token",informacion.token)
        // muestran la pantalla HOME
        ocultarTodo()
        PANTALLAHOME.style.display="block"
        // mostrar el otro menu y otra pantalla
        ocultarMenu()
        mostrarMenuVIP()
        usuarioConectado= usuarioLogin.usuario 


    } else {
        alert (informacion.mensaje)
    }
    

 })
 .catch(function(error){
 console.log(error)
 })
}

//LOGOUT

function logout(){
  localStorage.removeItem("iduser")
    localStorage.removeItem("token")
    ocultarTodo() 
    PANTALLAHOME.style.display="block"
    ocultarMenu()
    mostrarMenuAnonimo()
    // usuarioConectado= null
}

//REGISTRO DE EVALUACION

function obtenerObjetivos (){
  fetch (`https://goalify.develotion.com/objetivos.php`,{
        method:'GET',
        headers:{
        'Content-Type': 'application/json',
        'token':localStorage.getItem("token"),
        'iduser': localStorage.getItem("iduser")
    }
    })
        .then(function (response){
            console.log(response)
            return response.json()
        })
        .then(function(informacion){
            console.log(informacion)
            cargarSelectObjetivos(informacion.objetivos)
        })
        .catch(function(error){
            console.log(error)
        })
}

function cargarSelectObjetivos(listaObjetivos){
    let miSelect = "";
    objetivosPorId = {}; // reset por si recargás

    for (let unObjetivo of listaObjetivos){
        miSelect += `<ion-select-option value=${unObjetivo.id}>
            ${unObjetivo.nombre}${unObjetivo.emoji}
        </ion-select-option>`;

        // armo el diccionario para lookup rápido en el listado
        objetivosPorId[unObjetivo.id] = `${unObjetivo.emoji} ${unObjetivo.nombre}`;
    }
    document.querySelector("#slcObjetivo").innerHTML = miSelect;
}


function verFecha(ev) {
    const fechaSeleccionada = new Date(ev.detail.value);
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > hoy) {
        mostrarMensaje("ERROR", "Fecha inválida", "La fecha no puede ser posterior a hoy", 2500);
        document.querySelector("#fechaEv").value = "";
    } else {
        console.log("Fecha válida:", fechaSeleccionada.toISOString().split('T')[0]);
    }
}


function previaRegistrarEvaluacion(){
  let idObjetivo = document.querySelector("#slcObjetivo").value;
  let idUsuario  = localStorage.getItem("iduser");
  let calificacion     = document.querySelector("#txtCalificacion").value;
  let fecha      = document.querySelector("#fechaEv").value;
  if (!idObjetivo || !idUsuario || calificacion.trim() === "" || !fecha) {
    mostrarMensaje("ERROR", "Datos incompletos", "Completá objetivo, calificación y fecha.", 2500);
    return;
  }

  let cal = Number(calificacion);
  if (!Number.isInteger(cal) || cal < -5 || cal > 5) {
    mostrarMensaje("ERROR", "Calificación inválida", "Debe ser un número entero entre -5 y 5.", 2500);
    return;
  }
  let nuevaEvaluacion = new Evaluacion(idObjetivo, idUsuario, cal, fecha);
  hacerRegistroEvaluacion(nuevaEvaluacion);
}


function hacerRegistroEvaluacion(nuevaEvaluacion){
    fetch (`https://goalify.develotion.com/evaluaciones.php`,{
    method:'POST',
    headers:{
    'Content-Type': 'application/json',
    'token':localStorage.getItem("token"),
    'iduser': localStorage.getItem("iduser")
    },
    body: JSON.stringify(nuevaEvaluacion)
    })
    .then(function (response){
        console.log(response)
    return response.json()
    })
    .then(function(informacion){
        console.log(informacion)
        if (informacion.codigo===200){
        mostrarMensaje("SUCESS", "Registro exitoso", "Se ha registrado una evaluacion",2000)
         // ✅ Normalizo la fecha a YYYY-MM-DD en zona America/Montevideo
        const fechaUY = new Intl.DateTimeFormat("en-CA", {
         timeZone: "America/Montevideo",
         year: "numeric",
         month: "2-digit",
         day: "2-digit"
      }).format(new Date(nuevaEvaluacion.fecha));

      evaluacionesGuardadas.push({
       idObjetivo: nuevaEvaluacion.idObjetivo,
    idUsuario:  nuevaEvaluacion.idUsuario,
     calificacion: Number(nuevaEvaluacion.calificacion),
    fecha:       fechaUY
  });
        actualizarInformeCon(evaluacionesGuardadas);
        document.querySelector("#slcObjetivo").value = "";
        document.querySelector("#txtCalificacion").value = "";
         document.querySelector("#fechaEv").value = "";
        } else {
            mostrarMensaje ("ERROR","Hubo un error",informacion.mensaje,2000)
        }
        

    })
    .catch(function(error){
    console.log(error)
    })
}

//LISTADO DE EVALUACIONES
async function previaListado() {
    let idUsuario = localStorage.getItem("iduser");

    // Si todavía no tenemos los objetivos, los traemos antes
    if (!Object.keys(objetivosPorId).length) {
        await fetch(`https://goalify.develotion.com/objetivos.php`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token"),
                "iduser": idUsuario
            },
        })
        .then(r => r.json())
        .then(info => {
            objetivosPorId = {};
            for (let obj of info.objetivos) {
                objetivosPorId[obj.id] = ` ${obj.nombre}${obj.emoji}`;
            }
        })
        .catch(console.error);
    }

    // Ahora traemos las evaluaciones
    fetch(`https://goalify.develotion.com/evaluaciones.php?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"), 
            "iduser": idUsuario
        },
    })
    .then(response => response.json())
    .then(informacion => {
        evaluacionesGuardadas = informacion.evaluaciones;
        hacerListado(evaluacionesGuardadas);
        actualizarInformeCon(evaluacionesGuardadas);
    })
    .catch(console.error);
}


function hacerListado(listaEvaluaciones) {
    let rango = document.querySelector("#filtroFechas").value; 
    let fechaLimite = null;
    if (rango !== "todas") {
        fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - parseInt(rango)); 
    }

    let verEvaluacion = ``;
    for (let unaEvaluacion of listaEvaluaciones) {
        // filtro por fecha
        let fechaEval = new Date(unaEvaluacion.fecha); 
        if (fechaLimite && fechaEval < fechaLimite) continue;

        // formato de fecha
        const [y,m,d] = unaEvaluacion.fecha.split("-");
        const fechaFormateada = `${d}/${m}/${y}`;
        const objetivoLabel = objetivosPorId[unaEvaluacion.idObjetivo] 
                              ?? `ID: ${unaEvaluacion.idObjetivo}`;

        verEvaluacion += `<ion-item>
                <ion-label>
                    <h3>Objetivo: ${objetivoLabel}</h3>
                    <h3>Calificación: ${unaEvaluacion.calificacion}</h3>
                    <h3>Fecha: ${fechaFormateada}</h3>
                    <h3>Id : ${unaEvaluacion.id}</h3>
                </ion-label>
                <ion-button onclick="eliminarEvaluacion(${unaEvaluacion.id})">
                    Eliminar
                </ion-button>
            </ion-item>`;
    }

    document.querySelector("#mostrarListado").innerHTML = verEvaluacion;
}


document.querySelector("#filtroFechas").addEventListener("ionChange", function() {
    hacerListado(evaluacionesGuardadas);
});


function eliminarEvaluacion(idEvaluacion){

 let url = `https://goalify.develotion.com/evaluaciones.php?idEvaluacion=${idEvaluacion}`

fetch(`${url}`, {
method: 'DELETE',
headers: {
'Content-Type': 'application/json',
"token": localStorage.getItem("token"),
"iduser": localStorage.getItem("iduser")

},
 
})
.then(function (response) {
    console.log(response)
return response.json();
})
.then(function (informacion) {
    console.log(informacion)
     if (informacion.codigo==200 ) {
        previaListado()
    }
})
.catch(function(error){
console.log(error)
})
}

//MAPA

function dibujarMapaUsuariosPorPais() {
  if (!listaPaises || listaPaises.length === 0) return; // aún no llegaron, lo reintenta cargarPaises...

  const div = document.querySelector("#map");
  if (!div) return;

  if (map) { map.remove(); map = null; }

  map = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  // armar diccionario desde listaPaises ya cargada
  paisesPorId = {};
  for (const p of listaPaises) {
    paisesPorId[p.id] = { nombre: p.name, lat: p.latitude, lon: p.longitude };
  }
  getUsuariosPorPais();
}


function getUsuariosPorPais(){
  fetch(`https://goalify.develotion.com/usuariosPorPais.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": localStorage.getItem("token"),
      "iduser": localStorage.getItem("iduser")
    }
  })
  .then(function (response){
      return response.json();
  })
  .then(function(info){
      console.log("usuariosPorPais ->", info);

      // La API trae el array en "paises" con { id, nombre, cantidadDeUsuarios }
      let arr = (info && Array.isArray(info.paises)) ? info.paises : [];

      // Enriquecer TU listaPaises "in place": agregar .cantidad cuando matchee el id
      for (let i = 0; i < listaPaises.length; i++){
        let p = listaPaises[i];
        p.cantidad = 0; // por defecto

        for (let j = 0; j < arr.length; j++){
          let u = arr[j];
          if (parseInt(p.id, 10) === parseInt(u.id, 10)){
            let cant = parseInt(u.cantidadDeUsuarios, 10);
            p.cantidad = isNaN(cant) ? 0 : cant;
            break;
          }
        }
      }
      let bounds = [];
      for (let k = 0; k < listaPaises.length; k++){
        let item = listaPaises[k];
        if (item.latitude == null || item.longitude == null) { continue; }

        let marker = L.marker([item.latitude, item.longitude]).addTo(map);
        let cantTxt = item.cantidad || 0;
        marker.bindPopup(`<b>${item.name}</b><br>${cantTxt} usuarios`).openPopup();
        bounds.push([item.latitude, item.longitude]);
      }

      if (bounds.length > 1) { map.fitBounds(bounds, { padding: [30, 30] }); }
      else if (bounds.length === 1) { map.setView(bounds[0], 5); }
  })
  .catch(function(error){
      console.log(error);
  });
}

//INFORME

function previaInforme(){
    const idUsuario = localStorage.getItem("iduser");
  const headers = {
    "Content-Type": "application/json",
    "token": localStorage.getItem("token"),
    "iduser": idUsuario
  };

  if (evaluacionesGuardadas && evaluacionesGuardadas.length) {
    actualizarInformeCon(evaluacionesGuardadas);
  } else {
    fetch(`https://goalify.develotion.com/evaluaciones.php?idUsuario=${idUsuario}`, {
      method: "GET", headers
    })
    .then(r => r.json())
    .then(info => {
      evaluacionesGuardadas = Array.isArray(info.evaluaciones) ? info.evaluaciones : [];
      actualizarInformeCon(evaluacionesGuardadas);
    })
    .catch(console.error);
  }
}

function actualizarInformeCon(evaluaciones) {
  const lblGlobal = document.querySelector("#lblPuntajeGlobal");
  const lblHoy    = document.querySelector("#lblPuntajeHoy");
  if (!lblGlobal || !lblHoy) return;

  const { global, hoy } = promedios(evaluaciones); 

  lblGlobal.innerHTML = (global !== null)
    ? `<strong>${Number(global).toFixed(2)}</strong>`
    : "—";

  lblHoy.innerHTML = (hoy !== null)
    ? `<strong>${Number(hoy).toFixed(2)}</strong>`
    : "—";
}

function promedios(evaluaciones) {
  if (!Array.isArray(evaluaciones) || evaluaciones.length === 0) {
    return { global: null, hoy: null };
  }

  let sumaGlobal = 0;
  let cantGlobal = 0;
  let sumaHoy = 0;
  let cantHoy = 0;

  const hoyStr = fechaISOdeHoy(); // "yyyy-mm-dd"

  for (let i = 0; i < evaluaciones.length; i++) {
    const ev = evaluaciones[i];
    const n = Number(ev && ev.calificacion);

    if (!isNaN(n)) {
      // Global
      sumaGlobal += n;
      cantGlobal++;

      // Solo hoy
      if (ev && ev.fecha === hoyStr) {
        sumaHoy += n;
        cantHoy++;
      }
    }
  }

  const global = cantGlobal > 0 ? (sumaGlobal / cantGlobal) : null;
  const hoy    = cantHoy    > 0 ? (sumaHoy    / cantHoy)    : null;

  return { global, hoy };
}



function fechaISOdeHoy() {
  // Siempre hoy en Montevideo en formato YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Montevideo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}



//Manejo de mensajes
function mostrarMensaje(tipo, titulo, texto, duracion) {
const toast = document.createElement('ion-toast');
toast.header = titulo;
toast.message = texto;
if (!duracion) {
duracion = 2000;
}
toast.duration = duracion;
if (tipo === "ERROR") {
toast.color = 'danger';
toast.icon = "alert-circle-outline";
} else if (tipo === "WARNING") {
toast.color = 'warning';
toast.icon = "warning-outline";
} else if (tipo === "SUCCESS") {
toast.color = 'success';
toast.icon = "checkmark-circle-outline";
}
document.body.appendChild(toast);
toast.present();
}

