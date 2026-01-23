
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using SocialMediaAPI.Enums;


namespace SocialMediaAPI.Models
{
    public class Post
    {
        [Key]
        public int PostId {get; set;}

        
        public int UserId {get; set;}

        [MaxLength(5000)]
        public string Content {get; set;} = null!;

        public  MediaType MediaType {get; set;} = MediaType.None;
        
        public string MediaURL {get; set;} = null!;

        
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;

        public User User {get; set;} = null!;
        
        public ICollection<Comment> Comments {get; set;} = new List<Comment>();
        public ICollection<Like> Likes {get; set;} = new List<Like>();
    }

}

