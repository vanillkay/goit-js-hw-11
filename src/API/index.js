import 'dotenv/config';
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.BASE_URL,
  params: {
    key: process.env.API_TOKEN,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  },
});

export const getPhotos = async (q, page = 1) =>
  await API.get('/', { params: { q, page } }).then(({ data }) => {
    if (data.totalHits === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return data;
  });
