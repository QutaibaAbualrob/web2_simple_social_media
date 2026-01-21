using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAPI.Models
{
    
    public class User
    {
        [Key]
        public int UserId {get; set;}

        [Required]
        [MaxLength(32)]
        public string Username {get; set;} = null!;
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email {get; set;} = null!;
        
        [Required]
        [MaxLength(20)]
        public string PasswordSalt {get; set;} = null!;
        
        [MaxLength(100)]
        public string? Name {get; set;}
        
        [MaxLength(500)]
        public string? Bio {get; set;}
        
        public string? ProfilePictureUrl {get; set;}

        [Required]
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

        public DateTime? ChangedAt {get; set;} 

    }

    
}