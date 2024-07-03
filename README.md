**D-ID Agents SDK - vite project in Vanilla JavaScript**

In the Terminal, navigate to this project folder and then type the following:

- `npm init`

- `npm i vite`

- `npm i @d-id/client-sdk`

- `npm i`

In the created `package.json` file -  add the following to the `scripts` object:

- `"dev": "vite --port 3000"`

<br>

1. Log in to the [D-ID Studio](http://studio.d-id.com)  
2. In the Agents screen, hover with your mouse on the created Agent, then click on the `[...]` button
3. Click on `</> Embed` button
4. Set the list of allowed domains for your Agent, for example: `http://localhost`  
5. In the code snippet section, copy the `data-client-key` and the `data-agent-id` and paste it in the 
6. Paste the `data-client-key` and the `data-agent-id` in their variables at the top of the `main.js` file and save.

In the terminal - run `npm run dev`

Open [http://localhost:3000/](http://localhost:3000/)
