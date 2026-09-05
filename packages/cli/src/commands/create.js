import fs from "node:fs";
import path from "node:path";
import url from "node:url";

/**
 * Create a NW.js application using a predefined template.
 * @param {string} name - The name of the application to create.
 * @param {string} template - The template to use.
 * @param {string} outDir - The output directory.
 */
export function create(name, template, outDir) {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const templatePath = path.resolve(__dirname, "../templates", template);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template "${template}" not found.`);
    }

    const outDirPath = path.resolve(outDir, name);
    if (fs.existsSync(outDirPath)) {
        throw new Error(`Directory "${outDirPath}" already exists.`);
    }

    fs.cpSync(templatePath, outDirPath, {
        recursive: true,
        errorOnExist: true
    });

    const packageJsonPath = path.join(outDirPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    packageJson.name = name;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");

    const indexHtmlPath = path.join(outDirPath, "index.html");
    const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
    const updated = indexHtml
        .replace(/{{APP_NAME}}/g, name)
        .replace(/\bAPP_NAME\b/g, name);
    fs.writeFileSync(indexHtmlPath, updated, "utf-8");

    console.log(`Created NW.js application "${name}" using template "${template}" at ${outDirPath}.`);
}
