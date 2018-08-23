using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HelloWorldAppNETReact.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelloWorldAppNETReact.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class HelloWorldController : Controller
    {
        private readonly HelloWorldContext _context;

        public HelloWorldController(HelloWorldContext context)
        {
            _context = context;
        }


        [HttpGet("[action]")]
        public IActionResult GetNotes(DateTime? date = null)
        {
            ICollection<StickyNote> queryResult = null;
            var query = _context.StickyNote;
            
            try
            {
                if (date == null)
                // get all notes
                {
                    queryResult = query
                        .ToList();
                }
                else
                {
                    // get date specific
                    queryResult = query
                        .Where(
                            note => Nullable.Compare(note.DueDate, date) == 0
                        )
                        .ToList();
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok(queryResult);
        }

        [HttpGet("[action]")]
        public IActionResult GetTasks(int? stickyNoteId)
        {
            ICollection<Models.Task> queryResult = null;
            var query = _context.Task;

            try
            {
                if (stickyNoteId == null)
                {
                    return BadRequest();
                }
                else
                {
                    queryResult = query
                        .Where(
                            task => task.StickyNoteId == stickyNoteId
                        )
                        .ToList();
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok(queryResult);
        }

    }
}