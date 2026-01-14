import router from "express";
import homeController from "../controllers/home";
import requiredToken from "../middlewares/requiredToken";

const rootRouter = router();

rootRouter.get("/", requiredToken, homeController.handleRoot);

export default rootRouter;
