/* Quiz de perfil de viajante - Camping PC Chair
   Ferramenta de orientação turística (não é teste psicológico validado). */
(function () {
  const app = document.getElementById("quizApp");
  if (!app) return;

  /* Perfis: índice 0..3 = A, N, C, L */
  const P = [
    { n: "Explorador de Aventuras", ico: "⛰️", c: "#3b82f6",
      sobre: "Você se move melhor quando há desafio, altitude e descoberta. Paisagens impressionantes valem o esforço para chegar até elas.",
      exp: ["Trilhas e travessias em montanhas", "Cachoeiras, rios e escalada leve", "Camping e mochilão em áreas naturais"],
      estilo: "Viagens ativas, com roteiro baseado em trilhas e pontos de vista, mochila leve e hospedagem simples (camping ou refúgio)." },
    { n: "Conexão com a Natureza", ico: "🌲", c: "#06b6d4",
      sobre: "Você viaja para desacelerar. Silêncio, verde, água e céu aberto pesam mais do que uma lista de atrações.",
      exp: ["Camping contemplativo e chalés isolados", "Lagos, cachoeiras tranquilas e praias isoladas", "Observação de paisagens e vida selvagem"],
      estilo: "Viagens lentas, poucos deslocamentos e longas estadias no mesmo lugar, longe da agitação urbana." },
    { n: "Viajante Cultural", ico: "🏛️", c: "#6366f1",
      sobre: "Você quer entender o lugar: história, sabores, pessoas e tradições. O destino é uma história para ser lida a pé.",
      exp: ["Cidades históricas, museus e arquitetura", "Gastronomia regional e mercados", "Festivais, eventos e conversa com moradores"],
      estilo: "Viagens urbanas e sociais, com bom planejamento, hospedagem central e tempo para comer e caminhar sem pressa." },
    { n: "Espírito Livre", ico: "🧭", c: "#38bdf8",
      sobre: "Você valoriza liberdade e improviso. O melhor momento da viagem costuma ser o que não estava no plano.",
      exp: ["Viagens de carro ou van por estradas", "Mochilão sem roteiro rígido", "Praias e lugares pouco convencionais"],
      estilo: "Viagens flexíveis, de estrada, com poucas reservas, hospedagens alternativas e espaço para mudar de rota." }
  ];

  /* Perguntas. s = pontos por perfil [A,N,C,L]; w = peso da pergunta */
  const Q = [
    { k: "Paisagem", w: 1.2, q: "Qual paisagem faz você parar para olhar?", o: [
      ["Montanhas com neblina e trilhas ao longe", [3,1,0,0]],
      ["Um lago cercado de floresta, sem ninguém por perto", [0,3,0,1]],
      ["Ruas de pedra, igrejas antigas e praças cheias de vida", [0,0,3,0]],
      ["Uma praia desconhecida no fim de uma estrada de terra", [1,1,0,3]]] },
    { k: "Primeira manhã", w: 1, q: "Primeiro dia da viagem, 7h da manhã. O que você está fazendo?", o: [
      ["Calçando a bota para chegar ao mirante antes do sol", [3,1,0,0]],
      ["Tomando um café e vendo a luz mudar na paisagem", [0,3,0,0]],
      ["Procurando a padaria ou o mercado onde os moradores vão", [0,0,3,1]],
      ["Dormindo mais um pouco: o dia não tem hora marcada", [0,1,0,3]]] },
    { k: "Imprevisto", w: 1, q: "A estrada que você planejava está interditada. E agora?", o: [
      ["Procuro uma trilha alternativa: vira parte da aventura", [3,0,0,1]],
      ["Aproveito para ficar onde estou, sem pressa", [0,3,0,1]],
      ["Pergunto aos moradores e acabo achando algo melhor", [0,1,3,1]],
      ["Mudo de destino na hora e sigo para onde der", [1,0,0,3]]] },
    { k: "Hospedagem", w: 1.2, q: "Onde você dormiria melhor?", o: [
      ["Em uma barraca, em um camping no meio da natureza", [2,2,0,1]],
      ["Em um chalé isolado, com varanda para a mata", [0,3,0,0]],
      ["Em uma pousada de centro histórico, a pé de tudo", [0,0,3,0]],
      ["Em uma van, carro-cama ou hostel diferente", [1,0,0,3]]] },
    { k: "Disposição física", w: 1, q: "Aparece uma trilha longa, com subida forte. Como você reage?", o: [
      ["Animado: quanto mais difícil, melhor a vista", [3,0,0,1]],
      ["Prefiro uma trilha leve, de umas duas horas, com paradas", [0,3,0,0]],
      ["Passo. Prefiro passeios curtos e conhecer a cidade", [0,1,3,0]],
      ["Depende do dia: se bater a vontade, eu vou", [1,1,0,3]]] },
    { k: "Companhia", w: 0.8, q: "Nas suas melhores memórias de viagem, com quem você está?", o: [
      ["Sozinho, no meu próprio ritmo", [1,2,0,3]],
      ["Em dupla, a dois", [0,3,1,1]],
      ["Com um grupo de amigos", [3,0,2,1]],
      ["Com pessoas que conheci pelo caminho", [0,0,3,2]]] },
    { k: "Planejamento e gastos", w: 1, q: "Como você prefere planejar e gastar?", o: [
      ["Roteiro fechado, reservas antecipadas e orçamento controlado", [0,1,3,0]],
      ["Invisto no que for único: guia, equipamento, expedição", [3,0,1,0]],
      ["Viajo leve e barato, e decido no caminho", [1,0,0,3]],
      ["Pago mais por sossego e um lugar tranquilo", [0,3,0,0]]] },
    { k: "Motivação", w: 1.3, q: "O que você quer trazer na mala de volta?", o: [
      ["Uma história de superação para contar", [3,0,0,1]],
      ["Paz e energia renovada", [0,3,0,0]],
      ["Conhecimento, sabores e pessoas novas", [0,0,3,1]],
      ["A sensação de que fui livre", [1,0,0,3]]] }
  ];

  /* Combinações de perfis (chave = índices ordenados) */
  const PAIR = {
    "01": ["Desbravador da Natureza Selvagem", "Aventura e contemplação se alimentam: você sobe a montanha pelo desafio e fica pelo silêncio lá de cima. Combinam parques nacionais, travessias com camping e cachoeiras remotas."],
    "02": ["Explorador de Culturas Vivas", "Você busca desafio, mas também gente e história. Combinam destinos que unem trilhas e comunidades locais, como rotas antigas, vales habitados e cidades de montanha."],
    "03": ["Nômade de Fronteiras", "Movimento, improviso e adrenalina. Combinam roteiros de estrada com paradas de aventura, em carro, van ou mochila, sem reservas rígidas."],
    "12": ["Contemplativo de Raízes", "Calma na natureza e curiosidade pelo que é local. Combinam pousadas em vilas históricas cercadas de verde e passeios tranquilos."],
    "13": ["Andarilho da Calma Livre", "Você quer sossego, mas sem horário. Combinam estadias flexíveis em praias isoladas, lagos e vilas pequenas, com tempo de sobra."],
    "23": ["Cronista de Estradas", "Curiosidade cultural com espírito de estrada. Combinam rotas por cidades e vilarejos, com paradas para comer, conversar e mudar o plano."]
  };

  /* Destinos. w = afinidade [A,N,C,L] (0 a 3). i = internacional, sur = candidato a destino surpresa.
     A coluna "img" é opcional: troque por fotos reais do local. */
  const U = (id) => "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=900&q=85";
  const D = [
    { n: "Chapada Diamantina", p: "Bahia, Brasil", w: [3,2,1,2], img: U("1472396961693-142e6e269027"),
      h: "Montanhas, cachoeiras e grutas para quem gosta de trilhas com recompensa.",
      a: "Vale do Pati, Morro do Pai Inácio, Cachoeira da Fumaça, grutas", e: "Travessias de vários dias, banhos de cachoeira, mirantes",
      c: "Campings e pousadas na região; no Vale do Pati há hospedagem em casas de moradores.", t: "Período mais seco, de maio a setembro.", f: "ICMBio (Parque Nacional da Chapada Diamantina)" },
    { n: "Parque Nacional do Itatiaia", p: "RJ e MG, Brasil", w: [2,3,0,1], img: U("1500530855697-b586d89ba3ee"),
      h: "Montanhas, cachoeiras e áreas verdes com boa estrutura de parque.",
      a: "Agulhas Negras, Planalto das Prateleiras, cachoeiras da parte baixa", e: "Trilhas leves ou de altitude, camping na parte alta",
      c: "Área oficial de camping próxima ao Abrigo Rebouças, na parte alta.", t: "Meses mais secos, de abril a setembro.", f: "ICMBio (Parque Nacional do Itatiaia)" },
    { n: "Parque Nacional do Caparaó", p: "MG e ES, Brasil", w: [3,1,0,1], sur: true, img: U("1478131143081-80f7f84ca84d"),
      h: "Menos óbvio que as grandes chapadas, mas com altitude e o Pico da Bandeira.",
      a: "Pico da Bandeira e paisagens de altitude", e: "Montanhismo, nascer do sol no cume, caminhadas",
      c: "Há áreas de camping no parque; confirme regras e funcionamento no ICMBio.", t: "Prefira os meses mais secos; confirme o calendário do parque.", f: "ICMBio (Parque Nacional do Caparaó)" },
    { n: "Aparados da Serra", p: "RS e SC, Brasil", w: [3,2,0,1], img: U("1448375240586-882707db888b"),
      h: "Cânions e paredões rochosos ideais para trilhas e paisagens grandiosas.",
      a: "Cânions e paredões rochosos da região", e: "Trilhas de mirante e de beira de cânion",
      c: "A experiência de camping pode ocorrer em áreas privadas ao redor; confirme as regras locais.", t: "Confirme a melhor época com o parque.", f: "ICMBio (Parque Nacional de Aparados da Serra)" },
    { n: "Ilha do Cardoso", p: "São Paulo, Brasil", w: [1,3,0,1], img: U("1441974231531-c6227db76b6e"),
      h: "Praias preservadas e Mata Atlântica, com tranquilidade para acampar perto do mar.",
      a: "Praias preservadas e floresta", e: "Caminhadas leves, contemplação, vida de ilha",
      c: "Verifique áreas de acampamento autorizadas e regras da unidade de conservação.", t: "Confirme a época mais adequada (acesso por barco).", f: "Fundação Florestal (Parque Estadual da Ilha do Cardoso)" },
    { n: "Jalapão", p: "Tocantins, Brasil", w: [2,2,0,3], sur: true, img: U("1470770841072-f978cf4d019e"),
      h: "Dunas douradas, fervedouros e rios em um cerrado fora do roteiro comum.",
      a: "Dunas, fervedouros, rios e cerrado", e: "Roteiros de carro 4x4, banhos em rios, camping",
      c: "Há campings e pousadas na região; verifique estrutura e acesso.", t: "Período seco, de junho a setembro.", f: "Naturatins (Estado do Tocantins)" },
    { n: "Lençóis Maranhenses", p: "Maranhão, Brasil", w: [1,2,0,3], img: U("1500530855697-b586d89ba3ee"),
      h: "Dunas brancas e lagoas cristalinas: uma das paisagens mais diferentes do país.",
      a: "Dunas e lagoas", e: "Caminhadas pelas dunas, banhos em lagoas, passeios de barco",
      c: "Pousadas e hospedagens em comunidades; confira regras de camping no parque.", t: "Lagoas mais cheias após o período de chuvas, em geral de julho a setembro.", f: "ICMBio (Parque Nacional dos Lençóis Maranhenses)" },
    { n: "Jericoacoara", p: "Ceará, Brasil", w: [1,1,1,3], img: U("1433086966358-54859d0ed716"),
      h: "Dunas, praias, lagoas e pôr do sol para quem curte praia sem roteiro fixo.",
      a: "Duna do Pôr do Sol, Pedra Furada, lagoas", e: "Buggy, esportes de vento, entardeceres",
      c: "Diversas pousadas e hostels; camping em locais autorizados.", t: "Período seco, de julho a dezembro.", f: "ICMBio (Parque Nacional de Jericoacoara)" },
    { n: "Praia do Bonete", p: "Ilhabela, São Paulo, Brasil", w: [1,2,0,3], sur: true, img: U("1470770841072-f978cf4d019e"),
      h: "Praia rústica cercada de Mata Atlântica, com acesso por trilha ou barco.",
      a: "Praia e floresta", e: "Trilha até a praia, vivência de vila isolada",
      c: "Pousadas e campings simples; confirme estrutura antes de ir.", t: "Confirme condições do mar e da trilha.", f: "Fundação Florestal (Parque Estadual de Ilhabela)" },
    { n: "Ouro Preto", p: "Minas Gerais, Brasil", w: [0,0,3,1],
      h: "Cidade histórica com arquitetura barroca, museus e gastronomia mineira.",
      a: "Igrejas barrocas, museus, centro histórico", e: "Passeio a pé, culinária regional",
      c: "Pousadas e hotéis no centro histórico.", t: "Período mais seco, de abril a setembro.", f: "Secretaria de Turismo local" },
    { n: "Paraty", p: "Rio de Janeiro, Brasil", w: [1,2,3,2],
      h: "Centro histórico à beira-mar, cercado de Mata Atlântica, cachoeiras e praias.",
      a: "Centro histórico, cachoeiras, passeios de barco", e: "Cultura, praia e natureza no mesmo roteiro",
      c: "Pousadas no centro histórico e campings na região.", t: "Confirme sazonalidade e eventos locais.", f: "Secretaria de Turismo de Paraty" },
    { n: "Salvador", p: "Bahia, Brasil", w: [0,0,3,2],
      h: "Capital cheia de história, música, gastronomia e vida urbana.",
      a: "Pelourinho, mercados, igrejas, orla", e: "Gastronomia, festas populares, passeios históricos",
      c: "Ampla rede de hotéis e pousadas.", t: "Confira calendário de festas e clima.", f: "Salvador Turismo / Bahiatursa" },
    { n: "Torres del Paine", p: "Patagônia, Chile", i: true, w: [3,2,0,2],
      h: "Montanhas icônicas e trilhas lendárias, para quem aceita esforço em troca de paisagem.",
      a: "Torres del Paine, glaciares, lagos", e: "Trilhas W e O, camping em áreas e refúgios",
      c: "Camping em áreas e refúgios; reservas antecipadas são necessárias.", t: "Verão local, de novembro a março.", f: "Site oficial do parque / Conaf" },
    { n: "Banff e Jasper", p: "Alberta, Canadá", i: true, w: [1,3,0,1],
      h: "Lagos glaciais, florestas e montanhas em parques nacionais bem estruturados.",
      a: "Lagos glaciais, Montanhas Rochosas, parques nacionais", e: "Caminhadas, camping em parque, observação de paisagens",
      c: "Campings em parques nacionais, com reserva.", t: "Verão, de junho a setembro.", f: "Parks Canada" },
    { n: "Ilha Sul da Nova Zelândia", p: "Nova Zelândia", i: true, w: [2,3,0,3],
      h: "Lagos, fiordes e montanhas, ótimos para viagens de motorhome ou camping.",
      a: "Lake Tekapo, Fiordland National Park, Mount Cook", e: "Estrada, trilhas e camping em motorhome ou barraca",
      c: "O camping livre tem regras e restrições locais.", t: "Verão local, de dezembro a fevereiro.", f: "newzealand.com e Department of Conservation" },
    { n: "Cusco e Vale Sagrado", p: "Peru", i: true, w: [2,1,3,1],
      h: "Cultura andina, sítios arqueológicos e trilhas em altitude.",
      a: "Cusco, Vale Sagrado, Machu Picchu", e: "Trilhas até sítios arqueológicos, mercados e gastronomia",
      c: "Hotéis e hospedagens variadas; confirme ingressos e permissões com antecedência.", t: "Período seco, de maio a setembro.", f: "Ministério da Cultura do Peru (ingressos)" },
    { n: "Lisboa e Sintra", p: "Portugal", i: true, w: [0,0,3,1],
      h: "História, arquitetura e gastronomia em cidades fáceis de explorar a pé.",
      a: "Centro histórico de Lisboa, palácios de Sintra", e: "Gastronomia, passeios a pé, bate-volta a Sintra",
      c: "Ampla rede de hotéis e hostels.", t: "Primavera e outono costumam ser agradáveis.", f: "Visit Portugal" }
  ];

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let step = -1, ans = [], origem = "";

  function start() {
    step = -1; ans = [];
    app.innerHTML = `
      <div class="q-card q-start">
        <div class="section-kicker">QUIZ DE PERFIL DE VIAJANTE</div>
        <h1>Qual é o lugar <span>ideal para você?</span></h1>
        <p>Responda 8 perguntas rápidas e descubra seu perfil turístico, os destinos que mais combinam com você e as experiências que podem fazer sua próxima viagem valer a pena.</p>
        <label class="q-origin">De onde você viajaria? <small>(opcional)</small>
          <input id="origem" type="text" maxlength="60" placeholder="Ex.: Taboão da Serra, SP">
        </label>
        <button class="button button-primary" id="go">Começar o quiz</button>
        <p class="q-note">Ferramenta de orientação turística, não é um teste psicológico validado.</p>
      </div>`;
    document.getElementById("go").onclick = () => { origem = document.getElementById("origem").value.trim(); step = 0; ask(); };
  }

  function ask() {
    const q = Q[step];
    app.innerHTML = `
      <div class="q-card">
        <div class="q-progress" role="progressbar" aria-valuemin="0" aria-valuemax="8" aria-valuenow="${step}">
          <div class="q-bar"><i style="width:${(step / 8) * 100}%"></i></div>
          <span>Pergunta ${step + 1} de 8</span>
        </div>
        <h2 class="q-title">${esc(q.q)}</h2>
        <div class="q-options">
          ${q.o.map((o, i) => `<button class="q-opt${ans[step] === i ? " sel" : ""}" data-i="${i}">${esc(o[0])}</button>`).join("")}
        </div>
        ${step > 0 ? '<button class="q-back" id="back">← Voltar</button>' : ""}
      </div>`;
    app.querySelectorAll(".q-opt").forEach((b) => b.onclick = () => {
      ans[step] = +b.dataset.i;
      if (step < 7) { step++; ask(); } else { result(); }
    });
    const back = document.getElementById("back");
    if (back) back.onclick = () => { step--; ask(); };
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function score() {
    const t = [0, 0, 0, 0];
    Q.forEach((q, i) => q.o[ans[i]][1].forEach((v, k) => { t[k] += v * q.w; }));
    /* combinações de respostas */
    if (ans[3] === 0 && ans[4] === 0) t[0] += 2;           /* camping + trilha pesada */
    if (ans[3] === 0 && ans[4] === 1) t[1] += 2;           /* camping + ritmo leve */
    if (ans[5] === 0 && ans[6] === 2) t[3] += 2;           /* sozinho + sem roteiro */
    if (ans[0] === 2 && ans[7] === 2) t[2] += 2;           /* cidade histórica + conhecimento */
    return t;
  }

  function pct(t) {
    const s = t.reduce((a, b) => a + b, 0) || 1;
    const raw = t.map((v) => (v / s) * 100), fl = raw.map(Math.floor);
    let r = 100 - fl.reduce((a, b) => a + b, 0);
    raw.map((v, i) => [v - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach((x) => { if (r-- > 0) fl[x[1]]++; });
    return fl;
  }

  function pick(frac) {
    const sc = D.map((d) => ({ d, s: d.w.reduce((a, w, i) => a + w * frac[i], 0) })).sort((a, b) => b.s - a.s);
    const top = sc.slice(0, 5);
    if (!top.some((x) => x.d.i)) { const b = sc.find((x) => x.d.i); if (b) top[4] = b; }
    else if (top.filter((x) => !x.d.i).length < 2) { const b = sc.find((x) => !x.d.i && !top.includes(x)); if (b) top[4] = b; }
    top.sort((a, b) => b.s - a.s);
    const sur = sc.find((x) => x.d.sur && !top.includes(x)) || sc.find((x) => !top.includes(x));
    return { top, sur };
  }

  function card(x, n, rk) {
    const d = x.d;
    const media = d.img
      ? `<img src="${d.img}" alt="Paisagem de natureza ilustrativa (troque pela foto de ${esc(d.n)})" loading="lazy">`
      : `<div class="q-ph"><span>${d.i ? "🌍" : "🏛️"}</span></div>`;
    return `<article class="dest-card q-dest">
      <div class="dest-img">${media}<span class="badge">${n}</span></div>
      <div class="dest-body">
        <span class="tag">${d.i ? "Internacional" : "Brasil"}</span>
        <h3>${esc(d.n)}</h3><span class="uf">${esc(d.p)}</span>
        <p>${esc(d.h)} Afinidade com ${esc(P[rk[0]].n)} e ${esc(P[rk[1]].n)}.</p>
        <ul class="q-facts">
          <li><b>Principais atrações:</b> ${esc(d.a)}</li>
          <li><b>Experiências:</b> ${esc(d.e)}</li>
          <li><b>Camping e hospedagem:</b> ${esc(d.c)}</li>
          <li><b>Melhor época:</b> ${esc(d.t)}</li>
          <li><b>Custos e regras:</b> consulte a fonte oficial: ${esc(d.f)}.</li>
        </ul>
      </div></article>`;
  }

  function result() {
    const t = score(), pc = pct(t), frac = pc.map((v) => v / 100);
    const rk = [0, 1, 2, 3].sort((a, b) => pc[b] - pc[a] || t[b] - t[a]);
    const [a, b] = rk, key = [a, b].sort().join("");
    const { top, sur } = pick(frac);
    const proximos = pc[a] - pc[b] <= 5;
    const contrib = Q.map((q, i) => {
      const s = q.o[ans[i]][1], k = s.indexOf(Math.max(...s));
      return `<li><b>${esc(q.k)}:</b> “${esc(q.o[ans[i]][0])}” <em>(traço de ${esc(P[k].n)})</em></li>`;
    }).join("");
    const exps = [...P[a].exp, ...P[b].exp];

    app.innerHTML = `
      <div class="q-report">
        <div class="q-card q-head">
          <div class="section-kicker">SEU RESULTADO</div>
          <h1>${esc(PAIR[key][0])}</h1>
          <p>Seu perfil principal é <b>${P[a].ico} ${esc(P[a].n)}</b>, com forte influência de <b>${P[b].ico} ${esc(P[b].n)}</b>.</p>
          ${origem ? `<p class="q-note">Ponto de partida informado: ${esc(origem)}. Avalie deslocamento e passagens antes de decidir.</p>` : ""}
        </div>

        <section class="q-sec"><h2>Perfil <span>principal</span></h2>
          <p>${esc(P[a].sobre)}</p></section>

        <section class="q-sec"><h2>Ranking de <span>compatibilidade</span></h2>
          <div class="q-rank">${rk.map((k, i) => `
            <div class="q-row"><div class="q-lab"><span>${i + 1}º ${P[k].ico} ${esc(P[k].n)}</span><b>${pc[k]}%</b></div>
              <div class="q-track"><i style="width:${pc[k]}%;background:${P[k].c}"></i></div></div>`).join("")}</div>
          <p class="q-note">${proximos ? "Seus dois primeiros perfis estão muito próximos: você é um perfil híbrido. " : ""}Os percentuais mostram afinidade turística a partir das suas respostas, não uma medição científica de personalidade.</p>
        </section>

        <section class="q-sec"><h2>O que suas respostas <span>revelaram</span></h2>
          <ul class="q-list">${contrib}</ul></section>

        <section class="q-sec"><h2>Combinação de <span>perfis</span></h2>
          <p>${esc(PAIR[key][1])}</p>
          <p>Os perfis menos intensos (${esc(P[rk[2]].n)} e ${esc(P[rk[3]].n)}) continuam presentes e podem aparecer em viagens específicas.</p></section>

        <section class="q-sec"><h2>Cinco destinos <span>recomendados</span></h2>
          <div class="dest-grid">${top.map((x, i) => card(x, i + 1, rk)).join("")}</div>
          <aside class="notice small">Os destinos foram escolhidos por afinidade com seus dois perfis principais e mistura de opções nacionais e internacionais. Não incluímos preços sem fonte confiável: confira custos, regras de camping, acesso e segurança nas fontes oficiais indicadas. As fotos são ilustrativas e podem ser trocadas pelas imagens reais de cada local.</aside>
        </section>

        <section class="q-sec"><h2>Experiências <span>ideais</span></h2>
          <ul class="q-list">${exps.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></section>

        <section class="q-sec"><h2>Estilo de <span>viagem</span></h2>
          <p>${esc(P[a].estilo)}</p></section>

        <section class="q-sec"><h2>Destino <span>surpresa</span></h2>
          <div class="dest-grid one">${card(sur, "✦", rk)}</div>
          <p class="q-note">É menos óbvio que os destinos clássicos, mas combina com o seu perfil e pode surpreender positivamente.</p></section>

        <section class="q-sec"><h2>Conclusão</h2>
          <p>Você viaja em busca de ${esc(P[a].sobre.split(".")[0].toLowerCase())}, e o seu lado ${esc(P[b].n.toLowerCase())} dá o tom da experiência. Sua próxima viagem tende a ser mais memorável se juntar os dois.</p>
          <div class="hero-actions q-actions"><button class="button button-primary" id="again">Refazer o quiz</button>
            <a class="button button-glass" href="brasil.html">Ver destinos do Brasil</a></div>
        </section>
      </div>`;
    document.getElementById("again").onclick = start;
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  start();
})();
