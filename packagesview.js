/*
    LiveG APT Repository

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/liveg-apt
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";
import Fuse from "./lib/fuse.esm.js";

import * as packageData from "./packagedata.js";

const ADD_APT_REPO_CODE = `\
$ curl -s --compressed https://opensource.liveg.tech/liveg-apt/KEY.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/liveg-apt.gpg > /dev/null
$ sudo curl -s --compressed https://opensource.liveg.tech/liveg-apt/liveg-apt.list -o /etc/apt/sources.list.d/liveg-apt.list
$ sudo apt update\
`;

export var PackagesViewScreen = astronaut.component("PackagesViewScreen", function(props, children) {
    // TODO: Add package searching implementation
   
    var searchInput = Input({type: "search", placeholder: _("searchForPackage_inputPlaceholder")}) ();
    var packageList = Container() ();

    var allPackages = [];
    var displayedPackages = [];
    var searcher = null;

    function listDisplayedPackages() {
        packageList.clear().add(
            ...displayedPackages.map((data) => Card (
                Heading(1) (
                    CodeSnippet() (data.Package)
                ),
                Paragraph() (data.Description.length > 200 ? data.Description.substring(0, 200) + "…" : data.Description)
            ))
        );
    }

    searchInput.on("input", function() {
        if (searchInput.getValue().trim() == "") {
            displayedPackages = allPackages;

            listDisplayedPackages();

            return;
        }

        if (searcher == null) {
            return;
        }

        var results = searcher.search(searchInput.getValue());

        displayedPackages = results.map(function(result) {
            return result.item;
        });

        if (displayedPackages.length > 0) {
            listDisplayedPackages();
        } else {
            var searchDebianAptButton = Button() (_("searchForPackage_noResults_searchDebianApt"));

            searchDebianAptButton.on("click", function() {
                window.open(`https://packages.debian.org/search?keywords=${encodeURIComponent(searchInput.getValue())}`);
            });

            packageList.clear().add(
                Message (
                    Icon("search", "dark embedded") (),
                    Heading(3) (_("searchForPackage_noResults_title")),
                    Paragraph() (_("searchForPackage_noResults_description")),
                    ButtonRow (
                        searchDebianAptButton
                    )
                )
            );
        }
    });

    packageData.load().then(function(packages) {
        searcher = new Fuse(packages, {
            keys: ["Package", "Description"]
        });

        allPackages = packages;
        displayedPackages = packages;

        listDisplayedPackages();
    });

    return Screen(true) (
        Header (
            Text(_("livegAptRepo"))
        ),
        Page(true) (
            Section (
                Heading({level: 1, attributes: {"aui-justify": "middle"}}) (
                    BrandWordmark(_("livegAptRepo")) (
                        Text(_("intro_title"))
                    )
                ),
                Paragraph() (_("intro_description")),
                Accordion({open: false, mode: "boxed"}) (
                    Text(_("addAptRepo_title")),
                    Paragraph() (_("addAptRepo_description1")),
                    CodeBlock() (ADD_APT_REPO_CODE),
                    Paragraph() ().setHTML(_("addAptRepo_description2"))
                )
            ),
            Section (
                Heading(2) (_("searchForPackage_title")),
                searchInput,
                packageList
            )
        )
    );
});