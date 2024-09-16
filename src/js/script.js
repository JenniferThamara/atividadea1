document.getElementById('photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
      }
      reader.readAsDataURL(file);
    } else {
      previewContainer.style.display = 'none';
    }
  });
  
  document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
    const alertDiv = document.getElementById('alert');
  
    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
  
      const message = await response.text();
      alertDiv.className = 'alert alert-success';
      alertDiv.textContent = message;
      alertDiv.style.display = 'block';
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alertDiv.className = 'alert alert-error';
      alertDiv.textContent = 'Erro ao fazer upload.';
      alertDiv.style.display = 'block';
    }
  });
  