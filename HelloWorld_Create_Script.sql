CREATE TABLE [dbo].[StickyNote]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [title] NVARCHAR(50) NULL, 
    [priorityLevel] NVARCHAR(50) NULL, 
    [dueDate] DATE NULL, 
    [eventType] NCHAR(10) NULL, 
    [creationDate] DATETIME NULL, 
    [location] NVARCHAR(50) NULL, 
    [isScheduled] INT NULL, 
    [startTime] DATETIME NULL, 
    [endTime] DATETIME NULL
)

CREATE TABLE [dbo].[Task] (
    [Id]          INT            NOT NULL,
    [description] NVARCHAR (MAX) NULL,
    [isDone]      INT            NULL,
    [isCancelled] INT            NULL,
    [stickyNoteId] INT NOT NULL, 
    PRIMARY KEY CLUSTERED ([Id] ASC)
);