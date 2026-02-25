import { useForm, type SubmitHandler } from "react-hook-form";
import type GeneroCreacion from "./modelos/GeneroCreacion.model";
import * as yup from "yup";
import { NavLink } from "react-router";
import Boton from "../../../componentes/Boton";
import { primeraLetraMayuscula } from "../../../validaciones/validaciones";
import { yupResolver } from "@hookform/resolvers/yup";


export default function FormularioGenero(props: FormularioGeneroProps){
    
    // register: me permite conectar el campo "nombre" de la interface con el input.
        //      => Importancia: cuando tenga un error, utilizo la conexión para mostrar los mensajes de error.
    
    // handleSubmit: maneja el posteo del formulario

    // formState: Maneja los estados del formulario

    const { register, 
            handleSubmit,
            formState: {errors, isValid, isSubmitting} 
                // El objeto errors me permite examinar si alguno de mis campos tiene errores.
                // El objeto isValid indica que el formulario está en estado válido
                // La variable isSubmitting indica que el formulario está siendo enviado. Útil para que por ejemplo no se envíe varias veces el mismo formulario.
                                    // isSubmitting = true cuando está en proceso de posteo del formulario.
                                    // isSubmitting = false cuando finaliza el posteo.
        } = useForm<GeneroCreacion>({
            resolver: yupResolver(reglasDeValidacion), //Hago la conexión de ReactHookForm con Yup mediante el resolver, y le indico que utilice las reglas de validación.
            mode: 'onChange', // Realiza la validación cuando cambie el valor de un elemento. Inmediatamente que edite un control se realiza la validación
            defaultValues: props.modelo ?? {nombre: ''} // Valores por defecto. Si viene el modelo devuelvo el valor, caso contrario nombre en vacío
        });
    
    return(
        <>
            <form onSubmit={handleSubmit(props.onSubmit)}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input autoComplete="off" className="form-control" {...register('nombre')} />
                    {errors.nombre && <p className="error">{errors.nombre.message}</p>}
                </div>
                <div className="mt-2">
                    <Boton type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? 'Enviando...' : 'Enviar'}</Boton>
                    <NavLink to="/generos" className="btn btn-secondary ms-2">Cancelar</NavLink>
                </div>
            </form>
        </>
    )
}

interface FormularioGeneroProps{
    modelo?: GeneroCreacion; //Es opcional, ya que vendrá de parte del componente PADRE cuando estoy en modo edición. En modo creación dicho modelo no va a llegar
    onSubmit: SubmitHandler<GeneroCreacion>
}

// Reglas de Validación de YUP
const reglasDeValidacion = yup.object({
    nombre: yup.string().required('El nombre es obligatorio').test(primeraLetraMayuscula())
})