
# [Zombie Escape 2](https://projeto-de-algoritmos.github.io/Final_ZombieEscape_2/)

**Número da Lista**: 6<br>
**Conteúdo da Disciplina**: Final<br>

## Alunos
|Matrícula | Aluno |
| -- | -- |
| 17/0109208  |  Luis Henrique Pereira Taira |
| 17/0102343  |  Eduardo Vieira Lima |

## Sobre 
Zombie Escape 2 é a evolução do [Zombie Escape](https://projeto-de-algoritmos.github.io/Grafos1_ZombieEscape/), um jogo em que vc tem que matar os dois inimigos para vencer.

[Clique aqui](https://projeto-de-algoritmos.github.io/Final_ZombieEscape_2/) para jogar.

## Screenshots



## Instalação 
**Linguagem**: Javascript<br>
**Framework**: Phaser3<br>
### Para rodar localmente:
* Baixe ou clone este repositório
* Navegue até o diretório raiz do projeto e rode o comando:
```
$ python -m http.server 8080
```
ou use qualquer servidor http de sua preferência.
* Em um navegador (google chrome recomendado), vá para o endereço `localhost:8080`

## Uso
* Para jogar, clique na janela do jogo para que seu mouse seja capturado.
* Movimente-se com as teclas w, a, s e d.
* Mova a mira com o mouse.
* Depois de pegar uma arma, atire com o botão esquerdo do mouse.
* Mate todos os zumbis para ganhar

## Outros 
Foram utilizados grafos, a função BFS e BellmanFord para simular a inteligêcia dos zumbis.
Os zumbis são capazes de chegar até o player mesmo quando existem obstáculos no caminho.
O zumbi normal usa a função BFS para encontrar o player e o zumbi de gelo usa a função BellmanFord e anda três vezes mais rápido no gelo.
