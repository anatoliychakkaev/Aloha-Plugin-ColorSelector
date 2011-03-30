/**
 * Text Color Plugin
 */
GENTICS.Aloha.ColorSelector = new GENTICS.Aloha.Plugin('com.gentics.aloha.plugins.ColorSelector');

/**
 * Configure the available languages
 */
GENTICS.Aloha.ColorSelector.languages = ['en', 'ru'];

/**
 * Configure the available colors
 */
GENTICS.Aloha.ColorSelector.config = {
  colors: [
    'black', 'dimgray', 'gray', 'darkgray', 'lightgray', 'white',
    'red', 'green', 'blue', 'yellowgreen', 'cadetblue', 'coral'
  ]
};

/**
 * Initialize the plugin and set initialize flag on true
 */
GENTICS.Aloha.ColorSelector.init = function () {

    var that = this,
    style = jQuery('<style>' +
    '.GENTICS_button_text_color {background: url("/javascripts/aloha/deps/extjs/resources/images/default/editor/tb-sprite.gif") repeat scroll -160px 0 transparent !important}' +
    '.GENTICS_button_text_background {background: url("/javascripts/aloha/deps/extjs/resources/images/default/editor/tb-sprite.gif") repeat scroll -176px 0 transparent !important}' +
    '</style>');

    jQuery.each(GENTICS.Aloha.ColorSelector.config.colors, function(index, value){
        style.append('button.GENTICS_button_'+ value +' { background: '+ value +' !important; border: 0; float: left; margin: 3px; width: 16px; height: 16px;} ');
    });

    style.appendTo('head');

    // // add it to the floating menu
    // GENTICS.Aloha.FloatingMenu.addButton(
    //   'GENTICS.Aloha.continuoustext',
    //   button,
    //   GENTICS.Aloha.i18n(GENTICS.Aloha, 'floatingmenu.tab.format'),
    //   1
    // );

    // jQuery.each(GENTICS.Aloha.ColorSelector.config.colors, function(index, value){
    //     GENTICS.Aloha.FloatingMenu.addButton(
    //         "GENTICS.Aloha.continuoustext",
    //         buttons[value],
    //         that.i18n("floatingmenu.tab.color"),
    //         1
    //     );
    // });
    var layer = new Layer();

    GENTICS.Aloha.FloatingMenu.addButton(
        "GENTICS.Aloha.continuoustext",
        new GENTICS.Aloha.ui.Button({
            "iconClass": "GENTICS_button_text_color",
            "size": "small",
            "onclick": function (button) {
                layer.display(button.el.dom, 'color');
            }
        }),
        that.i18n("floatingmenu.tab.format"),
        1
    );

    GENTICS.Aloha.FloatingMenu.addButton(
        "GENTICS.Aloha.continuoustext",
        new GENTICS.Aloha.ui.Button({
            "iconClass": "GENTICS_button_text_background",
            "size": "small",
            "onclick": function (button) {
                layer.display(button.el.dom, 'background-color');
            }
        }),
        that.i18n("floatingmenu.tab.format"),
        1
    );
    function Layer () {
    }

    Layer.prototype.display = function (target, style) {
        if (this.visible) return;
        var that = this;
        this.target = jQuery(target);
        var offset = this.target.offset();
        this.el = jQuery('<div style="padding: 4px; position: absolute; background: #ddd; z-index: 11001"></div>');
        this.el.css('top', offset.top + this.target.height());
        this.el.css('left', offset.left);
        this.populateColors(style);
        this.el.width(132);
        this.el.height(60);
        this.el.show();
        jQuery('body').append(this.el).bind('click', function(e) {
            if (that.visible) {
                that.hide();
            }
        });
        this.editable = GENTICS.Aloha.activeEditable;
        setTimeout(function () {
            that.visible = true;
        }, 10);
    };

    Layer.prototype.populateColors = function (style) {
        var that = this;
        jQuery(GENTICS.Aloha.ColorSelector.config.colors).each(function (index, value) {
            var b = jQuery('<button class="GENTICS_button_'+ value +'"></button>');
            b.bind('mousedown', function () {
                if (that.editable) {
                    that.editable.obj[0].focus();
                }
                applyFormat(style, value);
                that.hide();
                return false;
            });

            that.el.append(b);
        });
    };

    Layer.prototype.hide = function () {
        this.el.remove();
        this.visible = false;
        jQuery('body').unbind('click');
    };

    function applyFormat (style, value) {
        var markupClassName = 'GENTICS_markup_' + [style.replace('-', '_'), value].join('_');

        var markup = jQuery('<span class="' + markupClassName + '" style="' + style + ':' + value + '"></span>');
        var rangeObject = GENTICS.Aloha.Selection.rangeObject;

        // check whether the markup is found in the range (at the start of the range)
        var foundMarkup = rangeObject.findMarkup(function() {
            return this.nodeName.toLowerCase() == markup.get(0).nodeName.toLowerCase() && this.className === markupClassName;
        }, GENTICS.Aloha.activeEditable.obj);

        if (foundMarkup) {
            // remove the markup
            if (rangeObject.isCollapsed()) {
                // when the range is collapsed, we remove exactly the one DOM element
                GENTICS.Utils.Dom.removeFromDOM(foundMarkup, rangeObject, true);
            } else {
                // the range is not collapsed, so we remove the markup from the range
                GENTICS.Utils.Dom.removeMarkup(rangeObject, markup, GENTICS.Aloha.activeEditable.obj);
            }
        } else {
            // when the range is collapsed, extend it to a word
            if (rangeObject.isCollapsed()) {
                GENTICS.Utils.Dom.extendToWord(rangeObject);
            }

            // add the markup
            GENTICS.Utils.Dom.addMarkup(rangeObject, markup);
        }
        // select the modified range
        rangeObject.select();
    }

    function markupClassName (style, value) {
    }

};
