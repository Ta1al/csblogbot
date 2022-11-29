# CSBlogBot
A bot that posts the latest CS blog posts to a Discord channel

*This bot is currently in development and is not ready for use.*

## Commands
##### `/blog [page]` - Returns blog posts
<details>
   <summary>See Usage</summary>
   <img src="https://user-images.githubusercontent.com/43641182/204455735-1ca3ab61-179d-428e-b579-aef62f46f560.gif" height="500"/>
</details>

##### `/updates [page]` - Returns update posts
<details>
   <summary>See Usage</summary>
   
   <img src="https://user-images.githubusercontent.com/43641182/204456699-8be95638-7bbe-4ba6-9e7b-310d48b107ef.gif" height="500"/>
</details>

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
   | Variable    | Description                    | Required |
   | ----------- | ------------------------------ | -------- |
   | `TOKEN`     | Bot Token                      | Yes      |
   | `CLIENT_ID` | Bot ID                         | Yes      |
   | `GUILD_ID`  | Guild for registering commands | No       |

4. ##### Run the bot
   ```sh
   npm start
   ```
