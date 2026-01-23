
using Microsoft.EntityFrameworkCore;

using SocialMediaAPI.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options) { }
    

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }

    // NOT USED
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User - Posts relation
        modelBuilder.Entity<Post>()
            .HasOne(post => post.User)
            .WithMany(user => user.Posts)
            .HasForeignKey(p => p.UserId);

        // Like - User relation 
        modelBuilder.Entity<Like>()
        .HasOne(like => like.User)
        .WithMany(user => user.Likes)
        .HasForeignKey(like => like.UserId);


    }

   
}
