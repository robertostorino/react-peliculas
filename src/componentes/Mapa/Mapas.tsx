import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import type Coordenada from "./Coordenada.model";
import { useState } from "react";

export default function Mapa(props: MapaProps){
    
    const [coordenadas, setCoordenadas] = useState<Coordenada[] | undefined>(props.coordenadas);
    
    return (
        <MapContainer center={[-34.92142710334101, -57.95440733736176]} zoom={14}
        scrollWheelZoom={true} style={{height: '500px'}}>
            <TileLayer
                attribution="React Películas"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ClickMapa setPunto={coordenada => {
                setCoordenadas([coordenada]);
                if (props.lugarSeleccionado){
                    props.lugarSeleccionado(coordenada);
                }
            }} />

                {coordenadas?.map(coordenada => <Marker key={coordenada.lat + coordenada.lng}
                    position={[coordenada.lat, coordenada.lng]}
                >
                    {coordenada.mensaje ? <Popup>{coordenada.mensaje}</Popup> : undefined}
                </Marker>)}

        </MapContainer>
    )
}

interface MapaProps{
    lugarSeleccionado?: (coordenada: Coordenada) => void //indico que no va retornar nada
    coordenadas?: Coordenada[];
}

function ClickMapa(props: ClickMapaProps){

    useMapEvent('click', e => {
        props.setPunto({lat: e.latlng.lat, lng: e.latlng.lng})
    })

    return null;
}

interface ClickMapaProps {
    setPunto: (coordenada: Coordenada) => void;
}