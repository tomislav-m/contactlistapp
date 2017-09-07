using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ContactListApp.Models
{
    public class Tag
    {
        public int Id { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "Dužina telefonskog broja smije biti najviše 30 znakova")]
        public string Name { get; set; }

        public virtual ICollection<ContactTag> ContactTags { get; set; }
    }
}
