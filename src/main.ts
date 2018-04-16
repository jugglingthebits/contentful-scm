import * as yargs from 'yargs';
import { registerCommands } from './commands';

export async function main() {
    const env = yargs.env();
    registerCommands(env);
    env.version(false)
        .demandCommand()
        .parse();
}
