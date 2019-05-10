;(function(global,factory,plug){
    return factory.call(global,global.jQuery,plug);
})(this,function($,validator){
    // this -> window
    // $ -> jQuery
    // jquery 插件的标准写法，
    // $.fn.bootstrapValidator = function(){}

    // 默认值
    var __DEFS__ = {
        raise: "change",//表单校验的触发事件
        errorMsg: "* 校验失败",
        extendRules: function(rules){
            $.extend(__RULES__,rules);
        }
    };
    // 规则引擎模板
    var __RULES__ = {
        "require": function(){
            var val = this.val();
            return val != "" && val != undefined && val != null;
        },//必填项
        "email": function(){
            var val = this.val();
            return /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/.test(val);
        },//邮箱
        "mobile":function(){
            var val = this.val();
            return /^1[34578]\d{9}$/.test(val);
        },//手机号
        "number": function(){
            var val = this.val();
            return /^[0-9]*[1-9][0-9]*$/.test(val);
        },//数字
        "regex": function(regex){
            var val = this.val();
            return new RegExp(regex).test(val);
        },//正则表达式
    }

    // 名字可以当做参数传进来,方便以厚修改
    $.fn[validator] = function(ops){
        // console.log(this); this指向当前的表单对象
        var that = this;
        if(that.is("form")){

            // 拿到form表单对象中的所有input select textarea等元素，过滤掉submit,button,reset,image的input
            that.$fields = that.find("input,select,textare").not("input[type=submit],input[type=button],input[type=reset],input[type=image]");

            // 先把__DEFS__中的所有属性加入到表单对象中，再把ops中的所有属性加入，如果ops中有就读取ops中的值，若没有设置就读取默认值
            $.extend(that,__DEFS__,ops);//扩展属性和功能，参数加入的先后顺序依次加入

        
            // 添加事件触发表单校验
            that.$fields.on(that.raise,function(){
                var $field = $(this); // 目标对象【jquery对象】
                var config; //规则  
                var error; //错误信息
                var __err__ = true; // 校验结果，默认为true
                var $group = $field.parents(".form-group");//父元素
                $group.removeClass("has-success has-error");//每次都初始化父元素的class
                $group.find(".help-block").remove();// 每次都移除提示信息
                $.each(__RULES__,function(rule,valid){ // rule -> 规则   valid -> 校验器
                    config = $field.data("bv-"+rule);
                    if(config){ //当前元素存在该规则
                        __err__ = valid.call($field,config);
                        $group.addClass(__err__?"has-success":"has-error");//根据校验结果显示
                        if(!__err__){// 校验失败时添加提示信息
                            error = $field.data("bv-" + rule + "-error") || that.errorMsg;
                            $field.after('<span class="help-block">'+ error +'</span>');
                        }
                        return __err__;// 当有多个规则时，有一个失败不接着执行
                    }
                });
            });
           
        }else{
            throw new Error("type error[require form tag]");
        }
        return this;
    }
    
},"bootstrapValidator")