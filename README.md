# Discord-Archive-Bot

Simple **Archiving** bot for Discord which archives or replicates the server in real time.

**NOTE: Not finished, work in progress!**

Progress: **50%**

## Features

### Implemented:

- Message archiving (Does not include embeded messages for now)
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

- Categories archiving and distinguishing between channels with the same name but different categories
  - If there are multiple channels with the same name, bot should ask the user which one he/she wants to archive or restore
  
- Channel properties archiving:
  - Channel NSFW
  - Channel topic
  - Channel category
  - Channel position
  - Channel type
  - Channel ratelimit per user
  - Channel bitrate
  - Channel user limit
  
- Commands:
  - Export archive
  - Archive export: JSON, PDF, Plain Text, CSV, DOCX, HTML
  
- Roles archiving (High priority)
- Web Interface (Low priority)
- Restoring messages as an images (If they do not include an attachment) (Low priority)
- Archiving and restoration of embedded messages (Low priority)
- Replication Bot (High priority)
- Update bot messages to Embedded messages

## Setup

**TODO**

## Contibuting

Contact me: **milutinke@gmx.com**
