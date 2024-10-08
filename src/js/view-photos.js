document.addEventListener('DOMContentLoaded', async () => {
    const photoGallery = document.getElementById('photosList');

    try {
      const response = await fetch('/photos');
      const photos = await response.json();
  
      if (photos.length === 0) {
        photoGallery.innerHTML = '<p>Nenhuma foto encontrada.</p>';
        return;
      }
  
      photos.forEach(photo => {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo-container');
  
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.photoName || 'Sem nome';
        img.classList.add('photo');
  
        const caption = document.createElement('p');
        caption.textContent = `Nome: ${photo.photoName} | Data: ${new Date(photo.uploadDate).toLocaleDateString()}`;
  
        photoContainer.appendChild(img);
        photoContainer.appendChild(caption);
        photoGallery.appendChild(photoContainer);
      });
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      photoGallery.innerHTML = '<p>Erro ao carregar fotos.</p>';
    }
  });
  