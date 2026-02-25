import type Pelicula from "../modelos/pelicula.model";
import styles from './PeliculaIndividual.module.css';

export default function PeliculaIndividual (props: PeliculaIndividualProps) {
    
    const construirLink = () => `/pelicula/${props.pelicula.id}`;

    return(
        <div className={styles.div}>
            <a href={construirLink()}>
                <img alt="Poster" src={props.pelicula.poster} />
            </a>
            <p>
                <a href={construirLink()}>{props.pelicula.titulo}</a>
            </p>
        </div>
    )
}

interface PeliculaIndividualProps{
    pelicula: Pelicula;
}

// Estoy utilizando anchors <a> ya que deseo que cuando el usuario haga click me lleve a una página donde se muestre el detalle de la película.