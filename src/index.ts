if(process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

import NotesApp from "./notes_app";

const app = new NotesApp();
app.start();