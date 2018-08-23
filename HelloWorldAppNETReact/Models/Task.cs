using System;
using System.Collections.Generic;

namespace HelloWorldAppNETReact.Models
{
    public partial class Task
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int? IsDone { get; set; }
        public int? IsCancelled { get; set; }
        public int StickyNoteId { get; set; }

        public StickyNote StickyNote { get; set; }
    }
}
