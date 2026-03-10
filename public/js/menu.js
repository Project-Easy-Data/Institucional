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