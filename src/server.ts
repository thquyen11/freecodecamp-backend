import * as express from "express";
import { Request, Response } from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as knex from "knex";
import * as multer from "multer";
import * as winston from "winston";
import * as register from "./controllers/register";
import * as signin from "./controllers/signin";
import * as profile from "./controllers/profile";
import * as auth from "./controllers/authorization";
import * as passport from "passport";
require("dotenv").config();
const socket = require("socket.io");

const app = express();

app.use(
  helmet({
    frameguard: {
      action: "sameorigin"
    },
    dnsPrefetchControl: {
      allow: true
    }
  })
);

// const whitelist:string[] = [
//     'localhost',
// ];
// const corsOptions = {
//     origin: (origin, callback)=>{
//         if(whitelist.indexOf(origin)!==-1){
//             callback(null, true);
//         } else{
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// }
// app.use(cors(corsOptions));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.text());

// add winston to write log
export const logger: any = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: `/logs/combined.log`,
      level: "info"
    })
  ],
  exitOnError: true,
  silent: false
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

const dbTemp: any = {
  shortenURL: []
};

const db: any = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_USERPASS
  },
  debug: true
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("fuck you nodemon");
});

// File Metadata Microservice project
const storage: any = multer.diskStorage({ destination: "./tmp/upload" });
const upload: any = multer({ storage }); //By default multer save file on memory if 'storage' is not defined

// upload.single('file') has to be the same name with the object name (key in form-data) which sent from client
app.post(
  "/api/fileanalyse",
  upload.single("file"),
  (req: Request, res: Response) => {
    const file: any = req.file;
    const meta: any = req.body;

    logger.info(meta);
    res.status(200).json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    });
  }
);

//FCC TIMESTMAP project
app.get("/api/timestamp/:date_string", (req: Request, res: Response) => {
  const { date_string } = req.params;

  if (date_string) {
    const date: Date = new Date(date_string);
    const error: any = {
      error: "Invalid Date"
    };
    if (date) {
      const payload: any = {
        unix: date.getTime(),
        utc: date.toUTCString()
      };
      res.status(200).json(payload);
    } else {
      res.status(200).json(error);
    }
  } else {
    const date: Date = new Date();
    const payload: any = {
      unix: date.getTime(),
      utc: date.toUTCString()
    };

    res.status(200).json(payload);
  }
});

//FCC HEADER PARSER project
app.get("/api/whoami", (req: Request, res: Response) => {
  const payload: any = {
    ipaddress: req.ip,
    language: req.acceptsLanguages,
    software: req.get("User-Agent")
  };
  res.status(200).json(payload);
});

//FCC Shorten URL project
app.post("/api/shorturl/new", (req: Request, res: Response) => {
  const url: string = req.body.replace(/\r\n|\r|\n/gm, "");
  const regex: any = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  if (url.match(regex)) {
    dbTemp.shortenURL.push(url);
    res.status(200).json({
      original_url: url,
      short_url: dbTemp.shortenURL.length - 1
    });
  } else {
    res.status(400).json(() => {
      return {
        error: "invalid URL"
      };
    });
  }
});

app.get("/api/shorturl/:shortURL", (req: Request, res: Response) => {
  const { shortURL } = req.params;
  const shortUrl: number = parseInt(shortURL, 10);

  if (shortUrl > dbTemp.shortenURL.length - 1) {
    res.status(400).json(() => {
      return {
        error: "invalid URL"
      };
    });
  } else {
    const originalUrl: string = dbTemp.shortenURL[shortUrl];
    res.redirect(originalUrl);
  }
});

// TEST DB Connection
app.get("/api/testDB", (req: Request, res: Response) => {
  db.select("*")
    .from("USERS")
    .where({ USER_NAME: "test" })
    .then((data: any) => res.send(data));
});

// FCC TRACKER project
app.post("/api/exercise/new-user", (req: Request, res: Response) => {
  register.registerNewUser(req, res, db);
});

app.post("/api/exercise/add", (req: Request, res: Response) => {
  register.addNewExercise(req, res, db);
});

app.post("/api/exercise/signin", (req: Request, res: Response) => {
  signin.handleSigninAuthentication(req, res, db);
});

app.get("/api/exercise/log", (req: Request, res: Response) => {
  profile.getUserExerciseLog(req, res, db);
});

//Udemy: Authentication
app.get(
  "/api/fcc-projects/profile/:id",
  auth.requireAuth,
  (req: Request, res: Response) => {
    console.log("start profile controller");
    const { id } = req.params;
    console.log("id " + id);
    profile.handleProfileGet(req, res, db, id);
  }
);

// test JEST
import * as fetch from "node-fetch";
export const getPeople = async (fetch: any) => {
  const getRequest: any = await fetch("https://swapi.co/api/people");
  const data: any = await getRequest.json();
  return {
    count: data.count,
    results: data.results
  };
};
logger.info(getPeople(fetch));

// Freecodecamp section "Information Security And Quality Assurance"
const dbUser = {
  User: [
    {
      id: "2463619257041574",
      name: "thquyen11",
      email: "thquyen11@hotmail.com"
    }
  ]
};

const handleSignin = (profile: any, dbUser: any) => {
  const name = profile.displayName;
  const id = profile.id;

  if (id === dbUser.User[0].id) {
    return Promise.resolve({ id: dbUser.User[0].id, name: name });
  } else {
    return Promise.reject({});
  }
};

const FacebookStrategy = require("passport-facebook").Strategy;
app.use(passport.initialize());
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("accessToken ", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
      handleSignin(profile, dbUser)
        .then((user: any) => {
          return done(null, user);
        })
        .catch((err: any) => done(err));
    }
  )
);
passport.serializeUser(function(user, done) {
  console.log("user ", user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("user ", user);
  done(null, user);
});

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get("/auth/facebook", passport.authenticate("facebook"));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/sucess",
    failureRedirect: "/login"
  })
);

// app.get('/', (req: Request, res: Response) => {
//     res.render('pugs/index.pug');
// })

app.get("/sucess", (req: Request, res: Response) => {
  res.render("pugs/success.pug");
});

// Chat app using socket.io
app.use("/public", express.static("public"));

//Server port
const server = app.listen(process.env.PORT, () => {
  logger.info("Server running on port " + process.env.PORT);
});

// Socket setup
const io = socket(server);
io.on("connection", (socket: any) => {
  console.log("made socket connection: ", socket.id);

  socket.on("chat", (data: any) => {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", (data: any) => {
    socket.broadcast.emit("typing", data);
  });
});

// FCC project: Anonymous Message Board
const messageBoard = [
  {
    id: "0",
    createdOn: new Date(),
    bumpedOn: new Date(),
    reported: false,
    threads: [
      {
        id: "0",
        createdOn: new Date(),
        bumpedOn: new Date(),
        reported: false,
        text: "hello world",
        reply: [
          {
            id: "0",
            createdOn: new Date(),
            bumpedOn: new Date(),
            reported: false,
            text: "reply to hello world"
          }
        ]
      }
    ]
  }
];

// post new thread to a board
app.post("/api/threads/:boardId", (req: Request, res: Response) => {
  const boardId: string = req.params.boardId;
  const { threadText } = req.body;

  messageBoard[parseInt(boardId, 10)].threads.push({
    id: messageBoard[parseInt(boardId, 10)].threads.length.toString(),
    createdOn: new Date(),
    bumpedOn: new Date(),
    reported: false,
    text: threadText,
    reply: []
  });
  return res.redirect(`/b/${boardId}`);
});

// post reply to a thread
app.post("/api/replies/:boardId", (req: Request, res: Response) => {
  const boardId: string = req.params.boardId;
  const { threadId, replyText } = req.body;

  messageBoard[parseInt(boardId, 10)].threads[
    parseInt(threadId, 10)
  ].reply.push({
    id: messageBoard[parseInt(boardId, 10)].threads[
      parseInt(threadId, 10)
    ].reply.length.toString(),
    createdOn: new Date(),
    bumpedOn: new Date(),
    reported: false,
    text: replyText
  });
  return res.redirect(`/b/${boardId}/${threadId}`);
});

// delete thread in a board
app.delete("/api/threads/:boardId", (req: Request, res: Response) => {
  try {
    const boardId: string = req.params.boardId;
    const { threadId } = req.body;

    messageBoard[parseInt(boardId, 10)].threads.splice(threadId, 1);
    return res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
});

// delete reply in a thread
app.delete("/api/replies/:boardId", (req: Request, res: Response) => {
  try {
    const boardId: string = req.params.boardId;
    const { threadId, replyId } = req.body;

    messageBoard[parseInt(boardId, 10)].threads[
      parseInt(threadId, 10)
    ].reply.splice(replyId, 1);
    return res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
});

// get all info of a threads
app.get("/api/replies/:boardId", (req: Request, res: Response) => {
  try {
    const boardId: string = req.params.boardId;
    const { threadId } = req.query;

    return res
      .status(200)
      .json({
        thread:
          messageBoard[parseInt(boardId, 10)].threads[parseInt(threadId, 10)]
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({});
  }
});

// get 10 latest threads together with their 3 latest repleis
app.get("/api/threads/:boardId", (req: Request, res: Response) => {
  try {
    const boardId: string = req.params.boardId;
    if (messageBoard[parseInt(boardId, 10)].threads.length < 3)
      return res
        .status(200)
        .json({ threads: messageBoard[parseInt(boardId, 10)].threads });

    let tenLastestThreads: any = messageBoard[parseInt(boardId, 10)].threads
      .sort((a: any, b: any) =>
        b.bumpedOn - a.bumpedOn ? 1 : a.bumpedOn - b.bumpedOn ? -1 : 0
      )
      .splice(0, 10);
    tenLastestThreads = tenLastestThreads.map((thread: any, index: number) => {
      const threeLatestReplies: any = thread.reply
        .sort((a: any, b: any) =>
          b.bumpedOn - a.bumpedOn ? 1 : a.bumpedOn - b.bumpedOn ? -1 : 0
        )
        .splice(0, 3);
      thread.reply = threeLatestReplies;
      return thread;
    });
    return res.status(200).json({ threads: tenLastestThreads });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
});

// FCC projects: Metric-Imperial converter
app.get("/api/convert", (req: Request, res: Response) => {
  const input = req.query.input;
  const reVerify = /(?<=\d)\w+|\d(?=\w)/i;
  if (!input.match(reVerify)) {
    res.status(400).send("invalid input");
  }
  const reUnit = /[a-zA-Z]+/;
  const index: number = input.search(reUnit);
  let unit: string = input.slice(index);
  let number: number = eval(input.slice(0, index));

  switch (unit) {
    case "gal":
      number *= 3.78541;
      unit = "L";
      break;
    case "lbs":
      number *= 0.453592;
      unit = "kg";
      break;
    case "mi":
      number *= 1.60934;
      unit = "km";
      break;
    case "L":
      number *= 1 / 3.78541;
      unit = "gal";
      break;
    case "kg":
      number *= 1 / 0.453592;
      unit = "lbs";
      break;
    case "km":
      number *= 1 / 1.60934;
      unit = "mi";
      break;
    default:
      break;
  }

  return res.status(200).json({ convertNum: number, convertUnit: unit });
});

// FCC projects: Stock Price Checker
let dbStock = [
  {
    stock: "GOOG",
    price: "786.90"
  },
  {
    stock: "MSFT",
    price: "62.30"
  }
];

app.get("/api/stock-prices", (req: Request, res: Response) => {
  const stocks = req.query.stock;
  console.log("query ", req.query);
  console.log("stocks ", stocks);
  const stockList = [];

  if (typeof stocks === "string") {
    console.log("stock ", stocks);
    dbStock.map((stockInDB: any) => {
      if (stockInDB.stock === stocks.toUpperCase()) {
        stockList.push(stocks);
      }
    });
  } else {
    stocks.map((stock: any, index: any) => {
      console.log("stock ", stock);
      console.log(typeof stock);
      dbStock.map((stockInDB: any) => {
        if (stockInDB.stock === stock.toUpperCase()) {
          stockList.push(stock);
        }
      });
    });
  }
  return res.status(200).json({ stockData: stockList });
});

// FCC projects: Personal Library
let dbBooks = [
  {
    id: "0",
    title: "test book",
    commentCount: 10
  }
];

app.delete("/api/books", (req: Request, res: Response) => {
  dbBooks = [];
  return res.status(200).send("all book deleted");
});

app.delete("/api/books/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  for (let i: number = 0; i < dbBooks.length; i++) {
    if (dbBooks[i].id === id) {
      dbBooks.splice(i, 1);
      return res.status(200).send(`book id ${id} deleted`);
    }
  }
  return res.status(400).send(`book id ${id} not existed`);
});

app.post("/api/books", (req: Request, res: Response) => {
  const { title, comment } = req.body;

  dbBooks.map((book: any, index: any) => {
    if (title === book.title)
      return res.status(400).json({ title: title, post: "false" });
  });

  dbBooks.push({
    id: dbBooks.length.toString(),
    title: title,
    commentCount: 0
  });
  return res.status(200).json({ title: title, post: "success" });
});

app.post("/api/books/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, comment } = req.body;

  dbBooks.map((book: any, index: any) => {
    if (id === book.id) {
      book.commentCount++;
      return res.status(200).send(`add comment to book id ${id}`);
    } else return res.status(400).send(`book id ${id} not found`);
  });
});

app.get("/api/books", (req: Request, res: Response) => {
  return res.status(200).json({ bookList: dbBooks });
});

app.get("/api/books/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  dbBooks.map((book: any, index: any) => {
    if (id === book.id) return res.status(200).json({ book: book });
  });
  return res.status(400).send(`book id ${id} not found`);
});

// FCC project: Issue Trackers
const dbIssues = [
  {
    projectName: "TEST",
    issueId: 0,
    issueTitle: "test",
    issueText: "test",
    createdBy: "QuyenHo",
    assignedTo: "",
    statusText: "",
    createdOn: new Date("20190121"),
    updatedOn: new Date("20190122"),
    open: true
  }
];

app.get("/api/issues/:projectName", (req: Request, res: Response) => {
  const { projectName } = req.params;
  const issueList = [];
  dbIssues.map((issue: any, index: any) => {
    if (issue.projectName === projectName) issueList.push(issue);
  });

  return res.status(200).json({
    projectName: projectName,
    issueList: issueList
  });
});

app.delete("/api/issues/:projectName", (req: Request, res: Response) => {
  const { projectName } = req.params;
  const { id } = req.body;

  if (!id)
    res.status(400).json({ projectName: projectName, error: "_id error" });
  for (let i = 0; i < dbIssues.length; i++) {
    if (dbIssues[i].projectName === projectName && dbIssues[i].issueId === id) {
      dbIssues.splice(i, 1);
    }
  }
  return res.status(200).json({
    projectName: projectName,
    removed: "success"
  });
});

app.put("/api/issues/:projectName", (req: Request, res: Response) => {
  const { projectName } = req.params;
  const { id } = req.body;

  if (!id)
    res.status(400).json({ projectName: projectName, error: "_id error" });
  for (let i = 0; i < dbIssues.length; i++) {
    if (dbIssues[i].projectName === projectName && dbIssues[i].issueId === id) {
      dbIssues[i].updatedOn = new Date();
    }
  }

  return res.status(200).json({
    projectName: projectName,
    updated: "true"
  });
});

app.post("/api/issues/:projectName", (req: Request, res: Response) => {
  const { projectName } = req.params;
  const issueTitle: string = req.body.issue_title;
  const issueText: string = req.body.issue_text;
  const createdBy: string = req.body.created_by;
  const assignedTo: string | undefined = req.body.assigned_to;
  const statusText: string | undefined = req.body.status_text;

  dbIssues.push({
    projectName: projectName,
    issueId: dbIssues.length,
    issueTitle: issueTitle,
    issueText: issueText,
    createdBy: createdBy,
    assignedTo: assignedTo ? assignedTo : "",
    statusText: statusText ? statusText : "",
    createdOn: new Date(),
    updatedOn: new Date(),
    open: true
  });

  res.status(200).json(dbIssues[dbIssues.length - 1]);
});
