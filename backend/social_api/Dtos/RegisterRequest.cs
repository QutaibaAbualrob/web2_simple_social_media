using System.ComponentModel.DataAnnotations;

namespace SocialMediaAPI.Dtos
{
    public class RegisterRequest
    {
        [Required]
        [MinLength(3, ErrorMessage = "Username must be at least 3 characters")]
        [MaxLength(30, ErrorMessage = "Username must be less than 30 characters")]
        public string Username { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;
    }
}
