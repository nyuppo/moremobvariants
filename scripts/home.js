import variantsjson from "../json/all_variants.json" assert { type: 'json' };

var variantsclone;
var variants_blacklist;
var settings, default_settings;

init();

function init() {
    variantsclone = structuredClone(variantsjson);
    variants_blacklist = {
        cat: [],
        chicken: [],
        cow: [],
        pig: [],
        sheep: [],
        wolf: [],
        zombie: []
    };
    default_settings = {
        enable_muddy_pigs: true,
        wolf_breeding_chance: 5
    };
    settings = structuredClone(default_settings);

    generateCategories();
    handleDownload();
}

function generateCategories() {
    for (let mob in variantsjson) {
        let category = document.createElement("div");
        category.id = mob;
        category.classList.add("category");
        if (mob != "settings") {
            category.classList.add("open");
        } else {
            category.classList.add("settings");
        }

        category.onclick = function(event) {
            if (category.classList.contains("open")) {
                category.classList.remove("open");
            } else {
                category.classList.add("open");
            }
        }

        let categoryName = document.createElement("h4");
        categoryName.innerText = mob;
        category.appendChild(categoryName);

        let categoryArrowContainer = document.createElement("i");
        categoryArrowContainer.classList.add("arrow-container");
        let categoryArrow = document.createElement("i");
        categoryArrow.classList.add("arrow");
        categoryArrowContainer.appendChild(categoryArrow);
        categoryName.appendChild(categoryArrowContainer);

        let variants = document.createElement("div");
        variants.classList.add("variants");

        Object.entries(variantsjson[mob]).forEach(([variant, weight]) => {
            if (mob === "settings") {
                let variantName = variant.replace(/_/g, ' ');
                let variantEntry = document.createElement("div");
                variantEntry.id = variant;
                variantEntry.classList.add("variant");

                let nameText = document.createElement("p");
                nameText.classList.add("name");
                nameText.innerText = variantName;
                variantEntry.appendChild(nameText);

                let imgContainer = document.createElement("div");
                imgContainer.classList.add("img-container");
                let img = document.createElement("img");
                img.src = "assets/images/settings/" + variant + ".png";
                imgContainer.appendChild(img);
                variantEntry.appendChild(imgContainer);

                let variantAttributeContainer = document.createElement("div");
                variantAttributeContainer.classList.add("variant-attribute-container");

                let enabledContainer = document.createElement("div");
                enabledContainer.classList.add("variant-attribute");
                enabledContainer.classList.add("enabled-container");

                var enabledInput = document.createElement("input");
                enabledInput.type = "checkbox";
                enabledInput.id = mob + "_" + variant + "_checkbox";
                enabledInput.checked = true;
                enabledInput.classList.add("enabled-input");

                if (weight > 0) {
                    let weightContainer = document.createElement("div");
                    weightContainer.classList.add("variant-attribute");
                    weightContainer.classList.add("weight-container");
                    weightContainer.onclick = function(event) {
                        event.stopPropagation();
                    }
    
                    var weightText = document.createElement("input");
                    weightText.type = "number";
                    weightText.min = 0;
                    weightText.max = 10;
                    weightText.step = 1;
                    weightText.value = weight;
                    weightText.classList.add("weight");
                    weightText.classList.add("chance");
                    weightText.id = mob + "_" + variant + "_weight";
                    weightText.addEventListener("change", (event) => {
                        settings[variant] = weightText.value;
                    });
    
                    let weightLabel = document.createElement("label");
                    weightLabel.classList.add("chance-label");
                    weightLabel.innerText = "Chance: ";
                    weightLabel.setAttribute("for", weightText.id);
                    weightContainer.appendChild(weightLabel);
                    weightContainer.appendChild(weightText);
                    variantAttributeContainer.appendChild(weightContainer);

                    variantEntry.onclick = function(event) {
                        event.stopPropagation();
                    }
                } else {
                    let enabledLabel = document.createElement("label");
                    enabledLabel.setAttribute("for", enabledInput.id);
                    enabledLabel.innerText = "Enabled: ";
                    enabledContainer.appendChild(enabledLabel);
                    enabledContainer.appendChild(enabledInput);
                    variantAttributeContainer.appendChild(enabledContainer);

                    variantEntry.onclick = function(event) {
                        event.stopPropagation();
        
                        if (variant != "default") {
                            if (enabledInput.checked) {
                                enabledInput.checked = false;
                                variantEntry.classList.add("disabled");
                            } else {
                                enabledInput.checked = true;
                                variantEntry.classList.remove("disabled");
                            }

                            settings[variant] = enabledInput.checked;
                        }
                    }
                }
    
                variantEntry.appendChild(variantAttributeContainer);

                variants.appendChild(variantEntry);

                return;
            }

            let variantName = variant.replace(/_/g, ' ');

            let variantEntry = document.createElement("div");
            variantEntry.id = variant;
            variantEntry.classList.add("variant");

            let nameText = document.createElement("p");
            nameText.classList.add("name");
            nameText.innerText = variantName;
            variantEntry.appendChild(nameText);

            let imgContainer = document.createElement("div");
            imgContainer.classList.add("img-container");
            let img = document.createElement("img");
            img.src = "assets/images/variants/" + mob + "_" + variant + ".png";
            imgContainer.appendChild(img);
            variantEntry.appendChild(imgContainer);

            let variantAttributeContainer = document.createElement("div");
            variantAttributeContainer.classList.add("variant-attribute-container");

            let enabledContainer = document.createElement("div");
            enabledContainer.classList.add("variant-attribute");
            enabledContainer.classList.add("enabled-container");

            var enabledInput = document.createElement("input");
            enabledInput.type = "checkbox";
            enabledInput.id = mob + "_" + variant + "_checkbox";
            enabledInput.checked = true;
            enabledInput.classList.add("enabled-input");

            let enabledLabel = document.createElement("label");
            enabledLabel.setAttribute("for", enabledInput.id);
            enabledLabel.innerText = "Enabled: ";
            enabledContainer.appendChild(enabledLabel);
            enabledContainer.appendChild(enabledInput);
            variantAttributeContainer.appendChild(enabledContainer);

            if (weight > 0) {
                let weightContainer = document.createElement("div");
                weightContainer.classList.add("variant-attribute");
                weightContainer.classList.add("weight-container");
                weightContainer.onclick = function(event) {
                    event.stopPropagation();
                }

                var weightText = document.createElement("input");
                weightText.type = "number";
                weightText.min = 1;
                weightText.max = 100;
                weightText.value = weight;
                weightText.classList.add("weight");
                weightText.id = mob + "_" + variant + "_weight";
                weightText.addEventListener("change", (event) => {
                    variantsclone[mob][variant] = parseInt(event.currentTarget.value);

                    if (!isDefault(mob)) {
                        category.classList.add("modified");
                    } else {
                        category.classList.remove("modified");
                    }
                });

                let weightLabel = document.createElement("label");
                weightLabel.innerText = "Weight: ";
                weightLabel.setAttribute("for", weightText.id);
                weightContainer.appendChild(weightLabel);
                weightContainer.appendChild(weightText);
                variantAttributeContainer.appendChild(weightContainer);
            } else if (mob != "cat") {
                variantEntry.classList.add("no-weight");
            }

            variantEntry.appendChild(variantAttributeContainer);

            variantEntry.onclick = function(event) {
                event.stopPropagation();

                if (enabledInput.checked) {
                    enabledInput.checked = false;
                    variantEntry.classList.add("disabled");
                    variants_blacklist[mob].push(variant);
                } else {
                    enabledInput.checked = true;
                    variantEntry.classList.remove("disabled");
                    variants_blacklist[mob].pop(variant);
                }

                if (!isDefault(mob)) {
                    category.classList.add("modified");
                } else {
                    category.classList.remove("modified");
                }
            }

            variants.appendChild(variantEntry);
        });

        category.appendChild(variants);
        document.getElementById("categories").appendChild(category);
    }
}

function handleDownload() {
    var downloadButton = document.getElementById("downloadbutton");
    downloadButton.addEventListener("click", (event) => {
        var zip = new JSZip();
        
        var weights;
        let weights_files = ["chicken", "cow", "pig", "sheep", "wolf", "zombie"];
        weights_files.forEach(function(mob) {
            if (shallowEqual(variantsclone[mob], variantsjson[mob])) {
                return;
            }

            weights = "{\n    \"weights\": {";
            Object.entries(variantsclone[mob]).forEach(([variant, weight]) => {
                if (weight < 0 || variants_blacklist[mob].includes(variant)) {
                    return;
                }
                weights += "\n        \"" + variant + "\": " + weight + ", "
            });
            weights = weights.substring(0, weights.length - 2);
            weights += "\n    }\n}";

            zip.file("data/moremobvariants/weights/" + mob + ".json", weights);
        });

        var blacklists;
        let blacklist_files = ["cat", "chicken", "cow", "pig", "sheep", "wolf", "zombie"];
        blacklist_files.forEach(function(mob) {
            if (variants_blacklist[mob].length === 0) {
                return;
            }

            blacklists = "{\n    \"blacklist\": [";
            variants_blacklist[mob].forEach(function(variant) {
                blacklists += "\"" + variant + "\",";
            });
            blacklists = blacklists.substring(0, blacklists.length - 1);
            blacklists += "]\n}";

            zip.file("data/moremobvariants/blacklist/" + mob + ".json", blacklists);
        });

        var settings_string;
        if (!shallowEqual(settings, default_settings)) {
            settings_string = "{";
            Object.entries(settings).forEach(([setting, value]) => {
                if (settings[setting] != default_settings[setting]) {
                    settings_string += "\n    \"" + setting + "\": " + value + ",";
                }
            });
            settings_string = settings_string.substring(0, blacklists.length - 1);
            settings_string += "\n}";

            zip.file("data/moremobvariants/settings/settings.json", settings_string);
        }

        var packname = document.getElementById("pack-name");
        if (packname.value.length === 0) {
            packname.focus();
        } else {
            var packauthor = document.getElementById("pack-author");
            if (packauthor.value.length === 0) {
                zip.file("pack.mcmeta", "{\n    \"pack\": {\n        \"pack_format\": 12,\n        \"description\": \"MoreMobVariants - " + packname.value + "\"\n    }\n}");
            } else {
                zip.file("pack.mcmeta", "{\n    \"pack\": {\n        \"pack_format\": 12,\n        \"description\": \"MoreMobVariants - " + packname.value + " by " + packauthor.value + "\"\n    }\n}");
            }


            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, "MMV_" + packname.value + ".zip");
            });
        }
    });
}

function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
}

function isDefault(category) {
    return (variants_blacklist[category].length === 0 && shallowEqual(variantsjson[category], variantsclone[category]));
}