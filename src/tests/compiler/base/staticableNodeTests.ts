﻿import {expect} from "chai";
import {StaticableNode, ClassDeclaration} from "./../../../compiler";
import {getInfoFromText} from "./../testHelpers";

describe(nameof(StaticableNode), () => {
    const {sourceFile: mainSourceFile} = getInfoFromText("class MyClass { static prop: string; prop2: string; }");
    const classDec = mainSourceFile.getClasses()[0];
    const staticProp = classDec.getStaticProperties()[0];
    const instanceProp = classDec.getInstanceProperties()[0];

    describe(nameof<StaticableNode>(n => n.isStatic), () => {
        it("should be static when static", () => {
            expect(staticProp.isStatic()).to.be.true;
        });

        it("should not be static when not static", () => {
            expect(instanceProp.isStatic()).to.be.false;
        });
    });

    describe(nameof<StaticableNode>(n => n.getStaticKeyword), () => {
        it("should have a static keyword when static", () => {
            expect(staticProp.getStaticKeyword()!.getText()).to.equal("static");
        });

        it("should not have a static keyword when not static", () => {
            expect(instanceProp.getStaticKeyword()).to.be.undefined;
        });
    });

    describe(nameof<StaticableNode>(n => n.setIsStatic), () => {
        it("should set as static when not static", () => {
            const {firstChild, sourceFile} = getInfoFromText<ClassDeclaration>("class MyClass { prop: string; }");
            firstChild.getInstanceProperties()[0].setIsStatic(true);
            expect(sourceFile.getText()).to.equal("class MyClass { static prop: string; }");
        });

        it("should set as not static when static", () => {
            const {firstChild, sourceFile} = getInfoFromText<ClassDeclaration>("class MyClass { static prop: string; }");
            firstChild.getStaticProperties()[0].setIsStatic(false);
            expect(sourceFile.getText()).to.equal("class MyClass { prop: string; }");
        });
    });
});