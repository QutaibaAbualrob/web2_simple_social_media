


namespace SocialMediaAPI.Dtos
{
    
    public class CommentResponse
    {
        public int CommentId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        public string AuthorName { get; set; } = null!;
        public string AuthorHeadline { get; set; } = null!;
        public string? AuthorImageUrl { get; set; }

        public bool IsOwner { get; set; }
    }

    
}