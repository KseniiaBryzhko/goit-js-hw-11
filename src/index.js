import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('input');
const searchBtnEl = document.querySelector('button');
const galleryEl = document.querySelector('.gallery');

searchFormEl.addEventListener('submit', handleSearchImage);

// function handleSearchImage(event) {
//   event.preventDefault();
//   const searchQuery = searchInputEl.value.toLowerCase().trim();
//   console.log(searchQuery);

//   fetchImages(searchQuery)
//     .then(result => {
//       Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
//       showFoundImages(result);
//     })
//     .catch(error => {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//       console.log(error);
//     });
// }
const fetchImages = async searchQuery => {
  const response = await axios({
    method: 'get',
    url: 'https://pixabay.com/api',
    params: {
      key: '34521727-b40265d11824baf1c84600c97',
      q: `${searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: '1',
      per_page: '40',
    },
  });
  return response.data;
};

async function handleSearchImage(event) {
  event.preventDefault();
  const searchQuery = searchInputEl.value.toLowerCase().trim();
  console.log(searchQuery);

  try {
    const result = await fetchImages(searchQuery);
    Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
    showFoundImages(result);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function showFoundImages(result) {
  const imageInfo = result.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
        <div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
        <p class="info-item"><b>Likes: ${likes}</b></p>
        <p class="info-item"><b>Views: ${views}</b></p>
        <p class="info-item"><b>Comments: ${comments}</b></p>
        <p class="info-item"><b>Downloads: ${downloads}</b></p>
        </div>
        </div>
        </a>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', imageInfo);
  console.log(imageInfo);
  return imageInfo;
}

const lightbox = new SimpleLightbox('.gallery a');
lightbox.refresh();
