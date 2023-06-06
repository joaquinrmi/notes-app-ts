import { initializeBook } from "./book";
import { initializeNote } from "./note/note";
import { initializeUser } from "./user";

/**
 * Initializes each sequelize model.
 */
async function initializeModel(): Promise<void>
{
    /* The order is important. */
    await initializeUser();
    await initializeBook();
    await initializeNote();
}

export default initializeModel;