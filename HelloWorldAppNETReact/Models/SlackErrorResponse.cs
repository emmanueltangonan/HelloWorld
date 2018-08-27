using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelloWorldAppNETReact.Models
{
    public class SlackErrorResponse
    {
        public ICollection<SlackAttachment> attachments { get; set; }

        public SlackErrorResponse(string message) {
            var attachment = new SlackAttachment
            {
                Color = "#ff0000",
                Pretext = $"Whoops! Something has gone wrong.",
                Title = message,
                Footer = "HelloWorldApp",
                Footer_icon = "https://ca.slack-edge.com/TCF30M1JQ-UCENPSZC1-g64840305598-48"
            };
            
            attachments = new List<SlackAttachment>();
            attachments.Add(attachment);

        }
    }
}
