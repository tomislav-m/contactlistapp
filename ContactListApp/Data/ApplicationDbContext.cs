using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ContactListApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactListApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ContactTag> ContactTags { get; set; }
        public DbSet<Email> Mails { get; set; }
        public DbSet<PhoneNumber> PhoneNumbers { get; set; }
        public DbSet<PhoneType> PhoneTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Contact>().ToTable("Contact");
            modelBuilder.Entity<Tag>().ToTable("Tag");
            modelBuilder.Entity<ContactTag>().ToTable("ContactTag");
            modelBuilder.Entity<Email>().ToTable("Mail");
            modelBuilder.Entity<PhoneNumber>().ToTable("PhoneNumber");
            modelBuilder.Entity<PhoneType>().ToTable("PhoneType");
            modelBuilder.Entity<ContactTag>().HasKey(table => new { table.ContactId, table.TagId });
        }
    }
}
