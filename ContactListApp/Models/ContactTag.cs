using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactListApp.Models
{
    public class ContactTag
    {
        public int ContactId { get; set; }
        public int TagId { get; set; }
        public virtual Contact Contact { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
