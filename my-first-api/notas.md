# ENDPOINTS

[GET] http://localhost:3000/

Hello World

[GET] http://localhost:3000/users > Return all users

[GET] http://localhost:3000/users/1 > Return user with id 1 
[GET] http://localhost:3000/users/2 > Return user with id 2 
[GET] http://localhost:3000/users/34234asdasd > Return user with id 34234asdasd


[GET] http://localhost:3000/users/:id/profile > Return profile with specific id.

[GET] http://localhost:3000/users/:id/posts > Return posts with specific id

[POST] http://localhost:3000/users > Return the user created (201)

[DELETE] http://localhost:3000/users/:id > Return status user deleted (200)

[PUT] http://localhost:3000/users/:id > Return the user updated (200)

# DOCKER 

docker compose up -d  > inicia el servicio y libera la terminal
docker compose down > detiene el servicio
docker compose down -v  > detiene el servicio y remueve los volumenes de datos
docker compose ps  > lista de los servicios

# PROMPT
basado en @posts.service.ts y en @posts.controller.ts crea el CRUD para las categorias dentro del modulo @posts.module.ts esta es la estructura:

│   posts.module.ts
│   
├───controllers
│       posts.controller.spec.ts
│       posts.controller.ts
│       
├───dto
│       create-post.dto.ts
│       update-post.dto.ts
│       
├───entities
│       category.entity.ts
│       post.entity.ts
│       
└───services
        posts.service.spec.ts
        posts.service.ts
        