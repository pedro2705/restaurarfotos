/* =====================================================================
   CONFIGURAÇÃO DO SITE — edite só os textos entre aspas e os números.
   No GitHub: abra este arquivo, clique no lápis (Edit), altere e clique
   em "Commit changes". O site atualiza em cerca de 1 minuto.
   pt = português · en = inglês · es = espanhol
   Preços: brl = reais (site em português) · usd = dólares (inglês e espanhol)
   Passo a passo completo em COMO-EDITAR.md
   ===================================================================== */

window.SITE = {

  /* ---------- CONTATO ---------- */
  whatsapp: "5521968709575",      // DDI + DDD + número, só números
  whatsappVisivel: "+55 21 96870-9575",
  instagram: "restaurar.fotos",   // sem o @
  email: "",                      // deixe vazio para esconder
  mensagem: {
    pt: "Olá! Vim pelo site e quero um orçamento para restaurar uma foto.",
    en: "Hi! I found your website and would like a quote to restore a photo.",
    es: "¡Hola! Vi tu sitio web y quiero un presupuesto para restaurar una foto."
  },

  /* ---------- NÚMEROS ---------- */
  anos: 5,
  fotosRestauradas: 1000,

  /* ---------- FOTO DA ABERTURA ----------
     olhos = centro dos olhos na foto [horizontal, vertical], de 0 a 1,
     medidos a partir do canto INFERIOR esquerdo.
     caixa = meia largura e meia altura da seleção dos olhos. */
  hero: { foto: "img/hero/retrato.jpg", olhos: [0.496, 0.578], caixa: [0.115, 0.052] },

  /* ---------- MÍDIAS ----------
     Para trocar: suba o arquivo novo na pasta indicada com o MESMO nome.
     Outro nome ou formato (.jpg, .png, .webp, .mp4, .webm)? Troque o
     caminho aqui. Caminho vazio "" = mostra a capa provisória. */
  midias: {
    sobreMim:        "midia/sobre/eu.mp4",
    restauracao:     "midia/servicos/restauracao.jpg",
    memoriasVideo:   "midia/servicos/memorias-video-2.mp4",
    casamento:       "midia/servicos/casamento.mp4",
    remocaoPessoas:  "midia/servicos/remocao-pessoas.mp4",
    trocaFundo:      "midia/servicos/troca-de-fundo.mp4",
    edicaoMontagens: "midia/servicos/edicao-montagens.mp4"
  },

  /* ---------- MEMÓRIAS EM VÍDEO (foto original + vídeo) ---------- */
  memorias: [
    { foto: "img/comparar/menino-antes.jpg", video: "midia/servicos/memorias-video-1.mp4" },
    { foto: "img/comparar/ruiva-antes.jpg",  video: "midia/servicos/memorias-video-2.mp4" }
  ],

  /* ---------- SERVIÇOS ---------- */
  servicos: [
    { midia: "restauracao",
      titulo:   { pt: "Restauração de fotos", en: "Photo restoration", es: "Restauración de fotos" },
      texto:    { pt: "Poeira, riscos, rasgos, mofo e cor apagada. Preservando o rosto de verdade.", en: "Dust, scratches, tears, mold and faded color, keeping the real face intact.", es: "Polvo, rayas, rasgones, moho y color apagado, preservando el rostro real." },
      preco:    { pt: "a partir de R$ 59", en: "from US$ 19", es: "desde US$ 19" },
      mensagem: { pt: "Olá! Quero um orçamento de restauração.", en: "Hi! I'd like a quote for a restoration.", es: "¡Hola! Quiero un presupuesto de restauración." } },
    { midia: "memoriasVideo",
      titulo:   { pt: "Memórias em vídeo", en: "Memories in motion", es: "Recuerdos en video" },
      texto:    { pt: "A foto antiga ganha movimento sutil: um olhar, um sorriso, a respiração. Perfeito para homenagens.", en: "The old photo gains subtle motion: a glance, a smile, a breath. Perfect for tributes.", es: "La foto antigua gana movimiento sutil: una mirada, una sonrisa, la respiración. Ideal para homenajes." },
      preco:    { pt: "+ R$ 49 na restauração", en: "+ US$ 15 with a restoration", es: "+ US$ 15 con la restauración" },
      mensagem: { pt: "Olá! Quero transformar uma foto antiga em vídeo.", en: "Hi! I'd like to turn an old photo into a video.", es: "¡Hola! Quiero convertir una foto antigua en video." } },
    { midia: "casamento",
      titulo:   { pt: "Casamento de volta à vida", en: "Wedding photos brought back to life", es: "Bodas de vuelta a la vida" },
      texto:    { pt: "A foto do casamento restaurada e animada em vídeo, pronta para as bodas ou para emocionar a família.", en: "The wedding photo restored and animated into a video, ready for an anniversary or a family surprise.", es: "La foto de boda restaurada y animada en video, lista para un aniversario o para emocionar a la familia." },
      preco:    { pt: "orçamento rápido", en: "quick quote", es: "presupuesto rápido" },
      mensagem: { pt: "Olá! Quero restaurar e animar uma foto de casamento.", en: "Hi! I'd like to restore and animate a wedding photo.", es: "¡Hola! Quiero restaurar y animar una foto de boda." } },
    { midia: "remocaoPessoas",
      titulo:   { pt: "Remoção de pessoas", en: "Person removal", es: "Eliminar personas" },
      texto:    { pt: "Tiro quem não deveria estar na foto e reconstruo o fundo como se nunca tivesse estado ali.", en: "I remove whoever shouldn't be in the photo and rebuild the background as if they were never there.", es: "Quito a quien no debería estar en la foto y reconstruyo el fondo como si nunca hubiera estado." },
      preco:    { pt: "orçamento rápido", en: "quick quote", es: "presupuesto rápido" },
      mensagem: { pt: "Olá! Quero remover uma pessoa de uma foto.", en: "Hi! I'd like to remove a person from a photo.", es: "¡Hola! Quiero quitar a una persona de una foto." } },
    { midia: "trocaFundo",
      titulo:   { pt: "Troca de fundo e cenário", en: "Background replacement", es: "Cambio de fondo" },
      texto:    { pt: "Um novo cenário com luz e sombra coerentes, para retratos, perfis profissionais e homenagens.", en: "A new setting with consistent light and shadow, for portraits, professional profiles and tributes.", es: "Un nuevo escenario con luz y sombra coherentes, para retratos, perfiles profesionales y homenajes." },
      preco:    { pt: "orçamento rápido", en: "quick quote", es: "presupuesto rápido" },
      mensagem: { pt: "Olá! Quero trocar o fundo de uma foto.", en: "Hi! I'd like to replace the background of a photo.", es: "¡Hola! Quiero cambiar el fondo de una foto." } },
    { midia: "edicaoMontagens",
      titulo:   { pt: "Edição e montagens", en: "Editing and composites", es: "Edición y montajes" },
      texto:    { pt: "Unir pessoas de fotos diferentes, trocar roupas, colorizar e qualquer manipulação de imagem.", en: "Bringing people from different photos together, changing clothes, colorizing and any image manipulation.", es: "Unir personas de fotos distintas, cambiar ropa, colorear y cualquier manipulación de imagen." },
      preco:    { pt: "orçamento rápido", en: "quick quote", es: "presupuesto rápido" },
      mensagem: { pt: "Olá! Quero um orçamento de edição de imagem.", en: "Hi! I'd like a quote for image editing.", es: "¡Hola! Quiero un presupuesto de edición de imagen." } }
  ],

  /* ---------- PACOTES ---------- */
  homenagem: {
    nome:   { pt: "Pacote Homenagem", en: "Tribute Package", es: "Paquete Homenaje" },
    preco:  { brl: 149, usd: 49 },
    precoDe:{ brl: 177, usd: 61 },
    texto:  { pt: "Para presentear e emocionar. O mais pedido em datas especiais.", en: "Made for gifting. The most requested option for special dates.", es: "Para regalar y emocionar. El más pedido en fechas especiales." },
    itens:  { pt: ["Restauração Completa", "Colorização", "Foto animada em vídeo", "Arquivo pronto para imprimir e para o WhatsApp"],
              en: ["Complete restoration", "Colorization", "Animated photo video", "Files ready to print and to share"],
              es: ["Restauración Completa", "Colorización", "Foto animada en video", "Archivo listo para imprimir y compartir"] }
  },
  pacotes: [
    { nome: { pt: "Essencial", en: "Essential", es: "Esencial" }, preco: { brl: 59, usd: 19 },
      texto: { pt: "Poeira, manchas, desbotado e riscos leves.", en: "Dust, stains, fading and light scratches.", es: "Polvo, manchas, decoloración y rayas leves." } },
    { nome: { pt: "Completa", en: "Complete", es: "Completa" }, preco: { brl: 89, usd: 29 },
      texto: { pt: "Dobras, rachaduras, rasgos e cor muito apagada.", en: "Folds, cracks, tears and heavily faded color.", es: "Dobleces, grietas, rasgones y color muy apagado." },
      selo:  { pt: "Mais escolhida", en: "Most chosen", es: "La más elegida" } },
    { nome: { pt: "Reconstrução", en: "Reconstruction", es: "Reconstrucción" }, preco: { brl: 139, usd: 45 },
      texto: { pt: "Partes faltando, rosto apagado, mofo e rasgos grandes.", en: "Missing parts, faded faces, mold and large tears.", es: "Partes faltantes, rostro borrado, moho y rasgones grandes." } }
  ],
  incluso: {
    pt: ["50% para começar, 50% na entrega", "Prévia com garantia de devolução", "Arquivo em alta resolução", "1 rodada de ajustes", "Entrega em até 48 h úteis"],
    en: ["50% to start, 50% on delivery", "Preview with refund guarantee", "High-resolution file", "1 round of revisions", "Delivery within 2 business days"],
    es: ["50% para empezar, 50% en la entrega", "Vista previa con garantía de devolución", "Archivo en alta resolución", "1 ronda de ajustes", "Entrega en 2 días hábiles"]
  },
  adicionais: [
    { nome: { pt: "Colorização", en: "Colorization", es: "Colorización" }, valor: { pt: "+ R$ 39", en: "+ US$ 12", es: "+ US$ 12" } },
    { nome: { pt: "Foto animada em vídeo", en: "Animated photo video", es: "Foto animada en video" }, valor: { pt: "+ R$ 49", en: "+ US$ 15", es: "+ US$ 15" } },
    { nome: { pt: "Mais de 3 pessoas na foto", en: "More than 3 people in the photo", es: "Más de 3 personas en la foto" }, valor: { pt: "+ R$ 20", en: "+ US$ 6", es: "+ US$ 6" } },
    { nome: { pt: "Urgência, entrega em 24 h", en: "Rush, 24 h delivery", es: "Urgencia, entrega en 24 h" }, valor: { pt: "+ 50%", en: "+ 50%", es: "+ 50%" } },
    { nome: { pt: "Incluir ou remover pessoa", en: "Add or remove a person", es: "Añadir o quitar una persona" }, valor: { pt: "R$ 60 por pessoa", en: "US$ 19 per person", es: "US$ 19 por persona" } },
    { nome: { pt: "Vale-presente digital", en: "Digital gift card", es: "Tarjeta regalo digital" }, valor: { pt: "valor do serviço", en: "service price", es: "precio del servicio" } }
  ],
  volume: {
    pt: ["3 fotos: 10% de desconto", "5 fotos ou mais: 15% de desconto", "Álbum com mais de 10 fotos: orçamento especial"],
    en: ["3 photos: 10% off", "5 photos or more: 15% off", "Albums of more than 10 photos: special quote"],
    es: ["3 fotos: 10% de descuento", "5 fotos o más: 15% de descuento", "Álbum de más de 10 fotos: presupuesto especial"]
  },

  /* ---------- ANTES E DEPOIS (carrossel) ---------- */
  antesDepois: [
    { foto: "img/antes-depois/mulher.jpg",   texto: { pt: "Retrato de mulher", en: "Portrait of a woman", es: "Retrato de mujer" } },
    { foto: "img/antes-depois/crianca.jpg",  texto: { pt: "Retrato de criança", en: "Child portrait", es: "Retrato de niña" } },
    { foto: "img/antes-depois/mulher2.jpg",  texto: { pt: "Retrato de jovem", en: "Portrait of a young woman", es: "Retrato de joven" } },
    { foto: "img/antes-depois/casal.jpg",    texto: { pt: "Pai e filho", en: "Father and son", es: "Padre e hijo" } },
    { foto: "img/antes-depois/vestidos.jpg", texto: { pt: "Duas irmãs", en: "Two sisters", es: "Dos hermanas" } },
    { foto: "img/antes-depois/jovem.jpg",    texto: { pt: "Retrato de rapaz", en: "Portrait of a young man", es: "Retrato de joven" } },
    { foto: "img/antes-depois/bebe.jpg",     texto: { pt: "Foto de bebê", en: "Baby photo", es: "Foto de bebé" } }
  ],

  /* ---------- DEPOIMENTOS (prints) ----------
     Suba em midia/depoimentos/ e liste aqui. Vazio = seção escondida.
     Exemplo: ["midia/depoimentos/1.jpg", "midia/depoimentos/2.jpg"] */
  depoimentos: []
};
