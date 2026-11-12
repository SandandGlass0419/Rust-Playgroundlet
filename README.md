# Rust-Playgroundlet
[rust playground](https://play.rust-lang.org) bookmarklet automation
## Quick Start
Create a new bookmark, and copy/paste [`bookmarklet.js`](bookmarklet.js) as the URL.  
[How to make a bookmarklet?](https://gist.github.com/caseywatts/c0cec1f89ccdb8b469b1)

## What does it do?
The bookmarklet will help you play (in the playground) in a cleaner way, by adding a file every day and modifying lib.rs to only include that date's test. The precise process is like so:

1. check if today's file exists, if not create a new one. (`_YYMMDD.rs`)
2. check if `src/lib.rs` exists, if not create it.
3. overwrite `src/lib.rs` with `pub mod _YYMMDD;`(today's module).
4. open today's file. (so you can go right in to playing)

## How do i make my own playground bookmarklet?
The only thing close to an api the playground exposes is `window.setCode(code: string)` so in order to automate without breaking stuff you need to interact with the DOM. Here are some examples on doing simple actions.

* Clicking an element:
```js
function click(selector) {
    selector.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        detail: 1   // using .click() will set detail: 0, need detail: 1 for opening files. detail: 2 tries to modify name.
    }));
}
```
you **need** to use `.dispatchEvent()` especially on clicking file/dir buttons in the tree

* Creating a file:
```js
async function create(path) {
    click(document.querySelector("div.Ikomm4 button[title='Create file']"));
    const input = await waitForElm("form.lPsvX3 input[name='pathname']");
    input.value = path;
    click(document.querySelector("form.lPsvX3 button[title='Create new file']"));
}
```
the `waitForElm()` is from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists. we need it since the form doesn't load right after running `click()`.

* Opening a file:
```js
function open(path) {
    const target = Array.from(document.querySelectorAll("button.rjTaZj.qSySGN"))    // class name for file buttons
        .find((elem) => elem.title === path);

    if (target) click(target);
}
```

* Writing to a file:
```js
  function write(path, code) {
      open(path);    // see previous example
      window.rustPlayground.setCode(code);
  }
```
this will replace the whole content to `code`.
