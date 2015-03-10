---
layout: post
title: Exibindo sensores com Socket.io e Arduíno
date: 2015-03-10 11:27:08
tags: [nodejs, socket.io, johnny-five]
description: Hoje vamos criar uma pagina html e exibir valores de alguns sensores em tempo real utilizando Socket.io para node.js e johnny-five para Arduíno.
image:
  feature: arduino.jpg 
---
Hoje vamos criar uma pagina html e exibir valores de alguns sensores em tempo real utilizando Socket.io para node.js e johnny-five para Arduíno.

Primeiramente vamos ligar nossos sensores ao arduino, vou utilizar um LDR que é utilizado para medir a luminosidade do ambiente, o sensor higrômetro que vamos usar para medir a umidade do solo, e um potenciômetro, os três vão usar as portas analógicas do Arduíno, veja a ligação: 

![Esquema de ligação dos sensores ao Arduíno](/images/img-posts/esquema-sensores-socketio.jpg)
*(Obs: resistor de 10k usado no LDR)*

Feita a ligação vamos criar uma pasta para guardar nosso projeto e em seguida instalar os módulos que o node.js vai utilizar:

    npm install socket.io johnny-five

Que são o Socket.io e Johnny-five.
Feito isso vamos criar um arquivo chamado **app.js** e la vamos escrever nossos códigos:

{% highlight javascript %}
var http = require('http').createServer(servidor);
var fs = require('fs');
var io = require('socket.io').listen(http);
var five = require('johnny-five');
var Fn = five.Fn; //aqui estou definindo uma lib do johnny-five, que logo explicarei o porque

var arduino = new five.Board();

arduino.on('ready', function(){
    console.log("Arduino Pronto");

//continuamos daqui! 
});

function servidor(req, res){
    res.writeHead(200);
    res.end(fs.readFileSync('view/index.html')); //calma que ainda vamos criar esse html
};

http.listen(4000, function(){
    console.log("Servidor On-line");
});
{% endhighlight %}

Para quem não esta entendendo nada recomendo que leia as postagens:

 - [Piscando led com Node.js e Arduino](http://pedrohs.github.io/piscando-led-com-node.js-e-arduino/)
 - [Criando servidor Http e rotas simples com Node.js](http://pedrohs.github.io/criando-servidor-http/)
 - [Lendo potenciômetro com Node.js e Arduíno](http://pedrohs.github.io/lendo-potenciometro/)
 - [Primeiros passos com Socket.io](http://pedrohs.github.io/primeiros-passos-com-socketio/)

Isto é o básico para poder continuar.
Precisamos definir nossos sensores, então:

{% highlight javascript %}
var sensorLuz = new five.Sensor("A0").scale([0, 100]);
var sensorSolo = new five.Sensor("A1");
var potenc = new five.Sensor("A2");
{% endhighlight %}

Notem que estamos utilizando o **.scale()** no sensor LDR, vou explicar o porque, as portas do Arduíno leem de **0** a **1023** então para o sensor LDR quanto maior a luminosidade maior vai ser o valor lido na porta, e queremos exibir o valor em porcentagem ou seja de **0** a **100%**, para isso usamos o **.scale([valor inicial, valor final])** aonde ele vai pegar o valor lido e transformar com o valor inicial e final definido dentro dele. 
Os outros sensores estão sem mistério; Agora precisamos enviar o valor desses sensores para o socket.io exibir na pagina html que ainda vamos criar:  

{% highlight javascript %}
sensorLuz.on('change', function(){
    io.emit('sensorLuz', this.value.toFixed() + '%');
});
potenc.on('change', function(){
    io.emit('potenc', this.value);
}); 
sensorSolo.on('change', function(){
    var valor = Fn.map(this.value, 0, 1023, 100, 0);
    io.emit('potenc', valor + '%');
});
{% endhighlight %}

Como mostrado na postagem anterior([Primeiros passos com Socket.io](http://pedrohs.github.io/primeiros-passos-com-socketio/)) usamos o io.emit para enviar os dados, e no *sensorLuz* veja que quando enviamos o valor(this.value) adicionamos o **.toFixed()** isso porque o **.scale()** que definimos neste sensor vai gerar porcentagem com virgula exemplo: *17,2548148524%* então usamos o toFixed para arredondar o numero, e logo depois dele adicionamos o simbolo de porcentagem para já ser enviado o valor tratado. 

No potenciômetro não a mistério, pegamos o valor "this.value" e enviamos, 

No ultimo sensor usamos o **Fn** que definimos no topo do código, para podermos usar a função **.map()** do johnny-five que é idêntica ao [.map do Arduíno](http://arduino.cc/en/reference/map) que vamos utilizar para resolver o seguinte problema:
O sensor higrômetro funciona assim: quanto maior a umidade no solo menor o valor lido pelo arduino, e quando menor a umidade maior sera o valor lido, e como queremos exibir em porcentagem o **.scale()** não conseguiria inverter esse valor e transformar em porcentagem, para isso vamos usar o **.map(valor, valorInicial, valorFinal, novoValorInicial, novoValorFinal)** sacaram ? pois bem em seguida enviamos a variável e adicionamos o simbolo de porcentagem.

**Prestem atenção aos nomes definidos nos emits("sensorLuz", "potenc", "potenc") pois são com eles que recuperamos o valor na pagina.**

Feito isso terminamos a parte do servidor, vamos agora criar uma pasta chamada *view* e dentro dela criaremos o arquivo **index.html**:

{% highlight html %}
<html>
<head>
   <title>Sensores</title>
   <meta charset="UTF-8">
   <script src="/socket.io/socket.io.js"></script>
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
   <script>
      var socket = io.connect(); // faz a conexão com o socket.io do node.js

      //recebe o valor "sensorLuz" enviado pelo node.js
      socket.on('sensorLuz', function(valor){
          $("#luz").text(valor); //escreve o "valor" que é passado na função no id #luz
      });
      //recebe o valor "sensorSolo" enviado pelo node.js
      socket.on('sensorSolo', function(valor){
          $("#umidSolo").text(valor);//escreve o "valor" que é passado na função no id #umidSolo
      });
      //recebe o valor "potenc" enviado pelo node.js
      socket.on('potenc', function(valor){
          $("#potenc").text(valor);//escreve o "valor" que é passado na função no id #potenc
      });
  </script>
</head>
<body>
   <div class="container">
        <h1>Informações:</h1>
        <!--Notem que os IDs são os mesmos passados para usar o .text()-->
        <h2>Luminosidade: <span id="luz" class="text-primary">0%</span></h2>
        <h2>Umidade Solo: <span id="umidSolo" class="text-warning">0%</h2>
        <h2>Valor Potenciômetro: <span id="potenc" class="text-success">0</span></h2>
  </div>
</body>
</html>
{% endhighlight %}

Não vou dar muito destaque ao html porque não é o foco do blog, mas caso vocês não tenham entendido alguma coisa, comentem que eu faço questão em explicar. 

Depois de tudo isso vamos finalmente rodar nosso codigo:

    node app.js
    
Esperem aparecer no console *"Arduino Pronto"* e acessem http://localhost:4000/ e iram ver os valores mudando, notem o valor do LDR como é sensível e muda muito rápido.
Então para mais infomações acessem a wiki do johnny-five [clicando aqui](https://github.com/rwaldron/johnny-five/wiki/), e o site do socket.io [clique aqui](http://socket.io/).
Qualquer duvida comente, espero que tenham gostado, ate a próxima. 