import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type ActorCreacion from "../modelos/ActorCreacion.model";
import FormularioActor from "./FormularioActor";
import Cargando from "../../../componentes/Cargando";
import type { SubmitHandler } from "react-hook-form";

export default function EditarActor(){
    
    const {id} = useParams();   // useParams -> ReactHook para obtener el parámetro de la URL
    
    const [modelo, setModelo] = useState<ActorCreacion | undefined>(undefined);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setModelo({nombre: 'Tom' + id, fechaNacimiento: '2022-11-23', foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/800px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg'})
        }, 1000);

        return () => clearTimeout(timerId);
    }, [id]);

    const onSubmit: SubmitHandler<ActorCreacion> = async (data) => {
            console.log('editando actor...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(data);
    };

    return (
        <>
            <h3>Editar Actor</h3>
            {modelo ? <FormularioActor modelo={modelo} onSubmit={onSubmit} /> : <Cargando />}
        </>
    )
}