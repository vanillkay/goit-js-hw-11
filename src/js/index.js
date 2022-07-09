import 'dotenv/config';
import { getPhotos } from '../API';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderCardItem } from './render-utils';

window.onload = () => {
  const searchForm = document.querySelector('form[role="search"]');
  const submitBtn = searchForm.querySelector('button[type="submit"]');
  const gallery = document.querySelector('.gallery');
  const infinityLoader = document.querySelector('#infinity-loader');

  const galleryBox = new SimpleLightbox('.gallery div.card', {
    sourceAttr: 'data-url',
  });

  const PHOTOS_PER_PAGE = 20;
  let category = null;
  let allHits = null;
  let page = 1;

  function isNexDataExist() {
    return PHOTOS_PER_PAGE * page < allHits;
  }

  function isGalleryEmpty() {
    return gallery.children.length === 0;
  }

  function toggleLoading() {
    infinityLoader.classList.toggle('d-none');
  }

  function notifySuccess(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function onSubmitForm(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.search;
    const inputValue = input.value.trim();

    if (!isGalleryEmpty()) {
      scrollTop();
      gallery.innerHTML = '';
    }

    if (inputValue.length === 0) {
      Notify.warning('Write some value');
      return;
    }

    if (category === inputValue) {
      Notify.info('Already on the page');
      return;
    }
    category = inputValue;
    if (page !== 1) {
      page = 1;
    }

    renderGallery();
  }

  async function loadPhotos() {
    try {
      toggleLoading();
      submitBtn.disabled = true;
      const { hits, totalHits } = await getPhotos(category, page);
      if (page === 1) {
        notifySuccess(totalHits);
        allHits = totalHits;
      }
      return hits;
    } catch (error) {
      Notify.failure(error.message);
    } finally {
      submitBtn.disabled = false;
      toggleLoading();
    }
  }

  async function renderGallery() {
    const photos = await loadPhotos();
    if (!photos) {
      return;
    }
    const galleryItems = photos.map(photo => renderCardItem(photo));
    gallery.insertAdjacentHTML('beforeend', galleryItems.join(''));
    galleryBox.refresh();
  }

  async function renderMoreCards() {
    page += 1;
    const newPhoto = await loadPhotos();
    if (!newPhoto) {
      return;
    }
    const newGalleryItems = newPhoto.map(newPhoto => renderCardItem(newPhoto));
    gallery.insertAdjacentHTML('beforeend', newGalleryItems.join(''));
    galleryBox.refresh();
  }

  function infinityScroll() {
    const isNeedToLoadMore =
      document.documentElement.scrollTop +
        document.documentElement.clientHeight >=
      document.documentElement.scrollHeight;

    if (
      isNeedToLoadMore &&
      infinityLoader.classList.contains('d-none') &&
      isNexDataExist()
    ) {
      renderMoreCards();
    }
  }

  window.addEventListener('scroll', infinityScroll);
  searchForm.addEventListener('submit', onSubmitForm);
};
