import './scss/style.scss';

const $ = (selector) => document.querySelector(selector);

const $searchBtn = $('#searchBtn');
const $searchInput = $('#searchInput');
const $movies = $('.section__container-movie-card-container');
const $selectedYear = $('.main__search--options-select-year');
const $selectedPage = $('.main__search--options-page');
const $scrollTop = $('.scroll-top');

let title;
let year;
let page = 1;

async function getMovies(title, year, page) {
  const s = `&s=${title}`;
  const y = `&y=${year}`;
  const p = `&page=${page}`;
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}${p}`);
  const { Search: movies } = await res.json();
  return movies;
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
    try {
      await getMovies(title, year, i);
    } catch (err) {
      console.log(err);
    }
  }
};

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
