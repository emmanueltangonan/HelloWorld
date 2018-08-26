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
        [HttpPost("[action]")]
        public IActionResult Todo([FromForm] SlackSlashCommandPayload data)
        {
            string test = "anything";
            return Ok();
        }
    }
}
