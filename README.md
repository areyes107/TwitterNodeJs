# TwitterNodeJs
Twitter created with NodeJs
# Instructions for Commands Use
```

-Modulo a accionar
    instrución de como se escribe en Postman
        ejemplo de uso

```
*********************************************
-Agregar Tweet:
    add_tweet [texto del tweet]
        add_tweet [hola mi nombre es Juan Pérez]
*********************************************
-Borrar Tweet
    delete_tweet idTweet
        delete_tweet 5effc4e908da401584c58ea4
*********************************************
-Editar tweet
    edit_tweet idTweet [texto del tweet editado]
        edit_tweet 5effc4e908da401584c58ea4 [Hola, ahora me llamo Daniel Díaz]
*********************************************
-Ver los tweets de un usuario
    view_tweets username
        view_tweets jperez
*********************************************
-Seguir a alguién
    follow username
        follow jperez
*********************************************
-dejar de seguir a alguién
    unfollow username
        unfollow jperez
*********************************************
-Mostrar un perfil
    profile username
        profile jperez
*********************************************
-Registrar un usuario en twitter
    register [name or names] email username password
        register [Juan Pérez] jperez@gmail.com jperez 12345
*********************************************
-Acceder con un usuario a twitter
    login username password
        login jperez 12345
*********************************************