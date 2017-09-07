using ContactListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactListApp.Data
{
    public class DbInitializer
    {

        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Contacts.Any()) return;

            var tags = new Tag[]
            {
                new Tag{Name = "Obitelj"},
                new Tag{Name = "Posao"},
                new Tag{Name = "Prijatelji"}
            };
            
            foreach (var tag in tags)
            {
                context.Tags.Add(tag);
            }

            var types = new PhoneType[]
            {
                new PhoneType{Type = "Kućni"},
                new PhoneType{Type = "Mobitel"},
                new PhoneType{Type = "Službeni"},
                new PhoneType{Type = "Fax"}
            };

            foreach (var type in types)
            {
                context.PhoneTypes.Add(type);
            }
            
            context.SaveChanges();

            AddContact(context, "Tomislav", "Maslač", "tomislav.95og@gmail.com", "0915919599", "Obitelj", "Mobitel");
            AddContact(context, "Marko", "Marković", "marko.markic@gmail.com", "0915674722", "Prijatelji", "Mobitel");
            AddContact(context, "Luka", "Lukić", "luka.lukic@gmail.com", "0950548297", "Prijatelji", "Mobitel");
            AddContact(context, "Ivana", "Ivić", "ivana.ivic@gmail.com", "0950548297", "Prijatelji", "Mobitel");
            AddContact(context, "Petra", "Petrić", "petra.petric@gmail.com", "0998127364", "Posao", "Službeni");
            AddContact(context, "Filip", "Filipović", "filip.filipovic@gmail.com", "0916793321", "Posao", "Službeni");
            AddContact(context, "Jasna", "Jasnić", "jasna.jasnic@gmail.com", "0997480217", "Prijatelji", "Mobitel");
            AddContact(context, "Stipe", "Stipančić", "stipe.stipancic@gmail.com", "0955120957", "Prijatelji", "Mobitel");
            AddContact(context, "Ivor", "Ivorić", "ivor.ivoric@gmail.com", "0917755947", "Prijatelji", "Mobitel");
            AddContact(context, "Mara", "Marić", "mara.maric@gmail.com", "0994583201", "Prijatelji", "Mobitel");
        }

        public static void AddContact(ApplicationDbContext context, string firstName, string lastName, string mail, string number, string tag, string phoneType)
        {
            var contact = new Contact
            {
                FirstName = firstName,
                LastName = lastName,
                Emails = new List<Email> { new Email { EmailAddress = mail } },
                Numbers = new List<PhoneNumber> { new PhoneNumber { Number = number, Type = context.PhoneTypes.SingleOrDefault(t => t.Type == phoneType) } }
            };
            context.Contacts.Add(contact);

            if (!String.IsNullOrEmpty(tag))
            {
                var contactTag = new ContactTag
                {
                    Contact = contact,
                    Tag = context.Tags.SingleOrDefault(t => t.Name == tag)
                };
                context.ContactTags.Add(contactTag);
            }

            context.SaveChanges();
        }
    }
}
