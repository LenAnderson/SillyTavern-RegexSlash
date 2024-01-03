import { sendSystemMessage } from '../../../../script.js';
import { executeSlashCommands, registerSlashCommand } from '../../../slash-commands.js';

const makeRegex = (value)=>{
    value = value.replace(/\\\{/g, '{');
    value = value.replace(/\\\}/g, '}');
    return new RegExp(
        value
            .replace(/^\/(.+)\/([a-z]*)$/, '$1')
            .replace('\\|', '|'),
        value
            .replace(/^\/(.+)\/([a-z]*)$/, '$2'),
    );
};
const test = (args, value)=>{
    try {
        const re = makeRegex(args.find);
        return re.test(value);
    } catch (ex) {
        toastr.error(ex.message);
    }
};
const replace = async(args, value)=>{
    try {
        const re = makeRegex(args.find);
        if (args.cmd) {
            const cmds = [];
            value.replace(re, (...matches)=>{
                const cmd = args.cmd.replace(/\$(\d+)/g, (_, idx)=>matches[idx]);
                cmds.push(cmd);
                return matches[0];
            });
            const replacements = [];
            for (const cmd of cmds) {
                replacements.push((await executeSlashCommands(cmd)).pipe);
            }
            return value.replace(re, ()=>replacements.shift());
        }
        return value.replace(re, args.replace);
    } catch (ex) {
        toastr.error(ex.message);
    }
};


const showHelp = ()=>{
    sendSystemMessage('generic', `
        <h3>/re-test</h3>
        <div>Test if a text matches a regular expression.</div>
        <div>Simple test:</div>
        <pre><code>/re-test find=/dog/i The quick brown fox jumps over the lazy dog. | /echo</code></pre>
        <div>Pipes need to be escaped:</div>
        <pre><code>/re-test find=/dog\\|cat/i The quick brown fox jumps over the lazy dog. | /echo</code></pre>
        <hr>

        <h3>/re-replace</h3>
        <div>Find and replace with regular expressions.</div>
        <div>Simple find-replace:</div>
        <pre><code>/re-replace find=/dog/i replace=cat The quick brown fox jumps over the lazy dog. | /echo</code></pre>
        <div>Use <code>$1</code>, <code>$2</code>, ... to reference capturing groups:</div>
        <pre><code>/re-replace find="/(\\w+)\\b dog/i" replace="$1 cat" The quick brown fox jumps over the lazy dog. | /echo</code></pre>
        <div>Replace matching parts with the result of other slash commands:</div>
        <pre><code>/re-replace find="/(fox\\|dog)/ig" cmd="/input replace $1 with:" The quick brown fox jumps over the lazy dog. | /echo</code></pre>
    `);
};


registerSlashCommand('re-test', (args, value)=>test(args, value), [], '<span class="monospace">find=/regex/flags (text)</span> – test if text matches a regular expression', true, true);
registerSlashCommand('re-replace', (args, value)=>replace(args, value), [], '<span class="monospace">find=/regex/flags replace=replaceText cmd=replaceSlashCommand (text)</span> – replace text with regular expressions', true, true);
registerSlashCommand('re-?', (args, value)=>showHelp(), [], ' – show help for regular expressions slash commands', true, true);
