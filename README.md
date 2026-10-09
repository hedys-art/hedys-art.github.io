# Hedy's Atelier 홈페이지 (hedys-art.github.io)

주소: https://hedys-art.github.io/ (GitHub 조직 `hedys-art`(교수님 GitHub 계정 소유), 저장소 `hedys-art.github.io`. GitHub Pages)

## 1. 구성
```
index.html works.html about.html exhibitions.html class.html   다섯 쪽(홈·작품·작가 소개·전시·소식·수업·체험)
assets/js/main.js    content/*.json 을 읽어 화면을 그림
assets/css/style.css 디자인(백자의 흰색 · 먹색 · 금채의 금색)
assets/img/          사이트 아이콘(실루엣 접시)
content/*.json       내용 — site(첫 화면·연락처), works(작품), about(소개·작가 노트·약력),
                     exhibitions(전시), news(소식), class(수업·체험)
media/               사진(Pages CMS 업로드 폴더)
.pages.yml           Pages CMS 입력 양식
.nojekyll
```
- `main.js`나 `style.css`를 고치면 HTML 다섯 개의 `?v=` 값을 함께 새 값으로 바꿉니다(바꾸지 않으면 방문자 브라우저가 옛 코드를 씀).

## 2. 내용 고치기 (Pages CMS)
1. https://app.pagescms.org 에 교수님 GitHub 계정으로 들어갑니다.
2. 저장소 `hedys-art/hedys-art.github.io`를 고르면 왼쪽에 「사이트 기본 정보」「작품」「작가 소개」「전시」「소식」「수업·체험 안내」가 나옵니다.
3. 고치고 저장하면 1~2분 뒤 사이트에 반영됩니다.
- 새 작품: 「작품」→ 작품 목록 맨 아래에 추가 → 대표 사진 올리기 → 분류 기호는 `silhouette`(실루엣 연작)·`flower`(꽃과 새)·`panel`(도판·병풍)·`blue`(청화·문양) 가운데 하나.
- 첫 화면 대표 작품: 「첫 화면 대표 작품으로」를 켭니다(4개 정도가 보기 좋음).
- 사진은 긴 변 1600px 안팎, 1MB 이하로 줄여 올리면 빨리 열립니다.

## 3. 공개 원칙
- 이 저장소와 사이트는 누구나 볼 수 있습니다. 주소·전화번호·주민등록번호는 넣지 않습니다. 메일·인스타그램은 작가가 정한 것만 넣습니다.
- 작품 사진은 작가 본인 작품만 씁니다. 다른 작가·인터넷 그림, 다른 사람 얼굴이 나온 사진은 넣지 않습니다(전시 포스터도 다른 작가 작품이 들어 있으면 넣지 않음).

## 4. 사진 출처 (2026. 10. 10. 처음 만들 때)
- 작품 사진: 2026 전문예술지원사업 신청서의 포트폴리오 사진(작가 제공)을 긴 변 1600px로 줄이고 촬영 정보를 지움.
- 〈Oppose time〉: 2021 개인전 도록 표지 사진에서 접시 부분을 잘라 씀.
- 사이트 아이콘: 〈Silhouette of flowers〉 접시 하나를 잘라 만듦.
