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
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 10;

            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.TimeStamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostDto
                {
                    PostId = p.PostId,
                    UserId = p.UserId,
                    Username = p.User.Username,
                    UserProfilePictureUrl = p.User.ProfilePictureUrl,
                    Content = p.Content,
                    MediaUrl = p.MediaURL,
                    MediaType = p.MediaType,
                    TimeStamp = p.TimeStamp,
                    LikesCount = p.Likes.Count,
                    CommentsCount = p.Comments.Count
                })
                .ToListAsync();

            return Ok(posts);
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(int id)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => p.PostId == id)
                .Select(p => new PostDto
                {
                    PostId = p.PostId,
                    UserId = p.UserId,
                    Username = p.User.Username,
                    UserProfilePictureUrl = p.User.ProfilePictureUrl,
                    Content = p.Content,
                    MediaUrl = p.MediaURL,
                    MediaType = p.MediaType,
                    TimeStamp = p.TimeStamp,
                    LikesCount = p.Likes.Count,
                    CommentsCount = p.Comments.Count
                })
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);
        }

        // GET: api/Posts/User/{userId}
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetPostsForUser(int userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 10;

            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.TimeStamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostDto
                {
                    PostId = p.PostId,
                    UserId = p.UserId,
                    Username = p.User.Username,
                    UserProfilePictureUrl = p.User.ProfilePictureUrl,
                    Content = p.Content,
                    MediaUrl = p.MediaURL,
                    MediaType = p.MediaType,
                    TimeStamp = p.TimeStamp,
                    LikesCount = p.Likes.Count,
                    CommentsCount = p.Comments.Count
                })
                .ToListAsync();

            return Ok(posts);
        }

        // POST: api/Posts
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PostDto>> CreatePost(CreatePostDto createPostDto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var post = new Post
            {
                UserId = userId,
                Content = createPostDto.Content,
                MediaURL = createPostDto.MediaUrl ?? string.Empty,
                MediaType = createPostDto.MediaType,
                TimeStamp = DateTime.UtcNow
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Reload to get User and relationships if needed, or just construct DTO manually
            // We need User info for the return DTO. 
            // Better to load the User details separately or just return what we have if we assume the client knows the user.
            // But let's fetch the user to return a complete DTO.
            var user = await _context.Users.FindAsync(userId);
            
            var postDto = new PostDto
            {
                PostId = post.PostId,
                UserId = post.UserId,
                Username = user?.Username ?? "Unknown",
                UserProfilePictureUrl = user?.ProfilePictureUrl,
                Content = post.Content,
                MediaUrl = post.MediaURL,
                MediaType = post.MediaType,
                TimeStamp = post.TimeStamp,
                LikesCount = 0,
                CommentsCount = 0
            };

            return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, postDto);
        }

        // PUT: api/Posts/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(int id, UpdatePostDto updatePostDto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
           if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            if (post.UserId != userId)
            {
                return Forbid(); // Or Unauthorized
            }

            post.Content = updatePostDto.Content;
            post.MediaURL = updatePostDto.MediaUrl ?? post.MediaURL;
            post.MediaType = updatePostDto.MediaType;
            // post.TimeStamp  // Usually we don't update creation time, maybe ChangedAt if it existed on Post model, but it looks like only User has ChangedAt in the prompt description, wait.
            // Prompt says: "Post: CreatedAt, ChangedAt". 
            // My view_file of Post.cs showed only `TimeStamp`.
            // I will stick to Post.cs content. If I need ChangedAt, I should add it to the model. 
            // The user said "database schema is complete", so I will assume Post.cs is truth.
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
             if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

             if (post.UserId != userId)
            {
                return Forbid();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.PostId == id);
        }
    }
}
