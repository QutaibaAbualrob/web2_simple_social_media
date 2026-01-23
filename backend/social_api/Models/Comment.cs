using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using SocialMediaAPI.Models;

namespace SocialMediaAPI
{

    public class Comment
    {
        [Key]
        public int CommentId {get; set;}
        public int PostId {get; set;}

        public int UserId {get; set;}

        [MaxLength(300)]
        public string Content {get; set;} = null!;

        public DateTime TimeStamp {get; set;} = DateTime.UtcNow;

    }

}