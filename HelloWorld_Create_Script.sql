USE [HelloWorld]
GO

/****** Object:  Table [dbo].[StickyNote]    Script Date: 24/08/2018 11:04:56 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[StickyNote](
	[Id] [int] IDENTITY NOT NULL,
	[title] [nvarchar](50) NULL,
	[priorityLevel] [nvarchar](50) NULL,
	[dueDate] [date] NULL,
	[eventType] [nchar](10) NULL,
	[creationDate] [datetime] NULL,
	[updatedDate] [datetime] NULL,
	[location] [nvarchar](50) NULL,
	[isScheduled] [int] NULL,
	[startTime] [datetime] NULL,
	[endTime] [datetime] NULL,
	[xPos] [int] NULL,
	[yPos] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO




USE [HelloWorld]
GO

/****** Object:  Table [dbo].[Task]    Script Date: 24/08/2018 11:05:31 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Task](
	[Id] [int] IDENTITY NOT NULL,
	[description] [nvarchar](max) NULL,
	[isDone] [int] NULL,
	[isCancelled] [int] NULL,
	[stickyNoteId] [int] NOT NULL,
	[creationDate] [datetime] NULL,
	[updatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK_StickyNote] FOREIGN KEY([stickyNoteId])
REFERENCES [dbo].[StickyNote] ([Id])
GO

ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK_StickyNote]
GO


----------- Aug 25 8pm
ALTER TABLE stickynote
ADD isComplete int;

----------- Aug 27 8:30am
ALTER TABLE stickynote
ADD origin nvarchar(50);