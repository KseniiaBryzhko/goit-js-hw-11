import axios from 'axios';

let page = 0;
const perPage = 40;

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '34521727-b40265d11824baf1c84600c97';

async function fetchImages(searchQuery) {
  const params = {
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: (page += 1),
    per_page: `${perPage}`,
  };
  const urlAXIOS = `?key=${API_KEY}`;

  const { data } = await axios.get(urlAXIOS, { params });
  return data;
}

export { page, perPage, API_KEY, fetchImages, axios };
