
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const axios = require('axios');
const fetch = require('node-fetch');

const { getUserInfo } = require("@replit/repl-auth");
const fs = require('fs');
const readline = require('readline');
const moment = require('moment');
const app = express();

app.set('trust proxy', true); // Enable trust proxy setting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per windowMs
  message: `
  <!DOCTYPE html>
<html class="h-100">
  <head>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="#2b5797">
<meta name="theme-color" content="#ffffff">
    <title>tlochsta media</title>
    <script src="https://getbootstrap.com/docs/5.3/assets/js/color-modes.js"></script>
       <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }

      .b-example-divider {
        width: 100%;
        height: 3rem;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
      }

      .b-example-vr {
        flex-shrink: 0;
        width: 1.5rem;
        height: 100vh;
      }

      .bi {
        vertical-align: -.125em;
        fill: currentColor;
      }

      .nav-scroller {
        position: relative;
        z-index: 2;
        height: 2.75rem;
        overflow-y: hidden;
      }

      .nav-scroller .nav {
        display: flex;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
        margin-top: -1px;
        overflow-x: auto;
        text-align: center;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
      }

      .btn-bd-primary {
        --bd-violet-bg: #712cf9;
        --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

        --bs-btn-font-weight: 600;
        --bs-btn-color: var(--bs-white);
        --bs-btn-bg: var(--bd-violet-bg);
        --bs-btn-border-color: var(--bd-violet-bg);
        --bs-btn-hover-color: var(--bs-white);
        --bs-btn-hover-bg: #6528e0;
        --bs-btn-hover-border-color: #6528e0;
        --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
        --bs-btn-active-color: var(--bs-btn-hover-color);
        --bs-btn-active-bg: #5a23c8;
        --bs-btn-active-border-color: #5a23c8;
      }
      .bd-mode-toggle {
        z-index: 1500;
      }
    </style>

    
    <style>
      /*
 * Globals
 */


/* Custom default button */
.btn-light,
.btn-light:hover,
.btn-light:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from  */
}


/*
 * Base structure
 */

body {
  text-shadow: 0 .05rem .1rem rgba(0, 0, 0, .5);
  box-shadow: inset 0 0 5rem rgba(0, 0, 0, .5);
}

.cover-container {
  max-width: 42em;
}


/*
 * Header
 */

.nav-masthead .nav-link {
  color: rgba(255, 255, 255, .5);
  border-bottom: .25rem solid transparent;
}

.nav-masthead .nav-link:hover,
.nav-masthead .nav-link:focus {
  border-bottom-color: rgba(255, 255, 255, .25);
}

.nav-masthead .nav-link + .nav-link {
  margin-left: 1rem;
}

.nav-masthead .active {
  color: #fff;
  border-bottom-color: #fff;
}
    </style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
  </head>
 <body class="d-flex h-100 text-center text-bg-dark">
    <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
      <symbol id="check2" viewBox="0 0 16 16">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
      </symbol>
      <symbol id="circle-half" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"></path>
      </symbol>
      <symbol id="moon-stars-fill" viewBox="0 0 16 16">
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
        <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
      </symbol>
      <symbol id="sun-fill" viewBox="0 0 16 16">
        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path>
      </symbol>
    </svg>

    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
      <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (dark)">
        <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#moon-stars-fill"></use></svg>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
            <svg class="bi me-2 opacity-50 theme-icon" width="1em" height="1em"><use href="#sun-fill"></use></svg>
            Light
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="true">
            <svg class="bi me-2 opacity-50 theme-icon" width="1em" height="1em"><use href="#moon-stars-fill"></use></svg>
            Dark
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="false">
            <svg class="bi me-2 opacity-50 theme-icon" width="1em" height="1em"><use href="#circle-half"></use></svg>
            Auto
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="#check2"></use></svg>
          </button>
        </li>
      </ul>
    </div>

    
<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">


  <main class="px-3">
    <h1>Slow it down!</h1>
    <p class="lead">Woah there! You managed to make 100 requests in 15 minutes! Slow down please, your going to crash our servers!</p>

  </main>

  <footer class="mt-auto text-white-50">
  <em>© 2023 tlochsta.dev • <a href="https://github.com/TlochstaDev" style="color:white;"><i class="fa-brands fa-github"></i></a> <a href="https://tiktok.com/@tlochsta" style="color:white;"><i class="fa-brands fa-tiktok"></i></a> <a style="color:white;" href="https://youtube.com/c/tlochsta"><i class="fa-brands fa-youtube"></i></a></em>
  </footer>
</div>
<script src="https://getbootstrap.com/docs/5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>

    

</body>
</html>
  `,
});

const bannedUsers = require('./bans.json');
const bans = (req, res, next) => {
  const username = req.get('X-Replit-User-Name');
  const userid = req.get('X-Replit-User-Id');
  // Check if the user is in the bannedUsers array
  const bannedUser = bannedUsers.find(user => user.username === username);
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      vadmin = true;
    }
  if (bannedUser) {
    res.render('banned', {
      username: req.get('X-Replit-User-Name'),
      id: req.get('X-Replit-User-Id'),
      banDate: bannedUser.banDate,
      unbanDate: bannedUser.unbanDate,
      message: bannedUser.message,
      admin: bannedUser.adminName,
      isAdmin: admin,
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      
    });
  }

  // User is not banned, continue to the next middleware/route
  next();
};

// Attach the middleware to all routes
app.use(bans);

// Create a rotating file stream for logging
// Create a rotating file stream for logging

app.use(limiter);

// Serve static files (including the CSS and HTML)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts/devtools-detect', express.static(__dirname + '/node_modules/devtools-detect/'));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Game page route
app.get('/game/:gameDirectory/:fl', (req, res) => {
  var game = "https://cdn.tlochsta.dev/cdn/3kh0/3kh0-Assets/main/" + req.params.gameDirectory + "/" + req.params.fl + ".html";
  if (!game) {
    window.location = "/";
  }
       if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('game', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
      gd: game,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/repl/:game', (req, res) => {
  var game = "https://" + req.params.game + ".id.repl.co"
  if (!game) {
    window.location = "/";
  }
       if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('game', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
      gd: game,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/repl2/:game/:directory', (req, res) => {
  var game = "https://" + req.params.game + ".id.repl.co/" + req.params.directory;
  if (!game) {
    window.location = "/";
  }
       if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('game', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
      gd: game,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/scratch/:scratch', (req, res) => {
  var game = "https://scratch.mit.edu/projects/" + req.params.scratch + "/embed";
  if (!game) {
    window.location = "/";
  }
       if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('game', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
      gd: game,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/repl/:game', (req, res) => {
  var game = "https://" + req.params.game + ".id.repl.co"
  if (!game) {
    window.location = "/";
  }
     if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('game', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
      gd: game,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});


// Homepage route
app.get('/', (req, res) => {
   if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('index', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/admin', (req, res) => {
   if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }
if(admin == false) {
  res.redirect("/")
}
try {
  const data = fs.readFileSync('/logs/access-' + new Date().toISOString().slice(0, 10) + '.log', 'utf8');
  console.log(data);
     res.render('admin', {
        name: req.get('X-Replit-User-Name'),
        name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
        isAdmin: admin,
        log: data
    });
} catch (err) {
  console.error(err);
}

       } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/admin/requests', (req, res) => {
   if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }
if(admin == false) {
  res.redirect("/")
}
const logDirectory = path.join(__dirname, 'logs');
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
  const logFilePath = path.join(logDirectory, `access-${formattedDate}.log`);

  if (!fs.existsSync(logFilePath)) {
    return res.status(404).send('Log file not found for today.');
  }

  const requests = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(logFilePath),
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    const data = JSON.parse(line);
    requests.push(data);
  });

  rl.on('close', () => {
    res.json(requests);
  });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/user/settings', (req, res) => {
  if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('settings', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
      id: req.get('X-Replit-User-Id'),
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});

app.get('/user/logout', (req, res) => {
  res.clearCookie("REPL_AUTH");
  res.end();
});

app.get('/developers/docs/regulations', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/devrules/main.html'));
});


app.get('/about', (req, res) => {
  if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('about', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/developers', (req, res) => {
  if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('developers', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/games', (req, res) => {
    if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('games', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('/partners', (req, res) => {
    if (req.get('X-Replit-User-Id')) {
    var admin = false;
    if (req.get('X-Replit-User-Name') == 'tlochsta' || req.get('X-Replit-User-Name') == 'tlochsta2' || req.get('X-Replit-User-Name') == 'JacksonEllingse') {
      admin = true;
    }

    res.render('partners', {
      name: req.get('X-Replit-User-Name'),
      name1: req.get('X-Replit-User-Name').charAt(0).toUpperCase(),
      isAdmin: admin,
    });
  } else {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
  }
});
app.get('*', function(req, res){
      res.render('404', { url: req.url });
    return;
});
app.post('/api/v1/reportGame', (req, res) => {
  const { reportType, gameName, error } = req.body;
  const webhookURL = process.env['WEBHOOK_URL']; // Replace with your actual webhook URL
  const embed = {
    title: 'New Report',
    color: 10038562, // You can use a color code here
    fields: [
      {
        name: '**🚩 Report Type**',
        value: reportType,
        inline: true
      },
      {
        name: '**🎮 Game Name**',
        value: gameName,
        inline: true
      },
      {
        name: '**💬 Comment**',
        value: error
      }
    ]
  };
  var params = {
    username: "Your name",
    avatar_url: "",
    content: "Some message you want to send",
    embeds: [embed]
  }

  fetch(webhookURL, {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(res => {
    console.log(res);
  })

  res.status(200).json({ message: 'Report sent successfully' });

});

app.get('/game-info', async (req, res) => {
  try {
    const accessToken = process.env['GHTOKEN'];
    const repoUrl = 'https://api.github.com/repos/3kh0/3kh0-Assets/contents';
    const mediaBaseUrl = 'https://media.tlochsta.dev/game';
    const commitUrl = 'https://api.github.com/repos/carbonsystems-dev/gamevault/commits';

    const response = await fetch(repoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const gameList = [];

    for (const item of data) {
      if (item.type === 'dir') {
        const gameID = item.name;

        const commitResponse = await fetch(`${commitUrl}?path=${gameID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!commitResponse.ok) {
          console.error(`Failed to fetch commit data for ${gameID} with status: ${commitResponse.status}`);
          continue;
        }

        const commitData = await commitResponse.json();
        const commitAuthor = commitData[0].commit.author.name;

        gameList.push({
          gameID,
          commitAuthor,
          link: `${mediaBaseUrl}/${gameID}/index`
        });
      }
    }

    res.json(gameList);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
