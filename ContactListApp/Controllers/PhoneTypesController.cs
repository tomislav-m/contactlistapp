using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactListApp.Data;
using ContactListApp.Models;

namespace ContactListApp.Controllers
{
    [Produces("application/json")]
    [Route("api/PhoneTypes")]
    public class PhoneTypesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PhoneTypesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PhoneTypes
        [HttpGet]
        public IEnumerable<PhoneType> GetPhoneTypes()
        {
            return _context.PhoneTypes;
        }

        // GET: api/PhoneTypes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhoneType([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phoneType = await _context.PhoneTypes.SingleOrDefaultAsync(m => m.Id == id);

            if (phoneType == null)
            {
                return NotFound();
            }

            return Ok(phoneType);
        }

        // PUT: api/PhoneTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhoneType([FromRoute] int id, [FromBody] PhoneType phoneType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != phoneType.Id)
            {
                return BadRequest();
            }

            _context.Entry(phoneType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhoneTypeExists(id))
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

        // POST: api/PhoneTypes
        [HttpPost]
        public async Task<IActionResult> PostPhoneType([FromBody] PhoneType phoneType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PhoneTypes.Add(phoneType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhoneType", new { id = phoneType.Id }, phoneType);
        }

        // DELETE: api/PhoneTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoneType([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var phoneType = await _context.PhoneTypes.SingleOrDefaultAsync(m => m.Id == id);
            if (phoneType == null)
            {
                return NotFound();
            }

            _context.PhoneTypes.Remove(phoneType);
            await _context.SaveChangesAsync();

            return Ok(phoneType);
        }

        private bool PhoneTypeExists(int id)
        {
            return _context.PhoneTypes.Any(e => e.Id == id);
        }
    }
}