---
layout: post
title: Primeiros passos com Socket.io
date: 2015-03-02 22:02:10
tags: [nodejs, socket.io]
description: Hoje vou mostrar para vocês a como utilizar o socket.io que é um modulo para construir aplicações que exibem informações em tempo real, como por exemplo chats de bate papo,e no próxima postagem vamos utilizar ele junto do Arduíno! então fiquem ligados.
image:
  feature: background-2.jpg 
---

Hoje vou mostrar para vocês a como utilizar o socket.io que é um modulo para construir aplicações que exibem informações em tempo real, como por exemplo chats de bate papo,e no próxima postagem vamos utilizar ele junto do Arduíno! então fiquem ligados.

E para mostrar como ele funciona vamos criar uma especie de chat, que irá conter um input aonde o usuário digita a mensagem, aperta o botão e envia a todos que estão acessando o chat, também vamos mostrar o total de usuários online; Então vamos la:

Vamos utilizar 3 módulos no total, mas 2 deles são nativos do node.js, então não é necessário instalá-los, então vamos instalar o socket.io, abra o **terminal** ou **prompt de comando** digite: 

    npm install socket.io

Feito isso vamos agora criar o arquivo **app.js** para digitarmos nossos codigos, vamos lá:

{% highlight javascript %}
var http = require("http").createServer(servidor);
var io = require("socket.io").listen(http);
var fs = require("fs");

var usuarios = 0;

function servidor(req, res){
	res.writeHead(200);
	res.end(fs.readFileSync("view/index.html"));
}
{% endhighlight %}

Vou explicar poucas coisas dessa parte, pois a maior parte eu já falei nessa postagem: [Criando servidor Http e rotas simples com Node.js](http://pedrohs.github.io/criando-servidor-http/), definimos na primeira linha o http e passamos a função servidor, na segunda chamamos o *socket.io* e mandamos ele ouvir(listen) tudo que passar pelo http, logo a baixo chamamos o fs que vamos utilizar na função servidor para carregar o arquivo index.html que ainda vamos criar, também criamos uma variável chamada *usuarios* para guardar o total de usuários online, vamos continuar:

Precisamos saber quando algum usuário faz a conexão com nosso servidor ou desconectou, então usamos o **io.on**:

{% highlight javascript %}
io.on("connection", function(socket){
	console.log("Usuário Conectado"); 
	usuarios++;

//ainda não terminamos aqui
});
{% endhighlight %}

Definimos para que quando um usuário se conectar ao site exibimos no console a mensagem *"Usuário Conectado"* e adicionamos a variável *usuarios*, notem que na função passamos como parametro *"socket"*, isso serve para poder tomar algumas decisões apenas para um usuário, e não a todos, mais para frente vocês vão entender melhor,  agora precisamos enviar para todos os usuários o total de pessoas conectadas ao site, então vamos usar a função **.emit("id da mensagem", "oque a ser enviado")**:

Podemos fazer isso de 2 formas, enviando o total de usuários primeiro para o usuário que entrou, e depois enviamos para o restante dos usuários, isso ficaria assim:

{% highlight javascript %}
//enviamos primeiro para o usuário que entrou:
socket.emit("usuarios online", usuarios);
//depois enviamos para o restante de usuários:
socket.broadcast.emit("usuarios online", usuarios);
{% endhighlight %}

Notem que usamos *"socket"* que foi o parâmetro que passamos na função **.on**, Mas existe uma forma de enviar a todos os usuários:

{% highlight javascript %}
io.emit("usuarios online", usuarios);
{% endhighlight %}

Ou seja quando usamos o parâmetro que definimos na função afetamos apenas a um usuário, e se usarmos diretamente na variável que definimos o modulo atinge globalmente, a todos os usuários; Nos dois casos o **.emit()** é igual, vou explicar como ele funciona: 
No primeiro parâmetro definimos como se fosse um id para podermos diferenciar um *emit* do outro, no caso definimos o *emit* que enviara o total de usuários como: *"usuarios online""*, ou seja quando formos buscar o valor desse *emit* na pagina vamos pegar o valor passando no primeiro parâmetro *"usuarios online"*, mas para frente eu explico melhor, no segundo parâmetro passamos oque a ser enviado, no caso enviamos a variável que guarda o valor de todos os usuários online, sem mistério.

Vamos receber do usuário sua mensagem, e em seguida devemos repassar essa mensagem a todos os outros conectados aos site,  então usamos:

{% highlight javascript %}
socket.on("mensagem", function(msg){
	io.emit("mensagens", msg);
});
{% endhighlight %}

Esse código funciona assim, quando receber o *emit* do usuário com o nome de  *"mensagem"* passamos oque ele digitou para o parâmetro *msg* e enviamos para todos (inclusive ele) a mensagem para ser exibida, então usamos **io.emit("mensagens", msg);**, de boa ate ai né? 
Essa parte terminamos, vamos agora atualizar o total de usuários online quando alguém desconectar, então fazemos:

{% highlight javascript %}
socket.on("disconnect", function(){
	console.log("Usuario Desconectado");
	usuarios--;
	io.emit("usuarios online", usuarios);
});
{% endhighlight %}

Tiramos *um* da variável *usuarios* e enviamos para todos com o novo valor.
Terminamos a parte do socket.io, falta definirmos a porta do nosso http para iniciar, então no fim do código escrevemos:

{% highlight javascript %}
http.listen(4000);
{% endhighlight %}

Nosso **app.js** esta acabado, deverá ficar assim:

{% highlight javascript %}
var http = require("http").createServer(servidor);
var io = require("socket.io").listen(http);
var fs = require("fs");

var usuarios = 0;

function servidor(req, res){
	res.writeHead(200);
	res.end(fs.readFileSync("view/index.html"));
}

io.on("connection", function(socket){
	console.log("Usuário Conectado");
	usuarios++;

	io.emit("usuarios online", usuarios);
	socket.on("mensagem", function(msg){
		io.emit("mensagens", msg);
	});


	socket.on("disconnect", function(){
		console.log("Usuario Desconectado");
		usuarios--;
		io.emit("users", usuarios);
	});
});


http.listen(4000);
{% endhighlight %}

Agora crie uma pasta no seu projeto com o nome de *view*, nela crie o arquivo **index.html** e digite:

{% highlight html %}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<title>Chat</title>
	<script src="/socket.io/socket.io.js"></script> <!-- chamamos o socket.io que por padrão o socket.io cria a rota http sem precisarmos interferir -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css"> <!-- bootstrap -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script><!-- jquery -->
	<script type="text/javascript">
	var socket = io.connect(); //isso é necessário para fazer a conexão com o socket.io do node.js

	//quando recebemos do node.js "mensagens" utilizando o método append do jquery para exibir as mensagens
	socket.on('mensagens', function(msg){
		$('.container').append($('<div class="alert alert-success">').text(msg));
	});

	//quando recebemos "usuarios online" do node.js
	socket.on("usuarios online", function(total){
		$('.container').append($('<div class="alert alert-info">').text("Novo Usuario entrou, total de " + total + " Usuarios Online"));
	});

	//função que é disparada quando é pressionado o botão
	function enviarMsg(){
		socket.emit("mensagem", $("#inputMsg").val()); //enviamos o valor do input
		$("#inputMsg").val(''); //depois deixamos ele vazio
	}
	</script>
</head>
<body>
	<div class="container">
		<!--Mensagens ficam aqui-->
	</div>

	<div style="background-color:#2c3e50; width:100%; height:50px; position:fixed; bottom:0; padding:9px;" class="row">
		<div class="col-md-10">
			<input type="text" class="form-control col-md-11" id="inputMsg">
		</div>			
		<a onclick="enviarMsg()" class="btn btn-success">Enviar</a>
	</div>
</body>
</html>
{% endhighlight %}

Não vou explicar html pois esse não é o foco do blog, mas peço que notem como enviamos e recebemos do node.js as mensagens, etc, são as mesmas funções que utilizamos, no node.js, **.on() e .emit()** e elas funcionam da mesma forma.
Agora abra o **terminal** ou **prompt de comando** e rode o app:

	node app.js 

Abra seu navegador e acesse http://localhost:4000/ vão ver um input e um botão no canto inferior da pagina, digite a mensagem e clique em enviar, o legal é você abrir em vários navegadores, ou abas para verem as coisas funcionando em tempo real; Fácil ? pois bem para mais informações sobre o socket.io acessem o site deles [http://socket.io/](http://socket.io/) la tem outros 2 exemplos de como utilizar ele. em caso de duvidas comente ai a baixo ok?, fiquem ligados para a próxima postagem, Fui. 