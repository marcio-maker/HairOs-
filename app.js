/* ============================================================
   HairOS — app.js
   ============================================================ */

function _imgErro(el){
  try{
    if(!el.getAttribute('src')) return;
    const wrap = el.parentElement;
    if(!wrap || wrap.classList.contains('img-erro')) return;
    const nome = el.getAttribute('alt') || 'Imagem';
    wrap.classList.add('img-erro');
    wrap.setAttribute('data-nome', nome);
    if(wrap.classList.contains('prod-img')){
      wrap.setAttribute('data-ini', nome.replace(/^Kit\s+(L'Oréal\s+)?/i,'').charAt(0).toUpperCase());
    }
    el.style.opacity = '0';
  }catch(e){}
}
window._imgErro = _imgErro;

document.querySelectorAll('img[onerror]').forEach(img => {
  if(img.complete && img.naturalWidth === 0) _imgErro(img);
});

/* MENU MOBILE */
(function(){
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const fechar = document.getElementById('drawerFechar');
  if(!toggle || !drawer || !overlay || !fechar) return;

  function abrir(){
    drawer.classList.add('aberto');
    overlay.classList.add('ativo');
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
  }
  function fecharDrawer(){
    drawer.classList.remove('aberto');
    overlay.classList.remove('ativo');
    drawer.setAttribute('inert','');
    drawer.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
  }
  toggle.addEventListener('click', abrir);
  fechar.addEventListener('click', fecharDrawer);
  overlay.addEventListener('click', fecharDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', fecharDrawer));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') fecharDrawer(); });
})();

/* BOTÃO PINTEREST */
(function(){
  document.querySelectorAll('.pin-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const url   = encodeURIComponent(btn.dataset.pinUrl || location.href);
      const media = encodeURIComponent(btn.dataset.pinMedia || '');
      const desc  = encodeURIComponent(btn.dataset.pinDescription || document.title);
      const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`;
      window.open(pinUrl, '_blank', 'noopener,width=750,height=550');
    });
  });
})();

/* FORMULÁRIO DE CONTATO (Web3Forms) */
(function(){
  const form = document.getElementById('contatoForm');
  if(!form) return;
  const st = document.getElementById('contatoStatus');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nome = document.getElementById('contatoNome').value.trim();
    const email = document.getElementById('contatoEmail').value.trim();
    const msg = document.getElementById('contatoMensagem').value.trim();
    if(!nome || !email || !msg){ st.textContent = 'Preencha nome, e-mail e mensagem.'; return; }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ st.textContent = 'Confira o e-mail digitado.'; return; }

    st.textContent = 'Enviando…';
    try{
      const fd = new FormData(form);
      const resp = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });
      const json = await resp.json();
      if(json.success){
        st.textContent = 'Mensagem enviada! Respondemos em até 24 horas.';
        form.reset();
      } else {
        st.textContent = 'Não foi possível enviar. Tente novamente ou escreva para hairbymarciostylist@gmail.com.';
      }
    }catch(err){
      st.textContent = 'Falha de conexão. Escreva para hairbymarciostylist@gmail.com.';
    }
  });
})();

/* ANO NO FOOTER */
(function(){
  const y = document.getElementById('anoAtual');
  if(y) y.textContent = new Date().getFullYear();
})();

/* BUSCADOR (apenas na página inicial) */
(function(){
  const input = document.getElementById('buscaInput');
  const grid = document.getElementById('gridArtigos');
  const vazia = document.getElementById('buscaVazia');
  if(!input || !grid || !vazia) return;

  const norm = s => (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  function filtrar(){
    const termo = norm(input.value);
    const cards = grid.querySelectorAll('.card');
    let encontrou = false;

    cards.forEach(card => {
      const titulo    = norm(card.dataset.titulo || '');
      const secao     = norm(card.dataset.secao || '');
      const nomeEl    = card.querySelector('.card-nome');
      const nome      = norm(nomeEl ? nomeEl.textContent : '');
      const subEl     = card.querySelector('.card-sub');
      const subtitulo = norm(subEl ? subEl.textContent : '');

      if (!termo || titulo.includes(termo) || secao.includes(termo) || nome.includes(termo) || subtitulo.includes(termo)) {
        card.style.display = '';
        encontrou = true;
      } else {
        card.style.display = 'none';
      }
    });

    vazia.style.display = encontrou ? 'none' : 'block';
  }

  input.addEventListener('input', filtrar);
})();