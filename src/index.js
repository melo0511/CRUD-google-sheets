window.addEventListener('DOMContentLoaded', () => leer())

const API = "https://sheet.best/api/sheets/18f38fed-7379-448e-9f41-4065bf4b2cff"

const listClients = document.getElementById("listClients")

// Inputs Agregar
const inputNameAdd = document.getElementById("inputNameAdd")
const inputIdAdd = document.getElementById("inputIdAdd")
const inputPhoneAdd = document.getElementById("inputPhoneAdd")

// Inputs actualizar
const inputNameUpdate = document.getElementById("inputNameUpdate")
const inputIdUpdate = document.getElementById("inputIdUpdate")
const inputPhoneUpdate = document.getElementById("inputPhoneUpdate")

let clientes = []

// Leer hoja
function leer() {
    listClients.innerHTML = ""
    const tarjetaDefault = document.createElement("section")
    tarjetaDefault.id = "tarjetaDefault"
    const textDefault1 = document.createElement("p")
    textDefault1.id = "textDefault"
    const textDefault2 = document.createElement("p")
    textDefault2.id = "textDefault"
    const textDefault3 = document.createElement("p")
    textDefault3.id = "textDefault"

    textDefault1.textContent = "Clientes"
    textDefault2.textContent = "Identificación"
    textDefault3.textContent = "Télefono"

    tarjetaDefault.appendChild(textDefault1)
    tarjetaDefault.appendChild(textDefault2)
    tarjetaDefault.appendChild(textDefault3)
    listClients.appendChild(tarjetaDefault)
    
    fetch(
        API
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            data.forEach((element, i) => {
                clientes.push(element)
                const contenedor = document.createElement("section")
                contenedor.id = i
                contenedor.className = "tarjeta"
                contenedor.innerHTML = `
                <p>${element.Cliente}</p>
                <p>${element.Identificación}</p>
                <p>${element.Telefono}</p>
                `
                contenedor.addEventListener("click", () => {
                    actualizarDetalle(i)
                    actualizar(i)
                })
                listClients.appendChild(contenedor)
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

let indiceSeleccionado;

function actualizarDetalle(i) {
    inputNameUpdate.value = clientes[i].Cliente;
    inputIdUpdate.value = clientes[i].Identificación;
    inputPhoneUpdate.value = clientes[i].Telefono;
    indiceSeleccionado = i;
}

//Agregar CLientes

const btnAdd = document.getElementById("btnAdd")

btnAdd.addEventListener("click", async () => {
    const dataName = inputNameAdd.value
    const dataId = inputIdAdd.value
    const dataPhone = inputPhoneAdd.value

    const data = {
        Cliente: dataName,
        Identificación: dataId,
        Telefono: dataPhone,
        "Created at": new Date(),
    }

    const resAdd = await fetch(API, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((r) => r.json())
        .then((data) => {
            // The response comes here
            console.log(data);
            leer()
        })
        .catch((error) => {
            // Errors are reported there
            console.log(error);
        });
    console.log(resAdd);
})

// Actualizar Hoja

const btnUpdate = document.getElementById("btnUpdate")

let index
function actualizar(i) {
    console.log(i);
    index = i
}

btnUpdate.addEventListener("click", async () => {
    console.log("Actualizar el " + index);

    const dataName = inputNameUpdate.value
    const dataId = inputIdUpdate.value
    const dataPhone = inputPhoneUpdate.value
    let filter = `search?Cliente=*${dataName}*&Identificación=${dataId}`

    const data = {
        Cliente: dataName,
        Identificación: dataId,
        Telefono: dataPhone
    }
    await fetch(`https://sheet.best/api/sheets/18f38fed-7379-448e-9f41-4065bf4b2cff/${index}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((r) => r.json())
        .then((data) => {
            // The response comes here
            console.log(data);
            leer()
            console.log("Actualizado");
        })
        .catch((error) => {
            // Errors are reported there
            console.log(error);
        });
})

// Eliminar Cliente

const btnRemove = document.getElementById("btnRemove").addEventListener("click", () => {
    fetch(`https://sheet.best/api/sheets/18f38fed-7379-448e-9f41-4065bf4b2cff/${index}`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            leer()
            console.log("Eliminado");
        })
        .catch((error) => {
            console.error(error);
        });
})

