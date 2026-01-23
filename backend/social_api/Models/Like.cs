
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using SocialMediaAPI.Models;

namespace SocialMediaAPI
{

    public class Like
    {
        [Key]
        public int LikeId {get; set;}
        public int PostId {get; set;}

        public int CommentId {get; set;}
        public int UserId {get; set;}

        public DateTime TimeStamp = DateTime.UtcNow;


    }
}