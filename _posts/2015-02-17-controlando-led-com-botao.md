---
layout: post
title: Controlando led utilizando botão com Node.js e Arduíno
date: 2015-02-17 11:12:51
tags: [nodejs, arduino]
image:
  feature: arduino.jpg 
---
Continuando a serie de postagem sobre node.js e Arduíno, hoje vamos ligar e desliga um led utilizando um botão, e como de praste não vamos escrever nenhum código no Arduíno.

E como nas postagens anteriores antes de tudo precisamos enviar para o Arduíno o código **StandardFirmata** que tem na propria IDE do Arduíno, então para envia-lá abra a IDE do Arduíno e acesse **Files > Examples > Firmata > StandardFirmata** em seguida clique em **Upload**.
Arduino pronto vamos montar na nossa protoboard o led e botão. 
**Vou mostrar a como fazer a ligação usando um botão de 2 terminais, e um de 4 terminais.**

**Primeiro o botão com 2 terminais:**
![Ligação botão 2 terminais com o led](/images/img-posts/esquema-botao-2-termiais.jpg)
*Notem que o botão esta ligado a **porta digital 3** do Arduíno e o led a **porta digital 2** Vale ressaltar que estou utilizando um resistor de 100 ohms ligado no terminal positivo do led*

**Agora o esquema de montagem com o botão de 4 terminais:**
![Ligação botão 4 terminais com o led](/images/img-posts/esquema-botao-4-termiais.jpg)
*Notem que o botão esta ligado a **porta digital 3** do Arduíno como no botão de 2 terminais, o led esta ligado a **porta digital 2** do Arduíno com um resistor de 100 ohms*

Feita a ligação do led e botão ao Arduíno vamos começar a escrever nosso código, crie uma pasta para ficar salvo seu projeto, utilizando o **terminal** ou **prompt de comando** do windows acesse ela e digite:

    npm install johnny-five

esse comando irá instalar o modulo johnny-five que utilizamos nas outras postagens para controlar nosso Arduíno, com o modulo instalado crie um arquivo com o nome de ***app.js*** nele vamos escrever nosso codigo, então vamos lá:

Começamos definindo o modulo johnny-five:
{% highlight javascript %}
var five = require("johnny-five");
{% endhighlight %}

Agora precisamos definir nosso arduino:
{% highlight javascript %}
var arduino = new five.Board();
{% endhighlight %}

A função five.Board() irá automaticamente procurar o Arduíno ligado a USB e se conectar, caso queira definir uma porta, basta definir dentro dos parenteses de **Board()**, Exemplo: five.Board("COM1"); assim ele tentara se conectar ao arduino que esteja ligado a porta **COM1** caso não consiga irá retornar um erro no console

Continuando, como nas postagens anteriores precisamos antes de definir nosso led e botão saber quando o arduino estara pronto, para isso digitamos:
{% highlight javascript %}
arduino.on('ready', function(){
   	console.log("Arduíno Pronto");
   	//todo código a seguir vai aqui dentro 
});
{% endhighlight %}
Assim que o Arduíno estiver pronto será exibida a mensagem *Arduino Pronto* no console, seguindo com nosso codigo, vamos definir nosso led:
{% highlight javascript %}
var led = new five.Led(2); //lembrando que o numero 2 é referente a porta do Arduíno que esteja ligado o led 
{% endhighlight %}

Agora vamos definir nosso botão:
{% highlight javascript %}
var botao = new five.Button({
	pin: 3, //pino do arduino ligado ao botão
	isPullup: true // só defina como verdadeiro(true) esse parâmetro caso seu botão seja de 2 terminais, caso seja de 4 terminais nem é preciso definir ele, pois por padrão é definido como false
});
{% endhighlight %}

Definido nosso botão vamos alterar o estado do nosso led toda vez que o botão for pressionado, então se ele estiver desligado será ligado e se estiver desligado será ligado, e para sabermos se o botão foi pressionado existe a função **.on**, então:
{% highlight javascript %}
botao.on('down', function(){//assim a função será executada toda vez que o botão descer
    //código do led vai aqui 
});
{% endhighlight %}

Para alterarmos o estado do led de **ligado** para **desligado** ou inversamente existe a função *.toggle()* que toda vez que é executada ela vai inverter o valor do led então se for **on** passa a ser **off** e se for **off** passa ser **on** sacaram ?, vamos ver como fica:
{% highlight javascript %}
led.toggle(); 
{% endhighlight %}

Simples não? :), terminamos o código, devera ficar mais ou menos assim:
{% highlight javascript %}
var five = require('johnny-five');
var arduino = new five.Board();

arduino.on('ready', function(){
	console.log("Arduino Pronto");
	var led = new five.Led(3);
	var botao = new five.Button({
		pin: 2,
		isPullup: true
	});

	botao.on('down', function(){
		led.toggle();
	});
});
{% endhighlight %}
Para executar o codigo abra seu terminal ou prompt de comando e digite:

    node app.js

Feito isso espere aparecer a mensagem *Arduino Pronto* assim que aparecer pressione o botão uma vez e verá o led ligar, pressione novamente e ele vai desligar.

Viram como é simples? Caso queiram ver mais funções que podem fazer com o botão e o led acessem: [Johnny-five Wiki](https://github.com/rwaldron/johnny-five/wiki), espero que tenham gostado se possível comente fale oque achou da postagem se encontrou algum erro etc, vejo vocês na próxima. 