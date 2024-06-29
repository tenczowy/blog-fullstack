document.addEventListener('DOMContentLoaded', function () {
  /////////DELETE POSTS////////
  /////////////////////////////
  const deleteBtns = document.querySelectorAll('.btn-delete');
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.closest('.post').id;
      deletePost(postId);
    });
  });

  async function deletePost(id) {
    try {
      const response = await fetch(`/deletePost/${id}`, {
        method: 'DELETE',
        redirect: 'follow', // This ensures fetch follows the redirect
      });

      if (response.redirected) {
        // Handle the redirection manually if needed
        window.location.href = response.url;
      } else {
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text(); // Handle HTML or text response
        }

        if (!response.ok) {
          console.error(
            `Error: ${response.status} - ${response.statusText}\n${responseData}`
          );
          throw new Error('Network response was not ok');
        }

        console.log('Response from server:', responseData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /////////////////////////////
  /////////////////////////////
  const mobileMenuBtn = document.querySelector('.menu-icon');
  const closeMenuBtn = document.querySelector('.close-icon');
  const mobileNav = document.querySelector('.mobile-nav');
  mobileMenuBtn.addEventListener('click', (e) => {
    toggleMenu();
  });
  closeMenuBtn.addEventListener('click', (e) => {
    toggleMenu();
  });

  const toggleMenu = function () {
    mobileNav.classList.toggle('hidden');
  };
});
