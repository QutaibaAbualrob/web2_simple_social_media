using SocialMediaAPI.Enums;

namespace SocialMediaAPI.Dtos
{
    public class CreatePostDto
    {
        public string Content { get; set; } = null!;
        public string? MediaUrl { get; set; }
        public MediaType MediaType { get; set; } = MediaType.None;
    }

    public class UpdatePostDto
    {
        public string Content { get; set; } = null!;
        public string? MediaUrl { get; set; }
        public MediaType MediaType { get; set; } = MediaType.None;
    }

    public class PostDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string? UserProfilePictureUrl { get; set; }
        public string Content { get; set; } = null!;
        public string? MediaUrl { get; set; }
        public MediaType MediaType { get; set; }
        public DateTime TimeStamp { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
    }
}
