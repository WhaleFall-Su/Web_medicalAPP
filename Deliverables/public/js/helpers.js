const helpers = {
    ifRecorded: function (status, options) {
        if (status == 'recorded') {
            return options.fn(this)
        }
        return options.inverse(this)
    },

    ifUnrecorded: function (status, options) {
        if (status == 'unrecorded') {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    ifLeader1: function (key, options) {
        if (key == 0) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    ifLeader2: function (key, options) {
        if (key == 1) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    ifLeader3: function (key, options) {
        if (key == 2) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    ifEllipsis: function (key, options) {
        // console.log(key,options)
        if (key > 3 && !options.data.last && !options.data[key].isUser) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    ifFirst: function (key, options) {
        if (key == 0) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    ifTopFive:function (key, options) {
        if (key < 6000) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
}

module.exports.helpers = helpers
