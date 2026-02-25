export default interface ActorCreacion{
    nombre: string;
    fechaNacimiento: string;    // Por cuestiones prácticas en el front lo trato como string, pero luego en el back lo trataré como tipo fecha.
    foto?: File | string;
}