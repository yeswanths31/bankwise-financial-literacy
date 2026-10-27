/* =========================================
   BANKWISE SHARED JAVASCRIPT
   ========================================= */


const BANK_KEY =
    "bankwise_virtual_bank_3d";



/* =========================================
   MONEY FORMAT
   ========================================= */


function money(value) {

    return "₹" +
        Number(value).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}



/* =========================================
   ACCESSIBILITY
   ========================================= */


function toggleAccessibility() {

    document.body.classList.toggle(
        "large-text"
    );


    localStorage.setItem(

        "bankwise_large_text",

        document.body.classList.contains(
            "large-text"
        )
            ? "1"
            : "0"

    );

}



function loadAccessibility() {

    if (
        localStorage.getItem(
            "bankwise_large_text"
        ) === "1"
    ) {

        document.body.classList.add(
            "large-text"
        );

    }

}



/* =========================================
   MOBILE MENU
   ========================================= */


function toggleMobileMenu() {

    const navigation =
        document.getElementById(
            "mainNav"
        );


    if (navigation) {

        navigation.classList.toggle(
            "open"
        );

    }

}



/* =========================================
   VIRTUAL BANK
   ========================================= */


function getBankData() {

    const saved =
        localStorage.getItem(
            BANK_KEY
        );


    if (!saved) {

        return {

            balance:
                0,

            transactions:
                []

        };

    }


    try {

        return JSON.parse(
            saved
        );

    }

    catch {

        return {

            balance:
                0,

            transactions:
                []

        };

    }

}



function saveBankData(data) {

    localStorage.setItem(

        BANK_KEY,

        JSON.stringify(
            data
        )

    );

}



function renderBank() {

    const balanceElement =
        document.getElementById(
            "bankBalance"
        );


    const table =
        document.getElementById(
            "transactions"
        );


    if (
        !balanceElement ||
        !table
    ) {

        return;

    }


    const data =
        getBankData();


    balanceElement.textContent =
        money(
            data.balance
        );


    table.innerHTML =
        "";


    if (
        data.transactions.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="4">

                    No transactions yet.
                    Make a virtual deposit to begin.

                </td>

            </tr>

        `;

        return;

    }


    data.transactions.forEach(
        transaction => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${transaction.date}
                </td>

                <td>

                    <span
                        class="
                        transaction-badge
                        ${transaction.type.toLowerCase()}
                        ">

                        ${transaction.type}

                    </span>

                </td>

                <td>

                    ${money(
                        transaction.amount
                    )}

                </td>

                <td>

                    ${money(
                        transaction.balance
                    )}

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}



function bankDeposit() {

    const input =
        document.getElementById(
            "depositInput"
        );


    if (!input) {

        return;

    }


    const amount =
        Number(
            input.value
        );


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid deposit amount."
        );

        return;

    }


    const data =
        getBankData();


    data.balance +=
        amount;


    data.transactions.unshift({

        date:
            new Date().toLocaleString(),

        type:
            "Deposit",

        amount:
            amount,

        balance:
            data.balance

    });


    saveBankData(
        data
    );


    renderBank();


    input.value =
        "";


    alert(

        money(amount) +
        " added to your virtual account."

    );

}



function bankWithdraw() {

    const input =
        document.getElementById(
            "withdrawInput"
        );


    if (!input) {

        return;

    }


    const amount =
        Number(
            input.value
        );


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid withdrawal amount."
        );

        return;

    }


    const data =
        getBankData();


    if (
        amount >
        data.balance
    ) {

        alert(
            "Insufficient virtual balance."
        );

        return;

    }


    data.balance -=
        amount;


    data.transactions.unshift({

        date:
            new Date().toLocaleString(),

        type:
            "Withdrawal",

        amount:
            amount,

        balance:
            data.balance

    });


    saveBankData(
        data
    );


    renderBank();


    input.value =
        "";


    alert(

        money(amount) +
        " withdrawn from your virtual account."

    );

}



function clearBankTransactions() {

    const confirmation =
        confirm(
            "Reset virtual account and clear all transactions?"
        );


    if (!confirmation) {

        return;

    }


    localStorage.removeItem(
        BANK_KEY
    );


    renderBank();

}



/* =========================================
   INVESTMENT CALCULATORS
   ========================================= */


function calcFD() {

    const principal =
        Number(
            document.getElementById(
                "fdPrincipal"
            ).value
        );


    const rate =
        Number(
            document.getElementById(
                "fdRate"
            ).value
        );


    const years =
        Number(
            document.getElementById(
                "fdYears"
            ).value
        );


    const result =
        document.getElementById(
            "fdResult"
        );


    if (
        !principal ||
        !rate ||
        !years
    ) {

        result.textContent =
            "Please enter all values.";

        return;

    }


    const interest =
        principal *
        rate *
        years /
        100;


    const maturity =
        principal +
        interest;


    result.innerHTML = `

        Principal:
        <b>
            ${money(principal)}
        </b>

        <br>

        Estimated Interest:
        <b>
            ${money(interest)}
        </b>

        <br>

        Estimated Maturity:
        <b>
            ${money(maturity)}
        </b>

    `;

}



function calcSaving() {

    const monthly =
        Number(
            document.getElementById(
                "saveMonthly"
            ).value
        );


    const years =
        Number(
            document.getElementById(
                "saveYears"
            ).value
        );


    const rate =
        Number(
            document.getElementById(
                "saveRate"
            ).value
        );


    const result =
        document.getElementById(
            "saveResult"
        );


    if (
        !monthly ||
        !years ||
        !rate
    ) {

        result.textContent =
            "Please enter all values.";

        return;

    }


    const contribution =
        monthly *
        12 *
        years;


    const growth =
        contribution *
        rate *
        years /
        100;


    const value =
        contribution +
        growth;


    result.innerHTML = `

        Total Contribution:
        <b>
            ${money(contribution)}
        </b>

        <br>

        Estimated Growth:
        <b>
            ${money(growth)}
        </b>

        <br>

        Estimated Value:
        <b>
            ${money(value)}
        </b>

    `;

}



/* =========================================
   STUDENT BUDGET
   ========================================= */


function calculateBudget() {

    const income =
        Number(
            document.getElementById(
                "budgetIncome"
            ).value
        );


    const needs =
        Number(
            document.getElementById(
                "budgetNeeds"
            ).value
        );


    const wants =
        Number(
            document.getElementById(
                "budgetWants"
            ).value
        );


    const savings =
        Number(
            document.getElementById(
                "budgetSavings"
            ).value
        );


    const result =
        document.getElementById(
            "budgetResult"
        );


    if (
        !income ||
        needs < 0 ||
        wants < 0 ||
        savings < 0
    ) {

        result.innerHTML = `

            <h3>
                Please enter valid numbers.
            </h3>

        `;

        return;

    }


    const total =
        needs +
        wants +
        savings;


    const remaining =
        income -
        total;


    let status;


    if (
        remaining > 0
    ) {

        status = `

            <div class="budget-positive">

                ✅

                Your plan leaves
                <b>
                    ${money(remaining)}
                </b>
                unallocated.

            </div>

        `;

    }

    else if (
        remaining === 0
    ) {

        status = `

            <div class="budget-neutral">

                ℹ️

                Your plan exactly matches
                your income.

            </div>

        `;

    }

    else {

        status = `

            <div class="budget-negative">

                ⚠️

                Your planned spending is
                <b>
                    ${money(
                        Math.abs(remaining)
                    )}
                </b>
                higher than your income.

            </div>

        `;

    }


    result.innerHTML = `

        <h3>
            Monthly Budget Analysis
        </h3>


        <div class="budget-lines">

            <div>

                <span>
                    Income
                </span>

                <b>
                    ${money(income)}
                </b>

            </div>


            <div>

                <span>
                    Needs
                </span>

                <b>
                    ${money(needs)}
                </b>

            </div>


            <div>

                <span>
                    Wants
                </span>

                <b>
                    ${money(wants)}
                </b>

            </div>


            <div>

                <span>
                    Savings Goal
                </span>

                <b>
                    ${money(savings)}
                </b>

            </div>


            <div>

                <span>
                    Planned Total
                </span>

                <b>
                    ${money(total)}
                </b>

            </div>

        </div>


        ${status}

    `;

}



/* =========================================
   QUIZ
   ========================================= */


const quizQuestions = [


{

question:
"Should you share an OTP with a caller who says they are from your bank?",

answers:
[
    "Yes",
    "No",
    "Only if they know your name",
    "Only during emergencies"
],

correct:
1

},


{

question:
"What is a savings account commonly used for?",

answers:
[
    "Keeping money and making transactions",
    "Printing money",
    "Creating currency",
    "Building ATMs"
],

correct:
0

},


{

question:
"What does FD usually stand for?",

answers:
[
    "Fast Deposit",
    "Fixed Deposit",
    "Financial Data",
    "Fund Division"
],

correct:
1

},


{

question:
"What should you verify before approving a UPI payment request?",

answers:
[
    "Recipient and amount",
    "Phone wallpaper",
    "Battery percentage",
    "Weather"
],

correct:
0

},


{

question:
"What should you do with a suspicious banking link?",

answers:
[
    "Open it immediately",
    "Share it",
    "Avoid it and verify independently",
    "Enter your PIN"
],

correct:
2

},


{

question:
"Which information should remain confidential?",

answers:
[
    "Bank PIN",
    "Bank branch name",
    "Currency name",
    "Bank logo"
],

correct:
0

},


{

question:
"Why is budgeting useful?",

answers:
[
    "It helps plan income, spending and saving",
    "It prints money",
    "It guarantees profit",
    "It replaces a bank"
],

correct:
0

},


{

question:
"What is virtual money in BankWise used for?",

answers:
[
    "Real purchases",
    "Educational practice",
    "Paying taxes",
    "Buying real shares"
],

correct:
1

},


{

question:
"Why should you understand risk before investing?",

answers:
[
    "Different investments can have different levels of risk",
    "Risk can always be removed",
    "All investments are guaranteed",
    "It makes a PIN stronger"
],

correct:
0

},


{

question:
"Where should you get help for an unexpected banking problem?",

answers:
[
    "A random caller",
    "Unknown social media account",
    "An official bank/provider channel",
    "A forwarded message"
],

correct:
2

}

];


let quizIndex =
    0;


let quizScore =
    0;


let quizLocked =
    false;



function startQuiz() {

    const questionElement =
        document.getElementById(
            "quizQuestion"
        );


    if (!questionElement) {

        return;

    }


    quizIndex =
        0;


    quizScore =
        0;


    quizLocked =
        false;


    const start =
        document.getElementById(
            "quizStart"
        );


    if (start) {

        start.textContent =
            "Restart Quiz";

    }


    loadQuizQuestion();

}



function loadQuizQuestion() {

    const item =
        quizQuestions[
            quizIndex
        ];


    const question =
        document.getElementById(
            "quizQuestion"
        );


    const answers =
        document.getElementById(
            "quizAnswers"
        );


    const progress =
        document.getElementById(
            "quizProgress"
        );


    const points =
        document.getElementById(
            "quizPoints"
        );


    const bar =
        document.getElementById(
            "quizBar"
        );


    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    if (
        !question ||
        !answers
    ) {

        return;

    }


    question.textContent =
        item.question;


    if (progress) {

        progress.textContent =

            `Question
             ${quizIndex + 1}
             of
             ${quizQuestions.length}`;

    }


    if (points) {

        points.textContent =

            `Score: ${quizScore}`;

    }


    if (bar) {

        bar.style.width =

            `${
                (
                    quizIndex /
                    quizQuestions.length
                ) *
                100
            }%`;

    }


    if (feedback) {

        feedback.textContent =
            "";

    }


    answers.innerHTML =
        "";


    item.answers.forEach(
        (answer,index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "quiz-answer";


            button.textContent =
                answer;


            button.onclick =
                () => chooseQuizAnswer(
                    index
                );


            answers.appendChild(
                button
            );

        }
    );

}



function chooseQuizAnswer(
    selected
) {

    if (quizLocked) {

        return;

    }


    quizLocked =
        true;


    const item =
        quizQuestions[
            quizIndex
        ];


    const buttons =
        document.querySelectorAll(
            ".quiz-answer"
        );


    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;

        }
    );


    if (
        selected ===
        item.correct
    ) {

        quizScore++;


        buttons[
            selected
        ].classList.add(
            "correct"
        );


        if (feedback) {

            feedback.textContent =
                "✅ Correct!";

            feedback.className =
                "quiz-feedback correct-text";

        }

    }

    else {

        buttons[
            selected
        ].classList.add(
            "wrong"
        );


        buttons[
            item.correct
        ].classList.add(
            "correct"
        );


        if (feedback) {

            feedback.textContent =
                "❌ Not quite.";

            feedback.className =
                "quiz-feedback wrong-text";

        }

    }


    const points =
        document.getElementById(
            "quizPoints"
        );


    if (points) {

        points.textContent =
            `Score: ${quizScore}`;

    }


    setTimeout(
        () => {

            quizIndex++;


            if (
                quizIndex >=
                quizQuestions.length
            ) {

                finishQuiz();

                return;

            }


            quizLocked =
                false;


            loadQuizQuestion();

        },

        900

    );

}



function finishQuiz() {

    const question =
        document.getElementById(
            "quizQuestion"
        );


    const answers =
        document.getElementById(
            "quizAnswers"
        );


    const progress =
        document.getElementById(
            "quizProgress"
        );


    const points =
        document.getElementById(
            "quizPoints"
        );


    const bar =
        document.getElementById(
            "quizBar"
        );


    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    if (question) {

        question.innerHTML =

            `🎉 Quiz Completed
            <br>
            <small>
                You scored
                ${quizScore}
                out of
                ${quizQuestions.length}
            </small>`;

    }


    if (answers) {

        answers.innerHTML =
            "";

    }


    if (progress) {

        progress.textContent =
            "Finished";

    }


    if (points) {

        points.textContent =

            `Final Score:
             ${quizScore}/${quizQuestions.length}`;

    }


    if (bar) {

        bar.style.width =
            "100%";

    }


    if (feedback) {

        if (
            quizScore >= 8
        ) {

            feedback.textContent =
                "Excellent financial awareness!";

        }

        else if (
            quizScore >= 5
        ) {

            feedback.textContent =
                "Good start. Keep learning.";

        }

        else {

            feedback.textContent =
                "Keep practising BankWise modules.";

        }

    }

}



/* =========================================
   ELDERLY READ ALOUD
   ========================================= */


function speakElderlyGuide() {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Speech synthesis is not supported in this browser."
        );

        return;

    }


    const text = `

        BankWise elderly guide.

        Keep money safely through appropriate
        formal banking channels.

        Never share OTP, PIN or password.

        Verify every payment request.

        Avoid unknown links.

        When in doubt, contact the bank
        through an official channel.

    `;


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.rate =
        0.9;


    window.speechSynthesis.speak(
        speech
    );

}



/* =========================================
   ANIMATIONS
   ========================================= */


function initReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                        }

                    }
                );

            },

            {
                threshold:
                    0.08
            }

        );


    elements.forEach(
        element =>
            observer.observe(
                element
            )
    );

}



/* =========================================
   PAGE SCROLL PROGRESS
   ========================================= */


function initPageProgress() {

    const bar =
        document.getElementById(
            "pageProgress"
        );


    if (!bar) {

        return;

    }


    window.addEventListener(
        "scroll",
        () => {

            const top =
                window.scrollY;


            const height =

                document.documentElement
                    .scrollHeight -

                document.documentElement
                    .clientHeight;


            const percent =
                height > 0

                    ? (
                        top /
                        height
                    ) *
                    100

                    : 0;


            bar.style.width =
                `${percent}%`;

        }
    );

}



/* =========================================
   INITIALIZATION
   ========================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAccessibility();

        initReveal();

        initPageProgress();

        renderBank();

    }
);