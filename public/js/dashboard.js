const esgotoBtn = document.getElementById('esgoto');
const aguaBtn = document.getElementById('agua');
const agua = document.getElementById('infoSaneamentoGeral');
const esgoto = document.getElementById('infoSaneamentoGeralEsgoto');

esgotoBtn.addEventListener('click', () => {
    agua.style.display = 'none';
    esgoto.style.display = 'flex';
})

aguaBtn.addEventListener('click', () => {
    esgoto.style.display = 'none';
    agua.style.display = 'flex';
})