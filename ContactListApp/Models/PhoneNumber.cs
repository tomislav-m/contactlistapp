using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ContactListApp.Models
{
    public class PhoneNumber
    {
        public int Id { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        [StringLength(30, ErrorMessage = "Dužina telefonskog broja smije biti najviše 30 znakova")]
        public string Number { get; set; }

        public int ContactId { get; set; }
        public virtual Contact Contact { get; set; }
        public int PhoneTypeId { get; set; }
        public virtual PhoneType Type { get; set; }
    }
}
