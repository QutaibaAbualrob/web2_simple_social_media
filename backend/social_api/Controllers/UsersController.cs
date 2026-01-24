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
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users/me
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
           if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            return MapToDto(user);
        }

        // PUT: api/Users/me
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMe(UpdateUserDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
           if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdStr);

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            // Input Validation (Example constraint: Name max 100)
             if (dto.Name.Length > 100)
            {
                return BadRequest("Name cannot exceed 100 characters");
            }
            // Bio max 500? (Model says 500)
            if (dto.Bio.Length > 500)
            {
                return BadRequest("Bio cannot exceed 500 characters");
            }

            user.Name = dto.Name;
            user.Bio = dto.Bio;
            user.ProfilePictureUrl = dto.ProfilePictureUrl ?? user.ProfilePictureUrl; // Use existing if not provided or empty? 
            // Or if DTO has it as null, maybe we shouldn't overwrite? DTO field is non-nullable string in my previous step?
            // "public string ProfilePictureUrl { get; set; } = null!;"
            // If the client sends JSON, it might be string. If they send null, it might be issue or default.
            // I'll update it blindly if it's not null.
            
            user.ChangedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return MapToDto(user);
        }

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email, // Maybe hide email for public view? Prompt didn't specify. I'll include it.
                Name = user.Name,
                Bio = user.Bio,
                ProfilePictureUrl = user.ProfilePictureUrl,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
