var MiradorDisableZoom = {

    // TODO: add more locales
    locales: {
        en: {
            translation: {
                'button-tooltip': 'Disable zoom controls on this window'
            }
        }
    },

    template: Mirador.Handlebars.compile([
        '<a href="javascript:;" class="mirador-btn mirador-icon-disable-zoom contained-tooltip" title="{{t "button-tooltip"}}">',
            '<i class="fa fa-search fa-lg fa-fw"></i>',
            '<i class="fa fa-lock"></i>',
        '</a>'
    ].join('')),

    init: function() {
        var _this = this;

        i18next.on('initialized', function() {
            for (var locale in _this.locales) {
                // add translations from each locale
                var ns = 'translation';
                i18next.addResourceBundle(locale, ns, _this.locales[locale][ns], true, true);
            };
        });

        /*
         * Mirador.Window
         */
        (function() {

            /* 0. Declare variables for the constructor and any methods that we'll override. */

            var constructor = Mirador.Window,
                listenForActions = Mirador.Window.prototype.listenForActions;

            /* 1. Override methods and register (and document!) new ones. */

            Mirador.Window.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('focusUpdated' + this.id, function(event, focusState) {
                    // triggered when toggling viewing states or changing the current canvas
                    // a new OSD will be created, so just de-select the button
                    _this.element.find('.mirador-icon-disable-zoom').removeClass('selected');
                });
            };

            /*
            * Mirador.Window.prototype.toggleZoomLock
            *
            * Disables or enables this window's zoom controls.
            * @param {Object} linkElement
            *   The <a> element with class '.mirador-icon-disable-zoom'.
            * @param {Boolean} disableOsdZoom
            *   Whether to set this window's zoom to enabled (false) or disabled (true).
            */
            Mirador.Window.prototype.toggleZoomLock = function(linkElement, disableOsdZoom) {
                if (disableOsdZoom === true) {
                    this.eventEmitter.publish('disableOsdZoom.' + this.id);
                    $(linkElement).addClass('selected');
                } else {
                    this.eventEmitter.publish('enableOsdZoom.' + this.id);
                    $(linkElement).removeClass('selected');
                }
                this.windowZoomDisabled = !!disableOsdZoom;
            };

            /* 2. Override the constructor. */

            Mirador.Window = function() {
                var w = new constructor($.extend(true, Array.prototype.slice.call(arguments)[0], {
                    windowZoomDisabled: false
                }));

                // add button (the compiled template) to the DOM
                w.element.find('.window-manifest-navigation').prepend(_this.template());

                // add click handler for the new button
                w.element.find('.mirador-icon-disable-zoom').on('click', function(event) {
                    w.toggleZoomLock(this, !w.windowZoomDisabled);
                });

                return w;
            };
        })();

        /*
         * Mirador.BookView
         * Mirador.ImageView
         */
        (function() {
            ['BookView', 'ImageView'].forEach(function(viewType) {

                /* 0. */

                var constructor = Mirador[viewType],
                    listenForActions = Mirador[viewType].prototype.listenForActions;
            
                /* 1. */

                Mirador[viewType].prototype.listenForActions = function() {
                    var _this = this;
                    listenForActions.apply(this, arguments);

                    this.eventEmitter.subscribe('disableOsdZoom.' + this.windowId, function(event) {
                        // 1 is the multiplicative identity
                        _this.osd.zoomPerClick = 1;
                        _this.osd.zoomPerScroll = 1;
                    });
                    this.eventEmitter.subscribe('enableOsdZoom.' + this.windowId, function(event) {
                        // restore the default settings
                        _this.osd.zoomPerClick = _this.defaultWindowZoomPerClick;
                        _this.osd.zoomPerScroll = _this.defaultWindowZoomPerScroll;
                    });
                };

                /* 2. */

                Mirador[viewType] = function() {
                    return new constructor($.extend(true, Array.prototype.slice.call(arguments)[0], {
                        // TODO: read this from the OSD configuration instead of using this magic number
                        defaultWindowZoomPerClick: 1.2,
                        defaultWindowZoomPerScroll: 1.2
                    }));
                };
            });
        })();
    }
};

$(document).ready(function() {
    MiradorDisableZoom.init();
});
