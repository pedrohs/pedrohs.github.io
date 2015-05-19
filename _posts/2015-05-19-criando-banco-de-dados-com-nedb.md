---
layout: post
title:  "Criando banco de dados com neDB"
date:   2015-05-19 09:53:10
description: Hoje apresento a vocês o neDB, um banco de dados que não precisa de instalação, e que trabalha no formato Json e extremamente simples!
tags: [nodejs, banco de dados]
image:
  feature: background-3.jpeg
---
[neDB](https://github.com/louischatriot/nedb) é um banco de dados que não necessita de instalação, trabalha no formato json e muito rapido!

## Instalação ##
Para instalar basta ir no diretório do seu projeto e rodar o comando:

    npm install nedb

Como todo modulo Node.js é instalado.

Crie um arquivo *.js* para começarmos a digitar nosso código node:

{% highlight javascript %}
var nedb = require('nedb');
var db = new nedb({filename: 'banco.db', autoload: true});
{% endhighlight %}

Na primeira linha definimos o modulo do **neDB** e em seguida criamos o banco de dados usando o **new**, aonde o *filename* é o local e o nome do arquivo do banco de dados, o *autoload* faz o carregamento automático do banco de dados caso ele já exista no diretório definido no *filename*.

## Vamos criar agora um CRUD ##
Para quem não sabe [*CRUD*](http://pt.wikipedia.org/wiki/CRUD) significa: *Criar, Recuperar, Atualizar e Deletar* ou seja vamos criar um objeto, inserir em nosso DB, depois recuperá-lo, atualizá-lo, etc.

Inserindo novo documento:
-------

vamos criar um objeto usuário, para isso fazemos:

{% highlight javascript %}
var usuario = {
	nome: "Pedro Henrique",
	idade: 18,
	email: "pedro@gmail.com",
	senha: 123456789
};
{% endhighlight %}

Para inserir usamos:

{% highlight javascript %}
db.insert(usuario, function(err){
 if(err)return console.log(err); //caso ocorrer algum erro

 console.log("Novo usuário adicionado!");
});
{% endhighlight %}

Fácil ?
Veja que se você ir no diretorio aonde definiu o banco de dados, irá aparecer o arquivo que você definiu e dentro dele estará algo parecido com isso:

{% highlight json %}
{"nome":"Pedro Henrique","idade":18,"email":"pedro@gmail.com","senha":123456789,"_id":"vxJMEAMBFLmkUmKY"}
{% endhighlight %}

Veja que ele já atribui um **_id** ao nosso objeto, oque facilita bastante quando precisarmos procurar por ele para remover, atualizar etc.

Recuperando um documento:
-------
Para recuperarmos todos os documentos pelo nome que definimos no usuário usamos:

{% highlight javascript %}
db.find({ nome: 'Pedro Henrique' }, function (err, usuarios) {
 if(err)return console.log(err);
 console.log(usuarios);
});
{% endhighlight %}

o console ira retornar algo parecido como isto:
{% highlight javascript %}
[ { nome: 'Pedro Henrique',
    idade: 18,
    email: 'pedro@gmail.com',
    senha: 123456789,
    _id: 'vxJMEAMBFLmkUmKY' } ]
{% endhighlight %}

Se quisermos procurar pela idade:
{% highlight javascript %}
db.find({ idade: 18 }, function (err, usuarios) {
 if(err)return console.log(err);
 console.log(usuarios);
});
{% endhighlight %}

Ou e-mail:
{% highlight javascript %}
db.find({ email: 'pedro@gmail.com' }, function (err, usuarios) {
 if(err)return console.log(err);
 console.log(usuarios);
});
{% endhighlight %}

Se você quiser procurar um único documento usamos o findOne:
{% highlight javascript %}
db.findOne({ email: 'pedro@gmail.com' }, function (err, usuarios) {
 if(err)return console.log(err);

 console.log(usuarios);
});
{% endhighlight %}

Atualizando um documento:
-------
Para substituir um documento inteiro usamos:

{% highlight javascript %}
db.update({ email: 'pedro@gmail.com' }, {nome: "Carlos", email: "carlos@gmail.com"}, {}, function (err) {
 if(err)return console.log(err);

 console.log("Usuário atualizado");
});
{% endhighlight %}

o documento que antes era assim:

{% highlight json %}
{"nome":"Pedro Henrique","idade":18,"email":"pedro@gmail.com","senha":123456789,"_id":"vxJMEAMBFLmkUmKY"}
{% endhighlight %}

passou a ficar assim:

{% highlight json %}
{ "nome": "Carlos", "email": "carlos@gmail.com",  "_id": "vxJMEAMBFLmkUmKY" }
{% endhighlight %}

Agora para atualizar apenas um campo sem alterar todo o documento usamos o *$set*, veja:

{% highlight javascript %}
db.update({ email: 'pedro@gmail.com' }, {$set {idade: 19}}, {}, function (err) {
 if(err)return console.log(err);

 console.log("Usuário atualizado");
});
{% endhighlight %}

o documento que antes era assim:
{% highlight json %}
{"nome":"Pedro Henrique","idade":18,"email":"pedro@gmail.com","senha":123456789,"_id":"vxJMEAMBFLmkUmKY"}
{% endhighlight %}

passou a ficar assim:
{% highlight json %}
{"nome":"Pedro Henrique","idade":19,"email":"pedro@gmail.com","senha":123456789,"_id":"vxJMEAMBFLmkUmKY"}
{% endhighlight %}

A idade foi atualizada e manteve o restante do documento intacto.

Removendo um documento:
-------
Para removermos um documento usamos:
{% highlight javascript %}
db.remove({ _id: "vxJMEAMBFLmkUmKY" }, {}, function (err) {
  if(err)return console.log(err);

  console.log("Usuário removido");
});
{% endhighlight %}

Podemos remover usando o campo nome para procurarmos o documento:
{% highlight javascript %}
db.remove({nome: "Pedro Henrique" }, {}, function (err) {
  if(err)return console.log(err);

  console.log("Usuário removido");
});
{% endhighlight %}

Para removermos mais de um documento ao mesmo tempo usamos a opção *multi*:
{% highlight javascript %}
db.remove({nome: "Pedro Henrique" }, {multi: true}, function (err) {
  if(err)return console.log(err);

  console.log("Usuário removido");
});
{% endhighlight %}

Acho que esse é um resumão do **neDB** para saber mais informações acesse: [https://github.com/louischatriot/nedb](https://github.com/louischatriot/nedb) tem muito mais opções la, basta da uma olhada, para quem quer usar em projetos simples com o arduino o neDB é muito bom, utilizei ele no meu projeto de [*Umidade do solo*](https://github.com/pedrohs/umidade-solo-arduino) para salvar as informações de umidade, configurações do rele etc, qualquer coisa comente ai, ate mais! 
