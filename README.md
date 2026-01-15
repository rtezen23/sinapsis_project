# Prueba Técnica: Analista de Plataformas - Sinapsis

## 1. Objetivo del Proyecto

El objetivo de este proyecto es desarrollar una API en NodeJS que gestione y procese datos de campañas de marketing por SMS, interactuando con una base de datos MySQL. La API debe proveer endpoints para realizar cálculos sobre las campañas, actualizar sus estados y generar reportes de clientes.

## 2. Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para la construcción de la API.
- **Prisma**: ORM para la interacción con la base de datos MySQL.
- **MySQL**: Sistema de gestión de bases de datos relacional.

## 3. Modelo de Datos

El sistema se basa en una base de datos relacional en MySQL con la siguiente estructura:

- `customers`: Almacena los clientes del sistema.
- `users`: Usuarios asociados a un cliente.
- `campaigns`: Campañas de marketing creadas por los usuarios.
- `messages`: Mensajes individuales que componen una campaña.

### Diagrama de Relaciones (ERD)

La relación entre las tablas es jerárquica:

```
customers (1) ---< users (1) ---< campaigns (1) ---< messages
```

![Diagrama ERD](https://i.postimg.cc/0jkY9yG3/erd-sinapsis-challenge.png)

- Un `customer` tiene uno o varios `users`.
- Un `user` crea una o más `campaigns`.
- Una `campaign` contiene uno o más `messages`.

## 4. Configuración del Entorno

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### Prerrequisitos

- Node.js (versión 16 o superior)
- Un servidor de base de datos MySQL o compatible (ej. MariaDB).

### Pasos

1. **Clonar el Repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. **Instalar Dependencias**
   ```bash
   npm install
   ```

3. **Configurar la Base de Datos**
   - Crea una base de datos en tu servidor MySQL.
   - Restaura el backup proporcionado en el archivo `db.sql`. Puedes usar un cliente de MySQL como DBeaver, DataGrip o la línea de comandos:
     ```bash
     mysql -u tu_usuario -p tu_base_de_datos < db.sql
     ```

4. **Variables de Entorno**
   - Crea un archivo `.env` en la raíz del proyecto, basándote en el archivo `.env.example` (si existe) o añadiendo las siguientes variables:
   ```env
   # Configuración de la Base de Datos
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

   # Puerto para el servidor
   PORT=3000
   ```
   - Asegúrate de reemplazar `USER`, `PASSWORD`, `HOST`, `PORT` y `DATABASE` con tus credenciales.

5. **Ejecutar las migraciones de Prisma**
   ```bash
   npx prisma generate
   ```

6. **Ejecutar el Servidor**
   ```bash
   npm start
   ```
   El servidor se iniciará en el puerto especificado (por defecto, `http://localhost:3000`).

## 5. Descripción de la API (Endpoints)

A continuación se detallan los endpoints a desarrollar:

### Módulo de Campañas

#### 1. Calcular Totales de Campaña

- **Método**: `PUT`
- **URL**: `/api/v1/campaigns/:id/calculate-totals`
- **Descripción**: Recalcula y actualiza los totales (`total_records`, `total_sent`, `total_error`) para la campaña con el `id` especificado.
- **Respuesta Exitosa (200 OK)**:
    ```json
    {
      "message": "Totales de campaña actualizados",
      "data": {
        "id": 1,
        "total_records": 100,
        "total_sent": 95,
        "total_error": 5
      }
    }
    ```
- **Respuesta de Error (404 Not Found)**:
    ```json
    {
        "message": "Campaña no encontrada"
    }
    ```

#### 2. Actualizar Estado de Campaña

- **Método**: `PUT`
- **URL**: `/api/v1/campaigns/:id/calculate-status`
- **Descripción**: Verifica los mensajes de la campaña y actualiza su `process_status` y, si corresponde, `final_hour`.
- **Respuesta Exitosa (200 OK)**:
    ```json
    {
        "message": "Status de campaña actualizado",
        "data": {
            "id": 1,
            "total_records": 100,
            "total_sent": 95,
            "total_error": 5,
            "process_status": 2,
            "final_hour": "18:30:00"
        }
    }
    ```
- **Respuesta de Error (404 Not Found)**:
    ```json
    {
        "message": "Campaña no encontrada"
    }
    ```

### Módulo de Clientes

#### 3. Reporte de Mensajes por Cliente

- **Método**: `GET`
- **URL**: `/api/v1/customers/messages-report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Descripción**: Retorna una lista de clientes y su total de mensajes enviados con éxito en el rango de fechas proporcionado.
- **Parámetros de Consulta**:
    -   `startDate` (requerido): Fecha de inicio del reporte (formato `YYYY-MM-DD`).
    -   `endDate` (requerido): Fecha de fin del reporte (formato `YYYY-MM-DD`).
- **Respuesta Exitosa (200 OK)**:
    ```json
    [
      {
        "customerId": 1,
        "customerName": "Cliente A",
        "total_sent": 1520
      },
      {
        "customerId": 2,
        "customerName": "Cliente B",
        "total_sent": 875
      }
    ]
    ```
- **Respuesta de Error (400 Bad Request)**:
    ```json
    {
        "error": "Fecha inicial y final son requeridos"
    }
    ```
    ```json
    {
        "error": "Formato de fecha inválido"
    }
    ```
