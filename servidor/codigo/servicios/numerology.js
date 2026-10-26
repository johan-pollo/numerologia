const valoresPitagoricos = new Map(
    [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letra, indice) => [
        letra,
        (indice % 9) + 1
    ])
);

const numerosMaestros = new Set([11, 22, 33]);

function reducirNumero(numero) {
    while (numero > 9 && !numerosMaestros.has(numero)) {
        numero = String(numero)
            .split("")
            .reduce((suma, digito) => suma + Number(digito), 0);
    }

    return numero;
}

function normalizarNombre(nombre) {
    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z]/g, "");
}

function sumarLetras(nombre, incluirSoloVocales = false) {
    const letras = normalizarNombre(nombre);
    if (!letras) {
        throw new TypeError("El nombre debe contener al menos una letra");
    }

    const vocales = [...letras].filter((letra) => "AEIOU".includes(letra));
    const seleccion = incluirSoloVocales
        ? vocales.length
            ? vocales
            : [...letras].filter((letra) => letra === "Y")
        : [...letras];

    if (incluirSoloVocales && !seleccion.length) {
        throw new TypeError("El nombre no contiene vocales para calcular el número del alma");
    }

    return seleccion.reduce(
        (suma, letra) => suma + valoresPitagoricos.get(letra),
        0
    );
}

export function calcularNumerosPrincipales(nombreCompleto, fechaNacimiento) {
    const fecha = new Date(fechaNacimiento);

    if (!nombreCompleto?.trim() || Number.isNaN(fecha.getTime())) {
        throw new TypeError("Se requiere nombre y fecha de nacimiento válidos");
    }

    const fechaDigitos = [
        fecha.getUTCFullYear(),
        fecha.getUTCMonth() + 1,
        fecha.getUTCDate()
    ].join("");
    const sumaFecha = [...fechaDigitos].reduce(
        (suma, digito) => suma + Number(digito),
        0
    );

    return {
        numero_vida: reducirNumero(sumaFecha),
        numero_expresion: reducirNumero(sumarLetras(nombreCompleto)),
        numero_alma: reducirNumero(sumarLetras(nombreCompleto, true))
    };
}
