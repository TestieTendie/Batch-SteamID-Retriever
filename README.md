# Batch SteamID Retriever

A web application for retrieving SteamIDs in batch by inputting Steam profile URLs (/profiles/permalink) or Steam id URLs (/id/username). The project aims to simplify the process of converting Steam profile URLs or SteamID64s (which is what profile links use) to the SteamID format (STEAM_X:Y:Z). It provides a user-friendly interface where users can enter multiple profile URLs or IDs and obtain the corresponding SteamIDs for further use.

## Functionality

- Enter profile or id URLs in the provided text area, with each profile or id URL on a separate line.
- Fetch SteamIDs: Upon submitting the form, the application retrieves the SteamIDs for the entered URLs or IDs using the Steam API.
- Copy/Ban SteamIDs: Users can copy the retrieved SteamIDs to the clipboard with a single click. The application provides separate buttons to copy the SteamIDs only, as well as the SteamIDs formatted for the ```banned_user.cfg``` file.
- Limitations: To prevent rate limits on the Steam API, only the first 100 SteamIDs are processed. If more than 100 URLs or IDs are entered, a warning message is displayed and once the first 100 are processed, they are removed from the input field. The remaining SteamIDs are preserved in the input field for further processing.
- Self-hosting: Due to security concerns related to the hardcoded API key and the use of a CORS proxy, it is recommended to host the application locally or on a trusted server. This app uses a CORS proxy hosted on Heroku. [Request access to the demo CORS proxy here or it won't work.](https://cors-anywhere.herokuapp.com/).

## Usage

1. Clone the repository: ```git clone https://github.com/yourusername/batch-steamid-retriever.git```
2. Install dependencies: ```npm install```
3. Create a ./.env file and place your [Steam API Key](https://steamcommunity.com/dev/apikey) in it as follows: ```VITE_STEAM_API_KEY=123456789```
4. Start the application: ```npm run dev```
5. Access the application in your browser: ```http://localhost:5173```
6. Enter the Steam profile URLs or SteamID64s in the provided text area.
7. Click "Get Steam IDs" to retrieve the corresponding SteamIDs.
8. Use the "Copy" and "Copy for Ban" buttons to copy the SteamIDs as needed.

**Note:** You NEED to request access to [CORS Anywhere](https://cors-anywhere.herokuapp.com/). This allows the application to fetch data from the Steam API successfully. Failure to do so will impede the application from funtioning at all.

# Extras/FAQ

## Is there an online version?

No. I don't consider the effort required to setup a backend to handle CORS requests worthy. So I have no plans for an online demo or Vercel deployment.

## How can I fetch Blocked Users' links?

Use Linkgopher

To fetch a list of blocked users from your Steam profile, follow these steps:

1. Install the [Linkgopher](https://addons.mozilla.org/en-US/firefox/addon/link-gopher/) extension for Firefox. Also available from Chrome.
2. Open your Steam profile in the Friends section in your browser.
3. Navigate to the "Blocked Users" section.
4. Click on the Linkgopher icon in the toolbar.
5. Select "Extract all links" from the available options.
6. Remove links that point to your profile or other sections of Steam. The links we are interested in start in:```steamcommunity.com/id/...``` OR ```steamcommunity.com/profiles/...```
7. Copy the extracted URLs and paste them into the "Batch SteamID Retriever" application to retrieve their SteamIDs.

Enjoy using the Batch SteamID Retriever to simplify the process of retrieving SteamIDs in bulk!