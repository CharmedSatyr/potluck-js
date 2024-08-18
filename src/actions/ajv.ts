import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv, ["date", "email", "iso-time", "uuid"]);

export default ajv;
