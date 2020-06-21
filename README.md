# Discord-Archive-Bot

Simple Archiving bot for Discord which archives the server in real time.

**NOTE: Not finished, work in progress!**

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

### TODO (Unimplemented):

- Commands:
  - Server wipe - Deletes all the channels and roles (If you want to start with a clean server)
  - Rollback a particular channel or the whole server (manually)
  - Archive a particular channel or the whole server (manually) (Used for data that has been sent before the bot was added)
  - Export archive
- Archive export: JSON, PDF, Plain Text, CSV, DOCX
- Roles archiving
- Web Interface (Might not be implemented)

## Contibuting

Contact me: **milutinke@gmx.com**
