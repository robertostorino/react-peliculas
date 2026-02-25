import { useNavigate } from "react-router";
import Boton from "../../../componentes/Boton";

export default function IndiceActores(){
    
    const navigate = useNavigate(); // Es un hook de React Router

    return (
        <>
            <h3>Actores</h3>
            <Boton onClick={() => navigate('/actores/crear')}>Crear Actor</Boton>
        </>
    )
}