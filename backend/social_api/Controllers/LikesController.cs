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
    public class LikesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LikesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Likes/Post/5
        [HttpGet("Post/{postId}")]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetLikesForPost(int postId)
        {
            var likes = await _context.Likes
                .Include(l => l.User)
                .Where(l => l.PostId == postId)
                .Select(l => new LikeDto
                {
                    LikeId = l.LikeId,
                    PostId = l.PostId,
                    UserId = l.UserId,
                    Username = l.User.Username,
                    UserProfilePictureUrl = l.User.ProfilePictureUrl
                })
                .ToListAsync();

            return Ok(likes);
        }

        // POST: api/Likes/Post/5
        [HttpPost("Post/{postId}")]
        [Authorize]
        public async Task<IActionResult> LikePost(int postId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            // Check if post exists
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found");
            }

            // Check duplicate like
            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (existingLike != null)
            {
                return BadRequest("You already liked this post");
            }

            var like = new Like
            {
                PostId = postId,
                UserId = userId,
                TimeStamp = DateTime.UtcNow
            };

            _context.Likes.Add(like);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post liked successfully" });
        }

        // DELETE: api/Likes/Post/5
        [HttpDelete("Post/{postId}")]
        [Authorize]
        public async Task<IActionResult> UnlikePost(int postId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var like = await _context.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (like == null)
            {
                return NotFound("Like not found");
            }

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post unliked successfully" });
        }
    }
}
