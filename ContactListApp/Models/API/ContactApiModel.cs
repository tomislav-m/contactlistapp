using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactListApp.Models.API
{
    public class ContactApiModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public virtual ICollection<PhoneNumberApiModel> Numbers { get; set; }
        public virtual ICollection<EmailApiModel> Emails { get; set; }
        public virtual ICollection<TagApiModel> Tags { get; set; }
    }
}
