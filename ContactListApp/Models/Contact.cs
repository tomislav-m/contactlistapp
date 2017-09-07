using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ContactListApp.Models
{
    public class Contact
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Unos imena je obavezan")]
        [StringLength(30, ErrorMessage = "Dužina imena smije biti najviše 30 znakova")]
        public string FirstName { get; set; }

        [StringLength(30, ErrorMessage = "Dužina prezimena smije biti najviše 30 znakova")]
        public string LastName { get; set; }

        [StringLength(40, ErrorMessage = "Dužina adrese smije biti najviše 40 znakova")]
        public string Address { get; set; }
        public virtual ICollection<PhoneNumber> Numbers { get; set; }
        public virtual ICollection<Email> Emails { get; set; }
        public virtual ICollection<ContactTag> ContactTags { get; set; }
    }
}
