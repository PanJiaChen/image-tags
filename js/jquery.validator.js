//验证
function validator(v) {
    function formCheck(v) {
        var errors = [];
        if (v.validType == 'maxSelected') {
            var result = validMethods[v.validType](v);
            if (!result.isValid) {
                errors.push({
                    msg: result.msg
                })
            }
        }

        return {
            isValid: (errors == 0),
            errors: errors
        }
    }

    $('body').find('.validator-err-tip').remove();
    var validator = formCheck(v);
    if (!validator.isValid) {
        validator.errors.forEach(function (errors) {
            showRemind(errors.msg)
        });
        return false;
    }
    return true;
}

function showRemind(msg) {
    var $target = $('body').find('.validator-err-tip');
    if ($target.length > 0) {
        $target.append('<div class="mpl-err-tip">' + msg + '</div>')
    } else {
        $('body').append('<div class="validator-err-tip"><div class="mpl-err-tip">' + msg + '</div></div>')
    }
    setTimeout(function () {
        $('body').find('.validator-err-tip').fadeOut(400);
    }, 3000)
}

var validMethods = {
    require: function (val) {
        if (val.length > 0) {
            return {
                isValid: true
            }
        } else {
            return {
                isValid: false,
                msg: ' 填写格式不对'
            }
        }
    },
    maxSelected: function (v) {
        var choiceLength = 0;
        var arr = v.$target.find('input[type=checkbox]')
        arr.map(function (index, elem) {
            if ($(elem).prop('checked')) {
                choiceLength++
            }
        });
        if (choiceLength > v.maxSelected) {
            return {
                isValid: false,
                msg: ' 选择项不能多于' + v.maxSelected
            }
        } else {
            return {
                isValid: true
            }
        }
    }
}