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

const findMovies = async () => {
  // reset movie list
  $movies.innerHTML = '';
  title = $searchInput.value;
  if (title === '' || title.length < 3) {
    alert('3글자 이상 입력해주세요.');
  }

  page = Number(
    $selectedPage.options[$selectedPage.selectedIndex].dataset.selectValue
  );
  year = $selectedYear.options[$selectedYear.selectedIndex].value;
  // console.log('page', page);
  // console.log('year', year);

  for (let i = 1; i <= page; i++) {
    const { movies, totalResults } = await getMovies(title, year, i);
    console.log(movies);
    try {
      displayMovies(movies, totalResults);
    } catch (err) {
      console.log(err);
    }
  }
};

const displayMovies = async (movies, totalResults) => {
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
  // $searchTotalResult.innerHTML = `${search}이(가) 총 ${totalResults} 개 검색되었습니다.`;
  updateTotalResults();
};

// 검색어, 검색영화 총 개수 업데이트 함수
const updateTotalResults = async () => {
  const { totalResults } = await getMovies(title, year);
  // const { totalResults } = await getMovies();
  let val = $searchInput.value;
  return ($searchTotalResult.innerHTML = `${val}이(가) 총 ${totalResults} 개 검색되었습니다.`);
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
