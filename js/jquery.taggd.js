(function ($) {
    'use strict';

    var defaults = {
        edit: false,

        align: {
            x: 'center',
            y: 'center'
        },

        handlers: {},

        offset: {
            left: 0,
            top: 0
        },

        strings: {
            save: '&#x2713;',
            delete: '&#x00D7;',
            addLink: '&#64;'
        }
    };

    var methods = {
        show: function () {
            var $this = $(this);
            var $label = $this.next();

            $this.addClass('active');
            $label.addClass('show').find('input').focus();
        },

        hide: function () {
            var $this = $(this);

            $this.removeClass('active');
            $this.next().removeClass('show');
        },

        toggle: function () {
            var $hover = $(this).next();

            if ($hover.hasClass('show')) {
                methods.hide.call(this);
            } else {
                methods.show.call(this);
            }
        }
    };


    /****************************************************************
     * TAGGD
     ****************************************************************/

    var Taggd = function (element, options, data) {
        var _this = this;

        if (options.edit) {
            options.handlers = {
                click: function () {
                    _this.hide();
                    methods.show.call(this);
                }
            };
        }

        this.element = $(element);
        this.options = $.extend(true, {}, defaults, options);
        this.data = data;
        this.initialized = false;

        if (!this.element.height() || !this.element.width()) {
            this.element.on('load', _this.initialize.bind(this));
        } else this.initialize();
    };


    /****************************************************************
     * INITIALISATION
     ****************************************************************/

    Taggd.prototype.initialize = function () {
        var _this = this;

        this.initialized = true;

        this.initWrapper();

        if (this.data.length > 0) {
            this.renderTags();
        }

        if (this.options.edit) {
            this.element.on('click', function (e) {
                var poffset = $(this).parent().offset(),
                    x = (e.pageX - poffset.left) / _this.element.width(),
                    y = (e.pageY - poffset.top) / _this.element.height();

                _this.addData({
                    x: x,
                    y: y,
                    text: ''
                });

                _this.show(_this.data.length - 1);
            });
        }

        $(window).resize(function () {
            _this.updateDOM();
        });
    };

    Taggd.prototype.initWrapper = function () {
        var wrapper = $('<div class="taggd-wrapper" />');
        this.element.wrap(wrapper);

        this.wrapper = this.element.parent('.taggd-wrapper');
    };


    Taggd.prototype.clear = function () {
        if (!this.initialized) return;
        this.wrapper.find('.taggd-item, .taggd-item-hover').remove();
    };

    Taggd.prototype.on = function (event, handler) {
        if (
            typeof event !== 'string' ||
            typeof handler !== 'function'
        ) return;

        this.element.on(event, handler);
    };


    /****************************************************************
     * TAGS MANAGEMENT
     ****************************************************************/

    Taggd.prototype.iterateTags = function (a, yep) {
        var func;

        if ($.isNumeric(a)) {
            func = function (i, e) {
                return a === i;
            };
        } else if (typeof a === 'string') {
            func = function (i, e) {
                return $(e).is(a);
            }
        } else if ($.isArray(a)) {
            func = function (i, e) {
                var $e = $(e);
                var result = false;

                $.each(a, function (ai, ae) {
                    if (
                        i === ai ||
                        e === ae ||
                        $e.is(ae)
                    ) {
                        result = true;
                        return false;
                    }
                });

                return result;
            }
        } else if (typeof a === 'object') {
            func = function (i, e) {
                var $e = $(e);
                return $e.is(a);
            };
        } else if ($.isFunction(a)) {
            func = a;
        } else if (!a) {
            func = function () {
                return true;
            }
        } else return this;

        this.wrapper.find('.taggd-item').each(function (i, e) {
            if (typeof yep === 'function' && func.call(this, i, e)) {
                yep.call(this, i, e);
            }
        });

        return this;
    };

    Taggd.prototype.show = function (a) {
        return this.iterateTags(a, methods.show);
    };

    Taggd.prototype.hide = function (a) {
        return this.iterateTags(a, methods.hide);
    };

    Taggd.prototype.toggle = function (a) {
        return this.iterateTags(a, methods.toggle);
    };


    /****************************************************************
     * DATA MANAGEMENT
     ****************************************************************/

    Taggd.prototype.addData = function (data) {
        if ($.isArray(data)) {
            this.data = $.merge(this.data, data);
        } else {
            this.data.push(data);
        }

        if (this.initialized) {
            this.renderTags();
            this.element.triggerHandler('change');
        }
    };


    Taggd.prototype.clear = function () {
        if (!this.initialized) return;
        this.wrapper.find('.taggd-item, .taggd-item-hover').remove();
    };


    /****************************************************************
     * TAG DOM
     ****************************************************************/

    Taggd.prototype.renderTags = function () {
        console.log('renderTags');
        var _this = this;

        this.clear();
        this.element.css({height: 'auto', width: 'auto'});

        $.each(this.data, function (i, v) {
            var $item = $('<span />');
            var $hover;

            $item.attr({
                'data-x': v.x,
                'data-y': v.y
            });

            $item.css('position', 'absolute');
            $item.addClass('taggd-item');

            _this.wrapper.append($item);

            if (typeof v.text === 'string' && (v.text.length > 0 || _this.options.edit)) {
                $hover = $('<span class="taggd-item-hover show complete" style="position: absolute;" />').html(v.text);

                $hover.attr({
                    'data-x': v.x,
                    'data-y': v.y
                });

                _this.wrapper.append($hover);
            }

            if (typeof _this.options.handlers === 'object') {
                $.each(_this.options.handlers, function (event, func) {
                    var handler;

                    if (typeof func === 'string' && methods[func]) {
                        handler = methods[func];
                    } else if (typeof func === 'function') {
                        handler = func;
                    }

                    $item.on(event, function (e) {
                        if (!handler) return;
                        handler.call($item, e, _this.data[i]);
                    });
                });
            }
        });

        this.element.removeAttr('style');

        if (this.options.edit) {
            this.renderEditTags();
        }

        this.updateDOM();
    };


    Taggd.prototype.renderEditTags = function () {
        var _this = this;

        this.wrapper.find('.taggd-item-hover').each(function () {
                var $e = $(this);
                var $input = $('<input type="text" />').val($e.text());
                var $button_ok = $('<button />').html(_this.options.strings.save);
                var $button_delete = $('<button />').html(_this.options.strings.delete);
                var $button_link = $('<button />').html(_this.options.strings.addLink);

                $button_ok.on('click', function () {
                    $e.addClass('complete');
                });

                $button_link.on('click', function () {
                    
                });

                $button_delete.on('click', function () {
                    var x = $e.attr('data-x');
                    var y = $e.attr('data-y');

                    _this.data = $.grep(_this.data, function (v) {
                        return v.x != x || v.y != y;
                    });

                    _this.renderTags();
                    $(_this.element).trigger('change');
                });

                $input.on('change', function () {
                    var x = $e.attr('data-x'),
                        y = $e.attr('data-y'),
                        item = $.grep(_this.data, function (v) {
                            return v.x == x && v.y == y;
                        }).pop();

                    if (item) {
                        item.text = $input.val();
                    }

                    _this.renderTags();
                    $(_this.element).trigger('change');
                });

                $input.on('focus', function () {
                    $e.removeClass('complete');
                });

                $e.empty().append($input, $button_ok, $button_delete, $button_link);
            }
        );
    }
    ;

    Taggd.prototype.updateDOM = function () {
        console.log('update');
        var _this = this;

        this.wrapper.removeAttr('style').css({
            height: this.element.height(),
            width: this.element.width()
        });

        this.wrapper.find('span').each(function (i, e) {
            var $el = $(e);

            var left = $el.attr('data-x') * _this.element.width();
            var top = $el.attr('data-y') * _this.element.height();

            if ($el.hasClass('taggd-item')) {
                $el.css({
                    left: left - $el.outerWidth(true) / 2,
                    top: top - $el.outerHeight(true) / 2
                });
            } else if ($el.hasClass('taggd-item-hover')) {
                if (_this.options.align.x === 'center') {
                    left -= $el.outerWidth(true) / 2;
                } else if (_this.options.align.x === 'right') {
                    left -= $el.outerWidth(true);
                }

                if (_this.options.align.y === 'center') {
                    top -= $el.outerHeight(true) / 2;
                } else if (_this.options.align.y === 'bottom') {
                    top -= $el.outerHeight(true);
                }

                $el.attr('data-align', $el.outerWidth(true));

                $el.css({
                    left: left + _this.options.offset.left,
                    top: top + _this.options.offset.top
                });
            }
        });
    };


    /****************************************************************
     * JQUERY LINK
     ****************************************************************/

    $.fn.taggd = function (options, data) {
        return new Taggd(this, options, data);
    };
})
(jQuery);