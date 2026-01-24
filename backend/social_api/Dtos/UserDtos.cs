namespace SocialMediaAPI.Dtos
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!; 
        public string Name { get; set; } = null!;
        public string Bio { get; set; } = null!;
        public string ProfilePictureUrl { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateUserDto
    {
        public string Name { get; set; } = null!;
        public string Bio { get; set; } = null!;
        public string ProfilePictureUrl { get; set; } = null!;
    }
}
