/**
 * The following function is adapted from https://github.com/psalaets/vue-sfc-descriptor-to-string/blob/master/index.js
 */
/**
 * The MIT License (MIT)
 * Copyright (c) 2018 Paul Salaets
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
export function stringify(sfcDescriptor) {
    const { template, script, scriptSetup, styles, customBlocks } = sfcDescriptor;
    return ([template, script, scriptSetup, ...styles, ...customBlocks]
        // discard blocks that don't exist
        .filter((block) => block != null)
        // sort blocks by source position
        .sort((a, b) => a.loc.start.offset - b.loc.start.offset)
        // figure out exact source positions of blocks
        .map((block) => {
        const openTag = makeOpenTag(block);
        const closeTag = makeCloseTag(block);
        return Object.assign({}, block, {
            openTag,
            closeTag,
            startOfOpenTag: block.loc.start.offset - openTag.length,
            endOfOpenTag: block.loc.start.offset,
            startOfCloseTag: block.loc.end.offset,
            endOfCloseTag: block.loc.end.offset + closeTag.length,
        });
    })
        // generate sfc source
        .reduce((sfcCode, block, index, array) => {
        const first = index === 0;
        let newlinesBefore = 0;
        if (first) {
            newlinesBefore = block.startOfOpenTag;
        }
        else {
            const prevBlock = array[index - 1];
            newlinesBefore = block.startOfOpenTag - prevBlock.endOfCloseTag;
        }
        return (sfcCode +
            '\n'.repeat(newlinesBefore) +
            block.openTag +
            block.content +
            block.closeTag);
    }, ''));
}
const scriptPriority = ['setup', 'lang', 'generic'];
const sortWithPriority = (priorityArr) => (a, b) => {
    const priorityA = priorityArr.indexOf(a);
    const priorityB = priorityArr.indexOf(b);
    if (priorityA === -1 && priorityB === -1) {
        return a.localeCompare(b);
    }
    else if (priorityA === -1) {
        return 1;
    }
    else if (priorityB === -1) {
        return -1;
    }
    else {
        return priorityA - priorityB;
    }
};
function makeOpenTag(block) {
    let source = '<' + block.type;
    source += Object.keys(block.attrs)
        .sort(sortWithPriority(scriptPriority))
        .map((name) => {
        const value = block.attrs[name];
        if (value === true) {
            return name;
        }
        else {
            return `${name}="${value}"`;
        }
    })
        .map((attr) => ' ' + attr)
        .join('');
    return source + '>';
}
function makeCloseTag(block) {
    return `</${block.type}>\n`;
}
