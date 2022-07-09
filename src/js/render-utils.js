export function renderCardItem({
  tags,
  likes,
  views,
  comments,
  downloads,
  webformatURL,
  largeImageURL,
}) {
  return `
  <div class="col">
      <div class="card h-100" data-url="${largeImageURL}">
        <img src=${webformatURL} height='300' alt="${tags}" loading='lazy'>
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <span class="d-flex flex-column align-items-center">
              <b>Likes</b>
              <span>${likes}</span>
            </span>
            <span class="d-flex flex-column align-items-center">
              <b>Views</b>
              <span>${views}</span>
            </span>
            <span class="d-flex flex-column align-items-center">
              <b>Comments</b>
              <span>${comments}</span>
            </span>
            <span class="d-flex flex-column align-items-center">
              <b>Downloads</b>
              <span>${downloads}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
`;
}
