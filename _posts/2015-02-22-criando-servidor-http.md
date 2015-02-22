---
layout: post
title: Criando um servidor Http e rotas simples com Node.js
date: 2015-02-22 09:38:24
tags: [nodejs]
description: Hoje vou mostrar a vocês a como criar um servidor Http com node.js para exibir um *html*, vou ensinar isso a vocês pois nas próximas postagens vamos criar algumas paginas html que vão se comunicar com o Arduino via node.js, então se preparem!
image:
  feature: background-2.jpg
---
Hoje vou mostrar a vocês a como criar um servidor Http com node.js para exibir um *html*, vou ensinar isso a vocês pois nas próximas postagens vamos criar algumas paginas html que vão se comunicar com o Arduino via node.js, então se preparem!

Antes de tudo, vamos criar uma pasta aonde guardaremos o nosso projeto http, feito isso crie um arquivo com o nome de **app.js**, abra ele com seu editor favorito e vamos aos códigos!

Primeiramente vamos definir o modulo **http**, que não precisamos instalar ele pelo *npm* pois o node.js já tem ele nativamente! então basta vc fazer o *require*:

{% highlight javascript %}
var http = require("http");
{% endhighlight %}

Para carregar o nosso arquivo html (que ainda vamos criar!) vamos usar um outro modulo nativo do Node.js chamado **FS** ([File System](http://nodejs.org/api/fs.html)), então vamos chamalo:

{% highlight javascript %}
var fs = require("fs");
{% endhighlight %}

feito isso vamos criar uma função que vai ser o nosso servidor http:

{% highlight javascript %}
function servidor(requisicao. resposta){
  //código a seguir vai aqui dentro
}
{% endhighlight %}

Toda vez que um navegador acessa nossa pagina é essa função que vai dizer o que fazer, para isso passamos o parâmetro **requisicao** e **resposta** a requisição é o pedido do navegador ao nosso servidor (por assim dizer) e a resposta é o que vamos responder ao navegador como no exemplo vamos responder com uma pagina html que vamos criar.
Dentro dessa função precisamos primeiramente responder ao navegador que recebemos a requisição para isso:

{% highlight javascript %}
resposta.writeHead(200);
{% endhighlight %}

o numero *200* é um código de status do http, que responde ao navegador que recebemos a requisição (você pode ver mais códigos aqui: http://httpstatus.es/)
Feito isso precisamos responder ao navegador algum texto, html etc, no caso vamos responder um html, e para responder vamos usar o **.end** e passando junto o html para isso:

{% highlight javascript %}
resposta.end(fs.readFileSync("view/index.html"));
{% endhighlight %}

Então definimos o **.end** na resposta e dentro dela usamos o modulo **FS** para carregar nosso html (não vou dar muito foco ao modulo **FS**, mas caso vocês queiram aprender mais sobre ele recomendo essa postagem: [Node.js para leigos - Utilizando API File System](http://udgwebdev.com/node-js-para-leigos-utilizando-api-file-system/)).
Com isso nossa função Servidor esta pronta, agora precisamos definir a porta e iniciar o servidor http, para isso existe o **.listen**, vejamos como usar:

{% highlight javascript %}
http.listen(4000, function(){
  console.log("Servidor Online");
});
{% endhighlight %}

Definimos dentro de *listen* a porta **4000** e uma função para exibir no console a mensagem: *"Servidor Online"*

O **app.js** deverá ficar assim:

{% highlight javascript %}
var http = require('http').createServer(servidor);
var fs = require('fs');

function servidor(requisicao, resposta){
    resposta.writeHead(200);
    resposta.end(fs.readFileSync('view/index.html'));
};

http.listen(4000, function(){
  console.log("Servidor On-line");
});
{% endhighlight %}

Feito isso nosso **app.js** está pronto, vamos agora criar uma pasta com o nome de *view* dentro do diretório do nosso projeto para guardar nosso html e ficar mais organizado, criada a pasta crie o arquivo **index.html**, nele vamos escrever a estrutura básica de todo html:

{% highlight html %}
<html>
  <head>
    <title>Ola Mundo</title>
  </head>
  <body>
    <h1>Ola Mundo :)</h1>
  </body>
</html>
{% endhighlight %}

Aonde apenas defini o Titulo da pagina (title) e criei um **h1** para mostrar a mensagem: *Ola Mundo :)* criado o arquivo abra o seu **terminal** ou **prompt de comando** e execute o arquivo app.js:

    node app.js

Espere a mensagem *"Servidor Online"* aparecer, em seguida abra seu navegador e digite: http://localhost:4000/ deverá aparecer o html com a mensagem *"Ola Mundo :)"*

Isso acima é o básico para se criar um servidor http, para criar Rotas que é algo que será útil para a gente futuramente também é simples veja:

Dentro da função *servidor* vamos criar uma variável *url* que vai guardar em que url o navegador está requisitando:

{% highlight javascript %}
var url = requisicao.url;
{% endhighlight %}

Agora precisamos criar IFs para determinar as rotas e oque o node.js deve fazer para cada uma, então:

{% highlight javascript %}
var url = requisicao.url;

if(url == '/'){
  resposta.writeHead(200);
  resposta.end(fs.readFileSync('view/index.html'));
}else if(url == '/contatos'){
  resposta.writeHead(200);
  resposta.end("<h1>Pagina Contatos</h1>");
}else{
	resposta.writeHead(200);
  resposta.end("<h1>Error 404, Nada encontrado</h1>");
}
{% endhighlight %}

Então fizemos assim:

 - Se o usuário acessar "/" ou seja a index do nosso servidor mandamos o *"index.html"*
 - Se ele acessar "/contatos" vai ser enviado apenas um *h1* informando *"Pagina Contatos"* (mas pode ser enviado um html da mesma forma que fizemos na index! )
 - Caso ele acesse alguma url não definida é mostrado um *h1* informando: *Error 404, Nada encontrado"*

Fica assim o **app.js**:

{% highlight javascript %}
var http = require('http').createServer(servidor);
var fs = require('fs');

function servidor(requisicao, resposta){
  var url = requisicao.url;
  if(url == '/'){
    resposta.writeHead(200);
    resposta.end(fs.readFileSync('view/index.html'));
  }else if(url == '/ajuda'){
    resposta.writeHead(200);
    resposta.end("<h1>Ajuda</h1>");
  }else{
    resposta.writeHead(200);
    resposta.end("<h1>Error: 404, nada encontrado</h1>");
  }
};

http.listen(3000, function(){
  console.log("Servidor On-line");
});
{% endhighlight %}

Agora para vermos essa maravilha funcionando abra seu **terminal** ou **prompt de comando** e:

    node app.js

Abra seu navegador e acesse: http://localhost:4000/ e vai testando as rotas.
Por enquanto é só isso, você pode criar quantas rotas quiser, mas futuramente vou mostrar um modulo que faz o gerenciamento das rotas de forma mais simples e organizada, vejo vocês na próxima.
