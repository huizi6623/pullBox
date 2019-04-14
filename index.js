$(function(){
    Game.init($('#container')) ;
}) ;

var Game = {
    num: 0,
    gk: [
        {
            map: [
                1,1,2,2,2,1,1,1,
                1,1,2,3,2,1,1,1,
                1,1,2,0,2,2,2,2,
                2,2,2,0,0,0,3,2,
                2,3,0,0,0,2,2,2,
                2,2,2,2,0,2,1,1,
                1,1,1,2,3,2,1,1,
                1,1,1,2,2,2,1,1
            ],
            box: [
                {x: 4, y:3},
                {x: 4, y:5},
                {x: 3, y:4},
                {x: 3, y:3},
            ],
            person: {x: 4, y: 4}
        },
        {
            map: [
                1,1,2,2,2,2,1,1,
                1,1,2,3,3,2,1,1,
                1,2,2,0,3,2,2,1,
                1,2,0,0,0,3,2,1,
                2,2,0,0,0,0,2,2,
                2,0,0,2,0,0,0,2,
                2,0,0,0,0,0,0,2,
                2,2,2,2,2,2,2,2,
            ],
            box: [
                {x: 4, y:3},
                {x: 3, y:4},
                {x: 4, y:5},
                {x: 5, y:5},
            ],
            person: {
                x: 3,
                y: 6
            }
        },
        {
            map: [
                1,1,1,1,2,2,2,2,2,2,2,1,
                1,1,1,1,2,0,0,2,0,0,2,1,
                1,1,1,1,2,0,0,0,0,0,2,1,
                2,2,2,2,2,0,0,2,0,0,2,1,
                3,3,3,2,2,2,0,2,0,0,2,2,
                3,0,0,2,0,0,0,0,2,0,0,2,
                3,0,0,0,0,0,0,0,0,0,0,2,
                3,0,0,2,0,0,0,0,2,0,0,2,
                3,3,3,2,2,2,0,2,0,0,2,2,
                2,2,2,2,2,0,0,0,0,0,2,1,
                1,1,1,1,2,0,0,2,0,0,2,1,
                1,1,1,1,2,2,2,2,2,2,2,1
            ],
            box: [
                {x: 5, y: 6},
                {x: 6, y: 3},
                {x: 6, y: 5},
                {x: 6, y: 7},
                {x: 6, y: 9},
                {x: 7, y: 2},
                {x: 8, y: 2},
                {x: 9, y: 6},
            ],
            person: {x: 5, y: 9}
        }
    ],
    init: function(container){  //初始化
        this.container = container ;
        this.createMap(this.num) ;
        this.initSelect() ;
    },
    createMap: function(iNow){   //创建地图
        this.container.empty() ;
        document.title = '第' + parseInt(iNow+1) + '关' ;
        this.nowJson = this.gk[iNow] ;
        var _this = this ;
        this.container.css('width', Math.sqrt(this.nowJson.map.length) * 50) ;
        $.each(this.nowJson.map, function(i, elem){
            _this.container.append('<div class="pos' + elem + '"></div>') ;
        }) ;
        this.createBox() ;
        this.createPerson() ;
    },
    createBox: function(){ //创建箱子
        var _this = this ;
        $.each(this.nowJson.box, function(i, elem){
            var oBox = $('<div class="box"></div>') ;
            oBox.css({
                'left': elem.x * 50,
                'top': elem.y * 50
            }) ;
            _this.container.append(oBox) ;
        })
    },
    createPerson: function(){  //创建人物
        var oPerson = $('<div class="person"></div>') ;
        oPerson.css({
            'left': this.nowJson.person.x * 50,
            'top': this.nowJson.person.y * 50
        }) ;
        oPerson.data('x', this.nowJson.person.x) ;
        oPerson.data('y', this.nowJson.person.y) ;
        this.container.append(oPerson) ;
        this.bindPerson(oPerson) ;
    },
    bindPerson: function(oPerson){  //绑定任务动作
        var _this = this ;
        $(document).keydown(function(e){
            switch(e.which){
                case 37:   //左
                    _this.runPerson(oPerson, {x: -1}) ;
                    break ;
                case 38:   //上
                    _this.runPerson(oPerson, {y: -1}) ;
                    break ;
                case 39:  //右
                    _this.runPerson(oPerson, {x: 1}) ;
                    break ;
                case 40:  //下
                    _this.runPerson(oPerson, {y: 1}) ;
                    break ;
            }
        })
    },
    runPerson: function(oPerson, option){
        var _this = this ;

        var stepX = option.x || 0 ;
        var stepY = option.y || 0 ;

        //修改人的位置
        if(this.nowJson.map[(oPerson.data('y') + stepY)*Math.sqrt
        (this.nowJson.map.length) + oPerson.data('x') + stepX] != 2){
            oPerson.data('x', oPerson.data('x') + stepX) ;
            oPerson.data('y', oPerson.data('y') + stepY) ;
            oPerson.css({
                'left': oPerson.data('x') * 50,
                'top': oPerson.data('y') * 50,
            }) ;
            $('.box').each(function(i, elem){
                //推箱子走
                if(_this.pz(oPerson, $(elem)) && _this.nowJson.map[(oPerson.data('y') + stepY)*Math.sqrt
                (_this.nowJson.map.length) + oPerson.data('x') + stepX] != 2){
                    $(elem).css({
                        'left': (oPerson.data('x') + stepX) * 50 ,
                        'top': (oPerson.data('y') + stepY) * 50
                    }) ;

                    //推两个箱子时推不动
                    $('.box').each(function(j, elem2){
                        if(_this.pz($(elem), $(elem2)) && elem != elem2){
                            $(elem).css({
                                'left': (oPerson.data('x')) * 50 ,
                                'top': (oPerson.data('y')) * 50
                            }) ;
                            oPerson.data('x', oPerson.data('x') - stepX) ;
                            oPerson.data('y', oPerson.data('y') - stepY) ;
                            oPerson.css({
                                'left': oPerson.data('x') * 50,
                                'top': oPerson.data('y') * 50,
                            }) ;
                        }
                    })
                }
                //推到墙时推不动
                else if(_this.pz(oPerson, $(elem))){
                    oPerson.data('x', oPerson.data('x') - stepX) ;
                    oPerson.data('y', oPerson.data('y') - stepY) ;
                    oPerson.css({
                        'left': oPerson.data('x') * 50,
                        'top': oPerson.data('y') * 50,
                    }) ;
                }
            })
        }
        this.nextShow() ;
    },
    nextShow: function(){
        var _this = this ;
        var num = 0 ;
        $('.pos3').each(function(i, elem){
            $('.box').each(function(j, elem2){
                if(_this.pz($(elem), $(elem2))){
                    num ++ ;
                }
            })
        }) ;
        if(num == $('.box').length){
            this.num ++ ;
            if(this.num >= this.gk.length){
                alert('恭喜您通关了！') ;
            } else {
                this.createMap(this.num) ;
                console.log(this.num) ;
                $('#select select')[0].selectedIndex = this.num;
            }
        }
    },
    pz: function(obj1, obj2){     //碰撞检测
        var L1 = obj1.offset().left ;
        var R1 = obj1.offset().left + obj1.width() ;
        var T1 = obj1.offset().top ;
        var B1 = obj1.offset().top + obj1.height() ;

        var L2 = obj2.offset().left ;
        var R2 = obj2.offset().left + obj2.width() ;
        var T2 = obj2.offset().top ;
        var B2 = obj2.offset().top + obj2.height() ;

        if(L1 >= R2 || R1 <=L2 || B1 <= T2 || T1 >=B2){
            return false ;
        } else {
            return true ;
        }
    },
    initSelect: function(){ //游戏难度切换
        var _this = this ;
        var select = $('#select select') ;
        select.change(function(e){
            _this.num = this.selectedIndex ;
            _this.createMap(_this.num) ;
        })
    }
} ;