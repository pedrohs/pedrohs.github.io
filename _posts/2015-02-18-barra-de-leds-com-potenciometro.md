---
layout: post
title: Barra de leds com potenciômetro utilizando Node.js e Arduíno
date: 2015-02-18 09:14:23
description: Nos últimos posts falamos sobre Potenciômetros e Leds então que tal brincar um pouco usando os dois juntos ?, vamos montar uma barra de leds que conforme é aumentado o valor do potenciômetro os leds vão acendendo e se diminuir eles apagaram e para ficar mais *bonitinho* vamos ligar os leds nos PWMs do Arduíno para fazer um efeito fade para quando acender e apagar os leds.
tags: [nodejs, arduino]
image:
  feature: arduino.jpg
---
Nos últimos posts falamos sobre [Potenciômetros](https://pedrohs.github.io/lendo-potenciometro/) e [Leds](https://pedrohs.github.io/controlando-led-com-botao/) então que tal brincar um pouco usando os dois juntos ?, então hoje vamos montar uma barra de leds que conforme é aumentado o valor do potenciômetro os leds vão acendendo e se diminuir eles vão se apagando e para ficar mais *bonitinho* vamos ligar os leds nos PWMs do Arduíno para fazer um efeito fade para quando acender e apagar os leds.

Como nas outras postagens precisamos antes de mais nada enviar o exemplo **StandardFirmata** para isso abra a IDE do Arduíno e acesse **Files > Examples > Firmata > StandardFirmata** em seguida clique em **Upload**. Arduino pronto vamos montar nossos leds e o potenciômetro na protoboard: 

![Esquema de ligação dos leds e potenciômetro ao Arduíno](/images/img-posts/esquema-barra-de-leds-potenciometro.jpg)

Notem que todos os leds estão ligados apenas aos Pinos **PWM** do Arduíno, a cada led é ligado um resistor de 100 ohms, e o potenciômetro esta ligado a porta analógica **A0**.

Vamos para o proximo passo, crie uma pasta para salvar seu projeto, feito isso abra o **terminal** ou **prompt de comando** do windows e digite:

    npm install johnny-five

Isso irá instalar o modulo que vamos utilizar para controlar o arduino, feito isso crie um arquivo chamado ***app.js*** nele vamos escrever nossos codigos, então vamos lá:

Primeiramente definimos o modulo *johnny-five* na variavel *five*, logico pode ser outro nome, vc decide.
{% highlight javascript %}
    var five = require('johnny-five'); 
{% endhighlight %}

Feito isso vamos definir nosso arduino:
{% highlight javascript %}
var arduino = new five.Board();
{% endhighlight %}
Agora antes de definirmos nossos leds precisamos saber quando o Arduíno estará devidamente conectado e pronto para o uso, para isso existe o **.on**:

{% highlight javascript %}

arduino.on('ready', function(){ //assim que o node.js receber o sinal de pronto do Arduíno o código aqui dentro sera executado.
    //todo código a seguir deverá ser digitado aqui dentro 
});
{% endhighlight %}

vamos agora definir nossos Leds:
{% highlight javascript %}
var led0 = new five.Led(3);
var led1 = new five.Led(5);
var led2 = new five.Led(6);
var led3 = new five.Led(9);
var led4 = new five.Led(10);
var led5 = new five.Led(11);
{% endhighlight %}

Defini o nome dos de led0,1,2,3... mas você pode mudar. Notem que estão vinculados apenas portas PWM, logico que o numero das portas varia de acordo com o Arduíno que você esta utilizando, para mais informações acesse o site oficial do Arduíno: [Arduino - Products](http://arduino.cc/en/Main/Products).
Definido os leds falta o potenciometro:

{% highlight javascript %}
var potenciometro = new five.Sensor("A0");
{% endhighlight %}
Pronto, vamos agora fazer os leds acenderem conforme o valor do potenciômetro, então para pegar o valor do potenciômetro: 

{% highlight javascript %}
potenciometro.on("change", function(){
    var valorPotenc = this.value; //a variavel valorPotenc irá guardar o valor do potenciômetro
	//próximo código vai ficar aqui dentro 
});
{% endhighlight %}

Vocês podem notar que ao invés de usarmos *potenciometro.on("data")* como eu expliquei a vocês na outra postagem([Lendo potenciômetro com Node.js e Arduíno](https://pedrohs.github.io/lendo-potenciometro/)) usamos o **"change"** pois o metodo **"data"** executa infinitamente independente se o valor mudou ou não, já o **"change"** executa o codigo apenas quando o valor muda e com isso o node.js e Arduíno ficam mais "aliviados", pois dependendo da aplicação pode ajudar no desempenho das funções.
Agora para acendermos os leds vamos fazer uma conta básica, vamos utilizar **6 leds**, e sabemos que o Arduíno "lé" o potenciômetro de **0 a 1023** então vamos dividir **1023 por 6** vai resultar em 170 aredondado, ou seja a cada led terá uma diferença de 170 um do outro, não entendeu ? vamos ver no código: 
{% highlight javascript %}
if(valorPotenc > 170){
	led0.fadeIn(200);
}else{
	led0.fadeOut(100);
}

if(valorPotenc > 340){ // valor do if anterior + 170
	led1.fadeIn(200);
}else{
	led1.fadeOut(100);
}

if(valorPotenc > 510){ // valor do if anterior + 170
	led2.fadeIn(200);
}else{
	led2.fadeOut(100);
}

if(valorPotenc > 680){ // valor do if anterior + 170
	led3.fadeIn(200);
}else{
	led3.fadeOut(100);
}

if(valorPotenc > 850){
	led4.fadeIn(200);
}else{
	led4.fadeOut(100);
}

if(valorPotenc > 1020){
	led5.fadeIn(200);
}else{
	led5.fadeOut(100);
}
{% endhighlight %}

Notem que de um if para o outro aumenta 170, em cada led existe 2 funções uma chamada **fadeIn()** e a outra **fadeOut()** que vão nos ajudar a criar um efeito fade para acender e apagar os leds, dentro delas são definidos em milissegundos o tempo que o efeito vai demorar para terminar, no caso coloquei o efeito **fadeOut()** mais rápido, pois fica melhor de se vê, mas vc tem a liberdade de alterar esses valores como quiser.
Uma rápida explicação sobre o **if** não que eu ache necessário, mas para ficar bem esclarecido, vou pegar o primeiro **if**:
{% highlight javascript %}
if(valorPotenc > 170){ // verifica se o valor do potenciômetro é menor que 170
	led0.fadeIn(200); //se for verdadeiro ele roda o efeito fadeIn() e acende o led
}else{
  	led0.fadeOut(100); //caso contrario ele roda o efeito e apaga o led 
}
{% endhighlight %}
mais fácil que isso impossível né jovens ?
Veja como ficou o codigo completo:
{% highlight javascript %}

var five = require('johnny-five');
var arduino = new five.Board();

arduino.on('ready', function(){
	console.log("Arduino Pronto");

	var potenciometro = new five.Sensor('A0');

	//Leds
	var led0 = new five.Led(3);
	var led1 = new five.Led(5);
	var led2 = new five.Led(6);
	var led3 = new five.Led(9);
	var led4 = new five.Led(10);
	var led5 = new five.Led(11);

	potenciometro.on('change', function(){
		var valorPotenc = this.value;
		if(valorPotenc > 170){
			led0.fadeIn(200);
		}else{
			led0.fadeOut(100);
		}

		if(valorPotenc > 340){
			led1.fadeIn(200);
		}else{
			led1.fadeOut(100);
		}

		if(valorPotenc > 510){
			led2.fadeIn(200);
		}else{
			led2.fadeOut(100);
		}

		if(valorPotenc > 680){
			led3.fadeIn(200);
		}else{
			led3.fadeOut(100);
		}

		if(valorPotenc > 850){
			led4.fadeIn(200);
		}else{
			led4.fadeOut(100);
		}

		if(valorPotenc > 1020){
			led5.fadeIn(200);
		}else{
			led5.fadeOut(100);
		}
	});
});
{% endhighlight %}
Agora nosso codigo esta pronto, para rodar abra o **terminal** ou **prompt de comando** e rode:

    node app.js 

Gire o potenciômetro e veja a magica acontecendo :) bom é isso, espero que tenha ficado esclarecido, vejo vocês na próxima.

Só lembrando caso queiram aprender mais sobre o modulo Johnny-Five exite a Wiki deles: [Johnny-Five - Wiki](https://github.com/rwaldron/johnny-five/wiki).