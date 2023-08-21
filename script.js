const topNavMenuToggleBtn = document.querySelector('.topNavMenuToggleBtn');
const topNavMenu = document.querySelector('.topNavMenu');




topNavMenuToggleBtn.addEventListener('click', ()=> {
    topNavMenuToggleBtn.classList.toggle('topNavMenuToggleBtnActive')
    topNavMenu.classList.toggle('showTopNavMenu');
});
topNavMenu.addEventListener('click', ()=> {
    topNavMenu.classList.remove('showTopNavMenu');
    topNavMenuToggleBtn.classList.toggle('topNavMenuToggleBtnActive')
});