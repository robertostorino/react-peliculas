import { type SubmitHandler } from "react-hook-form";
import FormularioGenero from "./FormularioGenero";
import type GeneroCreacion from "./modelos/GeneroCreacion.model";

export default function CrearGenero(){

    const onSubmit: SubmitHandler<GeneroCreacion> = async (data) => {
        console.log('creando el género...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(data); // data: es la data del formulario
    }
    
    return (
        <>
            <h3>Crear Género</h3>
            <FormularioGenero onSubmit={onSubmit}/>
        </>
    )
}