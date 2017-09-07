using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ContactListApp.Models
{
    public class Email
    {
        public int Id { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        [StringLength(50, ErrorMessage = "Dužina email adrese smije biti najviše 30 znakova")]
        public string EmailAddress { get; set; }

        public int ContactId { get; set; }
        public virtual Contact Contact { get; set; }
    }
}
