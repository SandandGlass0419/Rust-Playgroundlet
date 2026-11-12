// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function click(selector) {
    selector.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        detail: 1   // using .click() will set detail: 0, need detail: 1 for opening files. detail: 2 tries to modify name.
    }));
}

async function createAndOpen(path) {
    const target = Array.from(document.querySelectorAll("button.rjTaZj.qSySGN"))
        .find((elem) => elem.title === path);

    if (target) {
        click(target);
        return;
    }

    click(document.querySelector("div.Ikomm4 button[title='Create file']"));

    const input = await waitForElm("form.lPsvX3 input[name='pathname']");
    input.value = path;

    click(document.querySelector("form.lPsvX3 button[title='Create new file']"));
}

function dateModName() {
    return `_${new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date()).replace(/[. ]/g, "")}`;
}

let mod = dateModName();
let path = `src/${mod}.rs`;

await createAndOpen(path);
await createAndOpen("src/lib.rs");
window.rustPlayground.setCode(`pub mod ${mod};`);
await createAndOpen(path);