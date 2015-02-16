---
layout: post
title: "Piscando led com Node.js e Arduino"
date: 2015-02-15 18:08:20
tags: [nodejs, arduino]
image:
  feature: arduino.jpg
---
Bom hoje finalmente vamos brincar um pouco com arduino \o/, e como de paste vamos piscar um led utilizando o Arduino Uno, mas também funciona com o Arduino Mega, Nano, Leonardo etc e não vamos digitar nenhum código na Ide do Arduino, Então let's go.

Primeiramente abra a IDE do arduino(mas calma eu prometi que não digitaríamos nenhum código no arduino e não vamos!)  mas precisamos enviar para o arduino o *StandardFirmata*  para que o modulo que vamos utilizar no node.js tenha "acesso" ao arduino, então depois de abrir a IDE do arduino acesse **Files > Examples > Firmata > StandardFirmata** em seguida clique em **Upload** feito isso nosso arduino esta pronto.
Agora vamos montar na protoboard nosso Led, para isto estou utilizando um led de 5mm e um resistor de 100 ohms. 
![Ligação de led ao arduino uno](/images/img-posts/esquema-led-blink.jpg)

Notem que o led esta ligado a porta digital 2 do arduino.

Agora vamos partir para o node.js, crie uma pasta aonde preferir, criada a pasta precisamos instalar o modulo **johnny-five** que vamos utilizar para controlar o arduino, para isso abra o terminal ou promot de comando e digite o seguinte comando dentro da pasta do seu projeto:

    npm install johnny-five

feito isso vamos criar um arquivo chamado ***app.js*** será nele que digitaremos nossos códigos, então vamos lá,
{% highlight javascript %}
//esta linha define o modulo johnny-five na variavel five
var five = require('johnny-five'); 
  
//Agora precisamos fazer a conexão com o arduino, para isso digitamos:  
var arduino = new five.Board();
//a função five.Board() automaticamente procura algum arduino ligado a USB e que esteja com o StandardFirmata para se conectar
//em seguida digitamos:
arduino.on('ready', function(){
    //codigo fica aqui
});
//a função .on verifica o arduino que definimos mais a cima, e quando o arduino estiver pronto(ready) ele vai executar tudo que estiver ali dentro
//dentro de arduino.on vamos digitar:
console.log("Arduino Pronto");
//assim quando o arduino estiver pronto ele irar mostrar no console a mensagem "Arduino Pronto"
//agora temos que definir nosso led, para isto digitamos:
var led = new five.Led(2); //o numero 2 corresponde a porta do arduino aonde o led esta ligado
//agora finalmente vamos piscar o led, para isso existe a função .strobe() do modulo johnny-five, então:
led.strobe();
{% endhighlight %}
Terminamos, o codigo devera ficar assim:
{% highlight javascript %}
var five = require('johnny-five');
var arduino = new five.Board();
   
arduino.on('ready', function(){
    console.log("Arduino Pronto");
    var led = new five.Led(2);
    led.strobe();
});
{% endhighlight %}
Agora para vermos esse magnifico código funcionando devemos ir para terminal e digitar: `node app.js `na pasta aonde se encontra o seu projeto

Aguardem ate a mensagem **"Arduino Pronto"** e o led começara a piscar, Facil não? :) Espero que tenham gostado do post, tentei explicar ao máximo, caso encontrarem algum erro comentem! Aguardem novas postagens.