
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace SocialMediaAPI.Models
{

    public class Like
    {
        [Key]
        public int LikeId {get; set;}
        public int PostId {get; set;}

        public int CommentId {get; set;}
        public int UserId {get; set;}

        public DateTime TimeStamp = DateTime.UtcNow;

        public Post Post {get; set;} = null!;
        public User User {get; set;} = null!;

    }
}