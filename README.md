# Discord-Archive-Bot

Archiving bot for Discord which archives or replicates the server in real time.

**NOTE: Not finished, work in progress!**

Progress:
![][progress_image] **80%**

## Features

### Implemented:

- Message archiving
- Attachments archiving
- Member list archiving (Join date, last name, name change histrory, number of reentries to the server)
- Statistics command (**!astats**)
- Updates the messages if they are edited or the channel name is changed
- Detects message Pin/Unpin and updated the archive
- Configuration command (**!aconfig <key> <value>**)
  - Enables channel blacklisting
  - Enables/Disabled **!astats** command
  - Enables/Disabled archiving
  - Enables/Disabled message updating
- Command for pruning the archive
- Server wipe command (**!awipe**) - Deletes all the channels and roles (If you want to start with a clean server)
- Rollback a particular channel or the whole server (**!arollback <channel?>**) (This command will disable talking in the chat until the process is done, if the archive is really big it will take days to rollback, since the bot message limit is 5 messages every X seconds (it sends about 25 messages per minute), I suggest using the server live time replication option)
- Command which displays the list of archived channels
- Server replication in real time (As a separate bot which could receive data from this one (**NOTE: The separate bot has not been finished!**))
- Archive a particular channel or the whole server (manually) (Used for data that has been sent before the bot was added, it could take hours or up to a day to archive the server if it has really big message history) (**!aarchive <channel?>**)

### Under the active work:

- Export command

### TODO (Unimplemented):

- Commands:
  - Export archive
- Archive export: JSON, PDF, Plain Text, CSV, DOCX
- Roles archiving
- Web Interface

## Setup

**TODO**

## Contibuting

Contact me: **milutinke@gmx.com**

[progress_image]:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZsAAAAUCAYAAABbCZBBAAABj0lEQVR4Xu3cMUrEQBQG4KQQYjdguZ7C1lukt0ixnkCwFPEE2nqf3COgjdVo5YIQGVCwknEky5L5tkkzL8l8eeEnbCZt40eAAAECBBYWaBfev90TIECAAIFG2GgCAgQIEFhcQNgsTuwABAgQIPAdNtsQwk2McYOEAAECBAj8JhBCeI4x3jZN85grlcJme31+cn939nF8tHvNrTOOAAEC1QvsHt6rNBjHsRmG4W2apqvcwGlDCE8vF/NG0FTZMyZNgMA/BGoNm0SWAqfv+/SEc5pDmJ5s5vkyZ6gxBAgQIPBToOawSQ5d16VN1n//wsa9Q4AAgUIBYSNsCltHGQECBPIFhI2wye8WIwkQIFAoIGyETWHrKCNAgEC+gLARNvndYiQBAgQKBYTNH8LGq8+FXaaMAIHqBWoOm5JXny3qrP6WAUCAQIlArWFTtKjzC9jnako6TQ0BAgQqFCj9XE2FVKZMgAABAvsUyFr5uc8TciwCBAgQWJ+AsFnfNTUjAgQIHJyAsDm4S+KECBAgsD6BT3p3bhUjOAPcAAAAAElFTkSuQmCC