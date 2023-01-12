# 영화 검색 사이트 만들기

## DEMO [movie overflow](https://movie-overflow.vercel.app/)

- [omdb api](https://www.omdbapi.com/) 활용
- 기간: 1.2 - 1.11
- `HTML`, `SCSS`, `JS`
- `VITE`, `yarn`

## File Tree

- `public/*` - svg, png 관련 이미지 폴더
- `index.html` - main html
- `js/*` - main, api, modal, errorHandle
- `scss/*` - globals, layout, util 컴포넌트화, 최종 style.scss 로 forward

```
src/*

├── js **
│   ├── api.js
│   ├── dom.js
│   ├── errorHandle.js
│   ├── main.js *
│   └── modal.js
└── scss **
    ├── globals *
    │   ├── _boilerplate.scss
    │   ├── _colors.scss
    │   ├── _index.scss
    │   └── _typography.scss
    ├── layout *
    │   └── _index.scss
    ├── style.scss *
    └── util *
        ├── _breakpoints.scss
        ├── _fonts.scss
        ├── _functions.scss
        └── _index.scss
```

## Overview

- [x] ‘한 번에 10, 20, 30개’, 영화 ‘개봉연도(2023 - 1980)’를 검색할 수 있는 조건부 검색
- [x] 영화 검색 및 fetch api시, `try` `catch`로 에러핸들링
- [x] `Intersection Observer API` 무한 스크롤 기능
- [x] 영화를 가져올 때마다 현재 가져온 영화 개수 업데이트
- [x] 영화 포스터가 없을 경우 대체 이미지를 출력
- [x] 검색한 영화 클릭 시 해당 영화의 상세정보 모달 팝업
- [x] 영화 상세정보 포스터 이미지 리사이징(SX300 → SX700)
- [x] 화면 우측 하단, 스크롤 최상단 이동 버튼

## Tasks & Issues

- [x] 영화 상세정보 출력 전 loading ui
- [ ] 영화 watch list 추가, 삭제

## Running Locally

```
1. git clone https://github.com/jaehafe/KDT4-M2.git
2. cd KDT4-M2
3. yarn
4. .env 파일 생성 후, omdb api key 입력 ex) VITE_API_KEY=7035c60c
5. yarn run dev
```

### 느낀점 & 개선할 점

-
