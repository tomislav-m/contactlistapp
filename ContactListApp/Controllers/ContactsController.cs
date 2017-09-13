using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactListApp.Data;
using ContactListApp.Models;
using ContactListApp.Models.API;

namespace ContactListApp.Controllers
{
    [Produces("application/json")]
    [Route("api/Contacts")]
    public class ContactsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Contacts
        [HttpGet]
        public IEnumerable<Contact> GetContacts()
        {
            return _context.Contacts.OrderBy(c => c.FirstName);
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContact([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contact = await _context.Contacts
                .Include(n => n.Numbers)
                .Include(e => e.Emails)
                .Include(ct => ct.ContactTags)
                .SingleOrDefaultAsync(m => m.Id == id);

            if (contact == null)
            {
                return NotFound();
            }

            var tags = new List<TagApiModel>();
            foreach (var tagId in contact.ContactTags.Select(t => t.TagId)) {
                foreach (var tag in _context.Tags.Where(t => t.Id == tagId))
                {
                    tags.Add(new TagApiModel { Id = tag.Id, Name = tag.Name });
                }
            }

            var numbers = new List<PhoneNumberApiModel>();
            foreach(var number in contact.Numbers)
            {
                numbers.Add(new PhoneNumberApiModel { Id = number.Id, Number = number.Number, TypeId = number.PhoneTypeId, Type = _context.PhoneTypes.SingleOrDefault(t => t.Id == number.PhoneTypeId).Type });
            }

            var emails = new List<EmailApiModel>();
            foreach(var email in contact.Emails)
            {
                emails.Add(new EmailApiModel { Id = email.Id, EmailAddress = email.EmailAddress });
            }

            var contactToReturn = new ContactApiModel
            {
                Id = contact.Id,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                Address = contact.Address,
                Emails = emails,
                Tags = tags,
                Numbers = numbers
            };

            return Ok(contactToReturn);
        }

        // PUT: api/Contacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact([FromRoute] int id, [FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contact.Id)
            {
                return BadRequest();
            }

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Contacts
        [HttpPost]
        public async Task<IActionResult> PostContact([FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContact", new { id = contact.Id }, contact);
        }

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contact = await _context.Contacts.SingleOrDefaultAsync(m => m.Id == id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return Ok(contact);
        }

        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
    }
}