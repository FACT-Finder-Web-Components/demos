const connect = require(`connect`);
const serveStatic = require(`serve-static`);
const port = require(`./port`);

const directory = `./`;

connect().use(serveStatic(directory)).listen(port, () => {
    console.log(`Server running on port ${port}...`);
});

const [dir, file] = process.argv.slice(2);

if (dir) {
    require(`open`)(`http://localhost:${port}/${dir}/${file || "index.html"}`);
}
