import util from 'util';

const _sep = '===============================================================================';
const _line = '-------------------------------------------------------------------------------';
const _field = '                    ';
const _arrow = '----->  ';
const _tab = '        ';

export function separator() {
    console.log(_sep);

}

export const sep = separator;

export function line() {
    console.log(_line);
}

export function title(title: string) {
    let out = `--- ${title} `;
    out += _line.substr(out.length);
    console.log(out);
}

export function field(key: string, value: string | number, indent: boolean = false) {
    if (indent)
        console.log(_tab + key + _field.substr(key.length) + ' : ' + value);
    else
        console.log(key + _field.substr(key.length) + ' : ' + value);
}

export function subfield(key: string, value: string | number, indent: boolean = false) {
    if (indent)
        console.log(_tab + '- ' + key + _field.substr(key.length + 2) + ' : ' + value);
    else
        console.log('- ' + key + _field.substr(key.length + 2) + ' : ' + value);
}

export function li(msg: string, indent: boolean = false) {
    if (indent) console.log(_tab + '* ' + msg);
    else console.log('* ' + msg);
}

export function arrow(msg: string) {
    console.log(_arrow + msg);
}

export function indent(msg: string) {
    console.log(_tab + msg);
};

export function quoteblock(msg: string, indent: boolean = false) {
    msg.split(/\n/).forEach(m => {
        if (indent) console.log('        | ' + m);
        else console.log('| ' + m);
    });
}

export function dump(data: any, name: string) {
    if (name) console.log(name + ' :', util.inspect(data, false, null, true));
    else console.log(util.inspect(data, false, null, true));
}

export function msg(msg: string, indent: boolean = false) {
    if (indent) console.log(_tab + msg);
    else console.log(msg);
}