using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


public class Comment
{
    public int CommentId {get; set;}
    public int PostId {get; set;}

    public int UserId {get; set;}

    public string? Content {get; set;}

    public DateTime TimeStamp {get; set;} = DateTime.UtcNow;

}