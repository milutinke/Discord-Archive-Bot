
# Discord-Archive-Bot

Archiving bot for Discord which archives or replicates the server in real time.

**NOTE: Not finished, work in progress!**

Progress:
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZsAAAAUCAYAAABbCZBBAAABqklEQVR4Xu3csUrDUBQG4HQQ6nbBsT6Fq2/R3aFDfQLBUcQn0NX36XsUdHGKnSwIkYBuIqelaXLi1/nk3pPvBH5Ck0wqPwIECBAg0LHApOP1LU+AAAECBCph4yIgQIAAgc4FhE3nxDYgQIAAgZ+wWZZS7uq6niEhQIAAAQJ/CZRSXuu6vq+q6jkq1YbN8vby7PHh4vP0ZPsePU4dAQIEQgLbp49QnaI8AqvVqlosFpv1en0TDZxJKeXl7aqZCZo8g9YpgUwCwibTtOK9toEzn8/bO5zzyFHtnU3TXEdK1RAgQGB3AWGzu1mWI6bTadtq6L9/YZNlqvokkFRA2CQdXKBtYRNAUkKAwHEEhM1xnPvYRdj0oW5PAgR+FRA2470whM14Z+vMCKQTEDbpRhZuWNiEqRQSINC1gLDpWri/9XcKG48+9zcoOxP4DwLCZpxT3ufRZy91jvNacFYEBiEgbAYxhoM2sddLnd8d+FzNQUdhMQIECIxXYN/P1YxXxJkRIECAwCAEQm9+DqJTTRAgQIBAWgFhk3Z0GidAgEAeAWGTZ1Y6JUCAQFqBLxGJbhUTuD6SAAAAAElFTkSuQmCC" /> **70%**

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
- Rollback a particular channel or the whole server (**!arollback <channel?>**) (This command will disable talking in the chat until the process is done, if the archive is really big it will take days to rollback, since the bot message limit is 5 messages every X seconds, I suggest using the server live time replication option)
- Command which displays the list of archived channels
- Server replication in real time (As a separate bot which could receive data from this one (**NOTE: it is not finished yet**))

### Under the active work: 
  - Export command

### TODO (Unimplemented):

- Commands:
  - Archive a particular channel or the whole server (manually) (Used for data that has been sent before the bot was added, it could take hours or up to a day to archive the server if it has really big message history)
  - Export archive
- Archive export: JSON, PDF, Plain Text, CSV, DOCX
- Roles archiving
- Web Interface (Might not be implemented)

## Setup

**TODO**

## Contibuting

Contact me: **milutinke@gmx.com**
