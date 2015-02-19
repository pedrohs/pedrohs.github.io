---
layout: post
title: Controlando LCD com Node.js e Arduíno
date: 2015-02-19 12:08:11
description:
tags: [nodejs, arduino]
image:
  feature: arduino.jpg
---
Hoje vamos brincar um pouco com um LCD 16x2 (mas podem ser de outros tamanhos) utilizando o modulo [Johnny-Five](https://github.com/rwaldron/johnny-five/) que vocês já devem estar cansados de ouvir eu dizer isso rs, 

Como nas outras postagens precisamos antes de mais nada enviar o exemplo **StandardFirmata** para isso abra a IDE do Arduíno e acesse **Files > Examples > Firmata > StandardFirmata** em seguida clique em Upload. feito isso vamos montar nosso LCD na protoboard:

![Esquema de ligação do LCD ao Arduíno](/images/img-posts/esquema-lcd.jpg)

Feita a ligação vamos criar uma pasta para salvar nosso projeto, agora instale o *johnny-five*:

    npm install johnny-five
 
Instalado o modulo, crie um arquivo chamado ***app.js*** nele vamos escrever nosso código:

Vamos definir o modulo johnny-five e Arduíno:

{% highlight javascript %}
var five = require('johnny-five');
var arduino = new five.Board();
{% endhighlight %}

Definido os 2 precisamos saber quando o Arduíno estará pronto para receber os comandos, para isso:

{% highlight javascript %}
arduino.on('ready', function(){
	//todo o código a seguir vai aqui dentro! 
});
{% endhighlight %}

Feito isso vamos definir nosso lcd:
{% highlight javascript %}
var lcd = new five.LCD({
	pins: [12, 11, 5, 4, 3, 2], //aqui são definidos os pinos do LCD, a sequencia é essa: [rs, e, d4, d5, d6, d7]
	rows: 2, //quantidade de linhas do LCD
	cols: 16 //quantidade de colunas do LCD
});
{% endhighlight %}

Definido o lcd, vamos exibir nele duas frases, na primeira linha:  "*Ola Node.js*" e na segunda: "*Ola Johnny-Five*", então para isso vamos utilizar 2 métodos: ***.print()*** e ***.cursor()***, vamos ver como elas funcionam:

Primeiramente vamos escrever na primeira linha "*Ola Node.js*", então digitamos:

{% highlight javascript %}
lcd.print("Ola Node.js");
{% endhighlight %}

Simples né?, vamos agora exibir a segunda linha, mas se fizermos da mesma forma que fizemos acima o texto ficara um do lado do outro e não um em cada linha, para isso existe o ***.cursor()***:

{% highlight javascript %}
lcd.cursor(1,0);
{% endhighlight %}
 
Ele funciona da seguinte maneira: **.cursor(linha, coluna)** se queremos pular para a segunda linha definimos: **.cursor(1,0)** se o seu lcd tem suporte a mais de 2 linhas e você quer pular 2,3 linhas basta alterar o **.cursor(linha, coluna)** agora se você quer deixar espaços antes de uma palavra basta alterar o parâmetro *"coluna"* do **.cursor()**.
Exemplo, se você definir: ***lcd.cursor(1,5)*** o lcd vai exibir a frase na segunda linha e o texto só vai começar depois de **5** casas. mas enfim precisamos apenas exibir na segunda linha *"Ola Johnny-five"*para isso:

{% highlight javascript %}
lcd.cursor(1,0);
lcd.print("Ola Johnny-five");
{% endhighlight %}

Você também pode resumir essas duas linhas assim:

{% highlight javascript %}
lcd.cursor(1,0).print("Ola Johnny-five");
{% endhighlight %}

As duas funcionam da mesma forma. É só isso, veja o código completo:

{% highlight javascript %}
var five = require('johnny-five');
var arduino = new five.Board();

arduino.on("ready", function(){
	console.log("Arduino Pronto");

	var lcd = new five.LCD({
		pins: [12, 11, 5, 4, 3, 2], //aqui são definidos os pinos do LCD, a sequencia é essa: [rs, e, d4, d5, d6, d7]
		rows: 2, //quantidade de linhas do LCD
		cols: 16 //quantidade de colunas do LCD
	});

	lcd.print("Ola Node.JS");
	lcd.cursor(1,0);
	lcd.print("Ola Johnny-Five");
});
{% endhighlight %}

abra o **terminal** ou **prompt de comando** e digite:

    node app.js
    
E verá o lcd funcionando, mas que tal fazermos uma transição simples? no fim do código vamos adicionar um ***setTimeout()*** que vai executar um bloco de códigos depois de 5 segundos, então fazemos:

{% highlight javascript %}
setTimeout(function(){
	lcd.clear(); // usamos o .clear() para apagar tudo que estiver escrito no lcd
	lcd.print("Ola Mundo"); //e em seguida mostramos a mensagem 'Ola mundo'
}, 5000 // aqui definimos os milissegundos
);
{% endhighlight %}

o código completo ficara assim:

{% highlight javascript %}
var five = require('johnny-five');
var arduino = new five.Board();

arduino.on("ready", function(){
	console.log("Arduino Pronto");

	var lcd = new five.LCD({
		pins: [12, 11, 5, 4, 3, 2], //aqui são definidos os pinos do LCD, a sequencia é essa: [rs, e, d4, d5, d6, d7]
		rows: 2, //quantidade de linhas do LCD
		cols: 16 //quantidade de colunas do LCD
	});
	lcd.print("Ola Node.JS");
	lcd.cursor(1,0);
	lcd.print("Ola Johnny-Five");

	setTimeout(function(){
		lcd.clear();
		lcd.print("Ola Mundo");
	}, 5000);
});
{% endhighlight %}
Agora basta executar no **terminal** ou **prompt**:

    node app.js

Irá aparecer a primeira frase, e depois de 5 segundos o lcd vai mostrar *"Ola Mundo"*

Molezinha? espero que tenham gostado, caso queiram aprender mais sobre johnny-five e LCD acessem: [Johnny-Five - Wiki](https://github.com/rwaldron/johnny-five/wiki/LCD), vejo vocês na próxima. 