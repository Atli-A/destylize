class ConversionTest {
    constructor(original_text, correct_text) {
        this.original = original_text;
        this.correct = correct_text;
        this.paragraph = document.createElement("p");
        this.text_node = document.createTextNode(this.original);
        this.paragraph.appendChild(this.text_node);
    }

    describe() {
        return "Conversion test '" + this.original + "'";
    }

    get_content() {
        return this.paragraph;
    }

    // returns true if the test passes, or false if it doesn't
    check_if_passed() {
        const passed = this.text_node.textContent === this.correct;
        if (!passed) {
            console.error(this.describe() + " failed! ('" + this.text_node.textContent + "' != '" + this.correct + "')");
        }
        return passed;
    }
};

class InputAreaUnchangedTest {
    constructor() {
        this.text = "🅸🅽🅿🆄🆃 🅰🆁🅴🅰";
        this.input_area = document.createElement("INPUT");
        this.input_area.setAttribute("type", "text");
        this.input_area.value = this.text;
    }

    describe() {
        return "Input area unchanged test";
    }

    get_content() {
        return this.input_area;
    }

    // returns true if the test passes, or false if it doesn't
    check_if_passed() {
        const passed = this.input_area.value === this.text;
        if (!passed) {
            console.error(this.describe() + " failed!");
        }
        return passed;
    }
};

class TextAreaUnchangedTest {
    constructor() {
        this.text = "🅸🅽🅿🆄🆃 🅰🆁🅴🅰";
        this.text_area = document.createElement("TEXTAREA"); ;
        this.text_area.value = this.text;
    }

    describe() {
        return "Text area unchanged test";
    }

    get_content() {
        return this.text_area;
    }

    // returns true if the test passes, or false if it doesn't
    check_if_passed() {
        const passed = this.text_area.value === this.text;
        if (!passed) {
            console.error(this.describe() + " failed!");
        }
        return passed;
    }
};

class HTMLTextAreaUnchangedTest {
    constructor() {
        this.correct = "🆃🅴🆇🆃 🅰🆁🅴🅰";
        this.node = null
    }

    describe() {
        return "HTML text area unchanged test";
    }

    get_content() {
        this.node = document.getElementById('test-text-area');
        this.node.remove();
        return this.node;
    }

    // returns true if the test passes, or false if it doesn't
    check_if_passed() {
        const passed = this.node.value === this.correct;
        if (!passed) {
            console.error(this.describe() + " failed!");
        }
        return passed;
    }
};

class TestManager {
    constructor(test) {
        this.test = test;
        this.added_to_doc = false;
    }

    add_to_doc(table) {
        if (this.added_to_doc) {
            console.warn(this.test.describe() + " added to document multiple times");
        }
        const content = this.test.get_content();
        this.row = table.insertRow(-1);
        this.status_cell = this.row.insertCell(-1);
        this.content_cell = this.row.insertCell(-1);
        this.content_cell.appendChild(content);
        this.status_cell.innerHTML = "⏱";
        this.added_to_doc = true;
    }

    check_if_passed() {
        if (!this.added_to_doc) {
            console.error(this.test.describe() + " not added to document");
            return false
        }
        const passed = this.test.check_if_passed();
        if (passed) {
            this.status_cell.innerHTML = "✅";
        }
        else {
            this.status_cell.innerHTML = "❌";
        }
        return passed;
    }
}

class Stats {
    constructor(node) {
        this.node = node;
        this.passed = 0;
        this.count = 0;
        this.node.textContent = "Loading…";
    }

    add_test(passed) {
        this.count++;
        if (passed) {
            this.passed++;
        }
    }

    update() {
        let percent = 0;
        if (this.count > 0) {
            percent = Math.round((this.passed / this.count) * 100);
        }
        let str = "Passed " + this.passed.toString() + "/" + this.count.toString() + " (" + percent.toString() + "%)";
        this.node.textContent = str;
        if (this.count == this.passed) {
            this.node.style.color = "green";
        }
        else
        {
            this.node.style.color = "red";
        }
    }
}

const tests = [
    new ConversionTest("No change to normal A$CII text!", "No change to normal A$CII text!"),
    new ConversionTest("🆂🆀🆄🅰🆁🅴 🅱🅾🆇🅴🆂", "SQUARE BOXES"),
    new ConversionTest("𝑾𝒉𝒚 do ʸᵒᵘ 𝓱𝓪𝓽𝓮  🅰🅴🆂🆃🅷🅴🆃🅸🅲🆂", "Why do You hate  AESTHETICS"),
        // source: https://mobile.twitter.com/FakeUnicode/status/1192622398580805632
    new InputAreaUnchangedTest(),
    new TextAreaUnchangedTest(),
    new HTMLTextAreaUnchangedTest(),
];

const managers = tests.map(test => new TestManager(test));

let stats;

function init() {
    stats_node = document.getElementById("test-stats");
    stats = new Stats(stats_node);
    test_table = document.getElementById("all-tests");
    for (const manager of managers) {
        manager.add_to_doc(test_table);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function(){
    init();
    console.log("Waiting for destylize to run…");
    sleep(1000).then(() => {
        for (const manager of managers) {
            stats.add_test(manager.check_if_passed());
        }
        stats.update();
        console.log("…done");
    });
};
