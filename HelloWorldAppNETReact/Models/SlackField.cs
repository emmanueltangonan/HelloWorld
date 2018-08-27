using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelloWorldAppNETReact.Models
{
    public class SlackField
    {
        public string Value { get; set; }

        public SlackField(string val)
        {
            Value = val;
        }
    }
}
