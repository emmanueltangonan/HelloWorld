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
        public IActionResult GetNotes(string view, DateTime? date = null)
        {
            ICollection<StickyNote> queryResult = null;
            var query = _context.StickyNote;
            
            try
            {
                if (date == null)
                // get all notes
                {

                    if (!String.IsNullOrEmpty(view) && view.ToLower().Equals("active"))
                    {
                        queryResult = query
                            .Where(n => n.IsComplete != 1)
                            .ToList();
                    }
                    else //archived 
                    {
                        queryResult = query
                            .Where(n => n.IsComplete == 1)
                            .ToList();
                    }
                    
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

        [HttpPost("[action]")]
        public IActionResult SaveNewNote([FromBody] StickyNote note)
        {
            try
            {
                DateTime now = DateTime.Now;
                note.CreationDate = now;
                note.UpdatedDate = now;
                note.Origin = "Web app";
                _context.StickyNote.Add(note);

                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok(note.Id);
        }

        [HttpPost("[action]")]
        public IActionResult UpdateTask([FromBody] Models.Task task)
        {
            Models.Task taskToUpdate = null;
            try
            {
                taskToUpdate = _context.Task.Where(t => t.Id == task.Id).Single<Models.Task>();
                if (taskToUpdate != null && (taskToUpdate.IsDone == 0 || taskToUpdate.IsDone == null))
                {
                    taskToUpdate.IsDone = 1;
                }
                else
                {
                    taskToUpdate.IsDone = 0;
                }
                taskToUpdate.UpdatedDate = DateTime.Now;
                _context.SaveChanges();

                //ICollection<Models.Task> allTasks = _context.Task
                //    .Where(t => t.StickyNoteId == taskToUpdate.StickyNoteId)
                //    .ToList();

                //bool allTasksComplete = true;
                //foreach (Models.Task t in allTasks)
                //{
                //    if (t.IsDone == null || t.IsDone == 0)
                //    {
                //        allTasksComplete = false;
                //        break;
                //    }
                //}

                //StickyNote note = _context.StickyNote
                //    .Where(n => n.Id == taskToUpdate.StickyNoteId)
                //    .First();

                //note.IsComplete = allTasksComplete ? 1 : 0;
                //_context.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok(taskToUpdate);
        }

        [HttpPost("[action]")]
        public IActionResult DeleteNote([FromBody] StickyNote note)
        {
            try
            {
                StickyNote noteToDelete = _context.StickyNote
                    .Where(n => n.Id == note.Id)
                    .First();

                ICollection<Models.Task> tasks = _context.Task
                    .Where(t => t.StickyNoteId == note.Id)
                    .ToList();

                foreach (var task in tasks)
                {
                    _context.Remove(task);
                }

                _context.Remove(noteToDelete);

                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok("success");
        }

        [HttpPost("[action]")]
        public IActionResult SetAsArchived([FromBody] StickyNote note)
        {
            try
            {
                note = _context.StickyNote.Where(n => n.Id == note.Id).Single();
                if (note != null && (note.IsComplete == 0 || note.IsComplete == null))
                {
                    note.IsComplete = 1;
                }
               
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok(note);
        }

    }
}