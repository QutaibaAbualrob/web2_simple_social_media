using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;

using SocialMediaAPI.Models;

namespace SocialMediaAPI.Models
{

    public class Comment
    {
        [Key]
        public int CommentId {get; set;}
        public int PostId {get; set;}

        public int UserId {get; set;}

        [MaxLength(300)]
        public string Content {get; set;} = null!;

        
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;

        public Post Post {get; set;} = null!;
        public User User {get; set;} = null!;
    }

}