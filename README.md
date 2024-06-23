**D-ID Agents SDK - vite project in Vanilla JavaScript**

In the Terminal:

`npm create vite@latest`
Select : JavaScript, Vanilla

Go to the created Vite Folder

`npm i @d-id/client-sdk`
`npm i`

Replace the default files created by vite with the files from this repo.

Paste your Agent ID and Client Key in the `main.js` file and save.

Run: `npm run dev`
Open Localhost at the port created.

To change the port:
In the `package.json` add the following to the `scripts` object:
`"dev": "vite --port 3000"`
