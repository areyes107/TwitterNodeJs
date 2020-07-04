# TwitterNodeJs
Twitter created with NodeJs
# Instructions for Commands Use
```

-Modulo a accionar
    instrución de como se escribe en Postman
        ejemplo de uso

```
*********************************************
-Agregar Tweet: <br/>
    add_tweet [texto del tweet] <br/>
        add_tweet [hola mi nombre es Juan Pérez] <br/>
*********************************************
-Borrar Tweet <br/>
    delete_tweet idTweet <br/>
        delete_tweet 5effc4e908da401584c58ea4 <br/>
*********************************************
-Editar tweet <br/>
    edit_tweet idTweet [texto del tweet editado] <br/>
        edit_tweet 5effc4e908da401584c58ea4 [Hola, ahora me llamo Daniel Díaz] <br/>
*********************************************
-Ver los tweets de un usuario <br/>
    view_tweets username <br/>
        view_tweets jperez <br/>
*********************************************
-Seguir a alguién <br/>
    follow username <br/>
        follow jperez <br/>
*********************************************
-dejar de seguir a alguién <br/>
    unfollow username <br/>
        unfollow jperez <br/>
*********************************************
-Mostrar un perfil <br/>
    profile username <br/>
        profile jperez <br/>
*********************************************
-Registrar un usuario en twitter <br/>
    register [name or names] email username password <br/>
        register [Juan Pérez] jperez@gmail.com jperez 12345 <br/>
*********************************************
-Acceder con un usuario a twitter <br/>
    login username password <br/>
        login jperez 12345 <br/>
*********************************************