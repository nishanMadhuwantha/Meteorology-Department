/**
 * Created by nilupul on 3/8/17.
 */
//Node.js core modules
var path = require('path');

//3rd party modules
var mysql = require('mysql');
var bcrypt = require('bcrypt');

//custom modules
var config = require('../configuration/config');

//SALT Config
var SALT_FACTOR = 10;

//creating main pool connection
var main_con_pool = mysql.createPool(config.config_main_db_pool_con_options);

//creating pool connection for sessions
var session_con_pool = mysql.createPool(config.config_session_pool_con_options);

//asynchronous function to use in login operation
function login(username, password, callback) {
    main_con_pool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null);
        } else {
            connection.query('CALL login_user(?)', [username], function (err, rows) {
                if (err) {
                    connection.release();
                    callback(err, null);
                } else {
                    if(!rows[0][0]) {
                        connection.release();
                        callback(null, false);
                    } else {
                        bcrypt.compare(password, rows[0][0].password, function(err, isMatch) {
                            if(err) {
                                connection.release();
                                callback(err, null);
                            } else if(!isMatch) {
                                connection.release();
                                callback(null, false);
                            } else {
                                connection.release();
                                callback(null, {fname: rows[0][0].fname, username: rows[0][0].username, role: rows[0][0].role});
                            }
                        });
                    }
                }
            });
        }
    });
}

//asynchronous function to use for deserialize user
function search_user(username, callback) {
    main_con_pool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null);
        } else {
            connection.query('CALL search_user(?)', [username], function (err, rows) {
                if (err) {
                    connection.release();
                    callback(err, null);
                } else {
                    if (!rows[0]) {
                        connection.release();
                        callback(null, false);
                    } else {
                        connection.release();
                        callback(null, {fname: rows[0][0].fname, username: rows[0][0].username});
                    }
                }
            });
        }
    });
}

//asynchronous function to check permissions
function check_permission(username, action, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        } else {
            connection.query('CALL check_permission(\'' + username + '\', \'' + action + '\')', function(err, rows) {
                if(err) {
                    connection.release();
                    callback(err, null);
                } else {
                    if(!rows[0]) {
                        connection.release();
                        callback(null, false);
                    } else {
                        connection.release();
                        callback(null, rows[0][0].isPermitted === 1);
                    }
                }
            });
        }
    });
}

//asynchronous function to use for retrieving data for add records
function get_record_info(username, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        } else {
            connection.query('CALL get_record_info(?)', [username], function(err, rows) {
                if(err) {
                    connection.release();
                    callback(err, null);
                } else {
                    if(!rows[0]) {
                        connection.release();
                        callback(null, false);
                    } else {
                        connection.release();
                        callback(null, {username: rows[0][0].username, station: rows[0][0].station, record: rows[0][0].record});
                    }
                }
            });
        }
    });
}

//asynchronous function to use for signing up new users
function add_user(user, callback) {
    main_con_pool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null);
        } else {
            bcrypt.genSalt(SALT_FACTOR, {}, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hashedpassword) {
                    user.password = hashedpassword;
                    connection.query('CALL add_user(\''+ user.username + '\', \'' + user.role + '\', \''
                        + user.station + '\', \'' + user.fname + '\', \'' + user.lname + '\', \'' + user.nic
                        + '\', \'' + user.gender + '\', \'' + user.password
                        + '\');', function (err, rows) {
                        if (err) {
                            connection.release();
                            if (err.errno === 1062) {
                                callback(null, false);
                            } else {
                                callback(err, null);
                            }
                        } else {
                            connection.release();
                            callback(null, !(rows.affectedRows === 0))
                        }
                    });
                });
            });
        }
    });
}

//asynchronous function to use for adding records
function add_record(username, synopsis, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        } else {
            get_record_info(username, function (err, info) {
                if(err) {
                    callback(err, null);
                } else if(!info) {
                    callback(null, false);
                } else {
                    var recordId = 're' + info.record;
                    connection.query('INSERT INTO synop_record VALUES(\'' + recordId + '\', \'' + info.station
                        + '\', \'' + info.username + '\', DATE(NOW()), TIME(NOW()), \''
                        + synopsis + '\');', function (err, rows) {
                        if (err) {
                            connection.release();
                            callback(err, null);
                        } else {
                            connection.release();
                            callback(null, !(rows.affectedRows === 0));
                        }
                    });
                }
            });
        }
    });
}

function getUsers(callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT fname, lname, role, station, username, nic, gender FROM user', function(err, users) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!users) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, users);
            }
        });
    });
}

function removeUser(username, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('DELETE FROM user WHERE username = ?', [username], function(err, isSuccess) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!isSuccess) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, !(isSuccess.affectedRows === 0));
            }
        });
    });
}

function getRecords(callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT record AS recordID, username AS user, station, time, date FROM synop_record', function(err, records) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!records) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, records);
            }
        });
    });
}

function getRecord(recordID, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT synop FROM synop_record WHERE record = ?', [recordID], function(err, record) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!record) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, record);
            }
        });
    });
}

function getUser(username, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('CALL user_details(?)', [username], function(err, user) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!user[0][0]) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, user[0][0]);
            }
        });
    });
}

function updateUser(fname, lname, station, username, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('UPDATE user SET fname = ? , lname = ? , station = ? WHERE username = ? ', [fname, lname, station, username], function(err, isSuccess) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(isSuccess.changedRows === 0) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, isSuccess.changedRows === 1);
            }
        });
    });
}
function insertNewStation(wsname, wsid, wslatitude, wslongitude, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('INSERT INTO station VALUES( ? , ? , ? , ? )', [wsid, wsname, wslatitude, wslongitude], function(err, isSuccess) {
            console.log(isSuccess);
            if(err) {
                connection.release();
                callback(err, null);
            } else if(isSuccess.affectedRows === 0) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, isSuccess.affectedRows === 1);
            }
        });
    });
}

//////////////////////////////////
function getWindUnitSource(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT unit, source FROM s1_windSpeedIndicate WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}

function getPreciptationData(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT reported_section, availability FROM s1_inclussionOrOmissionPreciptationData WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getStationOperaitonPrecenceOfPastData(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT station_type, availability FROM s1_stationOperationPresentPastData WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getBaseOfLowestCloud(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callbcak(err, null);
        }
        connection.query('SELECT meter FROM s1_baseOfLowestCloud WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getPressureTendency(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT characteristic FROM s1_pressureTendency WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getPreciptationDuration(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT duration FROM s1_durationOfPeriodOfPrecipitation WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getPastWeather(code1, code2, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT weather FROM s1_pastWeather WHERE code IN (? , ?)', [code1, code2], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info);
            }
        });
    });
}
function getPresentWeather(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT weather, additional FROM s1_presentWeather WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info){
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getCLClouds(code, callback) {
    main_con_pool.getConnection(function (err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT specification FROM s1_cloudTypeCL WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getCMCloud(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT specification FROM s1_cloudTypeCM WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getCHCloud(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT specification FROM s1_cloudTypeCH WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getWaveHeight(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT meters FROM s2_waveHeight WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getStateOfSkyInTropics(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT specification FROM s3_stateOfSkyInTropics WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getDirectionOrBearing(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT description FROM s3_directionOrBearing WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getsStateOfGroundWithoutIceOrSnow(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT description FROM s3_stateOfGroundWithoutIceOrSnow WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function getStateOfGroundWithSnowOrIce(code, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT description FROM s3_stateOfGroundWithSnowOrIce WHERE code = ?', [code], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}
function saveWeatherData(stationID, weather, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('INSERT INTO weatherData(stationtype, observationdate, observationhour, windunit, windsource, ' +
            'blockno, stationno, precipitationrecoredsections, precipitationdatavailability,' +
            'stationoperation, precenceofpastweather, baseoflowestcloud, hrizontalvisibility, totalcloudcover, ' +
            'winddirection, windspeed, airtemperature, relativehumidity, dewpoint, stationpressure,' +
            'seelevelpressure, pressuretendencytype, pressuretendency, precipitationamount, precipitationduration,' +
            'pastweather2, pastweather1, presentweather, presentweatheradditional, cloudscl, ' +
            'cloudcm, cloudch, cloudamount, actualobservehour, actualobserveminute, seasurfacetemperature,' +
            'periodofwavesobtained, waveheight, estimatedwindwaveperiod, estimatedwindwaveheight, ' +
            'firstswellwavedirection, secondswellwavedirection, firstSwellwaveduration, averageheightoffirstswellwaves,' +
            'secondswellwaveduration, averageheightofsecondswellwaves, stateofskyintropics, lowclouddirection,' +
            'middleclouddirection, highclouddirection, maximumtemperature, minimumtemperature, ' +
            'stateofgroundwithoutIceorsnow, stateofgroundwithsnoworice, totalsnowdepth, timebetweentemperaturechange,' +
            'temperaturechangeamount, instumentalwaveheight, stationID) VALUES(? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , \'' + stationID + '\')',
            Object.values(weather),
            function (err, status) {
                if(err) {
                    connection.release();
                    callback(err, null);
                } else if(!status) {
                    connection.release();
                    callback(null, false);
                } else {
                    connection.release();
                    callback(null, true);
                }
        });
    });
}
function getWeatherData(station, callback) {
    main_con_pool.getConnection(function(err, connection) {
        if(err) {
            callback(err, null);
        }
        connection.query('SELECT * FROM weatherData WHERE stationid = ?', [station], function(err, info) {
            if(err) {
                connection.release();
                callback(err, null);
            } else if(!info) {
                connection.release();
                callback(null, false);
            } else {
                connection.release();
                callback(null, info[0]);
            }
        });
    });
}





//exports modules
module.exports.login = login;
module.exports.search_user = search_user;
module.exports.check_permission = check_permission;
module.exports.add_user = add_user;
module.exports.get_record_info = get_record_info;
module.exports.add_record = add_record;
module.exports.session_con_pool = session_con_pool
module.exports.getUsers = getUsers;
module.exports.removeUser = removeUser;
module.exports.getRecords = getRecords;
module.exports.getRecord = getRecord;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.insertNewStation = insertNewStation;


//
module.exports.getWindUnitSource = getWindUnitSource;
module.exports.getPreciptationData = getPreciptationData;
module.exports.getStationOperaitonPrecenceOfPastData = getStationOperaitonPrecenceOfPastData;
module.exports.getBaseOfLowestCloud = getBaseOfLowestCloud;
module.exports.getPressureTendency = getPressureTendency;
module.exports.getPreciptationDuration = getPreciptationDuration;
module.exports.getPastWeather = getPastWeather;
module.exports.getPresentWeather = getPresentWeather;
module.exports.getCLClouds = getCLClouds;
module.exports.getCMCloud = getCMCloud;
module.exports.getCHCloud = getCHCloud;
module.exports.getWaveHeight = getWaveHeight;
module.exports.getStateOfSkyInTropics = getStateOfSkyInTropics;
module.exports.getDirectionOrBearing = getDirectionOrBearing;
module.exports.getsStateOfGroundWithoutIceOrSnow = getsStateOfGroundWithoutIceOrSnow;
module.exports.getStateOfGroundWithSnowOrIce = getStateOfGroundWithSnowOrIce;
module.exports.saveWeatherData = saveWeatherData;
module.exports.getWeatherData = getWeatherData;