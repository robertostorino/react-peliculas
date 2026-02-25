import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

export default function RutaNoEncontrada(){
    
    const location = useLocation(); // Devuelve la localización actual. Me devuelve la URL que está en el navegador
    
    useEffect(() => {
        console.log(`Ruta no encontrada: ${location.pathname}`)
    }, [location])

    return <Navigate to="/" />
}