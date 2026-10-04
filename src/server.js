require("dotenv").config();

const app = require("./app");
const db = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {

    try {

        const connection =
            await db.getConnection();

        console.log(
            "MySQL connected successfully!"
        );

        connection.release();

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running at http://localhost:${PORT}`
                );
            }
        );

    } catch (error) {

        console.error(
            "Unable to connect to MySQL:"
        );

        console.error(error);

        process.exit(1);
    }
}

startServer();