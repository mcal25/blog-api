const PostCard = ({ postCard }) => (
  <div className="post-card">
    <h3>{postCard.title}</h3>
    <p>{postCard.body}</p>
    <small className="post-comment-count">
      💬 {postCard._count?.comments ?? 0} comments
    </small>
  </div>
);

export { PostCard };