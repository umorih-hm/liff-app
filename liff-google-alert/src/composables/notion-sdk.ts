require("dotenv").config();
const { Client } = require("@notionhq/client");

export const useNotion = () => {
  // Initializing a client
  const notion = new Client({
      auth: process.env.NOTION_TOKEN,
  });
  console.log(process.env.NOTION_TOKEN)

  return notion
}
