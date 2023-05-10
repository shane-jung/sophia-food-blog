import initializeServer from './initializeServer'
import router from './router'
import insertFakeRecipes from './utils/faker';


const app = initializeServer(router);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`)) // eslint-disable-line

// insertFakeRecipes(5);