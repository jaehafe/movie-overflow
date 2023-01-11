// 에러, 로딩 ui handle 함수
export const handleErrNLoading = {
  loadingDOM: (selector) => {
    return (selector.innerHTML = `<svg class="spinner active" width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg>`);
  },

  errorDOM: (selector) => {
    return (selector.innerHTML = `<p class="error">에러가 발생했습니다.</p>`);
  },

  undefinedDOM: (selector) => {
    return (selector.innerHTML = `<p class="error">관련 영화가 없습니다.</p>`);
  },

  searchCondition: (selector) => {
    return (selector.innerHTML = `<p class="error">3글자 이상 입력해주세요.</p>`);
  },
};
