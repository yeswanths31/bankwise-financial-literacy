/* =========================================
   BANKWISE LIVE MARKET SIMULATOR
   ========================================= */


const MARKET_KEY =
    "bankwise_market_simulator_3d";



/* =========================================
   COMPANY DATA
   ========================================= */


const companies = [

    {
        symbol:
            "RELIANCE",

        name:
            "Reliance Industries",

        sector:
            "Energy & Retail",

        price:
            2860

    },


    {
        symbol:
            "TCS",

        name:
            "Tata Consultancy Services",

        sector:
            "IT Services",

        price:
            4120

    },


    {
        symbol:
            "HDFCBANK",

        name:
            "HDFC Bank",

        sector:
            "Banking",

        price:
            1785

    },


    {
        symbol:
            "INFY",

        name:
            "Infosys",

        sector:
            "IT Services",

        price:
            1540

    },


    {
        symbol:
            "ICICIBANK",

        name:
            "ICICI Bank",

        sector:
            "Banking",

        price:
            1325

    },


    {
        symbol:
            "SBIN",

        name:
            "State Bank",

        sector:
            "Banking",

        price:
            820

    },


    {
        symbol:
            "AIRTEL",

        name:
            "Bharti Airtel",

        sector:
            "Telecom",

        price:
            1960

    },


    {
        symbol:
            "ITC",

        name:
            "ITC",

        sector:
            "FMCG",

        price:
            490

    },


    {
        symbol:
            "LT",

        name:
            "Larsen & Toubro",

        sector:
            "Engineering",

        price:
            3650

    },


    {
        symbol:
            "TATAMOTORS",

        name:
            "Tata Motors",

        sector:
            "Automobile",

        price:
            985

    },


    {
        symbol:
            "SUNPHARMA",

        name:
            "Sun Pharma",

        sector:
            "Pharma",

        price:
            1815

    },


    {
        symbol:
            "ADANI",

        name:
            "Adani Enterprises",

        sector:
            "Infrastructure",

        price:
            2780

    }

];



/* =========================================
   HELPERS
   ========================================= */


function marketMoney(value) {

    return "₹" +

        Number(
            value
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        );

}



/* =========================================
   INITIAL STATE
   ========================================= */


function createMarketState() {

    const prices =
        {};

    const history =
        {};


    companies.forEach(
        company => {

            prices[
                company.symbol
            ] =
                company.price;


            history[
                company.symbol
            ] =
                [
                    company.price
                ];

        }
    );


    return {

        cash:
            100000,

        holdings:
            {},

        avgCost:
            {},

        prices:
            prices,

        history:
            history

    };

}



/* =========================================
   LOAD / SAVE
   ========================================= */


function loadMarketState() {

    const saved =
        localStorage.getItem(
            MARKET_KEY
        );


    if (!saved) {

        return createMarketState();

    }


    try {

        const data =
            JSON.parse(
                saved
            );


        if (
            typeof data.cash !==
            "number" ||

            !data.prices ||

            !data.holdings ||

            !data.avgCost
        ) {

            return createMarketState();

        }


        companies.forEach(
            company => {

                if (
                    typeof data.prices[
                        company.symbol
                    ] !==
                    "number"
                ) {

                    data.prices[
                        company.symbol
                    ] =
                        company.price;

                }


                if (
                    !data.history[
                        company.symbol
                    ]
                ) {

                    data.history[
                        company.symbol
                    ] =
                        [
                            data.prices[
                                company.symbol
                            ]
                        ];

                }

            }
        );


        return data;

    }

    catch {

        return createMarketState();

    }

}



let market =
    loadMarketState();


let selectedSymbol =
    companies[0].symbol;


let marketCountdown =
    10;


let countdownTimer =
    null;


let marketTimer =
    null;



function saveMarketState() {

    localStorage.setItem(

        MARKET_KEY,

        JSON.stringify(
            market
        )

    );

}



/* =========================================
   TICKER
   ========================================= */


function renderTicker() {

    const ticker =
        document.getElementById(
            "marketTicker"
        );


    if (!ticker) {

        return;

    }


    ticker.innerHTML =
        "";


    companies
        .slice(
            0,
            8
        )
        .forEach(
            company => {

                const symbol =
                    company.symbol;


                const price =
                    market.prices[
                        symbol
                    ];


                const history =
                    market.history[
                        symbol
                    ] || [];


                const previous =

                    history.length > 1

                        ? history[
                            history.length - 2
                        ]

                        : price;


                const change =

                    previous

                        ? (
                            (
                                price -
                                previous
                            ) /
                            previous
                        ) *
                        100

                        : 0;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "ticker-item";


                item.innerHTML = `

                    <b>
                        ${symbol}
                    </b>

                    <span>
                        ${marketMoney(price)}
                    </span>

                    <em
                        class="${
                            change >= 0
                            ? "up"
                            : "down"
                        }">

                        ${
                            change >= 0
                                ? "+"
                                : ""
                        }

                        ${change.toFixed(2)}%

                    </em>

                `;


                ticker.appendChild(
                    item
                );

            }
        );

}



/* =========================================
   MARKET TABLE
   ========================================= */


function renderMarketRows() {

    const tableBody =
        document.getElementById(
            "marketRows"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML =
        "";


    companies.forEach(
        company => {

            const symbol =
                company.symbol;


            const price =
                market.prices[
                    symbol
                ];


            const history =
                market.history[
                    symbol
                ] || [];


            const previous =

                history.length > 1

                    ? history[
                        history.length - 2
                    ]

                    : price;


            const change =

                previous

                    ? (
                        (
                            price -
                            previous
                        ) /
                        previous
                    ) *
                    100

                    : 0;


            const holding =
                market.holdings[
                    symbol
                ] || 0;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="company-name">


                        <div class="company-logo">

                            ${symbol.charAt(0)}

                        </div>


                        <div>

                            <b>
                                ${company.name}
                            </b>

                            <small>
                                ${symbol}
                            </small>

                        </div>


                    </div>

                </td>


                <td>
                    ${company.sector}
                </td>


                <td>

                    <b>
                        ${marketMoney(price)}
                    </b>

                </td>


                <td class="${
                    change >= 0
                    ? "up"
                    : "down"
                }">

                    ${
                        change >= 0
                            ? "+"
                            : ""
                    }

                    ${change.toFixed(2)}%

                </td>


                <td class="holdings">

                    ${holding}

                </td>


                <td>


                    <div
                        class="trade-controls">


                        <input
                            id="qty-${symbol}"
                            type="number"
                            min="1"
                            value="1">


                        <button
                            class="mini-button"
                            onclick="buyShares('${symbol}')">

                            Buy

                        </button>


                        <button
                            class="mini-button sell"
                            onclick="sellShares('${symbol}')">

                            Sell

                        </button>


                    </div>


                </td>

            `;


            row.addEventListener(
                "click",
                event => {

                    if (
                        event.target.tagName ===
                            "BUTTON" ||

                        event.target.tagName ===
                            "INPUT"
                    ) {

                        return;

                    }


                    selectedSymbol =
                        symbol;


                    drawChart();

                }
            );


            tableBody.appendChild(
                row
            );

        }
    );

}



/* =========================================
   SUMMARY
   ========================================= */


function updateSummary() {

    const cash =
        document.getElementById(
            "cash"
        );


    const portfolioValue =
        document.getElementById(
            "portfolioValue"
        );


    const totalPL =
        document.getElementById(
            "totalPL"
        );


    if (!cash) {

        return;

    }


    cash.textContent =
        marketMoney(
            market.cash
        );


    let portfolioValueNumber =
        0;


    let profitLoss =
        0;


    Object.keys(
        market.holdings
    ).forEach(
        symbol => {

            const quantity =
                market.holdings[
                    symbol
                ] || 0;


            const price =
                market.prices[
                    symbol
                ] || 0;


            const average =
                market.avgCost[
                    symbol
                ] || 0;


            portfolioValueNumber +=
                quantity *
                price;


            profitLoss +=

                (
                    price -
                    average
                ) *
                quantity;

        }
    );


    portfolioValue.textContent =
        marketMoney(
            portfolioValueNumber
        );


    totalPL.textContent =
        marketMoney(
            profitLoss
        );


    totalPL.className =
        profitLoss >= 0
            ? "up"
            : "down";


    const updated =
        document.getElementById(
            "lastUpdated"
        );


    if (updated) {

        updated.textContent =

            "Updated " +
            new Date().toLocaleTimeString();

    }

}



/* =========================================
   PORTFOLIO
   ========================================= */


function renderPortfolio() {

    const container =
        document.getElementById(
            "portfolioList"
        );


    if (!container) {

        return;

    }


    const holdings =
        Object.entries(
            market.holdings
        )
        .filter(
            ([, quantity]) =>
                quantity > 0
        );


    if (
        holdings.length === 0
    ) {

        container.innerHTML = `

            <p class="muted">

                No holdings yet.

                Buy virtual shares
                to build your portfolio.

            </p>

        `;

        return;

    }


    container.innerHTML =
        "";


    holdings.forEach(
        ([symbol, quantity]) => {

            const company =
                companies.find(
                    company =>
                        company.symbol ===
                        symbol
                );


            const currentPrice =
                market.prices[
                    symbol
                ];


            const average =
                market.avgCost[
                    symbol
                ] || 0;


            const pl =
                (
                    currentPrice -
                    average
                ) *
                quantity;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "portfolio-item";


            item.innerHTML = `

                <div>

                    <b>

                        ${
                            company
                                ? company.name
                                : symbol
                        }

                    </b>


                    <small>

                        ${quantity}
                        shares •
                        Avg
                        ${marketMoney(average)}

                    </small>

                </div>


                <strong class="${
                    pl >= 0
                    ? "up"
                    : "down"
                }">

                    ${marketMoney(pl)}

                </strong>

            `;


            container.appendChild(
                item
            );

        }
    );

}



/* =========================================
   BUY
   ========================================= */


function buyShares(
    symbol
) {

    const input =
        document.getElementById(
            "qty-" +
            symbol
        );


    const quantity =
        input
            ? Number(
                input.value
            )
            : 0;


    if (
        !quantity ||
        quantity <= 0
    ) {

        alert(
            "Enter a valid quantity."
        );

        return;

    }


    const price =
        market.prices[
            symbol
        ];


    const cost =
        quantity *
        price;


    if (
        cost >
        market.cash
    ) {

        alert(
            "Insufficient virtual cash."
        );

        return;

    }


    const oldQuantity =
        market.holdings[
            symbol
        ] || 0;


    const oldAverage =
        market.avgCost[
            symbol
        ] || 0;


    const newQuantity =
        oldQuantity +
        quantity;


    const newAverage =

        (
            (
                oldQuantity *
                oldAverage
            ) +

            (
                quantity *
                price
            )
        ) /

        newQuantity;


    market.holdings[
        symbol
    ] =
        newQuantity;


    market.avgCost[
        symbol
    ] =
        newAverage;


    market.cash -=
        cost;


    saveMarketState();


    renderMarket();


    alert(

        `Bought
         ${quantity}
         virtual share(s)
         of
         ${symbol}.`

    );

}



/* =========================================
   SELL
   ========================================= */


function sellShares(
    symbol
) {

    const input =
        document.getElementById(
            "qty-" +
            symbol
        );


    const quantity =
        input
            ? Number(
                input.value
            )
            : 0;


    const owned =
        market.holdings[
            symbol
        ] || 0;


    if (
        !quantity ||
        quantity <= 0
    ) {

        alert(
            "Enter a valid quantity."
        );

        return;

    }


    if (
        quantity >
        owned
    ) {

        alert(
            "You do not own enough virtual shares."
        );

        return;

    }


    const price =
        market.prices[
            symbol
        ];


    market.cash +=
        quantity *
        price;


    market.holdings[
        symbol
    ] -=
        quantity;


    if (
        market.holdings[
            symbol
        ] <= 0
    ) {

        delete market.holdings[
            symbol
        ];

        delete market.avgCost[
            symbol
        ];

    }


    saveMarketState();


    renderMarket();


    alert(

        `Sold
         ${quantity}
         virtual share(s)
         of
         ${symbol}.`

    );

}



/* =========================================
   PRICE MOVEMENT
   ========================================= */


function generatePriceChanges() {

    companies.forEach(
        company => {

            const symbol =
                company.symbol;


            const current =
                market.prices[
                    symbol
                ];


            /*
                Normal movement:
                approximately a small percentage
                in either direction.
            */


            let movement =

                (
                    Math.random() -
                    0.48
                ) *
                0.026;


            /*
                Occasionally create a stronger movement
                to make the demo look more dynamic.
            */


            if (
                Math.random() <
                0.10
            ) {

                movement +=

                    (
                        Math.random() -
                        0.5
                    ) *
                    0.035;

            }


            let next =
                current *
                (
                    1 +
                    movement
                );


            next =

                Math.max(
                    10,
                    Math.round(
                        next *
                        100
                    ) /
                    100
                );


            market.prices[
                symbol
            ] =
                next;


            if (
                !market.history[
                    symbol
                ]
            ) {

                market.history[
                    symbol
                ] =
                    [];

            }


            market.history[
                symbol
            ].push(
                next
            );


            /*
                Keep only the latest 30
                observations for the chart.
            */


            if (
                market.history[
                    symbol
                ].length >
                30
            ) {

                market.history[
                    symbol
                ].shift();

            }

        }
    );


    saveMarketState();


    renderMarket();

}



/* =========================================
   DRAW CHART
   ========================================= */


function drawChart() {

    const canvas =
        document.getElementById(
            "priceChart"
        );


    if (!canvas) {

        return;

    }


    const parent =
        canvas.parentElement;


    const width =
        Math.max(
            480,
            parent.clientWidth - 30
        );


    const height =
        300;


    const ratio =
        window.devicePixelRatio ||
        1;


    canvas.width =
        width *
        ratio;


    canvas.height =
        height *
        ratio;


    canvas.style.width =
        width +
        "px";


    canvas.style.height =
        height +
        "px";


    const context =
        canvas.getContext(
            "2d"
        );


    context.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    context.clearRect(
        0,
        0,
        width,
        height
    );


    const values =

        (
            market.history[
                selectedSymbol
            ] ||

            [

                market.prices[
                    selectedSymbol
                ]

            ]

        ).slice(
            -30
        );


    if (
        !values.length
    ) {

        return;

    }


    const minimum =
        Math.min(
            ...values
        );


    const maximum =
        Math.max(
            ...values
        );


    const range =
        maximum -
        minimum ||
        1;


    /*
       GRID
    */


    context.strokeStyle =
        "#dce5f0";


    context.lineWidth =
        1;


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const y =

            20 +

            (
                height -
                50
            ) *
            (
                i /
                5
            );


        context.beginPath();


        context.moveTo(
            10,
            y
        );


        context.lineTo(
            width - 10,
            y
        );


        context.stroke();

    }


    /*
       PRICE LINE
    */


    context.strokeStyle =
        "#2563eb";


    context.lineWidth =
        3;


    context.beginPath();


    values.forEach(
        (value,index) => {

            const x =

                15 +

                index *
                (
                    (
                        width -
                        30
                    ) /

                    Math.max(
                        values.length -
                        1,
                        1
                    )
                );


            const y =

                height -
                25 -

                (
                    (
                        value -
                        minimum
                    ) /

                    range
                ) *

                (
                    height -
                    65
                );


            if (
                index ===
                0
            ) {

                context.moveTo(
                    x,
                    y
                );

            }

            else {

                context.lineTo(
                    x,
                    y
                );

            }

        }
    );


    context.stroke();


    /*
       LAST POINT
    */


    const last =
        values[
            values.length - 1
        ];


    const lastX =
        width -
        15;


    const lastY =

        height -
        25 -

        (
            (
                last -
                minimum
            ) /
            range
        ) *

        (
            height -
            65
        );


    context.fillStyle =
        "#2563eb";


    context.beginPath();


    context.arc(
        lastX,
        lastY,
        5,
        0,
        Math.PI * 2
    );


    context.fill();


    /*
       LABELS
    */


    context.fillStyle =
        "#66758a";


    context.font =
        "12px Arial";


    context.fillText(
        marketMoney(maximum),
        10,
        15
    );


    context.fillText(
        marketMoney(minimum),
        10,
        height - 5
    );


    const selected =
        document.getElementById(
            "selectedCompany"
        );


    const company =
        companies.find(
            item =>
                item.symbol ===
                selectedSymbol
        );


    if (
        selected &&
        company
    ) {

        selected.textContent =
            company.name;

    }

}



/* =========================================
   RESET
   ========================================= */


function resetMarket() {

    const confirmation =
        confirm(
            "Reset virtual trading cash and portfolio?"
        );


    if (!confirmation) {

        return;

    }


    localStorage.removeItem(
        MARKET_KEY
    );


    market =
        createMarketState();


    selectedSymbol =
        companies[
            0
        ].symbol;


    marketCountdown =
        10;


    renderMarket();

}



/* =========================================
   RENDER ALL
   ========================================= */


function renderMarket() {

    renderTicker();

    renderMarketRows();

    updateSummary();

    renderPortfolio();

    drawChart();

}



/* =========================================
   TIMER
   ========================================= */


function startMarketTimers() {

    const counter =
        document.getElementById(
            "countdown"
        );


    if (!counter) {

        return;

    }


    marketCountdown =
        10;


    counter.textContent =
        marketCountdown;


    if (countdownTimer) {

        clearInterval(
            countdownTimer
        );

    }


    if (marketTimer) {

        clearInterval(
            marketTimer
        );

    }


    /*
       Countdown runs every second.
    */


    countdownTimer =
        setInterval(
            () => {

                marketCountdown--;


                if (
                    marketCountdown <=
                    0
                ) {

                    marketCountdown =
                        10;

                }


                counter.textContent =
                    marketCountdown;

            },

            1000

        );


    /*
       Actual simulated price change
       occurs every 10 seconds.
    */


    marketTimer =
        setInterval(
            () => {

                generatePriceChanges();

                marketCountdown =
                    10;

            },

            10000

        );

}



/* =========================================
   START MARKET
   ========================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const table =
            document.getElementById(
                "marketRows"
            );


        if (!table) {

            return;

        }


        renderMarket();


        startMarketTimers();


        window.addEventListener(
            "resize",
            drawChart
        );

    }
);