
4.1.1 INTEGRANDO A APLICAÇÂO COM O SPOTIFY


O primeiro passo para começar a integrar uma aplicação ao Spotify é registrar essa aplicação, para isso, é preciso acessar o site https://developer.spotify.com, criar uma conta ou autenticar-se, navegar até a aba Dashboard e criar uma nova aplicação, para isso será necessário fornecer um nome e uma descrição para a aplicação a ser criada, além de aceitar os termos de serviços da plataforma.
Uma vez criada a aplicação no Dashboard do Spotify, tem-se o acesso a duas informações que são essenciais para a integração, que são o Client ID e o Client Secret, essas informações deverão ser armazenadas de forma segura dentro do projeto da aplicação pois elas serão enviadas no momento de realizar as chamadas à API de autenticação do Spotify.
O próximo passo da integração é decidir qual o fluxo de autenticação que será utilizado, este processo consiste em solicitar a autorização do usuário do Spotify para acessar os seus dados, isso pode ocorrer através de quatro fluxos diferentes:

Fluxo	Acessa recursos do usuário	Requer o Client Secret	Renovação do acesso
Authorization Code	Sim	Sim	Sim
Authorization Code With PKCE	Sim	Não	Sim
Client Credentials	Não	Sim	Não
Implicit Grant	Sim	Não	Não
Fonte: SPOTIFY

Neste projeto será utilizado o fluxo Authorization Code pois a plataforma irá precisar consumir informações do usuário do Spotify, como por exemplo a música atual em execução, iremos utilizar o Client Secret, visto que já criamos uma aplicação no Dashboard do Spotify já possuímos essa informação para fornecer, além disso, também iremos precisar renovar o acesso, visto que é uma aplicação que terá um acesso constante ao Spotify.
Para solicitar autorização através do método Authorization Code é necessário realizar uma chamada à API REST do Spotify, essa chamada irá redirecionar o usuário à página de login do Spotify onde o mesmo irá fornecer os seus dados de acesso e concordar com o uso dos dados por parte da plataforma LUNA, os detalhes dessa chamada são os seguintes:

GET https://accounts.spotify.com/authorize 

Os seguintes parâmetros de query deverão ser passados a essa chamada:

Parâmetro	Valor	Obrigatório
client_id	Disponível no Dashboard ao registrar a aplicação	Sim
response_type	Deve ser “code”	Sim
redirect_uri	URL a qual o usuário será redirecionado após autorizar o uso dos dados	Sim
state	Previne ataques do tipo cross-site	Não, mas recomendado
scope	Define o escopo de quais informações estaremos acessando do usuário, para nossa aplicação o escopo mais relevante é o “user-read-currently-playing”	Não, mas recomendado
show_dialog	Deverá ser passado como true ou false, este parâmetro define se o usuário irá precisar aceitar o uso dos dados toda vez que realizar login (true) ou apenas na primeira (false)	Não
Fonte: Elaborado pelo autor

Após ser redirecionado para a página do Spotify e aceitar o uso dos dados por parte da plataforma, em caso de sucesso, o usuário será redirecionado para a URL fornecida por parâmetro em “redirect_uri” porém com dois parâmetros de query, que são o “code” e o “state”. A aplicação deverá utilizar o parâmetro de query “code” para obter o token que é de fato enviado nas requisições à API do Spotify, para realizar essa troca, é necessário realizar uma nova chamada:

POST https://accounts.spotify.com/api/token

O corpo dessa requisição do tipo POST deverá conter todos os seguintes parâmetros de forma obrigatória codificados no formato application/x-www-form-urlencoded

Parâmetro	Valor
grant_type	Deve ser “authorization_code”
code	O parâmetro “code” obitido através dos parâmetros de query da chamada /authorize
redirect_uri	Deverá ser a mesma URL informada na chamada /authorize apenas para fins de validação, não há redirecionamento de fato nesta chamada.
client_id	O Client ID que está armazenado na aplicação, disponível no Dashboard do Spotify
client_secret	O Client Secret armazenado na aplicação, disponível no Dashboard do Spotify


Ao obter sucesso nessa chamada, deverá ser retornado um JSON com as seguintes informações

{
    "access_token": "BQCj0qu...OHlA7oczuc",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "AQARiyy…BHALG4",
    "scope": "user-read-currently-playing"
}

Agora, é necessário apenas adicionar no “Header” das requisições feitas à API do Spotify o access_token em formato Bearer que a aplicação já possuirá acesso a todas as informações do escopo solicitado por parâmetro.

4.2 OBTENDO AS LETRAS DAS MÚSICAS


Para que a integração com a plataforma LUNA com relação as letras das músicas, a aplicação precisa permitir ter acesso à letra das músicas através de uma API na qual seja possível passar o nome do artista e nome da música, além de ser possível obter a letra de forma sincronizada com a música, retornando cada trecho da música junto com o tempo em que é reproduzido. Neste trabalho o produto a qual faremos a integração para obter as letras das musicas é o Musixmatch, pois além de atender os critérios necessários, a empresa possui o maior catálogo de letras de músicas do mundo (7 Milhões de letras em 80 idiomas diferentes), uma comunidade global que contribui para a manutenção e atualização das letras, além de utilizar as mesmas tecnologias utilizadas neste projeto.

5.2.1 INTEGRANDO A APLICAÇÂO COM O MUSIXMATCH


A integração com o Musixmatch possui semelhanças com a integração com o Spotify já demonstrada, porém é mais simples e não possui tantos passos. A primeira coisa a se fazer é acessar https://developer.musixmatch.com clicar em “login” para se autenticar ou “sign up” para criar uma nova conta. Uma vez autenticado, vá até o perfil do usuário clicando sobre o “username” no canto direito superior e então clique em “Dashboard” e por fim em “Applications”, aqui será necessário registrar a aplicação, após o registro será disponibilizado um “API key”, essa chave deverá ser utilizada nas chamadas à API do Musixmatch de acordo com esse exemplo:

 GET https://api.musixmatch.com/ws/1.1/track.search

Os seguintes parâmetros de query deverão ser passados a essa chamada:

Parâmetro	Valor
q_artist	Filtro por nome de artista
q_track	Filtro por nome de música
apikey	Chave da API registrada no dashboard do Musixmatch


Como resultado dessa chamada será retornado um JSON no seguinte formato

{
  "message": {
    "header": {
      "status_code": 200,
      "execute_time": 0.00136,
      "available": 646
    },
    "body": {
      "track_list": [
        {
          "track": {
                        "track_id": track_id,
                        "track_name": "Track Name",
                        "track_name_translation_list": []
                    …
        },
          "track": {
                        "track_id": track_id,
                        "track_name": "Track Name",
                        "track_name_translation_list": []
                    …
        },
          "track": {
                        "track_id": track_id,
                        "track_name": "Track Name",
                        "track_name_translation_list": []
                    …
        },
      ]
    }
  }
}

Após realizar a chamada pelo artista e pelo nome da música e obter o valor do “track_id” referente a música desejada podemos realizar diretamente a chamada para buscar a letra da música

 GET https://api.musixmatch.com/ws/1.1/track.lyrics.get

Os seguintes parâmetros de query deverão ser passados a essa chamada:
Parâmetro	Valor
track_id	Identificador da música obitido na chamada /track.search
apikey	Chave da API registrada no dashboard do Musixmatch

Ao obter sucesso nessa chamada, deverá ser retornado um JSON no seguinte formato
{
  "message": {
    "header": {
      "status_code": 200,
      "execute_time": 0.04367995262146
    },
    "body": {
      "lyrics": {
        "lyrics_id": 7260188,
        "restricted": 0,
        "instrumental": 0,
        "lyrics_body": "Now and then I think of when we were together\r\n...",
        "lyrics_language": "en",
        "script_tracking_url": "http:\/\/tracking.musixmatch.com\/t1.0\/m42By\/J7rv9z",
        "pixel_tracking_url": "http:\/\/tracking.musixmatch.com\/t1.0\/m42By\/J7rv9z6q9he7AA",
        "lyrics_copyright": "Lyrics powered by www.musiXmatch.com",
        "backlink_url:" "https://www.musixmatch.com/lyrics/Gotye-feat-Kimbra/Somebody-That-I-Used-to-Know"
        "updated_time": "2012-04-26T02:09:39Z"
      }
    }
  }
}


Através da propriedade “lyrics body” é possível obter a letra da música, e com essas duas chamadas realizadas temos o resultado esperado que seria a busca da letra através do nome do artista e do nome da música.
