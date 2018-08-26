using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HelloWorldAppNETReact.Models
{
    public partial class HelloWorldContext : DbContext
    {
        public virtual DbSet<StickyNote> StickyNote { get; set; }
        public virtual DbSet<Task> Task { get; set; }

        public HelloWorldContext(DbContextOptions<HelloWorldContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StickyNote>(entity =>
            {
                entity.Property(e => e.CreationDate)
                    .HasColumnName("creationDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.DueDate)
                    .HasColumnName("dueDate")
                    .HasColumnType("date");

                entity.Property(e => e.EndTime)
                    .HasColumnName("endTime")
                    .HasColumnType("datetime");

                entity.Property(e => e.EventType)
                    .HasColumnName("eventType")
                    .HasColumnType("nchar(10)");

                entity.Property(e => e.IsScheduled).HasColumnName("isScheduled");

                entity.Property(e => e.Location)
                    .HasColumnName("location")
                    .HasMaxLength(50);

                entity.Property(e => e.PriorityLevel)
                    .HasColumnName("priorityLevel")
                    .HasMaxLength(50);

                entity.Property(e => e.StartTime)
                    .HasColumnName("startTime")
                    .HasColumnType("datetime");

                entity.Property(e => e.Title)
                    .HasColumnName("title")
                    .HasMaxLength(50);

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updatedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.XPos).HasColumnName("xPos");

                entity.Property(e => e.YPos).HasColumnName("yPos");

                entity.Property(e => e.IsComplete).HasColumnName("isComplete");
            });

            modelBuilder.Entity<Task>(entity =>
            {
                entity.Property(e => e.CreationDate)
                    .HasColumnName("creationDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.IsCancelled).HasColumnName("isCancelled");

                entity.Property(e => e.IsDone).HasColumnName("isDone");

                entity.Property(e => e.StickyNoteId).HasColumnName("stickyNoteId");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updatedDate")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.StickyNote)
                    .WithMany(p => p.Task)
                    .HasForeignKey(d => d.StickyNoteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StickyNote");
            });
        }
    }
}
