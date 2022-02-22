import BizService from "../index";
import { EditForm } from "../modules";

const bizService = new BizService();
bizService.register(EditForm);
bizService.init();
