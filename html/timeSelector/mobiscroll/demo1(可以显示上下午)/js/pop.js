$(function($){
  $.fn.extend({
    Pops:function(opt){
            var dj_H = $(window).height(),
                dj_W = $(window).width(),
                Pops_Name = opt.PopName,
                Pops_Close = opt.closeName,
                center_h = (dj_H - $(Pops_Name).height())/2,
                center_w = (dj_W - $(Pops_Name).width())/2,
                PopsBg = $('<div class="PopsBg"></div>');
				$('body').append(PopsBg);
                $('.PopsBg').css({
					width:'100%',
					height:'100%',
					position:'absolute',
					   left :'0',
					top :'0',
					background:'black',
					'z-index':'1000',
					opacity:'0.5'
                }).height($(document).height());
                
            $(Pops_Name).css({
                'top':center_h + $(window).scrollTop(),
                'left':center_w
            }).show();
            
            if(Pops_Close){
                $(Pops_Close,Pops_Name).click(function(){
                     $(Pops_Name).hide();
                     $('.PopsBg').remove();
                 }) 
            }   
            $(window).scroll(function(){
                    var center_T = $(window).scrollTop();
                    $(Pops_Name).css({
                    'top':center_h + center_T
                })
            })
            $(window).resize(function(){
                $(Pops_Name).css({
                    'top':($(window).height() - $(Pops_Name).height())/2+$(window).scrollTop(),
                    'left':($(window).width() - $(Pops_Name).width())/2
                })
            })
            
    }//function
  })//end
})