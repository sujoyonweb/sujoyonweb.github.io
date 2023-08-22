const topNavToggleBtn = document.querySelector('.topNavToggleBtn');
const topNav = document.querySelector('.topNav');
const topNavItems = document.querySelector('.topNavItems');



topNavToggleBtn.addEventListener('click', ()=> {
    topNav.classList.toggle('topNavActive');
    topNavToggleBtn.classList.toggle('topNavToggleBtnActive');
})


topNavItems.addEventListener('click', ()=> {
    topNav.classList.remove('topNavActive');
    topNavToggleBtn.classList.remove('topNavToggleBtnActive');
})
