/* ProductSwatches */
(function (jQuery) {
    jQuery.ProductSwatches = function (element, options, $) {
        var defaults = {
            id: 15,
            items: ".gf_product-swatches--item",
            input: ".gf_swatches--input",
            select: ".gf_swatches--select",
        };
        this.settings = {};

        var $element = jQuery(element);
        var _this = this;

        this.init = function () {
            this.settings = jQuery.extend({}, defaults, options);

            _this.event();
            _this.listen();
        }

        this.event = function () {
            var productJson = jQuery("#ProductJson-" + _this.settings.id).text();

            if (productJson) {
                try {
                    productJson = JSON.parse(productJson);
                    var variants = productJson.variants;


                    var $select = $element.find(_this.settings.select);
                    $select.on("click.select", function () {
                        var $el = jQuery(this);
                        if (!$el.hasClass("gf_soldout")) {
                            var name = $el.attr("data-name");
                            var value = $el.attr("data-value");

                            // Update active
                            var $selector = $element.find(_this.settings.select + '[data-name="' + name + '"]');
                            if ($selector && $selector.length) {
                                $selector.removeClass("gf_active");
                            }
                            $el.addClass("gf_active");

                            var $actives = $element.find(_this.settings.select + '.gf_active');
                            var values = []
                            if ($actives && $actives.length) {
                                for (let i = 0; i < $actives.length; i++) {
                                    var value = jQuery($actives[i]).attr("data-value");
                                    values.push(value);
                                }
                            }

                            var currentVariant = {};
                            if (values && values.length) {
                                values = values.join(",");
                                for (var i = 0; i < variants.length; i++) {
                                    var variant = variants[i];
                                    var options = variant.options.join(",");
                                    if (values == options) {
                                        currentVariant = variant;
                                        break;
                                    }
                                }
                            }
                            if (!jQuery.isEmptyObject(currentVariant)) {
                                var $input = $element.find(_this.settings.input)
                                $input.attr("value", currentVariant.id).val(currentVariant.id);

                                var currentURL = window.location.href;
                                var variantURL = _this.updateUrlParameter(currentURL, 'variant', currentVariant.id);
                                window.history.pushState({}, "", variantURL);

                                var store = window.store;
                                store.update("variant" + _this.settings.id, currentVariant);
                            }
                        }
                    });
                } catch (e) {
                    console.log(e)
                }
            }
        }
        this.listen = function () {
            var store = window.store;
            store.change("variant" + _this.settings.id, function (variant) {
                if (variant.options && variant.options.length) {
                    variant.options.forEach(function (option, i) {
                        if (option) {
                            var $item = $element.find(_this.settings.items + '[data-index="' + i + '"]');
                            if ($item && $item.length) {
                                var $selectActive = $item.find(_this.settings.select + '[data-value="' + option + '"]');
                                var $select = $item.find(_this.settings.select);
                                if ($select && $select.length && $selectActive && $selectActive.length) {
                                    $select.removeClass("gf_active");
                                    $selectActive.addClass("gf_active");
                                }
                            }
                        }
                    })
                }
            });
        }
        this.updateUrlParameter = function (url, key, value) {
            var parser = document.createElement('a');
            parser.href = url;

            var newUrl = parser.protocol + '//' + parser.host + parser.pathname;

            // has parameters ?
            if (parser.search && parser.search.indexOf('?') !== -1) {
                // parameter already exists
                if (parser.search.indexOf(key + '=') !== -1) {
                    // paramters to array
                    var params = parser.search.replace('?', '');
                    params = params.split('&');

                    params.forEach(function (param, i) {
                        if (param.indexOf(key + '=') !== -1) {
                            if (value !== null) params[i] = key + '=' + value;
                            else delete params[i];
                        }
                    });
                    if (params.length > 0) newUrl += '?' + params.join('&');
                } else if (value !== null) newUrl += parser.search + '&' + key + '=' + value; // append new parameter
                else newUrl += parser.search; // skip the value (remove)
            } else if (value !== null) newUrl += '?' + key + '=' + value; // no parameters, create it

            newUrl += parser.hash;
            return newUrl;
        }
        this.init();
    }

    jQuery.fn.ProductSwatches = function (options) {
        return this.each(function () {
            if (undefined == jQuery(this).data('productswatches')) {
                var plugin = new jQuery.ProductSwatches(this, options, jQuery);
                jQuery(this).data('productswatches', plugin)
            }
        });
    }
})(jQuery);

$(document).ready(function () {
    var $section_15 = jQuery(".gf_section-15");
    if ($section_15 && $section_15.length) {
        var $swatches = $section_15.find(".gf_product-swatches")
        if ($swatches && $swatches.length > 0) {
            $swatches.ProductSwatches({
                id: 15
            })
        }
    }
})