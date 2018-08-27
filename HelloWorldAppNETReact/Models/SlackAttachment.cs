using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelloWorldAppNETReact.Models
{
    public class SlackAttachment
    {
        public string Color { get; set; }
        public string Pretext { get; set; }
        public string Title { get; set; }
        public ICollection<SlackField> Fields { get; set; }
        public string Title_link { get; set; }
        public string Footer { get; set; }
        public string Footer_icon { get; set; }
    }
}
