(function($) {
    var buildingStructure = [{
        key: '钢混',
        value: '1'
    }, {
        key: '砖混',
        value: '2'
    }, {
        key: '砖木',
        value: '3'
    }, {
        key: '其他',
        value: '99'
    }];

    $.buildingStructure = buildingStructure.map(function(elem, index) {
        return '<option value="' + elem.value + '">' + elem.key + '</option>'
    }).join('');
}($));
