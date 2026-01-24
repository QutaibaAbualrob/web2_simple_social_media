namespace SocialMediaAPI.Dtos
{
    public class LikeDto
    {
        public int LikeId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string? UserProfilePictureUrl { get; set; }
    }
}
