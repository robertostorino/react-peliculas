export function primeraLetraMayuscula(){
    return {
        name: 'primera-letra-mayuscula',
        message: 'La primera letra debe ser mayúscula',
        test: (valor: string | undefined) => {
            if (valor && valor.length > 0){
                const primeraLetra = valor.substring(0, 1); // obtengo la 1º letra
                return primeraLetra === primeraLetra.toUpperCase(); // Si son igual, quiere decir que la 1º letra es mayúscula.
            }

            return true; // Devuelvo true, porque los demás casos están fuera de la evaluación.
        }
    }
}

export function fechaNoPuedeSerFutura(){
    return {
        name: 'fecha-no-es-futura',
        message: 'La fecha no puede ser del futuro',
        test: (valor: string | undefined) => {
            if (!valor) return true;

            const fecha = new Date(valor);
            const hoy = new Date();
            return fecha <= hoy; // Si la fecha es menor a hoy significa que no es del futuro.
        }
    }
}