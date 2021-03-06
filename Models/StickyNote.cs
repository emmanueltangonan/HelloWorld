﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelloWorldAppNETReact.Models
{
    public partial class StickyNote
    {
        public StickyNote()
        {
            Task = new HashSet<Task>();
        }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; }
        public string PriorityLevel { get; set; }
        public DateTime? DueDate { get; set; }
        public string EventType { get; set; }
        public DateTime? CreationDate { get; set; }
        public string Location { get; set; }
        public int? IsScheduled { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? XPos { get; set; }
        public int? YPos { get; set; }

        public ICollection<Task> Task { get; set; }
    }
}
