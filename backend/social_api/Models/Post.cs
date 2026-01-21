
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using SocialMediaAPI.Enums;

namespace SocialMediaAPI
{
    public class Post
    {
        [Key]
        public int PostId {get; set;}
        [ForeignKey]
        public int UserId {get; set;}

        [MaxLength(5000)]
        public string Content {get; set;}

        public  MediaType MediaType {get; set;}
        
        public DateTime TimeStamp {get; set;}

        
    }

}

