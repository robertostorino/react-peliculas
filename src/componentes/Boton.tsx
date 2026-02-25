export default function Boton(props: BotonProps){

    return (
        <button type={props.type ?? 'button'} 
            className={props.className ?? 'btn btn-primary'} 
            onClick={props.onClick}
            disabled={props.disabled ?? false}
        >
            {props.children}
        </button>
    )
}

interface BotonProps{
    children: React.ReactNode;
    onClick?(): void;
    type?: 'button' | 'submit' | 'reset',
    disabled?: boolean;
    className?: string;
}

// type={props.type ?? 'button'} 
//  -> significa que si no se especifica el tipo, entonces es tipo button

// En la interface: como agregué el tipo, ahora onClick?(): void; 
//  -> Indica que es opcional, ya que si es de tipo submit, el onClick no tiene nada que hacer.