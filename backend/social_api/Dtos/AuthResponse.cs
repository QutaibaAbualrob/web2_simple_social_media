namespace SocialMediaAPI.Dtos
{
    public class AuthResponse
    {
        public string Token { get; set; }= null!;
        public int UserId { get; set; }
        public string Username { get; set; }= null!;
        public string Name { get; set; }= null!;
    }

}