using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ContactListApp.Models
{
    public class PhoneType
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(20, ErrorMessage = "Dužina naziva tipa telefonskog broja smije biti najviše 20 znakova")]
        public string Type { get; set; }

        public virtual ICollection<PhoneNumber> PhoneNumbers { get; set; }
    }
}
