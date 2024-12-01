/* 
3vil backend
    by justDarian
*/

const algorithms = require('./methods.js');

const path = require("path")
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
const rateLimit = require("express-rate-limit")
const app = express();

app.use(rateLimit({
    windowMs: 5 * 1000, // every 10 sec
    limit: 3, // you can send this amt of req every windowMs
    message: {
        message: 'ratelimit'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => ["/admin", "/login", "/auth", ".png", ".js"].some((url) => req.originalUrl.includes(url)),
}))

app.use(bodyParser.json());
app.use(require("cors")());
app.use(express.static('public'));

// log reqs
app.use((req, res, next) => {
    const ip = req.headers["cf-connecting-ip"] || req.socket.remoteAddress;
    console.log(`[${ip}:${req.method}] - ${req.protocol}://${req.hostname}${req.originalUrl}`);
    next();
});

const PORT = 3000;
const dbPath = path.join(__dirname, 'users.json');
let users = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const adminKeys = [
    "3vilsohotttmahtabissexy!!69"
];

// yes :3 (kms)
function setDb(wtf) {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

function checkSub(userId) {
    const user = users[userId];
    if (!user || !user.expirationDate) return false;

    const now = new Date();
    const expirationDate = new Date(user.expirationDate);
    return now <= expirationDate;
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/admin-login.html');
});


// START AUTHENICATION \\

app.get("/admin", (req, res) => {
    res.sendFile(join(__dirname, "frontend", "admin-login.html"));
});

app.post("/login", (req, res) => {
    const {
        key
    } = req.body;
    if (adminKeys.includes(key)) {
        res.sendFile(__dirname + '/public/admin-panel.html');
    } else {
        res.status(401).send("Unauthorized");
    }
});

app.get("/admin/users", (req, res) => {
    const key = req.headers.auth;
    if (!adminKeys.includes(key)) return res.status(401).send("unauth");

    const userList = Object.keys(users).map((discordid) => ({
        discordid,
        ...((({
            token,
            ...rest
        }) => rest)(users[discordid]))
    }));

    res.json(userList);
});

app.post("/admin/addUser", async (req, res) => {
    const {
        discordid,
        licenseType
    } = req.body;
    const authKey = req.headers["auth"];

    if (!adminKeys.includes(authKey)) {
        return res.status(401).send("unauthorized");
    }

    if (discordid && licenseType) {
        let expirationDate;
        switch (licenseType) {
            case "trial":
                expirationDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();
                break;
            case "hour":
                expirationDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
                break;
            case "day":
                expirationDate = new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                ).toISOString();
                break;
            case "week":
                expirationDate = new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString();
                break;
            case "month":
                expirationDate = new Date(
                    new Date().setMonth(new Date().getMonth() + 1)
                ).toISOString();
                break;
            case "lifetime":
                expirationDate = new Date("2069-06-10").toISOString();
                break;
            default:
                return res.status(400).json({
                    message: "invalid license type"
                });
        }

        try {
            const response = await axios.get(
                `https://discordlookup.mesalytic.moe/v1/user/${discordid}`
            );
            if (response.data.message) {
                return res.status(400).json({
                    message: response.data.message
                });
            }
            const {
                username: discordUsername,
                avatar
            } = response.data;

            users[discordid] = {
                discordUsername,
                avatarUrl: avatar ? avatar.link : null,
                token: "",
                firstTime: true,
                expirationDate,
                licenseType,
            };
            // move to top (pls work)
            const user = users[discordid];
            delete users[discordid];
            users = {
                [discordid]: user,
                ...users
            };

            setDb();
            res.status(200).json({
                message: "added",
                discordid
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({
                message: "error"
            });
        }
    } else {
        res.status(400).json({
            message: "Missing discordid or licenseType"
        });
    }
});

app.post("/admin/removeUser", (req, res) => {
    const key = req.headers.auth;
    if (!adminKeys.includes(key)) {
        return res.status(401).send("Unauthorized");
    }

    const {
        discordid
    } = req.body;
    if (!users[discordid]) {
        return res.status(404).json({
            message: "user not found"
        });
    }

    delete users[discordid];
    setDb();
    res.status(200).json({
        message: "removed successfully"
    });
});

app.post("/admin/relink", (req, res) => {
    const {
        discordid
    } = req.body;
    const authKey = req.headers["auth"];

    if (!adminKeys.includes(authKey)) {
        return res.status(401).send("unauthorized");
    }

    if (!discordid || !users[discordid]) {
        return res.status(404).json({
            message: "user not found"
        });
    }

    users[discordid].token = "";
    users[discordid].firstTime = true;
    setDb();
    res.status(200).json({
        message: "relinked successfully"
    });
});

app.post("/auth", (req, res) => {
    const {
        discordid
    } = req.body;
    const token = req.headers["auth"];

    if (!discordid || !users[discordid]) {
        return res
            .status(401)
            .json({
                success: false,
                message: `user doesn't exist`
            });
    }

    if (!checkSub(discordid)) {
        return res
            .status(401)
            .json({
                success: false,
                message: "subscription expired"
            });
    }

    const user = users[discordid];

    // first time login
    if (user.token === "" && user.firstTime && token !== "null") {
        user.token = token;
        user.firstTime = false;
        setDb();
    }
    // token mismatch
    else if (user.token !== token) {
        return res.status(401).json({
            success: false,
            message: "token mismatch, please make a ticket to relink",
        });
    }

    res.status(200).json({
        success: true,
        discordid,
        discordUsername: user.discordUsername,
        avatarUrl: user.avatarUrl,
        expirationDate: user.expirationDate,
        licenseType: user.licenseType,
    });
});


// END AUTHENICATION \\


app.post("/predict/:type", async (req, res) => {
    const {
        type
    } = req.params;
    const {
        discordid,
        method,
        ...params
    } = req.body;
    const token = req.headers.auth;
    const user = users[discordid];

    if (!user || typeof user !== 'object') return res.sendStatus(401);
    if (!user || user.token !== token) return res.sendStatus(401);
    if (!checkSub(discordid)) return res.status(401).json({
        success: false,
        message: "expired"
    });
    if (!algorithms[type]?.[method]) return res.sendStatus(404);

    try {
        const prediction = await algorithms[type][method](token, params);
        console.log(`predicted ${type} for ${user.discordUsername}`);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/getMethods", (req, res) => {
    const methods = {};

    for (const category in algorithms) {
        if (Object.prototype.hasOwnProperty.call(algorithms, category)) {
            methods[category] = Object.keys(algorithms[category]);
        }
    }

    res.json(methods);
});

// start
app.listen(PORT, () => {
    console.log(PORT);
});