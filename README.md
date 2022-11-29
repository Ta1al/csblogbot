# CSBlogBot
A bot that posts the latest CS blog posts to a Discord channel

*This bot is currently in development and is not ready for use.*

## Commands
##### `/blog [page]` - Returns blog posts
[TODO: Add GIF]

##### `/updates [page]` - Returns update posts
[TODO: Add GIF]


## For Self-Hosting

1. ##### Clone the repository
   ```sh
    git clone https://github.com/Ta1al/csblogbot
    cd csblogbot
    ```
2. ##### Install dependencies
   ```sh
   npm install
   ```

3. ##### Rename `.env.example` to `.env` and fill in the values
   | Variable | Description | Required |
    | -------- | ----------- | -------- |
    | `TOKEN` | Bot Token | Yes |
    | `CLIENT_ID` | Bot ID | Yes |
    | `GUILD_ID` | Guild for registering commands | No |

4. ##### Run the bot
   ```sh
   npm start
   ```