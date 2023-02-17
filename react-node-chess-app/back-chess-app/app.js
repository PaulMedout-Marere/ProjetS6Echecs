var createError = require('http-errors'); //bibliothèque pour créer des erreurs HTTP personnalisées.
var express = require('express'); //framework utilisé pour développer des applications web.
var path = require('path'); //bibliothèque Node.js utilisée pour manipuler les chemins de fichiers.
var cookieParser = require('cookie-parser'); //utilisé pour parser les cookies envoyés avec les requêtes.
var logger = require('morgan'); // bibliothèque morgan est utilisé pour journaliser les requêtes entrantes.
var bodyParser = require('body-parser'); //middlaware utilisé pour extraire les données du corps de la requête et les stocker dans req.body.
const acl = require('express-acl'); //middleware qui permet de définir des autorisations pour des utilisateurs et des groupes d'utilisateurs.
const jwt = require('jsonwebtoken'); //middleware qui gere les tokens

acl.config({
  baseUrl: '/',
  filename: 'acl.json',
  path: 'config',
  defaultRole: 'user',
  decodedObjectName: 'user',
  roleSearchPath: 'user.admin'
},
  {
    status: 'Access Denied',
    message: 'You are not authorized to access this resource'
  });



//Importation des routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express(); //initialise une nouvelle application Express.

app.use(logger('dev')); //utilise Morgan pour journaliser les requêtes entrantes en mode développement.
app.use(express.json()); //utilise le middleware json pour parser le corps des requêtes entrantes en tant que JSON.
app.use(express.urlencoded({ extended: false })); //utilise le middleware urlencoded pour parser le corps des requêtes entrantes avec une syntaxe x-www-form-urlencoded.
app.use(cookieParser()); //utilise cookie-parser pour parser les cookies envoyés avec les requêtes.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //utilise bodyParser pour extraire les données du corps de la requête.
app.use(express.static(path.join(__dirname, 'public'))); //utilise le middleware static pour servir des fichiers statiques du dossier public.
app.use(acl.authorize); //configurer les autorisations pour les utilisateurs connectés 
app.use(acl.authorize.unless({ path: ['/user/login'] }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Chargement du middleware de vérification de token
app.use(function (req, res, next) {
  const token = req.headers['jwt-token'];
  console.log("token : " + token);

  if (!token) {
    return next(new Error('No token Provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.send(err);
    }
    req.decoded = decoded;
    return next();
  });
});

// définit un gestionnaire d'erreur pour les cas où aucune route ne correspond à la requête entrante. 
// Il utilise createError pour créer une erreur 404 et la passe au prochain gestionnaire d'erreur.
app.use(function (req, res, next) {
  next(createError(404));
});

// définit un gestionnaire d'erreur générique qui gère les erreurs produites par les routes et les middlewares précédents. 
// Il définit un message d'erreur et une erreur en mode développement
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(500).json({ error: err.message });
});

module.exports = app;
