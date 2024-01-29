<!--textarea高度自适应-->

    $(function () {
        $('.content').flexText();
    });

//点击隐藏显示
// $( '.pl_button' ).on( 'click', function( e ) {
//     $( '.reviewArea' ).toggle();
// } );

<!--textarea限制字数-->
    function keyUP(t){
        var len = $(t).val().length;
        if(len > 139){
            $(t).val($(t).val().substring(0,140));
        }
    }
    <!--点击评论创建评论条-->
    $('.commentAll').on('click','.plBtn',function(){
        var myDate = new Date();
        //获取当前年
        var year=myDate.getFullYear();
        //获取当前月
        var month=myDate.getMonth()+1;
        //获取当前日
        var date=myDate.getDate();
        var h=myDate.getHours();       //获取当前小时数(0-23)
        var m=myDate.getMinutes();     //获取当前分钟数(0-59)
        if(m<10) m = '0' + m;
        var s=myDate.getSeconds();
        if(s<10) s = '0' + s;
        var now=year+'-'+month+"-"+date+" "+h+':'+m+":"+s;
        //获取输入内容
        var oSize = $(this).siblings('.flex-text-wrap').find('.comment-input').val();
        console.log(oSize);
        //动态创建评论模块
        oHtml = '<div class="comment-show-con clearfix"><div class="comment-show-con-img pull-left">' +
            '<img src="images/header-img-comment_03.png" alt=""></div> ' +
            '<div class="comment-show-con-list pull-left clearfix">' +
            '<div class="pl-text clearfix"> <a href="#" class="comment-size-name">评论用户网名 : </a> ' +
            '<span class="my-pl-con">&nbsp;'+ oSize +'</span> </div> <div class="date-dz"> ' +
            '<span class="date-dz-left pull-left comment-time">'+now+'</span> ' +
            '<div class="date-dz-right pull-right comment-pl-block">'  +
            '<a href="javascript:;" class="date-dz-z pull-left">' +
            '<i class="date-dz-z-click-red"></i>赞 (<i class="z-num">6</i>)</a> ' +
            '</div> </div><div class="hf-list-con">' +
            '</div></div> </div>';
        if(oSize.replace(/(^\s*)|(\s*$)/g, "") != ''){
            $(this).parents('.reviewArea ').siblings('.comment-show').prepend(oHtml);
            $(this).siblings('.flex-text-wrap').find('.comment-input').prop('value','').siblings('pre').find('span').text('');
        }
    });

<!--点赞-->
    $('.comment-show').on('click','.date-dz-z',function(){
        var zNum = $(this).find('.z-num').html();
        if($(this).is('.date-dz-z-click')){
            zNum--;
            $(this).removeClass('date-dz-z-click red');
            $(this).find('.z-num').html(zNum);
            $(this).find('.date-dz-z-click-red').removeClass('red');
        }else {
            zNum++;
            $(this).addClass('date-dz-z-click');
            $(this).find('.z-num').html(zNum);
            $(this).find('.date-dz-z-click-red').addClass('red');
        }
    })