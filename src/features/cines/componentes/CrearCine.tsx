import type { SubmitHandler } from "react-hook-form";
import type CineCreacion from "../modelos/CineCreacion.model";
import FormularioCine from "./FormularioCine";

export default function CrearCine(){
    
    const onSubmit: SubmitHandler<CineCreacion> = async (data) => {
        console.log('creando el cine...');
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(data);
    }
    
    return (
        <>
            <h3>Crear Cine</h3>
            <FormularioCine onSubmit={onSubmit} />
        </>
    )
}