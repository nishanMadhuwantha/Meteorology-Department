/**
 * Created by nilupul on 3/9/17.
 */
var db = require('./dbOperations');
function decode(username, synop, callback) {
    var synopArr = synop.split(" ");
    var isBeforeSec2 = true;
    var isBeforeSec3 = true;
    var isBeforeSec5 = true;
    var preSections = synopArr.slice(0, 5);
    var sections = synopArr.slice(5);
    var weather = {
        station: "",
        obDay: "",
        obTime: "",
        windUnit: "",
        windSource: "",
        blockNo: "",
        stationNo: "",
        precipitationRecoredSections: "",
        precipitationDataAvailability: "",
        stationOperation: "",
        precenceOfPastWeather: "",
        baseOfLowestCloud: "",
        hrizontalVisibility: "",
        totalCloudCover: "",
        windDirection: "",
        windSpeed: "",
        airTemperature: "",
        relativeHumidity: "",
        dewPoint: "",
        stationPressure: "",
        seaLevelPressure: "",
        pressureTendencyType: "",
        pressureTendency: "",
        precipitationAmout: "",
        precipitationDuration: "",
        pastWeather_1: "",
        pastWeather_2: "",
        presentWeather: "",
        presentWeatherAdditional: "",
        cloudsCL: "",
        cloudsCM: "",
        cloudsCH: "",
        cloudAmount: "",
        actualObHour: "",
        actualObMinute: "",
        seaSurfaceTemperature: "",
        periodOfWavesObtained: "",
        waveHeight: "",
        estimatedWindWavePeriod: "",
        estimatedWindWaveHeight: "",
        firstswellWaveDirection: "",
        secondswellWaveDirection: "",
        firstSwellWaveDuration: "",
        averageHeightOfFirstSwellWaves: "",
        secondSwellWaveDuration: "",
        averageHeightOfSecondSwellWaves: "",
        stateOfSkyInTropics: "",
        lowCloudDirection: "",
        middleCloudDirection: "",
        highCloudDirection: "",
        maximumTemperature: "",
        minimumTemperature: "",
        stateOfGroundWithoutIceOrSnow: "",
        stateOfGroundWithSnowOrIce: "",
        totalSnowDepth: "",
        timeBetweenTemperatureChange: "",
        temperatureChangeAmount: "",
        instumentalWaveHeight: ""
    };

    weather.station = "Land Fixed";

    weather.obDay = preSections[1].substring(0, 2);
    weather.obTime = preSections[1].substring(2, 4);
    db.getWindUnitSource(preSections[1].charAt(4), function (err, info) {
        weather.windUnit = info.unit;
        weather.windSource = info.source;
    });

    weather.blockNo = preSections[2].substring(0, 2);
    weather.stationNo = preSections[2].substring(2);

    db.getPreciptationData(preSections[3].charAt(0), function (err, info) {
        weather.precipitationRecoredSections = info.reported_section;
        weather.precipitationDataAvailability = !!info.availability;
    });
    db.getStationOperaitonPrecenceOfPastData(preSections[3].charAt(1), function (err, info) {
        weather.stationOperation = info.station_type;
        weather.precenceOfPastWeather = !!info.availability;
    });
    db.getBaseOfLowestCloud(preSections[3].charAt(3), function (err, info) {
        weather.baseOfLowestCloud = info.meter + 'm';
    });
    {
        var vv = Number(preSections[3].substring(3));
        if (vv <= 50) {
            weather.hrizontalVisibility = (vv / 10).toString() + 'km';
        } else if (vv >= 56 & vv <= 80) {
            weather.hrizontalVisibility = (vv - 50).toString() + 'km';
        } else if (vv >= 81 && vv <= 89) {
            weather.hrizontalVisibility = (30 + (vv % 10) * 5).toString() + 'km';
        } else {
            weather.hrizontalVisibility = null;
        }
    }
    {
        var totalCloudCover = Number(preSections[4].charAt(0));
        if (totalCloudCover < 9) {
            weather.totalCloudCover = preSections[4].charAt(0) + '/8';
        } else {
            weather.totalCloudCover = "Sky obscured";
        }
    }
    {
        var windDirection = Number(preSections[4].substring(1, 3));
        if (windDirection === 0) {
            weather.windDirection = "No wind";
        } else if (windDirection === 1) {
            weather.windDirection = "5-14";
        } else {
            if ((14 + (windDirection - 1) * 10) > 360) {
                weather.windDirection = (14 + (windDirection - 2) * 10 + 1).toString() + '-' + ((14 + (windDirection - 1) * 10) - 360);
            } else {
                weather.windDirection = (14 + (windDirection - 2) * 10 + 1).toString() + '-' + (14 + (windDirection - 1) * 10);
            }
        }
    }

    weather.windSpeed = preSections[4].substring(3);


    sections.forEach(function (fragment) {
        if (fragment.length == 3) {
            if (fragment === '222^^') {
                isBeforeSec2 = false;
            } else if (fragment === '333^^') {
                isBeforeSec2 = false;
                isBeforeSec3 = false;
            } else if (fragment === '555^^') {
                isBeforeSec2 = false;
                isBeforeSec3 = false;
                isBeforeSec5 = false;
            }
        } else {
            if (isBeforeSec2) {
                if (fragment.charAt(0) === '1') {
                    weather.airTemperature = (fragment.charAt(1) === '1' ? "-" : "+") + Number(fragment.substring(2)) / 10;
                } else if (fragment.charAt(0) === '2') {
                    if (fragment.charAt(1) === '9') {
                        weather.relativeHumidity = fragment.substring(2) + "%";
                    } else {
                        weather.dewPoint = (fragment.charAt(1) === '1' ? "-" : "+") + Number(fragment.substring(2)) / 10;
                    }
                } else if (fragment.charAt(0) === '3') {
                    weather.stationPressure = fragment.substring(1);
                } else if (fragment.charAt(0) == '4') {
                    weather.seaLevelPressure = fragment.substring(1);
                } else if (fragment.charAt(0) == '5') {
                    db.getPressureTendency(fragment.charAt(1), function (err, info) {
                        weather.pressureTendencyType = info.characteristic;
                    });
                    weather.pressureTendency = fragment.substring(2);
                } else if (fragment.charAt(0) === '6') {
                    if (Number(fragment.substring(1, 4)) < 990) {
                        weather.precipitationAmout = fragment.substring(1, 4);
                    } else {
                        weather.precipitationAmount = "0." + fragment.charAt(3);
                    }
                    db.getPreciptationDuration(fragment.charAt(4), function (err, info) {
                        weather.precipitationDuration = info.duration;
                    });
                } else if (fragment.charAt(0) === '7') {
                    db.getPastWeather(fragment.charAt(1), fragment.charAt(2), function (err, info) {
                        weather.pastWeather_1 = info[0].weather;
                        weather.pastWeather_2 = info[1].weather;
                    });
                    db.getPresentWeather(fragment.substring(3), function (err, info) {
                        weather.presentWeather = info.weather;
                        weather.presentWeatherAdditional = info.additional;
                    });
                } else if (fragment.charAt(0) === '8') {
                    db.getCLClouds(fragment.charAt(2), function (err, info) {
                        weather.cloudsCL = info.specification;
                    });
                    db.getCMCloud(fragment.charAt(3), function (err, info) {
                        weather.cloudsCM = info.specification;
                    });
                    db.getCHCloud(fragment.charAt(4), function (err, info) {
                        weather.cloudsCH = info.specification;
                    });
                    var cloudAmount = Number(fragment.charAt(1));
                    if (cloudAmount < 9) {
                        weather.cloudAmount = fragment.charAt(1) + '/8';
                    } else {
                        weather.cloudAmount = "Sky obscured";
                    }
                } else if (fragment.charAt(0) === '9') {
                    weather.actualObHour = fragment.substring(1, 3);
                    weather.actualObMinute = fragment.substring(3, 5);
                }
            } else if (isBeforeSec3) {
                if (fragment.charAt(0) === '0') {
                    weather.seaSurfaceTemperature = (fragment.charAt(1) === '1' ? "-" : "+") + Number(fragment.substring(2)) / 10;
                } else if (fragment.charAt(0) === '1') {
                    weather.periodOfWavesObtained = fragment.substring(1, 3) + "s";
                    db.getWaveHeight(fragment.substring(3), function (err, info) {
                        weather.waveHeight = info.meters;
                    });
                } else if (fragment.charAt(0) === '2') {
                    weather.estimatedWindWavePeriod = fragment.substring(1, 3) + 's';
                    weather.estimatedWindWaveHeight = (Number(fragment.substring(3)) * 0.5) + 'm';

                } else if (fragment.charAt(0) === '3') {
                    var firstswellWaveDirection = Number(fragment.substring(1, 3));
                    if (firstswellWaveDirection === 0) {
                        weather.firstswellWaveDirection = "No Swell Waves";
                    } else if (firstswellWaveDirection === 1) {
                        weather.firstswellWaveDirection = "5-14";
                    } else {
                        if ((14 + (firstswellWaveDirection - 1) * 10) > 360) {
                            weather.firstswellWaveDirection = (14 + (firstswellWaveDirection - 2) * 10 + 1).toString() + '-' + ((14 + (firstswellWaveDirection - 1) * 10) - 360);
                        } else {
                            weather.firstswellWaveDirection = (14 + (firstswellWaveDirection - 2) * 10 + 1).toString() + '-' + (14 + (firstswellWaveDirection - 1) * 10);
                        }
                    }
                    var secondswellWaveDirection = Number(fragment.substring(3));
                    if (secondswellWaveDirection === 0) {
                        weather.secondswellWaveDirection = "No Swell Waves";
                    } else if (secondswellWaveDirection === 1) {
                        weather.secondswellWaveDirection = "5-14";
                    } else {
                        if ((14 + (secondswellWaveDirection - 1) * 10) > 360) {
                            weather.secondswellWaveDirection = (14 + (secondswellWaveDirection - 2) * 10 + 1).toString() + '-' + ((14 + (secondswellWaveDirection - 1) * 10) - 360);
                        } else {
                            weather.secondswellWaveDirection = (14 + (secondswellWaveDirection - 2) * 10 + 1).toString() + '-' + (14 + (secondswellWaveDirection - 1) * 10);
                        }
                    }
                } else if (fragment.charAt(0) === '4') {
                    weather.firstSwellWaveDuration = fragment.substring(1, 3);
                    weather.averageHeightOfFirstSwellWaves = Number(fragment.substring(3)) * 0.5 + 'm';
                } else if (fragment.charAt(0) === '5') {
                    weather.secondSwellWaveDuration = fragment.substring(1, 3);
                    weather.averageHeightOfSecondSwellWaves = Number(fragment.substring(3)) * 0.5 + 'm';
                } else if (fragment.charAt(0) === '7') {
                    weather.averageHeightOfSecondSwellWaves = (Number(fragment.substring(2)) * 0.1) + 'm';
                }
            } else if (isBeforeSec5) {
                if (fragment.charAt(0) === '0') {
                    db.getStateOfSkyInTropics(fragment.charAt(1), function (err, info) {
                        weather.stateOfSkyInTropics = info.specification;
                    });
                    db.getDirectionOrBearing(fragment.charAt(2), function (err, info) {
                        weather.lowCloudDirection = info.description;
                    });
                    db.getDirectionOrBearing(fragment.charAt(3), function (err, info) {
                        weather.middleCloudDirection = info.description;
                    });
                    db.getDirectionOrBearing(fragment.charAt(4), function (err, info) {
                        weather.highCloudDirection = info.description;
                    });
                } else if (fragment.charAt(0) === '1') {
                    weather.maximumTemperature = (fragment.charAt(1) === '1' ? "-" : "+") + Number(fragment.substring(2)) / 10;
                } else if (fragment.charAt(0) === '2') {
                    weather.minimumTemperature = (fragment.charAt(1) === '1' ? "-" : "+") + Number(fragment.substring(2)) / 10;
                } else if (fragment.charAt(0) === '3') {
                    db.getsStateOfGroundWithoutIceOrSnow(fragment.charAt(1), function (err, info) {
                        weather.stateOfGroundWithoutIceOrSnow = info.description;
                    });
                } else if (fragment.charAt(0) === '4') {
                    db.getStateOfGroundWithSnowOrIce(fragment.charAt(1), function (err, info) {
                        weather.stateOfGroundWithSnowOrIce = info.description;
                    });
                    var snowDepth = Number(fragment.substring(2));
                    if (snowDepth < 997) {
                        weather.totalSnowDepth = snowDepth + 'cm';
                    } else if (snowDepth === 997) {
                        weather.totalSnowDepth = 'less than 0.5cm';
                    } else if (snowDepth === 998) {
                        weather.totalSnowDepth = 'Snow Cover not continuous';
                    } else {
                        weather.totalSnowDepth = 'Measurement impossible';
                    }
                } else if (fragment.substring(0, 2) === '54') {
                    weather.timeBetweenTemperatureChange = fragment.charAt(2);
                    weather.temperatureChangeAmount = ((fragment.charAt(3) === '1') ? "-" : "+")
                    + (Number(fragment.charAt(4)) < 5) ? "1" + fragment.charAt(4) : fragment.charAt(4);
                }
            } else {
            }
        }
    });
    setTimeout(function () {
        console.log(weather);
        db.get_record_info(username, function(err, info) {
            if(err) {
                callback(err, null);
            } else if(!info) {
                callback(null, false);
            } else {
                db.saveWeatherData(info.station, weather, function (err, isSuccess) {
                    if (err) {
                        callback(err, null);
                    } else if (!isSuccess) {
                        callback(null, false);
                    } else {
                        console.log("Successful decoding synop");
                        callback(null, true);
                    }
                });
            }
        });
    }, 300);
}

module.exports.decode = decode;