window.addEventListener('DOMContentLoaded', () => leer())

const API = "https://sheet.best/api/sheets/18f38fed-7379-448e-9f41-4065bf4b2cff"

const body = document.getElementById("body")
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

//Expresión regular que solo permite texto
const textoRegExp = /^[A-Za-z\s]+$/;
//Expresión regular que solo permite números
const numeroRegExp = /^[0-9]+$/

//Agregar CLientes

const btnAdd = document.getElementById("btnAdd")

btnAdd.addEventListener("click", async () => {
    let dataName = inputNameAdd.value;
    let dataId = inputIdAdd.value;
    let dataPhone = inputPhoneAdd.value;

    if (dataName.length === 0 || dataId.length === 0 || dataPhone.length === 0) {
        ventanaEmergente("No se permiten campos vacíos", false);
    } else if (!textoRegExp.test(dataName)) {
        ventanaEmergente("En el campo nombre solo se permite texto", false)
    } else if (dataName.length > 40) {
        ventanaEmergente("En nombre no se permiten más de 40 caracteres", false);
    } else if (!numeroRegExp.test(dataId, dataPhone)) {
        ventanaEmergente("En los campos identificación y télefono solo se permiten números", false)
    } else if (dataId.length !== 10) {
        ventanaEmergente("Ingrese una identificación valida", false);
    } else if (dataPhone.length !== 10) {
        ventanaEmergente("Ingrese una télefono valido", false);
    }
    else {
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
                console.log(data);
                location.reload()
            })
            .catch((error) => {
                console.log(error);
            });
        console.log(resAdd);
    }
})

// Actualizar Hoja

const btnUpdate = document.getElementById("btnUpdate")

let index
function actualizar(i) {
    index = i
}

btnUpdate.addEventListener("click", async () => {
    const dataName = inputNameUpdate.value
    const dataId = inputIdUpdate.value
    const dataPhone = inputPhoneUpdate.value

    if (dataName.length === 0 || dataId.length === 0 || dataPhone.length === 0) {
        ventanaEmergente("No se permiten campos vacíos", false);
    } else if (!textoRegExp.test(dataName)) {
        ventanaEmergente("En el campo nombre solo se permite texto", false)
    } else if (dataName.length > 40) {
        ventanaEmergente("En nombre no se permiten más de 40 caracteres", false);
    } else if (!numeroRegExp.test(dataId, dataPhone)) {
        ventanaEmergente("En los campos identificación y télefono solo se permiten números", false)
    } else if (dataId.length !== 10) {
        ventanaEmergente("Ingrese una identificación valida", false);
    } else if (dataPhone.length !== 10) {
        ventanaEmergente("Ingrese una télefono valido", false);
    } else if (dataName === clientes[index].Cliente && dataId === clientes[index].Identificación && dataPhone === clientes[index].Telefono) {
        ventanaEmergente("Para actualizar debe cambiar algún campo", false)
    } else {
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
                console.log(data);
                leer()
                ventanaEmergente(`Cliente "${clientes[index].Cliente}" Actualizado`, true)
                inputNameUpdate.value = ""
                inputIdUpdate.value = ""
                inputPhoneUpdate.value = ""
            })
            .catch((error) => {
                console.log(error);
            });
    }
})

// Eliminar Cliente

const btnRemove = document.getElementById("btnRemove").addEventListener("click", () => {
    const dataName = inputNameUpdate.value
    const dataId = inputIdUpdate.value
    const dataPhone = inputPhoneUpdate.value

    if (dataName !== "") {
        //Confirmación
        const contPrincipalConf = document.createElement("section")
        contPrincipalConf.id = "contPrincipalConf"
        const containerConfirmation = document.createElement("div")
        containerConfirmation.id = "containerConfirmation"
        const textConfirmation = document.createElement("p")
        textConfirmation.textContent = `¿Desea eliminar al cliente ${clientes[index].Cliente}?`
        const containerBtns = document.createElement("div")
        const btnTrue = document.createElement("button")
        const btnFalse = document.createElement("button")
        btnTrue.textContent = "Confirmar"
        btnFalse.textContent = "Cancelar"


        body.appendChild(contPrincipalConf)
        contPrincipalConf.appendChild(containerConfirmation)
        containerConfirmation.appendChild(textConfirmation)
        containerConfirmation.appendChild(containerBtns)
        containerBtns.appendChild(btnTrue)
        containerBtns.appendChild(btnFalse)

        btnTrue.addEventListener("click", () => {
            fetch(`https://sheet.best/api/sheets/18f38fed-7379-448e-9f41-4065bf4b2cff/${index}`, {
                method: "DELETE",
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    leer()
                    ventanaEmergente(`Cliente "${clientes[index].Cliente}" eliminado`, true)
                    body.removeChild(contPrincipalConf)
                    dataName = ""
                    dataId = ""
                    dataPhone = ""
                })
                .catch((error) => {
                    console.error(error);
                });
        })

        btnFalse.addEventListener("click", () => {
            body.removeChild(contPrincipalConf)
        })

    } else {
        ventanaEmergente("Selecciona un cliente para eliminar", false)
    }
})

function ventanaEmergente(text, value) {
    let icon
    value === true ? icon = "✔️" : icon = "❌"
    const window = document.createElement("div")
    const windowText = document.createElement("p")
    window.textContent = text + " " + icon
    window.id = "windowShow"

    body.appendChild(window)
    window.appendChild(windowText)
    setTimeout(() => {
        window.id = "windowHide"
    }, 3500);
}