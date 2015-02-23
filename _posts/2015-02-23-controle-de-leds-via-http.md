---
layout: post
title: Controlando Leds via pagina web utilizando Node.js e Arduíno
date: 2015-02-23 09:24:14
tags: [nodejs, arduino]
description:
image:
  feature: arduino.jpg
---
Vamos hoje criar uma pagina html aonde terá botôes que quando clicados vão acender e apagar leds ligados ao Arduíno utilizando Node.js.

Vamos enviar para o Arduíno o exemplo **StandardFirmata**, então abra a IDE do Arduíno e acesse **Files > Examples > Firmata > StandardFirmata** em seguida clique em **Upload.**
Vamos montar os leds na protoboard e ligá-los ao Arduíno:

![Esquema de ligação dos leds ao Arduíno](/images/img-posts/esquema-leds-simples-http.jpg)

Vejam que não tem segredo, os leds estão ligados as portas digitas **2,3,4** e **5** e cada um com um resistor de 100 Ohm, feito isso crie uma pasta para salvar seu projeto, usando o **terminal do linux** ou **prompt de comando do windows** digite:

    npm install johnny-five

Para instalar o modulo [johnny-five](https://github.com/rwaldron/johnny-five/), crie um arquivo com o nome de **app.js** nele vamos escrever os códigos:

Primeiramente vamos definir os módulos que vamos utilizar, e algumas configurações:

{% highlight javascript %}
var http = require('http').createServer(servidor);
var fs = require('fs');
var five = require('johnny-five');
var arduino = new five.Board();
{% endhighlight %}

Definimos os módulos http e fs que são nativos do Node.js, aproveitamos e criamos o servidor http e passamos a função *servidor* que ainda vamos criar(caso você nunca tenha criado um servidor http com node.js recomendo que leia a postagem anterior: [Criando servidor Http e rotas simples com Node.js](http://pedrohs.github.io/criando-servidor-http/)) definimos nosso Arduíno também, mas antes de continuarmos vamos já definir as variáveis aonde vamos "guardar" nossos leds:

{% highlight javascript %}
var led0, led1, led2, led3;
{% endhighlight %}

Definimos as variáveis vazias no topo do código para poder ter acesso a elas a partir de qualquer lugar.

Agora vamos definir os leds e seus respectivos pinos:

{% highlight javascript %}
arduino.on('ready', function(){
  console.log("Arduino Pronto");

  led0 = new five.Led(2);
  led1 = new five.Led(3);
  led2 = new five.Led(4);
  led3 = new five.Led(5);
});
{% endhighlight %}

Para quem esta ficando perdido recomendo que leia as postagens anteriores aonde falamos de tudo isso mais detalhadamente: [http://pedrohs.github.io/tags/#arduino](http://pedrohs.github.io/tags/#arduino), Definimos um **console.log** para sabermos quando o Arduíno está pronto.

Agora vamos criar a função *servidor* que gerenciará nossas rotas http:

{% highlight javascript %}
function servidor(req, res){ //na postagem anterior, definimos aqui como resquisicao e resposta, mas para ficar mais pratico abreviamos para req, res, ok?
//codigo a seguir vai aqui dentro
}
{% endhighlight %}

Vamos criar uma variavel para guardar a url da requisição, e definir algumas rotas:

{% highlight javascript %}
var url = req.url;

if(url == '/'){
  resposta.writeHead(200);
  resposta.end(fs.readFileSync('view/index.html')); //estou carregando o arquivo index.html que vamos ainda criar
}
{% endhighlight %}

Criamos a rota **/** que se refere-se a **index** e será nela que vamos mostrar os botoes que ligaram e desligam nossos leds, vamos agora criar as rotas que vão controlar os leds e em seguida criaremos o **index.html**:

{% highlight javascript %}
else if(url == '/led0'){
	res.writeHead(302, {'Location': '/'}); //calma que mais para baixo explico oque é isso
  res.end(); //finalizamos a resposta ao navegador
  led0.toggle(); //trocamos o estado do led
}
{% endhighlight %}

Agora vamos repetir o codigo acima para os outros leds:

{% highlight javascript %}
else if(url == '/led1'){
    res.writeHead(302, {'Location': '/'});
    res.end();
    led1.toggle();
  }else if(url == '/led2'){
    res.writeHead(302, {'Location': '/'});
    res.end();
    led2.toggle();
  }else if(url == '/led3'){
    res.writeHead(302, {'Location': '/'});
    res.end();
    led3.toggle();
  }else{
    res.writeHead(200);
    res.end("<h1>Erro 404</h1>");
  }
{% endhighlight %}

Notem que todas as rotas dos leds tem o: **res.writeHead(302, {'Location': '/'});** pois assim que o node.js receber a requisição ele informa que se trata de um redirecionamento(o código http 302 informa justamente isso) e manda o navegador ir para a pagina **/** (que no caso é a index) pois as rotas dos leds não tem nada a exibir, é apenas para mudar o estado do led, então enviamos o navegador de volta para a index.

E por ultimo, criamos um *else* para caso o navegador tente acessar uma url não definida ele mostre a mensagem **Erro 404**

Terminamos a função servidor, vamos agora definir a porta e colocalo online para isso:

{% highlight javascript %}
http.listen(3000, function(){
  console.log("Servidor Online na porta: 3000");
});
{% endhighlight %}

Terminamos o código, veja como ficou:

{% highlight javascript %}
var http = require('http').createServer(servidor);
var fs = require('fs');
var five = require('johnny-five');
var arduino = new five.Board();
var led0, led1, led2, led3;

arduino.on('ready', function(){
  console.log("Arduino Pronto");

  led0 = new five.Led(2);
  led1 = new five.Led(3);
  led2 = new five.Led(4);
  led3 = new five.Led(5);
});

function servidor(req, res){
  var url = req.url;
  if(url == '/'){
    res.writeHead(200);
    res.end(fs.readFileSync('view/index.html'));
  }else if(url == '/led0'){
    res.writeHead(302, {'Location': '/'});
    res.end();
    led0.toggle();
  }else if(url == '/led1'){
    res.writeHead(302, {'Location': '/'});
    res.end();
    led1.toggle();
  }else if(url == '/led2'){
    res.writeHead(302, {'Location': '/'});
    res.end();
    led2.toggle();
  }else if(url == '/led3'){
    res.writeHead(302, {'Location': '/'});
    res.end();
    led3.toggle();
  }else{
    res.writeHead(200);
    res.end("<h1>Erro 404</h1>");
  }
};

http.listen(3000, function(){
  console.log("Servidor On-line");
});
{% endhighlight %}

Agora vamos construir a **Index**:
----------------------------------

Crie uma pasta no seu projeto com o nome de *view* lá dentro crie um arquivo chamado **index.html** abra ele e digite:

{% highlight html %}
<html>
  <head>
    <title>Leds</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
  </head>
  <body>
    <ul class="list-inline">
      <li>
        <h1>Led 1:</h1>
        <a href="/led0" class="btn btn-success">Ligar/Desligar</a>
      </li>
      <li>
        <h1>Led 2:</h1>
        <a href="/led1" class="btn btn-success">Ligar/Desligar</a>
      </li>
      <li>
        <h1>Led 3:</h1>
        <a href="/led2" class="btn btn-success">Ligar/Desligar</a>
      </li>
      <li>
        <h1>Led 4:</h1>
        <a href="/led3" class="btn btn-success">Ligar/Desligar</a>
      </li>
    </ul>
  </body>
</html>
{% endhighlight %}

Notem que estou utilizando entre as tags **<head> </head>** um stylesheet que pega um arquivo css do [Bootstrap ](http://getbootstrap.com/) que para quem não conhece [Bootstrap ](http://getbootstrap.com/) é uma Framework CSS que ajuda no desenvolvimento web oferecendo elementos prontos, classes que ajudam, ícones etc. no site deles vocês podem ver mais informações [http://getbootstrap.com/](https://github.com/rwaldron/johnny-five/), mas continuando, no corpo do html criamos uma lista **ul** com a classe **list-inline** que é uma class do bootstrap que deixa nossa na lista horizontal, dentro de cada item da lista ( **li** ) temos um **h1** aonde mostramos o nome do led, e abaixo dele criamos um [Link](http://www.w3schools.com/html/html_links.asp)  aonde quando clicado, ele envia o navegador para a rota de cada led que definimos na **app.js** e cada link tem a classe **btn** e **btn-success** que também são classes do bootstrap, elas criam um botão verde, vocês podem ver outros botoes aqui: [http://getbootstrap.com/css/#buttons](https://github.com/rwaldron/johnny-five/)
Bom terminamos a index.html, agora abra o **temrinal** ou **prompt de comando** e execute o código:

    node app.js

Espere aparecer no console as mensagens: **Arduino Pronto** e **Servidor Online** para evitar erros, assim que aparecer abra seu navegador e acesse: http://localhost:3000/ ai é so ir clicando nos botoes loucamente para ver os leds funcionando, ok? Estou pensando em fazer uma postagem mostrando a como fazer esse mesmo projeto, mas usando o [Express Js](http://expressjs.com/) que ajuda no gerenciamento de rotas e entre outras coisas, então até já lá fiquem ligados!
