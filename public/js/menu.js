document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const menuNav = document.getElementById('menuNav');
  const fecharMenu = document.getElementById('fecharMenu');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('ativo');
    menuNav.classList.toggle('aberto');
  });

  fecharMenu.addEventListener('click', () => {
    menuBtn.classList.remove('ativo');
    menuNav.classList.remove('aberto');
  });

  menuNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menuBtn.classList.remove('ativo');
      menuNav.classList.remove('aberto');
    }
  });
});

function abrirPopup(nome, cargo, foto, linkedin, github) {
      document.getElementById('popup-nome').textContent = nome;
      document.getElementById('popup-cargo').textContent = cargo;
      document.getElementById('popup-foto').src = foto;
      document.getElementById('popup-linkedin').href = linkedin;
      document.getElementById('popup-github').href = github;
      document.getElementById('overlayMembro').style.display = 'flex';
    }

    function fecharPopup() {
      document.getElementById('overlayMembro').style.display = 'none';
  }