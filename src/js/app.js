window.addEventListener('load', () => {
  const commentsContainer = document.querySelector('.navigation__commits');
  const selectedComments = commentsContainer ? commentsContainer.querySelector('.navigation__item-selected') : null;
  const scrollContainer = commentsContainer ? commentsContainer.querySelector('.navigation-scroll') : null;
  const modal = document.querySelector('.file-modal');
  const buttonClose = modal ? modal.querySelector('.file-modal__close') : null;
  if (selectedComments && scrollContainer) {
    const offset = selectedComments.offsetHeight + 100;
    scrollContainer.scrollTop = selectedComments.offsetTop - offset;
  }
  if (buttonClose && modal) {
    buttonClose.addEventListener('click', () => {
      modal.hidden = true;
    });
  }
});
