namespace SocialMediaAPI.Dtos
{
    public class CreateCommentDto
    {
        public int PostId { get; set; }
        public string Content { get; set; } = null!;
    }

    public class CommentDto
    {
        public int CommentId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string? UserProfilePictureUrl { get; set; }
        public string Content { get; set; } = null!;
        public DateTime TimeStamp { get; set; }
    }
}
