define(function(require,exports,module){
    var $ = require("jquery");

    (function( $, undefined ) {
        var uuid = 0,
            runiqueId = /^ui-id-\d+$/;

        // $.ui might exist from components with no dependencies, e.g., $.ui.position
        $.ui = $.ui || {};

        $.extend( $.ui, {
            version: "1.10.4",

            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        });

        // plugins
        $.fn.extend({
            focus: (function( orig ) {
                return function( delay, fn ) {
                    return typeof delay === "number" ?
                        this.each(function() {
                            var elem = this;
                            setTimeout(function() {
                                $( elem ).focus();
                                if ( fn ) {
                                    fn.call( elem );
                                }
                            }, delay );
                        }) :
                        orig.apply( this, arguments );
                };
            })( $.fn.focus ),

            scrollParent: function() {
                var scrollParent;
                if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
                    scrollParent = this.parents().filter(function() {
                        return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
                    }).eq(0);
                } else {
                    scrollParent = this.parents().filter(function() {
                        return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
                    }).eq(0);
                }

                return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
            },

            zIndex: function( zIndex ) {
                if ( zIndex !== undefined ) {
                    return this.css( "zIndex", zIndex );
                }

                if ( this.length ) {
                    var elem = $( this[ 0 ] ), position, value;
                    while ( elem.length && elem[ 0 ] !== document ) {
                        // Ignore z-index if position is set to a value where z-index is ignored by the browser
                        // This makes behavior of this function consistent across browsers
                        // WebKit always returns auto if the element is positioned
                        position = elem.css( "position" );
                        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                            // IE returns 0 when zIndex is not specified
                            // other browsers return a string
                            // we ignore the case of nested elements with an explicit value of 0
                            // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                            value = parseInt( elem.css( "zIndex" ), 10 );
                            if ( !isNaN( value ) && value !== 0 ) {
                                return value;
                            }
                        }
                        elem = elem.parent();
                    }
                }

                return 0;
            },

            uniqueId: function() {
                return this.each(function() {
                    if ( !this.id ) {
                        this.id = "ui-id-" + (++uuid);
                    }
                });
            },

            removeUniqueId: function() {
                return this.each(function() {
                    if ( runiqueId.test( this.id ) ) {
                        $( this ).removeAttr( "id" );
                    }
                });
            }
        });

        // selectors
        function focusable( element, isTabIndexNotNaN ) {
            var map, mapName, img,
                nodeName = element.nodeName.toLowerCase();
            if ( "area" === nodeName ) {
                map = element.parentNode;
                mapName = map.name;
                if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                    return false;
                }
                img = $( "img[usemap=#" + mapName + "]" )[0];
                return !!img && visible( img );
            }
            return ( /input|select|textarea|button|object/.test( nodeName ) ?
                !element.disabled :
                "a" === nodeName ?
                    element.href || isTabIndexNotNaN :
                    isTabIndexNotNaN) &&
                // the element and all of its ancestors must be visible
                visible( element );
        }

        function visible( element ) {
            return $.expr.filters.visible( element ) &&
                !$( element ).parents().addBack().filter(function() {
                    return $.css( this, "visibility" ) === "hidden";
                }).length;
        }

        $.extend( $.expr[ ":" ], {
            data: $.expr.createPseudo ?
                $.expr.createPseudo(function( dataName ) {
                    return function( elem ) {
                        return !!$.data( elem, dataName );
                    };
                }) :
                // support: jQuery <1.8
                function( elem, i, match ) {
                    return !!$.data( elem, match[ 3 ] );
                },

            focusable: function( element ) {
                return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
            },

            tabbable: function( element ) {
                var tabIndex = $.attr( element, "tabindex" ),
                    isTabIndexNaN = isNaN( tabIndex );
                return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
            }
        });

        // support: jQuery <1.8
        if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
            $.each( [ "Width", "Height" ], function( i, name ) {
                var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
                    type = name.toLowerCase(),
                    orig = {
                        innerWidth: $.fn.innerWidth,
                        innerHeight: $.fn.innerHeight,
                        outerWidth: $.fn.outerWidth,
                        outerHeight: $.fn.outerHeight
                    };

                function reduce( elem, size, border, margin ) {
                    $.each( side, function() {
                        size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
                        if ( border ) {
                            size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
                        }
                        if ( margin ) {
                            size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
                        }
                    });
                    return size;
                }

                $.fn[ "inner" + name ] = function( size ) {
                    if ( size === undefined ) {
                        return orig[ "inner" + name ].call( this );
                    }

                    return this.each(function() {
                        $( this ).css( type, reduce( this, size ) + "px" );
                    });
                };

                $.fn[ "outer" + name] = function( size, margin ) {
                    if ( typeof size !== "number" ) {
                        return orig[ "outer" + name ].call( this, size );
                    }

                    return this.each(function() {
                        $( this).css( type, reduce( this, size, true, margin ) + "px" );
                    });
                };
            });
        }

        // support: jQuery <1.8
        if ( !$.fn.addBack ) {
            $.fn.addBack = function( selector ) {
                return this.add( selector == null ?
                    this.prevObject : this.prevObject.filter( selector )
                );
            };
        }

        // support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
        if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
            $.fn.removeData = (function( removeData ) {
                return function( key ) {
                    if ( arguments.length ) {
                        return removeData.call( this, $.camelCase( key ) );
                    } else {
                        return removeData.call( this );
                    }
                };
            })( $.fn.removeData );
        }





        // deprecated
        $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

        $.support.selectstart = "onselectstart" in document.createElement( "div" );
        $.fn.extend({
            disableSelection: function() {
                return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
                    ".ui-disableSelection", function( event ) {
                        event.preventDefault();
                    });
            },

            enableSelection: function() {
                return this.unbind( ".ui-disableSelection" );
            }
        });

        $.extend( $.ui, {
            // $.ui.plugin is deprecated. Use $.widget() extensions instead.
            plugin: {
                add: function( module, option, set ) {
                    var i,
                        proto = $.ui[ module ].prototype;
                    for ( i in set ) {
                        proto.plugins[ i ] = proto.plugins[ i ] || [];
                        proto.plugins[ i ].push( [ option, set[ i ] ] );
                    }
                },
                call: function( instance, name, args ) {
                    var i,
                        set = instance.plugins[ name ];
                    if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
                        return;
                    }

                    for ( i = 0; i < set.length; i++ ) {
                        if ( instance.options[ set[ i ][ 0 ] ] ) {
                            set[ i ][ 1 ].apply( instance.element, args );
                        }
                    }
                }
            },

            // only used by resizable
            hasScroll: function( el, a ) {

                //If overflow is hidden, the element might have extra content, but the user wants to hide it
                if ( $( el ).css( "overflow" ) === "hidden") {
                    return false;
                }

                var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
                    has = false;

                if ( el[ scroll ] > 0 ) {
                    return true;
                }

                // TODO: determine which cases actually cause this to happen
                // if the element doesn't have the scroll set, see if it's possible to
                // set the scroll
                el[ scroll ] = 1;
                has = ( el[ scroll ] > 0 );
                el[ scroll ] = 0;
                return has;
            }
        });
    })( jQuery );
    
    (function( $, undefined ) {
        var mouseHandled = false;
        $( document ).mouseup( function() {
            mouseHandled = false;
        });

        $.widget("ui.mouse", {
            version: "1.10.4",
            options: {
                cancel: "input,textarea,button,select,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function() {
                var that = this;

                this.element
                    .bind("mousedown."+this.widgetName, function(event) {
                        return that._mouseDown(event);
                    })
                    .bind("click."+this.widgetName, function(event) {
                        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                            $.removeData(event.target, that.widgetName + ".preventClickEvent");
                            event.stopImmediatePropagation();
                            return false;
                        }
                    });

                this.started = false;
            },

            // TODO: make sure destroying one instance of mouse doesn't mess with
            // other instances of mouse
            _mouseDestroy: function() {
                this.element.unbind("."+this.widgetName);
                if ( this._mouseMoveDelegate ) {
                    $(document)
                        .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                        .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
                }
            },

            _mouseDown: function(event) {
                // don't let more than one widget handle mouseStart
                if( mouseHandled ) { return; }

                // we may have missed mouseup (out of window)
                (this._mouseStarted && this._mouseUp(event));

                this._mouseDownEvent = event;

                var that = this,
                    btnIsLeft = (event.which === 1),
                    // event.target.nodeName works around a bug in IE 8 with
                    // disabled inputs (#7620)
                    elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
                if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                    return true;
                }

                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) {
                    this._mouseDelayTimer = setTimeout(function() {
                        that.mouseDelayMet = true;
                    }, this.options.delay);
                }

                if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                    this._mouseStarted = (this._mouseStart(event) !== false);
                    if (!this._mouseStarted) {
                        event.preventDefault();
                        return true;
                    }
                }

                // Click event may never have fired (Gecko & Opera)
                if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                    $.removeData(event.target, this.widgetName + ".preventClickEvent");
                }

                // these delegates are required to keep context
                this._mouseMoveDelegate = function(event) {
                    return that._mouseMove(event);
                };
                this._mouseUpDelegate = function(event) {
                    return that._mouseUp(event);
                };
                $(document)
                    .bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                    .bind("mouseup."+this.widgetName, this._mouseUpDelegate);

                event.preventDefault();

                mouseHandled = true;
                return true;
            },

            _mouseMove: function(event) {
                // IE mouseup check - mouseup happened when mouse was out of window
                if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
                    return this._mouseUp(event);
                }

                if (this._mouseStarted) {
                    this._mouseDrag(event);
                    return event.preventDefault();
                }

                if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                    this._mouseStarted =
                        (this._mouseStart(this._mouseDownEvent, event) !== false);
                    (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
                }

                return !this._mouseStarted;
            },

            _mouseUp: function(event) {
                $(document)
                    .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                    .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

                if (this._mouseStarted) {
                    this._mouseStarted = false;

                    if (event.target === this._mouseDownEvent.target) {
                        $.data(event.target, this.widgetName + ".preventClickEvent", true);
                    }

                    this._mouseStop(event);
                }

                return false;
            },

            _mouseDistanceMet: function(event) {
                return (Math.max(
                        Math.abs(this._mouseDownEvent.pageX - event.pageX),
                        Math.abs(this._mouseDownEvent.pageY - event.pageY)
                    ) >= this.options.distance
                );
            },

            _mouseDelayMet: function(/* event */) {
                return this.mouseDelayMet;
            },

            // These are placeholder methods, to be overriden by extending plugin
            _mouseStart: function(/* event */) {},
            _mouseDrag: function(/* event */) {},
            _mouseStop: function(/* event */) {},
            _mouseCapture: function(/* event */) { return true; }
        });
    })(jQuery);
});