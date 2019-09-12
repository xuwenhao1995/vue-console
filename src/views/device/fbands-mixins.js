export default {
    data() {
        return {
            bandList: [],
            fddBandList: [{
                checked: false,
                str: 'B1',
                band: 1,
                start: 0,
                end: 599,
                min: 0,
                max: 599
            },
            {
                checked: false,
                str: 'B3',
                band: 3,
                start: 1200,
                end: 1949,
                min: 1200,
                max: 1949
            },
            {
                checked: false,
                str: 'B5',
                band: 5,
                start: 2400,
                end: 2649,
                min: 2400,
                max: 2649
            },
            {
                checked: false,
                str: 'B8',
                band: 8,
                start: 3450,
                end: 3799,
                min: 3450,
                max: 3799
            }],
            tddBandList: [
                {
                    checked: false,
                    str: 'B34',
                    band: 34,
                    start: 36200,
                    end: 36349,
                    min: 36200,
                    max: 36349
                },
                {
                    checked: false,
                    str: 'B38',
                    band: 38,
                    start: 37750,
                    end: 38249,
                    min: 37750,
                    max: 38249
                },
                {
                    checked: false,
                    str: 'B39',
                    band: 39,
                    start: 38250,
                    end: 38649,
                    min: 38250,
                    max: 38649
                },
                {
                    checked: false,
                    str: 'B40',
                    band: 40,
                    start: 38650,
                    end: 39649,
                    min: 38650,
                    max: 39649
                },
                {
                    checked: false,
                    str: 'B41',
                    band: 41,
                    start: 39650,
                    end: 41589,
                    min: 39650,
                    max: 41589
                }
            ],
            gsmBandList: [
                {
                    checked: false,
                    str: 'GSM900',
                    band: 900,
                    start: 1,
                    end: 124,
                    min: 1,
                    max: 124
                },
                {
                    checked: false,
                    str: 'DCS1800',
                    band: 1800,
                    start: 512,
                    end: 885,
                    min: 512,
                    max: 885
                }
            ],
        }
    },
    methods: {
        resetList() {
            this.fddBandList = [{
                checked: false,
                str: 'B1',
                band: 1,
                start: 0,
                end: 599,
                min: 0,
                max: 599
            },
            {
                checked: false,
                str: 'B3',
                band: 3,
                start: 1200,
                end: 1949,
                min: 1200,
                max: 1949
            },
            {
                checked: false,
                str: 'B5',
                band: 5,
                start: 2400,
                end: 2649,
                min: 2400,
                max: 2649
            },
            {
                checked: false,
                str: 'B8',
                band: 8,
                start: 3450,
                end: 3799,
                min: 3450,
                max: 3799
            }]
            this.tddBandList = [
                {
                    checked: false,
                    str: 'B34',
                    band: 34,
                    start: 36200,
                    end: 36349,
                    min: 36200,
                    max: 36349
                },
                {
                    checked: false,
                    str: 'B38',
                    band: 38,
                    start: 37750,
                    end: 38249,
                    min: 37750,
                    max: 38249
                },
                {
                    checked: false,
                    str: 'B39',
                    band: 39,
                    start: 38250,
                    end: 38649,
                    min: 38250,
                    max: 38649
                },
                {
                    checked: false,
                    str: 'B40',
                    band: 40,
                    start: 38650,
                    end: 39649,
                    min: 38650,
                    max: 39649
                },
                {
                    checked: false,
                    str: 'B41',
                    band: 41,
                    start: 39650,
                    end: 41589,
                    min: 39650,
                    max: 41589
                }
            ]
            this.gsmBandList = [
                {
                    checked: false,
                    str: 'GSM900',
                    band: 900,
                    start: 1,
                    end: 124,
                    min: 1,
                    max: 124
                },
                {
                    checked: false,
                    str: 'DCS1800',
                    band: 1800,
                    start: 512,
                    end: 885,
                    min: 512,
                    max: 885
                }
            ]
        }

    }

}