// modal close
// const openModalButtons = document.querySelectorAll('[data-modal-target]');
const openModalButtons = document.querySelectorAll('.movie-detail');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const cardContainer = document.querySelector(
  '.section__container-movie-card-container'
);

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(dataset.modalTarget);
    openModal(modal);
  });
});

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

const openModal = (modal) => {
  if (modal === null) return;
  modal.classList.add('active');
  overlay.classList.add('active');
};

const closeModal = (modal) => {
  if (modal === null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
};
