import { ACCESS_TOKEN_KEY } from "./constants.js";

const helperURLFunction = (endPath) => {
  return `/api/${endPath}`;
};

const apiRequest = (path, options = {}) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return fetch(helperURLFunction(path), {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

const changePostCommentCount = (posts, postId, change) =>
  posts.map((post) =>
    String(post.id) === String(postId)
      ? {
          ...post,
          _count: {
            ...post._count,
            comments: Math.max(0, (post._count?.comments ?? 0) + change),
          },
        }
      : post,
  );

export { apiRequest, changePostCommentCount, helperURLFunction };