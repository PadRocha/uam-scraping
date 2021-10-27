# UAM Scraping Schedule.

by Cétr!co.Productions

[TOC]

## System Features

### Scripts

```
npm start
```

Iniciar Servidor.

```
npm run dev
```

Iniciar Servidor en development.

```
npm build
```

Compilar código.

## Usage

Para el funcionamiento de este código se necesita un http request como [Postman](https://www.postman.com/) o alguno [online](https://reqbin.com/post-online). El proceso puede demorar aproximadamente de tres a cinco mínutos dependiendo de la conexión a internet.

### Authorization

Como el proceso incluye loggearse a la página de la UAM requiere de el usuario y contraseña, por lo tanto, cada vez que vea {{USER}} & {{PASS}} será la indicación para que los remplace por los respectivos campos.

> Es de vital importancia remarcar que pueden revisar el código antes de su uso para verificar que sus datos jamás son almacenados.

### Get UEA´s

Example:

```http
http://localhost:5885/api/ueas/{{USER}}/{{PASS}}
```

Response example:

```json
{
    "ueas": [
        {
            "key": "1111081",
            "name": "Dinámica del Cuerpo Rígido"
        },
        {
            "key": "1111092",
            "name": "Laboratorio de Movimiento de una Partícula"
        }
        ...
    ]
}
```

La respuesta trae todas las materias que está marcadas como *uea_disponible* y saber que materias están disponibles

### Get Schedules

Example:

```http
http://localhost:5885/api/schedule/{{USER}}/{{PASS}}
```

Body JSON data

**ueas** property

```json
{
    "ueas": [
        {
            "key": "1111081",
            "name": "Dinámica del Cuerpo Rígido"
        },
        {
            "key": "1111092",
            "name": "Laboratorio de Movimiento de una Partícula"
        }
        ...
    ],
    ...
}
```

Usando el método anterior puede especificar qué materias de las que el horario esté compuesto, por default traerá todas las uea y tratará de armar un horario con todas ellas.

**queryTeachers** property

```json
{
    ...
    "queryTeachers": [
        "NOMBRE DE MAESTRO QUE IMPARTE UNA MATERIA",
        ...
    ],
    ...
}
```

Se puede especificar que maestros deseamos poder ver dentro de los horarios posibles, en caso de encontrar un horario que no incluya este maestro, no lo mostrará, por default enseñará todos los posibles

> Puede darse el caso que el maestro buscado de como resultado un horario vacío, por distintos factores

**skip** property

```json
{
    ...
    "skip": 1,
    ...
}
```

Se puede usar para pasar elementos dentro de la respuesta, por default no pasará ni un elemento.

**limit** property

```json
{
    ...
    "limit": 1
}
```

Se puede usar para limitar el número de horarios que se retornan, por default traerá todos los listados.

Response example:

```json
[
    {
        "SCHEDULECODE": "CTG81CÁLRALLINMPOCTG09LABULAENREDOCSI01LABTOSOSCARACCB81MATTASALENIKCSI01PROTOSJOSLEZCTG85TERICAJULRES000000",
        "schedule": [
            [
                "Cálculo Integral",
                {
                    "teacher": {
                        "name": "NOMBRE DE MAESTRO QUE IMPARTE UNA MATERIA",
                        "quality": 8.9,
                        "takeAgain": 89,
                        "difficulty": 4.5,
                        "students": 175
                    },
                    "group": "CTG81",
                    "monday": {
                        "starts": 16,
                        "ends": 17.3
                    },
                    "tuesday": {
                        "starts": 16,
                        "ends": 17.3
                    },
                    "wednesday": {
                        "starts": 16,
                        "ends": 17.3
                    },
                    "thursday": null,
                    "friday": {
                        "starts": 16,
                        "ends": 17.3
                    }
                }
            ],
            ...
    },
    ...
}
```

## Error Timeout

Es probable que por una mala conexión el programa colapse, debido a que en el proceso de extracción de información no se logró cargar a tiempo algo, una solución ante este problema es extender el tiempo de espera en el timeout, dentro del proyecto hay una carpeta llamada *src* donde existe un archivo llamado *config.ts*.

```typescript
export const config = {
    ...
    TIMEOUT: 5_000,
    ...
} as const;
```

Dependiendo de su conexión de internet se recomienda aumentar el tiempo de espera, con consecuencia que el proceso demorará más tiempo en finalizarse.
