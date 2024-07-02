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

  const editBtns = document.querySelectorAll('.btn-edit');
  editBtns.forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      const postId = e.target.closest('.post').id;
      const redirectUrl = `/update-post/${postId}`;

      window.location.href = redirectUrl;
    })
  );

  const form = document.getElementById('update-form');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const id = formData.get('post-id');
    const data = {
      postTitle: formData.get('postTitle'),
      postText: formData.get('postText'),
    };

    try {
      const response = await fetch(`/updatePost/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      window.location.href = '/';
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  });

  async function deletePost(id) {
    try {
      const response = await fetch(`/deletePost/${id}`, {
        method: 'DELETE',
        redirect: 'follow',
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          throw new Error('Network response was not ok');
        }
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
