import './scss/style.scss';

const $ = (selector) => document.querySelector(selector);

const $searchBtn = $('#searchBtn');
const $searchInput = $('#searchInput');
const $movies = $('.section__container-movie-card-container');
const $selectedYear = $('.main__search--options-select-year');
const $selectedPage = $('.main__search--options-page');
let $searchTotalResult = $('.main__search--result');
const $scrollTop = $('.scroll-top');

let title;
let year;
let page = 1;

async function getMovies(title, year, page) {
  const s = `&s=${title}`;
  const y = `&y=${year}`;
  const p = `&page=${page}`;
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}${p}`);
  const { Search: movies, totalResults } = await res.json();
  return { movies, totalResults };
}

const handleErrNLoading = {
  loadingDOM: () => {
    return ($('.main__search--result').innerHTML = ` <svg
    class="spinner active"
    width="65px"
    height="65px"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      class="path"
      fill="none"
      stroke-width="6"
      stroke-linecap="round"
      cx="33"
      cy="33"
      r="30"
    ></circle>
  </svg>`);
  },

  errorDOM: () => {
    return ($('.main__search--result').innerHTML =
      '<p class="error">there was an error</p>');
  },
};

const findMovies = async () => {
  // reset movie list
  $movies.innerHTML = '';
  title = $searchInput.value;
  if (title === '' || title.length < 3) {
    alert('3글자 이상 입력해주세요.');
  }

  // 검색 option(page, year) 값 가져오기
  page = Number(
    $selectedPage.options[$selectedPage.selectedIndex].dataset.selectValue
  );
  year = $selectedYear.options[$selectedYear.selectedIndex].value;
  // console.log('page', page);
  // console.log('year', year);

  // 검색 option에 따른 영화 가져오기
  for (let i = 1; i <= page; i++) {
    const { movies, totalResults } = await getMovies(title, year, i);
    console.log(movies);

    // handleErrNLoading.loadingDOM();
    try {
      displayMovies(movies, totalResults);
    } catch (err) {
      // handleErrNLoading.errorDOM();
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
                  <a>
                    <img
                      data-modal-target="#modal"
                      src="${Poster === 'N/A' ? 'image_not_found.png' : Poster}"
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

  $movies.innerHTML += movieList;

  updateTotalResults();
};

// 검색어, 검색영화 총 개수 업데이트 함수
const updateTotalResults = async () => {
  handleErrNLoading.loadingDOM();
  try {
    const { totalResults } = await getMovies(title, year);
    // const { totalResults } = await getMovies();
    let val = $searchInput.value;
    // console.log($movies.children.length);
    return ($searchTotalResult.innerHTML = `${val}이(가) ${totalResults} 개 중 ${$movies.children.length}개 검색되었습니다.`);
  } catch (err) {
    handleErrNLoading.errorDOM();
    console.log(err);
  }
};

// 검색 click, Enter시 findMovies
$searchBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  findMovies();
});

$searchBtn.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') {
    return;
  }
  findMovies();
});

// 영화 년도 생성
for (let i = 2023; i >= 1980; i--) {
  const yearOpt = document.createElement('option');
  yearOpt.value = i;
  yearOpt.textContent = i;
  $selectedYear.append(yearOpt);
}

// 무한 스크롤
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 검색했을 때만 observe 관찰
    if (entry.isIntersecting && $movies.children.length > 1) {
      getMoreMovies();
    }
  });
});
io.observe($('#infinite-scroll__target'));
if ($movies === undefined) {
  io.unobserve($('#infinite-scroll__target'));
  console.log(io.unobserve($('#infinite-scroll__target')));
}

const getMoreMovies = async () => {
  page += 1;
  const { movies } = await getMovies(title, year, page);

  try {
    displayMovies(movies);
  } catch (err) {
    console.log(err);
  }
};
