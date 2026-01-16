import path from "node:path";

export const hbsOptions = {
    viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(process.cwd(), "src", "templates", "layouts"),
        partialsDir: path.join(process.cwd(), "src", "templates", "partials"),
    },
    viewPath: path.join(process.cwd(), "src", "templates", "views"),
    extName: ".hbs",
};
