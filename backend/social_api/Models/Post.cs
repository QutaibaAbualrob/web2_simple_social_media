
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using SocialMediaAPI.Enums;
using SocialMediaAPI.Models;

namespace SocialMediaAPI
{
    public class Post
    {
        [Key]
        public int PostId {get; set;}

        
        public int UserId {get; set;}

        [MaxLength(5000)]
        public string? Content {get; set;}

        public  MediaType MediaType {get; set;}
        
        public string? MediaURL {get; set;}
        
        public DateTime TimeStamp {get; set;}

        
    }

}

