openerp.pos_password_protected = function (instance) {
    var _t = instance.web._t;
    var QWeb = instance.web.qweb;
    var module = instance.point_of_sale;
    quantity_pwd_set = false;
    backspace_pwd_set = false;
    
    instance.point_of_sale.ReceiptScreenWidget = instance.point_of_sale.ReceiptScreenWidget.extend({
        close: function(){
            this._super();
            backspace_pwd_set = this.pos.config.is_password_backspace;
        }
    });
    
    instance.point_of_sale.NumpadState = instance.point_of_sale.NumpadState.extend({
        reset: function() {
            if (quantity_pwd_set) {
                this.set({
                    buffer: "0",
                    mode: "abc"
                });
            }
            else {
                this.set({
                    buffer: "0",
                    mode: "quantity"
                });
            }
        },
        deleteLastChar: function() {
            if(this.get('buffer') === ""){
                if(this.get('mode') === 'abc'){
                    this.set({ 'mode': 'quantity' });
                    this.trigger('set_value','remove');
                    this.set({ 'mode': 'abc' });
                }
                else if(this.get('mode') === 'quantity'){
                    this.trigger('set_value','remove');
                }else{
                    this.trigger('set_value',this.get('buffer'));
                }
            }else{
                var newBuffer = this.get('buffer').slice(0,-1) || "";
                this.set({ buffer: newBuffer });
                this.trigger('set_value',this.get('buffer'));
            }
        },
    });
    
    instance.point_of_sale.NumpadWidget = instance.point_of_sale.NumpadWidget.extend({
        init: function() {
            this._super.apply(this, arguments);
            quantity_pwd_set = this.pos.config.is_password_quantity
        },
        
        start: function() {
            this.state.bind('change:mode', this.changedMode, this);
            this.changedMode();
            backspace_pwd_set = this.pos.config.is_password_backspace;
            this.$el.find('.numpad-backspace').click(_.bind(this.clickDeleteLastChar, this));
            this.$el.find('.numpad-minus').click(_.bind(this.clickSwitchSign, this));
            this.$el.find('.number-char').click(_.bind(this.clickAppendNewChar, this));
            this.$el.find('.mode-button').click(_.bind(this.clickChangeMode, this));
        },
        clickDeleteLastChar: function() {
//            var is_password_backspace = this.pos.config.is_password_backspace;
//            backspace_pwd_set = is_password_backspace;
            if (backspace_pwd_set) {
                var self = this;
                var password_backspace = this.pos.config.password_backspace;
                var currentOrder = this.pos.get('selectedOrder');
                
                if(currentOrder.get('orderLines').models.length === 0){
                    this.pos_widget.screen_selector.show_popup('error',{
                        'message': _t('Empty Order'),
                        'comment': _t('There must be at least one product in your order.'),
                    });
                    return;
                }
                
                dialog = new instance.web.Dialog(this, {
                    title: _t("Enter Password"),
                    size: 'small',
                    buttons: [
                        {
                            text: _t("Authenticate"), click: function(){
                                var inp_val = dialog.$el.find("input#password_on_button").val();
                                if (inp_val == password_backspace) {
                                    backspace_pwd_set = false;
                                    this.parents('.modal').modal('hide');
                                    return self.state.deleteLastChar();
                                }
                                else {
                                    self.pos_widget.screen_selector.show_popup('error',{
                                        message: _t('Invalid Password'),
                                    });
                                    dialog.$el.find("input#password_on_button").focus();
                                }
                            }
                        },
                        {
                            text: _t("Cancel"), click: function() { 
                                this.parents('.modal').modal('hide');
                            }
                        }]
                }).open();
                dialog.$el.html(QWeb.render("password-on-button-order-view", this));
    //            dialog.$el.style.cssText = "opacity:0";
                dialog.$el.find("input#password_on_button").focus();
            }
            else {
                return this.state.deleteLastChar();
            }
        },
        
        clickChangeMode: function(event) {
            var is_password_quantity = this.pos.config.is_password_quantity;
            var is_password_price = this.pos.config.is_password_price;
            var is_password_discount = this.pos.config.is_password_discount;
            
            var newMode = event.currentTarget.attributes['data-mode'].nodeValue;
            
            if(is_password_quantity && newMode == 'quantity'){
                var password_quantity = this.pos.config.password_quantity;
                this.check_authenticity(newMode, password_quantity);
                return;
            }
            if(is_password_price && newMode == 'price'){
                var password_price = this.pos.config.password_price;
                this.check_authenticity(newMode, password_price);
                return;
            }
            if(is_password_discount && newMode == 'discount'){
                var password_discount = this.pos.config.password_discount;
                this.check_authenticity(newMode, password_discount);
                return;
            }
            return this.state.changeMode(newMode);
        },
        
        check_authenticity:function(mode, password){
//            alert("inside check_price_password")
            var self = this;
            var currentOrder = this.pos.get('selectedOrder');
            if(currentOrder.get('orderLines').models.length === 0){
                this.pos_widget.screen_selector.show_popup('error',{
                    'message': _t('Empty Order'),
                    'comment': _t('There must be at least one product in your order.'),
                });
                return;
            }
            
//            var pwdAuth = $(QWeb.render('PasswordAuthentication',{
//                widget: { password: password },
//            }));
//            pwdAuth.appendTo(this.$el);
            dialog = new instance.web.Dialog(this, {
                title: _t("Enter Password"),
                size: 'small',
                buttons: [
                    {
                        text: _t("Authenticate"), click: function(){
                            var inp_val = dialog.$el.find("input#password_on_button").val();
                            if (inp_val == password) {
                                this.parents('.modal').modal('hide');
                                self.updateChangeMode(mode);

                            }
                            else {
                                self.pos_widget.screen_selector.show_popup('error',{
                                    message: _t('Invalid Password'),
                                });
                                dialog.$el.find("input#password_on_button").focus();
                            }
                        }
                    },
                    {
                        text: _t("Cancel"), click: function() { 
                            this.parents('.modal').modal('hide');
                        }
                    }]
            }).open();
            dialog.$el.html(QWeb.render("password-on-button-order-view", this));
//            dialog.$el.style.cssText = "opacity:0";
            dialog.$el.find("input#password_on_button").focus();
        },
        
        updateChangeMode: function(mode) {
            return this.state.changeMode(mode);
        },
    });
    
};