import { useNavigate } from "react-router";
import Boton from "../../../componentes/Boton";

export default function IndiceGeneros(){
    
    const navigate = useNavigate(); // Es un hook de React Router
    return (
        <>
            <h3>Géneros</h3>
            <Boton onClick={() => navigate('/generos/crear')}>Crear Género</Boton>
        </>
    )
}