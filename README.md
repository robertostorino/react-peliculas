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

- StringLength -> Indica la longitud de la cadena.    
    
- Range -> Indica el rango de un valor (entre 0 y 100 por ej)

- CreditCard -> Valida el formato de una tarjeta de crédito.

- Compare -> Valida que dos propiedades sean iguales. Ej: Para comparar un campo de contraseña y otro de passwordRepeted.

- Phone -> Valida un formato de teléfono.

- RegularExpression

- Url -> Valida que el formato sea de una URL válida.

Ejemplo:

```c#

// Los {} son placeholder, 0 indica el nombre del campo y 1 el primer valor (en este caso el 10)

using System.ComponentModel.DataAnnotations;

namespace PeliculasAPI_vs.Entidades
{
    public class Genero
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(10, ErrorMessage = "El campo {0} debe tener {1} caracteres o menos")]
        public required string Nombre { get; set; }

        [Range(18, 120)]
        public int Edad {  get; set; }

        [CreditCard]
        public string? TarjetaDeCredito { get; set; } // Es opcional, porque puede no nos pasen un valor de trajeta válido.

        [Url]
        public string? Url { get; set; } // Es opcional, porque puede no nos pasen un valor de URL válido.
    }
}

```

NOTA: Por convención las clases que van a ser utilizadas como ATRIBUTO en C# terminan con la palabra **Attribute**

### Validaciones personalizadas - Por Atributo

1)  En la clase:

    ```c#
    using PeliculasAPI_vs.Validaciones;
    using System.ComponentModel.DataAnnotations;

    namespace PeliculasAPI_vs.Entidades
    {
        public class Genero
        {
            public int Id { get; set; }
            [Required(ErrorMessage = "El campo {0} es requerido")]
            [StringLength(10, ErrorMessage = "El campo {0} debe tener {1} caracteres o menos")]
            [PrimeraLetraMayuscula] // Al colocar [PrimeraLetraMayuscula] sobre la propiedad, entonces vinculo su valor con value de la validación
            public required string Nombre { get; set; }

        }
    }
    ```

2) En la carpeta de validaciones:

    ```c#
    using System.ComponentModel.DataAnnotations;

    namespace PeliculasAPI_vs.Validaciones
    {
        public class PrimeraLetraMayusculaAttribute: ValidationAttribute
        {
            protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
            {
                // IMPORTANTE: Al colocar [PrimeraLetraMayuscula] sobre la propiedad, entonces vinculo su valor con value 
                // Aquí dentro puedo realizar mi validación
                
                if (value is null || string.IsNullOrWhiteSpace(value.ToString()))
                {
                    return ValidationResult.Success;
                }

                var primeraLetra = value.ToString()![0].ToString(); // Toma el primer caracter, que es un char, y le hago el ToString para que sea un string.

                if (primeraLetra != primeraLetra.ToUpper()) 
                {
                    return new ValidationResult("La primera letra debe ser mayúscula");
                }

                return ValidationResult.Success;
            }
        }
    }

    ```

### Validaciones personalizadas - En el Controlador


1) En el Repository:

    ```c#
    // Pregunta si hay algún genero que coincida con el nombre dado.

    public bool Existe(string nombre)
    {
        return _generos.Any(g => g.Nombre == nombre);
    }
    ```


2) En el controller:


    ```C#
    [HttpPost]
    public IActionResult Post([FromBody] Genero genero)
    {
        // Con la librería FluentValidation nos ahorraríamos de hacer las siguientes 2 líneas en el controller.
        // FluentValidation -> Permite tener unas clases dedicadas para las validaciones de nuestros parámetros.
        // Por ej: Una clase dedicada a las validaciones de Genero.
        var repositorio = new RepositorioEnMemoria();
        var yaExisteUnGeneroConDichoNombre = repositorio.Existe(genero.Nombre);

        if (yaExisteUnGeneroConDichoNombre)
        {
            return BadRequest($"Ya existe un género con el nombre {genero.Nombre}");
        }

        return Ok();
    }
    ```

## Inyección de Dependencias

- Es normal separar responsabilidades entre diferentes clases.

- Cuando una clase A utiliza una clase B, decimos que la clase B es una **dependencia** de la clase A.

-  El **Acoplamiento** indica el nivel de **dependencias** entre clases.

    - **Acoplamiento Fuerte** -> Se caracteriza por una dependencia no flexible de otras clases.

        - Generalmente es malo.

        ej: Aquí la clase GenerosController (A) tiene una dependencia de la clase RepositorioEnMemoria (B) -> 
        
        A usa B, entonces GenerosController (A) depende de RepositorioEnMemoria (B).
        
        No hay forma de utilizar el método Get de **GenerosController** sin utilizar la clase **RepositorioEnMemoria**.

        ```c#
        [Route("api/generos")]
        [ApiController]
        public class GenerosController: ControllerBase
        {
            [HttpGet] // api/generos
            [HttpGet("listado")] // api/generos/listado
            [HttpGet("/listado-generos")] // listado-generos
            [OutputCache]
            public List<Genero> Get()
            {
                var repositorio = new RepositorioEnMemoria();
                var generos = repositorio.ObtenerTodosLosGeneros();
                return generos;
            }
        }
        ```

    - **Bajo Acoplamiento** (o Acoplamiento Débil) -> Ocurre cuando es fácil intercambiar dependencias.
        - Una de las formas de lograrlo mediante el uso de **Inyección de dependencias** y el Principio de Inversión de Dependencia.

        - **Inyección de Dependencia**: Es una técnica donde las dependencias de un objeto son suministradas por otro objeto.

        Ej:
        ```c#
        public class GenerosController: ControllerBase
        {
            // campo donde voy a guardar el repositorio
            private readonly RepositorioEnMemoria repositorio;

            // Constructor donde inyecto la dependencia RepositorioEnMemoria
            // Ahora la instancia que recibe viene de un objeto externo a GenerosController
            public GenerosController(RepositorioEnMemoria repositorio)
            {
                this.repositorio = repositorio;
            }
            
            [HttpGet] // api/generos
            [HttpGet("listado")] // api/generos/listado
            [HttpGet("/listado-generos")] // listado-generos
            [OutputCache]
            public List<Genero> Get()
            {
                //var repositorio = new RepositorioEnMemoria();
                var generos = repositorio.ObtenerTodosLosGeneros();
                return generos;
            }
        }
        
        ```

    Para que funcione debo configurar un **Servicio**

    En ASP.NET Core cuando hablamos de Servicios, nos referimos a que cuando solicitemos un tipo (por ejemplo el tipo "RepositorioEnMemoria") que nos sirva una "**instancia de dicha clase**".

    Los **Servicios** se encargan de construir las **dependencias** de nuestras clases.

    Para configurar el Servicio, debo ir a la clase **Program.cs**.


    ```c#
        var builder = WebApplication.CreateBuilder(args);

        // SECCIÓN SERVICIOS
        // INICIO

            // No importa el orden en que van los servicios, mientras que sea dentro de la sección Servicios.

            builder.Services.AddTransient<RepositorioEnMemoria>(); 
            // Indica que RepositorioEnMemoria debe ser construido
        
        // FIN

        var app = builder.Build();
    ```

### Principio de Inversión de Dependencias

Establece que mis clases deben depender de abstracciones y no de tipos concretos.

Y la clase repositorio es un tipo concreto... Para ello utilizaremos una **Interface**

- **Interface**: Es como un contrato, que cada clase que la implemente debe seguir.

- Por convención, las Interfaces en c# se escriben con letra "I"al principio y luego el nombre del repositorio. Ej: **IRepositorio**

- En la interface se describen las distintas acciones que un Repositorio de Generos puede hacer.

- La acción se llama Asignatura:

    (Conjunto de "Datos de Salida", "Nombre del Método" y "Parámetros de entrada")


ej:

```c#
using PeliculasAPI_vs.Entidades;

namespace PeliculasAPI_vs
{
    public interface IRepositorio
    {
        // Describe las distintas acciones que un Repositorio de Generos puede hacer

        // Esta es la Asignatura (Conjunto de "Datos de Salida", "Nombre del Método" y "Parámetros de entrada")
        List<Genero> ObtenerTodosLosGeneros();

        Task<Genero?> ObtenerPorId(int id);

        bool Existe(string nombre);
    }
}
```

Luego, para que se utilice, en RespositorioEnMemoria.cs debo indicar que **implementa** la interface **IRepositorio**.

```c#
public class RepositorioEnMemoria: IRepositorio
```

Luego en el Controller:

```c#
[Route("api/generos")]
[ApiController]
public class GenerosController: ControllerBase
{
    // campo donde voy a guardar el repositorio
    //private readonly RepositorioEnMemoria repositorio;
    private readonly IRepositorio repositorio;

    // Constructor donde inyecto la dependencia RepositorioEnMemoria
    // Ahora la instancia que recibe viene de un objeto externo a GenerosController
    
    //public GenerosController(RepositorioEnMemoria repositorio)
    //{
    //    this.repositorio = repositorio;
    //}

    // Ya la dependencia no será con el OBJETO CONCRETO RepositorioEnMemoria
    // Ahora dependerá de un TIPO ABSTRACTO que es la interface IRepositorio
    public GenerosController(IRepositorio repositorio)
    {
        this.repositorio = repositorio;
    }

    //
}
```

- Ya no tendrá dependencia de un **OBJETO CONCRETO** como es **RepositorioEnMemoria**.

- GenerosController ahora dependerá de un **TIPO ABSTRACTO** que es la interface **IRepostirio**.

- Por tanto, estoy siguiendo el **Principio de Inversión de Dependencia**.

- GeneroController no sabe ni le interesa la existencia de RepositorioEnMemoria.

- Ahora se logró una dependencia con **Bajo Acoplamiento**, porque hay Alta Flexibilidad.

Por último, debo modificar Program.cs:

```c#
var builder = WebApplication.CreateBuilder(args);

// SECCIÓN SERVICIOS
// INICIO

    // No importa el orden en que van los servicios, mientras que sea dentro de la sección Servicios.

    builder.Services.AddTransient<IRepositorio, RepositorioEnMemoria>(); 
    // Indica que RepositorioEnMemoria debe ser construido
    // Indica que si alguna clase le pide que inyecte un IRepositorio, entonces le sirva un RepositorioEnMemoria
    // IRepositorio -> El Servicio
    // RepositorioEnMemoria -> Implementación del servicio

// FIN

var app = builder.Build();
```

## Tiempo de Vida de Servicios

- Transient
    - Menor tiempo de vida.
    - Cada vez que se solicite una instancia de dicho servicio, esa instancia será totalmente nueva.
    - Se utiliza cuando no hay estado compartido. Cuando la clase no tiene campos que querramos compartir entre instancias.

- Scoped
    - Cuando se crea una única instancia por petición HTTP.
    - No importa cuantas veces se solicite el mismo servicio, siempre que sea dentro del mismo contexto HTTP será entregada la misma instancia de la clase.
    - Útil cuando quiero preservar estado dentro de la solicitud HTTP.

- Singleton
    - Se crea una única instancia del servicio durante la vida de la aplicación.
    - No importa cuántas veces se solicite el servicio, siempre se entregará la misma instancia aún sea a usuarios distintos.
    - Útil cuando quiero tener un estado global o caché, por ej.

Ejemplo

Creo la clase:

```c#
namespace PeliculasAPI_vs
{
    public class ServicioTransient
    {
        private readonly Guid _id;
        public ServicioTransient()
        {
            _id = Guid.NewGuid(); // Guid es un string aleatorio
        }

        public Guid ObtenerId => _id;
    }

    public class ServicioScoped
    {
        private readonly Guid _id;
        public ServicioScoped()
        {
            _id = Guid.NewGuid();
        }

        public Guid ObtenerId => _id;
    }

    public class ServicioSingleton
    {
        private readonly Guid _id;
        public ServicioSingleton()
        {
            _id = Guid.NewGuid();
        }

        public Guid ObtenerId => _id;
    }
}
```

Habilito en Program.cs:

```c#
builder.Services.AddTransient<ServicioTransient>();
builder.Services.AddScoped<ServicioScoped>();
builder.Services.AddSingleton<ServicioSingleton>();
```

Configuro en el Controller:

```c#
public class GenerosController: ControllerBase
{
    // Campos para Inyección de Dependencia
    private readonly IRepositorio repositorio;
    private readonly ServicioTransient transient1;
    private readonly ServicioTransient transient2;
    private readonly ServicioScoped scoped1;
    private readonly ServicioScoped scoped2;
    private readonly ServicioSingleton singleton;

    // Inyecto las dependencias
    public GenerosController(IRepositorio repositorio,
        ServicioTransient transient1,
        ServicioTransient transient2,
        ServicioScoped scoped1,
        ServicioScoped scoped2,
        ServicioSingleton singleton
        )
    {
        this.repositorio = repositorio;
        this.transient1 = transient1;
        this.transient2 = transient2;
        this.scoped1 = scoped1;
        this.scoped2 = scoped2;
        this.singleton = singleton;
    }

    // Acción que utiliza los nuevos servicios.
    [HttpGet("servicios-tiempos-de-vida")]
    public IActionResult GetServicioTiemposDeVida()
    {
        return Ok(new
        // con el new estoy creando un objeto anónimo
        {
            Transients = new { transient1 = transient1.ObtenerId, transient2 = transient2.ObtenerId },
            Scopeds = new { scroped1 = scoped1.ObtenerId, scoped2 = scoped2.ObtenerId },
            Singleton = singleton,
        });
    }
}
```

Al ejecutar el método desde la API se obtiene el siguiente JSON:
Primera vez:
```json
{
  "transients": {
    "transient1": "b33658da-a781-43a7-8674-477c193f22b8",
    "transient2": "45f6b7a8-a4df-4ace-8f75-52cfaa9c2b37"
  },
  "scopeds": {
    "scroped1": "38d8440d-13c5-42f2-bfd1-8b66130cf05d",
    "scoped2": "38d8440d-13c5-42f2-bfd1-8b66130cf05d"
  },
  "singleton": {
    "obtenerId": "9fef024c-d573-41f4-b6ef-396da032c994"
  }
}
```
La segunda vez:

```json
{
  "transients": {
    "transient1": "d0f95175-bfe7-474e-8250-da9d03c8afbd",
    "transient2": "004b3ff0-325f-49cd-9d68-7f1f06489513"
  },
  "scopeds": {
    "scroped1": "4041eb66-fdff-453b-afd4-f1b69501b10d",
    "scoped2": "4041eb66-fdff-453b-afd4-f1b69501b10d"
  },
  "singleton": {
    "obtenerId": "9fef024c-d573-41f4-b6ef-396da032c994"
  }
}
```
- **Transient**: El valor de transient1 y transient2 son distintos ya que son instancias distintas. Dichos valores vuelven a cambiar en la segunda petición HTTP.

- **Scoped**: En la misma petición HTTP tiene el mismo valor de instancia, en la segunda petición HTTP son diferentes a la primera pero iguales entre sí.

- **Singleton**: Devuelve el mismo valor mientras la aplicación esté activa.