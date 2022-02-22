var userHandlers = [msw.rest.get(apiUrl + "/me", function (req, res, ctx) {
  try {
    return Promise.resolve(getUser(req)).then(function (user) {
      var token = getToken(req);
      return res(ctx.json({
        user: _extends({}, user, {
          token: token
        })
      }));
    });
  } catch (e) {
    return Promise.reject(e);
  }
}), msw.rest.post(apiUrl + "/login", function (req, res, ctx) {
  try {
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password;
    return Promise.resolve(authenticate({
      name: username,
      password: password
    })).then(function (user) {
      return res(ctx.json({
        user: user
      }));
    });
  } catch (e) {
    return Promise.reject(e);
  }
}), msw.rest.post(apiUrl + "/register", function (req, res, ctx) {
  try {
    var _req$body2 = req.body,
        username = _req$body2.username,
        password = _req$body2.password;
    var userFields = {
      name: username,
      password: password
    };
    return Promise.resolve(create(userFields)).then(function () {
      var _exit = false;

      function _temp2(_result) {
        return _exit ? _result : res(ctx.json({
          user: user
        }));
      }

      var user;

      var _temp = _catch(function () {
        return Promise.resolve(authenticate(userFields)).then(function (_accountDB$authentica) {
          user = _accountDB$authentica;
          bootstrap(user.id);
        });
      }, function (error) {
        _exit = true;
        return res(ctx.status(error.status), ctx.json({
          message: error.message
        }));
      });

      return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
    });
  } catch (e) {
    return Promise.reject(e);
  }
})];





var getRestHandlers = function getRestHandlers(endpoint, db) {
  return [msw.rest.get(apiUrl$1 + "/" + endpoint, function (req, res, ctx) {
    try {
      return Promise.resolve(getUser(req)).then(function (user) {
        var params = req.url.searchParams;
        var queryResult = db.queryByOwnerId(user.id, Object.fromEntries(params));
        return res(ctx.json(queryResult));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }), msw.rest.get(apiUrl$1 + "/" + endpoint + "/:id", function (req, res, ctx) {
    try {
      var id = req.params.id;
      var item = db.detail(+id);
      return Promise.resolve(res(ctx.json(item)));
    } catch (e) {
      return Promise.reject(e);
    }
  }), msw.rest.patch(apiUrl$1 + "/" + endpoint + "/:id", function (req, res, ctx) {
    try {
      var _convertIds = convertIds(req.params),
          id = _convertIds.id;

      var updates = req.body;
      var updatedItem = db.update(id, updates);
      return Promise.resolve(res(ctx.json(updatedItem)));
    } catch (e) {
      return Promise.reject(e);
    }
  }), msw.rest["delete"](apiUrl$1 + "/" + endpoint + "/:id", function (req, res, ctx) {
    try {
      var _convertIds2 = convertIds(req.params),
          id = _convertIds2.id;

      db.remove(id);
      return Promise.resolve(res(ctx.json({
        success: true
      })));
    } catch (e) {
      return Promise.reject(e);
    }
  }), msw.rest.post(apiUrl$1 + "/" + endpoint, function (req, res, ctx) {
    try {
      return Promise.resolve(getUser(req)).then(function (user) {
        var targetAddItem = Object.assign(req.body, {
          ownerId: user.id,
          created: new Date().getTime()
        });

        if (endpoint === 'tasks') {
          targetAddItem = _extends({}, targetAddItem, {
            reporterId: user.id,
            typeId: taskTypeDB.queryByOwnerId(user.id)[0].id,
            created: new Date().getTime()
          });
        }

        return Promise.resolve(db.create(convertIds(targetAddItem))).then(function (detail) {
          return res(ctx.json(detail));
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  })];
};



//---------


var apiUrl$2 = process.env.REACT_APP_API_URL;
var reorderHandlers = [msw.rest.post(apiUrl$2 + "/kanbans/reorder", function (req, res, ctx) {
  try {
    var _req$body = req.body,
        fromId = _req$body.fromId,
        referenceId = _req$body.referenceId,
        type = _req$body.type;
    return Promise.resolve(kanbanDB.reorder({
      fromId: fromId,
      referenceId: referenceId,
      type: type
    })).then(function () {
      return res(ctx.json({}));
    });
  } catch (e) {
    return Promise.reject(e);
  }
}), msw.rest.post(apiUrl$2 + "/tasks/reorder", function (req, res, ctx) {
  try {
    var _temp3 = function _temp3() {
      return Promise.resolve(taskDB.reorder({
        type: type,
        fromId: fromTaskId,
        referenceId: referenceId
      })).then(function () {
        return res(ctx.json({}));
      });
    };

    var _req$body2 = req.body,
        type = _req$body2.type,
        fromTaskId = _req$body2.fromId,
        referenceId = _req$body2.referenceId,
        fromKanbanId = _req$body2.fromKanbanId,
        toKanbanId = _req$body2.toKanbanId;

    var _temp4 = function () {
      if (fromKanbanId !== toKanbanId) {
        return Promise.resolve(taskDB.update(fromTaskId, {
          kanbanId: toKanbanId
        })).then(function () {});
      }
    }();

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
})];


//-------

var startServer = function startServer() {
  var server = msw.setupWorker.apply(void 0, handlers);
  server.start({
    quiet: true,
    serviceWorker: {
      url: "/" + "mockServiceWorker.js"
    }
  });
};

