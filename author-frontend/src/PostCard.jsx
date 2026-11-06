const PostCard = ({ postCard, showPublicationStatus }) => (
  <div className="post-card">
    {showPublicationStatus && (
      <small
        className={`publication-status ${postCard.isPublished ? "published" : "unpublished"}`}
      >
        {postCard.isPublished ? "Published" : "Unpublished"}
      </small>
    )}
    <h3>{postCard.title}</h3>
    <p>{postCard.body}</p>
    <small className="post-comment-count">
      💬 {postCard._count?.comments ?? 0} comments
    </small>
  </div>
);

export { PostCard };