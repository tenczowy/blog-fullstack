import { posts } from './data.js';

export function updatePost(updatedPost) {
  const postToUpdate = posts.find((post) => post.id == updatedPost.id);
  postToUpdate.title = updatedPost.title;
  postToUpdate.text = updatedPost.text;

  return true;
}
