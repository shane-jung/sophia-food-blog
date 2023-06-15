import initializeServer from "./initializeServer";
import router from "./router";

const app = initializeServer(router);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`)); // eslint-disable-line
