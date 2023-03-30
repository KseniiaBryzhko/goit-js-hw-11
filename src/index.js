import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import OnlyScroll from 'only-scrollbar';

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('input');
const searchBtnEl = document.querySelector('[type="submit"]');
const loadMoreBtnEl = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

loadMoreBtnEl.classList.add('is-hidden');

searchFormEl.addEventListener('submit', handleSearchImage);

let page = 1;
const perPage = 40;

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '34521727-b40265d11824baf1c84600c97';

async function fetchImages(searchQuery) {
  const params = {
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${page}`,
    per_page: `${perPage}`,
  };
  const urlAXIOS = `?key=${API_KEY}`;

  const { data } = await axios.get(urlAXIOS, { params });
  return data;
}

async function handleSearchImage(event) {
  event.preventDefault();
  const searchQuery = searchInputEl.value.toLowerCase().trim();
  console.log(searchQuery);

  if (!searchQuery) {
    clearPage();
    return;
  }

  try {
    const result = await fetchImages(searchQuery);

    if (result.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      clearPage();
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      showFoundImages(result);
      page += 1;
      loadMoreBtnEl.classList.remove('is-hidden');
      scrollPage();

      if (result.totalHits <= page * perPage) {
        loadMoreBtnEl.classList.add('is-hidden');
        Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Keep calm and try again.');
  }
}

loadMoreBtnEl.addEventListener('click', handleSearchImage);

function clearPage() {
  gallery.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
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
        <p class="info-item"><b>Likes: </b>${likes}</p>
        <p class="info-item"><b>Views: </b>${views}</p>
        <p class="info-item"><b>Comments: </b>${comments}</p>
        <p class="info-item"><b>Downloads: </b>${downloads}</p>
        </div>
        </div>
        </a>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', imageInfo);

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();

  return imageInfo;
}

function scrollPage() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// const scroll = new OnlyScroll(document.scrollingElement);
