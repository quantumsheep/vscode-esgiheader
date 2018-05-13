import * as assert from 'assert';
import * as esgiheader from '../extension';

suite("ESGI Header Tests", () => {
    test("isSupported()", () => {
        assert.equal(true, esgiheader.isSupported('c'));
        assert.equal(false, esgiheader.isSupported('anotherlanguage'));
    });

    test("setFieldValue()", () => {
        assert.equal(`
***************************************************************************************************************
*                                                                                                             *
*                                                               :::::::::: ::::::::   :::::::: :::::::::::    *
*    $FILENAME___________________________________              :+:       :+:    :+: :+:    :+:    :+:         *
*                                                             +:+       +:+        +:+           +:+          *
*    By: QuantumSheep                                        +#++:++#  +#++:++#++ :#:           +#+           *
*                                                           +#+              +#+ +#+   +#+#    +#+            *
*    Created: $CREATEDAT_________ by $CREATEDBY__          #+#       #+#    #+# #+#    #+#    #+#             *
*    Updated: $UPDATEDAT_________ by $UPDATEDBY__         ########## ########   ######## ###########          *
*                                                                                                             *
***************************************************************************************************************

`.substring(1), esgiheader.setFieldValue(esgiheader.template, "AUTHOR", "QuantumSheep"));
    });
});