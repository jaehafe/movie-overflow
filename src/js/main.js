import '../scss/style.scss';
import { $, $$ } from './dom.js';
import { handleErrNLoading } from './errorHandle.js';

// handle 영화 상세정보 모달창
const openModalButtons = $$('[data-modal-target]');
const closeModalButtons = $$('[data-close-button]');
const overlay = $('#overlay');

openModalButtons.forEach((button) => {
  console.log(button);
  button.addEventListener('click', () => {
    // data-modal-target="#modal"
    const modal = document.querySelector(button.dataset.modalTarget);
    console.log(modal);

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

// 변수 선언

const $searchBtn = $('#searchBtn');
const $searchInput = $('#searchInput');
const $moviesContainer = $('.section__container-movie-card-container');
const $selectedYear = $('.main__search--options-select-year');
const $selectedPage = $('.main__search--options-page');
let $searchTotalResult = $('.main__search--result');
const $movieDetail = $('.movie-detail');
const $scrollTopBtn = $('.scroll-top');

let title;
let year;
let page = 1;

const getMovies = async (title, year, page) => {
  const s = `&s=${title}`;
  const y = `&y=${year}`;
  const p = `&page=${page}`;
  const res = await fetch(
    `https://omdbapi.com/?apikey=${import.meta.env.VITE_API_KEY}${s}${y}${p}`
  );
  const { Search: movies, totalResults } = await res.json();
  return { movies, totalResults };
};

// 영화 상세페이지 가져오기
const getMovieDetail = async (movieId) => {
  const res = await fetch(
    `https://omdbapi.com/?apikey=${
      import.meta.env.VITE_API_KEY
    }&i=${movieId}&plot=full`
  );
  const movieDetailData = await res.json();
  return movieDetailData;
};

$('.section__container-movie-card-container').addEventListener(
  'click',
  async (e) => {
    let movieId = e.target.parentElement.parentElement.dataset.movieId;
    if (!movieId) return;
    console.log(movieId);
    await openMovieDetail(movieId);
  }
);

// 상세 영화정보 모달창 열기 함수
const openMovieDetail = async (movieId) => {
  handleErrNLoading.loadingDOM($('.modal-body'));
  try {
    const movieDetailData = await getMovieDetail(movieId);
    console.log(movieDetailData);
    $('.modal-body').innerHTML = '';

    displayDetailMovie(movieDetailData);

    $('.modal').classList.add('active');
  } catch (err) {
    handleErrNLoading.errorDOM($('.modal-body'));
    console.log(err);
  }
};

// 상세 영화정보 dom
const displayDetailMovie = async (movieDetailData) => {
  let { Poster, Title, Ratings, Actors, Genre, Runtime, Plot } =
    movieDetailData;

  Poster =
    Poster !== 'N/A' ? Poster.replace('SX300', 'SX700') : 'image_not_found.png';

  Ratings = Ratings !== 'N/A' ? 'N/A' : Ratings[0].Value;

  const displayMovieDetail = `
    <div class="modal-body">
      <img src="${Poster}" alt="${Title}" />
      <div class="detail">
        <div class="detail-infos">
          <div class="detail-infos__subheading">
            <h3 class="detail-infos__subheading--label">평점</h3>
          </div>
          <div class="detail-infos__value">
            <div class="detail-infos__value--rating">${Ratings}</div>
          </div>
        </div>
        <div class="detail-infos">
          <div class="detail-infos__subheading">
            <h3 class="detail-infos__subheading--label">장르</h3>
          </div>
          <div class="detail-infos__value">${Genre}</div>
        </div>
        <div class="detail-infos">
          <div class="detail-infos__subheading">
            <h3 class="detail-infos__subheading--label">재생 시간</h3>
          </div>
          <div class="detail-infos__value">${Runtime}</div>
        </div>
        <div class="detail-infos">
          <div class="detail-infos__subheading">
            <h3 class="detail-infos__subheading--label">출연진</h3>
          </div>
          <div class="detail-infos__value plot">
            ${Actors}
          </div>
        </div>
        <div class="detail-infos">
          <div class="detail-infos__subheading">
            <h3 class="detail-infos__subheading--label">줄거리</h3>
          </div>
          <div class="detail-infos__value plot">
            ${Plot}
          </div>
        </div>
        </div>
      </div>
        `;

  $('.modal-body').innerHTML = displayMovieDetail;
};

const findMovies = async () => {
  // reset movie list
  $moviesContainer.innerHTML = '';
  title = $searchInput.value;
  if (title === '' || title.length < 3) {
    return handleErrNLoading.searchCondition($('.main__search--result'));
  }

  // 검색 option(page, year) 값 가져오기
  let page =
    $selectedPage.options[$selectedPage.selectedIndex].dataset.selectValue;
  let year = $selectedYear.options[$selectedYear.selectedIndex].value;
  // console.log('page', page);
  // console.log('year', year);

  // 검색 option에 따른 영화 가져오기
  for (let i = 1; i <= page; i++) {
    const { movies, totalResults } = await getMovies(title, year, i);
    console.log(movies);
    try {
      movies
        ? displayMovies(movies, totalResults)
        : handleErrNLoading.undefinedDOM($('.main__search--result'));
    } catch (err) {
      handleErrNLoading.errorDOM($('.main__search--result'));
      console.log(err);
    }
  }
};

const displayMovies = async (movies) => {
  const movieList = await movies
    .map((movie) => {
      const { Poster, Title, Year, imdbID } = movie;
      return `
                <div class="section__container-movie-card" data-movie-id="${imdbID}">
                  <button type="button" class="movie-detail" data-modal-target="#modal">
                    <img
            
                      src="${Poster === 'N/A' ? 'image_not_found.png' : Poster}"
                      alt="${Title}"
                      class="section__container-movie-card--img"
                    />
                  </button>
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

  $moviesContainer.innerHTML += movieList;

  updateTotalResults();
};

// 검색어, 검색영화 총 개수 업데이트 함수
const updateTotalResults = async () => {
  handleErrNLoading.loadingDOM($('.main__search--result'));
  try {
    const { totalResults } = await getMovies(title, year);

    let movieTitle = $searchInput.value;
    $searchTotalResult.innerHTML = `${movieTitle}이(가) ${totalResults} 개 중 ${$moviesContainer.children.length}개 검색되었습니다.`;
  } catch (err) {
    handleErrNLoading.errorDOM($('.main__search--result'));
    console.log(err);
  }
};

// 검색 click, Enter시 findMovies
$searchBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  findMovies();
});

$searchBtn.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;
  findMovies();
});

// 영화연도 select 생성
for (let i = 2023; i >= 1980; i--) {
  const yearOption = document.createElement('option');
  yearOption.value = i;
  yearOption.textContent = i;
  $selectedYear.append(yearOption);
}

// 무한 스크롤
const options = {
  rootMargin: '100px 0px 100px 0px', // rootMargin을 '10px 10px 10px 10px'로 설정
  threshold: 0, // 타겟 엘리먼트가 교차영역에 진입했을 때, 교차영역에 타켓 엘리먼트의 50%가 있을 때, 교차 영역에 타켓 엘리먼트의 100%가 있을 때 observe가 반응한다.
};

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 검색했을 때만 observe 관찰
    if (entry.isIntersecting && $moviesContainer.children.length > 1) {
      getMoreMovies();
    }
  });
}, options);
io.observe($('#infinite-scroll__target'));
// io.observe($('.section__container-movie-card.length -1'));
console.log(io);

// if ($moviesContainer === undefined) {
//   io.unobserve($('#infinite-scroll__target'));
//   console.log(io.unobserve($('#infinite-scroll__target')));
// }

// 더 많은 영화 가져오기
const getMoreMovies = async () => {
  page += 1;
  const { movies } = await getMovies(title, year, page);

  try {
    movies && displayMovies(movies);
  } catch (err) {
    console.log(err);
  }
};

// 최상단 이동 scroll 버튼 함수
const handleScrollTopBtn = () => {
  window.scrollY > 150
    ? ($scrollTopBtn.style.display = 'block')
    : ($scrollTopBtn.style.display = 'none');
};

const moveToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
$scrollTopBtn.addEventListener('click', moveToTop);
document.addEventListener('scroll', handleScrollTopBtn);
