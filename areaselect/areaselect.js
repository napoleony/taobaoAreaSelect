(function($) {

    $.extend({

        areaSelect: function(obj) {
            var obj = $(obj);
            $.init(obj);
            $.clickLoad(obj);
        },

        //点击加载
        clickLoad: function(obj) {

            obj.find('.country-select').click(function (e) {
                e.stopPropagation();
                $(this).find('.country-list').toggle(0);
                $(this).find('.city-select-wrap').hide(0);
            });

            $(document).click(function (e) {
                e.stopPropagation()
                obj.find('.country-list').hide(0);
                obj.find('.city-select-wrap').hide(0);
                obj.find('.overseas-box').hide(0);
            });

            obj.find('.country-list>li').click(function () {
                $.init(obj);

                var locat = parseInt($(this).find('a').attr('data-value'));

                obj.find('.location-box').hide(0);

                $(this).siblings('li').removeClass('current');
                $(this).addClass('current');
                obj.find('.country-now').html($(this).find('a').html());
                obj.find('.country').val($(this).find('a').html());

                if (locat != 0) {
                    obj.find('.location-box').show(0);
                    obj.find('.location-box').html($.addLocation(locat));
                }


                //数据获取
                //省份
                if (locat == 1) {
                    //点击弹出地址选择
                    obj.find('.city-title').click(function (e) {
                        e.stopPropagation()
                        $(this).next('.city-select-wrap').toggle(0);
                        obj.find('.country-list').hide(0);
                    });

                    $.getJSON('areaselect/country.json',function(data){
                        var country =  JSON.parse(JSON.stringify(data));
                        $.each(country, function (name, value) {
                            var city_box = '';
                            var str = '';
                            for (i in value) {
                                str +=  '<a data-value="' + i + '" href="javascript:void(0);">' + value[i] + '</a>'
                            }

                            city_box = '<dl class="city-box">' +
                                            '<dt>' + name + '</dt>' + 
                                            '<dd>' + str + '</dd>' +
                                            '</dl>';
                            obj.find('.city-select.city-province').append(city_box);

                        });
                        $.areaList('province', obj);
                        $.tabChange(obj);
                    });
                } else {
                    //点击弹出地址选择
                    obj.find('.city-title').click(function (e) {
                        e.stopPropagation()
                        $(this).next('.overseas-box').toggle(0);
                        obj.find('.country-list').hide(0);
                    });
                    $.loadOther(obj);
                    
                }

            });


        },

        //初始化
        init: function(obj) {
            obj.find('.province').val('');
            obj.find('.city').val('');
            obj.find('.county').val('');
            obj.find('.town').val('');
        },

        //初始框架
        addLocation: function(locat) {
            var str = '';
            var strtab = '';
            switch (locat) {
                case 0:
                    break;
                case 1:
                    str += '<div class="city-title"><span>请选择省市区</span></div>';
                    strtab = '<div class="city-select-tab">'+
                           '<a class="a-province current" href="javascript:void(0)">省份</a>'+
                           '<a class="a-city" href="javascript:void(0)">城市</a>'+
                           '<a class="a-county" href="javascript:void(0)">县区</a>'+
                           '<a class="a-town" href="javascript:void(0)">街道</a>'+
                       '</div>';
                    str += '<div class="city-select-wrap">'+ strtab +
                               '<div class="city-select-content">' +
                                    '<div class="city-select city-province">' +
                                    '</div>' + 
                                    '<div class="city-select city-city">' +
                                    '</div>' +
                                    '<div class="city-select city-county">' +
                                    '</div>' +
                                    '<div class="city-select city-town">' +
                                    '</div>' +
                                '</div>';
                    break;
                case 2:
                    str += '<div class="city-title"><span>请选择国家</span></div><div class="overseas-box"></div>';
                    break;
                default: 
                    return '<span>输入有误！</span>';
            };
            return str;
        },
        //tab切换
        tabChange: function(obj) {
            obj.find('.city-select-tab').find('a').click(function (e) {
                e.stopPropagation()
                var index = $(this).index();
                $(this).siblings().removeClass('current');
                $(this).addClass('current');

                obj.find('.city-select').hide(0);
                switch (index) {
                    case 0:
                        obj.find('.city-province').show(0);
                        break;
                    case 1:
                        obj.find('.city-city').show(0);
                        break;
                    case 2:
                        obj.find('.city-county').show(0);
                        break;
                    case 3:
                        obj.find('.city-town').show(0);
                        break;
                    default:
                        return 0;
                }
            });
        },

        //地址列表点击事件
        areaList: function(area, obj) {
            obj.find('.city-' + area + ' .city-box').find('dd>a').click(function (e) {
                e.stopPropagation();
                var str = '';
                var output = {
                    province: obj.find('.province'),
                    city: obj.find('.city'),
                    county: obj.find('.county'),
                    town: obj.find('.town')
                }

                if (area == 'town') {
                    obj.find('.city-select-wrap').hide(0);
                }
                obj.find('.city-select').hide(0);
                obj.find('.city-' + area).next().show(0);
                $(this).parents('.city-select').find('.current').removeClass('current');
                $(this).addClass('current');
                if (!!(obj.find('.city-select-tab').find('.a-' + area).next().get(0))) {
                    obj.find('.city-select-tab').find('a').removeClass('current');
                    obj.find('.city-select-tab').find('.a-' + area).next().addClass('current');
                }

                obj.find('.' + area).val($(this).html());
                switch (area) {
                    case 'province':
                        output.city.val('');
                    case 'city':
                        output.county.val('');
                    case 'county':
                        output.town.val('');
                    case 'town':
                        break;
                    default:
                        return 0;
                }

                $.loadArea(area, $(this), obj);

                if (!!output.province.val())
                    str += output.province.val() + '<span>/</span>';
                if (!!output.city.val()) {
                    if (!(output.city.val() == '市辖区' || output.city.val() == '县')) {
                        str += output.city.val() + '<span>/</span>';
                    }
                }
                if (!!output.county.val())
                    if (!(output.county.val() == '市辖区')) {
                        str += output.county.val() + '<span>/</span>';
                    }
                if (!!output.town.val())
                    str += output.town.val();
                obj.find('.city-title').html(str);
            });
        },

        //载入地址列表
        loadArea: function(area, _this, obj) {
            var main = _this.attr('data-value');
            var mainkey = main.replace('CN','0');
            var areaNext = '';
            var areaJson = '';
            if (area == 'province') {
                areaNext = 'city';
            }
            if (area == 'city') {
                areaNext = 'county';
            }
            if (area == 'county') {
                areaNext = 'town';
            }
            if (area == 'town') {
                areaNext = ('town');
            }

            areaJson = 'areaselect/area_json/area'+(mainkey%110)+'.json';

            $.getJSON(areaJson,function(data){
                var parents =  JSON.parse(JSON.stringify(data));
                var son_json =  parents[main];
                var city_box = '';
                var str = '';

                if (!!son_json) {
                    for (i in son_json) {
                        str +=  '<a data-value="' + i + '" href="javascript:void(0);">' + son_json[i] + '</a>'
                    };
                    city_box = '<dl class="city-box city-select-'+areaNext+'">' +
                                   '<dd>' + str + '</dd>' +
                               '</dl>';
                    obj.find('.city-select.city-'+areaNext).html(city_box);

                    $.areaList(areaNext, obj);
                } else {
                    obj.find('.city-select-wrap').hide(0);
                }
            });
        },

        //其他国家
        loadOther: function (obj) {
            $.getJSON('areaselect/other.json',function(data){
                var json_data =  JSON.parse(JSON.stringify(data));
                var str = '';
                str = '<li class="current"><i>&radic;</i><a href="javascript:void(0);">请选择国家</a></li>';
                for (i in json_data) {
                    str +=  '<li><i>&radic;</i><a href="javascript:void(0);">' + json_data[i] + '</a></li>'
                };
                str = '<ul class="overseas-list">' + str + '</ul>';
                obj.find('.overseas-box').html(str);

                obj.find('.overseas-list>li').click(function () {
                    $.init(obj);
                    $(this).siblings('.current').removeClass('current');
                    $(this).addClass('current');
                    obj.find('.country').val($(this).find('a').text());
                    obj.find('.city-title').html($(this).find('a').text());
                });
            });
        }


    });

})(jQuery); 

