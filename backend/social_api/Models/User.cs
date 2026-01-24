using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using SocialMediaAPI.Models;


namespace SocialMediaAPI.Models
{
    
    public class User
    {
        [Key]
        public int UserId {get; set;}

        
        [MaxLength(32)]
        public string Username {get; set;} = null!;

        
        [EmailAddress]
        [MaxLength(100)]
        public string Email {get; set;} = null!;
        
        
        [MaxLength(20)]
        public string PasswordHash {get; set;} = null!;
        
        [MaxLength(100)]
        public string Name {get; set;}= null!;
        
        [MaxLength(500)]
        public string Bio {get; set;} = null!;
        
        public string ProfilePictureUrl {get; set;} = null!;

        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ChangedAt {get; set;} 

        public ICollection<Post> Posts {get; set;} = new List<Post>();
        public ICollection<Comment> Comments {get; set;} = new List<Comment>();
        
        public ICollection<Like> Likes {get; set;} = new List<Like>();

    }   

    
}