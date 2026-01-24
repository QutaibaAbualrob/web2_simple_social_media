using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DataBaseContext;
using SocialMediaAPI.Models;
using SocialMediaAPI.Dtos;

namespace SocialMediaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Comments/Post/5
        [HttpGet("Post/{postId}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsForPost(int postId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
             if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 20;

            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.PostId == postId)
                .OrderByDescending(c => c.TimeStamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CommentDto
                {
                    CommentId = c.CommentId,
                    PostId = c.PostId,
                    UserId = c.UserId,
                    Username = c.User.Username,
                    UserProfilePictureUrl = c.User.ProfilePictureUrl,
                    Content = c.Content,
                    TimeStamp = c.TimeStamp
                })
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/Comments
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CommentDto>> CreateComment(CreateCommentDto commentDto)
        {
            if (string.IsNullOrEmpty(commentDto.Content) || commentDto.Content.Length > 300)
            {
                return BadRequest("Content is required and must be less than 300 characters.");
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
           if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var comment = new Comment
            {
                PostId = commentDto.PostId,
                UserId = userId,
                Content = commentDto.Content,
                TimeStamp = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            var returnDto = new CommentDto
            {
                CommentId = comment.CommentId,
                PostId = comment.PostId,
                UserId = comment.UserId,
                Username = user?.Username ?? "Unknown",
                UserProfilePictureUrl = user?.ProfilePictureUrl,
                Content = comment.Content,
                TimeStamp = comment.TimeStamp
            };

            return CreatedAtAction(nameof(GetCommentsForPost), new { postId = comment.PostId }, returnDto);
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
             if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            if (comment.UserId != userId)
            {
                return Forbid();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
