# Duckface

Carlos Riera CI 18.004.591

Base de datos: MongoDb

1) Crear un usuario con username 'admin', este tendrá acceso a todas las rutas.
2) Hacer POST a /login para recibir el token.
3) A todas las rutas que tengan la estrategia bearer pasarle el token en la cabecera.

Ejemplo en Postman:

header: Authorization
value: bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImFkbWluIg.vnnd88p63cjF8zdhHJuk4Zc4X6-V50QCjjpYOVKvpCY