import { posts } from './data.js';

export function deletePost(id) {
  const index = posts.findIndex((post) => post.id == id);

  if (index !== -1) {
    posts.splice(index, 1);
    return true;
  }
}
