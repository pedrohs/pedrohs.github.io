---
layout: post
title: Lendo potenciômetro com Node.js e Arduíno
date: 2015-02-16 15:11:24
tags: [nodejs, arduino]
description: Hoje vamos ler o valor de um potenciômetro ligado ao Arduíno utilizando o modulo johnny-five do node.js sem digitar nenhum código no Arduíno como na postagem anterior
image:
  feature: arduino.jpg 
---
Hoje vamos ler o valor de um potenciômetro ligado ao Arduíno utilizando o modulo [johnny-five](https://github.com/rwaldron/johnny-five/) do node.js sem digitar nenhum código no Arduíno como na [postagem anterior](https://pedrohs.github.io/piscando-led-com-node.js-e-arduino/).

No Arduíno precisamos enviar o código *StandardFirmata* que tem na própria IDE do Arduíno, então para enviá-la, abra a IDE do Arduíno e acesse **Files > Examples > Firmata > StandardFirmata** em seguida clique em **Upload** feito isso vamos ligar nosso potenciômetro ao Arduíno, como no exemplo abaixo: 

![Exemplo de como ligar o potenciômetro o arduino](/images/img-posts/esquema-ligacao-potenciometro.jpg)

Notem que o potenciômetro esta ligado a porta analógica **A0** do Arduíno.
Feito isso crie uma pasta aonde preferir para salvar seu projeto, abra o **terminal** ou **prompt de comando** e acesse a pasta por ele e em seguida digite:

    npm install johnny-five

este comando irá instalar o modulo que vamos utilizar para controlar o Arduíno, agora crie um arquivo dentro do seu projeto com o nome de ***app.js*** será nele que ficara nossos códigos, então vamos lá.

Devemos começar definindo o modulo johnny-five então:
{% highlight javascript %}
var five = require('johnny-five');
{% endhighlight %}

em seguida definimos o arduino
{% highlight javascript %}
var arduino = new five.Board(); // a função five.Board(); irá procurar algum arduino ligado a usb e se conectar 
{% endhighlight %}

agora digitamos:
{% highlight javascript %}
arduino.on('ready', function(){
	console.log("Arduino Pronto");
	//o restante do codigo ficara todo aqui dentro
}); 
//essa função é executada assim que o Arduíno ficar pronto(ready) ele vai exibir no console a mensagem "Arduíno Pronto" e executar o restante do código que ainda vamos escrever
{% endhighlight %}
então, dentro do codigo que digitamos acima vamos definir nosso potenciômetro para isso digitamos:
{% highlight javascript %}
var potenciometro = new five.Sensor({
	pin: "A0", // aqui definimos a porta que sera lida
	freq: 250 //aqui definimos em milissegundos a frequência de leitura da porta, se você não definir ele por padrão vai ler a porta acada 25 milissegundos
});
{% endhighlight %}
Agora temos nosso potenciômetro definido, vamos ler o valor dele e mostrar no console, para isso digitamos:
{% highlight javascript %}
 potenciometro.on("data", function(){
	//ou seja assim que o potenciômetro receber os dados(data) ele vai executar tudo que estiver aqui dentro
	console.log(this.value); //com isso o console vai mostrar o valor do potenciômetro, e esse valor é pego pelo "this.value"		
});
{% endhighlight %}
Vale lembrar que a função **potenciometro.on("data", function(){})** é executada infinitamente, e o intervalo em que cada execução acontece é de acordo com o valor que você definiu em **freq** quando definimos nosso potenciômetro.

o nosso codigo devera ficar assim:
{% highlight javascript %}
var five = require('johnny-five');
var arduino = new five.Board();

arduino.on('ready', function(){
	var potenciometro = new five.Sensor({
		pin: "A0",
		freq: 250
	});
	potenciometro.on("data", function(){
		console.log(this.value);
	});
});
{% endhighlight %}
Agora para executar o código digitamos no **terminal** ou **prompt de comando**

    node app.js

Aguarde a mensagem "Arduíno Pronto", e logo abaixo ira aparecer o valor do potenciômetro, gire o potenciômetro para ver o valor mudando. caso você queira aumentar a velocidade de leitura, basta diminuir o valor de **freq** aonde definimos o potenciômetro.

O console irar mostrar algo parecido como isto:
![Valor de potenciômetro lido pelo Arduíno](/images/img-posts/valor-potenciometro-terminal.jpg)

Simples não? :) espero que tenham gostado, se possível comente e diga oque achou do post, oque deve melhorar, se encontrou algum erro ou se precisa de ajuda!, vejo vocês no próximo post.

Opa aqui vai uma dica, caso você queira aprender muito mais sobre o modulo johnny-five basta acessar a Wiki deles: [Johnny-Five - Wiki](https://github.com/rwaldron/johnny-five/)  tem vários exemplos lá. 