# TwitterNodeJs
Twitter created with NodeJs
# Instructions for Commands Use
```

-Módulo a accionar
    >instrución de como se escribe en Postman
        >ejemplo de uso

```
*********************************************
-Agregar Tweet: <br/>
    >add_tweet [texto del tweet] <br/>
        >add_tweet [hola mi nombre es Juan Pérez] <br/>
*********************************************
-Borrar Tweet <br/>
    >delete_tweet idTweet <br/>
        >delete_tweet 5effc4e908da401584c58ea4 <br/>
*********************************************
-Editar tweet <br/>
    >edit_tweet idTweet [texto del tweet editado] <br/>
        >edit_tweet 5effc4e908da401584c58ea4 [Hola, ahora me llamo Daniel Díaz] <br/>
*********************************************
-Ver los tweets de un usuario <br/>
    >view_tweets username <br/>
        >view_tweets jperez <br/>
*********************************************
-Seguir a alguién <br/>
    >follow username <br/>
        >follow jperez <br/>
*********************************************
-Dejar de seguir a alguién <br/>
    >unfollow username <br/>
       >unfollow jperez <br/>
*********************************************
-Mostrar un perfil <br/>
    >profile username <br/>
        >profile jperez <br/>
*********************************************
-Registrar un usuario en twitter <br/>
    >register [name or names] email username password <br/>
        >register [Juan Pérez] jperez@gmail.com jperez 12345 <br/>
*********************************************
-Acceder con un usuario a twitter <br/>
    >login username password <br/>
        >login jperez 12345 <br/>
*********************************************
-Like Tweet <br/>
    >like_tweet id <br/>
        >like_tweet 5f3613c055017f37d440e00d <br/>
*********************************************
-Dislike Tweet (tiene la facilidad de que se puede ejecutar este comando usando Like_tweet, ya que así si se <br/>
le quiere dar dislike a un tweet que no tiene like, esto automáticamente provoca que se de un like) <br/>
    >like_tweet id <br/>
        >like_tweet 5f3613c055017f37d440e00d <br/>
*********************************************
-Responder Tweet <br/>
    >reply_tweet id [`never empty`] <br/>
        >reply_tweet 5f3613c055017f37d440e00d [Me parece perfecto tu tweet] <br/>
*********************************************
-Retweet <br/>
    >retweet id [`never empty`] <br/>
        >retweet 5f3613c055017f37d440e00d [chequen este tweet, tiene buena información] <br/>
*********************************************
-Ver los tweets de un usuario (`UPDATED`)<br/>
    >view_tweets username <br/>
        >view_tweets jperez <br/>
*********************************************