NOTE: This is a copy of [Multiple Project Summary Reporting Standard](http://confluence.public.thoughtworks.org/display/CI/Multiple+Project+Summary+Reporting+Standard) which I include here because that wiki often seems to be down.

### Introduction

Various Continuous Integration monitoring / reporting tools exist. Examples are:

* [CruiseControl.NET's CCTray](http://confluence.public.thoughtworks.org/display/CCNET/CCTray)
* [CruiseControl Firefox Plugin](http://www.md.pp.ru/mozilla/cc/)
* [CCMenu for Mac](http://sourceforge.net/projects/ccmenu/)

These tools work by polling Continuous Integration servers for summary information and presenting it appropriately to users.

If a Continuous Integration server can offer a standard summary format, and a reporting tool can consume the same, then we get interoperability between reporting tools and CI Servers.

### Description

Summary information will be available as a plain XML string retrievable through an http GET request.

The format of the XML will be as follows:

#### Summary

A single <Projects> node, the document root, which contains 0 or many <Project> node.

Each <Project> may have the following attributes:

<table>

	<tbody>

        <tr>

            <th> name </th>

            <th> description </th>

            <th> type </th>

            <th> required </th>

        </tr>

        <tr>

            <td> name </td>

            <td> The name of the project </td>

            <td> string </td>

            <td> yes </td>

        </tr>

        <tr>

            <td> activity </td>

            <td> The current state of the project </td>

            <td> string enum : Sleeping, Building, CheckingModifications <br clear="all" /> </td>

            <td> yes </td>
        </tr>

        <tr>

            <td> lastBuildStatus </td>

            <td> A brief description of the last build </td>

            <td> string enum : Success, Failure, Exception, Unknown </td>

            <td> yes </td>

        </tr>

        <tr>

            <td> lastBuildLabel </td>

            <td> A referential name for the last build </td>

            <td> string </td>

            <td> no </td>

        </tr>

        <tr>

            <td> lastBuildTime </td>

            <td> When the last build occurred </td>

            <td> DateTime </td>

            <td> yes </td>

        </tr>

        <tr>

            <td> nextBuildTime </td>

            <td> When the next build is scheduled to occur (or when the next check to see whether a build should be performed is scheduled to occur) </td>

            <td> DateTime </td>

            <td> no </td>

        </tr>

        <tr>

            <td> webUrl </td>

            <td> A URL for where more detail can be found about this project </td>

            <td> string (URL) </td>

            <td> yes </td>

        </tr>

    </tbody>

</table>

Clients that consume this XML should not rely on any optional attribute being present, and should degrade their functionality gracefully.

### Example

    <Projects>
        <Project
            name="SvnTest"
            activity="Sleeping"
            lastBuildStatus="Exception"
            lastBuildLabel="8"
            lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
            nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
            webUrl="http://mrtickle/ccnet/"/>

        <Project
            name="HelloWorld"
            activity="Sleeping"
            lastBuildStatus="Success"
            lastBuildLabel="13"
            lastBuildTime="2005-09-15T17:33:07.6447696+01:00"
            nextBuildTime="2005-10-04T14:31:51.7799600+01:00"
            webUrl="http://mrtickle/ccnet/"/>
    </Projects>

### Schema

    <?xml version="1.0" encoding="UTF-8" ?>
    <xs:schema elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="Projects">
    <xs:complexType>
    <xs:sequence>
    <xs:element name="Project" maxOccurs="unbounded">
    <xs:complexType>
    <xs:attribute name="name" type="xs:NMTOKEN" use="required" />
    <xs:attribute name="activity" use="required">
    <xs:simpleType>
    <xs:restriction base="xs:NMTOKEN">
    <xs:enumeration value="Sleeping" />
    <xs:enumeration value="Building" />
    <xs:enumeration value="CheckingModifications" />
    </xs:restriction>
    </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="lastBuildStatus" use="required">
    <xs:simpleType>
    <xs:restriction base="xs:NMTOKEN">
    <xs:enumeration value="Exception" />
    <xs:enumeration value="Success" />
    <xs:enumeration value="Failure" />
    <xs:enumeration value="Unknown" />
    </xs:restriction>
    </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="lastBuildLabel" type="xs:NMTOKEN" use="required" />
    <xs:attribute name="lastBuildTime" type="xs:dateTime" use="required" />
    <xs:attribute name="nextBuildTime" type="xs:dateTime" use="optional" />
    <xs:attribute name="webUrl" type="xs:string" use="required" />
    </xs:complexType>
    </xs:element>
    </xs:sequence>
    </xs:complexType>
    </xs:element>
    </xs:schema>
