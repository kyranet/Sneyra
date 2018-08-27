
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/cdfdf0081ea4438e86ea6971a021d6b0)](https://www.codacy.com/app/kyranet/Sneyra?utm_source=github.com&utm_medium=referral&utm_content=kyranet/Sneyra&utm_campaign=badger)

# Sneyra

Sneyra is a music bot (yeah, another bot in this world) built on top of [Klasa](https://github.com/dirigeants/klasa/), and uses [Discord.js](https://github.com/hydrabolt/discord.js) to connect to the Discord API.

## Features

- All basic music bot commands, included skip prompting (based on the 40% of users connected to the voice channel, after 4 users).
- An echo command, because, why not?
- Clean code, easy to modify. Fully modular and classbased.
- Full Music Handler interface and caching, make sure she replies 'smartly'!

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.1.0 or higher](https://nodejs.org)
- `ffmpeg`: `npm install --global ffmpeg-binaries`
- `node-opus`: `npm install node-opus` (alternatively you can use opusscript, but it's very bad for production, has memoryleaks and stream/quality issues).
- A **good** network connection.

## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

```
git clone https://github.com/kyranet/Sneyra
```

Once finished:

- In the folder from where you ran the git command, run `cd Sneyra` and then run `npm install`
- Rename `config.json.example` to `config.json`
- Edit `config.json` and enter your bot token and the YouTube Search API token.
- **NEVER UPLOAD THIS FILE WITH YOUR TOKENS ANYWHERE, TO DO SO, YOU ARE LETTING OTHER PEOPLE USE THE TOKEN TO DESTROY ALL THE GUILDS YOUR BOT IS IN. IF YOU DID, RESET YOUR TOKEN IN DISCORD'S APPLICATION PAGE**.
