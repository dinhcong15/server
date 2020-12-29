class DataSendAsync {
    constructor() {
        this.room = "";
        this.temp = {
            temp: 0.0,
            // temp: { ave: 0, max: 0, min: 0 },
            // deviationStandard: { ave: 0, max: 0, min: 0 },
            // deviation: { ave: 0, max: 0, min: 0 },
            warningStandard: false,
            warning: false
        },
        this.humi = {
            humi: 0.0,
            // humi: { ave: 0, max: 0, min: 0 },
            // deviationStandard: { ave: 0, max: 0, min: 0 },
            // deviation: { ave: 0, max: 0, min: 0 },
            warningStandard: false,
            warning: false
        },
        this.light = {
            light: 0.0,
            // light: { ave: 0, max: 0, min: 0 },
            // deviationStandard: { ave: 0, max: 0, min: 0 },
            // deviation: { ave: 0, max: 0, min: 0 },
            warningStandard: false,
            warning: false
        },
        this.smoke = {
            smoke: 0.0,
            // deviation: 0.0,
            warningStandard: false,
            warning: false
        },
        this.time = ''
    }
}

class DataSensor {
    constructor() {
        this.room = "";
        this.temp = 0.0;
        this.humi = 0.0
        this.light = 0.0;
        this.smoke = 0.0;
        this.time = ''
    }
}

class DataDevice {
    constructor() {
        this.room = 0;
        this.id = "";
        this.status = ""
    }
}

class DataCheck {
    constructor() {
        this.room = '',
        this.temp = {
            value: { ave: 0, max: 0, min: 0 },
            deviation: { ave: 0, max: 0, min: 0 },
            flag: false
        },
        this.humi = {
            value: { ave: 0, max: 0, min: 0 },
            deviation: { ave: 0, max: 0, min: 0 },
            flag: false
        },
        this.light = {
            value: { ave: 0, max: 0, min: 0 },
            deviation: { ave: 0, max: 0, min: 0 },
            flag: false
        },
        this.smoke = {
            value: 0,
            deviation: 0,
            flag: false
        }
    }
}


module.exports = {
    DataSendAsync: DataSendAsync,
    DataSensor: DataSensor,
    DataCheck: DataCheck,
    DataDevice: DataDevice
} 