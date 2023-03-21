// export const fetchImages = async searchQuery => {
//   const response = await fetch(
//     `https://pixabay.com/api/?key=34521727-b40265d11824baf1c84600c97&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
//   );

//   if (!response.ok) {
//     throw new Error(response.status);
//   }

//   const result = await response.json();
//   return result;
// };

// export const fetchImages = searchQuery => {
//   return fetch(
//     `https://pixabay.com/api/?key=34521727-b40265d11824baf1c84600c97&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// };
