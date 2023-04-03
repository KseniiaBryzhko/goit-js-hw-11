import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { page, perPage, API_KEY, fetchImages, axios } from './api';

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('input');
const loadMoreBtnEl = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

loadMoreBtnEl.classList.add('is-hidden');

searchFormEl.addEventListener('submit', handleSearchImage);
loadMoreBtnEl.addEventListener('click', handleLoadMore);

async function handleSearchImage(event) {
  event.preventDefault();
  const searchQuery = searchInputEl.value.toLowerCase().trim();

  if (!searchQuery) {
    clearPage();
    return;
  }

  try {
    const result = await fetchImages(searchQuery);

    if (result.hits.length === 0) {
      clearPage();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      clearPage();
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      }
      showFoundImages(result);
      loadMoreBtnEl.classList.remove('is-hidden');

      const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      });
      lightbox.refresh();

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
    console.log(error);
  }
}

async function handleLoadMore() {
  const searchQuery = searchInputEl.value.toLowerCase().trim();
  const result = await fetchImages(searchQuery);

  if (result.hits.length > 0) {
    showFoundImages(result);

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    lightbox.refresh();

    scrollPage();

    if (result.totalHits <= page * perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  }
}

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

  return imageInfo;
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
