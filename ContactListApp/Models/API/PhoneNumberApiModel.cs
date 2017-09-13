using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactListApp.Models.API
{
    public class PhoneNumberApiModel
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public int PhoneTypeId { get; set; }
        public string Type { get; set; }
    }
}
