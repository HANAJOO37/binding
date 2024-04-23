document.addEventListener('DOMContentLoaded', function() {
    function displayClothesImages(data) {
      const clothesContainer = document.querySelector('.clothes-container');
      clothesContainer.innerHTML = ''; 
  
      data.forEach(item => {
        const clothDiv = document.createElement('div');
        clothDiv.classList.add('cloth');
  
        const imageElement = document.createElement('img');
        imageElement.src = item.image_link;
        imageElement.alt = item.clothes;
  
        clothDiv.appendChild(imageElement);
        clothesContainer.appendChild(clothDiv);
      });
    }
  
    fetch('trendy.json')
      .then(response => response.json())
      .then(data => {
        displayClothesImages(data);
      })
      .catch(error => console.error('Error fetching JSON:', error));
  });
  