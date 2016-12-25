# -*- coding: utf-8 -*-
{
    'name': "POS Quantity, Price & Discount button Password Protected",

    'summary': """
    """,

    'description': """
Password Protection
===================
This module can be used to restrict changes to price, quantity and discount on POS lines.

Featues:
--------
    * POS configuration screen have checkbox to set password on price, quantity and discount buttons
    * Different password can be set for each of the buttons
    """,

    'author': "Aasim Ahmed Ansari",
    'website': "http://aasimania.wordpress.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/openerp/addons/base/module/module_data.xml
    # for the full list
    'category': 'Point Of Sale',
    'version': '1.0',

    # any module necessary for this one to work correctly
    'depends': ['point_of_sale'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/point_of_sale.xml',
        'point_of_sale_view.xml',
    ],
    # only loaded in demonstration mode
    'qweb': ['static/src/xml/pos_custom.xml'],
    'price': 0.00,
    'currency': 'EUR',
}