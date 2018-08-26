using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HelloWorldAppNETReact.Models;
using Microsoft.AspNetCore.Mvc;

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
        public string Todo([FromForm] SlackSlashCommandPayload data)
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
                    title = text.Substring(pLevelEndIndex + 1, text.Length - 1 - pLevelEndIndex);
                    bool pLevelExists = pLevels.Any(p => p.ToLower().Equals(pLevel.ToLower()));
                    pLevel = text.Substring(0, pLevelEndIndex);
                }

                note = new StickyNote
                {
                    PriorityLevel = pLevel.ToUpper().Substring(0, 1) + pLevel.ToLower().Substring(1),
                    Title = title,
                    DueDate = DateTime.Now,

                };
                _context.StickyNote.Add(note);
                _context.SaveChanges();
            }
            catch(Exception e)
            {
                string msg = e.Message;
                return $"Whoops! Something has gone wrong. {msg}";
            }
            return $"Todo list created. todoNote_id = {note.Id}";
        }

        [HttpPost("[action]")]
        public IActionResult TodoTask([FromForm] SlackSlashCommandPayload data)
        {
            int idEndIndex = -1;
            int id = 0;
            string taskDesc = "";
            Models.Task task = null;
            StickyNote note = null;
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
                        throw new Exception("Note ID not found from command.");
                    }
                }

                note = _context.StickyNote
                        .Where(n => n.Id == id)
                        .First();
                if (note == null)
                {
                    throw new Exception("Note ID does not exist.");
                }

                task = new Models.Task
                {
                    StickyNoteId = note.Id,
                    Description = taskDesc,

                };
                _context.Task.Add(task);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                string msg = e.Message;
                return StatusCode(500, $"Whoops! Something has gone wrong. {msg}");
            }

            var v = new { Text = $"Task '{taskDesc}' added to list: '{note.Title}'." };
            //return Ok(v);
            List<object> fields = new List<object> {
                new {
                    value = "33 - All HelloWorld Tasks"
                }
            };

            var attachment = new {
                color = "good",
                pretext = "You have a total of # todo lists.",
                title = "Todo Lists",
                fields = fields,
                title_link = "http://localhost:51093/",
                footer = "HelloWorldApp",
                footer_icon = "https://ca.slack-edge.com/TCF30M1JQ-UCENPSZC1-g64840305598-48"
            };
            var attachments = new List<object> { attachment };
            var message = new { attachments = attachments };

            return Ok(message);
    

        }
    }
}
