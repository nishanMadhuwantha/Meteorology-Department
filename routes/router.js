/**
 * Created by nilupul on 3/8/17.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var dbOperations = require('../modules/dbOperations');
var synopDecode = require('../modules/synopDecode');

var router = express.Router();

router.post('/login', function(request, response) {
	dbOperations.login(request.body.username, request.body.password, function(err, user) {
		if(err) {
			response.status(500).json({
                "success": "false",
                "error": "true",
				"message":"Internal Server Error",
				"user":"null"
            });
		} else if(!user) {
			response.status(401).json({
				"success":"false",
				"error":"true",
                "message":"Invalid username password",
                "user":"null"
			});
		} else {
			response.status(200).json({
				"success":"true",
				"error":"false",
                "message":"Login Successful",
				"user":user
			});
		}
	});
});

router.post('/register', function(request, response) {
	var user = {
		username: request.body.username,
		role: request.body.role,
		station: request.body.station,
		fname: request.body.fname,
		lname: request.body.lname,
		password: request.body.password,
        nic: request.body.nic,
        gender: request.body.gender
	};
	dbOperations.add_user(user, function(err, isSuccess) {
		if(err) {
			console.log(err.message);
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
		} else if(!isSuccess) {
            response.status(406).json({
                "success":"false",
                "error":"true",
                "message":"User registration failed"
            });
		} else {
			response.status(201).json({
				"success":"true",
				"error":"false",
				"message":"User registration successful"
			})
		}
    });
});
router.post('/synopsis', function(request, response) {
    console.log(request.body.username);
	dbOperations.add_record(request.body.username, request.body.synopsis, function(err, isSuccess) {
		if(err) {
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
		} else if(!isSuccess) {
            response.status(406).json({
                "success":"false",
                "error":"true",
                "message":"Record insertion failed"
            });
		} else {
            response.status(201).json({
                "success":"true",
                "error":"false",
                "message":"Record insertion successful"
            });
		}
    });
    synopDecode.decode(request.body.username, request.body.synopsis, function(isSuccess) {
        console.log(isSuccess);
    });
});

router.get('/users', function(request, response) {
	dbOperations.getUsers(function(err, users) {
		if(err) {
			response.status(500).json({
				"error":"true"
			});
		} else if(!users) {
			response.status(404).json({
				"error":"true"
			});
		} else {
			response.status(200).json({
				"users":users
			});
		}
    });
});

router.delete('/remove/:id', function(request, response) {
	dbOperations.removeUser(request.params.id, function(err, isSuccess) {
		if(err) {
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
		} else if(!isSuccess) {
			response.status(404).json({
				"success":"false",
				"error":"true",
				"message":"User not found"
			});
		} else {
			dbOperations.getUsers(function(err, users) {
                if(err) {
                    response.status(500).json({
                        "success": "false",
                        "error": "true",
                        "message":"Internal Server Error"
                    });
                } else if(!isSuccess) {
                    response.status(404).json({
                        "success":"false",
                        "error":"true",
                        "message":"Users not found"
                    });
                } else {
                    response.status(200).json({
                        "success":"true",
                        "error":"false",
                        "message":"Users found successful",
						"users":users
                    });
                }
            });
		}
    });
});

router.get('/records', function(request, response) {
	dbOperations.getRecords(function(err, records) {
		if(err) {
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
		} else if(!records) {
            response.status(404).json({
                "success":"false",
                "error":"true",
                "message":"Records not found"
            });
		} else {
            response.status(200).json({
                "success":"true",
                "error":"false",
                "message":"Records found successful",
                "records":records
            });
        }
	});
});

router.get('/synopsis/:id', function(request, response) {
	dbOperations.getRecord(request.params.id, function(err, record) {
		if(err) {
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
		} else if(!record) {
            response.status(404).json({
                "success":"false",
                "error":"true",
                "message":"Record not found"
            });
		} else {
            response.status(200).json({
                "success":"true",
                "error":"false",
                "message":"Record found successful",
                "record":record
            });
		}
    });
});

router.post('/checktoken', function (request, response) {
    console.log(request.body.token);
    response.status(200).json({
        "success":"true"
    });
});

router.get('/user/:id', function(request, response) {
    dbOperations.getUser(request.params.id, function(err, user) {
        if(err) {
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
        } else if(!user) {
            response.status(404).json({
                "success":"false",
                "error":"true",
                "message":"User not found"
            });
        } else {
            response.status(200).json({
                "success":"true",
                "error":"true",
                "message":"User found success",
                "user":user
            });
        }
    });
});

router.post('/updateuser', function(request, response) {
    var fname = request.body.fname;
    var lname = request.body.lname;
    var station = request.body.station;
    var username = request.body.username;
    console.log(fname + " " + lname + " " + station + " " + username);
    dbOperations.updateUser(fname, lname, station, username, function(err, isSuccess) {
        if(err) {
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
        } else if(!isSuccess) {
            response.status(404).json({
                "success":"false",
                "error":"true",
                "message":"User update failed"
            });
        } else {
            response.status(200).json({
                "success":"true",
                "error":"false",
                "message":"User update success"
            });
        }
    });
});

router.get('/weather', function(request, response) {
    response.status(200).json([
        {"temperature": "23", "dewpoint":"19"},
        {"temperature": "22", "dewpoint":"20"},
        {"temperature": "21", "dewpoint":"18"},
        {"temperature": "25", "dewpoint":"19"},
        {"temperature": "24", "dewpoint":"18"},
        {"temperature": "29", "dewpoint":"15"},
        {"temperature": "32", "dewpoint":"16"},
        {"temperature": "23", "dewpoint":"17"},
        {"temperature": "22", "dewpoint":"18"},
        {"temperature": "21", "dewpoint":"19"},
        {"temperature": "31", "dewpoint":"18"},
        {"temperature": "23", "dewpoint":"16"},
        {"temperature": "32", "dewpoint":"17"},
        {"temperature": "25", "dewpoint":"18"},
        {"temperature": "26", "dewpoint":"19"},
        {"temperature": "27", "dewpoint":"17"},
        {"temperature": "28", "dewpoint":"19"},
        {"temperature": "29", "dewpoint":"16"},
        {"temperature": "30", "dewpoint":"18"},
        {"temperature": "30", "dewpoint":"17"},
        {"temperature": "32", "dewpoint":"12"},
        {"temperature": "33", "dewpoint":"16"}
    ]);
});

router.get('/weatherdata/:id', function(request, response) {
    dbOperations.getWeatherData(request.params.id, function(err, info) {
        response.status(200).json({
            "weather": info
        });
    });
});

router.post('/addweathers', function(request, response) {
    dbOperations.insertNewStation(request.body.wsname, request.body.wsid, request.body.wslatitude, request.body.wslongitude, function(err, isSuccess) {
        console.log(isSuccess);
        if(err) {
            response.status(500).json({
                "success": "false",
                "error": "true",
                "message":"Internal Server Error"
            });
        } else if(!isSuccess) {
            response.status(406).json({
                "success":"false",
                "error":"true",
                "message":"Station insertion failed"
            });
        } else {
            response.status(201).json({
                "success":"true",
                "error":"false",
                "message":"Station insertion successful"
            });
        }
    });
});
module.exports = router;