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
    public class SlackAPIController : Controller
    {
        private readonly HelloWorldContext _context;

        public SlackAPIController(HelloWorldContext context)
        {
            _context = context;
        }

        [HttpPost("[action]")]
        public IActionResult Todo([FromForm] SlackSlashCommandPayload data)
        {
            List<string> pLevels = new List<string> { "Low", "Med", "High" };
            int pLevelEndIndex = -1;
            string title = "";
            string pLevel = "";
            StickyNote note = null;
            
            try
            {
                string text = data.text;
                if (!String.IsNullOrEmpty(text)) {
                    text = text.Trim();
                    pLevelEndIndex = text.IndexOf(' ');
                    if (pLevelEndIndex < 1)
                    {
                        throw new Exception("Invalid format.");
                    }
                    pLevel = text.Substring(0, pLevelEndIndex);
                    title = text.Substring(pLevelEndIndex + 1, text.Length - 1 - pLevelEndIndex);
                    bool pLevelExists = pLevels.Any(p => p.ToLower().Equals(pLevel.ToLower()));
                    if (!pLevelExists)
                    {
                        throw new Exception("Invalid priority level.");
                    }
                }
               
                DateTime now = DateTime.Now;
                note = new StickyNote
                {
                    PriorityLevel = pLevel.ToUpper().Substring(0, 1) + pLevel.ToLower().Substring(1),
                    Title = title,
                    DueDate = now,
                    CreationDate = now,
                    UpdatedDate = now,
                    Origin = "Slack API"

                };
                _context.StickyNote.Add(note);
                _context.SaveChanges();
            }
            catch(Exception e)
            {
                string msg = e.Message;
                return Ok(new { Text = $"Whoops! That did not go well. {msg}" });
            }

            var attachment = new SlackAttachment
            {
                Color = "good",
                Pretext = $"Todo list created.",
                Title = $"Title: {note.Title} \n note_id: {note.Id}",
                Footer = "HelloWorldApp",
                Footer_icon = "https://ca.slack-edge.com/TCF30M1JQ-UCENPSZC1-g64840305598-48"
            };
            var attachments = new List<object> { attachment };
            var message = new { attachments };

            //var result = new { Text = $"Todo list created. note_id = {note.Id}" };

            return Ok(message);
        }

        [HttpPost("[action]")]
        public IActionResult TodoTask([FromForm] SlackSlashCommandPayload data)
        {
            int idEndIndex = -1;
            int id = 0;
            string taskDesc = "";
            Models.Task task;
            List<Models.Task> tasks;
            StickyNote note;
            try
            {
                string text = data.text;
                if (!String.IsNullOrEmpty(text))
                {
                    text = text.Trim();
                    idEndIndex = text.IndexOf(' ');
                    if (idEndIndex < 1)
                    {
                        throw new Exception("Invalid format.");
                    }
                    taskDesc = text.Substring(idEndIndex + 1, text.Length - 1 - idEndIndex);

                    bool idParseSucceeded = int.TryParse(text.Substring(0, idEndIndex), out id);
                    if (!idParseSucceeded)
                    {
                        throw new Exception("Note id not found from command.");
                    }
                }
                
                var linqResult = _context.StickyNote
                        .Where(n => n.Id == id);
                if (!linqResult.Any())
                {
                    throw new Exception($"Note id {id} does not exist.");
                }

                note = linqResult.First();

                task = new Models.Task
                {
                    StickyNoteId = note.Id,
                    Description = taskDesc,

                };
                _context.Task.Add(task);
                _context.SaveChanges();
                tasks = _context.Task
                    .Where(t => t.StickyNoteId == note.Id)
                    .ToList();
            }
            catch (Exception e)
            {
                string msg = e.Message;
                var errorResp = new SlackErrorResponse(msg);
                return Ok(errorResp);
            }

            var fields = new List<SlackField>();
            foreach (Models.Task t in tasks)
            {
                var status = t.IsDone == 1 ? "Done" : "Not Done";
                fields.Add(new SlackField($"{status} - {t.Description}"));
            }

            var attachment = new SlackAttachment
            {
                Color = "good",
                Pretext = $"Task added to list.",
                Title = note.Title,
                Fields = fields,
                Footer = "HelloWorldApp",
                Footer_icon = "https://ca.slack-edge.com/TCF30M1JQ-UCENPSZC1-g64840305598-48"
            };
            var attachments = new List<SlackAttachment> { attachment };
            var message = new { attachments };

            //var v = new { Text = $"Task '{taskDesc}' added to list: '{note.Title}'." };
            return Ok(message);
           
        }

        [HttpPost("[action]")]
        public IActionResult TodoAll([FromForm] SlackSlashCommandPayload data)
        {
            
            ICollection<StickyNote> notes = null;
            try
            {
                notes = _context.StickyNote
                    .FromSql(
                        "select distinct s.*" +
                        " from StickyNote s," +
                        " Task t" +
                        " where s.Id = t.StickyNoteId " +
                        " and (t.IsDone = 0 or t.IsDone is null)"
                    )
                    .ToList();
            }
            catch (Exception e)
            {
                string msg = e.Message;
                return Ok($"Whoops! Something has gone wrong. {msg}");
            }
            
            var fields = new List<SlackField>();
            foreach (StickyNote note in notes)
            {
                fields.Add(new SlackField($"{note.Id} - {note.Title}"));
            }

            var attachment = new SlackAttachment
            {
                Color = "good",
                Pretext = $"You have a total of {fields.Count} active todo list/s.",
                Title = "Active Todo Lists",
                Fields = fields,
                Title_link = "http://localhost:50405/",
                Footer = "HelloWorldApp",
                Footer_icon = "https://ca.slack-edge.com/TCF30M1JQ-UCENPSZC1-g64840305598-48"
            };
            var attachments = new List<object> { attachment };
            var message = new { attachments };

            return Ok(message);

        }

        [HttpPost("[action]")]
        public IActionResult TodoDetails([FromForm] SlackSlashCommandPayload data)
        {
            string text;
            int noteId;
            ICollection<Models.Task> tasks;
            StickyNote note;
            try
            {
                text = data.text;
                if (!String.IsNullOrEmpty(text) && !String.IsNullOrEmpty(text.Trim()))
                {
                    text = text.Trim();
                    bool isNumber = int.TryParse(text, out noteId);
                    if (!isNumber)
                    {
                        throw new Exception("Parameter passed is not a number.");
                    }
                    tasks = _context.Task
                        .Where(t => 
                            t.StickyNoteId == noteId
                        )
                        .ToList();
                    note = _context.StickyNote
                        .Where(n => n.Id == noteId)
                        .First();
                }
                else
                {
                    throw new Exception("Invalid format.");
                }
            }
            catch (Exception e)
            {
                string msg = e.Message;
                return Ok($"Whoops! Something has gone wrong. {msg}");
            }

            var fields = new List<SlackField>();
            foreach (Models.Task task in tasks)
            {
                var status = task.IsDone == 1 ? "Done" : "Not Done";
                fields.Add(new SlackField($"{status} - {task.Description}"));
            }

            var attachment = new SlackAttachment
            {
                Color = "good",
                Title = note.Title,
                Fields = fields,
                Title_link = "http://localhost:50405/",
                Footer = "HelloWorldApp",
                Footer_icon = "https://ca.slack-edge.com/TCF30M1JQ-UCENPSZC1-g64840305598-48"
            };
            var attachments = new List<object> { attachment };
            var message = new { attachments };

            return Ok(message);

        }
    }

}
