import { useEffect, useState } from "react";
import { useParams } from "react-router"
import type CineCreacion from "../modelos/CineCreacion.model";
import ForumarioCine from "./FormularioCine";
import type { SubmitHandler } from "react-hook-form";
import Cargando from "../../../componentes/Cargando";

export default function EditarCine(){
    
    const {id} = useParams();   // useParams -> ReactHook para obtener el parámetro de la URL
    const [modelo, setModelo] = useState<CineCreacion | undefined>(undefined);

    useEffect(() => {
        setTimeout(() => {
            setModelo({nombre: 'Cinema 8', latitud: -34.91756723460226, longitud: -57.94953882694245});
        }, 1000);
    }, [id]);

    const onSubmit: SubmitHandler<CineCreacion> = async (data) => {
            console.log('editar el cine...');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(data);
        }

    return (
        <>
            <h3>Editar Cine</h3>
            {modelo ? <ForumarioCine modelo={modelo} onSubmit={onSubmit} /> : <Cargando /> }
        </>
    )
}