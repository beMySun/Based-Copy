;(function(){
    $(function() {
        console.log('iconMethod')
        var domType = ['input', 'select'];
        var domMethod = ['buildingStructure', 'cityPicker', 'datetimePicker'];

        $.each(domType,function(idxa, valb){
             var domT = domType[idxa];
             $.each(domMethod,function(idxc, vald){
                   var domM = domMethod[idxc];
                   var domN = domT + '[data-method='+ domM +']';

                   tool.dynamicallyCallPlugin(domMethod[idxc], domN, function(){
                        if(domM === "datetimepicker"){
                                 // callbacks
                        }
                   });
             });
        });
    })

})();
