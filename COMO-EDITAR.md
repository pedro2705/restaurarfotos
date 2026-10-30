# Como editar o site sem precisar do Claude

Tudo que muda com frequência fica em dois lugares:

- **`config.js`**: contatos, preços, textos dos serviços e caminhos das mídias.
- **pasta `midia/`**: vídeos e imagens dos serviços, do "Sobre mim" e dos depoimentos.

Depois de qualquer mudança no GitHub, o site atualiza sozinho em cerca de 1 minuto.

---

## 1. Trocar um vídeo ou imagem (o jeito mais fácil)

Cada espaço do site já espera um arquivo com um nome certo. É só subir o seu arquivo **com o mesmo nome**.

| Onde aparece no site | Arquivo esperado |
|---|---|
| Serviço "Restauração de fotos" | `midia/servicos/restauracao.jpg` |
| Serviço "Memórias em vídeo" | `midia/servicos/memorias-video-2.mp4` |
| Serviço "Casamento de volta à vida" | `midia/servicos/casamento.mp4` |
| Serviço "Remoção de pessoas" | `midia/servicos/remocao-pessoas.mp4` |
| Serviço "Troca de fundo e cenário" | `midia/servicos/troca-de-fundo.mp4` |
| Serviço "Edição e montagens" | `midia/servicos/edicao-montagens.mp4` |
| Seção "Memórias em vídeo" (2 vídeos) | `midia/servicos/memorias-video-1.mp4` e `memorias-video-2.mp4` |
| Animação do "Sobre mim" | `midia/sobre/eu.mp4` (capa: `eu.jpg`) |

Enquanto o arquivo não existe, o site mostra uma capa provisória elegante no lugar.

**No GitHub:**

1. Abra o repositório e entre na pasta (ex.: `midia` → `servicos`).
2. Clique em **Add file › Upload files**.
3. Arraste o arquivo com o nome exato da tabela.
4. Clique em **Commit changes**. Se já existia um arquivo com esse nome, ele é substituído.

**Capa do vídeo (opcional):** suba uma imagem `.jpg` com o mesmo nome do vídeo (ex.: `casamento.jpg` ao lado de `casamento.mp4`). Ela aparece enquanto o vídeo carrega.

### Quero usar outro nome ou formato

Abra `config.js`, clique no lápis e troque o caminho na parte `midias`. Vale `.mp4`, `.webm`, `.jpg`, `.png` e `.webp`. O site decide sozinho se é vídeo ou imagem pela extensão.

```js
casamento: "midia/servicos/bodas-de-ouro.jpg",
```

---

## 2. Regras para os vídeos ficarem leves

- **Formato:** MP4 (H.264), **sem áudio**.
- **Tamanho:** vertical 9:16 ou 4:5, com 540 px de largura. Até **2 MB** cada.
- **Duração:** de 6 a 12 segundos, em loop.
- **Para comprimir:** HandBrake (grátis) com o preset "Web" e a qualidade em RF 26, ou o site *freeconvert.com*.
- Os vídeos só carregam quando a pessoa chega na seção. Por isso o site continua rápido.

O vídeo do "Sobre mim" deve ter o fundo **#0d0b09** (quase preto), o mesmo da seção, para se fundir a ela. Se você tiver um GIF com fundo transparente, me mande: eu converto para MP4 com esse fundo, o que deixa o arquivo cerca de 35 vezes menor.

---

## 3. Mudar preços, contatos e textos

Abra `config.js` e clique no lápis (**Edit this file**).

Os textos que mudam com frequência ficam em três idiomas lado a lado: `pt` (português), `en` (inglês) e `es` (espanhol). Os preços têm `brl` (reais, usados no site em português) e `usd` (dólares, usados em inglês e espanhol).

- **WhatsApp:** `whatsapp: "5521968709575"` (DDI + DDD + número, só números) e `whatsappVisivel`, que é o número escrito no rodapé.
- **Instagram:** `instagram: "restaurar.fotos"` (sem o @).
- **E-mail:** `email: "voce@exemplo.com"`. Vazio esconde o e-mail do rodapé.
- **Preços:** em `homenagem` e `pacotes`, troque só os números (ex.: `preco: { brl: 89, usd: 29 }`).
- **Adicionais e descontos:** em `adicionais` e `volume`.
- **Serviços:** em `servicos` você muda título, texto, preço e a mensagem que já chega pronta no WhatsApp.

Mexa só no que está **entre aspas** ou nos números. Não apague vírgulas, chaves `{ }` ou colchetes `[ ]`. Se o site ficar em branco depois de uma edição, quase sempre foi uma vírgula ou aspas apagada. Desfaça pelo histórico do arquivo (**History**).

---

## 4. Antes e depois

- **Carrossel:** suba as imagens em `img/antes-depois/` e liste-as em `antesDepois` no `config.js`. Use sempre o **antes à esquerda** e o **depois à direita**.
- **Comparador com a linha de arrastar:** usa os pares `img/comparar/NOME-antes.jpg` e `NOME-depois.jpg` (jovem, mulher, menino, ruiva), alinhados e no formato 4:5. Para trocar, mantenha os mesmos nomes.

## 5. Depoimentos

Suba os prints em `midia/depoimentos/` e liste-os em `depoimentos` no `config.js`:

```js
depoimentos: ["midia/depoimentos/1.jpg", "midia/depoimentos/2.jpg"]
```

Com a lista vazia, a seção fica escondida.

## 6. Foto da abertura

A foto que se restaura com a rolagem é `img/hero/retrato.jpg`. Se trocar, ajuste em `config.js` a posição dos olhos (`hero.olhos`), que é onde aparece a seleção da etapa "O olhar":

```js
hero: { foto: "img/hero/retrato.jpg", olhos: [0.48, 0.633] }
```

O primeiro número vai de 0 (esquerda) a 1 (direita). O segundo vai de 0 (embaixo) a 1 (em cima).

## 7. Olhares do final

Os pares `img/olhos/NOME-antes.jpg` e `NOME-depois.jpg` precisam ter **o mesmo enquadramento**, com os olhos na mesma posição nas duas imagens, para a transformação ficar suave. Use a proporção 3,2 : 1, com 800 px de largura.

## 8. Os três idiomas

O site tem três páginas: `index.html` (português), `en/index.html` (inglês) e `es/index.html` (espanhol). Os botões PT · EN · ES no topo e no rodapé levam de uma para a outra.

- Textos fixos de cada página (títulos, perguntas frequentes, passos) ficam dentro de cada `index.html`. Para mudar um deles, edite as três páginas.
- Textos de serviços, pacotes e adicionais ficam no `config.js`, com `pt`, `en` e `es`.

## 9. Quando comprar os domínios

Hoje os endereços que o Google lê apontam para `pedro2705.github.io/restaurarfotos`. Quando você comprar o `.com.br` (português) e o `.com` (inglês em `/en` e espanhol em `/es`), esses endereços precisam ser trocados em 5 lugares: o topo das três páginas, o `sitemap.xml` e o `robots.txt`. Me peça e eu gero tudo pronto, junto com o passo a passo de DNS.
