import { Footer, Navbar } from "./components";
import { useState } from "react";
import { RiFileCopyLine, RiForbid2Fill } from "react-icons/ri";

const convertToSteamID = (steamID64) => {
  const steam64BigInt = BigInt(steamID64);
  const Y = steam64BigInt % 2n;
  const Z = (steam64BigInt - 76561197960265728n - Y) / 2n;
  return `STEAM_0:${Y}:${Z}`;
};

const extractSteamID64 = (url, STEAM_API_KEY) => {
  const parts = url.split("/");
  const index = parts.findIndex((part) => part === "profiles" || part === "id");
  if (index >= 0) {
    if (parts[index] === "profiles" && parts[index + 1]) {
      return parts[index + 1];
    } else if (parts[index] === "id" && parts[index + 1]) {
      // Fetch steamID64 from profile URL
      const vanityName = parts[index + 1];
      const apiUrl = `https://cors-anywhere.herokuapp.com/http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${vanityName}`;
      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.response.success === 1) {
            return data.response.steamid;
          }
          throw new Error("Invalid profile URL");
        });
    }
  }
  throw new Error("Invalid URL");
};

const App = () => {
  const [steamIds, setSteamIds] = useState([]);
  const [profileUrlsInput, setProfileUrlsInput] = useState("");
  const STEAM_API_KEY = import.meta.env.VITE_STEAM_API_KEY;

  const handleInputChange = (event) => {
    setProfileUrlsInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const profileUrls = profileUrlsInput.split("\n");
    const steamIdPromises = profileUrls.map(async (url) => {
      try {
        return await extractSteamID64(url, STEAM_API_KEY);
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const steamIdArray = await Promise.all(steamIdPromises);
    const validSteamIds = steamIdArray.filter((steamId) => steamId !== null);

    const newSteamIds = validSteamIds.slice(0, 100); // Limit to 100 IDs
    setSteamIds((prevIds) => [
      ...prevIds,
      ...newSteamIds.map((steamId) => convertToSteamID(steamId)),
    ]);

    if (validSteamIds.length > 100) {
      const remainingSteamIds = validSteamIds.slice(100);
      const remainingProfileUrls = profileUrls.slice(100); // Preserve remaining IDs
      setProfileUrlsInput(remainingProfileUrls.join("\n"));
    } else {
      setProfileUrlsInput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(steamIds.join("\n"));
  };

  const handleCopyForBan = () => {
    const idsForBan = steamIds.map((id) => `banid 0 ${id}`);
    navigator.clipboard.writeText(idsForBan.join("\n"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex-grow">
        <form
          onSubmit={handleSubmit}
          className="max-w-screen md:max-w-lg mx-auto my-8"
        >
          {profileUrlsInput.split("\n").length > 100 && (
            <div className="bg-red-900 p-2 mt-4 text-center">
              You have entered more than 100 IDs. Only the first 100 IDs will be
              processed to prevent SteamAPI rate limits. Once the first 100 IDs
              are processed, they will be removed from the input field for your
              convenience and you can process more IDs.
            </div>
          )}
          <div className="bg-blue-900 p-2 my-1 text-center">
            Converted IDs are aggregated. Copy once when you finished converting all IDs.
          </div>
          <textarea
            className="min-h-[20vh] mx-auto bg-black text-white outline-white outline-2 border-2 border-white w-full max-w-screen-2xl"
            value={profileUrlsInput}
            onChange={handleInputChange}
            placeholder="Enter profile URLs, one per line..."
          />

          <div className="mx-auto w-max">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 active:bg-green-900 px-6"
            >
              Get Steam IDs
            </button>
          </div>
          {profileUrlsInput.split("\n").length > 2 && (
            <div className="bg-blue-900 p-2 my-1 text-center">
              SteamIDs left to process: {profileUrlsInput.split("\n").length}
            </div>
          )}
        </form>
        {steamIds.length > 0 && (
          <div className="bg-slate-700 w-full mx-auto my-8 py-1 pb-8">
            <div className="max-w-[256px] ml-auto my-4">
              <div className="flex place-content-around">
                <button
                  onClick={handleCopy}
                  className="text-white flex p-2 rounded bg-[#00000032] hover:bg-[#00000064] active:bg-[#000000AA]"
                >
                  <RiFileCopyLine size={20} /> Copy
                </button>
                <button
                  onClick={handleCopyForBan}
                  className="text-white flex p-2 rounded bg-[#00000032] hover:bg-[#00000064] active:bg-[#000000AA]"
                >
                  <RiForbid2Fill size={20} /> Copy for Ban
                </button>
              </div>
            </div>
            {steamIds.map((id, index) => (
              <p className="text-center" key={index}>
                {id}
              </p>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
