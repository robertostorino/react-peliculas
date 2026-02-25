import { useNavigate } from "react-router";
import Boton from "../../../componentes/Boton";

export default function IndiceCines(){
    
    const navigate = useNavigate(); // Es un hook de React Router

    return (
        <>
            <h3>Cines</h3>
            <Boton onClick={() => navigate('/cines/crear')}>Crear Cine</Boton>
        </>
    )
}