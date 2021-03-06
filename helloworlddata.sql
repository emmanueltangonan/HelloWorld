USE [HelloWorld]
GO
INSERT [dbo].[StickyNote] ([Id], [title], [priorityLevel], [dueDate], [eventType], [creationDate], [location], [isScheduled], [startTime], [endTime], [xPos], [yPos]) VALUES (1, N'HelloWorld project tasks', N'high', CAST(N'2018-08-23' AS Date), N'todo      ', CAST(N'2018-08-23T10:55:00.000' AS DateTime), NULL, 0, NULL, NULL, NULL, NULL)
INSERT [dbo].[StickyNote] ([Id], [title], [priorityLevel], [dueDate], [eventType], [creationDate], [location], [isScheduled], [startTime], [endTime], [xPos], [yPos]) VALUES (2, N'Videos To Watch', N'med', CAST(N'2018-08-23' AS Date), N'todo      ', CAST(N'2018-08-23T10:57:00.000' AS DateTime), NULL, 0, NULL, NULL, NULL, NULL)
INSERT [dbo].[StickyNote] ([Id], [title], [priorityLevel], [dueDate], [eventType], [creationDate], [location], [isScheduled], [startTime], [endTime], [xPos], [yPos]) VALUES (3, N'Miscellaneous', N'low', CAST(N'2018-08-23' AS Date), N'todo      ', CAST(N'2018-08-23T11:00:00.000' AS DateTime), NULL, 0, NULL, NULL, NULL, NULL)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (1, N'Create test data', 1, NULL, 1)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (2, N'Create api''s for saving/updating data', 0, NULL, 1)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (3, N'Enhance UI', 1, NULL, 1)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (4, N'An introduction ot Architecture', 1, NULL, 2)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (5, N'Unit Testing', 1, NULL, 2)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (6, N'Grab lunch', 0, NULL, 3)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (7, N'Tidy up desk', 0, 1, 3)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (8, N'Message Jon on concerns', 0, NULL, 3)
INSERT [dbo].[Task] ([Id], [description], [isDone], [isCancelled], [stickyNoteId]) VALUES (9, N'Checkout Plural sight trainings', 0, NULL, 3)
