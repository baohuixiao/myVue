export default class Dep {
    constructor() {
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    depend() {
        if (window.target) {
            addSub(window.target);
        }
    }

    removeSub(sub) {
        remove(this.subs, sub);
    }

    notify() {
        const subs = this.subs.slice();
        for (let i = 0; i < subs.length; i += 1) {
            subs[i].update();
        }
    }
}

function remove(list, item) {
    if (list.length) {
        const index = list.indexOf(item);
        if (index > -1) {
            return list.splice(index, 1);
        }
    }
}