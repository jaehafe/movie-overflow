import './scss/style.scss';

// close when click outside
// const specifiedElement = document.getElementById('a')

// document.addEventListener('click', e => {
//   const isClickInside = specifiedElement.contains(e.target)

//   if (!isClickInside) {
//     // The click was OUTSIDE the specifiedElement, do something
//   }
// })

// modal close
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const cardContainer = document.querySelector(
  '.section__container-movie-card-container'
);
const $ = (selector) => document.querySelector(selector);
let search = '';
// search = $('#searchInput').value

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget);
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

const errorHandle = {
  loadingDOM() {
    return ($(
      '.section__container-movie-card-container'
    ).innerHTML = `<div class="loading"></div>`);
  },

  errorDOM() {
    return ($('.section__container-movie-card-container').innerHTML =
      '<p class="error">there was an error</p>');
  },
};

//
let page = 1;
const fetchMovies = async (title = '', year = '', page) => {
  // errorHandle.loadingDOM();
  try {
    const s = `&s=${title}`;
    const y = `&y=${year}`;
    const p = `&page=${page}`;
    const res = await fetch(
      `https://omdbapi.com/?apikey=${import.meta.env.VITE_API_KEY}${s}${y}${p}`
    );
    const data = await res.json();
    const { Search: movies, totalResults } = data;
    console.log(movies);
    return { movies, totalResults };
  } catch (err) {
    console.log(err);
    // errorHandle.errorDOM();
    throw err;
  }
};

// api
const displayMovies = (movieData, totalResults) => {
  const movieList = movieData
    .map((movie) => {
      const { Poster, Title, Year, imdbID } = movie;
      return `
                <div class="section__container-movie-card" data-movie-id="${imdbID}">
                  <a>
                    <img
                      data-modal-target="#modal"
                      src="${Poster}"
                      alt=""
                      class="section__container-movie-card--img"
                    />
                  </a>
                  <div class="flex">
                    <div class="section__container-movie-card--thumb">
                      <p class="section__container-movie-card--year">${Year}</p>
                      <h2 class="section__container-movie-card--title">${
                        Title.length > 10
                          ? Title.substring(0, 10).concat(' ...')
                          : Title
                      }</h2>
                    </div>
                    <div class="section__container-movie-card--btn">
                      <button
                        class="section__container-movie-card--btn-add movie-add-button"
                      >
                        추가
                      </button>
                      <button
                        class="section__container-movie-card--btn-remove movie-remove-button"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
                `;
    })
    .join('');

  cardContainer.innerHTML += movieList;

  updateMovieCount(search, totalResults);
  // $(
  //   '.main__search--result'
  // ).innerHTML = `${search}이(가) 총 ${totalResults} 개 검색되었습니다.`;
};

//
$('.main__search-container').addEventListener('submit', (e) => {
  e.preventDefault();
  let search = $('#searchInput').value;
  if (search) {
    // 한번에 fetch 2번 해오기

    if (movies.length > 10) {
      let i = 1;
      while (i <= 2) {
        display(search, i);
        i++;
      }
    }
  }
  $('#searchInput').value = '';
});

// display 함수
const display = async (title, fetchNum) => {
  resetResult();
  const { movies, totalResults } = await fetchMovies(title, '', fetchNum);
  displayMovies(movies, totalResults);
};

// 영화 검색 결과 reset 함수
const resetResult = () => {
  cardContainer.innerHTML = '';
};

// count, movie 이름 업데이트 함수
const updateMovieCount = (search, totalResults) => {
  // let search = $('#searchInput').value;
  $(
    '.main__search--result'
  ).innerHTML = `${search}이(가) 총 ${totalResults} 개 검색되었습니다.`;
};

// infinite scroll
let target = $('#target');

const options = {
  root: null,
  rootMargin: '0px',
  // threshold: 1.0,
};

const io = new IntersectionObserver((entries, options) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      fetchNextMovie();
      console.log('화면에서 노출됨');
    } else {
      console.log('화면에서 제외됨');
    }
  });
}, options);

io.observe(target);

const fetchNextMovie = () => {};
//
// const fetch20Movies = async (title, fetchNum) => {
//   let i = 1;
//   while (i <= fetchNum) ++i;
//   const data = await fetchMovies(title, '', fetchNum);
//   return data;
// };
