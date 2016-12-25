from openerp.osv import fields, osv

class pos_config(osv.osv):
    _inherit = "pos.config"
    
    _columns = {
        'is_password_quantity': fields.boolean('Quantity'),
        'password_quantity': fields.char('Password'),
        'is_password_price': fields.boolean('Price'),
        'password_price': fields.char('Password'),
        'is_password_discount': fields.boolean('Discount'),
        'password_discount': fields.char('Password'),
        'is_password_backspace': fields.boolean('Backspace'),
        'password_backspace': fields.char('Password'),
    }
pos_config()