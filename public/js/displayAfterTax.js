
        // Tax Calculator
        const afterTaxPrice = (val) => {
            return (val * 118) / 100;
        }


        let taxSwitch = document.querySelector("#flexSwitchCheckDefault");  // Tax Switch Toggler Element
        listingPrices = document.querySelectorAll(".listing-price");         


        // To show the actual price after taxes
        taxSwitch.addEventListener("click", () => {
            
            let taxInfo = document.querySelectorAll(".tax-info");

            let i = 0;
            let afterTaxValue = null;

            for (info of taxInfo) {
                if (info.style.display != "inline") {
                    info.style.display = "inline";
                    afterTaxValue = afterTaxPrice(allListings[i].price);
                    // console.log(afterTaxValue);
                    listingPrices[i++].innerHTML = `&#8377; <b>${afterTaxValue ? Number(afterTaxValue).toLocaleString("en-IN") : "N/A"}</b> / night`
                    
                }
                else {
                    info.style.display = "none";
                    // console.log(allListings[i].price);
                    listingPrices[i].innerHTML = `&#8377;  <b>${allListings[i].price ? Number(allListings[i].price).toLocaleString("en-IN") : "N/A"}</b> / night`;
                    i++;  // We need to post incremenet 'i' here
                    
                }
            }

        });
