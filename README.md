# React + TypeScript + Vite

- Bootstrap v5.3.6: Estilos                                 npm i bootstrap@5.3.6
- ReactRouter :     Navegación                              npm i react-router@7.5.2
- ReactHookForm :   Formularios                             npm i react-hook-form@7.56.1
- - Yup :             Validaciones                            npm i yup@1.6.1
- - Resolvers:        Ayuda a conectar ReactHookForm con Yup  npm i @hookform/resolvers@5.0.1
- Leaflet:          Mapas       npm i leaflet@1.9.4 react-leaflet@5.0.0
- - Facilitador de Leaftlet para typescript en desarrollo: npm i -D @types/leaflet@1.9.17
- Typeahead:    Sugiere completado de campos                npm i react-bootstrap-typeahead@6.4.1



- useNavigate -> ReactRouter hook para navegar
- useParams -> ReactHook para obtener el parámetro de la URL


# .NET

- ENTIDAD: Es una Clase que representa un Tabla en la Base de Datos.
- ACCIÓN: Una acción es un método de un controlador que se ejecuta en respuesta a una petición HTTP realizada a nuesto Web API.
- ENDPOINT: También se le puede llamar Endpoint a las Acciones.
- CONTROLADOR: Un Controller es una clase que agrupa un conjunto de acciones, generalmente relacionadas a un recurso.
    - Nomenclatura: Nombre + Controller. Ej: GenerosController
    - Los controladores normalmente se colocan en una carpeta llamada Controllers

- Reglas de Ruteo: Son mecanísmos que nos permiten mapear una URL con una Acción.
    - Se pueden configurar en dos lugares:
    1) En los Controladores (ruteo por atributo)
       - El atributo Route nos permite indicar la base del endpoint de las acciones del controlador 
       
            Ej: [Route("api/generos")]

       - Si deseo diferenciar una ruta que tenga un parámetro: 

            Ej: [HttpGet("{id}")] // api/generos/500

       - Si deseo, puedo tener varias rutas para la misma acción:

            [HttpGet] // api/generos

            [HttpGet("listado")]  // api/generos/listado

        - Si deseo omitir el [Route("api/generos")] entonces:

            [HttpGet("/listado-generos")]  // listado-generos

        - Cargar valores de atributo por defecto. 
            Si no paso el valor al nombre, entonces el valor por defecto será Roberto:

            [HttpGet("{id}/{nombre?}")] // api/generos/500

            public Genero? Get(int id, string nombre = "Roberto")

    2) En la Clase Program (ruteo convencional)

## Tipos de Datos que Retorna una Acción
1) Tipo específico
2) ActionResult<T>
3) IActionResult

- ActionResult: Es una clase que representa todos los tipos de dato que pueden ser devueltos devueltos desde una acción.
Es el resultado de ejecutar una acción.

    - Si tengo una acción que siempre retornará un JSON, podría usar "JsonResult".
    
        - NOTA: En el caso de WebAPI esto no es necesario, ya que por defecto todo lo que retornemos será en formato JSON.

    - Es más común utilizar ActionResult<T> y IActionResult

1) Retorno de Tipo específico

    ```c#
    [HttpGet("{id:int}")]
    public Genero? Get(int id)
    {
        return repositorio.ObtenerPorId(id);
    }
    ```
    Podemos retornar cualquier tipo de dato (int, string, clase, etc).

    Desventaja: Perdemos flexibilidad.

    Ej: En este caso, busco un género por su Id y si el género no existe me gustaría retornar un 404 No Encontrado. Pero no lo puedo hacer ya que el tipo de dato de retorno es un Género, no un 404.

2) ActionResult<T>

    Soluciona el problema anterior, ya que nos permite retornar un tipo específico T ó un ActionResult.

    ```c#
    [HttpGet("{id:int}")]
    public ActionResult<Genero> Get(int id)
    {
        var genero = repositorio.ObtenerPorId(id);

        if (genero is null)
        {
            return NotFound();
        }

        return genero;
    }
    ```

    - NotFound() es un estado que hereda de la clase NotFoundResult, que hereda de ActionResult, con el código = 404.


3) IActionResult

    Es similar a IActionResult<T>, solo que ahora únicamente permite retornar ActionResult.

     ```c#
    [HttpGet("{id:int}")]
    public IActionResult Get(int id)
    {
        var genero = repositorio.ObtenerPorId(id);

        if (genero is null)
        {
            return NotFound();
        }

        return OK(genero);
    }
    ```

    - Si quiero devolver un tipo específico de una acción que devuelve IActionResult, debo utilizar la función OK, una respuesta exitosa.

    IMPORTANTE: 
    -   En general, ActionResult<T> reemplaza a IActionResult en casi todos los casos.
    
    -   En versiones antigüas de .NET se usaba IActionResult, porque ActionResult<T> no existía.

    -   En WebAPI se usa ActionResult<T>

    -   En MVC puede ser cual quiera.

## ControllerBase debe ser la clase madre de todos los controladores.

- Al hacer que nuestro controller herede de ControllerBase, tenemos acceso a métodos auxiliares que nos simplificarán al trabajar con WebAPI. Permite por ejemplo utilizar NotFound y otros status code.

## Programación Asíncrona

Evito que mi aplicación se quede inmóvil esperando un resultado.

- Son ideales cuando:
  - Utilizamos una base de datos.
  - Hacemos operaciones con otros Web Services (operaciones I/O)

```c#
// Método Asíncrono
// Debe tener:
//   async
//   Envolver el tipo con un Task<>, lo cuál indica que este método devolverá un valor en el futuro.

public async Task<Genero?> ObtenerPorId(int id)
{
    await Task.Delay(TimeSpan.FromSeconds(3)); 
    // Espera asíncronamente 3 segundos, es decir sigue haciendo otras cosas mientras
    
    return _generos.FirstOrDefault(g => g.Id == id);
}
```
```c#
[HttpGet("{id:int}")] // api/generos/500
public async Task<ActionResult<Genero>> Get(int id) // No hace falta Genero?, ya que si es Nulo devuelvo un 404 (Not Found), sino devuelvo el genero.
{
    var repositorio = new RepositorioEnMemoria();
    var genero = await repositorio.ObtenerPorId(id);

    if (genero is null) 
    {
        return NotFound();
    }
    return genero;
}
```
Observación si tengo un método void entonces será:

```c#
// Será Task no Task<void>
private async Task LoguearEnConsola()
{
    // await logueamos en la consola
}
```

## Caché

- Output Caché


    Es una funcionalidad de caché de ASP.NET Core que permite guardar en caché la respuesta de una acción.

    Es decir, que apartir de la segunda consulta y mientras esté en caché, va a responder con el valor almacenado sin necesidad de ir a buscarlo al repositorio.

    Para habilitarlo:

    1) En Program.cs

        a-  Agregar antes de var app:

        ```c#
        //Habilita Output Caché
        builder.Services.AddOutputCache(opciones =>
        {
            opciones.DefaultExpirationTimeSpan = TimeSpan.FromSeconds(15); // Tiempo para que se refresque el Caché
        });
        ```

        b-  Agregar antes de app.UseAuthorization();

    ```c#
    app.UseOutputCache();
    ```

    2) En el Controller en el método que deseo, debo agregar [OutputCache]

    ej:

    ```c#
    [HttpGet("{id:int}")] // api/generos/500
    [OutputCache]
    public async Task<ActionResult<Genero>> Get(int id) // No hace falta Genero?, ya que si es Nulo devuelvo un 404 (Not Found), sino devuelvo el genero.
    {
        var repositorio = new RepositorioEnMemoria();
        var genero = await repositorio.ObtenerPorId(id); //Cuando tengo el valor almacenado en caché y aún no se ha refrezcado, entonces las próximas consultas de ese valor los busca en caché y no utiliza el repository

        if (genero is null) 
        {
            return NotFound();
        }
        return genero;
    }
    ```

## Middleware

Una solicitud HTTP llega a nuestro WebAPI y pasa por un PIPELINE de solicitudes HTTP.

- Un ***pipe*** es una cadena de procesos conectados de tal manera que la salida de cada elemento de la cadena es la entrada del siguiente.

- El ***Pipeline*** de solicitudes es el conjunto de procesos conectados que reciben una solicitud HTTP y la procesan para dar algún tipo de resultado.

- Uno de esos procesos es el proceso de controladores, que es donde se manejan los controladores y las acciones.

- Llamamos **MIDDLEWARE** a cada proceso del pipeline.

- Middleware importante:

    - Autorización:
        
        Permite la funcionalidad de denegar el acceso a un recurso, dependiendo de si el usuario tiene permiso para acceder a este.

- **IMPORTANTE**: El orden de los procesos en nuestro pipeline es relevante.


Los Middleware se configuran en Program.cs, por debajo de var app = builder.Build();


```c#
// IMPORTANTE: Los Services van ANTES del var app
var app = builder.Build();

// Comienzo de los middleware

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

// Final de los middleware

// Para ejecutar la aplicación
app.Run();
```

## Model Binding

-   Permite mapear datos de una petición HTTP a parámetros de una acción.

-   El valor indicado en la regla de ruteo es un ejemplo de **valor de ruta** (route value).

```
[HttpGet("{Id:int}")]
```

- Otras Fuentes de Parámetros

    - Query Strings   (En la URL)
    - Valores de Formulario (Vienen en el cuerpo de una solicitud)
    - El cuerpo de la solicitud en formato JSON

- Query Strings

    - Son pares de nombres y valores que vemos en URL, precedidos por un **?** y los valores los separo con **&**

        ej: api/generos?id=5&apellido=Roberts

- Valores de Formulario

    - Utilizamos FromFrom para indicar que quiero utilizar valores de formulario.

    ej: 
    ```c#
    public async Task<IActionResult> Post([FromForm] Genero genero)
    ```

- Cuerpo de la Petición (Body of Request)

    - Información extra que se envía con la petición que no se coloca en la URL.


Ejemplo

-   Valores en URL    
      
    Si mi método es:
    ```c#
    [HttpPost]
    public void Post(Genero genero)
    {

    }
    ```
    En la URL se enviarán los valores de los campos:
    ```
    https://localhost:7182/api/generos?Id=1&Nombre=Comedia
    ```

- Valores a través del cuerpo de la petición HTTP (Request Body)

    ```c#
    [HttpPost]
    public void Post([FromBody] Genero genero)
    {

    }
    ```

    Los valores ya no estarán en la URL sino en la Request Body.

    ```
    https://localhost:7182/api/generos
    ```

## Vallidando Modelos

-   Para utilizar las validaciones de manera automática, debo ir al controller y agregar el DataAnnotations **[ApiController]**

    ```c#
    [Route("api/generos")]
    [ApiController]
    public class GenerosController: ControllerBase
    ```

- En la entidad, debo escribir la propiedad required y a su vez la agregarle la etiqueta Required:

    ```c#
    using System.ComponentModel.DataAnnotations;

    namespace PeliculasAPI_vs.Entidades
    {
        public class Genero
        {
            public int Id { get; set; }
            [Required]
            public required string Nombre { get; set; }
        }
    }
    ```

    -   El required de la propiedad, es una característica de C# y nos impide crear un Genero sin su Nombre. Pero solo a nivel de código de C#.

            Me impide instanciar un Genero sin Nombre en el código.

    
    - El atributo Required, es una regla de validación de ASP.NET Core. 
    
            Si no se cumple, entonces ni siquiera entra a la acción y se devuelve un status 400.
        
        Si deseo personalizar el mensaje de error:

        ```c#
        public int Id { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public required string Nombre { get; set; }
        ```
        {0} es un placeholder que devolverá el nombre del campo, en este caso Nombre.

## Validación por Atributos

- StringLength

- Range

- CreditCard