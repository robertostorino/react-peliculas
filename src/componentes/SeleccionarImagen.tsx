import { useState, type ChangeEvent } from "react";
import styles from './SeleccionarImagen.module.css';

export default function SeleccionarImagen(props: SeleccionarImagenProps){

    const [imagenBase64, setImagenBase64] = useState('');
    const [imagenURL, setImagenURL] = useState(props.imagenURL ? props.imagenURL : '');
    
    const manejarOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files){
            const archivo = e.currentTarget.files[0]; // Toma el primer archivo.

            aBase64(archivo).then(valor => setImagenBase64(valor))
            .catch(error => console.error(error));

            props.imagenSeleccionada(archivo); // Le paso al componente padre el hecho de que hubo un archivo seleccionado.
            setImagenURL(''); // Limpio el estado imagenURL
        }
    }

    // Convierte la imagen a base 64.
    const aBase64 = (archivo: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader(); // Lector de archivos.
            reader.readAsDataURL(archivo); // Permite pasarle el archivo para que sea leído.
            reader.onload = () => resolve(reader.result as string) // Cuando cargue el archivo se ejecuta la funcionallidad
            // Así le estará pasando al cliente el resolve con la representación en base 64 del archivo.
            reader.onerror = (error) => reject(error);
        })
    }

    return (
        <div className="form-group">
            <label>{props.label}</label>
            <div>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={manejarOnChange} />
            </div>
            {imagenBase64 ? <div>
                <div className={styles.div}>
                    <img src={imagenBase64} alt="imagen seleccionada" />
                </div>
            </div> : undefined}
            {imagenURL ? <div>
                <div className={styles.div}>
                    <img src={imagenURL} alt="imagen del actor" />
                </div>
            </div> : undefined}
        </div>
    )
}

interface SeleccionarImagenProps{
    label: string;
    imagenURL?: string;
    imagenSeleccionada: (file: File) => void;
}