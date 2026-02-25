import Cargando from "./Cargando";

export default function ListadoGenerico<T>(props: ListadoGenericoProps<T>) {

    // Si es undefined -> muestra Cargando... 
    if (!props.listado) {
        return props.cargandoUI ? props.cargandoUI : <Cargando />;
    }

    // Si no hay elementos -> muestra No existen elementos para mostrar
    else if (props.listado.length === 0){
        return props.listadoVacioUI ? props.listadoVacioUI : 'No hay elementos para mostrar'; // Si el cliente tiene un mensaje personalizado lo muestra, de lo contrario muestra 'No hay elementos para mostrar'
    } else {
        // Si hay elementos -> los muestra
        return props.children;
    }
}

interface ListadoGenericoProps<T>{
    listado: T[] | undefined; // Podemos recibir un arreglo del tipo T ó undefined
    children: React.ReactNode; // Es una manera de pasar contenido
    listadoVacioUI?: React.ReactNode;
    cargandoUI?: React.ReactNode;
}
// La <T> indica que es de tipo, es decir puede recibir cualquier tipo.